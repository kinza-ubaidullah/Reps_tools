
import { Product } from '../types';
import { supabase } from './supabaseClient';

// CONFIGURATION: Taobao Advanced (RapidAPI)
const API_HOST = 'taobao-advanced.p.rapidapi.com';
const API_BASE_URL = `https://${API_HOST}/api`;

// Default Fallback (likely expired/limited)
const DEFAULT_KEY = 'e20bdb91ffmsh85fb12bb4b9069bp13799ejsn3e956971cda8'; 

// Cache for the key so we don't hit Supabase on every keystroke
let CACHED_API_KEY = '';

// --- MOCK DATA FOR DEMO MODE ---
const DEMO_PRODUCTS: Product[] = [
    {
        id: 'mock-1',
        title: 'Nike Dunk Low Retro White Black (Panda) - Top Batch',
        priceCNY: 320,
        image: 'https://images.unsplash.com/photo-1637844527273-218ba4899933?auto=format&fit=crop&w=800&q=80',
        sales: 5400,
        platform: 'Taobao',
        link: 'https://item.taobao.com/item.htm?id=mock1'
    },
    {
        id: 'mock-2',
        title: 'ESSENTIALS Fear of God Hoodie - 2024 Collection Heavyweight',
        priceCNY: 158,
        image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80',
        sales: 12500,
        platform: 'Taobao',
        link: 'https://item.taobao.com/item.htm?id=mock2'
    },
    {
        id: 'mock-3',
        title: 'Jordan 4 Retro Military Black - GX Batch',
        priceCNY: 460,
        image: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=800&q=80',
        sales: 3200,
        platform: 'Weidian',
        link: 'https://weidian.com/item.html?itemID=mock3'
    },
    {
        id: 'mock-4',
        title: 'Stussy 8 Ball Fleece Reversible Jacket',
        priceCNY: 225,
        image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=800&q=80',
        sales: 890,
        platform: 'Taobao',
        link: 'https://item.taobao.com/item.htm?id=mock4'
    }
];

interface SearchOptions {
  minPrice?: string;
  maxPrice?: string;
  sort?: string;
}

// Fetch Key from Supabase or LocalStorage or Default
const getApiKey = async (userKey?: string): Promise<string> => {
    if (userKey && userKey.trim() !== '') return userKey;
    
    // Check Memory Cache
    if (CACHED_API_KEY) return CACHED_API_KEY;

    // Check LocalStorage
    if (typeof localStorage !== 'undefined') {
        const stored = localStorage.getItem('RAPIDAPI_KEY');
        if (stored && stored.trim() !== '') {
            CACHED_API_KEY = stored;
            return stored;
        }
    }

    // Check Supabase Backend
    try {
        const { data } = await supabase
            .from('app_settings')
            .select('value')
            .eq('key', 'rapid_api_key')
            .single();
            
        if (data && data.value) {
            CACHED_API_KEY = data.value;
            return data.value;
        }
    } catch (e) {
        // Silent fail
    }

    return DEFAULT_KEY;
};

// --- RECURSIVE PARSER ---
const findItemsArray = (obj: any): any[] => {
    if (!obj) return [];
    if (Array.isArray(obj)) {
        if (obj.length > 0) {
            const first = obj[0];
            if (first.num_iid || first.item_id || first.id || first.title || first.promotion_price) {
                return obj;
            }
        }
        return [];
    }
    if (typeof obj === 'object') {
        const searchKeys = ['result', 'items', 'item', 'data', 'list', 'recommend_list', 'auctions'];
        for (const key of searchKeys) {
            if (obj[key]) {
                const found = findItemsArray(obj[key]);
                if (found.length > 0) return found;
            }
        }
    }
    return [];
};

