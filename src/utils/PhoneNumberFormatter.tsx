export function formatPhoneForWaMe(phone?: string): string {
  if (!phone) return ""; // fallback if phone is undefined
  const digits = phone.replace(/\D/g, "");
  return digits;
}