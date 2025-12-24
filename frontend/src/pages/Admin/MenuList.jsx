import { useEffect, useState } from "react";
import { fetchMenu, deleteMenuItem } from "../../api/menu";
import { useNavigate } from "react-router-dom";

export function MenuListPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  async function load() {
    setError("");
    try {
      const res = await fetchMenu();
      const data = res.data || res;
      setItems(data);
    } catch (err) {
      setError(err.message || "Error al cargar menú");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function handleDelete(id) {
    if (!window.confirm("¿Eliminar este platillo?")) return;
    await deleteMenuItem(id);
    await load();
  }

  if (loading) return <p>Cargando menú...</p>;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold">Menú</h1>
        <button
          onClick={() => navigate("/admin/menu/new")}
          className="px-3 py-2 rounded-lg bg-black text-white text-sm"
        >
          Nuevo platillo
        </button>
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <div className="grid gap-4 md:grid-cols-3">
        {items.map((item) => (
          <div
            key={item.id}
            className="border rounded-xl p-3 bg-white shadow-sm flex flex-col"
          >
            {item.imageUrl && (
              <img
                src={item.imageUrl}
                alt={item.name}
                className="w-full h-40 object-cover rounded-lg mb-2"
              />
            )}
            <h2 className="font-semibold text-sm">{item.name}</h2>
            <p className="text-xs text-gray-500 line-clamp-2">{item.description}</p>
            <div className="flex justify-between items-center mt-2 text-sm">
              <span>${Number(item.price).toFixed(2)}</span>
              {item.category && (
                <span className="text-xs px-2 py-0.5 bg-gray-100 rounded-full">
                  {item.category}
                </span>
              )}
            </div>
            <div className="flex gap-2 mt-3 text-xs">
              <button
                onClick={() => navigate(`/admin/menu/${item.id}/edit`)}
                className="flex-1 px-2 py-1 rounded-md border border-gray-300"
              >
                Editar
              </button>
              <button
                onClick={() => handleDelete(item.id)}
                className="flex-1 px-2 py-1 rounded-md border border-red-300 text-red-600"
              >
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
