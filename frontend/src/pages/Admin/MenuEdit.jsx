import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { MenuForm } from "../../components/admin/MenuForm";
import { fetchMenuItem, updateMenuItem } from "../../api/menu";

export function MenuEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [initialValues, setInitialValues] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const res = await fetchMenuItem(id);
      const item = res.data || res;
      setInitialValues({
        name: item.name,
        description: item.description || "",
        price: item.price,
        cost: item.cost || "",
        category: item.category || "",
        imageUrl: item.imageUrl || ""
      });
      setLoading(false);
    }
    load();
  }, [id]);

  async function handleSubmit(payload) {
    await updateMenuItem(id, payload);
    navigate("/admin/menu");
  }

  if (loading) return <p>Cargando platillo...</p>;

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Editar platillo</h1>
      <MenuForm
        initialValues={initialValues}
        onSubmit={handleSubmit}
        submitLabel="Guardar cambios"
      />
    </div>
  );
}
