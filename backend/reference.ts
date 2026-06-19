/**
 * GÃ©nÃ¨re un numÃ©ro de rÃ©fÃ©rence unique
 * Format: PREFIX-YYYY-MM-XXXX (ex: STUDIO-2026-04-0001)
 */
export function generateReference(prefix: string): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const random = Math.floor(1000 + Math.random() * 9000);
  return `${prefix}-${year}-${month}-${random}`;
}


