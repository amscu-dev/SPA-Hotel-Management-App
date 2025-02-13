import { createClient } from "@supabase/supabase-js";
export const supabaseUrl = "https://gcdaurxqjuxkumfdazxl.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdjZGF1cnhxanV4a3VtZmRhenhsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzkwMTkzNzIsImV4cCI6MjA1NDU5NTM3Mn0.agcYIdDMyHZjRaCNiOCOYjtIKB_GXkHrWjJChCovnBw";
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
