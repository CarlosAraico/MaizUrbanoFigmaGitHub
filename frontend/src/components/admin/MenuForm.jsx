import { useState } from "react";
import { ImageUploadField } from "../ImageUploadField";

const initialState = {
  name: "",
  description: "",
  price: "",
  cost: "",
  category: "",
  imageUrl: ""
};

export function MenuForm({ initialValues = {}, onSubmit, submitLabel = "Guardar" }) {
  const [form, setForm] = useState({ ...initialState, ...initialValues });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const payload = {
        name: form.name,
        description: form.description || null,
        price: Number(form.price),
        cost: form.cost ? Number(form.cost) : null,
        category: form.category || null,
        imageUrl: form.imageUrl || null
      };
      await onSubmit(payload);
    } catch (err) {
      setError(err.message || "Error al guardar");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-xl">
      {error && <p className="text-sm text-red-500">{error}</p>}

      <div>
        <label className="block text-sm font-medium mb-1">Nombre</label>
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          className="w-full border rounded-lg px-3 py-2 text-sm"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Descripción</label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          className="w-full border rounded-lg px-3 py-2 text-sm"
          rows={3}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Precio venta</label>
          <input
            type="number"
            step="0.01"
            name="price"
            value={form.price}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2 text-sm"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Costo</label>
          <input
            type="number"
            step="0.01"
            name="cost"
            value={form.cost}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2 text-sm"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Categoría</label>
        <input
          name="category"
          value={form.category}
          onChange={handleChange}
          className="w-full border rounded-lg px-3 py-2 text-sm"
          placeholder="Esquites, Elotes, Bebidas..."
        />
      </div>

      <div>
        <ImageUploadField onChange={(url) => setForm((f) => ({ ...f, imageUrl: url }))} />
        {form.imageUrl && !form.imageUrl.startsWith("blob:") && (
          <p className="text-xs text-gray-500 mt-1 break-all">URL actual: {form.imageUrl}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="px-4 py-2 rounded-lg bg-black text-white text-sm font-medium"
      >
        {loading ? "Guardando..." : submitLabel}
      </button>
    </form>
  );
}
