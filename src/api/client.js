const API_BASE_URL = "https://choisex.com/api";

async function request(path, options = {}) {
  const { headers, ...rest } = options;
  const isFormData = rest.body instanceof FormData;

  const requestHeaders = {
    ...(isFormData ? {} : { "Content-Type": "application/json" }),
    ...(headers || {}),
  };

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...rest,
    headers: requestHeaders,
    credentials: "include", // Important: Include cookies in requests
  });

  const contentType = response.headers.get("content-type");
  const payload =
    contentType && contentType.includes("application/json") ? await response.json() : null;

  if (!response.ok) {
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

