import nodemailer from 'nodemailer';
import { env } from '../config/env';

export interface SendOtpOptions {
  to: string;
  otp: string;
  expiryMinutes?: number;
}

/**
 * Creates and returns the active Nodemailer transporter
 * based on the configured EMAIL_PROVIDER and SMTP settings.
 */
export function createEmailTransporter() {
  const provider = env.EMAIL_PROVIDER.toLowerCase();

  // Swappable provider configurations
  if (provider === 'gmail') {
    return nodemailer.createTransport({
      service: 'gmail',
      host: 'smtp.gmail.com',
      port: env.SMTP_PORT || 465,
      secure: env.SMTP_SECURE, // true for 465, false for 587
      auth: {
        user: env.SMTP_USER,
        pass: env.SMTP_PASS,
      },
      tls: {
        rejectUnauthorized: true,
      },
    });
  }

  if (provider === 'resend') {
    return nodemailer.createTransport({
      host: 'smtp.resend.com',
      port: 465,
      secure: true,
      auth: {
        user: 'resend',
        pass: env.RESEND_API_KEY || env.SMTP_PASS,
      },
    });
  }

  if (provider === 'brevo') {
    return nodemailer.createTransport({
      host: 'smtp-relay.brevo.com',
      port: 587,
      secure: false,
      auth: {
        user: env.BREVO_API_KEY ? 'apikey' : env.SMTP_USER,
        pass: env.BREVO_API_KEY || env.SMTP_PASS,
      },
    });
  }

  if (provider === 'sendgrid') {
    return nodemailer.createTransport({
      host: 'smtp.sendgrid.net',
      port: 587,
      secure: false,
      auth: {
        user: 'apikey',
        pass: env.SENDGRID_API_KEY || env.SMTP_PASS,
      },
    });
  }

  // Default custom SMTP
  return nodemailer.createTransport({
    host: env.SMTP_HOST,
    port: env.SMTP_PORT,
    secure: env.SMTP_SECURE,
    auth: {
      user: env.SMTP_USER,
      pass: env.SMTP_PASS,
    },
  });
}

// Singleton transporter
const transporter = createEmailTransporter();

/**
 * Checks whether necessary SMTP credentials exist in environment.
 */
export function isEmailConfigured(): boolean {
  if (env.EMAIL_PROVIDER === 'resend') {
    return Boolean(env.RESEND_API_KEY || env.SMTP_PASS);
  }
  if (env.EMAIL_PROVIDER === 'sendgrid') {
    return Boolean(env.SENDGRID_API_KEY || env.SMTP_PASS);
  }
  if (env.EMAIL_PROVIDER === 'brevo') {
    return Boolean(env.BREVO_API_KEY || (env.SMTP_USER && env.SMTP_PASS));
  }
  return Boolean(env.SMTP_USER && env.SMTP_PASS);
}

/**
 * Verifies SMTP connection health at startup.
 */
export async function verifyEmailConfig(): Promise<{ ok: boolean; message: string }> {
  if (!isEmailConfigured()) {
    const msg = `SMTP credentials are not configured in .env (provider: ${env.EMAIL_PROVIDER}). Real emails cannot be delivered until SMTP_USER and SMTP_PASS are set.`;
    console.warn(`[Email Service] ⚠️ ${msg}`);
    console.warn(`[Email Service] 👉 Set SMTP_USER and SMTP_PASS (Gmail App Password) in server/.env to enable inbox delivery.`);
    return { ok: false, message: msg };
  }

  try {
    console.log(`[Email Service] 🔄 Verifying connection to ${env.SMTP_HOST || env.EMAIL_PROVIDER}...`);
    await transporter.verify();
    console.log(`[Email Service] ✅ SMTP connection verified successfully! (${env.EMAIL_PROVIDER})`);
    return { ok: true, message: 'SMTP connection verified successfully' };
  } catch (err: any) {
    const cleanError = err?.message || String(err);
    console.error(`[Email Service] ❌ SMTP verification failed: ${cleanError}`);
    return { ok: false, message: cleanError };
  }
}

