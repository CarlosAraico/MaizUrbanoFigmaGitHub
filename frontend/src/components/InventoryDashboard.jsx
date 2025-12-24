import { motion } from "framer-motion";
import { useStock } from "../hooks/useStock";

export function InventoryDashboard() {
  const { stock, loading } = useStock(4000);

  if (loading) return <p className="text-sm text-neutral-400">Cargando inventario...</p>;

  if (!stock.length) {
    return <p className="text-sm text-neutral-400">Sin datos de inventario.</p>;
  }

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {stock.map((item, i) => (
        <motion.div
          key={item.id || item.sku}
          className="p-4 rounded-xl border border-neutral-800 bg-neutral-900"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05 }}
          whileHover={{ scale: 1.03 }}
        >
          <p className="text-xs text-neutral-500">{item.sku}</p>
          <p className="text-sm font-semibold">{item.name}</p>
          <p className="mt-2 text-3xl font-bold">{item.stock}</p>
        </motion.div>
      ))}
    </div>
  );
}
