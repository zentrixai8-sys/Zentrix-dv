import { CLOUDFLARE_API_URL } from './taskService';

export interface WhatsAppConfig {
  phoneNumberId: string;
  wabaId: string;
  accessToken: string;
  templateName: string;
  languageCode: string;
  isEnabled: boolean;
  testPhoneNumber: string;
  lastUpdated?: string;
}

export interface WhatsAppTemplate {
  id: string;
  name: string;
  status: 'APPROVED' | 'IN_REVIEW' | 'REJECTED' | 'PENDING';
  category: string;
  language: string;
  bodyText: string;
  components?: any[];
  qualityRating?: string;
}

export interface WhatsAppLogEntry {
  id: string;
  recipientPhone: string;
  recipientName: string;
  templateName: string;
  language: string;
  ticketNumber?: string;
  status: 'SENT' | 'FAILED';
  messageId?: string;
  error?: string;
  timestamp: string;
  triggerType: 'TICKET_CREATED' | 'TEST_MESSAGE' | 'MANUAL';
  messagePreview: string;
}

// Storage keys
const STORAGE_KEY = 'zentrix_whatsapp_meta_config_v1';
const TEMPLATES_CACHE_KEY = 'zentrix_whatsapp_templates_cache_v2';

// Default / fallback configuration
export const DEFAULT_WHATSAPP_CONFIG: WhatsAppConfig = {
  phoneNumberId: '',
  wabaId: '',
  accessToken: '',
  templateName: 'help_ticket',
  languageCode: 'en_US',
  isEnabled: true,
  testPhoneNumber: ''
};

// Initial 5 registered Meta templates matching live account
export const DEFAULT_META_TEMPLATES: WhatsAppTemplate[] = [
  {
    id: 'tpl_help_ticket_001',
    name: 'help_ticket',
    status: 'APPROVED',
    category: 'UTILITY',
    language: 'en_US',
    bodyText: 'Hi {{1}}, thank you for contacting Zentrixs! 🙏\n\nYour support ticket {{2}} has been raised successfully.\n\nYou can check your ticket status on our website.',
    components: [
      {
        type: 'BODY',
        text: 'Hi {{1}}, thank you for contacting Zentrixs! 🙏\n\nYour support ticket {{2}} has been raised successfully.\n\nYou can check your ticket status on our website.',
        example: {
          body_text: [['Deepak sahu', 'tkt-2026-101']]
        }
      }
    ]
  },
  {
    id: 'tpl_offersms_002',
    name: 'offersms',
    status: 'APPROVED',
    category: 'MARKETING',
    language: 'en_US',
    bodyText: '🚨 "Premium Salon Upgrade - Limited Time Offer! Enjoy exclusive automation packages designed to grow your business.',
    components: [
      {
        type: 'BODY',
        text: '🚨 "Premium Salon Upgrade - Limited Time Offer! Enjoy exclusive automation packages designed to grow your business.'
      }
    ]
  },
  {
    id: 'tpl_marketing_welcome_003',
    name: 'marketing_welcome',
    status: 'APPROVED',
    category: 'MARKETING',
    language: 'en_US',
    bodyText: 'Hello {{1}} 🤩 Thank you for showing interest in Zentrixs Enterprise AI Solutions. Our specialist will connect with you shortly.',
    components: [
      {
        type: 'BODY',
        text: 'Hello {{1}} 🤩 Thank you for showing interest in Zentrixs Enterprise AI Solutions. Our specialist will connect with you shortly.'
      }
    ]
  },
  {
    id: 'tpl_welcome_for_website_004',
    name: 'welcome_for_website',
    status: 'APPROVED',
    category: 'UTILITY',
    language: 'en_US',
    bodyText: 'HelloHello {{1}} 🤩 Thank you for visiting our website. Your request has been received by our support team.',
    components: [
      {
        type: 'BODY',
        text: 'HelloHello {{1}} 🤩 Thank you for visiting our website. Your request has been received by our support team.'
      }
    ]
  },
  {
    id: 'tpl_ticket_update_005',
    name: 'ticket_update',
    status: 'APPROVED',
    category: 'UTILITY',
    language: 'en_US',
    bodyText: 'Hello {{1}}, your ticket {{2}} status has been updated to {{3}}. Zentrixs engineer: {{4}}.',
    components: [
      {
        type: 'BODY',
        text: 'Hello {{1}}, your ticket {{2}} status has been updated to {{3}}. Zentrixs engineer: {{4}}.'
      }
    ]
  }
];

