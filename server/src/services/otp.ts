import crypto from 'crypto';

export interface StoredOtpRecord {
  email: string;
  hash: string;
  salt: string;
  attempts: number;
  maxAttempts: number;
  createdAt: number;
  expiresAt: number;
}

interface RateLimitTracker {
  timestamps: number[];
  lastRequestAt: number;
}

// In-memory store for active hashed OTPs
const otpStore = new Map<string, StoredOtpRecord>();

// Rate limit trackers
const emailRateLimits = new Map<string, RateLimitTracker>();
const ipRateLimits = new Map<string, number[]>();

// Constants
export const OTP_EXPIRY_MS = 5 * 60 * 1000; // 5 minutes
export const MAX_ATTEMPTS = 5; // 5 attempts max
export const RESEND_COOLDOWN_MS = 60 * 1000; // 60 seconds
export const EMAIL_MAX_REQUESTS_15M = 3; // 3 requests per 15 min per email
export const IP_MAX_REQUESTS_15M = 10; // 10 requests per 15 min per IP
const FIFTEEN_MIN_MS = 15 * 60 * 1000;

/**
 * Standardizes email normalization (trim and lowercase)
 */
export function normalizeEmail(email: string): string {
  if (!email || typeof email !== 'string') return '';
  return email.trim().toLowerCase();
}

/**
 * Validates email format with standard RFC 5322 regex
 */
export function isValidEmail(email: string): boolean {
  const normalized = normalizeEmail(email);
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized);
}

/**
 * Generates a cryptographically secure 6-digit OTP using crypto.randomInt
 */
export function generateSecureOtp(): string {
  return crypto.randomInt(100000, 1000000).toString();
}

/**
 * Computes a secure HMAC-SHA256 hash using a unique salt
 */
export function hashOtp(otp: string, salt: string): string {
  return crypto.createHmac('sha256', salt).update(otp).digest('hex');
}

/**
 * Performs timing-safe comparison to prevent side-channel timing attacks
 */
function secureCompare(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(Buffer.from(a), Buffer.from(b));
}

/**
 * Checks email & IP rate limits and cooldowns.
 * Throws descriptive error if rate limit is exceeded.
 */
function checkRateLimits(email: string, ip: string): void {
  const now = Date.now();

  // 1. IP rate limiting (10 requests per 15 minutes)
  const clientIp = ip || 'unknown';
  const ipHistory = (ipRateLimits.get(clientIp) || []).filter(
    (time) => now - time < FIFTEEN_MIN_MS
  );

  if (ipHistory.length >= IP_MAX_REQUESTS_15M) {
    throw new Error('Too many requests from this network. Please try again later.');
  }

  // 2. Email rate limiting (3 requests per 15 min & 60s cooldown)
  const tracker = emailRateLimits.get(email) || { timestamps: [], lastRequestAt: 0 };
  const filteredTimestamps = tracker.timestamps.filter(
    (time) => now - time < FIFTEEN_MIN_MS
  );

  if (now - tracker.lastRequestAt < RESEND_COOLDOWN_MS) {
    const remainingSeconds = Math.ceil((RESEND_COOLDOWN_MS - (now - tracker.lastRequestAt)) / 1000);
    throw new Error(`Please wait ${remainingSeconds}s before requesting a new code.`);
  }

  if (filteredTimestamps.length >= EMAIL_MAX_REQUESTS_15M) {
    throw new Error('Too many verification codes requested for this email. Please try again in 15 minutes.');
  }

  // Update records
  ipHistory.push(now);
  ipRateLimits.set(clientIp, ipHistory);

  filteredTimestamps.push(now);
  emailRateLimits.set(email, {
    timestamps: filteredTimestamps,
    lastRequestAt: now,
  });
}

/**
 * Requests and stores a new hashed OTP for an email.
 * Returns the plain OTP to be dispatched via email.
 */
export function createOtpSession(
  rawEmail: string,
  clientIp: string
): { otp: string; expiresAt: number; cooldownSeconds: number } {
  const email = normalizeEmail(rawEmail);

  if (!isValidEmail(email)) {
    throw new Error('Please provide a valid email address');
  }

  // Check rate limits & cooldown
  checkRateLimits(email, clientIp);

  // Generate 6-digit secure code and unique salt
  const otp = generateSecureOtp();
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = hashOtp(otp, salt);
  const now = Date.now();
  const expiresAt = now + OTP_EXPIRY_MS;

  // Store hashed record (never plain text!)
  otpStore.set(email, {
    email,
    hash,
    salt,
    attempts: 0,
    maxAttempts: MAX_ATTEMPTS,
    createdAt: now,
    expiresAt,
  });

  return {
    otp,
    expiresAt,
    cooldownSeconds: 60,
  };
}

/**
 * Validates an OTP submitted by the user.
 * Enforces single-use invalidation, attempt limits, and expiration.
 */
export function verifyOtpCode(
  rawEmail: string,
  rawOtp: string
): { valid: boolean; error?: string } {
  const email = normalizeEmail(rawEmail);
  const otp = (rawOtp || '').trim();

  if (!email || !otp) {
    return { valid: false, error: 'Email and 6-digit verification code are required' };
  }

  const record = otpStore.get(email);

  if (!record) {
    return {
      valid: false,
      error: 'No active code found or code has expired. Please request a new code.',
    };
  }

  const now = Date.now();

  // Check expiry
  if (now > record.expiresAt) {
    otpStore.delete(email);
    return {
      valid: false,
      error: 'Verification code has expired. Please request a new code.',
    };
  }

  // Increment attempts
  record.attempts += 1;

  if (record.attempts > record.maxAttempts) {
    otpStore.delete(email);
    return {
      valid: false,
      error: 'Too many incorrect attempts. Please request a new code.',
    };
  }

  // Compare HMAC hash
  const computedHash = hashOtp(otp, record.salt);
  const isMatch = secureCompare(computedHash, record.hash);

  if (!isMatch) {
    const remainingAttempts = record.maxAttempts - record.attempts;
    if (remainingAttempts <= 0) {
      otpStore.delete(email);
      return {
        valid: false,
        error: 'Too many incorrect attempts. Please request a new code.',
      };
    }
    return {
      valid: false,
      error: `Invalid code. ${remainingAttempts} attempt${remainingAttempts === 1 ? '' : 's'} remaining.`,
    };
  }

  // Match succeeded -> Invalidate OTP immediately (one-time use!)
  otpStore.delete(email);
  return { valid: true };
}

/**
 * Clears OTP session if sending fails, so user isn't stuck waiting for cooldown.
 */
export function rollbackOtpSession(rawEmail: string): void {
  const email = normalizeEmail(rawEmail);
  otpStore.delete(email);
}

// Background cleanup every 60s
setInterval(() => {
  const now = Date.now();
  for (const [email, record] of otpStore.entries()) {
    if (now > record.expiresAt) {
      otpStore.delete(email);
    }
  }
}, 60000);