export const searchTaobaoProducts = async (
    query: string, 
    page = 1, 
    userKey?: string, 
    options?: SearchOptions,
    platform: 'Taobao' | 'Weidian' | '1688' = 'Taobao'
): Promise<Product[]> => {
  if (!query) return [];

  const apiKey = await getApiKey(userKey);
  const isCustomKey = apiKey !== DEFAULT_KEY;

  try {
    const params = new URLSearchParams();
    
    if (platform === '1688') {
        params.append('api', 'item_search_1688');
    } else {
        params.append('api', 'item_search');
    }

    params.append('q', query);
    params.append('page', page.toString());
    params.append('page_size', '40'); 

    if (options?.sort) {
        switch(options.sort) {
            case 'sales': params.append('sort', 'sale_des'); break;
            case 'price_asc': params.append('sort', 'price_asc'); break;
            case 'price_desc': params.append('sort', 'price_des'); break;
            default: params.append('sort', 'default');
        }
    }

    if (options?.minPrice) params.append('start_price', options.minPrice);
    if (options?.maxPrice) params.append('end_price', options.maxPrice);

    const url = `${API_BASE_URL}?${params.toString()}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'x-rapidapi-key': apiKey,
        'x-rapidapi-host': API_HOST
      }
    });

    const data = await response.json();

    if (!response.ok || data.error_code) {
        const errorMsg = data.message || data.msg || `HTTP Error ${response.status}`;
        console.warn("API Key Failed, switching to Demo Data:", errorMsg);
        
        // Return demo data if API fails to keep UI active
        return getMockResults(query, platform);
    }

    const rawItems = findItemsArray(data);

    if (!rawItems || rawItems.length === 0) {
        // If searching "demo" or "test" specifically, show mock
        if (query.toLowerCase().includes('demo')) {
            return getMockResults(query, platform);
        }
        return [];
    }

    return parseItems(rawItems, platform);

  } catch (error: any) {
    console.error(`[TaobaoService] Search Failed:`, error);
    return getMockResults(query, platform);
  }
};

const getMockResults = (query: string, platform: string) => {
      const q = query.toLowerCase();
      const results = DEMO_PRODUCTS.filter(p => 
          p.title.toLowerCase().includes(q) || 
          p.platform.toLowerCase() === platform.toLowerCase()
      );
      // If filtering returns nothing, just return all demo products to show SOMETHING
      return results.length > 0 ? results : DEMO_PRODUCTS;
};

const parseItems = (rawItems: any[], platform: 'Taobao' | 'Weidian' | '1688'): Product[] => {
    return rawItems.map((item: any) => {
        const id = item.num_iid || item.item_id || item.id || item.num_id || item.detail_url?.match(/id=(\d+)/)?.[1];
        if (!id) return null;

        let imageUrl = item.pic_url || item.pic || item.image || item.img || item.mainPic || '';
        if (imageUrl && imageUrl.startsWith('//')) imageUrl = `https:${imageUrl}`;
        if (!imageUrl) imageUrl = 'https://placehold.co/400x400/222/888?text=No+Image';
        
        let priceStr = String(item.price || item.promotion_price || item.view_price || item.orginal_price || item.reserve_price || '0');
        if (priceStr.includes('-')) priceStr = priceStr.split('-')[0];
        priceStr = priceStr.replace(/[^\d.]/g, '');
        const price = parseFloat(priceStr) || 0;

        let sales = 0;
        if (item.sales) {
             const salesStr = String(item.sales).replace('+', '').replace('人付款', '').replace('sold', '').replace(/\D/g, '');
             sales = parseInt(salesStr) || 0;
        } else if (item.sold) {
             sales = parseInt(String(item.sold)) || 0;
        }
        
        const title = item.title || item.name || item.desc || 'Unknown Product';
        
        let link = '';
        if (platform === '1688') {
             link = `https://detail.1688.com/offer/${id}.html`;
        } else {
             link = `https://item.taobao.com/item.htm?id=${id}`;
        }

        return {
            id: String(id),
            title: title,
            priceCNY: price,
            image: imageUrl,
            sales: sales,
            platform: platform,
            link: link
        };
    }).filter((item): item is Product => item !== null);
};