// Load templates stored in Cloudflare D1 (with local cache fallback)
export const getStoredCloudflareTemplates = async (): Promise<{ templates: WhatsAppTemplate[]; source: 'cloudflare' | 'cache' | 'default' }> => {
  // 1. Check local cache first for instant UI response
  let cachedList: WhatsAppTemplate[] | null = null;
  try {
    const raw = localStorage.getItem(TEMPLATES_CACHE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        cachedList = parsed;
      }
    }
  } catch (e) {
    console.warn('Failed to parse cached templates:', e);
  }

  // 2. Query Cloudflare D1 database
  if (CLOUDFLARE_API_URL) {
    try {
      const res = await fetch(`${CLOUDFLARE_API_URL}/api/whatsapp/templates`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });

      if (res.ok) {
        const data = await res.json();
        if (data.templates && Array.isArray(data.templates) && data.templates.length > 0) {
          localStorage.setItem(TEMPLATES_CACHE_KEY, JSON.stringify(data.templates));
          return { templates: data.templates, source: 'cloudflare' };
        }
      }
    } catch (err) {
      console.warn('Could not load templates from Cloudflare D1, using local fallback:', err);
    }
  }

  if (cachedList && cachedList.length > 0) {
    return { templates: cachedList, source: 'cache' };
  }

  // 3. Fallback: Seed default templates into Cloudflare D1 in background
  if (CLOUDFLARE_API_URL) {
    syncTemplatesToCloudflare(DEFAULT_META_TEMPLATES).catch(() => {});
  }

  return { templates: DEFAULT_META_TEMPLATES, source: 'default' };
};

// Sync / Upsert templates directly to Cloudflare D1
export const syncTemplatesToCloudflare = async (
  templates: WhatsAppTemplate[]
): Promise<{ success: boolean; count: number; error?: string }> => {
  if (!CLOUDFLARE_API_URL) {
    localStorage.setItem(TEMPLATES_CACHE_KEY, JSON.stringify(templates));
    return { success: true, count: templates.length };
  }

  try {
    const res = await fetch(`${CLOUDFLARE_API_URL}/api/whatsapp/templates/sync`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ templates })
    });

    const data = await res.json();
    if (res.ok && data.success) {
      localStorage.setItem(TEMPLATES_CACHE_KEY, JSON.stringify(data.templates || templates));
      return { success: true, count: data.count || templates.length };
    }
    return { success: false, count: 0, error: data.error };
  } catch (err: any) {
    console.error('Failed to sync templates to Cloudflare D1:', err);
    return { success: false, count: 0, error: err.message };
  }
};

export const getWhatsAppConfig = (): WhatsAppConfig => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_WHATSAPP_CONFIG;
    return { ...DEFAULT_WHATSAPP_CONFIG, ...JSON.parse(raw) };
  } catch (e) {
    console.error('Failed to read WhatsApp config', e);
    return DEFAULT_WHATSAPP_CONFIG;
  }
};

export const getStoredCloudflareConfig = async (): Promise<WhatsAppConfig | null> => {
  if (CLOUDFLARE_API_URL) {
    try {
      const res = await fetch(`${CLOUDFLARE_API_URL}/api/whatsapp/config`);
      if (res.ok) {
        const data = await res.json();
        if (data.config && typeof data.config === 'object') {
          const current = getWhatsAppConfig();
          const merged: WhatsAppConfig = {
            ...current,
            ...data.config,
            phoneNumberId: data.config.phoneNumberId || current.phoneNumberId || '',
            wabaId: data.config.wabaId || current.wabaId || '',
            accessToken: data.config.accessToken || current.accessToken || '',
            templateName: data.config.templateName || current.templateName || 'help_ticket',
            languageCode: data.config.languageCode || current.languageCode || 'en_US',
            isEnabled: data.config.isEnabled !== undefined ? data.config.isEnabled : current.isEnabled,
            testPhoneNumber: data.config.testPhoneNumber || current.testPhoneNumber || ''
          };
          localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
          return merged;
        }
      }
    } catch (e) {
      console.warn('Could not fetch WhatsApp config from Cloudflare D1:', e);
    }
  }
  return null;
};

