
/**
 * Service to handle IP Geolocation.
 * Uses free public APIs to detect user country for Shipping Calculator defaults.
 */

interface GeoData {
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
