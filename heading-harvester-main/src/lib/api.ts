import { supabase } from './supabase';

export interface ApiKeyResponse {
  apiKey: string;
  createdAt: string;
}

export const generateApiKey = async (): Promise<ApiKeyResponse | null> => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return null;

  const { data, error } = await supabase
    .from('api_keys')
    .insert([
      { user_id: user.id, key: crypto.randomUUID() }
    ])
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const validateApiKey = async (apiKey: string): Promise<boolean> => {
  const { data, error } = await supabase
    .from('api_keys')
    .select('id')
    .eq('key', apiKey)
    .single();

  if (error) return false;
  return !!data;
};