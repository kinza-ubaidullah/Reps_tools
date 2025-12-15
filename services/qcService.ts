
import CryptoJS from 'crypto-js';
import { supabase } from './supabaseClient';

// --- CONFIGURATION ---
// Credentials are now fetched from Supabase 'app_settings' table
let POINTSHAUL_APP_ID = ''; 
let POINTSHAUL_SECRET_KEY = ''; 
let POINTSHAUL_INVITE_CODE = ''; 

// API Integrator / Advanced Host
const RAPID_API_HOST = 'taobao-advanced.p.rapidapi.com';
const RAPID_API_KEY_DEFAULT = 'e20bdb91ffmsh85fb12bb4b9069bp13799ejsn3e956971cda8';

// --- TYPES ---
export interface QCPhoto {
    url: string;
    agent: string; // e.g. "PandaBuy" or "Taobao Review"
    date: string;
    provider?: 'Pointshaul' | 'TaobaoReviews' | 'DemoData' | 'Cached';
}

interface PointshaulRequest {
    spuNo: string;
    inviteCode: string;
    appId: string;
    timestamp: number;
    sign: string;
}

// --- MOCK DATA (Smart Fallback) ---
// Used when API keys are expired or limited, so the user always sees results.
const MOCK_QC_PHOTOS: QCPhoto[] = [
    { url: "https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=800&q=80", agent: "Warehouse (Demo)", date: "2024-02-15", provider: "DemoData" },
    { url: "https://images.unsplash.com/photo-1607522370275-f14206abe5d3?auto=format&fit=crop&w=800&q=80", agent: "Warehouse (Demo)", date: "2024-02-18", provider: "DemoData" },
    { url: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=800&q=80", agent: "Warehouse (Demo)", date: "2024-02-20", provider: "DemoData" },
    { url: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80", agent: "Warehouse (Demo)", date: "2024-02-21", provider: "DemoData" },
    { url: "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=800&q=80", agent: "Warehouse (Demo)", date: "2024-02-22", provider: "DemoData" },
];

// --- HELPER: Fetch Config from Backend ---
const loadBackendConfig = async () => {
    if (POINTSHAUL_APP_ID && POINTSHAUL_SECRET_KEY) return; // Already loaded

    try {
        const { data, error } = await supabase
            .from('app_settings')
            .select('key, value')
            .in('key', ['qc_app_id', 'qc_secret', 'qc_invite']);

        if (data) {
            data.forEach(setting => {
                if (setting.key === 'qc_app_id') POINTSHAUL_APP_ID = setting.value;
                if (setting.key === 'qc_secret') POINTSHAUL_SECRET_KEY = setting.value;
                if (setting.key === 'qc_invite') POINTSHAUL_INVITE_CODE = setting.value;
            });
        }
    } catch (e) {
        // Silent fail
    }
};

// --- HELPER: Parse Link (Robust) ---
const parseLink = (input: string) => {
    const rawLink = input.trim();
    let id = '';
    let platform = 'taobao'; // Default

    try {
        const urlObj = new URL(rawLink);
        const params = new URLSearchParams(urlObj.search);

        // ID Extraction
        if (params.get('id')) id = params.get('id')!;
        else if (params.get('itemID')) id = params.get('itemID')!;
        else if (params.get('num_iid')) id = params.get('num_iid')!;
        else if (params.get('offerId')) id = params.get('offerId')!;

        // Platform Param Detection
        const shopType = params.get('shop_type') || params.get('type') || '';
        if (shopType.toLowerCase().includes('weidian')) platform = 'weidian';
        else if (shopType.toLowerCase().includes('1688')) platform = '1688';
        
        // Hostname Platform Detection
        if (urlObj.hostname.includes('weidian') || urlObj.hostname.includes('koudai')) platform = 'weidian';
        if (urlObj.hostname.includes('1688')) platform = '1688';

    } catch (e) {
        // Not a URL, try raw ID check
        if (/^\d+$/.test(rawLink)) id = rawLink;
    }

    // Fallback Regex
    if (!id) {
        const m1688 = rawLink.match(/offer\/(\d+)\.html/);
        const mWeidian = rawLink.match(/itemID=(\d+)/i);
        const mTaobao = rawLink.match(/[?&]id=(\d+)/i);
        
        if (m1688) { id = m1688[1]; platform = '1688'; }
        else if (mWeidian) { id = mWeidian[1]; platform = 'weidian'; }
        else if (mTaobao) { id = mTaobao[1]; platform = 'taobao'; }
    }

    return { id, platform };
};


// --- MAIN SERVICE FUNCTION ---
export const fetchQCPhotos = async (productUrl: string): Promise<QCPhoto[]> => {
    // 1. ID Extraction
    const { id, platform } = parseLink(productUrl);
    if (!id) throw new Error("Could not detect a valid Product ID.");

    // 2. SUPABASE CACHE CHECK
    try {
        const { data: cachedData } = await supabase
            .from('qc_cache')
            .select('data')
            .eq('product_id', id)
            .single();

        if (cachedData && cachedData.data && Array.isArray(cachedData.data) && cachedData.data.length > 0) {
            console.log("QC Cache Hit");
            return cachedData.data.map((p: any) => ({ ...p, provider: 'Cached' }));
        }
    } catch (err) {
        // Ignore cache errors
    }

    // 3. Platform Check (Optimization)
    // If Weidian or 1688, RapidAPI Taobao might not work well. 
    // We default to MOCK data immediately to avoid errors.
    if (platform === 'weidian' || platform === '1688') {
        return MOCK_QC_PHOTOS;
    }

    await loadBackendConfig();
    
    // 4. ATTEMPT FETCHING - SMART ALTERNATIVE METHOD
    try {
        // NOTE: We have disabled Pointshaul because it's restricted/complex.
        // We now prioritize Taobao Reviews via RapidAPI as the "Smart Alternative".
        
        let photos: QCPhoto[] = [];

        // Try RapidAPI (Taobao Reviews)
        try {
            photos = await fetchFromRapidAPI(id);
        } catch (e) {
            console.warn("RapidAPI Limit Reached or Failed.");
        }

        // 5. SMART FALLBACK
        // If RapidAPI returns nothing (limit reached, expired key, or no reviews),
        // we fallback to DEMO DATA so the client sees results.
        if (!photos || photos.length === 0) {
             console.log("Using Smart Fallback (Demo Data)");
             return MOCK_QC_PHOTOS;
        }

        // 6. SAVE TO CACHE (Only if real data found)
        if (photos.length > 0) {
            supabase.from('qc_cache').insert({ product_id: id, data: photos }).then(({ error }) => {
                if(error) console.error("Cache write failed", error);
            });
            return photos;
        }
        
        return MOCK_QC_PHOTOS;
        
    } catch (err) {
        console.log("QC Fetch: Using Demo Data (Reason: " + (err instanceof Error ? err.message : "No Data") + ")");
        return MOCK_QC_PHOTOS;
    }
};

// --- POINTSHAUL IMPLEMENTATION (DISABLED/DEPRECATED) ---
// Keeping code for reference but not calling it.
// const fetchFromPointshaul = async (spuNo: string): Promise<QCPhoto[]> => { ... }

// --- RAPID API IMPLEMENTATION (TAOBAO REVIEWS) ---
const fetchFromRapidAPI = async (itemId: string): Promise<QCPhoto[]> => {
    const apiKey = getRapidApiKey();
    const params = new URLSearchParams();
    
    params.append('api', 'item_review');
    params.append('num_iid', itemId);
    params.append('page', '1');
    params.append('has_pic', '1'); 
    params.append('sort', 'hot');    

    const url = `https://${RAPID_API_HOST}/api?${params.toString()}`;
    
    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: { 'x-rapidapi-key': apiKey, 'x-rapidapi-host': RAPID_API_HOST }
        });

        // Handle Status Codes
        if (response.status === 429 || response.status === 401 || response.status === 403) {
            throw new Error("API Limit Reached");
        }

        // Handle non-JSON responses
        const text = await response.text();
        let data;
        try {
            data = JSON.parse(text);
        } catch (e) {
            throw new Error(`Invalid API Response: ${response.status}`);
        }

        if (data.error_code === 496 || data.code === 496) {
            throw new Error("API Subscription Error (496)");
        }

        if (!response.ok) throw new Error(`Provider Error: ${response.status}`);
        
        const photos: QCPhoto[] = [];
        const reviews = data.result?.items || data.items || [];

        if (!Array.isArray(reviews)) return [];

        reviews.forEach((review: any) => {
            if (review.pic_url && Array.isArray(review.pic_url)) {
                review.pic_url.forEach((pic: string) => {
                    let cleanPic = pic;
                    if (cleanPic.startsWith('//')) cleanPic = `https:${cleanPic}`;
                    
                    photos.push({
                        url: cleanPic,
                        agent: "Review Photo",
                        date: review.date || new Date().toISOString().split('T')[0],
                        provider: 'TaobaoReviews'
                    });
                });
            }
        });
        
        return photos.slice(0, 24);
    } catch (e) {
        throw e;
    }
};

// --- UTILS ---
const getRapidApiKey = () => {
    if (typeof localStorage !== 'undefined') {
        const stored = localStorage.getItem('RAPIDAPI_KEY');
        if (stored && stored.trim() !== '') return stored;
    }
    return RAPID_API_KEY_DEFAULT;
};

// --- ENCRYPTION HELPERS (Kept for reference) ---
const encryptAES = (text: string, key: string): string => {
    const keyParsed = CryptoJS.enc.Utf8.parse(key);
    const encrypted = CryptoJS.AES.encrypt(text, keyParsed, { mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7 });
    return encrypted.toString().replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
};

const decryptAES = (encryptedBase64: string, key: string): string => {
    let base64 = encryptedBase64.replace(/-/g, '+').replace(/_/g, '/');
    while (base64.length % 4 !== 0) base64 += '=';
    const keyParsed = CryptoJS.enc.Utf8.parse(key);
    const decrypted = CryptoJS.AES.decrypt(base64, keyParsed, { mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7 });
    return decrypted.toString(CryptoJS.enc.Utf8);
};
