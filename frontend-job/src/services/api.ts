const rawApiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
export const API_URL = rawApiUrl.replace(/\/+$/, "").replace(/\/api$/, "");
export const BASE_URL = `${API_URL}/api`;

const formatEndpointUrl = (endpoint: string): string => {
  const cleanEndpoint = endpoint.trim();
  if (cleanEndpoint.startsWith("http://") || cleanEndpoint.startsWith("https://")) {
    return cleanEndpoint;
  }
  if (cleanEndpoint.startsWith("/api/")) {
    return `${API_URL}${cleanEndpoint}`;
  }
  const relative = cleanEndpoint.startsWith("/") ? cleanEndpoint : `/${cleanEndpoint}`;
  return `${BASE_URL}${relative}`;
};

export const api = {
  async request(endpoint: string, options: RequestInit = {}) {
    const token = localStorage.getItem("token") || "";
    const fullUrl = formatEndpointUrl(endpoint);
    
    const headers: Record<string, string> = {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };

    // If options.body is a string, set JSON header. Otherwise let browser set FormData headers.
    if (!(options.body instanceof FormData)) {
      headers["Content-Type"] = "application/json";
    }

    // Merge options headers
    if (options.headers) {
      Object.assign(headers, options.headers);
    }

    let response;
    try {
      response = await fetch(fullUrl, {
        ...options,
        headers
      });
    } catch (fetchErr: any) {
      if (import.meta.env.DEV) {
        console.error(`[API Network Error] ${options.method || "GET"} ${fullUrl}:`, fetchErr);
      }
      // A fetch exception means the request never reached the server.
      // This is caused by: CORS block, backend unreachable, or network issue.
      const errMsg = fetchErr?.message || "";
      if (errMsg.includes("Failed to fetch") || errMsg.includes("NetworkError") || fetchErr instanceof TypeError) {
        throw new Error(
          "Backend connection error: Unable to reach the API server. " +
          "This is usually caused by a CORS misconfiguration or the backend being unavailable. " +
          "If the Render backend is waking from a cold start, wait 30–50 seconds and try again."
        );
      }
      throw new Error(`Network error: ${errMsg || "Unknown connection failure."}`);
    }

    if (response.status === 401) {
      localStorage.removeItem("token");
    }

    if (!response.ok) {
      let errorMessage = `HTTP error! Status: ${response.status}`;
      try {
        const errData = await response.json();
        if (errData && errData.error) {
          errorMessage = errData.error;
        }
      } catch {
        // Could not parse JSON body — use status-based messages
        if (response.status === 401) {
          errorMessage = "Authentication failed: Invalid or expired credentials.";
        } else if (response.status === 403) {
          errorMessage = "Access denied: You do not have permission to perform this action.";
        } else if (response.status === 404) {
          errorMessage = "API route not found (404). The endpoint may be incorrect.";
        } else if (response.status === 500) {
          errorMessage = "Backend server error (500). Check the Render service logs.";
        } else if (response.status === 503) {
          errorMessage = "Service unavailable (503): Database connection may be offline. Check MongoDB Atlas.";
        }
      }
      throw new Error(errorMessage);
    }

    return response.json();
  },

  get(endpoint: string, options?: RequestInit) {
    return this.request(endpoint, { ...options, method: "GET" });
  },

  post(endpoint: string, data?: any, options?: RequestInit) {
    const isFormData = data instanceof FormData;
    return this.request(endpoint, {
      ...options,
      method: "POST",
      body: isFormData ? data : JSON.stringify(data)
    });
  },

  put(endpoint: string, data?: any, options?: RequestInit) {
    const isFormData = data instanceof FormData;
    return this.request(endpoint, {
      ...options,
      method: "PUT",
      body: isFormData ? data : JSON.stringify(data)
    });
  },

  delete(endpoint: string, options?: RequestInit) {
    return this.request(endpoint, { ...options, method: "DELETE" });
  }
};

export const getImageUrl = (url: string | null | undefined, width?: number): string => {
  if (!url) return "";
  if (/^(https?:\/\/|blob:|data:)/i.test(url)) {
    if (url.includes("res.cloudinary.com")) {
      const uploadIndex = url.indexOf("/upload/");
      if (uploadIndex !== -1) {
        const prefix = url.substring(0, uploadIndex + 8);
        const suffix = url.substring(uploadIndex + 8);
        let transforms = "f_auto,q_auto";
        if (width) {
          transforms += `,w_${width},c_limit`;
        }
        return `${prefix}${transforms}/${suffix}`;
      }
    }
    return url;
  }
  if (url.startsWith("/uploads/") || url.startsWith("uploads/")) {
    const relativePath = url.startsWith("/") ? url : `/${url}`;
    return `${API_URL}${relativePath}`;
  }
  return url;
};

export const resolveHtmlImages = (html: string | null | undefined): string => {
  if (!html) return "";
  return html.replace(/src="\/uploads\//g, `src="${API_URL}/uploads/`);
};
