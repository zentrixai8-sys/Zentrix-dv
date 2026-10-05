import { Hono } from 'hono';
import { cors } from 'hono/cors';

export interface Env {
  DB: D1Database;
  JWT_SECRET?: string;
}

const app = new Hono<{ Bindings: Env }>();

// Enable CORS for frontend requests from any origin or configured domain
app.use('*', cors({
  origin: '*',
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
  exposeHeaders: ['Content-Length'],
  maxAge: 86400,
}));

// Health check
app.get('/', (c) => {
  return c.json({
    status: 'ONLINE',
    service: 'Zentrixs Enterprise Task & Ticket API',
    engine: 'Cloudflare Workers + Hono + D1 Database',
    timestamp: new Date().toISOString()
  });
});

// ==========================================
// 1. AUTHENTICATION ENDPOINTS
// ==========================================

// Company Login
app.post('/api/auth/company-login', async (c) => {
  try {
    const { companyNameOrCode, userName, password } = await c.req.json();
    if (!companyNameOrCode) {
      return c.json({ error: 'Company Name or Code is required' }, 400);
    }

    const db = c.env.DB;
    // Find company by code or name
    const company = await db
      .prepare('SELECT * FROM companies WHERE LOWER(code) = LOWER(?) OR LOWER(name) LIKE LOWER(?)')
      .bind(companyNameOrCode.trim(), `%${companyNameOrCode.trim()}%`)
      .first();

    if (!company) {
      return c.json({ error: 'Access Denied: Company not registered. Please contact Zentrixs Admin.' }, 404);
    }

    if (company.password && password && company.password !== password) {
      return c.json({ error: 'Galat Password! Kripya sahi password enter karein.' }, 401);
    }

    const session = {
      user: userName || company.contact_person,
      role: 'company',
      companyId: company.id,
      companyName: company.name,
      email: company.email,
      idCode: company.code
    };

    return c.json({ success: true, session });
  } catch (err: any) {
    return c.json({ error: err.message || 'Internal server error' }, 500);
  }
});

// Admin Login
app.post('/api/auth/admin-login', async (c) => {
  try {
    const { username, idCode, password } = await c.req.json();
    
    // In production, compare with hashed password in D1 users table:
    // const user = await c.env.DB.prepare('SELECT * FROM users WHERE role = "admin" AND ...').first();

    if (!username) {
      return c.json({ error: 'Admin username is required' }, 400);
    }

    const session = {
      user: username,
      role: 'admin',
      idCode: idCode || 'ADM-001',
      email: 'admin@zentrixs.com'
    };

    return c.json({ success: true, session });
  } catch (err: any) {
    return c.json({ error: err.message }, 500);
  }
});

// ==========================================
// 2. TASKS / TICKETS ENDPOINTS
// ==========================================

// GET /api/tasks - Retrieve tasks with optional filters
app.get('/api/tasks', async (c) => {
  try {
    const db = c.env.DB;
    const { companyId, status, assignedTo, search } = c.req.query();

    let query = 'SELECT * FROM tasks WHERE 1=1';
    const params: any[] = [];

    if (companyId) {
      query += ' AND company_id = ?';
      params.push(companyId);
    }

    if (status && status !== 'All') {
      query += ' AND status = ?';
      params.push(status);
    }

    if (assignedTo && assignedTo !== 'All') {
      query += ' AND assigned_to = ?';
      params.push(assignedTo);
    }

    if (search) {
      query += ' AND (ticket_number LIKE ? OR party_name LIKE ? OR system_name LIKE ? OR description_of_work LIKE ? OR person_name LIKE ?)';
      const s = `%${search}%`;
      params.push(s, s, s, s, s);
    }

    query += ' ORDER BY created_at DESC';

    const result = await db.prepare(query).bind(...params).all();

    // Map column snake_case to frontend camelCase
    const tasks = (result.results || []).map((row: any) => ({
      id: row.id,
      ticketNumber: row.ticket_number,
      companyId: row.company_id,
      partyName: row.party_name,
      personName: row.person_name,
      typeOfWork: row.type_of_work,
      systemName: row.system_name,
      descriptionOfWork: row.description_of_work,
      linkOfSystem: row.link_of_system,
      priorityInCustomer: row.priority_in_customer,
      expectedDateToClose: row.expected_date_to_close,
      status: row.status,
      assignedTo: row.assigned_to,
      notes: row.notes,
      uploadFileUrl: row.upload_file_url,
      uploadFileName: row.upload_file_name,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    }));

    return c.json({ success: true, count: tasks.length, tasks });
  } catch (err: any) {
    return c.json({ error: err.message }, 500);
  }
});

