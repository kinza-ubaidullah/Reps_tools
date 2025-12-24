<<<<<<< HEAD

=======
>>>>>>> f6c8322 (Sure! Pl)
/**
 * Service to handle IP Geolocation.
 * Uses free public APIs to detect user country for Shipping Calculator defaults.
 */

interface GeoData {
<<<<<<< HEAD
  ip: string;
  country_name: string;
  country_code: string;
  currency: string;
}

export const getUserLocation = async (): Promise<string> => {
  try {
    // Attempt 1: ipapi.co (Free, no key required for low volume)
    const response = await fetch('https://ipapi.co/json/');
    if (response.ok) {
      const data: GeoData = await response.json();
      return data.country_name || 'USA';
    }
  } catch (e) {
    console.warn("IP Geo-location failed (Primary), trying backup...");
  }

  try {
    // Attempt 2: ipwhois (Backup)
    const response = await fetch('https://ipwhois.app/json/');
    if (response.ok) {
        const data = await response.json();
        return data.country || 'USA';
    }
  } catch (e) {
    console.warn("IP Geo-location failed (Backup). Defaulting to USA.");
  }

  return 'USA';
};
=======
  ip?: string;
  country_name?: string; // ipapi.co
  country?: string;      // ipwhois.app
  countryName?: string;  // db-ip.com
  currency?: string;
}

export const getUserLocation = async (): Promise<string> => {
  // Helper function to fetch with a strict timeout (2s) to avoid blocking UI
  const fetchWithTimeout = async (url: string): Promise<GeoData> => {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), 2000);
    try {
      const response = await fetch(url, { signal: controller.signal });
      clearTimeout(id);
      if (!response.ok) throw new Error('Network response was not ok');
      return await response.json();
    } catch (e) {
      clearTimeout(id);
      throw e;
    }
  };

  // Attempt 1: ipapi.co
  try {
    const data = await fetchWithTimeout('https://ipapi.co/json/');
    if (data.country_name) return data.country_name;
  } catch (e) {
    // Silent fail to next provider
  }

  // Attempt 2: ipwhois.app
  try {
    const data = await fetchWithTimeout('https://ipwhois.app/json/');
    if (data.country) return data.country;
  } catch (e) {
    // Silent fail to next provider
  }

  // Attempt 3: db-ip.com (Additional fallback)
  try {
    const data = await fetchWithTimeout('https://api.db-ip.com/v2/free/self');
    if (data.countryName) return data.countryName;
  } catch (e) {
    // Silent fail
  }

  // Final Default
  return 'USA';
};
>>>>>>> f6c8322 (Sure! Pl)
