import { useAuth } from "../context/AuthContext";
import { InventoryDashboard } from "../components/InventoryDashboard";

export function AdminHome() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-[var(--color-background)] text-[var(--color-text-primary)]">
      <div className="page-shell py-10 space-y-6">
        <header className="flex items-center justify-between">
          <div>
            <p className="text-sm text-[var(--color-text-muted)]">Sesion activa</p>
            <h1 className="text-2xl font-semibold">
              {user?.name || user?.email} <span className="text-sm">({user?.role})</span>
            </h1>
          </div>
          <button className="btn btn-ghost" onClick={logout}>
            Cerrar sesión
          </button>
        </header>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold">Inventario</h2>
          <InventoryDashboard />
        </section>
      </div>
    </div>
  );
}
