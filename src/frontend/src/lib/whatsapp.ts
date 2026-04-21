/** Digits only, e.g. 919876543210 for India +91 98765 43210 */
export function normalizeWhatsAppDigits(input: string): string {
  return input.replace(/\D/g, "");
}

export function buildWhatsAppUrl(phoneDigits: string, message: string): string {
  const n = normalizeWhatsAppDigits(phoneDigits);
  if (!n) return "";
  return `https://wa.me/${n}?text=${encodeURIComponent(message)}`;
}
