import { useState } from "react";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { Upload, Briefcase, CheckCircle } from "lucide-react";

export function Careers() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#050505] pt-20 pb-20">
        <div className="max-w-3xl mx-auto px-8">
            <div className="text-center mb-16">
                <h1 className="text-5xl font-black text-white tracking-tighter mb-4">Únete a la Revolución</h1>
                <p className="text-gray-400 text-lg">Estamos buscando talento para nuestras sucursales y corporativo.</p>
            </div>

            {submitted ? (
                <div className="bg-[#111] border border-[#FFB800] p-12 rounded-3xl text-center animate-in fade-in zoom-in duration-500">
                    <div className="w-20 h-20 bg-[#FFB800]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle className="text-[#FFB800]" size={40} />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">¡Solicitud Recibida!</h3>
                    <p className="text-gray-400">Nuestro equipo de RH revisará tu perfil y te contactará pronto.</p>
                    <button onClick={() => setSubmitted(false)} className="mt-8 text-[#FFB800] font-bold hover:underline">Enviar otra solicitud</button>
                </div>
            ) : (
                <div className="bg-[#0a0a0a] border border-white/10 rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-[#FFB800] opacity-5 rounded-full blur-[80px]"></div>
                    
                    <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-[#FFB800] uppercase tracking-widest">Nombre Completo</label>
                                <input required className="w-full bg-black border border-white/10 rounded-xl p-4 text-white outline-none focus:border-[#FFB800] transition-colors" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-[#FFB800] uppercase tracking-widest">Teléfono / WhatsApp</label>
                                <input required className="w-full bg-black border border-white/10 rounded-xl p-4 text-white outline-none focus:border-[#FFB800] transition-colors" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-[#FFB800] uppercase tracking-widest">Puesto de Interés</label>
                            <select className="w-full bg-black border border-white/10 rounded-xl p-4 text-white outline-none focus:border-[#FFB800]">
                                <option>Gerente de Sucursal</option>
                                <option>Barista / Preparador</option>
                                <option>Auxiliar de Cocina</option>
                                <option>Logística y Reparto</option>
                                <option>Administrativo</option>
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-[#FFB800] uppercase tracking-widest">Experiencia Previa</label>
                            <textarea rows={4} className="w-full bg-black border border-white/10 rounded-xl p-4 text-white outline-none focus:border-[#FFB800]" placeholder="Cuéntanos brevemente sobre ti..."></textarea>
                        </div>

                        <div className="border-2 border-dashed border-white/10 rounded-xl p-8 text-center hover:border-[#FFB800]/50 transition-colors cursor-pointer bg-black/50">
                            <Upload className="mx-auto text-gray-500 mb-2" />
                            <p className="text-gray-400 text-sm">Arrastra tu CV aquí o haz clic para subir (PDF)</p>
                        </div>

                        <button className="w-full bg-[#FFB800] text-black font-black uppercase tracking-widest py-4 rounded-xl hover:bg-white transition-colors shadow-[0_0_20px_rgba(255,184,0,0.3)]">
                            Enviar Postulación
                        </button>
                    </form>
                </div>
            )}
        </div>
    </div>
  );
}
