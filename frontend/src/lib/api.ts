const API = import.meta.env.VITE_API_BASE || "http://127.0.0.1:4000";

export type MenuItem = {
  id: string;
  name: string;
  desc: string;
  price: number;
  category?: string;
};

export async function fetchMenu(): Promise<MenuItem[]> {
  const r = await fetch(`${API}/api/menu`);
  if (!r.ok) throw new Error("menu_failed");
  const j = await r.json();
  return Array.isArray(j?.items) ? j.items : [];
}

export async function createOrder(payload: any) {
  const r = await fetch(`${API}/api/orders`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(payload),
  });
  const j = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(j?.error || "order_failed");
  return j;
}
