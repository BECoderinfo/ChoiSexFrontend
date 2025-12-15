// const API_BASE_URL = "https://choisex.com/api";
const API_BASE_URL="https://choisex.com/api" //http://localhost:5000/api

async function request(path, options = {}) {
  const { headers, ...rest } = options;
  const isFormData = rest.body instanceof FormData;

  // Get access token from localStorage
  let token = localStorage.getItem("accessToken");

  const requestHeaders = {
    ...(isFormData ? {} : { "Content-Type": "application/json" }),
    ...(headers || {}),
  };

  // Add Bearer token if available
  if (token) {
    requestHeaders.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...rest,
    headers: requestHeaders,
    credentials: "include", // Important: Include cookies in requests
  });

  const contentType = response.headers.get("content-type");
  const payload =
    contentType && contentType.includes("application/json") ? await response.json() : null;

  if (!response.ok) {
    // Handle 401 Unauthorized - token expired or invalid
    if (response.status === 401) {
      const errorCode = payload?.code;
      
      // If token expired, try to refresh it
      if (errorCode === "TOKEN_EXPIRED") {
        const refreshToken = localStorage.getItem("refreshToken");
        
        if (refreshToken) {
          try {
            // Try to refresh the token
            const refreshResponse = await fetch(`${API_BASE_URL}/user/auth/refresh-token`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              credentials: "include",
              body: JSON.stringify({ refreshToken }),
            });

            const refreshPayload = refreshResponse.ok && refreshResponse.headers.get("content-type")?.includes("application/json")
              ? await refreshResponse.json()
              : null;

            if (refreshResponse.ok && refreshPayload?.accessToken) {
              // Update token in localStorage
              localStorage.setItem("accessToken", refreshPayload.accessToken);
              
              // Retry the original request with new token
              const retryHeaders = {
                ...requestHeaders,
                Authorization: `Bearer ${refreshPayload.accessToken}`,
              };

              const retryResponse = await fetch(`${API_BASE_URL}${path}`, {
                ...rest,
                headers: retryHeaders,
                credentials: "include",
              });

              const retryContentType = retryResponse.headers.get("content-type");
              const retryPayload =
                retryContentType && retryContentType.includes("application/json")
                  ? await retryResponse.json()
                  : null;

              if (retryResponse.ok) {
                return retryPayload;
              }
            }
          } catch (refreshError) {
            console.error("Token refresh failed:", refreshError);
          }
        }
      }

      // Clear tokens from localStorage
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      
      // Only redirect to login for protected routes/endpoints
      // Don't redirect for public routes like home, products, categories
      // Also don't redirect for auth check endpoints like /user/auth/me
      const protectedPaths = ['/cart', '/delivery', '/billing', '/orderHistory', '/settings', '/track'];
      const isProtectedRoute = protectedPaths.some(protectedPath => window.location.pathname.includes(protectedPath));
      
      // Auth check endpoint - should not redirect
      const isAuthCheckEndpoint = path.includes('/user/auth/me');
      
      // Only redirect if on a protected route or if the API call was for a protected endpoint
      // Exclude auth check endpoints from redirect
      const isProtectedEndpoint = !isAuthCheckEndpoint && (
        path.includes('/cart') || 
        path.includes('/order') || 
        (path.includes('/user/') && !path.includes('/user/auth/me')) ||
        path.includes('/delivery') ||
        path.includes('/billing')
      );
      
      if ((isProtectedRoute || isProtectedEndpoint) && 
          window.location.pathname !== "/login" && 
          !window.location.pathname.includes("/register")) {
        window.location.href = "/login";
      }
    }
    const message = payload?.message || "Something went wrong";
    throw new Error(message);
  }

  return payload;
}

function buildAssetUrl(path) {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  return `${API_BASE_URL.replace("/api", "")}${path}`;
}

export { request, API_BASE_URL, buildAssetUrl };

