import { Router, Request, Response } from 'express';
import { createOtpSession, verifyOtpCode, rollbackOtpSession, normalizeEmail } from '../services/otp';
import { sendOtpEmail, isEmailConfigured } from '../services/email';
import { env } from '../config/env';

const router = Router();

/**
 * POST /api/payment/send-otp
 * Generates secure 6-digit OTP, stores hashed token, and sends via email
 */
router.post('/payment/send-otp', async (req: Request, res: Response) => {
  const { email, mobile } = req.body;

  if (!email || typeof email !== 'string') {
    res.status(400).json({ success: false, error: 'A valid email address is required.' });
    return;
  }

  const normalized = normalizeEmail(email);
  const clientIp = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || 'unknown';

  let otp = '';
  let expiresAt = 0;
  let cooldownSeconds = 60;

  try {
    const session = createOtpSession(normalized, clientIp);
    otp = session.otp;
    expiresAt = session.expiresAt;
    cooldownSeconds = session.cooldownSeconds;
  } catch (err: any) {
    res.status(429).json({ success: false, error: err.message || 'Rate limit exceeded' });
    return;
  }

  // Attempt to dispatch real email
  try {
    await sendOtpEmail({
      to: normalized,
      otp,
      expiryMinutes: 5,
    });

    console.log(`[Email OTP] ✉️ OTP successfully dispatched to ${normalized}`);

    res.json({
      success: true,
      message: `Verification code sent to ${normalized}`,
      email: normalized,
      expiresInSeconds: 300,
      cooldownSeconds,
    });
  } catch (err: any) {
    const errorMsg = err?.message || 'Failed to dispatch email';
    console.error(`[Email OTP] ❌ Send error for ${normalized}:`, errorMsg);

    // If SMTP is not yet configured and in development mode, keep session so developer can test
    if (!isEmailConfigured()) {
      if (env.NODE_ENV === 'development') {
        res.json({
          success: true,
          message: 'Development mode: SMTP credentials not set, using dev OTP for local verification.',
          email: normalized,
          expiresInSeconds: 300,
          cooldownSeconds,
          devOtp: otp,
          configured: false,
        });
        return;
      }

      rollbackOtpSession(normalized);
      res.status(503).json({
        success: false,
        error: 'Email service is not configured. Please add SMTP_USER and SMTP_PASS (Gmail App Password) to server/.env.',
        configured: false,
      });
      return;
    }

    // Rollback session so user is not stuck waiting out the rate limit on email failure
    rollbackOtpSession(normalized);

    res.status(500).json({
      success: false,
      error: errorMsg,
    });
  }
});

/**
 * POST /api/payment/verify-otp
 * Verifies the 6-digit code using secure cryptographic timing-safe comparison
 */
router.post('/payment/verify-otp', (req: Request, res: Response) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    res.status(400).json({ success: false, error: 'Email and 6-digit verification code are required' });
    return;
  }

  const result = verifyOtpCode(email, otp);

  if (!result.valid) {
    res.status(400).json({
      success: false,
      error: result.error || 'Invalid verification code',
    });
    return;
  }

  console.log(`[Email OTP] ✅ Successfully verified email: ${normalizeEmail(email)}`);

  res.json({
    success: true,
    verified: true,
    message: 'Email verified successfully!',
  });
});

/**
 * GET /api/payment/email-status
 * Healthcheck for email delivery service
 */
router.get('/payment/email-status', (_req: Request, res: Response) => {
  res.json({
    configured: isEmailConfigured(),
    provider: env.EMAIL_PROVIDER,
    host: env.SMTP_HOST,
    port: env.SMTP_PORT,
    from: env.EMAIL_FROM,
  });
});

/**
 * POST /api/payment/receipt
 * Simulates sending confirmation email after successful Razorpay payment
 */
router.post('/payment/receipt', (req: Request, res: Response) => {
  const { email, plan, price, paymentId } = req.body;
  console.log(`[Payment Receipt] 🧾 Payment confirmation logged for ${email} (${plan} - ₹${price}, ID: ${paymentId})`);

  res.json({
    success: true,
    message: `Receipt confirmed for ${email}`,
    paymentId,
  });
});

export default router;
