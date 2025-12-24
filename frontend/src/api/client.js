const API = typeof __API_BASE__ !== "undefined"
  ? `${__API_BASE__}/api`
  : (import.meta.env.VITE_API_BASE || "http://localhost:3000") + "/api";

export async function apiClient(path, options = {}) {
  const token = localStorage.getItem("token");
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };

  const res = await fetch(`${API}${path}`, {
    ...options,
    headers
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) throw new Error(data?.error || "Error en solicitud");

  return data;
}

apiClient.get = (p) => apiClient(p);
apiClient.post = (p, b) => apiClient(p, { method: "POST", body: JSON.stringify(b) });
apiClient.put = (p, b) => apiClient(p, { method: "PUT", body: JSON.stringify(b) });
apiClient.delete = (p) => apiClient(p, { method: "DELETE" });
