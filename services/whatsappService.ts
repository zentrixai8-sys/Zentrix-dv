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

const STORAGE_KEY = 'zentrix_whatsapp_meta_config_v1';

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

// Default template matching user's Meta template in Screenshot 1 & 2
export const DEFAULT_META_TEMPLATES: WhatsAppTemplate[] = [
  {
    id: 'tpl_help_ticket_001',
    name: 'help_ticket',
    status: 'IN_REVIEW',
    category: 'Utility',
    language: 'English (US)',
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
    id: 'tpl_ticket_status_002',
    name: 'ticket_update',
    status: 'APPROVED',
    category: 'Utility',
    language: 'English (US)',
    bodyText: 'Hello {{1}}, your ticket {{2}} status has been updated to {{3}}. Zentrixs engineer: {{4}}.',
    components: [
      {
        type: 'BODY',
        text: 'Hello {{1}}, your ticket {{2}} status has been updated to {{3}}. Zentrixs engineer: {{4}}.'
      }
    ]
  }
];

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

export const saveWhatsAppConfig = (partial: Partial<WhatsAppConfig>): WhatsAppConfig => {
  const current = getWhatsAppConfig();
  const updated: WhatsAppConfig = {
    ...current,
    ...partial,
    lastUpdated: new Date().toISOString()
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
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

export const addWhatsAppLog = (entry: Omit<WhatsAppLogEntry, 'id' | 'timestamp'>): WhatsAppLogEntry => {
  const current = getWhatsAppLogs();
  const newEntry: WhatsAppLogEntry = {
    id: `log_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    timestamp: new Date().toISOString(),
    ...entry
  };
  const updated = [newEntry, ...current].slice(0, 100);
  localStorage.setItem(LOGS_STORAGE_KEY, JSON.stringify(updated));
  return newEntry;
};

export const clearWhatsAppLogs = (): void => {
  localStorage.setItem(LOGS_STORAGE_KEY, JSON.stringify([]));
};

// Fetch Templates from Meta Graph API (or Worker proxy)
export const fetchMetaTemplates = async (
  customConfig?: WhatsAppConfig
): Promise<{ success: boolean; templates: WhatsAppTemplate[]; error?: string; source: 'meta' | 'fallback' }> => {
  const config = customConfig || getWhatsAppConfig();

  if (!config.wabaId || !config.accessToken) {
    return {
      success: true,
      templates: DEFAULT_META_TEMPLATES,
      source: 'fallback',
      error: 'WABA ID and Meta Access Token are required to fetch live templates directly from Meta Graph API. Showing configured template.'
    };
  }

  // 1. Try via Cloudflare Worker proxy first (bypasses browser CORS)
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
          return {
            success: true,
            templates: data.templates,
            source: 'meta'
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
        category: item.category || 'Utility',
        language: item.language || 'English (US)',
        bodyText: bodyComp.text || 'No body text',
        components: item.components || [],
        qualityRating: item.quality_score?.score
      };
    });

    if (parsedTemplates.length > 0) {
      return {
        success: true,
        templates: parsedTemplates,
        source: 'meta'
      };
    }
  } catch (err: any) {
    console.warn('Direct Meta templates fetch failed:', err);
    return {
      success: true,
      templates: DEFAULT_META_TEMPLATES,
      source: 'fallback',
      error: `Meta Graph API: ${err.message || 'Could not fetch live templates'}. Displaying template preview.`
    };
  }

  return {
    success: true,
    templates: DEFAULT_META_TEMPLATES,
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
