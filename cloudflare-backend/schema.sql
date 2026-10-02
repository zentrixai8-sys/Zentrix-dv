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

-- =========================================================================
-- RUN THESE ALTER QUERIES IN D1 CONSOLE IF TABLE ALREADY EXISTS:
-- =========================================================================
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
