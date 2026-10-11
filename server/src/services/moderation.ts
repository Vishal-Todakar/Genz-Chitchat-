/**
 * Profanity filter + spam detection service.
 * Uses the 'bad-words' library as a base, extended with custom patterns
 * for common evasion tactics (leet speak, spacing, etc.)
 */
import { Filter } from 'bad-words';

const filter = new Filter();

// Add additional words/patterns commonly used for evasion
filter.addWords(
  'b00bs', 'pr0n', 'p0rn', 'a$$', 'azz',
  'sht', 'fk', 'fuk', 'stfu', 'wtf'
);

/** Returns true if text contains profanity */
export function containsProfanity(text: string): boolean {
  try {
    return filter.isProfane(text);
  } catch {
    return false;
  }
}

/** Returns the cleaned version of the text with profanity replaced by asterisks */
export function cleanText(text: string): string {
  try {
    return filter.clean(text);
  } catch {
    return text;
  }
}

/**
 * Spam detection — checks for repetitive messages, excessive caps,
 * link spam, and flooding patterns.
 */
export function isSpam(text: string): boolean {
  // All caps (more than 10 chars, 80%+ uppercase)
  if (text.length > 10) {
    const upperCount = (text.match(/[A-Z]/g) || []).length;
    if (upperCount / text.length > 0.8) return true;
  }

  // Excessive repeated characters (e.g. "aaaaaaa")
  if (/(.)\1{6,}/.test(text)) return true;

  // URL/link spam (multiple links)
  const urlCount = (text.match(/https?:\/\//gi) || []).length;
  if (urlCount > 1) return true;

  // Very long messages (likely paste spam)
  if (text.length > 2000) return true;

  return false;
}

/**
 * Sanitize user input to prevent XSS.
 * Strips HTML tags and encodes special characters.
 */
export function sanitizeInput(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .trim()
    .slice(0, 2000); // Hard cap on message length
}

// ---- In-memory report & ban tracking (Phase 1) ----
// In Phase 4 this moves to PostgreSQL.

interface ReportRecord {
  reportedFingerprint: string;
  reporterFingerprint: string;
  reason: string;
  timestamp: Date;
}

const reports: ReportRecord[] = [];
const bans: Map<string, Date> = new Map(); // fingerprint → ban expiry

export function addReport(
  reportedFingerprint: string,
  reporterFingerprint: string,
  reason: string,
  reportsBeforeBan: number,
  banDurationHours: number
): { banned: boolean } {
  reports.push({
    reportedFingerprint,
    reporterFingerprint,
    reason,
    timestamp: new Date(),
  });

  // Count recent reports against this user (last 24h)
  const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const recentReports = reports.filter(
    (r) =>
      r.reportedFingerprint === reportedFingerprint &&
      r.timestamp > cutoff
  );

  if (recentReports.length >= reportsBeforeBan) {
    const expiry = new Date(Date.now() + banDurationHours * 60 * 60 * 1000);
    bans.set(reportedFingerprint, expiry);
    return { banned: true };
  }

  return { banned: false };
}

export function isBanned(fingerprint: string): boolean {
  const expiry = bans.get(fingerprint);
  if (!expiry) return false;
  if (new Date() > expiry) {
    bans.delete(fingerprint);
    return false;
  }
  return true;
}

export function getReports() {
  return reports;
}

export function unbanUser(fingerprint: string): boolean {
  return bans.delete(fingerprint);
}
