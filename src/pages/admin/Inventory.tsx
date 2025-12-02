import { MoreHorizontal, ArrowUpDown, Filter, Download, Plus } from "lucide-react";

const INVENTORY_DATA = [
  { id: "SKU-001", name: "Maíz Criollo Tlaxcala (Blanco)", category: "Insumo Base", stock: "2,500 kg", status: "Optimal", lastUpdate: "Hace 2 hrs" },
  { id: "SKU-002", name: "Mayonesa Madre Base", category: "Preparado", stock: "450 L", status: "Low Stock", lastUpdate: "Hace 5 hrs" },
  { id: "SKU-003", name: "Queso Cotija Añejo", category: "Lácteos", stock: "120 kg", status: "Optimal", lastUpdate: "Ayer" },
  { id: "SKU-004", name: "Chile Chipotle Molido", category: "Especias", stock: "15 kg", status: "Critical", lastUpdate: "Hace 30 min" },
  { id: "SKU-005", name: "Vaso Biodegradable 12oz", category: "Empaque", stock: "5,000 pza", status: "Optimal", lastUpdate: "Ayer" },
  { id: "SKU-006", name: "Mantequilla Gloria", category: "Lácteos", stock: "80 kg", status: "Optimal", lastUpdate: "Ayer" },
];

export function Inventory() {
  return (
    <div className="space-y-8 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
                <h2 className="text-3xl font-black text-white tracking-tight">Inventario General</h2>
                <p className="text-gray-500 mt-1">Gestión de insumos CEDIS Central</p>
            </div>
            <div className="flex gap-3">
                <button className="flex items-center gap-2 px-4 py-2 bg-[#111] border border-white/10 text-white rounded-lg hover:bg-white/5 transition-colors text-sm font-medium">
                    <Download size={16} /> Exportar
                </button>
                <button className="flex items-center gap-2 px-4 py-2 bg-[#FFB800] text-black rounded-lg hover:bg-white transition-colors text-sm font-bold shadow-[0_0_15px_rgba(255,184,0,0.3)]">
                    <Plus size={16} /> Nuevo Ingreso
                </button>
            </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
                { label: "Valor Total", value: "$452,000", color: "text-white" },
                { label: "Items Críticos", value: "3", color: "text-red-500" },
                { label: "Entradas Hoy", value: "+12", color: "text-[#FFB800]" },
                { label: "Mermas Mes", value: "1.2%", color: "text-gray-400" },
            ].map((stat, i) => (
                <div key={i} className="bg-[#0a0a0a] border border-white/5 p-6 rounded-2xl hover:border-[#FFB800]/20 transition-colors">
                    <p className="text-gray-500 text-xs uppercase tracking-widest mb-2">{stat.label}</p>
                    <p className={`text-3xl font-black ${stat.color}`}>{stat.value}</p>
                </div>
            ))}
        </div>

        {/* Table */}
        <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl overflow-hidden">
            {/* Table Header */}
            <div className="p-4 border-b border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button className="flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded text-xs text-gray-300 hover:text-white">
                        <Filter size={14} /> Filtrar
                    </button>
                    <div className="h-4 w-[1px] bg-white/10"></div>
                    <span className="text-xs text-gray-500">Mostrando 6 de 48 items</span>
                </div>
                <div className="flex gap-2">
                     {/* Pagination dots mock */}
                     <div className="w-2 h-2 rounded-full bg-[#FFB800]"></div>
                     <div className="w-2 h-2 rounded-full bg-white/10"></div>
                     <div className="w-2 h-2 rounded-full bg-white/10"></div>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-gray-400">
                    <thead className="bg-white/5 text-xs uppercase font-bold text-gray-300">
                        <tr>
                            <th className="px-6 py-4 font-bold tracking-wider">SKU / Producto</th>
                            <th className="px-6 py-4 tracking-wider">Categoría</th>
                            <th className="px-6 py-4 tracking-wider">Stock Actual</th>
                            <th className="px-6 py-4 tracking-wider">Estado</th>
                            <th className="px-6 py-4 tracking-wider text-right">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {INVENTORY_DATA.map((item) => (
                            <tr key={item.id} className="hover:bg-white/[0.02] transition-colors group">
                                <td className="px-6 py-4">
                                    <div className="flex flex-col">
                                        <span className="text-white font-bold text-base group-hover:text-[#FFB800] transition-colors">{item.name}</span>
                                        <span className="text-xs text-gray-600 font-mono">{item.id}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="px-2 py-1 rounded bg-white/5 text-xs border border-white/5">{item.category}</span>
                                </td>
                                <td className="px-6 py-4 font-mono text-white">{item.stock}</td>
                                <td className="px-6 py-4">
                                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${
                                        item.status === 'Optimal' ? 'bg-green-900/30 text-green-400 border border-green-900/50' :
                                        item.status === 'Low Stock' ? 'bg-yellow-900/30 text-yellow-400 border border-yellow-900/50' :
                                        'bg-red-900/30 text-red-400 border border-red-900/50'
                                    }`}>
                                        <span className={`w-1.5 h-1.5 rounded-full ${
                                            item.status === 'Optimal' ? 'bg-green-400' :
                                            item.status === 'Low Stock' ? 'bg-yellow-400' : 'bg-red-400'
                                        }`}></span>
                                        {item.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button className="text-gray-600 hover:text-white p-2">
                                        <MoreHorizontal size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    </div>
  );
}
