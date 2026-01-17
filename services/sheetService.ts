
const SHEET_ID = '1wGMehA9CpOkdGqe_QXM0WkkkVdRl61-PDj3br33y1ME';
const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzNj9ezmbafz8oD2fVy-EcimT4Cw7nntid3dL2FjRaJaAb2Qjo-MnLwNP_6L9Pqv8T7/exec'; 

// Permissive resolver to ensure logos from ImgBB and other hosts load
const resolveImageUrl = (url: any) => {
  if (!url || typeof url !== 'string') return null;
  let cleanUrl = url.trim();
  
  // Handle HTML image tags if present
  if (cleanUrl.includes('<img')) {
    const srcMatch = cleanUrl.match(/src=["']([^"']+)["']/i);
    if (srcMatch && srcMatch[1]) cleanUrl = srcMatch[1];
  }
  
  // Handle Google Drive links
  if (cleanUrl.includes('drive.google.com/file/d/')) {
    const id = cleanUrl.split('/d/')[1]?.split('/')[0];
    if (id) return `https://docs.google.com/uc?export=view&id=${id}`;
  }
  
  // ImgBB / Standard Direct Links
  if (cleanUrl.startsWith('http')) return cleanUrl;
  
  return null;
};

// Helper to get value from object regardless of header casing (logo_url vs LOGO URL)
const getDynamicValue = (obj: any, possibleKeys: string[]) => {
  const keys = Object.keys(obj);
  for (const pKey of possibleKeys) {
    // Try exact match
    if (obj[pKey] !== undefined) return obj[pKey];
    
    // Try Case-Insensitive / Spaced match
    const normalizedPKey = pKey.toLowerCase().replace(/_/g, ' ').trim();
    const foundKey = keys.find(k => {
      const normalizedK = k.toLowerCase().replace(/_/g, ' ').trim();
      return normalizedK === normalizedPKey;
    });
    
    if (foundKey) return obj[foundKey];
  }
  return null;
};

export const checkConnectivity = async (): Promise<boolean> => {
  try {
    if (!APPS_SCRIPT_URL) return false;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    const response = await fetch(`${APPS_SCRIPT_URL}?sheet=settings`, { signal: controller.signal });
    clearTimeout(timeoutId);
    return response.ok;
  } catch (error) {
    console.error("Connectivity Ping Failed:", error);
    return false;
  }
};

export const fetchBannersFromSheet = async () => {
  try {
    if (!APPS_SCRIPT_URL) return null;
    const response = await fetch(`${APPS_SCRIPT_URL}?sheet=ADS`);
    if (!response.ok) return null;
    const data = await response.json();
    if (Array.isArray(data)) {
      return data
        .filter(item => getDynamicValue(item, ['CONTENT', 'title']) || getDynamicValue(item, ['IMAGE URL', 'image_url']))
        .map((item: any) => ({
          id: item.id || Math.random().toString(),
          imageUrl: resolveImageUrl(getDynamicValue(item, ['IMAGE URL', 'image_url'])),
          link: getDynamicValue(item, ['link', 'LINK']) || '#',
          title: getDynamicValue(item, ['CONTENT', 'title']) || 'PROMOTION'
        }));
    }
    return [];
  } catch (error) {
    return null;
  }
};

export const fetchTestimonialsFromSheet = async () => {
  try {
    if (!APPS_SCRIPT_URL) return null;
    const response = await fetch(`${APPS_SCRIPT_URL}?sheet=admin`);
    if (!response.ok) return null;
    const data = await response.json();
    if (Array.isArray(data)) {
      return data
        .filter(item => getDynamicValue(item, ['client_name', 'name', 'company', 'feedback']))
        .map((item: any) => {
          const name = getDynamicValue(item, ['client_name', 'name']) || 'Enterprise Partner';
          const logoRaw = getDynamicValue(item, ['logo_url', 'logo', 'client_logo', 'image', 'brand_logo', 'image_url']);
          const logo = resolveImageUrl(logoRaw);
          return {
            name: name,
            logo: logo,
            text: getDynamicValue(item, ['feedback', 'text', 'testimonial']) || 'Quality service.',
            role: 'Strategic Partner',
            company: getDynamicValue(item, ['company', 'designation']) || name,
            rating: 5
          };
        });
    }
    return [];
  } catch (error) {
    return null;
  }
};

