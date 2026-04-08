-- Migration: Add WhatsApp fields to site_content
-- Created: 2026-04-08
-- Description: Add WhatsApp configuration fields for global use

INSERT INTO public.site_content (section, key, label, value, field_type) VALUES
('contact', 'whatsapp_number', 'Número do WhatsApp', '5545999999999', 'text'),
('contact', 'whatsapp_message', 'Mensagem padrão do WhatsApp', 'Olá! Vim pelo site e gostaria de solicitar um orçamento.', 'textarea'),
('contact', 'whatsapp_label', 'Texto do botão flutuante', 'Fale conosco', 'text'),
('contact', 'whatsapp_cta_text', 'Texto principal de CTA', 'Solicitar orçamento pelo WhatsApp', 'text')
ON CONFLICT (key) DO NOTHING;