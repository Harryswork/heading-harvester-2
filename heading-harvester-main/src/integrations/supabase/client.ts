// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://lpjrfaydhsdxxwajbuhe.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxwanJmYXlkaHNkeHh3YWpidWhlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzgxNDUyMTksImV4cCI6MjA1MzcyMTIxOX0.LpnJ6ai-FbJ0V58qoSCp7gS2j40sR5RNSBT9TayvVX8";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);