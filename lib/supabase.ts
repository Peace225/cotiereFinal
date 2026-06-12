import { createBrowserClient } from '@supabase/ssr';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// On vérifie que les variables existent
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Variables d'environnement Supabase manquantes");
}

// En faisant cette vérification, TypeScript comprend que supabaseUrl 
// et supabaseAnonKey sont forcément des 'string' ici.
export const supabase = createBrowserClient(
  supabaseUrl as string, 
  supabaseAnonKey as string
);