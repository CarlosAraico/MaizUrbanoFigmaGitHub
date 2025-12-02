import { CheckCircle2 } from "lucide-react";

export function Franchise() {
  return (
    <section id="franquicias" className="py-24 bg-[#0c0c0c] relative">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="grid lg:grid-cols-2 gap-16">
            <div>
                <span className="text-[#f7c86c] font-mono text-xs uppercase tracking-[0.3em]">MU-FRANQUICIAS</span>
                <h2 className="text-4xl font-bold text-[#f9fafb] mt-4 mb-6">Únete a la red</h2>
                <p className="text-[#9ca3af] mb-8 leading-relaxed">
                    Buscamos socios estratégicos para expandir la huella de Maíz Urbano. Ofrecemos un modelo "Llave en Mano".
                </p>
                
                <ul className="space-y-4 mb-10">
                    {[
                        "Selección de ubicación con IA",
                        "Entrenamiento operativo intensivo",
                        "Cadena de suministro centralizada",
                        "Marketing nacional incluido"
                    ].map((item, i) => (
                        <li key={i} className="flex items-center gap-3 text-[#f9fafb]">
                            <CheckCircle2 className="text-[#f7c86c]" size={20} />
                            <span className="font-light">{item}</span>
                        </li>
                    ))}
                </ul>

                <a href="mailto:franquicias@maizurbano.mx" className="inline-block border border-[#f7c86c] text-[#f7c86c] hover:bg-[#f7c86c] hover:text-[#0c0c0c] px-8 py-4 rounded text-sm font-bold uppercase tracking-widest transition-all">
                    Solicitar Información
                </a>
            </div>

            <div className="relative bg-[#141414] p-8 rounded-2xl border border-white/5">
                <form className="space-y-6">
                    <div>
                        <label className="text-[#f7c86c] text-xs font-bold uppercase tracking-wider block mb-2">Nombre Completo</label>
                        <input type="text" className="w-full bg-[#0c0c0c] border border-white/10 rounded p-3 text-[#f9fafb] focus:border-[#f7c86c] focus:outline-none transition-colors" placeholder="Ej. Carlos Araico" />
                    </div>
                    <div>
                        <label className="text-[#f7c86c] text-xs font-bold uppercase tracking-wider block mb-2">Ciudad de Interés</label>
                        <input type="text" className="w-full bg-[#0c0c0c] border border-white/10 rounded p-3 text-[#f9fafb] focus:border-[#f7c86c] focus:outline-none transition-colors" placeholder="Ej. Guadalajara" />
                    </div>
                    <div>
                        <label className="text-[#f7c86c] text-xs font-bold uppercase tracking-wider block mb-2">Capital Disponible (MXN)</label>
                        <select className="w-full bg-[#0c0c0c] border border-white/10 rounded p-3 text-[#f9fafb] focus:border-[#f7c86c] focus:outline-none transition-colors">
                            <option>$500k - $1M</option>
                            <option>$1M - $2M</option>
                            <option>+$2M</option>
                        </select>
                    </div>
                    <button type="submit" className="w-full bg-[#f7c86c] text-[#0c0c0c] font-bold uppercase tracking-widest py-4 rounded hover:bg-[#ebb45c] transition-colors">
                        Enviar Solicitud
                    </button>
                </form>
            </div>
        </div>
      </div>
    </section>
  );
}
