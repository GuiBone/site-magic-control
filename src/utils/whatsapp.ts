export function generateWhatsAppLink(
  phoneNumber: string,
  message: string
): string {
  const cleanPhone = phoneNumber.replace(/\D/g, "");
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${cleanPhone}?text=${encodedMessage}`;
}

export function getWhatsAppConfig(content: Record<string, string> | undefined) {
  const defaultConfig = {
    number: "5545999999999",
    message: "Olá! Vim pelo site e gostaria de solicitar um orçamento.",
    label: "Fale conosco",
    ctaText: "Solicitar orçamento pelo WhatsApp",
  };

  if (!content) return defaultConfig;

  return {
    number: content.whatsapp_number || defaultConfig.number,
    message: content.whatsapp_message || defaultConfig.message,
    label: content.whatsapp_label || defaultConfig.label,
    ctaText: content.whatsapp_cta_text || defaultConfig.ctaText,
  };
}