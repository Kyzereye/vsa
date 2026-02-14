/** Normalize phone to 10 digits only for storage. Returns null if empty or no digits. */
export function normalizePhoneToDigits(phone) {
  if (phone == null || phone === "") return null;
  const digits = String(phone).replace(/\D/g, "");
  if (digits.length === 0) return null;
  return digits.slice(0, 10) || null;
}
