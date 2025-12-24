import { apiClient } from "./client";

export const getStock = () => apiClient.get("/inventory/stock");
