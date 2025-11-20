import { useEffect } from "react";
import { useLocation } from "react-router-dom";

function ScrollToTop() {
  const { pathname } = useLocation();

  

  useEffect(() => {
    // open new route directly from top without scroll animation
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

export default ScrollToTop;
