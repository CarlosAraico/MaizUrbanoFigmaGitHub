import { useAdmin } from "../../lib/admin-context";
import { BarChart3, Calendar, Download, TrendingUp, AlertCircle } from "lucide-react";

export function Reports() {
  const { sales, orders } = useAdmin();

  // Simple Mock Calculations
  const totalSales = sales.reduce((acc, s) => acc + s.amount, 0);
  const totalOrders = orders.reduce((acc, o) => acc + o.total, 0);
  const netProfit = totalSales - (totalOrders * 0.4); // Mock 40% cost estimate

  return (
    <div className="space-y-8 relative z-10">
        <div className="flex justify-between items-center">
            <div>
                <h2 className="text-3xl font-black text-white tracking-tight">Reporte de Ventas</h2>
                <p className="text-gray-500 mt-1">Desempeño comercial en tiempo real</p>
            </div>
            <div className="flex gap-2 bg-[#111] p-1 rounded-lg border border-white/10">
                <button className="px-4 py-2 rounded bg-[#FFB800] text-black text-xs font-bold">Hoy</button>
                <button className="px-4 py-2 rounded hover:bg-white/5 text-gray-400 text-xs font-bold">Semana</button>
                <button className="px-4 py-2 rounded hover:bg-white/5 text-gray-400 text-xs font-bold">Mes</button>
            </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[#0a0a0a] p-6 rounded-2xl border border-white/5 shadow-xl">
                <div className="flex justify-between items-start mb-4">
                    <div className="p-3 bg-green-900/20 rounded-xl text-green-500 border border-green-900/30">
                        <DollarSignIcon />
                    </div>
                    <span className="text-green-500 text-xs font-bold bg-green-900/20 px-2 py-1 rounded flex items-center gap-1">
                        <TrendingUp size={12} /> +12%
                    </span>
                </div>
                <p className="text-gray-500 text-xs uppercase tracking-widest">Ventas Totales</p>
                <h3 className="text-3xl font-black text-white mt-1">${totalSales.toLocaleString()}</h3>
            </div>

            <div className="bg-[#0a0a0a] p-6 rounded-2xl border border-white/5 shadow-xl">
                <div className="flex justify-between items-start mb-4">
                    <div className="p-3 bg-red-900/20 rounded-xl text-red-500 border border-red-900/30">
                        <DownloadIcon />
                    </div>
                    <span className="text-gray-500 text-xs font-bold bg-white/5 px-2 py-1 rounded">
                        Actualizado
                    </span>
                </div>
                <p className="text-gray-500 text-xs uppercase tracking-widest">Costos Operativos</p>
                <h3 className="text-3xl font-black text-white mt-1">${totalOrders.toLocaleString()}</h3>
            </div>

            <div className="bg-[#0a0a0a] p-6 rounded-2xl border border-white/5 shadow-xl">
                <div className="flex justify-between items-start mb-4">
                    <div className="p-3 bg-[#FFB800]/10 rounded-xl text-[#FFB800] border border-[#FFB800]/30">
                        <BarChart3 />
                    </div>
                    <span className="text-[#FFB800] text-xs font-bold bg-[#FFB800]/10 px-2 py-1 rounded">
                        Margen Est. 60%
                    </span>
                </div>
                <p className="text-gray-500 text-xs uppercase tracking-widest">Utilidad Neta</p>
                <h3 className="text-3xl font-black text-white mt-1">${netProfit.toLocaleString()}</h3>
            </div>
        </div>

        {/* Visual Charts Area (CSS Mockup) */}
        <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-[#0a0a0a] border border-white/5 rounded-2xl p-6">
                <h3 className="text-white font-bold mb-6">Tendencia de Ventas (7 Días)</h3>
                <div className="h-64 flex items-end gap-4 px-4">
                    {[40, 65, 45, 80, 55, 90, 70].map((h, i) => (
                        <div key={i} className="flex-1 flex flex-col justify-end gap-2 group cursor-pointer">
                            <div 
                                className="w-full bg-[#FFB800]/20 rounded-t-lg border-t border-x border-[#FFB800]/50 group-hover:bg-[#FFB800] transition-all duration-500 relative"
                                style={{ height: `${h}%` }}
                            >
                                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-white text-black text-xs font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                    ${h}k
                                </div>
                            </div>
                            <span className="text-xs text-gray-600 text-center">D{i+1}</span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-6">
                 <h3 className="text-white font-bold mb-6">Top Productos</h3>
                 <div className="space-y-6">
                    {[
                        { name: "Elote Hoodie (Original)", val: 45 },
                        { name: "Esquites Tradicionales", val: 30 },
                        { name: "Doriesquites", val: 15 },
                        { name: "Panqué Elote", val: 10 }
                    ].map((prod, i) => (
                        <div key={i}>
                            <div className="flex justify-between text-sm mb-2">
                                <span className="text-gray-300">{prod.name}</span>
                                <span className="text-white font-bold">{prod.val}%</span>
                            </div>
                            <div className="w-full bg-white/5 rounded-full h-2">
                                <div className="bg-[#FFB800] h-2 rounded-full" style={{ width: `${prod.val}%`, opacity: 1 - (i * 0.2) }}></div>
                            </div>
                        </div>
                    ))}
                 </div>
            </div>
        </div>

        {/* Recent Transactions Table */}
        <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl overflow-hidden">
            <div className="p-6 border-b border-white/5">
                <h3 className="text-white font-bold">Transacciones Recientes</h3>
            </div>
            <table className="w-full text-left text-sm text-gray-400">
                <thead className="bg-white/5 text-xs uppercase font-bold text-gray-300">
                    <tr>
                        <th className="px-6 py-4">ID Transacción</th>
                        <th className="px-6 py-4">Producto</th>
                        <th className="px-6 py-4">Fecha</th>
                        <th className="px-6 py-4 text-right">Monto</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                    {sales.map((sale) => (
                        <tr key={sale.id} className="hover:bg-white/[0.02]">
                            <td className="px-6 py-4 font-mono text-xs text-[#FFB800]">{sale.id}</td>
                            <td className="px-6 py-4 text-white">{sale.product}</td>
                            <td className="px-6 py-4">{sale.date}</td>
                            <td className="px-6 py-4 text-right font-bold text-white">${sale.amount}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
  );
}

function DollarSignIcon() { return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>; }
function DownloadIcon() { return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>; }
