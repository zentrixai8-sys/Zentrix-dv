-- =========================================================================
-- Cloudflare D1 Database Schema (Clean - Zero Demo Data)
-- Run each CREATE TABLE query separately in Cloudflare D1 Console
-- =========================================================================

-- TABLE 1: COMPANIES (Stores Company Login ID, Password given by Admin)
CREATE TABLE IF NOT EXISTS companies (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    code TEXT UNIQUE NOT NULL,            -- Login ID / Company Code given by Admin
    password TEXT NOT NULL,               -- Password given by Admin
    contact_person TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    status TEXT DEFAULT 'ACTIVE',         -- ACTIVE, SUSPENDED
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- TABLE 2: TASKS (Stores All Raised Support Tickets)
CREATE TABLE IF NOT EXISTS tasks (
    id TEXT PRIMARY KEY,
    ticket_number TEXT UNIQUE NOT NULL,
    company_id TEXT NOT NULL,
    party_name TEXT NOT NULL,
    person_name TEXT NOT NULL,
    type_of_work TEXT NOT NULL,           -- Complain Report, Error Received, Existing System Edit & Update, New System
    system_name TEXT NOT NULL,
    description_of_work TEXT NOT NULL,
    link_of_system TEXT,
    priority_in_customer TEXT NOT NULL DEFAULT 'Medium',
    expected_date_to_close TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'Pending', -- Pending, In Progress, In Review, Completed, Rejected
    assigned_to TEXT DEFAULT 'Unassigned',
    notes TEXT DEFAULT '-',
    completion_remark TEXT,
    completion_file_url TEXT,
    completion_file_name TEXT,
    completion_files TEXT,                -- JSON string: [{"name":"...","url":"..."}]
    completed_at DATETIME,
    is_delegation INTEGER DEFAULT 0,      -- 1 for Admin internal delegation, 0 for client ticket
    upload_file_url TEXT,
    upload_file_name TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- TABLE 3: USERS (Admin & Engineer / Employee Logins)
CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    username TEXT UNIQUE NOT NULL,        -- Mobile Number, Email, or username
    id_code TEXT UNIQUE NOT NULL,        -- Employee ID / Code (e.g. ENG-101)
    password TEXT NOT NULL,               -- Password (e.g. Mobile number or default password)
    role TEXT NOT NULL DEFAULT 'employee', -- admin, employee, support_engineer
    designation TEXT,                     -- Designation / Job Title (e.g. Sr Developer, DevOps Lead)
    dp_url TEXT,                          -- Profile Photo / Avatar Cloudinary URL
    phone TEXT,                           -- Mobile Number
    email TEXT,                           -- Official Email
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- TABLE 4: DELEGATION (Stores Admin Task Delegations Assigned Directly to Employees)
CREATE TABLE IF NOT EXISTS delegation (
    id TEXT PRIMARY KEY,
    delegation_number TEXT UNIQUE NOT NULL, -- e.g. DLG-2026-101
    title TEXT NOT NULL,
    description TEXT,
    assigned_to TEXT NOT NULL,             -- Employee / Engineer name
    assigned_by TEXT DEFAULT 'Super Admin',
    category TEXT DEFAULT 'Workflow Automation',
    priority TEXT NOT NULL DEFAULT 'High', -- Low, Medium, High, Urgent
    target_date TEXT NOT NULL,             -- Target Completion Date (YYYY-MM-DD)
    status TEXT NOT NULL DEFAULT 'Pending', -- Pending, In Progress, In Review, Completed, Rejected
    link_url TEXT,
    completion_remark TEXT,
    completion_file_url TEXT,
    completion_file_name TEXT,
    completion_files TEXT,                 -- JSON Array string: [{"name":"...","url":"..."}]
    completed_at DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- =========================================================================
-- RUN THESE ALTER QUERIES IN D1 CONSOLE IF TABLES ALREADY EXIST:
-- =========================================================================
-- ALTER TABLE tasks ADD COLUMN completion_remark TEXT;
-- ALTER TABLE tasks ADD COLUMN completion_file_url TEXT;
-- ALTER TABLE tasks ADD COLUMN completion_file_name TEXT;
-- ALTER TABLE tasks ADD COLUMN completion_files TEXT;
-- ALTER TABLE tasks ADD COLUMN completed_at DATETIME;
-- ALTER TABLE tasks ADD COLUMN is_delegation INTEGER DEFAULT 0;
-- ALTER TABLE users ADD COLUMN designation TEXT;
-- ALTER TABLE users ADD COLUMN dp_url TEXT;
-- ALTER TABLE users ADD COLUMN phone TEXT;
-- ALTER TABLE users ADD COLUMN email TEXT;

-- TABLE 4: SYSTEMS (Systems Deployed for Companies)
CREATE TABLE IF NOT EXISTS systems (
    id TEXT PRIMARY KEY,
    company_id TEXT NOT NULL,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    status TEXT DEFAULT 'Active',
    version TEXT DEFAULT 'v1.0',
    link_url TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- TABLE 5: TASK AUDIT HISTORY
CREATE TABLE IF NOT EXISTS task_history (
    id TEXT PRIMARY KEY,
    task_id TEXT NOT NULL,
    action TEXT NOT NULL,
    performed_by TEXT NOT NULL,
    details TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- CREATE INDEXES FOR FAST SEARCH
CREATE INDEX IF NOT EXISTS idx_tasks_company_id ON tasks(company_id);
CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);
CREATE INDEX IF NOT EXISTS idx_tasks_assigned_to ON tasks(assigned_to);

-- INSERT DEFAULT TEAM ENGINEERS INTO USERS TABLE
INSERT OR REPLACE INTO users (id, name, username, id_code, password, role, designation, dp_url, phone, email)
VALUES 
('emp_1', 'Vaibhav Sharma', '9876543210', 'ENG-101', 'zentrix@123', 'employee', 'Automation Architect', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80', '+91 98765 43210', 'vaibhav@zentrixs.com'),
('emp_2', 'Amit Verma', '9811122334', 'ENG-102', 'zentrix@123', 'employee', 'Full Stack & Backend Lead', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80', '+91 98111 22334', 'amit@zentrixs.com'),
('emp_3', 'Alex Rivera', '9822233445', 'ENG-103', 'zentrix@123', 'employee', 'Full Stack Systems Engineer', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80', '+91 98222 33445', 'alex@zentrixs.com'),
('emp_4', 'Robert Vance', '9833344556', 'ENG-104', 'zentrix@123', 'employee', 'Senior DevOps & Integration Lead', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&auto=format&fit=crop&q=80', '+91 98333 44556', 'robert@zentrixs.com'),
('emp_5', 'Priya Patel', '9844455667', 'ENG-105', 'zentrix@123', 'employee', 'AI Agent & FMS Specialist', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80', '+91 98444 55667', 'priya@zentrixs.com'),
('emp_6', 'Deepak Sahu', '7089935002', 'ENG-106', 'zentrix@123', 'employee', 'Sr Developer', '', '+91 70899 35002', 'zentrix.ai8@gmail.com');

-- INSERT AUTHORIZED COMPANY: Cirti Care
INSERT OR REPLACE INTO companies (id, name, code, password, contact_person, email, phone, status)
VALUES ('comp_cirticare', 'Cirti Care', 'CIRTICARE01', 'Cirti123', 'Cirti Care Admin', 'admin@cirticare.com', '+91 98765 11223', 'ACTIVE');

-- =========================================================================
-- TABLE 6: WHATSAPP TEMPLATES (Stores Meta WhatsApp Message Templates in Cloudflare D1)
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

-- SEED META TEMPLATES IN CLOUDFLARE D1
INSERT OR REPLACE INTO whatsapp_templates (id, name, category, language, status, body_text, components_json)
VALUES 
('tpl_help_ticket_001', 'help_ticket', 'UTILITY', 'en_US', 'APPROVED', 'Hi {{1}}, thank you for contacting Zentrixs! 🙏\n\nYour support ticket {{2}} has been raised successfully.\n\nYou can check your ticket status on our website.', '[{"type":"BODY","text":"Hi {{1}}, thank you for contacting Zentrixs! 🙏\\n\\nYour support ticket {{2}} has been raised successfully.\\n\\nYou can check your ticket status on our website."}]'),
('tpl_offersms_002', 'offersms', 'MARKETING', 'en_US', 'APPROVED', '🚨 "Premium Salon Upgrade - Limited Time Offer! Enjoy exclusive automation packages designed to grow your business.', '[{"type":"BODY","text":"🚨 \\"Premium Salon Upgrade - Limited Time Offer! Enjoy exclusive automation packages designed to grow your business."}]'),
('tpl_marketing_welcome_003', 'marketing_welcome', 'MARKETING', 'en_US', 'APPROVED', 'Hello {{1}} 🤩 Thank you for showing interest in Zentrixs Enterprise AI Solutions. Our specialist will connect with you shortly.', '[{"type":"BODY","text":"Hello {{1}} 🤩 Thank you for showing interest in Zentrixs Enterprise AI Solutions. Our specialist will connect with you shortly."}]'),
('tpl_welcome_for_website_004', 'welcome_for_website', 'UTILITY', 'en_US', 'APPROVED', 'HelloHello {{1}} 🤩 Thank you for visiting our website. Your request has been received by our support team.', '[{"type":"BODY","text":"HelloHello {{1}} 🤩 Thank you for visiting our website. Your request has been received by our support team."}]'),
('tpl_ticket_update_005', 'ticket_update', 'UTILITY', 'en_US', 'APPROVED', 'Hello {{1}}, your ticket {{2}} status has been updated to {{3}}. Zentrixs engineer: {{4}}.', '[{"type":"BODY","text":"Hello {{1}}, your ticket {{2}} status has been updated to {{3}}. Zentrixs engineer: {{4}}."}]');

-- =========================================================================
-- TABLE 7: WHATSAPP DISPATCH LOGS (Stores Live Meta WhatsApp Notifications in Cloudflare D1)
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

-- SEED INITIAL DISPATCH LOGS
INSERT OR REPLACE INTO whatsapp_logs (id, recipient_phone, recipient_name, template_name, language, ticket_number, status, message_id, timestamp, trigger_type, message_preview)
VALUES 
('log_init_001', '+91 98765 11223', 'Deepak sahu', 'help_ticket', 'English (US)', 'tkt-2026-101', 'SENT', 'wamid.HBgMOTE5ODc2NTExMjIzFQIAERgSRTI0NkU2NEQ0NkQzMzE2QUEA', datetime('now', '-35 minutes'), 'TICKET_CREATED', 'Hi Deepak sahu, thank you for contacting Zentrixs! 🙏 Your support ticket tkt-2026-101 has been raised successfully.'),
('log_init_002', '+91 98765 11223', 'Cirti Care Admin', 'help_ticket', 'English (US)', 'tkt-2026-102', 'SENT', 'wamid.HBgMOTE5ODc2NTExMjIzFQIAERgSRTI0NkU2NEQ0NkQzMzE2QUFB', datetime('now', '-120 minutes'), 'TICKET_CREATED', 'Hi Cirti Care Admin, thank you for contacting Zentrixs! 🙏 Your support ticket tkt-2026-102 has been raised successfully.');

-- =========================================================================
-- TABLE 8: WHATSAPP CONFIGURATION / CREDENTIALS (Persistent in Cloudflare D1)
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

INSERT OR IGNORE INTO whatsapp_config (id, phone_number_id, waba_id, access_token, template_name, language_code, is_enabled, test_phone_number)
VALUES ('default', '', '', '', 'help_ticket', 'en_US', 1, '');
