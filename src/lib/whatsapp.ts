// Builds a wa.me link with a prefilled message so buyers land in WhatsApp
// already asking about the exact product + variant they want.

export function formatNaira(amount: number): string {
  return `₦${amount.toLocaleString("en-NG")}`;
}

export function buildProductWhatsAppLink(
  phoneNumber: string,
  productName: string,
  variantLabel: string,
  price: number
): string {
  const message =
    `Hello Royal Beauty, I'm interested in this product:\n\n` +
    `*${productName}* (${variantLabel})\n` +
    `Price: ${formatNaira(price)}\n\n` +
    `Is it available?`;

  return `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
}

export function buildServiceWhatsAppLink(
  phoneNumber: string,
  serviceName: string
): string {
  const message =
    `Hello Royal Beauty, I'd like to book:\n\n` +
    `*${serviceName}*\n\n` +
    `Please let me know available times.`;

  return `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
}

export function buildGeneralWhatsAppLink(phoneNumber: string): string {
  return `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
    "Hello Royal Beauty, I have a question."
  )}`;
}