// POST /api/tasks - Company raises a new task
app.post('/api/tasks', async (c) => {
  try {
    const db = c.env.DB;
    const body = await c.req.json();

    const id = body.id || `tsk_${Date.now()}`;
    const ticketNumber = body.ticketNumber || `TCK-2026-${Math.floor(100 + Math.random() * 900)}`;
    const now = new Date().toISOString();

    await db.prepare(`
      INSERT INTO tasks (
        id, ticket_number, company_id, party_name, person_name,
        type_of_work, system_name, description_of_work, link_of_system,
        priority_in_customer, expected_date_to_close, status,
        assigned_to, notes, upload_file_url, upload_file_name, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      id,
      ticketNumber,
      body.companyId || 'comp_general',
      body.partyName || 'Company Client',
      body.personName || 'Authorized User',
      body.typeOfWork || 'Existing System Edit & Update',
      body.systemName || 'General System',
      body.descriptionOfWork || '',
      body.linkOfSystem || '',
      body.priorityInCustomer || 'Medium',
      body.expectedDateToClose || '2026-03-31',
      body.status || 'Pending',
      body.assignedTo || 'Unassigned',
      body.notes || '-',
      body.uploadFileUrl || null,
      body.uploadFileName || null,
      now,
      now
    ).run();

    // Log history
    await db.prepare(`
      INSERT INTO task_history (id, task_id, action, performed_by, details)
      VALUES (?, ?, 'CREATED', ?, ?)
    `).bind(
      `hist_${Date.now()}`,
      id,
      body.personName || 'Company User',
      `Ticket ${ticketNumber} raised for ${body.systemName}`
    ).run();

    return c.json({
      success: true,
      task: {
        id,
        ticketNumber,
        ...body,
        status: 'Pending',
        createdAt: now,
        updatedAt: now
      }
    }, 201);
  } catch (err: any) {
    return c.json({ error: err.message }, 500);
  }
});

// PUT /api/tasks/:id/assign - Admin assigns task to employee
app.put('/api/tasks/:id/assign', async (c) => {
  try {
    const db = c.env.DB;
    const taskId = c.req.param('id');
    const { assignedTo, performedBy } = await c.req.json();

    if (!assignedTo) {
      return c.json({ error: 'Assigned employee name is required' }, 400);
    }

    const now = new Date().toISOString();
    await db.prepare(`
      UPDATE tasks 
      SET assigned_to = ?, status = CASE WHEN status = 'Pending' THEN 'In Progress' ELSE status END, updated_at = ?
      WHERE id = ?
    `).bind(assignedTo, now, taskId).run();

    await db.prepare(`
      INSERT INTO task_history (id, task_id, action, performed_by, details)
      VALUES (?, ?, 'ASSIGNED', ?, ?)
    `).bind(
      `hist_${Date.now()}`,
      taskId,
      performedBy || 'Admin',
      `Assigned to ${assignedTo}`
    ).run();

    return c.json({ success: true, message: `Task assigned to ${assignedTo}` });
  } catch (err: any) {
    return c.json({ error: err.message }, 500);
  }
});

// PUT /api/tasks/:id/status - Update task status and remarks
app.put('/api/tasks/:id/status', async (c) => {
  try {
    const db = c.env.DB;
    const taskId = c.req.param('id');
    const { status, notes, performedBy } = await c.req.json();

    const now = new Date().toISOString();
    await db.prepare(`
      UPDATE tasks 
      SET status = COALESCE(?, status), notes = COALESCE(?, notes), updated_at = ?
      WHERE id = ?
    `).bind(status || null, notes || null, now, taskId).run();

    return c.json({ success: true, message: 'Status updated successfully' });
  } catch (err: any) {
    return c.json({ error: err.message }, 500);
  }
});

// GET /api/stats - Dashboard analytics
app.get('/api/stats', async (c) => {
  try {
    const db = c.env.DB;
    const { companyId } = c.req.query();

    let query = 'SELECT status, count(*) as count FROM tasks';
    const params: any[] = [];
    if (companyId) {
      query += ' WHERE company_id = ? GROUP BY status';
      params.push(companyId);
    } else {
      query += ' GROUP BY status';
    }

    const counts = await db.prepare(query).bind(...params).all();
    const totalCompanies = await db.prepare('SELECT count(*) as count FROM companies').first();

    return c.json({
      success: true,
      stats: counts.results,
      totalCompanies: totalCompanies?.count || 0
    });
  } catch (err: any) {
    return c.json({ error: err.message }, 500);
  }
});

// GET /api/companies
app.get('/api/companies', async (c) => {
  try {
    const db = c.env.DB;
    const result = await db.prepare('SELECT * FROM companies ORDER BY name ASC').all();
    return c.json({ success: true, companies: result.results });
  } catch (err: any) {
    return c.json({ error: err.message }, 500);
  }
});

// POST /api/companies - Admin registers a new company with login credentials
app.post('/api/companies', async (c) => {
  try {
    const db = c.env.DB;
    const body = await c.req.json();
    const id = body.id || `comp_${Date.now()}`;
    const code = (body.code || `COMP${Math.floor(100 + Math.random() * 900)}`).toUpperCase();
    const password = body.password || 'zentrix@123';
    const name = body.name || 'New Client Company';
    const contactPerson = body.contactPerson || 'Manager';
    const email = body.email || '';
    const phone = body.phone || '';
    const logoUrl = body.logoUrl || body.avatar || null;
    const now = new Date().toISOString();

    await db.prepare(`
      INSERT INTO companies (id, name, code, password, contact_person, email, phone, logo_url)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(id, name, code, password, contactPerson, email, phone, logoUrl).run();

    return c.json({
      success: true,
      company: { id, name, code, password, contactPerson, email, phone, logoUrl }
    }, 201);
  } catch (err: any) {
    return c.json({ error: err.message }, 500);
  }
});

// PUT /api/companies/:id/logo - Update company logo
app.put('/api/companies/:id/logo', async (c) => {
  try {
    const db = c.env.DB;
    const companyId = c.req.param('id');
    const { logoUrl } = await c.req.json();
    await db.prepare('UPDATE companies SET logo_url = ? WHERE id = ?').bind(logoUrl || null, companyId).run();
    return c.json({ success: true, message: 'Logo updated successfully', logoUrl });
  } catch (err: any) {
    return c.json({ error: err.message }, 500);
  }
});

// ==========================================
// 4. USERS & EMPLOYEES ENDPOINTS (Stored in D1 users table)
// ==========================================

// GET /api/users & /api/employees - Team engineers & users list from D1 users table
const handleGetUsers = async (c: any) => {
  try {
    const db = c.env.DB;
    const { results } = await db.prepare('SELECT * FROM users ORDER BY created_at DESC').all();
    const users = (results || []).map((row: any) => ({
      id: row.id,
      name: row.name,
      username: row.username,
      idCode: row.id_code,
      role: row.designation || row.role || 'Systems Support Engineer',
      designation: row.designation || row.role || 'Systems Support Engineer',
      password: row.password,
      email: row.email || (row.username && row.username.includes('@') ? row.username : undefined),
      phone: row.phone || (row.username && /^[0-9+ ]+$/.test(row.username) ? row.username : undefined),
      avatar: row.dp_url || row.avatar || undefined,
      dpUrl: row.dp_url || row.avatar || undefined,
      createdAt: row.created_at
    }));
    return c.json({ success: true, count: users.length, users, employees: users });
  } catch (err: any) {
    return c.json({ error: err.message }, 500);
  }
};

app.get('/api/users', handleGetUsers);
app.get('/api/employees', handleGetUsers);

// POST /api/users & /api/employees - Store new employee/user in D1 users table
const handleCreateUser = async (c: any) => {
  try {
    const db = c.env.DB;
    const body = await c.req.json();
    const id = body.id || `emp_${Date.now()}`;
    const name = body.name ? body.name.trim() : '';
    if (!name) {
      return c.json({ error: 'Name is required' }, 400);
    }
    const username = (body.username || body.phone || body.email || name.toLowerCase().replace(/\s+/g, '.')).trim();
    const idCode = (body.idCode || body.id_code || `ENG-${Math.floor(100 + Math.random() * 900)}`).toUpperCase().trim();
    const password = body.password || body.phone || 'zentrix@123';
    const designation = (body.designation || body.role || 'Systems Support Engineer').trim();
    const dpUrl = body.dpUrl || body.dp_url || body.avatar || '';
    const phone = body.phone ? body.phone.trim() : '';
    const email = body.email ? body.email.trim() : '';
    const role = body.userRole || body.role || 'employee';
    const now = new Date().toISOString();

    // 1. Try inserting with extended schema (including designation, dp_url, phone, email)
    let inserted = false;
    try {
      await db.prepare(`
        INSERT INTO users (id, name, username, id_code, password, role, designation, dp_url, phone, email, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).bind(id, name, username, idCode, password, role, designation, dpUrl, phone, email, now).run();
      inserted = true;
    } catch {
      // 2. Try inserting with basic schema if columns don't exist yet
      try {
        await db.prepare(`
          INSERT INTO users (id, name, username, id_code, password, role, created_at)
          VALUES (?, ?, ?, ?, ?, ?, ?)
        `).bind(id, name, username, idCode, password, designation, now).run();
        inserted = true;
      } catch (basicErr: any) {
        // 3. Fallback replace
        await db.prepare(`
          INSERT OR REPLACE INTO users (id, name, username, id_code, password, role, created_at)
          VALUES (?, ?, ?, ?, ?, ?, ?)
        `).bind(id, name, username, idCode, password, designation, now).run();
        inserted = true;
      }
    }

    const newUser = {
      id,
      name,
      username,
      idCode,
      password,
      role: designation,
      designation,
      phone,
      email,
      avatar: dpUrl,
      dpUrl,
      createdAt: now
    };

    return c.json({ success: true, user: newUser, employee: newUser }, 201);
  } catch (err: any) {
    return c.json({ error: err.message }, 500);
  }
};

app.post('/api/users', handleCreateUser);
app.post('/api/employees', handleCreateUser);

// PUT /api/users/:id & /api/employees/:id - Update user in D1 users table
const handleUpdateUser = async (c: any) => {
  try {
    const db = c.env.DB;
    const id = c.req.param('id');
    const body = await c.req.json();
    const name = body.name ? body.name.trim() : undefined;
    const designation = (body.designation || body.role) ? (body.designation || body.role).trim() : undefined;
    const password = body.password ? body.password.trim() : undefined;
    const username = (body.username || body.phone || body.email) ? (body.username || body.phone || body.email).trim() : undefined;
    const dpUrl = (body.dpUrl || body.dp_url || body.avatar) ? (body.dpUrl || body.dp_url || body.avatar).trim() : undefined;
    const phone = body.phone ? body.phone.trim() : undefined;
    const email = body.email ? body.email.trim() : undefined;

    try {
      await db.prepare(`
        UPDATE users
        SET name = COALESCE(?, name),
            username = COALESCE(?, username),
            password = COALESCE(?, password),
            role = COALESCE(?, role),
            designation = COALESCE(?, designation),
            dp_url = COALESCE(?, dp_url),
            phone = COALESCE(?, phone),
            email = COALESCE(?, email)
        WHERE id = ?
      `).bind(name || null, username || null, password || null, designation || null, designation || null, dpUrl || null, phone || null, email || null, id).run();
    } catch {
      await db.prepare(`
        UPDATE users
        SET name = COALESCE(?, name),
            username = COALESCE(?, username),
            password = COALESCE(?, password),
            role = COALESCE(?, role)
        WHERE id = ?
      `).bind(name || null, username || null, password || null, designation || null, id).run();
    }

    return c.json({ success: true, message: 'User updated successfully' });
  } catch (err: any) {
    return c.json({ error: err.message }, 500);
  }
};

app.put('/api/users/:id', handleUpdateUser);
app.put('/api/employees/:id', handleUpdateUser);

// DELETE /api/users/:id & /api/employees/:id - Delete user from D1 users table
const handleDeleteUser = async (c: any) => {
  try {
    const db = c.env.DB;
    const id = c.req.param('id');
    await db.prepare('DELETE FROM users WHERE id = ?').bind(id).run();
    return c.json({ success: true, message: 'User deleted from users table' });
  } catch (err: any) {
    return c.json({ error: err.message }, 500);
  }
};

app.delete('/api/users/:id', handleDeleteUser);
app.delete('/api/employees/:id', handleDeleteUser);

// GET /api/systems
app.get('/api/systems', async (c) => {
  try {
    const db = c.env.DB;
    const { companyId } = c.req.query();
    let query = 'SELECT * FROM systems';
    const params: any[] = [];
    if (companyId) {
      query += ' WHERE company_id = ?';
      params.push(companyId);
    }
    const result = await db.prepare(query).bind(...params).all();
    return c.json({ success: true, systems: result.results });
  } catch (err: any) {
    return c.json({ error: err.message }, 500);
  }
});

// DELETE /api/tasks/:id
app.delete('/api/tasks/:id', async (c) => {
  try {
    const db = c.env.DB;
    const taskId = c.req.param('id');
    await db.prepare('DELETE FROM tasks WHERE id = ?').bind(taskId).run();
    return c.json({ success: true, message: 'Task deleted successfully' });
  } catch (err: any) {
    return c.json({ error: err.message }, 500);
  }
});

// POST /api/whatsapp/send
app.post('/api/whatsapp/send', async (c) => {
  try {
    const body = await c.req.json();
    const { phoneNumberId, accessToken, payload } = body;
    if (!phoneNumberId || !accessToken || !payload) {
      return c.json({ error: 'Missing phoneNumberId, accessToken or payload' }, 400);
    }

    const metaRes = await fetch(`https://graph.facebook.com/v20.0/${phoneNumberId}/messages`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const metaData: any = await metaRes.json();
    if (!metaRes.ok) {
      return c.json({
        success: false,
        error: metaData.error?.message || 'Meta Cloud API call failed',
        details: metaData
      }, metaRes.status as any);
    }

    return c.json({
      success: true,
      messageId: metaData.messages?.[0]?.id,
      metaResponse: metaData
    });
  } catch (err: any) {
    return c.json({ error: err.message }, 500);
  }
});

// ==========================================
// 5. WHATSAPP CLOUD API & TEMPLATES (Stored in Cloudflare D1)
// ==========================================

// Helper to ensure whatsapp_templates table exists in D1 and seed initial templates
async function ensureWhatsAppTemplatesTable(db: D1Database) {
  try {
    await db.prepare(`
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
      )
    `).run();

    // Check if table is empty; if so, seed default templates
    const countCheck = await db.prepare('SELECT count(*) as count FROM whatsapp_templates').first();
    if (countCheck && (countCheck as any).count === 0) {
      const now = new Date().toISOString();
      const initialTemplates = [
        {
          id: 'tpl_help_ticket_001',
          name: 'help_ticket',
          category: 'UTILITY',
          language: 'en_US',
          status: 'APPROVED',
          body_text: 'Hi {{1}}, thank you for contacting Zentrixs! 🙏\n\nYour support ticket {{2}} has been raised successfully.\n\nYou can check your ticket status on our website.',
          components_json: JSON.stringify([{ type: 'BODY', text: 'Hi {{1}}, thank you for contacting Zentrixs! 🙏\n\nYour support ticket {{2}} has been raised successfully.\n\nYou can check your ticket status on our website.' }])
        },
        {
          id: 'tpl_offersms_002',
          name: 'offersms',
          category: 'MARKETING',
          language: 'en_US',
          status: 'APPROVED',
          body_text: '🚨 "Premium Salon Upgrade - Limited Time Offer! Enjoy exclusive automation packages designed to grow your business.',
          components_json: JSON.stringify([{ type: 'BODY', text: '🚨 "Premium Salon Upgrade - Limited Time Offer! Enjoy exclusive automation packages designed to grow your business.' }])
        },
        {
          id: 'tpl_marketing_welcome_003',
          name: 'marketing_welcome',
          category: 'MARKETING',
          language: 'en_US',
          status: 'APPROVED',
          body_text: 'Hello {{1}} 🤩 Thank you for showing interest in Zentrixs Enterprise AI Solutions. Our specialist will connect with you shortly.',
          components_json: JSON.stringify([{ type: 'BODY', text: 'Hello {{1}} 🤩 Thank you for showing interest in Zentrixs Enterprise AI Solutions. Our specialist will connect with you shortly.' }])
        },
        {
          id: 'tpl_welcome_for_website_004',
          name: 'welcome_for_website',
          category: 'UTILITY',
          language: 'en_US',
          status: 'APPROVED',
          body_text: 'HelloHello {{1}} 🤩 Thank you for visiting our website. Your request has been received by our support team.',
          components_json: JSON.stringify([{ type: 'BODY', text: 'HelloHello {{1}} 🤩 Thank you for visiting our website. Your request has been received by our support team.' }])
        },
        {
          id: 'tpl_ticket_update_005',
          name: 'ticket_update',
          category: 'UTILITY',
          language: 'en_US',
          status: 'APPROVED',
          body_text: 'Hello {{1}}, your ticket {{2}} status has been updated to {{3}}. Zentrixs engineer: {{4}}.',
          components_json: JSON.stringify([{ type: 'BODY', text: 'Hello {{1}}, your ticket {{2}} status has been updated to {{3}}. Zentrixs engineer: {{4}}.' }])
        }
      ];

      for (const tpl of initialTemplates) {
        await db.prepare(`
          INSERT OR IGNORE INTO whatsapp_templates (id, name, category, language, status, body_text, components_json, created_at, updated_at)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).bind(tpl.id, tpl.name, tpl.category, tpl.language, tpl.status, tpl.body_text, tpl.components_json, now, now).run();
      }
    }
  } catch (e) {
    console.error('ensureWhatsAppTemplatesTable error:', e);
  }
}

// GET /api/whatsapp/templates - Load stored templates directly from Cloudflare D1
app.get('/api/whatsapp/templates', async (c) => {
  try {
    const db = c.env.DB;
    if (!db) {
      return c.json({ error: 'DB binding not attached' }, 500);
    }
    await ensureWhatsAppTemplatesTable(db);
    const { results } = await db.prepare('SELECT * FROM whatsapp_templates ORDER BY name ASC').all();
    
    const templates = (results || []).map((row: any) => ({
      id: row.id,
      name: row.name,
      category: row.category || 'UTILITY',
      language: row.language || 'en_US',
      status: row.status || 'APPROVED',
      bodyText: row.body_text || '',
      components: row.components_json ? JSON.parse(row.components_json) : [],
      qualityRating: row.quality_rating || undefined,
      updatedAt: row.updated_at
    }));

    return c.json({
      success: true,
      count: templates.length,
      templates,
      source: 'cloudflare_d1'
    });
  } catch (err: any) {
    return c.json({ error: err.message }, 500);
  }
});

// POST /api/whatsapp/templates - Fetch live from Meta, store & upsert to Cloudflare D1, return updated list
app.post('/api/whatsapp/templates', async (c) => {
  try {
    const db = c.env.DB;
    const body = await c.req.json();
    const { wabaId, accessToken, templates: incomingTemplates } = body;

    if (db) {
      await ensureWhatsAppTemplatesTable(db);
    }

    let metaTemplates: any[] = [];

    // 1. Fetch live from Meta Graph API if credentials are provided
    if (wabaId && accessToken) {
      try {
        const metaRes = await fetch(`https://graph.facebook.com/v20.0/${wabaId}/message_templates?limit=50`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          }
        });

        const metaData: any = await metaRes.json();
        if (metaRes.ok && Array.isArray(metaData.data)) {
          metaTemplates = (metaData.data || []).map((item: any) => {
            const bodyComp = (item.components || []).find((comp: any) => comp.type === 'BODY') || {};
            return {
              id: item.id || `tpl_${item.name}`,
              name: item.name,
              status: (item.status || 'IN_REVIEW').toUpperCase(),
              category: (item.category || 'UTILITY').toUpperCase(),
              language: item.language || 'en_US',
              bodyText: bodyComp.text || '',
              components: item.components || [],
              qualityRating: item.quality_score?.score
            };
          });
        } else {
          // If Meta API fails, check if we have stored templates in Cloudflare D1 to serve gracefully
          if (db) {
            const { results } = await db.prepare('SELECT * FROM whatsapp_templates ORDER BY name ASC').all();
            if (results && results.length > 0) {
              const stored = results.map((row: any) => ({
                id: row.id,
                name: row.name,
                category: row.category || 'UTILITY',
                language: row.language || 'en_US',
                status: row.status || 'APPROVED',
                bodyText: row.body_text || '',
                components: row.components_json ? JSON.parse(row.components_json) : [],
                qualityRating: row.quality_rating || undefined,
                updatedAt: row.updated_at
              }));
              return c.json({
                success: true,
                count: stored.length,
                templates: stored,
                source: 'cloudflare_d1_fallback',
                notice: metaData.error?.message || 'Meta API returned error, serving stored Cloudflare D1 templates'
              });
            }
          }
          return c.json({
            success: false,
            error: metaData.error?.message || 'Meta Cloud API template fetch failed',
            details: metaData
          }, metaRes.status as any);
        }
      } catch (fetchErr: any) {
        // Network fallback
        if (db) {
          const { results } = await db.prepare('SELECT * FROM whatsapp_templates ORDER BY name ASC').all();
          if (results && results.length > 0) {
            const stored = results.map((row: any) => ({
              id: row.id,
              name: row.name,
              category: row.category || 'UTILITY',
              language: row.language || 'en_US',
              status: row.status || 'APPROVED',
              bodyText: row.body_text || '',
              components: row.components_json ? JSON.parse(row.components_json) : [],
              qualityRating: row.quality_rating || undefined,
              updatedAt: row.updated_at
            }));
            return c.json({ success: true, count: stored.length, templates: stored, source: 'cloudflare_d1_fallback' });
          }
        }
        return c.json({ error: fetchErr.message }, 500);
      }
    } else if (Array.isArray(incomingTemplates) && incomingTemplates.length > 0) {
      metaTemplates = incomingTemplates;
    } else {
      // If no credentials or templates passed, return existing stored templates from D1
      if (db) {
        const { results } = await db.prepare('SELECT * FROM whatsapp_templates ORDER BY name ASC').all();
        const stored = (results || []).map((row: any) => ({
          id: row.id,
          name: row.name,
          category: row.category || 'UTILITY',
          language: row.language || 'en_US',
          status: row.status || 'APPROVED',
          bodyText: row.body_text || '',
          components: row.components_json ? JSON.parse(row.components_json) : [],
          qualityRating: row.quality_rating || undefined,
          updatedAt: row.updated_at
        }));
        return c.json({ success: true, count: stored.length, templates: stored, source: 'cloudflare_d1' });
      }
      return c.json({ error: 'Missing wabaId or accessToken' }, 400);
    }

    // 2. Persist / Upsert all fetched templates into Cloudflare D1
    if (db && metaTemplates.length > 0) {
      const now = new Date().toISOString();
      for (const tpl of metaTemplates) {
        const id = tpl.id || `tpl_${tpl.name}`;
        const name = tpl.name;
        const category = (tpl.category || 'UTILITY').toUpperCase();
        const language = tpl.language || 'en_US';
        const status = (tpl.status || 'APPROVED').toUpperCase();
        const bodyText = tpl.bodyText || '';
        const componentsJson = JSON.stringify(tpl.components || []);
        const qualityRating = tpl.qualityRating || null;

        await db.prepare(`
          INSERT INTO whatsapp_templates (id, name, category, language, status, body_text, components_json, quality_rating, updated_at)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
          ON CONFLICT(id) DO UPDATE SET
            name = excluded.name,
            category = excluded.category,
            language = excluded.language,
            status = excluded.status,
            body_text = excluded.body_text,
            components_json = excluded.components_json,
            quality_rating = excluded.quality_rating,
            updated_at = excluded.updated_at
        `).bind(id, name, category, language, status, bodyText, componentsJson, qualityRating, now).run();
      }

      // Query full list of templates from Cloudflare D1
      const { results } = await db.prepare('SELECT * FROM whatsapp_templates ORDER BY name ASC').all();
      const allSaved = (results || []).map((row: any) => ({
        id: row.id,
        name: row.name,
        category: row.category || 'UTILITY',
        language: row.language || 'en_US',
        status: row.status || 'APPROVED',
        bodyText: row.body_text || '',
        components: row.components_json ? JSON.parse(row.components_json) : [],
        qualityRating: row.quality_rating || undefined,
        updatedAt: row.updated_at
      }));

      return c.json({
        success: true,
        count: allSaved.length,
        templates: allSaved,
        savedToD1: true,
        source: 'meta_saved_to_d1'
      });
    }

    return c.json({ success: true, count: metaTemplates.length, templates: metaTemplates });
  } catch (err: any) {
    return c.json({ error: err.message }, 500);
  }
});

