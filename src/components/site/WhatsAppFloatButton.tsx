import { MessageCircle } from "lucide-react";
import { generateWhatsAppLink, getWhatsAppConfig } from "@/utils/whatsapp";

interface Props {
  content?: Record<string, string>;
}

export function WhatsAppFloatButton({ content }: Props) {
  const config = getWhatsAppConfig(content);
  const whatsappLink = generateWhatsAppLink(config.number, config.message);

  return (
    <a
      href={whatsappLink}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group"
    >
      <MessageCircle className="h-5 w-5 animate-pulse group-hover:animate-none" />
      <span className="font-medium text-sm hidden sm:inline">{config.label}</span>
    </a>
  );
}