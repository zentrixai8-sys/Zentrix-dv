
const SHEET_ID = '1wGMehA9CpOkdGqe_QXM0WkkkVdRl61-PDj3br33y1ME';
const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzlYOtGVYCOTndgcpeTxWC_Deu7XJjRanX_aJ4v5jm_YSaEa5VhusVXQy63e7CaBBI7/exec'; 

// Helper to extract direct image URL and handle malformed data
const resolveImageUrl = (url: any) => {
  if (!url || typeof url !== 'string') return null;
  
  let cleanUrl = url.trim();
  
  // Handle HTML strings from sheets
  if (cleanUrl.includes('<img')) {
    const srcMatch = cleanUrl.match(/src=["']([^"']+)["']/i);
    if (srcMatch && srcMatch[1]) return srcMatch[1];
  }
  
  // Basic check for common URL patterns
  if (cleanUrl.startsWith('http')) return cleanUrl;
  
  // If it's a relative path or something else, return null
  return null;
};

export const fetchTestimonialsFromSheet = async () => {
  try {
    if (APPS_SCRIPT_URL) {
      const response = await fetch(`${APPS_SCRIPT_URL}?sheet=admin`);
      if (!response.ok) throw new Error('Bridge failed');
      const data = await response.json();
      if (Array.isArray(data)) {
        return data
          .filter(item => (item.client_name || item.name))
          .map((item: any) => {
            const name = item.client_name || item.name || 'Enterprise Partner';
            const logo = resolveImageUrl(item.logo_url || item.logo);
            
            return {
              name: name,
              logo: logo,
              text: item.feedback || item.text || 'Process efficiency optimized.',
              role: 'Strategic Partner',
              company: name,
              rating: 5
            };
          });
      }
    }
    return null;
  } catch (error) {
    console.warn("Sheet Fetch Error:", error);
    return null;
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
        if (item.setting_key) settings[item.setting_key] = item.setting_value;
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
