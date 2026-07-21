import { createClient } from '@supabase/supabase-js';

type Req = { method?: string };
type Res = {
  status: (code: number) => { json: (body: Record<string, string>) => void };
};

export default async function handler(req: Req, res: Res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ status: 'error', message: 'Method not allowed' });
  }

  const supabaseUrl =
    process.env.VITE_SUPABASE_URL || 'https://prlkuuhsvtlpcziekqcx.supabase.co';
  const supabaseAnonKey =
    process.env.VITE_SUPABASE_ANON_KEY ||
    'sb_publishable_XrmQIGBiXHBVhKPx29RTnQ_mW6lpaUT';

  const supabase = createClient(supabaseUrl, supabaseAnonKey);

  // Jednoduchý read — prebudí Supabase a resetne 7-dňový sleep timer
  const { error } = await supabase.from('equipment').select('id').limit(1);

  if (error) {
    return res.status(500).json({ status: 'error', message: error.message });
  }

  return res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
  });
}