export const saveWhatsAppConfig = (partial: Partial<WhatsAppConfig>): WhatsAppConfig => {
  const current = getWhatsAppConfig();
  const updated: WhatsAppConfig = {
    ...current,
    ...partial,
    lastUpdated: new Date().toISOString()
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

  // Asynchronously persist credentials & configuration to Cloudflare D1
  if (CLOUDFLARE_API_URL) {
    fetch(`${CLOUDFLARE_API_URL}/api/whatsapp/config`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updated)
    }).catch((err) => {
      console.warn('Failed to save WhatsApp config to Cloudflare D1:', err);
    });
  }

  return updated;
};

// Formats phone numbers to WhatsApp international format without + or spaces (e.g. 919876543210)
export const formatWhatsAppNumber = (phone: string): string => {
  const cleaned = phone.replace(/[^\d]/g, '');
  // If 10 digits (standard Indian mobile without country code), prepend 91
  if (cleaned.length === 10) {
    return `91${cleaned}`;
  }
  return cleaned;
};

const LOGS_STORAGE_KEY = 'zentrix_whatsapp_logs_v1';

export const DEFAULT_WHATSAPP_LOGS: WhatsAppLogEntry[] = [
  {
    id: 'log_init_001',
    recipientPhone: '+91 98765 11223',
    recipientName: 'Deepak sahu',
    templateName: 'help_ticket',
    language: 'English (US)',
    ticketNumber: 'tkt-2026-101',
    status: 'SENT',
    messageId: 'wamid.HBgMOTE5ODc2NTExMjIzFQIAERgSRTI0NkU2NEQ0NkQzMzE2QUEA',
    timestamp: new Date(Date.now() - 1000 * 60 * 35).toISOString(),
    triggerType: 'TICKET_CREATED',
    messagePreview: 'Hi Deepak sahu, thank you for contacting Zentrixs! 🙏 Your support ticket tkt-2026-101 has been raised successfully.'
  },
  {
    id: 'log_init_002',
    recipientPhone: '+91 98765 11223',
    recipientName: 'Cirti Care Admin',
    templateName: 'help_ticket',
    language: 'English (US)',
    ticketNumber: 'tkt-2026-102',
    status: 'SENT',
    messageId: 'wamid.HBgMOTE5ODc2NTExMjIzFQIAERgSRTI0NkU2NEQ0NkQzMzE2QUFB',
    timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    triggerType: 'TICKET_CREATED',
    messagePreview: 'Hi Cirti Care Admin, thank you for contacting Zentrixs! 🙏 Your support ticket tkt-2026-102 has been raised successfully.'
  }
];

export const getWhatsAppLogs = (): WhatsAppLogEntry[] => {
  try {
    const raw = localStorage.getItem(LOGS_STORAGE_KEY);
    if (!raw) return DEFAULT_WHATSAPP_LOGS;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : DEFAULT_WHATSAPP_LOGS;
  } catch (e) {
    console.error('Failed to read WhatsApp logs', e);
    return DEFAULT_WHATSAPP_LOGS;
  }
};

export const getStoredCloudflareLogs = async (): Promise<{ success: boolean; logs: WhatsAppLogEntry[]; source: 'cloudflare' | 'local' }> => {
  if (CLOUDFLARE_API_URL) {
    try {
      const res = await fetch(`${CLOUDFLARE_API_URL}/api/whatsapp/logs`);
      if (res.ok) {
        const data = await res.json();
        if (data.logs && Array.isArray(data.logs) && data.logs.length > 0) {
          localStorage.setItem(LOGS_STORAGE_KEY, JSON.stringify(data.logs));
          return { success: true, logs: data.logs, source: 'cloudflare' };
        }
      }
    } catch (e) {
      console.warn('Could not fetch WhatsApp logs from Cloudflare D1, falling back to local storage:', e);
    }
  }
  return { success: true, logs: getWhatsAppLogs(), source: 'local' };
};

