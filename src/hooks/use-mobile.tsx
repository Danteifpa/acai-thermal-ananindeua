import * as React from "react";

const MOBILE_BREAKPOINT = 768;

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean>(false);

  React.useEffect(() => {
    if (typeof window === 'undefined') return;

    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    
    // Safety check for mql
    if (!mql) {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
      return;
    }

    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };

    // Use modern addEventListener with fallback
    if (mql.addEventListener) {
      mql.addEventListener("change", onChange);
    } else {
      // @ts-ignore - fallback for older browsers
      mql.addListener(onChange);
    }

    setIsMobile(mql.matches);

    return () => {
      if (mql.removeEventListener) {
        mql.removeEventListener("change", onChange);
      } else {
        // @ts-ignore - fallback for older browsers
        mql.removeListener(onChange);
      }
    };
  }, []);

  return isMobile;
}