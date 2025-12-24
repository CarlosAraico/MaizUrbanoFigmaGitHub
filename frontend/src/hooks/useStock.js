import { useEffect, useState } from "react";
import { apiClient } from "../api/client";

export function useStock(intervalMs = 5000) {
  const [stock, setStock] = useState([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    try {
      const res = await apiClient.get("/inventory/stock");
      setStock(res.data || res);
    } catch (err) {
      console.error("Error cargando stock", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    const id = setInterval(load, intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);

  return { stock, loading };
}
