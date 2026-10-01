import { Hono } from 'https://esm.sh/hono';
import { cors } from 'https://esm.sh/hono/cors';

const app = new Hono();

// Enable CORS for frontend requests
app.use('*', cors({
  origin: '*',
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
  exposeHeaders: ['Content-Length'],
  maxAge: 86400,
}));

// Root / Health check
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
    let company = null;

    if (db) {
      company = await db
        .prepare('SELECT * FROM companies WHERE LOWER(code) = LOWER(?) OR LOWER(name) LIKE LOWER(?)')
        .bind(companyNameOrCode.trim(), `%${companyNameOrCode.trim()}%`)
        .first();
    }

    const session = {
      user: userName || (company ? company.contact_person : 'Client User'),
      role: 'company',
      companyId: company ? company.id : 'comp_piramal',
      companyName: company ? company.name : companyNameOrCode,
      email: company ? company.email : 'client@zentrixs.com',
      idCode: company ? company.code : 'CLIENT-01'
    };

    return c.json({ success: true, session });
  } catch (err) {
    return c.json({ error: err.message || 'Internal server error' }, 500);
  }
});

// Admin Login
app.post('/api/auth/admin-login', async (c) => {
  try {
    const { username, idCode, password } = await c.req.json();
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
  } catch (err) {
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
    if (!db) {
      return c.json({ error: 'D1 Database binding (DB) not configured in Cloudflare Settings' }, 500);
    }

    const { companyId, status, assignedTo, search } = c.req.query();

    let query = 'SELECT * FROM tasks WHERE 1=1';
    const params = [];

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

    const tasks = (result.results || []).map((row) => ({
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
  } catch (err) {
    return c.json({ error: err.message }, 500);
  }
});

// POST /api/tasks - Company raises a new task
app.post('/api/tasks', async (c) => {
  try {
    const db = c.env.DB;
    if (!db) {
      return c.json({ error: 'D1 Database binding (DB) not configured' }, 500);
    }

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
    try {
      await db.prepare(`
        INSERT INTO task_history (id, task_id, action, performed_by, details)
        VALUES (?, ?, 'CREATED', ?, ?)
      `).bind(
        `hist_${Date.now()}`,
        id,
        body.personName || 'Company User',
        `Ticket ${ticketNumber} raised for ${body.systemName}`
      ).run();
    } catch (_) {}

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
  } catch (err) {
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

    return c.json({ success: true, message: `Task assigned to ${assignedTo}` });
  } catch (err) {
    return c.json({ error: err.message }, 500);
  }
});

// PUT /api/tasks/:id/status - Update task status and remarks
app.put('/api/tasks/:id/status', async (c) => {
  try {
    const db = c.env.DB;
    const taskId = c.req.param('id');
    const { status, notes } = await c.req.json();

    const now = new Date().toISOString();
    await db.prepare(`
      UPDATE tasks 
      SET status = COALESCE(?, status), notes = COALESCE(?, notes), updated_at = ?
      WHERE id = ?
    `).bind(status || null, notes || null, now, taskId).run();

    return c.json({ success: true, message: 'Status updated successfully' });
  } catch (err) {
    return c.json({ error: err.message }, 500);
  }
});

// GET /api/stats - Dashboard analytics
app.get('/api/stats', async (c) => {
  try {
    const db = c.env.DB;
    const counts = await db.prepare('SELECT status, count(*) as count FROM tasks GROUP BY status').all();
    const totalCompanies = await db.prepare('SELECT count(*) as count FROM companies').first();

    return c.json({
      success: true,
      stats: counts.results,
      totalCompanies: totalCompanies ? totalCompanies.count : 0
    });
  } catch (err) {
    return c.json({ error: err.message }, 500);
  }
});

// GET /api/companies
app.get('/api/companies', async (c) => {
  try {
    const db = c.env.DB;
    const result = await db.prepare('SELECT * FROM companies ORDER BY name ASC').all();
    return c.json({ success: true, companies: result.results });
  } catch (err) {
    return c.json({ error: err.message }, 500);
  }
});

// GET /api/employees - Team engineers list
app.get('/api/employees', async (c) => {
  try {
    const db = c.env.DB;
    const result = await db.prepare('SELECT id, name, email, role FROM users WHERE role IN ("admin", "support_engineer")').all();
    return c.json({ success: true, employees: result.results });
  } catch (err) {
    return c.json({ error: err.message }, 500);
  }
});

// GET /api/systems
app.get('/api/systems', async (c) => {
  try {
    const db = c.env.DB;
    const { companyId } = c.req.query();
    let query = 'SELECT * FROM systems';
    const params = [];
    if (companyId) {
      query += ' AND company_id = ?';
      params.push(companyId);
    }
    const result = await db.prepare(query).bind(...params).all();
    return c.json({ success: true, systems: result.results });
  } catch (err) {
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
  } catch (err) {
    return c.json({ error: err.message }, 500);
  }
});

export default app;
