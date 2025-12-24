import { Outlet, NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";

export function AdminLayout() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen flex bg-neutral-950 text-neutral-50">
      <aside className="w-60 border-r border-neutral-800 bg-neutral-900/80 flex flex-col">
        <div className="px-4 py-4 border-b border-neutral-800">
          <p className="text-sm font-semibold">Admin Maíz Urbano</p>
          {user && (
            <p className="text-xs text-neutral-400 mt-1">
              {user.email} · {user.role}
            </p>
          )}
        </div>
        <nav className="px-3 py-4 space-y-1 text-sm flex-1">
          <NavLink
            to="/admin"
            end
            className={({ isActive }) =>
              `block px-2 py-1 rounded ${
                isActive ? "bg-neutral-800 text-white" : "text-neutral-300 hover:bg-neutral-800/60"
              }`
            }
          >
            Dashboard
          </NavLink>
          <NavLink
            to="/admin/menu"
            className={({ isActive }) =>
              `block px-2 py-1 rounded ${
                isActive ? "bg-neutral-800 text-white" : "text-neutral-300 hover:bg-neutral-800/60"
              }`
            }
          >
            Menú
          </NavLink>
        </nav>
        <div className="px-3 py-4 mt-auto text-xs text-neutral-500">
          <button onClick={logout} className="text-red-400 hover:text-red-300">
            Cerrar sesión
          </button>
        </div>
      </aside>

      <motion.main
        className="flex-1 p-6"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
      >
        <Outlet />
      </motion.main>
    </div>
  );
}
