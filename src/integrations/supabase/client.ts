import { createClient } from '@supabase/supabase-js';

// Estas chaves permitem que o app funcione no preview. 
// Na Vercel, as variáveis de ambiente VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY terão prioridade.
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || "https://llhcrusgtllrdiqdrhtd.supabase.co";
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxsaGNydXNndGxscmRpcWRyaHRkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY1Njk0MzMsImV4cCI6MjA5MjE0NTQzM30.dWu3EOvSKgOzHle8keElhsKUprntLDE-gVTcBlm3N_s";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);