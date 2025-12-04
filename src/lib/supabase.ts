import { supabase } from '@/integrations/supabase/client';

// Re-export supabase client
export { supabase };

// Supabase storage URL helper
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://cnviokaxrrmgiaffrtgb.supabase.co';

export function getStorageUrl(bucket: string, fileName: string): string {
  if (!fileName) return '';
  
  // Clean the path
  const cleanPath = fileName.startsWith('/') ? fileName.slice(1) : fileName;
  
  // URL-encode each path segment
  const encodedPath = cleanPath
    .split('/')
    .map(segment => encodeURIComponent(segment))
    .join('/');

  return `${SUPABASE_URL}/storage/v1/object/public/${bucket}/${encodedPath}`;
}
