import { InventoryDashboard } from "../../components/InventoryDashboard";

export function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Dashboard Operativo</h1>
        <p className="text-sm text-neutral-400">
          Inventario en tiempo casi real desde el backend v2.
        </p>
      </div>

      <section>
        <h2 className="text-sm font-medium mb-2">Inventario</h2>
        <InventoryDashboard />
      </section>
    </div>
  );
}
