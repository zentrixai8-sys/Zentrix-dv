-- =========================================================================
-- Cloudflare D1 Query to Create whatsapp_logs Table & Seed Initial Logs
-- Run this in your Cloudflare D1 Console (Database: zentrix-db / zentrixs)
-- =========================================================================

CREATE TABLE IF NOT EXISTS whatsapp_logs (
    id TEXT PRIMARY KEY,
    recipient_phone TEXT NOT NULL,
    recipient_name TEXT,
    template_name TEXT,
    language TEXT,
    ticket_number TEXT,
    status TEXT DEFAULT 'SENT',
    message_id TEXT,
    error TEXT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    trigger_type TEXT DEFAULT 'TICKET_CREATED',
    message_preview TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_whatsapp_logs_timestamp ON whatsapp_logs(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_whatsapp_logs_ticket ON whatsapp_logs(ticket_number);
CREATE INDEX IF NOT EXISTS idx_whatsapp_logs_recipient ON whatsapp_logs(recipient_phone);

-- Seed Initial WhatsApp Dispatch Logs (from live system dispatches)
INSERT OR REPLACE INTO whatsapp_logs (id, recipient_phone, recipient_name, template_name, language, ticket_number, status, message_id, timestamp, trigger_type, message_preview)
VALUES 
('log_init_001', '+91 98765 11223', 'Deepak sahu', 'help_ticket', 'English (US)', 'tkt-2026-101', 'SENT', 'wamid.HBgMOTE5ODc2NTExMjIzFQIAERgSRTI0NkU2NEQ0NkQzMzE2QUEA', datetime('now', '-35 minutes'), 'TICKET_CREATED', 'Hi Deepak sahu, thank you for contacting Zentrixs! 🙏 Your support ticket tkt-2026-101 has been raised successfully.'),
('log_init_002', '+91 98765 11223', 'Cirti Care Admin', 'help_ticket', 'English (US)', 'tkt-2026-102', 'SENT', 'wamid.HBgMOTE5ODc2NTExMjIzFQIAERgSRTI0NkU2NEQ0NkQzMzE2QUFB', datetime('now', '-120 minutes'), 'TICKET_CREATED', 'Hi Cirti Care Admin, thank you for contacting Zentrixs! 🙏 Your support ticket tkt-2026-102 has been raised successfully.');