// POST /api/whatsapp/templates/sync - Direct sync / save templates array to Cloudflare D1
app.post('/api/whatsapp/templates/sync', async (c) => {
  try {
    const db = c.env.DB;
    if (!db) {
      return c.json({ error: 'DB binding not attached' }, 500);
    }
    await ensureWhatsAppTemplatesTable(db);
    const body = await c.req.json();
    const templates = body.templates || [];

    if (!Array.isArray(templates) || templates.length === 0) {
      return c.json({ error: 'Templates array required' }, 400);
    }

    const now = new Date().toISOString();
    for (const tpl of templates) {
      const id = tpl.id || `tpl_${tpl.name}`;
      const name = tpl.name;
      const category = (tpl.category || 'UTILITY').toUpperCase();
      const language = tpl.language || 'en_US';
      const status = (tpl.status || 'APPROVED').toUpperCase();
      const bodyText = tpl.bodyText || '';
      const componentsJson = JSON.stringify(tpl.components || []);
      const qualityRating = tpl.qualityRating || null;

      await db.prepare(`
        INSERT INTO whatsapp_templates (id, name, category, language, status, body_text, components_json, quality_rating, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(id) DO UPDATE SET
          name = excluded.name,
          category = excluded.category,
          language = excluded.language,
          status = excluded.status,
          body_text = excluded.body_text,
          components_json = excluded.components_json,
          quality_rating = excluded.quality_rating,
          updated_at = excluded.updated_at
      `).bind(id, name, category, language, status, bodyText, componentsJson, qualityRating, now).run();
    }

    const { results } = await db.prepare('SELECT * FROM whatsapp_templates ORDER BY name ASC').all();
    const allSaved = (results || []).map((row: any) => ({
      id: row.id,
      name: row.name,
      category: row.category || 'UTILITY',
      language: row.language || 'en_US',
      status: row.status || 'APPROVED',
      bodyText: row.body_text || '',
      components: row.components_json ? JSON.parse(row.components_json) : [],
      qualityRating: row.quality_rating || undefined,
      updatedAt: row.updated_at
    }));

    return c.json({ success: true, count: allSaved.length, templates: allSaved, savedToD1: true });
  } catch (err: any) {
    return c.json({ error: err.message }, 500);
  }
});

