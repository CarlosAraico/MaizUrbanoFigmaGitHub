import { useState } from "react";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { useAdmin } from "../lib/admin-context";
import { FileText, Search, CheckCircle, ArrowRight } from "lucide-react";

export function PublicInvoicing() {
  const { addInvoice } = useAdmin();
  const [step, setStep] = useState<'search' | 'form' | 'success'>('search');
  const [ticketData, setTicketData] = useState({ ticket: '', amount: '' });
  const [formData, setFormData] = useState({ rfc: '', razon: '', email: '', uso: 'G03' });

  const handleVerifyTicket = (e: React.FormEvent) => {
      e.preventDefault();
      if (ticketData.ticket.length > 3) {
          setStep('form');
      } else {
          alert("Ticket no encontrado");
      }
  };

  const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      addInvoice({
          rfc: formData.rfc,
          razonSocial: formData.razon,
          email: formData.email,
          ticket: ticketData.ticket,
          total: Number(ticketData.amount),
          date: new Date().toISOString().split('T')[0],
          status: 'Pendiente'
      });
      setStep('success');
  };

  return (
    <div className="min-h-screen bg-[#050505] pt-20 pb-20 font-sans text-white">
        <div className="max-w-lg mx-auto px-6">
            <div className="text-center mb-10">
                <div className="inline-block p-3 rounded-full bg-[#FFB800]/10 border border-[#FFB800]/30 mb-4">
                    <FileText size={32} className="text-[#FFB800]" />
                </div>
                <h1 className="text-3xl font-black text-white mb-2 tracking-tight">Portal de Facturación</h1>
                <p className="text-gray-500 text-sm">Genera tu factura electrónica (CFDI 4.0) al instante.</p>
            </div>

            <div className="bg-[#111] border border-white/10 rounded-3xl p-8 shadow-[0_0_50px_rgba(0,0,0,0.5)] relative overflow-hidden">
                {/* Gold accent line */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#FFB800] via-[#FFB800]/50 to-transparent"></div>

                {step === 'search' && (
                    <form onSubmit={handleVerifyTicket} className="space-y-6 animate-in fade-in slide-in-from-right duration-300">
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-[#FFB800] uppercase tracking-widest">No. de Ticket</label>
                            <input 
                                required
                                value={ticketData.ticket}
                                onChange={e => setTicketData({...ticketData, ticket: e.target.value})}
                                className="w-full bg-black border border-white/10 rounded-xl p-4 text-white focus:border-[#FFB800] outline-none font-mono text-lg transition-colors placeholder-gray-700"
                                placeholder="Ej: T-8823"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-[#FFB800] uppercase tracking-widest">Monto Total (MXN)</label>
                            <input 
                                required
                                type="number"
                                value={ticketData.amount}
                                onChange={e => setTicketData({...ticketData, amount: e.target.value})}
                                className="w-full bg-black border border-white/10 rounded-xl p-4 text-white focus:border-[#FFB800] outline-none font-mono text-lg transition-colors placeholder-gray-700"
                                placeholder="0.00"
                            />
                        </div>
                        <button className="w-full bg-[#FFB800] text-black font-black uppercase tracking-widest py-4 rounded-xl hover:bg-white transition-all hover:scale-[1.02] shadow-[0_0_20px_rgba(255,184,0,0.3)] flex justify-center items-center gap-2">
                            Validar Ticket <ArrowRight size={18} />
                        </button>
                    </form>
                )}

                {step === 'form' && (
                    <form onSubmit={handleSubmit} className="space-y-6 animate-in fade-in slide-in-from-right duration-300">
                        <div className="bg-[#FFB800]/10 border border-[#FFB800]/20 p-4 rounded-xl mb-4 flex items-center gap-3">
                            <CheckCircle size={20} className="text-[#FFB800]" />
                            <div>
                                <p className="text-[#FFB800] text-xs font-bold uppercase tracking-wide">Ticket Validado</p>
                                <p className="text-white font-mono font-bold text-lg">${Number(ticketData.amount).toFixed(2)}</p>
                            </div>
                        </div>
                        
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">RFC</label>
                            <input required value={formData.rfc} onChange={e => setFormData({...formData, rfc: e.target.value})} className="w-full bg-black border border-white/10 rounded-xl p-3 text-white focus:border-[#FFB800] outline-none uppercase font-mono" placeholder="XAXX010101000" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Razón Social</label>
                            <input required value={formData.razon} onChange={e => setFormData({...formData, razon: e.target.value})} className="w-full bg-black border border-white/10 rounded-xl p-3 text-white focus:border-[#FFB800] outline-none" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Correo Electrónico</label>
                            <input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full bg-black border border-white/10 rounded-xl p-3 text-white focus:border-[#FFB800] outline-none" />
                        </div>

                        <button className="w-full bg-[#FFB800] text-black font-black uppercase tracking-widest py-4 rounded-xl hover:bg-white transition-all shadow-[0_0_20px_rgba(255,184,0,0.3)]">
                            Emitir Factura
                        </button>
                    </form>
                )}

                {step === 'success' && (
                    <div className="text-center py-8 animate-in zoom-in duration-300">
                        <div className="w-24 h-24 bg-[#FFB800]/20 text-[#FFB800] rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-[#FFB800] shadow-[0_0_30px_#FFB800]">
                            <CheckCircle size={48} />
                        </div>
                        <h3 className="text-3xl font-black text-white mb-2">¡Factura Lista!</h3>
                        <p className="text-gray-400 mb-8 max-w-xs mx-auto leading-relaxed">
                            Hemos enviado los archivos <span className="text-[#FFB800] font-bold">XML</span> y <span className="text-[#FFB800] font-bold">PDF</span> a tu correo electrónico.
                        </p>
                        <button onClick={() => {setStep('search'); setTicketData({ticket:'',amount:''}); setFormData({rfc:'',razon:'',email:'',uso:'G03'});}} className="text-[#FFB800] text-xs font-black uppercase tracking-widest hover:text-white underline">
                            Facturar otro ticket
                        </button>
                    </div>
                )}
            </div>
        </div>
    </div>
  );
}
