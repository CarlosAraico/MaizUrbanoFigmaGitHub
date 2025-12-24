export function buildWhatsAppLink({ phone, text }: { phone: string; text: string }) {
  const clean = String(phone).replace(/\D/g, "");
  const msg = encodeURIComponent(text);
  return `https://wa.me/${clean}?text=${msg}`;
}