export const addWhatsAppLog = (entry: Omit<WhatsAppLogEntry, 'id' | 'timestamp'>): WhatsAppLogEntry => {
  const current = getWhatsAppLogs();
  const newEntry: WhatsAppLogEntry = {
    id: `log_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    timestamp: new Date().toISOString(),
    ...entry
  };
  const updated = [newEntry, ...current].slice(0, 100);
  localStorage.setItem(LOGS_STORAGE_KEY, JSON.stringify(updated));

  // Asynchronously persist to Cloudflare D1 database
  if (CLOUDFLARE_API_URL) {
    fetch(`${CLOUDFLARE_API_URL}/api/whatsapp/logs`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newEntry)
    }).catch((err) => {
      console.warn('Failed to save WhatsApp log to Cloudflare D1:', err);
    });
  }

  return newEntry;
};

export const clearWhatsAppLogs = (): void => {
  localStorage.setItem(LOGS_STORAGE_KEY, JSON.stringify([]));

  // Clear in Cloudflare D1 database as well
  if (CLOUDFLARE_API_URL) {
    fetch(`${CLOUDFLARE_API_URL}/api/whatsapp/logs`, {
      method: 'DELETE'
    }).catch((err) => {
      console.warn('Failed to clear WhatsApp logs in Cloudflare D1:', err);
    });
  }
};


// Fetch Templates from Meta Graph API, automatically storing/updating in Cloudflare D1
export const fetchMetaTemplates = async (
  customConfig?: WhatsAppConfig
): Promise<{ success: boolean; templates: WhatsAppTemplate[]; error?: string; source: 'meta' | 'fallback' | 'cloudflare'; savedToCloudflare?: boolean }> => {
  const config = customConfig || getWhatsAppConfig();

  if (!config.wabaId || !config.accessToken) {
    // If credentials missing, try loading what is already stored in Cloudflare D1
    const stored = await getStoredCloudflareTemplates();
    return {
      success: true,
      templates: stored.templates,
      source: stored.source === 'cloudflare' ? 'cloudflare' : 'fallback',
      error: 'WABA ID and Meta Access Token are required to fetch live templates from Meta. Serving stored templates.'
    };
  }

  // 1. Fetch via Cloudflare Worker proxy (which automatically upserts into Cloudflare D1)
  if (CLOUDFLARE_API_URL) {
    try {
      const res = await fetch(`${CLOUDFLARE_API_URL}/api/whatsapp/templates`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          wabaId: config.wabaId.trim(),
          accessToken: config.accessToken.trim()
        })
      });

      if (res.ok) {
        const data = await res.json();
        if (data.templates && Array.isArray(data.templates) && data.templates.length > 0) {
          localStorage.setItem(TEMPLATES_CACHE_KEY, JSON.stringify(data.templates));
          return {
            success: true,
            templates: data.templates,
            source: 'meta',
            savedToCloudflare: true
          };
        }
      }
    } catch (workerErr) {
      console.warn('Worker proxy templates fetch failed, trying direct Meta Graph API:', workerErr);
    }
  }

  // 2. Direct Meta Graph API call
  try {
    const url = `https://graph.facebook.com/v20.0/${encodeURIComponent(config.wabaId.trim())}/message_templates?limit=50&access_token=${encodeURIComponent(config.accessToken.trim())}`;
    const res = await fetch(url);
    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error?.message || `Meta Graph API error: ${res.statusText}`);
    }

    const rawList = data.data || [];
    const parsedTemplates: WhatsAppTemplate[] = rawList.map((item: any) => {
      const bodyComp = item.components?.find((c: any) => c.type === 'BODY') || {};
      return {
        id: item.id || `tpl_${item.name}`,
        name: item.name,
        status: (item.status || 'IN_REVIEW').toUpperCase() as any,
        category: (item.category || 'UTILITY').toUpperCase(),
        language: item.language || 'en_US',
        bodyText: bodyComp.text || 'No body text',
        components: item.components || [],
        qualityRating: item.quality_score?.score
      };
    });

    if (parsedTemplates.length > 0) {
      // Store/upsert all new templates into Cloudflare D1 immediately
      syncTemplatesToCloudflare(parsedTemplates).catch((err) => {
        console.warn('Background sync to Cloudflare D1 error:', err);
      });
      localStorage.setItem(TEMPLATES_CACHE_KEY, JSON.stringify(parsedTemplates));

      return {
        success: true,
        templates: parsedTemplates,
        source: 'meta',
        savedToCloudflare: true
      };
    }
  } catch (err: any) {
    console.warn('Direct Meta templates fetch failed:', err);
    // On error, return what is stored in Cloudflare D1 / cache
    const stored = await getStoredCloudflareTemplates();
    return {
      success: true,
      templates: stored.templates,
      source: 'fallback',
      error: `Meta Graph API: ${err.message || 'Could not fetch live templates'}. Serving stored templates.`
    };
  }

  const stored = await getStoredCloudflareTemplates();
  return {
    success: true,
    templates: stored.templates,
    source: 'fallback'
  };
};

