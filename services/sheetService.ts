
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

export const DEFAULT_TESTIMONIALS = [
  {
    name: "POPULAR PAINTS",
    logo: "https://i.ibb.co/Vp3MfZvL/popular-paints-logo-white-og.png",
    text: "The service was smooth, efficient, and exceeded our expectations.",
    role: "Strategic Partner",
    company: "POPULAR PAINTS",
    rating: 5
  },
  {
    name: "AVINASH GROUP",
    logo: "https://i.ibb.co/PsNGkTX7/download.jpg",
    text: "Very satisfied with the service and support. The team goes above and beyond to help.",
    role: "Strategic Partner",
    company: "AVINASH GROUP",
    rating: 5
  },
  {
    name: "MAHAVEER HAIR SOLUTION",
    logo: "https://i.ibb.co/rfK0BQ81/download.png",
    text: "Innovative solutions with reliable execution. Their technical expertise is top-notch.",
    role: "Strategic Partner",
    company: "MAHAVEER HAIR SOLUTION",
    rating: 5
  },
  {
    name: "PRATAP TECHNOCRATS PVT.LTD",
    logo: "https://i.ibb.co/pjWNbZ9Y/1910e78d-5a7d-4548-9792-e4d54c13b485.png",
    text: "Zentrix Web App saved me 2 hours daily! Bookings automated perfectly. Highly recommend!",
    role: "Strategic Partner",
    company: "PRATAP TECHNOCRATS PVT.LTD",
    rating: 5
  }
];

// CSV parser that handles quotes and multi-line cells
const parseCSV = (text: string) => {
  const lines: string[][] = [];
  let row: string[] = [];
  let inQuotes = false;
  let currentToken = '';

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const nextChar = text[i + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        currentToken += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      row.push(currentToken.trim());
      currentToken = '';
    } else if ((char === '\r' || char === '\n') && !inQuotes) {
      if (char === '\r' && nextChar === '\n') i++;
      row.push(currentToken.trim());
      if (row.some(val => val !== '')) lines.push(row);
      row = [];
      currentToken = '';
    } else {
      currentToken += char;
    }
  }
  if (currentToken || row.length > 0) {
    row.push(currentToken.trim());
    if (row.some(val => val !== '')) lines.push(row);
  }

  if (lines.length < 2) return [];
  const headers = lines[0].map(h => h.trim().toLowerCase());
  const data: Record<string, any>[] = [];
  for (let i = 1; i < lines.length; i++) {
    const r = lines[i];
    const item: Record<string, any> = {};
    headers.forEach((h, idx) => {
      if (h) item[h] = r[idx] || '';
    });
    data.push(item);
  }
  return data;
};

// 1. Fetch via public Google Sheets CSV export (CORS enabled: Access-Control-Allow-Origin: *)
export const fetchSheetDataViaCsv = async (sheetName: string): Promise<any[] | null> => {
  try {
    const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv&sheet=${encodeURIComponent(sheetName)}&t=${Date.now()}`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);
    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (!response.ok) return null;
    const text = await response.text();
    const parsed = parseCSV(text);
    return parsed.length > 0 ? parsed : null;
  } catch (err) {
    console.warn(`CSV fetch for sheet "${sheetName}" failed:`, err);
    return null;
  }
};

// 2. Fetch via JSONP dynamic script tag (100% immune to browser CORS)
export const fetchSheetDataViaJsonp = (sheetName: string): Promise<any[] | null> => {
  if (typeof window === 'undefined' || typeof document === 'undefined') return Promise.resolve(null);
  return new Promise((resolve) => {
    const callbackName = 'gviz_jsonp_' + Math.random().toString(36).substring(2, 9);
    const script = document.createElement('script');
    let finished = false;

    const timeout = setTimeout(() => {
      if (!finished) {
        cleanup();
        resolve(null);
      }
    }, 8000);

    const cleanup = () => {
      finished = true;
      clearTimeout(timeout);
      try {
        delete (window as any)[callbackName];
      } catch (e) {}
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };

    (window as any)[callbackName] = (json: any) => {
      try {
        const rows = json.table?.rows;
        if (!rows || rows.length < 2) {
          cleanup();
          resolve([]);
          return;
        }
        const headers = rows[0].c.map((cell: any) => (cell?.v ?? '').toString().trim().toLowerCase());
        const results: any[] = [];
        for (let i = 1; i < rows.length; i++) {
          const row = rows[i]?.c || [];
          const item: Record<string, any> = {};
          let hasData = false;
          headers.forEach((header: string, colIdx: number) => {
            if (header) {
              const val = row[colIdx] ? (row[colIdx].f ?? row[colIdx].v ?? '') : '';
              item[header] = val;
              if (val) hasData = true;
            }
          });
          if (hasData) results.push(item);
        }
        cleanup();
        resolve(results);
      } catch (err) {
        cleanup();
        resolve(null);
      }
    };

    script.src = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=responseHandler:${callbackName}&sheet=${encodeURIComponent(sheetName)}&headers=0&t=${Date.now()}`;
    script.onerror = () => {
      cleanup();
      resolve(null);
    };
    document.head.appendChild(script);
  });
};

