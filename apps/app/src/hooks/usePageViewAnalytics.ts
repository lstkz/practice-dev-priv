import { useRouter } from 'next/dist/client/router';
import React from 'react';
import { analytics } from 'src/common/analytics';

export function usePageViewAnalytics() {
  const router = useRouter();
  React.useEffect(() => {
    analytics.page();
    const handleRouteChange = () => {
      analytics.page();
    };
    router.events.on('routeChangeComplete', handleRouteChange);
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router.events]);
}
