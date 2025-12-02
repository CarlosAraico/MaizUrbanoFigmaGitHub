import { useState } from "react";
import { useAdmin } from "../../lib/admin-context";
import { Truck, Clock, Plus } from "lucide-react";

export function Orders() {
  const { orders, suppliers, addOrder } = useAdmin();
  const [showModal, setShowModal] = useState(false);
  const [newOrder, setNewOrder] = useState({ supplierName: '', total: 0, items: 0 });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addOrder({ 
        ...newOrder, 
        date: new Date().toISOString().split('T')[0], 
        status: 'Pendiente',
        items: Number(newOrder.items),
        total: Number(newOrder.total)
    });
    setShowModal(false);
    setNewOrder({ supplierName: '', total: 0, items: 0 });
  };

  return (
    <div className="space-y-8 relative z-10">
         <div className="flex justify-between items-center">
            <div>
                <h2 className="text-3xl font-black text-white tracking-tight">Órdenes de Compra</h2>
                <p className="text-gray-500 mt-1">Flujo de abastecimiento a sucursales</p>
            </div>
            <button 
                onClick={() => setShowModal(true)}
                className="flex items-center gap-2 px-6 py-3 bg-[#FFB800] text-black rounded-lg hover:bg-white transition-colors text-sm font-bold shadow-[0_0_15px_rgba(255,184,0,0.3)]"
            >
                <Plus size={18} /> Crear Orden
            </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Active Orders List */}
            <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-6 h-full">
                <h3 className="text-white font-bold mb-6 flex items-center gap-2">
                    <Clock className="text-[#FFB800]" size={20} /> Historial Activo
                </h3>
                <div className="space-y-4">
                    {orders.map((order) => (
                        <div key={order.id} className="bg-[#111] p-4 rounded-xl border border-white/5 hover:border-[#FFB800]/30 transition-all group cursor-pointer">
                            <div className="flex justify-between items-start mb-3">
                                <div>
                                    <p className="text-[#FFB800] text-xs font-bold uppercase tracking-wider">{order.id}</p>
                                    <p className="text-white font-bold text-lg mt-1">{order.supplierName}</p>
                                </div>
                                <span className={`px-2 py-1 text-xs rounded border ${
                                    order.status === 'En Ruta' ? 'bg-blue-900/20 text-blue-400 border-blue-900/30' :
                                    order.status === 'Entregado' ? 'bg-green-900/20 text-green-400 border-green-900/30' :
                                    'bg-yellow-900/20 text-yellow-400 border-yellow-900/30'
                                }`}>{order.status}</span>
                            </div>
                            <div className="flex items-center gap-4 text-xs text-gray-500">
                                <span className="flex items-center gap-1"><Truck size={12} /> {order.date}</span>
                                <span>•</span>
                                <span>{order.items} Items</span>
                                <span>•</span>
                                <span className="text-white font-mono font-bold">${order.total}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Map / Visualization */}
            <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-6 relative overflow-hidden min-h-[400px]">
                 <div className="absolute inset-0 opacity-30">
                     {/* Simplified Dark Map Mockup */}
                     <div className="w-full h-full bg-[#151515] relative">
                         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-[#FFB800] rounded-full shadow-[0_0_20px_#FFB800] animate-ping"></div>
                         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-[#FFB800] rounded-full"></div>
                         
                         {/* Mock routes */}
                         <svg className="absolute inset-0 w-full h-full pointer-events-none">
                             <line x1="50%" y1="50%" x2="30%" y2="30%" stroke="#FFB800" strokeOpacity="0.2" strokeWidth="2" />
                             <circle cx="30%" cy="30%" r="4" fill="#333" stroke="#666" />
                             
                             <line x1="50%" y1="50%" x2="70%" y2="70%" stroke="#FFB800" strokeOpacity="0.2" strokeWidth="2" />
                             <circle cx="70%" cy="70%" r="4" fill="#333" stroke="#666" />
                         </svg>
                     </div>
                 </div>
                 <div className="relative z-10 pointer-events-none">
                     <h3 className="text-white font-bold mb-2">Logística en Tiempo Real</h3>
                     <p className="text-gray-500 text-xs">CEDIS Central activo</p>
                 </div>
            </div>
        </div>

        {/* Modal */}
        {showModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
                <div className="bg-[#111] p-8 rounded-3xl border border-white/10 w-full max-w-md relative">
                    <button onClick={() => setShowModal(false)} className="absolute top-4 right-4 text-gray-500 hover:text-white">x</button>
                    <h3 className="text-2xl font-bold text-white mb-6">Nueva Orden de Compra</h3>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <select 
                            value={newOrder.supplierName} 
                            onChange={e => setNewOrder({...newOrder, supplierName: e.target.value})} 
                            className="w-full bg-black border border-white/10 rounded-lg p-3 text-white focus:border-[#FFB800] outline-none"
                            required
                        >
                            <option value="">Seleccionar Proveedor</option>
                            {suppliers.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
                        </select>
                        
                        <div className="grid grid-cols-2 gap-4">
                             <div>
                                <label className="text-[10px] text-[#FFB800] uppercase font-bold">Monto Total</label>
                                <input required type="number" value={newOrder.total} onChange={e => setNewOrder({...newOrder, total: Number(e.target.value)})} className="w-full bg-black border border-white/10 rounded-lg p-3 text-white focus:border-[#FFB800] outline-none" />
                             </div>
                             <div>
                                <label className="text-[10px] text-[#FFB800] uppercase font-bold">Cant. Items</label>
                                <input required type="number" value={newOrder.items} onChange={e => setNewOrder({...newOrder, items: Number(e.target.value)})} className="w-full bg-black border border-white/10 rounded-lg p-3 text-white focus:border-[#FFB800] outline-none" />
                             </div>
                        </div>
                        
                        <button type="submit" className="w-full bg-[#FFB800] text-black font-bold py-3 rounded-lg mt-4 hover:bg-white transition-colors">Generar Orden</button>
                    </form>
                </div>
            </div>
        )}
    </div>
  );
}
