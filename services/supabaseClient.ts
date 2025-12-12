import { createClient } from '@supabase/supabase-js';

// Integrated Credentials
const SUPABASE_URL: string = 'https://ylajyikfeuvtfubztigw.supabase.co';
const SUPABASE_ANON_KEY: string = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlsYWp5aWtmZXV2dGZ1Ynp0aWd3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ2OTAzMjksImV4cCI6MjA4MDI2NjMyOX0.YoOcVOIyyruf4cf-ESYo4f93zl2563wDDWrkVpIwST8';

// Validate URL format (simple check)
const isValidUrl = (url: string) => {
  try {
    return !!new URL(url);
  } catch (e) {
    return false;
  }
};

// Check if we have valid configuration
export const isSupabaseConfigured = isValidUrl(SUPABASE_URL) && 
                                    !SUPABASE_URL.includes('placeholder') && 
                                    SUPABASE_ANON_KEY !== 'placeholder-key';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);