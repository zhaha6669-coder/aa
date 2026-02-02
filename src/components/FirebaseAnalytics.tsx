"use client";

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { initAnalytics, getAnalyticsInstance } from '@/lib/firebase';
import { logEvent } from 'firebase/analytics';

export default function FirebaseAnalytics() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Initialize analytics on mount
    initAnalytics();
  }, []);

  useEffect(() => {
    const analytics = getAnalyticsInstance();
    
    if (analytics) {
      // Log page view on route change
      const url = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : '');
      
      logEvent(analytics, 'page_view', {
        page_path: pathname,
        page_location: url,
        page_title: document.title,
      });
    }
  }, [pathname, searchParams]);

  return null;
}
