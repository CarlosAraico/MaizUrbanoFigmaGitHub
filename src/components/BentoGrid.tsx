import { ArrowUpRight } from "lucide-react";

export function BentoGrid() {
  return (
    <section className="py-20 px-4 md:px-8 max-w-7xl mx-auto">
        <h2 className="text-4xl font-black text-white mb-12 tracking-tight">Impacto & Comunidad</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 grid-rows-2 gap-4 h-auto md:h-[600px]">
            
            {/* Large Feature */}
            <div className="col-span-1 md:col-span-2 row-span-2 bg-[#111] rounded-3xl p-8 relative overflow-hidden border border-white/10 group">
                <img 
                    src="https://images.unsplash.com/photo-1599059813005-11265ba4b4ce?auto=format&fit=crop&w=800&q=80" 
                    className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
                <div className="absolute bottom-8 left-8 z-10">
                    <h3 className="text-3xl font-bold text-white mb-2">Maíz Criollo 100%</h3>
                    <p className="text-gray-300 text-sm max-w-xs">Apoyamos directamente a agricultores de Xochimilco y Milpa Alta, preservando semillas ancestrales.</p>
                </div>
            </div>

            {/* Stats Block */}
            <div className="bg-[#FFB800] rounded-3xl p-6 flex flex-col justify-center items-center text-center text-black border border-yellow-500">
                <span className="text-5xl font-black mb-2">15k+</span>
                <span className="font-bold uppercase text-xs tracking-widest">Elotes Servidos</span>
            </div>

            {/* Social Block */}
            <div className="bg-[#0B2818] rounded-3xl p-6 relative overflow-hidden border border-green-900 flex flex-col justify-between group cursor-pointer">
                <div className="flex justify-between items-start">
                    <span className="bg-white/20 p-2 rounded-full text-white"><ArrowUpRight /></span>
                </div>
                <div>
                    <p className="text-[#FFB800] font-bold">@maizurbano</p>
                    <p className="text-gray-300 text-xs">Síguenos en Instagram</p>
                </div>
            </div>

            {/* Wide Bottom Block */}
            <div className="col-span-1 md:col-span-2 bg-[#111] rounded-3xl p-8 relative overflow-hidden border border-white/10 flex items-center">
                 <div className="w-1/2 pr-4 relative z-10">
                    <h3 className="text-2xl font-bold text-white mb-2">Sustentabilidad</h3>
                    <p className="text-gray-400 text-sm">Nuestros desechables son 100% biodegradables hechos de fécula de maíz.</p>
                 </div>
                 <div className="absolute right-0 top-0 bottom-0 w-1/2 bg-gray-800">
                    <img src="https://images.unsplash.com/photo-1530554764233-e79e16c91d08?auto=format&fit=crop&w=500&q=60" className="w-full h-full object-cover opacity-50" />
                 </div>
            </div>

        </div>
    </section>
  );
}
