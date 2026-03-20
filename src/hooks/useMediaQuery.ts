import { useEffect, useState } from "react";

function getMatches(query: string) {
  if (typeof window === "undefined") {
    return false;
  }

  return window.matchMedia(query).matches;
}

export function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(() => getMatches(query));

  useEffect(() => {
    const mediaQueryList = window.matchMedia(query);
    const legacyMediaQueryList = mediaQueryList as MediaQueryList & {
      addListener?: (listener: () => void) => void;
      removeListener?: (listener: () => void) => void;
    };

    function handleChange() {
      setMatches(mediaQueryList.matches);
    }

    handleChange();

    if ("addEventListener" in mediaQueryList) {
      mediaQueryList.addEventListener("change", handleChange);
      return () => mediaQueryList.removeEventListener("change", handleChange);
    }

    legacyMediaQueryList.addListener?.(handleChange);
    return () => legacyMediaQueryList.removeListener?.(handleChange);
  }, [query]);

  return matches;
}
