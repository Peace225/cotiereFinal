import { createBrowserClient } from '@supabase/ssr'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// On vérifie que les variables existent pour satisfaire TypeScript
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Variables d'environnement Supabase manquantes");
}

export const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey);