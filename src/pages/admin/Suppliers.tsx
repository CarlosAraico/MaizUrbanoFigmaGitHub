import { useState } from "react";
import { useAdmin } from "../../lib/admin-context";
import { Phone, Mail, MapPin, Star, Plus, History, Truck, X } from "lucide-react";

export function Suppliers() {
  const { suppliers, addSupplier, orders } = useAdmin();
  const [showModal, setShowModal] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState<string | null>(null);
  const [newSup, setNewSup] = useState({ name: '', contact: '', phone: '', email: '', category: 'Materia Prima' });

  const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      addSupplier({ ...newSup, rating: 5 });
      setShowModal(false);
      setNewSup({ name: '', contact: '', phone: '', email: '', category: 'Materia Prima' });
  };

  // Filter orders for the selected supplier
  const supplierHistory = selectedSupplier 
    ? orders.filter(o => o.supplierName === selectedSupplier)
    : [];

  return (
    <div className="space-y-8 relative z-10">
        <div className="flex justify-between items-center">
            <div>
                <h2 className="text-3xl font-black text-white tracking-tight">Directorio Proveedores</h2>
                <p className="text-gray-500 mt-1">Gestión de cadena de suministro</p>
            </div>
            <button 
                onClick={() => setShowModal(true)}
                className="flex items-center gap-2 px-6 py-3 bg-[#FFB800] text-black rounded-lg hover:bg-white transition-colors text-sm font-bold shadow-[0_0_15px_rgba(255,184,0,0.3)]"
            >
                <Plus size={18} /> Nuevo Proveedor
            </button>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {suppliers.map((sup) => (
                <div key={sup.id} className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-6 hover:border-[#FFB800]/30 transition-all group">
                    <div className="flex justify-between items-start mb-4">
                        <span className="px-2 py-1 bg-white/5 text-gray-300 text-[10px] uppercase tracking-widest rounded border border-white/5">{sup.category}</span>
                        <div className="flex gap-1">
                            {[...Array(5)].map((_, i) => (
                                <Star key={i} size={12} className={i < sup.rating ? "fill-[#FFB800] text-[#FFB800]" : "text-gray-800"} />
                            ))}
                        </div>
                    </div>
                    
                    <h3 className="text-xl font-bold text-white mb-1 group-hover:text-[#FFB800] transition-colors">{sup.name}</h3>
                    <p className="text-gray-500 text-sm mb-6">Contacto: {sup.contact}</p>

                    <div className="space-y-3 border-t border-white/5 pt-4">
                        <div className="flex items-center gap-3 text-sm text-gray-400">
                            <Phone size={14} className="text-[#FFB800]" /> {sup.phone}
                        </div>
                        <div className="flex items-center gap-3 text-sm text-gray-400">
                            <Mail size={14} className="text-[#FFB800]" /> {sup.email}
                        </div>
                    </div>

                    <button 
                        onClick={() => setSelectedSupplier(sup.name)}
                        className="w-full mt-6 py-2 border border-white/10 rounded hover:bg-white hover:text-black text-gray-300 text-xs font-bold uppercase tracking-widest transition-colors flex items-center justify-center gap-2"
                    >
                        <History size={14} /> Ver Historial
                    </button>
                </div>
            ))}
        </div>

        {/* History Modal */}
        {selectedSupplier && (
             <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                <div className="bg-[#111] rounded-3xl border border-white/10 w-full max-w-2xl relative max-h-[80vh] flex flex-col">
                    <div className="p-6 border-b border-white/10 flex justify-between items-center">
                        <div>
                            <h3 className="text-xl font-bold text-white">Historial de Órdenes</h3>
                            <p className="text-[#FFB800] text-sm font-bold">{selectedSupplier}</p>
                        </div>
                        <button onClick={() => setSelectedSupplier(null)} className="text-gray-500 hover:text-white"><X /></button>
                    </div>
                    
                    <div className="p-6 overflow-y-auto">
                        {supplierHistory.length === 0 ? (
                            <div className="text-center py-10 text-gray-500">
                                <Truck size={48} className="mx-auto mb-4 opacity-20" />
                                <p>No hay órdenes registradas para este proveedor.</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {supplierHistory.map(order => (
                                    <div key={order.id} className="flex items-center justify-between bg-white/5 p-4 rounded-xl border border-white/5">
                                        <div>
                                            <p className="text-white font-bold text-sm">{order.id}</p>
                                            <p className="text-gray-500 text-xs">{order.date}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[#FFB800] font-mono font-bold">${order.total.toLocaleString()}</p>
                                            <span className={`text-[10px] uppercase px-2 py-0.5 rounded ${
                                                order.status === 'Entregado' ? 'bg-green-900/30 text-green-400' : 
                                                'bg-yellow-900/30 text-yellow-400'
                                            }`}>{order.status}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    
                    <div className="p-6 border-t border-white/10 bg-[#0a0a0a] rounded-b-3xl">
                        <div className="flex justify-between items-center text-sm text-gray-400">
                            <span>Total Órdenes: {supplierHistory.length}</span>
                            <span>Volumen: ${supplierHistory.reduce((acc, curr) => acc + curr.total, 0).toLocaleString()}</span>
                        </div>
                    </div>
                </div>
             </div>
        )}

        {/* Add Supplier Modal */}
        {showModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
                <div className="bg-[#111] p-8 rounded-3xl border border-white/10 w-full max-w-md relative">
                    <button onClick={() => setShowModal(false)} className="absolute top-4 right-4 text-gray-500 hover:text-white"><X /></button>
                    <h3 className="text-2xl font-bold text-white mb-6">Alta de Proveedor</h3>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <input required placeholder="Nombre Empresa" value={newSup.name} onChange={e => setNewSup({...newSup, name: e.target.value})} className="w-full bg-black border border-white/10 rounded-lg p-3 text-white focus:border-[#FFB800] outline-none" />
                        <input required placeholder="Persona Contacto" value={newSup.contact} onChange={e => setNewSup({...newSup, contact: e.target.value})} className="w-full bg-black border border-white/10 rounded-lg p-3 text-white focus:border-[#FFB800] outline-none" />
                        <div className="grid grid-cols-2 gap-4">
                             <input required placeholder="Teléfono" value={newSup.phone} onChange={e => setNewSup({...newSup, phone: e.target.value})} className="w-full bg-black border border-white/10 rounded-lg p-3 text-white focus:border-[#FFB800] outline-none" />
                             <select value={newSup.category} onChange={e => setNewSup({...newSup, category: e.target.value})} className="w-full bg-black border border-white/10 rounded-lg p-3 text-white focus:border-[#FFB800] outline-none">
                                <option>Materia Prima</option>
                                <option>Empaque</option>
                                <option>Servicios</option>
                             </select>
                        </div>
                        <input required type="email" placeholder="Email" value={newSup.email} onChange={e => setNewSup({...newSup, email: e.target.value})} className="w-full bg-black border border-white/10 rounded-lg p-3 text-white focus:border-[#FFB800] outline-none" />
                        
                        <button type="submit" className="w-full bg-[#FFB800] text-black font-bold py-3 rounded-lg mt-4 hover:bg-white transition-colors">Guardar Proveedor</button>
                    </form>
                </div>
            </div>
        )}
    </div>
  );
}
