/* eslint-disable no-console */
import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/DatabaseDefinitions';

const supabaseUrl = 'https://ujcqufpnyjbuwjglpuvi.supabase.co';
const supabaseAnonKey =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVqY3F1ZnBueWpidXdqZ2xwdXZpIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NjExOTg0NTIsImV4cCI6MTk3Njc3NDQ1Mn0.65tZctEviMKFj2EkynvnWnpJ3F0x_Z8n4OB2fdyOmwU';

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
