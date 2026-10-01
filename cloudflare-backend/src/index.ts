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

// GET /api/employees - Team engineers list
app.get('/api/employees', async (c) => {
  try {
    const db = c.env.DB;
    const result = await db.prepare('SELECT id, name, email, role FROM users WHERE role IN ("admin", "support_engineer")').all();
    return c.json({ success: true, employees: result.results });
  } catch (err: any) {
    return c.json({ error: err.message }, 500);
  }
});

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

// POST /api/whatsapp/templates
app.post('/api/whatsapp/templates', async (c) => {
  try {
    const body = await c.req.json();
    const { wabaId, accessToken } = body;
    if (!wabaId || !accessToken) {
      return c.json({ error: 'Missing wabaId or accessToken' }, 400);
    }

    const metaRes = await fetch(`https://graph.facebook.com/v20.0/${wabaId}/message_templates?limit=50`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    });

    const metaData: any = await metaRes.json();
    if (!metaRes.ok) {
      return c.json({
        success: false,
        error: metaData.error?.message || 'Meta Cloud API template fetch failed',
        details: metaData
      }, metaRes.status as any);
    }

    const templates = (metaData.data || []).map((item: any) => {
      const bodyComp = (item.components || []).find((comp: any) => comp.type === 'BODY') || {};
      return {
        id: item.id || `tpl_${item.name}`,
        name: item.name,
        status: item.status || 'IN_REVIEW',
        category: item.category || 'Utility',
        language: item.language || 'English (US)',
        bodyText: bodyComp.text || '',
        components: item.components || []
      };
    });

    return c.json({ success: true, templates });
  } catch (err: any) {
    return c.json({ error: err.message }, 500);
  }
});

// GET /api/companies - Retrieve all registered companies from D1
app.get('/api/companies', async (c) => {
  try {
    const db = c.env.DB;
    const { results } = await db.prepare(`SELECT * FROM companies ORDER BY name ASC`).all();
    return c.json({ success: true, companies: results || [] });
  } catch (err: any) {
    return c.json({ error: err.message }, 500);
  }
});

// POST /api/companies - Register a new company in D1
app.post('/api/companies', async (c) => {
  try {
    const db = c.env.DB;
    const body = await c.req.json();
    const id = body.id || `comp_${Date.now()}`;
    const name = body.name;
    const code = (body.code || '').toUpperCase();
    const password = body.password || 'client@123';
    const contactPerson = body.contactPerson || body.contact_person || '';
    const email = body.email || '';
    const phone = body.phone || '';
    const logoUrl = body.logoUrl || body.logo_url || null;

    if (!name || !code) {
      return c.json({ error: 'Company name and code are required' }, 400);
    }

    await db.prepare(`
      INSERT INTO companies (id, name, code, password, contact_person, email, phone, status, logo_url)
      VALUES (?, ?, ?, ?, ?, ?, ?, 'ACTIVE', ?)
    `).bind(id, name, code, password, contactPerson, email, phone, logoUrl).run();

    return c.json({
      success: true,
      company: {
        id,
        name,
        code,
        password,
        contact_person: contactPerson,
        email,
        phone,
        status: 'ACTIVE',
        logo_url: logoUrl
      }
    }, 201);
  } catch (err: any) {
    return c.json({ error: err.message }, 500);
  }
});

// PUT /api/companies/:id/logo - Update company logo in D1
app.put('/api/companies/:id/logo', async (c) => {
  try {
    const db = c.env.DB;
    const companyId = c.req.param('id');
    const body = await c.req.json();
    const logoUrl = body.logoUrl || body.logo_url;

    if (!logoUrl) {
      return c.json({ error: 'logoUrl is required' }, 400);
    }

    await db.prepare(`
      UPDATE companies 
      SET logo_url = ? 
      WHERE id = ? OR code = ?
    `).bind(logoUrl, companyId, companyId).run();

    return c.json({ success: true, message: 'Logo updated successfully', logoUrl });
  } catch (err: any) {
    return c.json({ error: err.message }, 500);
  }
});

export default app;
