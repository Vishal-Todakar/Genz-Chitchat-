/**
 * Generates a simple device fingerprint for ban tracking.
 * In production, use a proper library like FingerprintJS.
 * For Phase 1, we use a combination of browser properties.
 */
export function generateFingerprint(): string {
  // Check localStorage for existing fingerprint
  const existing = localStorage.getItem('genz-fingerprint');
  if (existing) return existing;

  // Generate a new one based on browser properties
  const components = [
    navigator.userAgent,
    navigator.language,
    screen.width + 'x' + screen.height,
    screen.colorDepth.toString(),
    new Date().getTimezoneOffset().toString(),
    navigator.hardwareConcurrency?.toString() || '0',
  ];

  // Simple hash function
  let hash = 0;
  const str = components.join('|');
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }

  const fingerprint = 'fp_' + Math.abs(hash).toString(36) + '_' + Date.now().toString(36);
  localStorage.setItem('genz-fingerprint', fingerprint);
  return fingerprint;
}
