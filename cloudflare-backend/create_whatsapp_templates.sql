-- =========================================================================
-- Cloudflare D1 Query to Create whatsapp_templates Table & Seed Templates
-- Run this in your Cloudflare D1 Console (Database: zentrixs)
-- =========================================================================

CREATE TABLE IF NOT EXISTS whatsapp_templates (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT DEFAULT 'UTILITY',
    language TEXT DEFAULT 'en_US',
    status TEXT DEFAULT 'APPROVED',
    body_text TEXT DEFAULT '',
    components_json TEXT,
    quality_rating TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_whatsapp_templates_name ON whatsapp_templates(name);
CREATE INDEX IF NOT EXISTS idx_whatsapp_templates_status ON whatsapp_templates(status);

-- Seed Initial 5 WhatsApp Meta Templates
INSERT OR REPLACE INTO whatsapp_templates (id, name, category, language, status, body_text, components_json)
VALUES 
('tpl_help_ticket_001', 'help_ticket', 'UTILITY', 'en_US', 'APPROVED', 'Hi {{1}}, thank you for contacting Zentrixs! 🙏\n\nYour support ticket {{2}} has been raised successfully.\n\nYou can check your ticket status on our website.', '[{"type":"BODY","text":"Hi {{1}}, thank you for contacting Zentrixs! 🙏\\n\\nYour support ticket {{2}} has been raised successfully.\\n\\nYou can check your ticket status on our website."}]'),
('tpl_offersms_002', 'offersms', 'MARKETING', 'en_US', 'APPROVED', '🚨 "Premium Salon Upgrade - Limited Time Offer! Enjoy exclusive automation packages designed to grow your business.', '[{"type":"BODY","text":"🚨 \\"Premium Salon Upgrade - Limited Time Offer! Enjoy exclusive automation packages designed to grow your business."}]'),
('tpl_marketing_welcome_003', 'marketing_welcome', 'MARKETING', 'en_US', 'APPROVED', 'Hello {{1}} 🤩 Thank you for showing interest in Zentrixs Enterprise AI Solutions. Our specialist will connect with you shortly.', '[{"type":"BODY","text":"Hello {{1}} 🤩 Thank you for showing interest in Zentrixs Enterprise AI Solutions. Our specialist will connect with you shortly."}]'),
('tpl_welcome_for_website_004', 'welcome_for_website', 'UTILITY', 'en_US', 'APPROVED', 'HelloHello {{1}} 🤩 Thank you for visiting our website. Your request has been received by our support team.', '[{"type":"BODY","text":"HelloHello {{1}} 🤩 Thank you for visiting our website. Your request has been received by our support team."}]'),
('tpl_ticket_update_005', 'ticket_update', 'UTILITY', 'en_US', 'APPROVED', 'Hello {{1}}, your ticket {{2}} status has been updated to {{3}}. Zentrixs engineer: {{4}}.', '[{"type":"BODY","text":"Hello {{1}}, your ticket {{2}} status has been updated to {{3}}. Zentrixs engineer: {{4}}."}]');
