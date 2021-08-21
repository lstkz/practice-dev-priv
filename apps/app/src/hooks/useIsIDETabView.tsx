import React from 'react';
import { IDE_MOBILE_THRESHOLD } from 'src/config';
import { useLayoutEffectFix } from './useLayoutEffectFix';

export function useIDETabView() {
  const [isTabView, setIsTabView] = React.useState(false);

  useLayoutEffectFix(() => {
    const onResize = () => {
      setIsTabView(document.body.clientWidth <= IDE_MOBILE_THRESHOLD);
    };
    onResize();
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('resize', onResize);
    };
  }, []);
  return isTabView;
}
