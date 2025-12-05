// Admin database helper - uses raw fetch to bypass TypeScript strict checking
// Tables exist in external Supabase but not in Lovable Cloud types

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

interface QueryOptions {
  select?: string;
  eq?: { column: string; value: string | number | boolean };
  order?: { column: string; ascending?: boolean };
  limit?: number;
}

export const adminQuery = async (table: string, options: QueryOptions = {}) => {
  let url = `${SUPABASE_URL}/rest/v1/${table}`;
  const params = new URLSearchParams();
  
  if (options.select) params.append('select', options.select);
  if (options.eq) params.append(options.eq.column, `eq.${options.eq.value}`);
  if (options.order) {
    params.append('order', `${options.order.column}.${options.order.ascending ? 'asc' : 'desc'}`);
  }
  if (options.limit) params.append('limit', options.limit.toString());
  
  if (params.toString()) url += `?${params.toString()}`;

  const res = await fetch(url, {
    headers: {
      'apikey': SUPABASE_ANON_KEY,
      'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      'Content-Type': 'application/json'
    }
  });
  
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Query failed');
  }
  
  return res.json();
};

export const adminInsert = async (table: string, data: Record<string, unknown> | Record<string, unknown>[]) => {
  const url = `${SUPABASE_URL}/rest/v1/${table}`;
  
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'apikey': SUPABASE_ANON_KEY,
      'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=minimal'
    },
    body: JSON.stringify(Array.isArray(data) ? data : [data])
  });
  
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Insert failed');
  }
  
  return { success: true };
};

export const adminUpdate = async (table: string, data: Record<string, unknown>, eqColumn: string, eqValue: string) => {
  const url = `${SUPABASE_URL}/rest/v1/${table}?${eqColumn}=eq.${eqValue}`;
  
  const res = await fetch(url, {
    method: 'PATCH',
    headers: {
      'apikey': SUPABASE_ANON_KEY,
      'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=minimal'
    },
    body: JSON.stringify(data)
  });
  
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Update failed');
  }
  
  return { success: true };
};

export const adminDelete = async (table: string, eqColumn: string, eqValue: string) => {
  const url = `${SUPABASE_URL}/rest/v1/${table}?${eqColumn}=eq.${eqValue}`;
  
  const res = await fetch(url, {
    method: 'DELETE',
    headers: {
      'apikey': SUPABASE_ANON_KEY,
      'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      'Content-Type': 'application/json'
    }
  });
  
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Delete failed');
  }
  
  return { success: true };
};

export const trackVisitor = async (data: {
  user_agent: string;
  page_url: string;
  referrer: string | null;
  device_type: string;
  browser: string;
}) => {
  try {
    await adminInsert('visitor_logs', data);
  } catch (e) {
    // Silent fail - visitor tracking shouldn't break the app
  }
};
