import { apiClient } from "./client";

// Obtener menú (solo activos por defecto)
export async function fetchMenu(params = {}) {
  const qs = new URLSearchParams();
  if (params.category) qs.set("category", params.category);
  if (params.includeInactive) qs.set("includeInactive", "true");
  const suffix = qs.toString() ? `?${qs.toString()}` : "";
  const res = await apiClient.get(`/menu${suffix}`);
  return res;
}

export async function fetchMenuItem(id) {
  const res = await apiClient.get(`/menu/${id}`);
  return res;
}

// Crear platillo
export async function createMenuItem(payload) {
  const res = await apiClient.post("/menu", payload);
  return res;
}

// Actualizar
export async function updateMenuItem(id, payload) {
  const res = await apiClient.put(`/menu/${id}`, payload);
  return res;
}

// Borrado lógico
export async function deleteMenuItem(id) {
  const res = await apiClient.delete(`/menu/${id}`);
  return res;
}
