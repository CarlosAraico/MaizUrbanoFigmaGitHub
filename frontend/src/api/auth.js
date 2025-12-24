import { apiClient } from "./client";

export async function login(email, password) {
  const res = await apiClient.post("/auth/login", { email, password });
  if (res.token) {
    localStorage.setItem("token", res.token);
  }
  return res.user;
}

export async function getCurrentUser() {
  const res = await apiClient.get("/auth/me");
  return res.user;
}

export function logout() {
  localStorage.removeItem("token");
}
