/**
 * =========================================================================
 * Zentrixs Enterprise API - 100% Native Cloudflare Worker (Zero Dependencies)
 * Paste this directly into the Cloudflare Web Editor (worker.js)
 * =========================================================================
 */

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Content-Type': 'application/json'
};

const jsonResponse = (data, status = 200) => {
  return new Response(JSON.stringify(data), {
    status,
    headers: corsHeaders
  });
};

// Edge Caching Helper to minimize D1 database read queries
const cachedJsonResponse = (data, status = 200, maxAge = 30) => {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      ...corsHeaders,
      'Cache-Control': `public, max-age=${maxAge}, stale-while-revalidate=60`
    }
  });
};

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;
    const method = request.method;

    // Handle CORS preflight
    if (method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    // Health check
    if (path === '/' && method === 'GET') {
      return jsonResponse({
        status: 'ONLINE',
        service: 'Zentrixs Enterprise Task API (Native Cloudflare)',
        timestamp: new Date().toISOString()
      });
    }

    try {
      const db = env.DB;

      // 1. Company Login: POST /api/auth/company-login
      if (path === '/api/auth/company-login' && method === 'POST') {
        const body = await request.json();
        const search = (body.companyNameOrCode || '').trim();
        const password = (body.password || '').trim();
        let company = null;

        if (db) {
          company = await db
            .prepare('SELECT * FROM companies WHERE LOWER(code) = LOWER(?) OR LOWER(name) LIKE LOWER(?)')
            .bind(search, `%${search}%`)
            .first();

          if (!company) {
            return jsonResponse({ error: 'Access Denied: Yeh Company ID registered nahi hai. Keval Admin dwara registered companies hi login kar sakti hain.' }, 404);
          }

          if (company.password && company.password !== password) {
            return jsonResponse({ error: 'Access Denied: Password galat hai. Kripya Admin dwara diya gaya password dalein.' }, 401);
          }
        }

        const session = {
          user: body.userName || (company ? company.contact_person : 'Client User'),
          role: 'company',
          companyId: company ? company.id : 'comp_piramal',
          companyName: company ? company.name : search,
          email: company ? company.email : 'client@zentrixs.com',
          idCode: company ? company.code : search
        };

        return jsonResponse({ success: true, session });
      }

      // 2. Admin Login: POST /api/auth/admin-login
      if (path === '/api/auth/admin-login' && method === 'POST') {
        const body = await request.json();
        const session = {
          user: body.username || 'Super Admin',
          role: 'admin',
          idCode: body.idCode || 'ADM-001',
          email: 'admin@zentrixs.com'
        };
        return jsonResponse({ success: true, session });
      }

      // 3. Get Tasks: GET /api/tasks
      if (path === '/api/tasks' && method === 'GET') {
        if (!db) return jsonResponse({ error: 'DB binding not attached' }, 500);

        const companyId = url.searchParams.get('companyId');
        const status = url.searchParams.get('status');
        const assignedTo = url.searchParams.get('assignedTo');
        const search = url.searchParams.get('search');

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

        query += ' ORDER BY created_at DESC LIMIT 50';
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

        return cachedJsonResponse({ success: true, count: tasks.length, tasks }, 200, 30);
      }

      // 4. Create Task: POST /api/tasks
      if (path === '/api/tasks' && method === 'POST') {
        if (!db) return jsonResponse({ error: 'DB binding not attached' }, 500);

        const body = await request.json();
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

        return jsonResponse({
          success: true,
          task: { id, ticketNumber, ...body, status: 'Pending', createdAt: now, updatedAt: now }
        }, 201);
      }

      // 5. Assign Task: PUT /api/tasks/:id/assign
      if (path.startsWith('/api/tasks/') && path.endsWith('/assign') && method === 'PUT') {
        const parts = path.split('/');
        const taskId = parts[3];
        const body = await request.json();
        const now = new Date().toISOString();

        await db.prepare(`
          UPDATE tasks 
          SET assigned_to = ?, status = CASE WHEN status = 'Pending' THEN 'In Progress' ELSE status END, updated_at = ?
          WHERE id = ?
        `).bind(body.assignedTo, now, taskId).run();

        return jsonResponse({ success: true, message: `Task assigned to ${body.assignedTo}` });
      }

      // 6. Update Status: PUT /api/tasks/:id/status
      if (path.startsWith('/api/tasks/') && path.endsWith('/status') && method === 'PUT') {
        const parts = path.split('/');
        const taskId = parts[3];
        const body = await request.json();
        const now = new Date().toISOString();

        await db.prepare(`
          UPDATE tasks 
          SET status = COALESCE(?, status), notes = COALESCE(?, notes), updated_at = ?
          WHERE id = ?
        `).bind(body.status || null, body.notes || null, now, taskId).run();

        return jsonResponse({ success: true, message: 'Status updated' });
      }

      // 7. Companies: GET & POST /api/companies
      if (path === '/api/companies' && method === 'GET') {
        if (!db) return cachedJsonResponse({ companies: [] }, 200, 60);
        const result = await db.prepare('SELECT * FROM companies ORDER BY name ASC LIMIT 50').all();
        return cachedJsonResponse({ success: true, companies: result.results }, 200, 60);
      }

      if (path === '/api/companies' && method === 'POST') {
        if (!db) return jsonResponse({ error: 'DB binding not attached' }, 500);
        const body = await request.json();
        const id = body.id || `comp_${Date.now()}`;
        const logoUrl = body.logoUrl || body.avatar || null;
        await db.prepare(`
          INSERT INTO companies (id, name, code, password, contact_person, email, phone, logo_url)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `).bind(
          id,
          body.name,
          (body.code || '').trim().toUpperCase(),
          (body.password || 'client@123').trim(),
          body.contactPerson || 'Manager',
          body.email || null,
          body.phone || null,
          logoUrl
        ).run();

        return jsonResponse({ success: true, company: { id, ...body, logoUrl } }, 201);
      }

      // Update Company Logo: PUT /api/companies/:id/logo
      if (path.startsWith('/api/companies/') && path.endsWith('/logo') && method === 'PUT') {
        const parts = path.split('/');
        const companyId = parts[3];
        const body = await request.json();
        const logoUrl = body.logoUrl || body.avatar || null;
        if (!db) return jsonResponse({ error: 'DB binding not attached' }, 500);

        await db.prepare('UPDATE companies SET logo_url = ? WHERE id = ?').bind(logoUrl, companyId).run();
        return jsonResponse({ success: true, message: 'Company logo updated successfully', logoUrl });
      }

      // 8. Employees List: GET /api/employees
      if (path === '/api/employees' && method === 'GET') {
        if (!db) return cachedJsonResponse({ employees: [] }, 200, 60);
        const result = await db.prepare('SELECT id, name, email, role FROM users WHERE role IN ("admin", "support_engineer") LIMIT 50').all();
        return cachedJsonResponse({ success: true, employees: result.results }, 200, 60);
      }

      // 9. Systems List: GET /api/systems
      if (path === '/api/systems' && method === 'GET') {
        if (!db) return cachedJsonResponse({ systems: [] }, 200, 60);
        const companyId = url.searchParams.get('companyId');
        let query = 'SELECT * FROM systems';
        const params = [];
        if (companyId) {
          query += ' AND company_id = ?';
          params.push(companyId);
        }
        query += ' LIMIT 50';
        const result = await db.prepare(query).bind(...params).all();
        return cachedJsonResponse({ success: true, systems: result.results }, 200, 60);
      }

      // 10. WhatsApp Send Message: POST /api/whatsapp/send
      if (path === '/api/whatsapp/send' && method === 'POST') {
        const body = await request.json();
        const { phoneNumberId, accessToken, payload } = body;
        if (!phoneNumberId || !accessToken || !payload) {
          return jsonResponse({ error: 'Missing phoneNumberId, accessToken or payload' }, 400);
        }

        const metaRes = await fetch(`https://graph.facebook.com/v20.0/${phoneNumberId}/messages`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        });

        const metaData = await metaRes.json();
        if (!metaRes.ok) {
          return jsonResponse({
            success: false,
            error: metaData.error?.message || 'Meta Cloud API call failed',
            details: metaData
          }, metaRes.status);
        }

        return jsonResponse({
          success: true,
          messageId: metaData.messages?.[0]?.id,
          metaResponse: metaData
        }, 200);
      }

      // 11. WhatsApp Fetch Templates: POST /api/whatsapp/templates
      if (path === '/api/whatsapp/templates' && method === 'POST') {
        const body = await request.json();
        const { wabaId, accessToken } = body;
        if (!wabaId || !accessToken) {
          return jsonResponse({ error: 'Missing wabaId or accessToken' }, 400);
        }

        const metaRes = await fetch(`https://graph.facebook.com/v20.0/${wabaId}/message_templates?limit=50`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          }
        });

        const metaData = await metaRes.json();
        if (!metaRes.ok) {
          return jsonResponse({
            success: false,
            error: metaData.error?.message || 'Meta Cloud API template fetch failed',
            details: metaData
          }, metaRes.status);
        }

        const templates = (metaData.data || []).map(item => {
          const bodyComp = (item.components || []).find(c => c.type === 'BODY') || {};
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

        return jsonResponse({ success: true, templates }, 200);
      }

      return jsonResponse({ error: 'Endpoint Not Found', path }, 404);
    } catch (err) {
      return jsonResponse({ error: err.message }, 500);
    }
  }
};
