const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export const api = {
  async request(endpoint: string, options: RequestInit = {}) {
    const token = localStorage.getItem("token") || "";
    
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
      response = await fetch(`${BASE_URL}${endpoint}`, {
        ...options,
        headers
      });
    } catch (fetchErr: any) {
      console.error("Network request failed:", fetchErr);
      throw new Error("Backend unavailable. Please ensure the backend server is running.");
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
        if (response.status === 404) {
          errorMessage = "Authentication endpoint not found (404).";
        } else if (response.status === 500) {
          errorMessage = "Internal server error (500). Please check backend logs.";
        } else if (response.status === 503) {
          errorMessage = "Service unavailable (503). Database connection might be offline.";
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
  const host = BASE_URL.replace(/\/api\/?$/, "");
  const relativePath = url.startsWith("/") ? url : `/${url}`;
  return `${host}${relativePath}`;
};

export const resolveHtmlImages = (html: string | null | undefined): string => {
  if (!html) return "";
  const host = BASE_URL.replace(/\/api\/?$/, "");
  return html.replace(/src="\/uploads\//g, `src="${host}/uploads/`);
};