// ==========================================
// 6. WHATSAPP DISPATCH LOGS (Stored in Cloudflare D1)
// ==========================================

async function ensureWhatsAppLogsTable(db: D1Database) {
  try {
    await db.prepare(`
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
      )
    `).run();

    await db.prepare('CREATE INDEX IF NOT EXISTS idx_whatsapp_logs_timestamp ON whatsapp_logs(timestamp DESC)').run();
    await db.prepare('CREATE INDEX IF NOT EXISTS idx_whatsapp_logs_ticket ON whatsapp_logs(ticket_number)').run();

    const countCheck = await db.prepare('SELECT count(*) as count FROM whatsapp_logs').first();
    if (countCheck && (countCheck as any).count === 0) {
      const initialLogs = [
        {
          id: 'log_init_001',
          recipient_phone: '+91 98765 11223',
          recipient_name: 'Deepak sahu',
          template_name: 'help_ticket',
          language: 'English (US)',
          ticket_number: 'tkt-2026-101',
          status: 'SENT',
          message_id: 'wamid.HBgMOTE5ODc2NTExMjIzFQIAERgSRTI0NkU2NEQ0NkQzMzE2QUEA',
          timestamp: new Date(Date.now() - 1000 * 60 * 35).toISOString(),
          trigger_type: 'TICKET_CREATED',
          message_preview: 'Hi Deepak sahu, thank you for contacting Zentrixs! 🙏 Your support ticket tkt-2026-101 has been raised successfully.'
        },
        {
          id: 'log_init_002',
          recipient_phone: '+91 98765 11223',
          recipient_name: 'Cirti Care Admin',
          template_name: 'help_ticket',
          language: 'English (US)',
          ticket_number: 'tkt-2026-102',
          status: 'SENT',
          message_id: 'wamid.HBgMOTE5ODc2NTExMjIzFQIAERgSRTI0NkU2NEQ0NkQzMzE2QUFB',
          timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
          trigger_type: 'TICKET_CREATED',
          message_preview: 'Hi Cirti Care Admin, thank you for contacting Zentrixs! 🙏 Your support ticket tkt-2026-102 has been raised successfully.'
        }
      ];

      for (const log of initialLogs) {
        await db.prepare(`
          INSERT OR IGNORE INTO whatsapp_logs (id, recipient_phone, recipient_name, template_name, language, ticket_number, status, message_id, timestamp, trigger_type, message_preview)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).bind(
          log.id,
          log.recipient_phone,
          log.recipient_name,
          log.template_name,
          log.language,
          log.ticket_number,
          log.status,
          log.message_id,
          log.timestamp,
          log.trigger_type,
          log.message_preview
        ).run();
      }
    }
  } catch (e) {
    console.error('ensureWhatsAppLogsTable error:', e);
  }
}

// GET /api/whatsapp/logs - Get dispatch logs from D1 database
app.get('/api/whatsapp/logs', async (c) => {
  try {
    const db = c.env.DB;
    await ensureWhatsAppLogsTable(db);

    const { results } = await db.prepare('SELECT * FROM whatsapp_logs ORDER BY timestamp DESC LIMIT 200').all();
    const logs = (results || []).map((row: any) => ({
      id: row.id,
      recipientPhone: row.recipient_phone,
      recipientName: row.recipient_name || '',
      templateName: row.template_name || '',
      language: row.language || 'English (US)',
      ticketNumber: row.ticket_number || undefined,
      status: row.status || 'SENT',
      messageId: row.message_id || undefined,
      error: row.error || undefined,
      timestamp: row.timestamp,
      triggerType: row.trigger_type || 'TICKET_CREATED',
      messagePreview: row.message_preview || ''
    }));

    return c.json({ success: true, count: logs.length, logs });
  } catch (err: any) {
    return c.json({ error: err.message }, 500);
  }
});

// POST /api/whatsapp/logs - Save/record a dispatch log in D1 database
app.post('/api/whatsapp/logs', async (c) => {
  try {
    const db = c.env.DB;
    await ensureWhatsAppLogsTable(db);

    const body = await c.req.json();
    const id = body.id || `log_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const recipientPhone = body.recipientPhone || body.recipient_phone || '';
    const recipientName = body.recipientName || body.recipient_name || '';
    const templateName = body.templateName || body.template_name || '';
    const language = body.language || 'English (US)';
    const ticketNumber = body.ticketNumber || body.ticket_number || null;
    const status = body.status || 'SENT';
    const messageId = body.messageId || body.message_id || null;
    const error = body.error || null;
    const timestamp = body.timestamp || new Date().toISOString();
    const triggerType = body.triggerType || body.trigger_type || 'TICKET_CREATED';
    const messagePreview = body.messagePreview || body.message_preview || '';

    await db.prepare(`
      INSERT OR REPLACE INTO whatsapp_logs 
      (id, recipient_phone, recipient_name, template_name, language, ticket_number, status, message_id, error, timestamp, trigger_type, message_preview)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      id,
      recipientPhone,
      recipientName,
      templateName,
      language,
      ticketNumber,
      status,
      messageId,
      error,
      timestamp,
      triggerType,
      messagePreview
    ).run();

    return c.json({
      success: true,
      log: {
        id,
        recipientPhone,
        recipientName,
        templateName,
        language,
        ticketNumber,
        status,
        messageId,
        error,
        timestamp,
        triggerType,
        messagePreview
      }
    });
  } catch (err: any) {
    return c.json({ error: err.message }, 500);
  }
});

// DELETE /api/whatsapp/logs - Clear logs from D1 database
app.delete('/api/whatsapp/logs', async (c) => {
  try {
    const db = c.env.DB;
    await ensureWhatsAppLogsTable(db);
    await db.prepare('DELETE FROM whatsapp_logs').run();
    return c.json({ success: true, message: 'All WhatsApp dispatch logs cleared' });
  } catch (err: any) {
    return c.json({ error: err.message }, 500);
  }
});

// ==========================================
// 7. WHATSAPP CREDENTIALS & CONFIG (Stored in Cloudflare D1)
// ==========================================

async function ensureWhatsAppConfigTable(db: D1Database) {
  try {
    await db.prepare(`
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
      )
    `).run();

    await db.prepare(`
      INSERT OR IGNORE INTO whatsapp_config (id, phone_number_id, waba_id, access_token, template_name, language_code, is_enabled, test_phone_number)
      VALUES ('default', '', '', '', 'help_ticket', 'en_US', 1, '')
    `).run();
  } catch (e) {
    console.error('ensureWhatsAppConfigTable error:', e);
  }
}

// GET /api/whatsapp/config - Load persistent WhatsApp Meta configuration & credentials
app.get('/api/whatsapp/config', async (c) => {
  try {
    const db = c.env.DB;
    await ensureWhatsAppConfigTable(db);

    const row: any = await db.prepare('SELECT * FROM whatsapp_config WHERE id = ?').bind('default').first();
    if (!row) {
      return c.json({
        success: true,
        config: {
          phoneNumberId: '',
          wabaId: '',
          accessToken: '',
          templateName: 'help_ticket',
          languageCode: 'en_US',
          isEnabled: true,
          testPhoneNumber: ''
        }
      });
    }

    return c.json({
      success: true,
      config: {
        phoneNumberId: row.phone_number_id || '',
        wabaId: row.waba_id || '',
        accessToken: row.access_token || '',
        templateName: row.template_name || 'help_ticket',
        languageCode: row.language_code || 'en_US',
        isEnabled: row.is_enabled === 1 || row.is_enabled === true,
        testPhoneNumber: row.test_phone_number || '',
        lastUpdated: row.updated_at
      }
    });
  } catch (err: any) {
    return c.json({ error: err.message }, 500);
  }
});

// POST /api/whatsapp/config - Save persistent WhatsApp Meta credentials & settings to D1
app.post('/api/whatsapp/config', async (c) => {
  try {
    const db = c.env.DB;
    await ensureWhatsAppConfigTable(db);

    const body = await c.req.json();
    const phoneNumberId = body.phoneNumberId ?? body.phone_number_id ?? '';
    const wabaId = body.wabaId ?? body.waba_id ?? '';
    const accessToken = body.accessToken ?? body.access_token ?? '';
    const templateName = body.templateName ?? body.template_name ?? 'help_ticket';
    const languageCode = body.languageCode ?? body.language_code ?? 'en_US';
    const isEnabled = body.isEnabled !== false ? 1 : 0;
    const testPhoneNumber = body.testPhoneNumber ?? body.test_phone_number ?? '';
    const updatedAt = new Date().toISOString();

    await db.prepare(`
      INSERT INTO whatsapp_config (id, phone_number_id, waba_id, access_token, template_name, language_code, is_enabled, test_phone_number, updated_at)
      VALUES ('default', ?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(id) DO UPDATE SET
        phone_number_id = excluded.phone_number_id,
        waba_id = excluded.waba_id,
        access_token = excluded.access_token,
        template_name = excluded.template_name,
        language_code = excluded.language_code,
        is_enabled = excluded.is_enabled,
        test_phone_number = excluded.test_phone_number,
        updated_at = excluded.updated_at
    `).bind(
      phoneNumberId,
      wabaId,
      accessToken,
      templateName,
      languageCode,
      isEnabled,
      testPhoneNumber,
      updatedAt
    ).run();

    return c.json({
      success: true,
      message: 'WhatsApp credentials and configuration saved in Cloudflare D1 successfully',
      config: {
        phoneNumberId,
        wabaId,
        accessToken,
        templateName,
        languageCode,
        isEnabled: isEnabled === 1,
        testPhoneNumber,
        lastUpdated: updatedAt
      }
    });
  } catch (err: any) {
    return c.json({ error: err.message }, 500);
  }
});

export default app;

