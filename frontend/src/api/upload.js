const API = typeof __API_BASE__ !== "undefined"
  ? `${__API_BASE__}/api`
  : (import.meta.env.VITE_API_BASE || "http://localhost:3000") + "/api";

export async function uploadImage(file) {
  const fd = new FormData();
  fd.append("file", file);

  const token = localStorage.getItem("token");

  const res = await fetch(`${API}/upload/image`, {
    method: "POST",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: fd
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || "Error al subir imagen");

  return data.url;
}
