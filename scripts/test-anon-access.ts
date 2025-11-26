import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Missing Supabase credentials in .env.local');
    process.exit(1);
}

console.log('Testing access with ANON key...');
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testFetch() {
    try {
        const { data, error } = await supabase
            .from('champions')
            .select('id, key, name, title, title_en, image, tags, factions, custom_tags, version, gender, species')
            .limit(1);

        if (error) {
            console.error('Error fetching champions:', error);
        } else {
            console.log('Successfully fetched champions:', data);
        }
    } catch (err) {
        console.error('Unexpected error:', err);
    }
}

testFetch();
