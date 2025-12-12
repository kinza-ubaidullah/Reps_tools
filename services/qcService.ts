
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

// --- MOCK DATA (Last Resort) ---
const MOCK_QC_PHOTOS: QCPhoto[] = [
    { url: "https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=800&q=80", agent: "Demo Warehouse", date: "2024-02-15", provider: "DemoData" },
    { url: "https://images.unsplash.com/photo-1607522370275-f14206abe5d3?auto=format&fit=crop&w=800&q=80", agent: "Demo Warehouse", date: "2024-02-18", provider: "DemoData" },
    { url: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=800&q=80", agent: "Demo Warehouse", date: "2024-02-20", provider: "DemoData" },
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
            console.log("QC Credentials loaded from Supabase Backend");
        }
    } catch (e) {
        console.warn("Failed to load backend config, using defaults/mock");
    }
};

// --- MAIN SERVICE FUNCTION ---

export const fetchQCPhotos = async (productUrl: string): Promise<QCPhoto[]> => {
    // 1. ID Extraction
    const id = extractId(productUrl);
    if (!id) throw new Error("Invalid Link. Please use a Taobao, Weidian, or 1688 link.");

    // 2. SUPABASE CACHE CHECK (Backend Optimization)
    try {
        const { data: cachedData } = await supabase
            .from('qc_cache')
            .select('data')
            .eq('product_id', id)
            .single();

        if (cachedData && cachedData.data) {
            console.log("QC Cache Hit: Serving from Supabase");
            return cachedData.data.map((p: any) => ({ ...p, provider: 'Cached' }));
        }
    } catch (err) {
        // Ignore cache errors silently
    }

    // 3. LOAD CREDENTIALS
    await loadBackendConfig();
    
    // 4. ATTEMPT FETCHING
    try {
        let photos: QCPhoto[] = [];

        // STRATEGY: Check if Pointshaul keys exist. 
        // If NO keys, skip directly to RapidAPI (Taobao Reviews)
        const hasPointshaulKeys = POINTSHAUL_APP_ID && POINTSHAUL_SECRET_KEY;

        if (hasPointshaulKeys) {
            try {
                photos = await fetchFromPointshaul(id);
            } catch (e) {
                console.warn("Pointshaul failed, falling back to RapidAPI", e);
                // Fallback to RapidAPI if Pointshaul fails
                photos = await fetchFromRapidAPI(id);
            }
        } else {
            // No keys configured -> Use RapidAPI directly
            console.log("No Pointshaul keys found in Backend. Fetching Taobao Reviews...");
            photos = await fetchFromRapidAPI(id);
        }

        // 5. SAVE TO CACHE (If successful)
        if (photos.length > 0) {
            supabase.from('qc_cache').insert({
                product_id: id,
                data: photos
            }).then(({ error }) => {
                if(error) console.error("Failed to cache QC results", error);
            });

            return photos;
        } else {
             throw new Error("No photos found");
        }
        
    } catch (err) {
        console.warn("All QC providers failed. Serving Demo Data.", err);
        return MOCK_QC_PHOTOS;
    }
};

// --- POINTSHAUL IMPLEMENTATION ---
const fetchFromPointshaul = async (spuNo: string): Promise<QCPhoto[]> => {
    const url = 'https://pointshaul.com/qin/api/qc/by_spu_v3';
    const timestamp = Date.now();
    const signStr = `${POINTSHAUL_APP_ID}${timestamp}${POINTSHAUL_SECRET_KEY}`;
    const sign = CryptoJS.MD5(signStr).toString();

    const requestDTO: PointshaulRequest = { spuNo, inviteCode: POINTSHAUL_INVITE_CODE, appId: POINTSHAUL_APP_ID, timestamp, sign };
    const jsonPayload = JSON.stringify(requestDTO);
    const encryptedData = encryptAES(jsonPayload, POINTSHAUL_SECRET_KEY);

    const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ encryptedData })
    });

    if (!response.ok) throw new Error(`Pointshaul API Error: ${response.status}`);
    const respJson = await response.json();
    if (respJson.code !== 200 || !respJson.encryptedData) throw new Error(`Pointshaul Error: ${respJson.message}`);

    const decryptedJson = decryptAES(respJson.encryptedData, POINTSHAUL_SECRET_KEY);
    const result = JSON.parse(decryptedJson);
    const photos: QCPhoto[] = [];
    
    if (result.data && Array.isArray(result.data)) {
        result.data.forEach((item: any) => {
             if (item.checkPhotos && Array.isArray(item.checkPhotos)) {
                 item.checkPhotos.forEach((photoUrl: string) => {
                     photos.push({
                         url: photoUrl,
                         agent: item.channel || 'Warehouse',
                         date: new Date().toISOString().split('T')[0],
                         provider: 'Pointshaul'
                     });
                 });
             }
        });
    }
    return photos;
};

// --- RAPID API IMPLEMENTATION (TAOBAO REVIEWS) ---
const fetchFromRapidAPI = async (itemId: string): Promise<QCPhoto[]> => {
    const apiKey = getRapidApiKey();
    const params = new URLSearchParams();
    
    // We use item_review to get photos uploaded by real buyers
    params.append('api', 'item_review');
    params.append('num_iid', itemId);
    params.append('page', '1');
    params.append('has_pic', '1'); // Only reviews with pictures
    params.append('sort', 'hot');    // Sort by helpful/hot reviews

    const url = `https://${RAPID_API_HOST}/api?${params.toString()}`;
    const response = await fetch(url, {
        method: 'GET',
        headers: { 'x-rapidapi-key': apiKey, 'x-rapidapi-host': RAPID_API_HOST }
    });

    const data = await response.json();

    if (
        data.error_code === 496 || 
        data.code === 496 || 
        (data.msg && data.msg.toLowerCase().includes('insufficient'))
    ) {
         throw new Error("API Subscription Error (496)");
    }

    if (!response.ok) throw new Error(`Provider Error: ${response.status}`);
    
    const photos: QCPhoto[] = [];
    
    // Parse RapidAPI Structure
    // Structure can vary: data.result.items OR data.items
    const reviews = data.result?.items || data.items || [];

    if (reviews.length === 0) return [];

    reviews.forEach((review: any) => {
        if (review.pic_url && Array.isArray(review.pic_url)) {
            review.pic_url.forEach((pic: string) => {
                let cleanPic = pic;
                if (cleanPic.startsWith('//')) cleanPic = `https:${cleanPic}`;
                
                photos.push({
                    url: cleanPic,
                    agent: "Review Photo", // Label it as review
                    date: review.date || new Date().toISOString().split('T')[0],
                    provider: 'TaobaoReviews'
                });
            });
        }
    });
    
    // Return max 24 photos
    return photos.slice(0, 24);
};

// --- UTILS ---
const extractId = (url: string): string | null => {
    const taobaoMatch = url.match(/[?&]id=(\d+)/);
    const weidianMatch = url.match(/[?&]itemID=(\d+)/);
    const aliMatch = url.match(/offer\/(\d+)\.html/);
    
    // Support short URLs if they contain ID
    if (taobaoMatch) return taobaoMatch[1];
    if (weidianMatch) return weidianMatch[1];
    if (aliMatch) return aliMatch[1];
    
    // If user pasted just the ID
    if (/^\d+$/.test(url)) return url;
    
    return null;
};

const getRapidApiKey = () => {
    if (typeof localStorage !== 'undefined') {
        const stored = localStorage.getItem('RAPIDAPI_KEY');
        if (stored && stored.trim() !== '') return stored;
    }
    return RAPID_API_KEY_DEFAULT;
};

// --- ENCRYPTION HELPERS ---
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
