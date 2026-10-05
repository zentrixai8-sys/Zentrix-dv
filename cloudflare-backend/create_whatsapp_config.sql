-- =========================================================================
-- Cloudflare D1 Query to Create whatsapp_config Table
-- Run this in your Cloudflare D1 Console (Database: zentrix-db / zentrixs)
-- =========================================================================

CREATE TABLE IF NOT EXISTS whatsapp_config (
    id TEXT PRIMARY KEY DEFAULT 'default',
    phone_number_id TEXT DEFAULT '',
    waba_id TEXT DEFAULT '',
    access_token TEXT DEFAULT '',
    template_name TEXT DEFAULT 'help_ticket',
    language_code TEXT DEFAULT 'en_US',
    is_enabled INTEGER DEFAULT 1,
    test_phone_number TEXT DEFAULT '',
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Seed Initial Default Config Record
INSERT OR IGNORE INTO whatsapp_config (id, phone_number_id, waba_id, access_token, template_name, language_code, is_enabled, test_phone_number)
VALUES ('default', '', '', '', 'help_ticket', 'en_US', 1, '');
