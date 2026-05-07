import { createClient } from '@supabase/supabase-js';

// Em produção (Vercel), estas variáveis devem ser configuradas no Dashboard do projeto.
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || "";
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || "";

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.warn("Atenção: Variáveis de ambiente do Supabase não detectadas. Configure VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY.");
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);