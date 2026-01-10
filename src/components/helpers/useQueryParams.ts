import { useEffect, useState } from "react";

export default function useQueryParams() {
  const [params, setParams] = useState(new URLSearchParams(window.location.search));

  useEffect(() => {
    const updateParams = () => setParams(new URLSearchParams(window.location.search));

    // Patch pushState and replaceState
    const originalPush = history.pushState;
    const originalReplace = history.replaceState;

    history.pushState = function (...args) {
      originalPush.apply(this, args);
      updateParams();
    };

    history.replaceState = function (...args) {
      originalReplace.apply(this, args);
      updateParams();
    };

    window.addEventListener("popstate", updateParams);

    return () => {
      window.removeEventListener("popstate", updateParams);
      history.pushState = originalPush;
      history.replaceState = originalReplace;
    };
  }, []);

  return params;
}
