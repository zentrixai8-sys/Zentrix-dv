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
          completionRemark: row.completion_remark || row.notes,
          completionFileUrl: row.completion_file_url,
          completionFileName: row.completion_file_name,
          completedAt: row.completed_at,
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
        const finalRemark = body.completionRemark || body.notes;

        try { await db.prepare('ALTER TABLE tasks ADD COLUMN completion_remark TEXT').run(); } catch (_) {}
        try { await db.prepare('ALTER TABLE tasks ADD COLUMN completion_file_url TEXT').run(); } catch (_) {}
        try { await db.prepare('ALTER TABLE tasks ADD COLUMN completion_file_name TEXT').run(); } catch (_) {}
        try { await db.prepare('ALTER TABLE tasks ADD COLUMN completed_at TEXT').run(); } catch (_) {}

        await db.prepare(`
          UPDATE tasks 
          SET status = COALESCE(?, status), 
              notes = COALESCE(?, notes),
              completion_remark = COALESCE(?, completion_remark),
              completion_file_url = COALESCE(?, completion_file_url),
              completion_file_name = COALESCE(?, completion_file_name),
              completed_at = CASE WHEN ? = 'Completed' THEN ? ELSE completed_at END,
              updated_at = ?
          WHERE id = ?
        `).bind(
          body.status || null, 
          finalRemark || null, 
          body.completionRemark || finalRemark || null,
          body.completionFileUrl || null,
          body.completionFileName || null,
          body.status || '',
          now,
          now, 
          taskId
        ).run();

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

      // 11. WhatsApp Stored Templates: GET /api/whatsapp/templates
      if (path === '/api/whatsapp/templates' && method === 'GET') {
        if (!db) return jsonResponse({ error: 'DB binding not attached' }, 500);

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

          const countCheck = await db.prepare('SELECT count(*) as count FROM whatsapp_templates').first();
          if (countCheck && countCheck.count === 0) {
            const now = new Date().toISOString();
            const initialTemplates = [
              { id: 'tpl_help_ticket_001', name: 'help_ticket', category: 'UTILITY', language: 'en_US', status: 'APPROVED', body_text: 'Hi {{1}}, thank you for contacting Zentrixs! 🙏\n\nYour support ticket {{2}} has been raised successfully.\n\nYou can check your ticket status on our website.', components_json: JSON.stringify([{ type: 'BODY', text: 'Hi {{1}}, thank you for contacting Zentrixs! 🙏\n\nYour support ticket {{2}} has been raised successfully.\n\nYou can check your ticket status on our website.' }]) },
              { id: 'tpl_offersms_002', name: 'offersms', category: 'MARKETING', language: 'en_US', status: 'APPROVED', body_text: '🚨 "Premium Salon Upgrade - Limited Time Offer! Enjoy exclusive automation packages designed to grow your business.', components_json: JSON.stringify([{ type: 'BODY', text: '🚨 "Premium Salon Upgrade - Limited Time Offer! Enjoy exclusive automation packages designed to grow your business.' }]) },
              { id: 'tpl_marketing_welcome_003', name: 'marketing_welcome', category: 'MARKETING', language: 'en_US', status: 'APPROVED', body_text: 'Hello {{1}} 🤩 Thank you for showing interest in Zentrixs Enterprise AI Solutions. Our specialist will connect with you shortly.', components_json: JSON.stringify([{ type: 'BODY', text: 'Hello {{1}} 🤩 Thank you for showing interest in Zentrixs Enterprise AI Solutions. Our specialist will connect with you shortly.' }]) },
              { id: 'tpl_welcome_for_website_004', name: 'welcome_for_website', category: 'UTILITY', language: 'en_US', status: 'APPROVED', body_text: 'HelloHello {{1}} 🤩 Thank you for visiting our website. Your request has been received by our support team.', components_json: JSON.stringify([{ type: 'BODY', text: 'HelloHello {{1}} 🤩 Thank you for visiting our website. Your request has been received by our support team.' }]) },
              { id: 'tpl_ticket_update_005', name: 'ticket_update', category: 'UTILITY', language: 'en_US', status: 'APPROVED', body_text: 'Hello {{1}}, your ticket {{2}} status has been updated to {{3}}. Zentrixs engineer: {{4}}.', components_json: JSON.stringify([{ type: 'BODY', text: 'Hello {{1}}, your ticket {{2}} status has been updated to {{3}}. Zentrixs engineer: {{4}}.' }]) }
            ];
            for (const tpl of initialTemplates) {
              await db.prepare(`
                INSERT OR IGNORE INTO whatsapp_templates (id, name, category, language, status, body_text, components_json, created_at, updated_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
              `).bind(tpl.id, tpl.name, tpl.category, tpl.language, tpl.status, tpl.body_text, tpl.components_json, now, now).run();
            }
          }

          const result = await db.prepare('SELECT * FROM whatsapp_templates ORDER BY name ASC').all();
          const templates = (result.results || []).map((row) => ({
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

          return jsonResponse({ success: true, count: templates.length, templates, source: 'cloudflare_d1' }, 200);
        } catch (dbErr) {
          return jsonResponse({ error: dbErr.message }, 500);
        }
      }

      // 12. WhatsApp Fetch & Store Templates: POST /api/whatsapp/templates
      if (path === '/api/whatsapp/templates' && method === 'POST') {
        const body = await request.json();
        const { wabaId, accessToken, templates: incomingTemplates } = body;

        let metaTemplates = [];

        if (wabaId && accessToken) {
          try {
            const metaRes = await fetch(`https://graph.facebook.com/v20.0/${wabaId}/message_templates?limit=50`, {
              method: 'GET',
              headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
              }
            });

            const metaData = await metaRes.json();
            if (metaRes.ok && Array.isArray(metaData.data)) {
              metaTemplates = (metaData.data || []).map(item => {
                const bodyComp = (item.components || []).find(c => c.type === 'BODY') || {};
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
              // If meta fails but DB has templates, return stored ones
              if (db) {
                const stored = await db.prepare('SELECT * FROM whatsapp_templates ORDER BY name ASC').all();
                if (stored.results && stored.results.length > 0) {
                  const list = stored.results.map(row => ({
                    id: row.id,
                    name: row.name,
                    category: row.category || 'UTILITY',
                    language: row.language || 'en_US',
                    status: row.status || 'APPROVED',
                    bodyText: row.body_text || '',
                    components: row.components_json ? JSON.parse(row.components_json) : []
                  }));
                  return jsonResponse({ success: true, count: list.length, templates: list, source: 'cloudflare_d1_fallback' }, 200);
                }
              }
              return jsonResponse({
                success: false,
                error: metaData.error?.message || 'Meta Cloud API template fetch failed',
                details: metaData
              }, metaRes.status);
            }
          } catch (fetchErr) {
            if (db) {
              const stored = await db.prepare('SELECT * FROM whatsapp_templates ORDER BY name ASC').all();
              if (stored.results && stored.results.length > 0) {
                const list = stored.results.map(row => ({
                  id: row.id,
                  name: row.name,
                  category: row.category || 'UTILITY',
                  language: row.language || 'en_US',
                  status: row.status || 'APPROVED',
                  bodyText: row.body_text || '',
                  components: row.components_json ? JSON.parse(row.components_json) : []
                }));
                return jsonResponse({ success: true, count: list.length, templates: list, source: 'cloudflare_d1_fallback' }, 200);
              }
            }
            return jsonResponse({ error: fetchErr.message }, 500);
          }
        } else if (Array.isArray(incomingTemplates) && incomingTemplates.length > 0) {
          metaTemplates = incomingTemplates;
        } else {
          return jsonResponse({ error: 'Missing wabaId or accessToken' }, 400);
        }

        // Store / Upsert to D1
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

          const res = await db.prepare('SELECT * FROM whatsapp_templates ORDER BY name ASC').all();
          const allSaved = (res.results || []).map((row) => ({
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

          return jsonResponse({
            success: true,
            count: allSaved.length,
            templates: allSaved,
            savedToD1: true,
            source: 'meta_saved_to_d1'
          }, 200);
        }

        return jsonResponse({ success: true, templates: metaTemplates }, 200);
      }

      // 13. Direct Sync Templates to D1: POST /api/whatsapp/templates/sync
      if (path === '/api/whatsapp/templates/sync' && method === 'POST') {
        if (!db) return jsonResponse({ error: 'DB binding not attached' }, 500);
        const body = await request.json();
        const templates = body.templates || [];
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

        const res = await db.prepare('SELECT * FROM whatsapp_templates ORDER BY name ASC').all();
        const allSaved = (res.results || []).map((row) => ({
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

        return jsonResponse({ success: true, count: allSaved.length, templates: allSaved, savedToD1: true }, 200);
      }

      // 14. WhatsApp Dispatch Logs: GET /api/whatsapp/logs
      if (path === '/api/whatsapp/logs' && method === 'GET') {
        if (!db) return jsonResponse({ error: 'DB binding not attached' }, 500);

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
          if (countCheck && countCheck.count === 0) {
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

          const res = await db.prepare('SELECT * FROM whatsapp_logs ORDER BY timestamp DESC LIMIT 200').all();
          const logs = (res.results || []).map((row) => ({
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

          return jsonResponse({ success: true, count: logs.length, logs }, 200);
        } catch (e) {
          return jsonResponse({ error: e.message }, 500);
        }
      }

      // 15. WhatsApp Save Dispatch Log: POST /api/whatsapp/logs
      if (path === '/api/whatsapp/logs' && method === 'POST') {
        if (!db) return jsonResponse({ error: 'DB binding not attached' }, 500);

        try {
          const body = await request.json();
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

          return jsonResponse({
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
          }, 200);
        } catch (e) {
          return jsonResponse({ error: e.message }, 500);
        }
      }

      // 16. WhatsApp Clear Dispatch Logs: DELETE /api/whatsapp/logs
      if (path === '/api/whatsapp/logs' && method === 'DELETE') {
        if (!db) return jsonResponse({ error: 'DB binding not attached' }, 500);

        try {
          await db.prepare('DELETE FROM whatsapp_logs').run();
          return jsonResponse({ success: true, message: 'All WhatsApp dispatch logs cleared' }, 200);
        } catch (e) {
          return jsonResponse({ error: e.message }, 500);
        }
      }

      // 17. WhatsApp Get Config & Credentials: GET /api/whatsapp/config
      if (path === '/api/whatsapp/config' && method === 'GET') {
        if (!db) return jsonResponse({ error: 'DB binding not attached' }, 500);

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

          const row = await db.prepare('SELECT * FROM whatsapp_config WHERE id = ?').bind('default').first();
          if (!row) {
            return jsonResponse({
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
            }, 200);
          }

          return jsonResponse({
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
          }, 200);
        } catch (e) {
          return jsonResponse({ error: e.message }, 500);
        }
      }

      // 18. WhatsApp Save Config & Credentials: POST /api/whatsapp/config
      if (path === '/api/whatsapp/config' && method === 'POST') {
        if (!db) return jsonResponse({ error: 'DB binding not attached' }, 500);

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

          const body = await request.json();
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

          return jsonResponse({
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
          }, 200);
        } catch (e) {
          return jsonResponse({ error: e.message }, 500);
        }
      }

      return jsonResponse({ error: 'Endpoint Not Found', path }, 404);
    } catch (err) {
      return jsonResponse({ error: err.message }, 500);
    }
  }
};