// 3. Fallback direct GViz API
export const fetchSheetDataViaGviz = async (sheetName: string): Promise<any[] | null> => {
  try {
    const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json&sheet=${encodeURIComponent(sheetName)}&headers=0`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);
    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (!response.ok) return null;
    const text = await response.text();
    const startIdx = text.indexOf('{');
    const endIdx = text.lastIndexOf('}');
    if (startIdx === -1 || endIdx === -1) return null;

    const json = JSON.parse(text.substring(startIdx, endIdx + 1));
    const rows = json.table?.rows;
    if (!rows || rows.length < 2) return [];

    const headers = rows[0].c.map((cell: any) => (cell?.v ?? '').toString().trim().toLowerCase());

    const results: any[] = [];
    for (let i = 1; i < rows.length; i++) {
      const row = rows[i]?.c || [];
      const item: Record<string, any> = {};
      let hasData = false;
      headers.forEach((header: string, colIdx: number) => {
        if (header) {
          const val = row[colIdx] ? (row[colIdx].f ?? row[colIdx].v ?? '') : '';
          item[header] = val;
          if (val) hasData = true;
        }
      });
      if (hasData) results.push(item);
    }
    return results;
  } catch (err) {
    return null;
  }
};

// Unified fetch from sheet that tries all available techniques
export const fetchSheetData = async (sheetName: string): Promise<any[] | null> => {
  // 1. Try public CSV export (CORS enabled by Google)
  const csvData = await fetchSheetDataViaCsv(sheetName);
  if (csvData && csvData.length > 0) return csvData;

  // 2. Try JSONP (immune to CORS restrictions in all browsers)
  const jsonpData = await fetchSheetDataViaJsonp(sheetName);
  if (jsonpData && jsonpData.length > 0) return jsonpData;

  // 3. Try direct GViz
  const gvizData = await fetchSheetDataViaGviz(sheetName);
  if (gvizData && gvizData.length > 0) return gvizData;

  return null;
};

export const checkConnectivity = async (): Promise<boolean> => {
  try {
    const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv&sheet=admin&t=${Date.now()}`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);
    return response.ok;
  } catch (error) {
    return false;
  }
};

export const fetchBannersFromSheet = async () => {
  try {
    let data = await fetchSheetData('ADS');
    if ((!data || data.length === 0) && APPS_SCRIPT_URL) {
      try {
        const response = await fetch(`${APPS_SCRIPT_URL}?sheet=ADS`);
        if (response.ok) {
          const json = await response.json();
          if (Array.isArray(json) && json.length > 0) data = json;
        }
      } catch (e) {}
    }

    if (Array.isArray(data) && data.length > 0) {
      const valid = data
        .filter(item => getDynamicValue(item, ['CONTENT', 'title']) || getDynamicValue(item, ['IMAGE URL', 'image_url']))
        .map((item: any) => ({
          id: item.id || Math.random().toString(),
          imageUrl: resolveImageUrl(getDynamicValue(item, ['IMAGE URL', 'image_url'])),
          link: getDynamicValue(item, ['link', 'LINK']) || '#',
          title: getDynamicValue(item, ['CONTENT', 'title']) || 'PROMOTION'
        }));
      if (valid.length > 0) return valid;
    }
    throw new Error("Empty banner data");
  } catch (error) {
    return [{
      id: 'default-1',
      imageUrl: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80',
      link: '#contact',
      title: 'System Architecture'
    }];
  }
};

export const fetchTestimonialsFromSheet = async () => {
  try {
    // Fetch live data directly from sheet tab 'admin'
    const data = await fetchSheetData('admin');

    if (Array.isArray(data) && data.length > 0) {
      const parsed = data
        .filter(item => getDynamicValue(item, ['client_name', 'name', 'client name', 'company', 'feedback']))
        .map((item: any) => {
          const name = getDynamicValue(item, ['client_name', 'name', 'client name']) || 'Enterprise Partner';
          const logoRaw = getDynamicValue(item, ['logo_url', 'logo', 'client_logo', 'image', 'brand_logo', 'image_url', 'logo url']);
          const logo = resolveImageUrl(logoRaw);
          const rawFeedback = (getDynamicValue(item, ['feedback', 'text', 'testimonial']) || 'Quality service.').toString().trim();
          const cleanFeedback = rawFeedback.replace(/^["“]+|["”]+$/g, '').trim();

          return {
            name: name,
            logo: logo,
            text: cleanFeedback,
            role: 'Strategic Partner',
            company: getDynamicValue(item, ['company', 'designation']) || name,
            rating: 5
          };
        });

      if (parsed.length > 0) return parsed;
    }
    return DEFAULT_TESTIMONIALS;
  } catch (error) {
    console.error("Testimonials fetch error:", error);
    return DEFAULT_TESTIMONIALS;
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
    // If it's a network error (like completely offline), we return false.
    // CORS errors usually don't throw in no-cors mode, they just finish opaquely.
    return { success: false };
  }
};

export const fetchSettingsFromSheet = async () => {
  try {
    let data = await fetchSheetData('settings');
    if ((!data || data.length === 0) && APPS_SCRIPT_URL) {
      try {
        const response = await fetch(`${APPS_SCRIPT_URL}?sheet=settings`);
        if (response.ok) {
          const json = await response.json();
          if (Array.isArray(json) && json.length > 0) data = json;
        }
      } catch (e) {}
    }

    if (Array.isArray(data) && data.length > 0) {
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