/**
 * Sends an OTP email to the user with both HTML and plain-text templates.
 * Awaits sending and guarantees errors are not swallowed.
 */
export async function sendOtpEmail({ to, otp, expiryMinutes = 5 }: SendOtpOptions): Promise<{ success: boolean; messageId: string }> {
  if (!to || !to.includes('@')) {
    throw new Error('A valid recipient email address is required');
  }

  if (!isEmailConfigured()) {
    const errorMsg = 'Email service is not configured. Please set SMTP_USER and SMTP_PASS in server/.env.';
    console.error(`[Email Service] ❌ ${errorMsg}`);
    throw new Error(errorMsg);
  }

  const fromAddress = env.EMAIL_FROM.includes('@')
    ? env.EMAIL_FROM
    : `Genz chitchat <${env.SMTP_USER}>`;

  const subject = `Your verification code: ${otp}`;

  // Clean, modern, high-deliverability HTML template
  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f6f9fc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f6f9fc; padding: 30px 15px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 520px; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05); border: 1px solid #e2e8f0;">
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); padding: 28px 30px; text-align: center;">
              <span style="font-size: 26px;">💬</span>
              <h1 style="margin: 8px 0 0 0; color: #ffffff; font-size: 20px; font-weight: 700; letter-spacing: -0.5px;">Genz chitchat</h1>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 35px 30px;">
              <h2 style="margin: 0 0 12px 0; color: #0f172a; font-size: 20px; font-weight: 700; text-align: center;">Verify Your Email Address</h2>
              <p style="margin: 0 0 24px 0; color: #475569; font-size: 14px; line-height: 1.6; text-align: center;">
                Please use the one-time verification code below to complete your checkout and unlock <strong>Female-only matches</strong>.
              </p>
              
              <!-- OTP Box -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin: 20px 0;">
                <tr>
                  <td align="center">
                    <div style="display: inline-block; background-color: #f1f5f9; border: 2px dashed #0d9488; border-radius: 12px; padding: 18px 32px; text-align: center;">
                      <span style="font-family: 'Courier New', Courier, monospace; font-size: 34px; font-weight: 800; letter-spacing: 8px; color: #0f766e;">${otp}</span>
                    </div>
                  </td>
                </tr>
              </table>
              
              <p style="margin: 20px 0 0 0; color: #64748b; font-size: 13px; text-align: center;">
                ⏳ This code will expire in <strong>${expiryMinutes} minutes</strong>.
              </p>
              
              <div style="margin-top: 25px; padding-top: 20px; border-top: 1px solid #f1f5f9; text-align: center;">
                <p style="margin: 0; color: #94a3b8; font-size: 12px; line-height: 1.5;">
                  🔒 If you did not request this verification code, you can safely ignore this email. Never share this code with anyone.
                </p>
              </div>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color: #f8fafc; padding: 16px 30px; text-align: center; border-top: 1px solid #e2e8f0;">
              <p style="margin: 0; color: #94a3b8; font-size: 11px;">
                © Genz chitchat. Secured by Razorpay & 256-bit SSL encryption.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();

  const text = `
Your Genz chitchat verification code is: ${otp}

This code will expire in ${expiryMinutes} minutes.

Please enter this 6-digit code in the checkout panel to complete your email verification and unlock female-only matches.

If you did not request this verification, please safely ignore this email.
Never share this code with anyone.

— The Genz chitchat Team
  `.trim();

  try {
    console.log(`[Email Service] 📤 Sending OTP email to ${to}...`);
    const info = await transporter.sendMail({
      from: fromAddress,
      to,
      subject,
      text,
      html,
    });

    console.log(`[Email Service] ✅ Email delivered to ${to} (Message ID: ${info.messageId})`);
    return {
      success: true,
      messageId: info.messageId,
    };
  } catch (err: any) {
    const cleanError = err?.message || String(err);
    console.error(`[Email Service] ❌ Failed to send email to ${to}: ${cleanError}`);
    throw new Error(`Email delivery failed: ${cleanError}`);
  }
}
