// utils/api.ts
const API_BASE = import.meta.env.VITE_API_URL;

interface ApiConfig extends Omit<RequestInit, 'body'> {
  headers?: Record<string, string>;
  body?: any; // Accept objects that can be stringified
}

export const api = {
  /**
   * Core request handler
   */
  request: async <T>(endpoint: string, config: ApiConfig = {}): Promise<T> => {
    const headers = new Headers({
      'Content-Type': 'application/json',
      ...config.headers,
    });

    const url = `${API_BASE}${endpoint}`;
    const method = config.method || 'GET';
    const body = config.body && typeof config.body === 'object' && !(config.body instanceof FormData)
      ? JSON.stringify(config.body)
      : config.body;

    try {
      const response = await fetch(url, {
        ...config,
        method,
        headers,
        body,
        credentials: 'include', // ✅ Active l'envoi automatique des cookies
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        const errorMessage = errorData?.message || `HTTP error! Status: ${response.status}`;
        throw new Error(errorMessage);
      }

      // 204 No Content
      if (response.status === 204) {
        return undefined as unknown as T;
      }

      return await response.json();
    } catch (error) {
      console.error(`[API] ${method} ${url} failed:`, error);
      throw error;
    }
  },

  // Generic methods
  get: <T>(endpoint: string) => api.request<T>(endpoint),
  gets: <T>(endpoint: string) => api.request<T>(endpoint),
  post: <T>(endpoint: string, body?: unknown) =>
    api.request<T>(endpoint, { method: 'POST', body }),
  put: <T>(endpoint: string, body?: unknown) =>
    api.request<T>(endpoint, { method: 'PUT', body }),
  delete: <T = void>(endpoint: string) =>
    api.request<T>(endpoint, { method: 'DELETE' }),

  // Custom entity helpers
  getPerson: <T>(id: string | number) => api.get<T>(`/personnes/${id}`),
  getHousehold: <T>(id: string | number) => api.get<T>(`/menages/${id}`),
};
