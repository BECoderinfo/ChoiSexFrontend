import { useState, useEffect, useRef } from "react";

/**
 * Custom hook to handle loading state with minimum display time
 * Prevents flicker by ensuring loader shows for at least the specified time
 * 
 * @param {boolean} isLoading - The actual loading state
 * @param {number} minDisplayTime - Minimum time in ms to show loader (default: 1000ms)
 * @returns {boolean} - The delayed loading state
 */
export const useLoadingWithDelay = (isLoading, minDisplayTime = 1000) => {
  const [showLoader, setShowLoader] = useState(false);
  const timerRef = useRef(null);
  const startTimeRef = useRef(null);

  useEffect(() => {
    if (isLoading) {
      // Start loading immediately
      setShowLoader(true);
      startTimeRef.current = Date.now();
      
      // Clear any existing timer
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    } else {
      // Loading finished - check if minimum time has passed
      if (startTimeRef.current) {
        const elapsed = Date.now() - startTimeRef.current;
        const remainingTime = minDisplayTime - elapsed;

        if (remainingTime > 0) {
          // Wait for remaining time before hiding loader
          timerRef.current = setTimeout(() => {
            setShowLoader(false);
            startTimeRef.current = null;
          }, remainingTime);
        } else {
          // Minimum time already passed, hide immediately
          setShowLoader(false);
          startTimeRef.current = null;
        }
      } else {
        setShowLoader(false);
      }
    }

    // Cleanup
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [isLoading, minDisplayTime]);

  return showLoader;
};

