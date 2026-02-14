/** Format 10-digit phone for display as (XXX) XXX-XXXX. Returns original string if not 10 digits. */
export function formatPhoneDisplay(phone) {
  if (phone == null || phone === "") return "";
  const digits = String(phone).replace(/\D/g, "");
  if (digits.length !== 10) return String(phone).trim();
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
}

/** Normalize phone to 10 digits for API submission. */
export function normalizePhoneForSubmit(phone) {
  if (phone == null || phone === "") return null;
  const digits = String(phone).replace(/\D/g, "");
  if (digits.length === 0) return null;
  return digits.slice(0, 10) || null;
}
