import { createClient } from '@supabase/supabase-js';

<<<<<<< HEAD
// Integrated Credentials
const SUPABASE_URL: string = 'https://ylajyikfeuvtfubztigw.supabase.co';
const SUPABASE_ANON_KEY: string = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlsYWp5aWtmZXV2dGZ1Ynp0aWd3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ2OTAzMjksImV4cCI6MjA4MDI2NjMyOX0.YoOcVOIyyruf4cf-ESYo4f93zl2563wDDWrkVpIwST8';

// Validate URL format (simple check)
=======
// ------------------------------------------------------------------
// 🛑 CONFIGURATION COMPLETED
// ------------------------------------------------------------------
// The URL and Key have been successfully integrated.
// ------------------------------------------------------------------

const SUPABASE_URL: string = 'https://ylajyikfeuvtfubztigw.supabase.co'; 

// Your provided Anon Key
const SUPABASE_ANON_KEY: string = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlsYWp5aWtmZXV2dGZ1Ynp0aWd3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ2OTAzMjksImV4cCI6MjA4MDI2NjMyOX0.YoOcVOIyyruf4cf-ESYo4f93zl2563wDDWrkVpIwST8';

// ------------------------------------------------------------------

// Validate URL format to prevent crashes
>>>>>>> f6c8322 (Sure! Pl)
const isValidUrl = (url: string) => {
  try {
    return !!new URL(url);
  } catch (e) {
    return false;
  }
};

// Check if we have valid configuration
export const isSupabaseConfigured = isValidUrl(SUPABASE_URL) && 
<<<<<<< HEAD
                                    !SUPABASE_URL.includes('placeholder') && 
                                    SUPABASE_ANON_KEY !== 'placeholder-key';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true
=======
                                    !SUPABASE_URL.includes('YOUR_SUPABASE_URL_HERE');

if (!isSupabaseConfigured) {
    console.warn("⚠️ Supabase URL is missing. Please ensure the Project URL is correctly set.");
}

// --- CRITICAL FIX: PLAIN FUNCTION LOCK ---
// We use a plain function to completely avoid 'this' context errors in some environments
const virtualLock = async (name: string, acquireTimeout: number, func: () => Promise<any>) => {
  return await func();
};

// --- SAFE INITIALIZATION ---
// Prevents the app from crashing with "Invalid supabaseUrl" if the user hasn't set the URL yet.
const clientUrl = isSupabaseConfigured ? SUPABASE_URL : 'https://placeholder.supabase.co';
const clientKey = isSupabaseConfigured ? SUPABASE_ANON_KEY : 'placeholder';

// Initialize Client
export const supabase = createClient(clientUrl, clientKey, {
    auth: {
        lock: virtualLock as any, 
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: false,
        storageKey: 'anyreps-auth-token',
        storage: typeof window !== 'undefined' ? window.localStorage : undefined,
>>>>>>> f6c8322 (Sure! Pl)
    }
});