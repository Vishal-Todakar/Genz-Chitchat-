import dotenv from 'dotenv';
dotenv.config();

export const env = {
  PORT: parseInt(process.env.PORT || '3001', 10),
  NODE_ENV: process.env.NODE_ENV || 'development',
  CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:5173',
  
  // Rate limiting
  RATE_LIMIT_WINDOW_MS: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '60000', 10),
  RATE_LIMIT_MAX: parseInt(process.env.RATE_LIMIT_MAX || '100', 10),
  
  // Chat rate limiting (messages per window)
  CHAT_RATE_LIMIT_WINDOW_MS: parseInt(process.env.CHAT_RATE_LIMIT_WINDOW_MS || '10000', 10),
  CHAT_RATE_LIMIT_MAX: parseInt(process.env.CHAT_RATE_LIMIT_MAX || '10', 10),
  
  // Moderation
  REPORTS_BEFORE_BAN: parseInt(process.env.REPORTS_BEFORE_BAN || '5', 10),
  BAN_DURATION_HOURS: parseInt(process.env.BAN_DURATION_HOURS || '24', 10),
  
  // Interstitial ad frequency (every N skips)
  AD_INTERSTITIAL_SKIP_COUNT: parseInt(process.env.AD_INTERSTITIAL_SKIP_COUNT || '3', 10),

  // Email / SMTP Service
  EMAIL_PROVIDER: process.env.EMAIL_PROVIDER || 'gmail', // 'gmail' | 'smtp' | 'resend' | 'brevo' | 'sendgrid'
  SMTP_HOST: process.env.SMTP_HOST || 'smtp.gmail.com',
  SMTP_PORT: parseInt(process.env.SMTP_PORT || '465', 10),
  SMTP_SECURE: process.env.SMTP_SECURE === 'false' ? false : true, // default true for port 465
  SMTP_USER: process.env.SMTP_USER || '',
  SMTP_PASS: process.env.SMTP_PASS || '',
  EMAIL_FROM: process.env.EMAIL_FROM || 'Genz chitchat <noreply@genzchitchat.com>',
  
  // Alternative provider keys
  RESEND_API_KEY: process.env.RESEND_API_KEY || '',
  BREVO_API_KEY: process.env.BREVO_API_KEY || '',
  SENDGRID_API_KEY: process.env.SENDGRID_API_KEY || '',
};