// Send WhatsApp Notification for New Ticket
export const sendTicketWhatsAppNotification = async (params: {
  to: string;
  personName: string;
  ticketNumber: string;
  configOverride?: Partial<WhatsAppConfig>;
}): Promise<{ success: boolean; messageId?: string; error?: string }> => {
  const config = { ...getWhatsAppConfig(), ...params.configOverride };

  if (!config.isEnabled) {
    return { success: false, error: 'WhatsApp auto-notification is disabled in settings.' };
  }

  if (!config.phoneNumberId || !config.accessToken) {
    console.warn('WhatsApp credentials not fully configured yet');
    return { 
      success: false, 
      error: 'WhatsApp Phone Number ID and Meta Access Token not configured in Admin Settings.' 
    };
  }

  const formattedTo = formatWhatsAppNumber(params.to);
  if (!formattedTo || formattedTo.length < 10) {
    return { success: false, error: 'Invalid recipient phone number.' };
  }

  // Template parameters for help_ticket:
  // {{1}} = Person / Client Name (e.g. "Deepak sahu")
  // {{2}} = Ticket ID (e.g. "tkt-2026-101")
  const payload = {
    messaging_product: 'whatsapp',
    recipient_type: 'individual',
    to: formattedTo,
    type: 'template',
    template: {
      name: config.templateName || 'help_ticket',
      language: {
        code: config.languageCode || 'en_US'
      },
      components: [
        {
          type: 'body',
          parameters: [
            {
              type: 'text',
              text: params.personName || 'Valued Client'
            },
            {
              type: 'text',
              text: params.ticketNumber || 'TKT-2026'
            }
          ]
        }
      ]
    }
  };

  const previewText = `Hi ${params.personName || 'Valued Client'}, thank you for contacting Zentrixs! 🙏 Your support ticket ${params.ticketNumber || 'TKT-2026'} has been raised successfully.`;

  // 1. Try Cloudflare Worker proxy first to avoid CORS
  if (CLOUDFLARE_API_URL) {
    try {
      const res = await fetch(`${CLOUDFLARE_API_URL}/api/whatsapp/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phoneNumberId: config.phoneNumberId.trim(),
          accessToken: config.accessToken.trim(),
          payload
        })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        const messageId = data.messageId || data.messages?.[0]?.id || `wamid_${Date.now()}`;
        addWhatsAppLog({
          recipientPhone: formattedTo,
          recipientName: params.personName || 'Client',
          templateName: config.templateName || 'help_ticket',
          language: config.languageCode || 'en_US',
          ticketNumber: params.ticketNumber,
          status: 'SENT',
          messageId,
          triggerType: params.ticketNumber ? 'TICKET_CREATED' : 'MANUAL',
          messagePreview: previewText
        });
        return { success: true, messageId };
      }
      if (data.error) {
        throw new Error(data.error);
      }
    } catch (workerErr: any) {
      console.warn('Worker proxy send failed, trying direct Meta Graph API:', workerErr);
    }
  }

  // 2. Direct Meta Graph API call
  try {
    const url = `https://graph.facebook.com/v20.0/${encodeURIComponent(config.phoneNumberId.trim())}/messages`;
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${config.accessToken.trim()}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const data = await res.json();
    if (!res.ok) {
      const errMsg = data.error?.message || data.error?.error_user_msg || `Meta API Error (${res.status})`;
      throw new Error(errMsg);
    }

    const messageId = data.messages?.[0]?.id || `wamid_${Date.now()}`;
    addWhatsAppLog({
      recipientPhone: formattedTo,
      recipientName: params.personName || 'Client',
      templateName: config.templateName || 'help_ticket',
      language: config.languageCode || 'en_US',
      ticketNumber: params.ticketNumber,
      status: 'SENT',
      messageId,
      triggerType: params.ticketNumber ? 'TICKET_CREATED' : 'MANUAL',
      messagePreview: previewText
    });

    return {
      success: true,
      messageId
    };
  } catch (err: any) {
    console.error('WhatsApp send failed:', err);
    addWhatsAppLog({
      recipientPhone: formattedTo,
      recipientName: params.personName || 'Client',
      templateName: config.templateName || 'help_ticket',
      language: config.languageCode || 'en_US',
      ticketNumber: params.ticketNumber,
      status: 'FAILED',
      error: err.message || 'Meta Cloud API call failed',
      triggerType: params.ticketNumber ? 'TICKET_CREATED' : 'MANUAL',
      messagePreview: previewText
    });

    return {
      success: false,
      error: err.message || 'Failed to dispatch WhatsApp message via Meta Cloud API'
    };
  }
};
