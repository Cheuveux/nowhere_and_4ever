import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPA_URL;
const supabaseKey = import.meta.env.VITE_SUPA_ANON_KEY;

if (!supabaseUrl || !supabaseKey)
{
	console.error("variables manquantes dans ler fichier .env ! BELEK !!");
	throw new Error ("Supabase config is missing");
}

export const supa_config = createClient(supabaseUrl, supabaseKey);
console.log('Supabase connecte a : ', supabaseUrl);