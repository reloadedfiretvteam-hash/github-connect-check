// Helper for admin panel queries - bypasses TypeScript strict checking
// since tables exist in external Supabase but not in Lovable Cloud types
import { supabase } from '@/integrations/supabase/client';

export const adminDb = {
  from: (table: string) => supabase.from(table as any) as any
};

export const trackVisitor = async (data: {
  user_agent: string;
  page_url: string;
  referrer: string | null;
  device_type: string;
  browser: string;
}) => {
  try {
    await supabase.from('visitor_logs' as any).insert([data] as any);
  } catch (e) {
    // Silent fail
  }
};
