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
    upload_file_url TEXT,
    upload_file_name TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- TABLE 3: USERS (Admin & Engineer Logins)
CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    username TEXT UNIQUE NOT NULL,
    id_code TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'admin',   -- admin, support_engineer
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

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

-- INSERT AUTHORIZED COMPANY: Cirti Care
INSERT OR REPLACE INTO companies (id, name, code, password, contact_person, email, phone, status)
VALUES ('comp_cirticare', 'Cirti Care', 'CIRTICARE01', 'Cirti123', 'Cirti Care Admin', 'admin@cirticare.com', '+91 98765 11223', 'ACTIVE');