export const addTestimonialToSheet = async (data: { name: string, logo: string, feedback: string }) => {
  try {
    if (!APPS_SCRIPT_URL) return { success: false };
    const payload = {
      sheet: 'admin',
      client_name: data.name,
      logo_url: data.logo,
      feedback: data.feedback
    };
    await fetch(APPS_SCRIPT_URL, {
      method: 'POST',
      mode: 'no-cors', 
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    return { success: true }; 
  } catch (error) {
    return { success: false };
  }
};

export const addBannerToSheet = async (data: { title: string, imageUrl: string, link: string }) => {
  try {
    if (!APPS_SCRIPT_URL) return { success: false };
    const payload = {
      sheet: 'ADS',
      CONTENT: data.title,
      'IMAGE URL': data.imageUrl,
      link: data.link
    };
    await fetch(APPS_SCRIPT_URL, {
      method: 'POST',
      mode: 'no-cors', 
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    return { success: true }; 
  } catch (error) {
    return { success: false };
  }
};

export const addDemoBookingToSheet = async (data: { name: string, phone: string, email: string, message: string }) => {
  try {
    if (!APPS_SCRIPT_URL) return { success: false };
    const payload = {
      sheet: 'demo book',
      NAME: data.name,
      NUMNER: data.phone,
      'BUSINESS EMAIL': data.email,
      NOTES: data.message
    };
    await fetch(APPS_SCRIPT_URL, {
      method: 'POST',
      mode: 'no-cors', 
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    return { success: true }; 
  } catch (error) {
    return { success: false };
  }
};

export const fetchSettingsFromSheet = async () => {
  try {
    if (!APPS_SCRIPT_URL) return null;
    const response = await fetch(`${APPS_SCRIPT_URL}?sheet=settings`);
    if (!response.ok) return null;
    const data = await response.json();
    if (Array.isArray(data)) {
      const settings: Record<string, string> = {};
      data.forEach(item => {
        const key = getDynamicValue(item, ['setting_key', 'key']);
        const value = getDynamicValue(item, ['setting_value', 'value']);
        if (key) settings[key] = value;
      });
      return settings;
    }
    return null;
  } catch (error) {
    return null;
  }
};

export const updateSettingsInSheet = async (settings: Record<string, string>) => {
  try {
    if (!APPS_SCRIPT_URL) return { success: false };
    for (const [key, value] of Object.entries(settings)) {
      await fetch(APPS_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sheet: 'settings',
          setting_key: key,
          setting_value: value
        })
      });
    }
    return { success: true };
  } catch (error) {
    return { success: false };
  }
};

export const validateLogin = async (username: string, id: string, pass: string) => {
  try {
    const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json&sheet=login`;
    const response = await fetch(url);
    if (!response.ok) throw new Error('Auth node unreachable');
    const text = await response.text();
    const jsonStr = text.substring(text.indexOf('{'), text.lastIndexOf('}') + 1);
    const json = JSON.parse(jsonStr);
    const users = json.table.rows.map((row: any) => ({
      userName: (row.c[0]?.v || '').toString().trim(),
      userId: (row.c[1]?.v || '').toString().trim(),
      userPassword: (row.c[2]?.v || '').toString().trim()
    }));
    const found = users.find((u: any) => 
      u.userName.toLowerCase() === username.toLowerCase().trim() && 
      u.userId.toString() === id.toString().trim() && 
      u.userPassword.toString() === pass.toString().trim()
    );
    return found ? { success: true, user: found.userName } : { success: false, error: "Access Denied." };
  } catch (error) {
    return { success: false, error: "Authentication Failed." };
  }
};
