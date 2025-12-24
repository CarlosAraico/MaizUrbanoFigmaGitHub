import { Outlet } from "react-router-dom";
import { motion } from "framer-motion";

export function MainLayout() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-neutral-50 to-neutral-100 text-neutral-900">
      <header className="border-b bg-white/70 backdrop-blur">
        <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
          <span className="font-semibold tracking-tight">Maíz Urbano</span>
          <nav className="flex gap-4 text-sm">
            <a href="/" className="hover:underline">
              Inicio
            </a>
            <a href="/login" className="hover:underline">
              Login
            </a>
          </nav>
        </div>
      </header>

      <motion.main
        className="max-w-6xl mx-auto px-4 py-6"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -16 }}
        transition={{ duration: 0.25 }}
      >
        <Outlet />
      </motion.main>
    </div>
  );
}
