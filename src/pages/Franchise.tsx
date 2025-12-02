import { CheckCircle2, BarChart3, Users, Factory } from "lucide-react";

export function Franchise() {
  return (
    <div className="bg-[#050505] min-h-screen pt-24 pb-24">
      {/* Hero Franchise */}
      <div className="container mx-auto px-6 lg:px-12 mb-24">
        <div className="border-l-4 border-[#D97706] pl-8 mb-12">
            <span className="text-[#D97706] font-mono text-xs uppercase tracking-[0.3em] block mb-2">Modelo de Negocio</span>
            <h1 className="text-5xl md:text-7xl font-black text-white uppercase">Escala con <br/> nosotros.</h1>
        </div>
        <p className="text-xl text-gray-400 max-w-3xl font-light leading-relaxed">
            El mercado de antojitos en México es inmenso, pero informal. Maíz Urbano profesionaliza la tradición con un modelo de "Isla Operativa" de bajo costo y alto impacto.
        </p>
      </div>

      {/* Timeline / Phases */}
      <section className="bg-[#0a0a0a] py-24 border-y border-white/5">
        <div className="container mx-auto px-6 lg:px-12">
            <h3 className="text-3xl font-bold text-white mb-16 text-center">Fases de Expansión</h3>
            
            <div className="relative">
                {/* Line */}
                <div className="absolute top-1/2 left-0 w-full h-1 bg-white/10 -translate-y-1/2 hidden md:block"></div>
                
                <div className="grid md:grid-cols-4 gap-8 relative z-10">
                    {[
                        { phase: "Fase 1", title: "Consolidación", desc: "Operación de 2-3 módulos propios piloto." },
                        { phase: "Fase 2", title: "Regional", desc: "8-10 puntos estratégicos y canal B2B." },
                        { phase: "Fase 3", title: "Franquicias", desc: "Licenciamiento nacional del sistema.", active: true },
                        { phase: "Fase 4", title: "Retail", desc: "Línea de productos empacados en supermercados." }
                    ].map((item, i) => (
                        <div key={i} className={`bg-[#111] p-6 rounded-xl border ${item.active ? 'border-[#D97706] ring-1 ring-[#D97706]' : 'border-white/10'} text-center group hover:-translate-y-2 transition-transform duration-300`}>
                            <div className={`w-10 h-10 mx-auto rounded-full flex items-center justify-center text-sm font-bold mb-4 ${item.active ? 'bg-[#D97706] text-black' : 'bg-white/10 text-gray-500'}`}>
                                {i + 1}
                            </div>
                            <p className="text-[#D97706] text-xs font-bold uppercase tracking-widest mb-1">{item.phase}</p>
                            <h4 className="text-white font-bold text-xl mb-2">{item.title}</h4>
                            <p className="text-gray-500 text-sm">{item.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
      </section>

      {/* Benefits Grid */}
      <div className="container mx-auto px-6 lg:px-12 pt-24">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
                <h3 className="text-4xl font-bold text-white mb-8">¿Por qué Maíz Urbano?</h3>
                <ul className="space-y-6">
                    <li className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-[#D97706]/10 rounded-lg flex items-center justify-center flex-shrink-0 text-[#D97706]">
                            <Factory size={24} />
                        </div>
                        <div>
                            <h4 className="text-white font-bold text-lg">Operación Centralizada</h4>
                            <p className="text-gray-400 text-sm mt-1">Procesos complejos realizados en CEDIS. Tu punto de venta solo ensambla y vende.</p>
                        </div>
                    </li>
                    <li className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-[#D97706]/10 rounded-lg flex items-center justify-center flex-shrink-0 text-[#D97706]">
                            <BarChart3 size={24} />
                        </div>
                        <div>
                            <h4 className="text-white font-bold text-lg">Alta Rentabilidad</h4>
                            <p className="text-gray-400 text-sm mt-1">Márgenes brutos del 60-70%. ROI estimado en 15-18 meses.</p>
                        </div>
                    </li>
                    <li className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-[#D97706]/10 rounded-lg flex items-center justify-center flex-shrink-0 text-[#D97706]">
                            <Users size={24} />
                        </div>
                        <div>
                            <h4 className="text-white font-bold text-lg">Soporte Total</h4>
                            <p className="text-gray-400 text-sm mt-1">Capacitación continua, marketing centralizado y proveeduría garantizada.</p>
                        </div>
                    </li>
                </ul>
            </div>

            <div className="bg-[#111] border border-white/5 p-8 rounded-3xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#D97706]/10 rounded-full blur-3xl"></div>
                <h3 className="text-2xl font-bold text-white mb-6 relative z-10">Solicita tu Brochure</h3>
                <p className="text-gray-400 mb-8 relative z-10">
                    Recibe la presentación financiera detallada y los requisitos para unirte a la red.
                </p>
                <form className="space-y-4 relative z-10">
                    <input type="text" placeholder="Nombre Completo" className="w-full bg-black border border-white/10 rounded p-4 text-white focus:border-[#D97706] focus:outline-none" />
                    <input type="email" placeholder="Correo Electrónico" className="w-full bg-black border border-white/10 rounded p-4 text-white focus:border-[#D97706] focus:outline-none" />
                    <input type="tel" placeholder="Teléfono" className="w-full bg-black border border-white/10 rounded p-4 text-white focus:border-[#D97706] focus:outline-none" />
                    <button className="w-full bg-[#D97706] text-black font-bold uppercase tracking-widest py-4 rounded hover:bg-[#b45309] transition-colors">
                        Descargar PDF
                    </button>
                </form>
            </div>
        </div>
      </div>
    </div>
  );
}
