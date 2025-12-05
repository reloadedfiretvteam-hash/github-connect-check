import { useEffect } from 'react';
import { trackVisitor } from '@/lib/supabaseAdmin';

const detectDevice = (userAgent: string): string => {
  if (/mobile/i.test(userAgent)) return 'mobile';
  if (/tablet/i.test(userAgent)) return 'tablet';
  return 'desktop';
};

const detectBrowser = (userAgent: string): string => {
  if (/chrome/i.test(userAgent) && !/edge/i.test(userAgent)) return 'Chrome';
  if (/firefox/i.test(userAgent)) return 'Firefox';
  if (/safari/i.test(userAgent) && !/chrome/i.test(userAgent)) return 'Safari';
  if (/edge/i.test(userAgent)) return 'Edge';
  return 'Unknown';
};

export const useVisitorTracking = () => {
  useEffect(() => {
    const userAgent = navigator.userAgent;
    trackVisitor({
      user_agent: userAgent,
      page_url: window.location.pathname,
      referrer: document.referrer || null,
      device_type: detectDevice(userAgent),
      browser: detectBrowser(userAgent)
    });
  }, []);
};

export default useVisitorTracking;
