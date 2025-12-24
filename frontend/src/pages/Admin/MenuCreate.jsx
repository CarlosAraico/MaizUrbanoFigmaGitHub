import { useNavigate } from "react-router-dom";
import { MenuForm } from "../../components/admin/MenuForm";
import { createMenuItem } from "../../api/menu";

export function MenuCreatePage() {
  const navigate = useNavigate();

  async function handleSubmit(payload) {
    await createMenuItem(payload);
    navigate("/admin/menu");
  }

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Nuevo platillo</h1>
      <MenuForm onSubmit={handleSubmit} submitLabel="Crear platillo" />
    </div>
  );
}
