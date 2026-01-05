import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import { SUPABASE_URL, SUPABASE_API_KEY } from '@env';

// Add these console logs to debug
console.log('SUPABASE_URL:', SUPABASE_URL);
console.log('SUPABASE_API_KEY:', SUPABASE_API_KEY ? 'Loaded' : 'Missing');

// Check if values exist before creating client
if (!SUPABASE_URL || !SUPABASE_API_KEY) {
  console.error('❌ Supabase credentials are missing!');
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_API_KEY, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

console.log('✅ Supabase client initialized');
