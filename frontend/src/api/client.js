const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const TOKEN_KEY = "simatrix_token";

export const getToken = () => localStorage.getItem(TOKEN_KEY) || localStorage.getItem("elysium_token");
export const setToken = (t) => {
  if (t) {
    localStorage.setItem(TOKEN_KEY, t);
  }
  localStorage.removeItem("elysium_token");
};
export const clearToken = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem("elysium_token");
};

let refreshPromise = null;

async function refreshSession() {
  if (refreshPromise) return refreshPromise;

  refreshPromise = (async () => {
    try {
      const res = await fetch(`${BASE_URL}/api/auth/refresh`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json().catch(() => null);
      if (res.ok && data?.status === 1) {
        if (data?.data?.token) {
          setToken(data.data.token);
        }
        return true;
      }
      clearToken();
      return false;
    } catch {
      clearToken();
      return false;
    } finally {
      refreshPromise = null;
    }
  })();

  return refreshPromise;
}

let onIpBannedCallback = null;
export function setIpBannedListener(fn) {
  onIpBannedCallback = fn;
}

async function request(path, { method = "GET", body, auth = false, isRetry = false } = {}) {
  const headers = { "Content-Type": "application/json" };
  const token = getToken();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  let res;
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);
    res = await fetch(`${BASE_URL}${path}`, {
      method,
      headers,
      credentials: "include",
      body: body ? JSON.stringify(body) : undefined,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
  } catch (err) {
    throw new Error("Cannot reach the server. Is the backend running?");
  }

  // Transparent token refresh on 401
  if (res.status === 401 && !isRetry && !path.includes("/auth/login") && !path.includes("/auth/refresh")) {
    const refreshed = await refreshSession();
    if (refreshed) {
      return request(path, { method, body, auth, isRetry: true });
    }
  }

  let json = null;
  try {
    json = await res.json();
  } catch {
    json = null;
  }

  if (!res.ok || (json && json.status === 0)) {
    if (json?.code === "ip_banned" || (res.status === 403 && json?.code === "ip_banned")) {
      try { sessionStorage.removeItem("simatrix_site_cache"); } catch {}
      siteCache = null;
      if (typeof onIpBannedCallback === "function") {
        onIpBannedCallback(json || { message: "You are banned" });
      }
    }
    const message = (json && (json.message || json.error)) || `Request failed (${res.status})`;
    const err = new Error(message);
    err.status = res.status;
    err.code = json?.code;
    throw err;
  }
  return json;
}

export function mediaUrl(path) {
  if (!path) return "";
  if (/^https?:\/\//i.test(path)) return path;
  if (
    path.startsWith("/courses/") ||
    path.startsWith("courses/") ||
    path.startsWith("/courses2/") ||
    path.startsWith("courses2/")
  ) {
    return path.startsWith("/") ? path : `/${path}`;
  }
  return `${BASE_URL}${path.startsWith("/") ? "" : "/"}${path}`;
}

async function uploadFile(file) {
  const body = new FormData();
  body.append("file", file);
  const token = getToken();
  let res;
  try {
    res = await fetch(`${BASE_URL}/api/admin/upload`, {
      method: "POST",
      credentials: "include",
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body,
    });
  } catch {
    throw new Error("Cannot reach the server. Is the backend running?");
  }
  const json = await res.json().catch(() => null);
  if (!res.ok || (json && json.status === 0)) {
    throw new Error((json && json.message) || `Upload failed (${res.status})`);
  }
  return json.data; // { url, filename }
}

let siteCache = null;
try {
  const cached = sessionStorage.getItem("simatrix_site_cache");
  if (cached) siteCache = JSON.parse(cached);
} catch {
  // Ignore storage errors (e.g. private browsing)
}

export const api = {
  // ---- cache utilities ----
  clearSiteCache: () => {
    siteCache = null;
    try {
      sessionStorage.removeItem("simatrix_site_cache");
    } catch {}
  },

  // ---- public ----
  getSite: async () => {
    if (siteCache) {
      request("/api/site")
        .then((fresh) => {
          if (fresh?.data) {
            siteCache = fresh;
            try {
              sessionStorage.setItem("simatrix_site_cache", JSON.stringify(fresh));
            } catch {}
          }
        })
        .catch(() => {});
      return siteCache;
    }

    const res = await request("/api/site");
    if (res?.data) {
      siteCache = res;
      try {
        sessionStorage.setItem("simatrix_site_cache", JSON.stringify(res));
      } catch {}
    }
    return res;
  },
  getCourses: (category) =>
    request(`/api/courses${category ? `?category=${category}` : ""}`),
  getCourse: (slug) => request(`/api/courses/${slug}`),
  getBranches: () => request("/api/branches"),
  getBlog: () => request("/api/blog"),
  getBlogPost: (slug) => request(`/api/blog/${slug}`),
  getGallery: () => request("/api/gallery"),
  getAwards: () => request("/api/awards"),
  createEnquiry: (data) =>
    request("/api/enquiries", { method: "POST", body: data }),
  getReviews: () => request("/api/reviews"),
  createReview: (data) =>
    request("/api/reviews", { method: "POST", body: data }),

  uploadImage: (file) => uploadFile(file),

  // ---- auth (Phase 2 HTTP-only cookie + refresh tokens) ----
  login: (email, password) =>
    request("/api/auth/login", { method: "POST", body: { email, password } }),
  refresh: () => refreshSession(),
  logout: () => request("/api/auth/logout", { method: "POST" }),
  me: () => request("/api/auth/me", { auth: true }),

  // ---- admin (generic CRUD) ----
  adminList: (resource) => request(`/api/admin/${resource}`, { auth: true }),
  adminCreate: (resource, data) => {
    api.clearSiteCache();
    return request(`/api/admin/${resource}`, { method: "POST", body: data, auth: true });
  },
  adminUpdate: (resource, id, data) => {
    api.clearSiteCache();
    return request(`/api/admin/${resource}/${id}`, { method: "PUT", body: data, auth: true });
  },
  adminDelete: (resource, id) => {
    api.clearSiteCache();
    return request(`/api/admin/${resource}/${id}`, { method: "DELETE", auth: true });
  },

  // ---- enquiry notes ----
  getEnquiryNotes: (id) => request(`/api/admin/enquiries/${id}/notes`, { auth: true }),
  addEnquiryNote: (id, body) =>
    request(`/api/admin/enquiries/${id}/notes`, { method: "POST", body: { body }, auth: true }),

  // ---- settings ----
  adminGetSettings: () => request("/api/admin/settings", { auth: true }),
  adminSaveSettings: (data) => {
    api.clearSiteCache();
    return request("/api/admin/settings", { method: "PUT", body: data, auth: true });
  },
};
