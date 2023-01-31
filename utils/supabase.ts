import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(String(process.env.NEXT_PUBLIC_SUPABASE_URL), String(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY));
export const getUser = async (userId: string) => {
    return await supabase
    .from('profiles')
    .select()
    .eq('id', userId)
    .limit(1);
}