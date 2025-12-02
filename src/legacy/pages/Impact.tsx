import { Sprout, Truck, Fingerprint } from "lucide-react";

export function Impact() {
  return (
    <div className="bg-[#050505] min-h-screen pt-24">
       <div className="container mx-auto px-6 lg:px-12 pb-24">
         <div className="text-center max-w-3xl mx-auto mb-20">
            <span className="text-[#D97706] font-mono text-xs uppercase tracking-[0.3em]">Triple Impacto</span>
            <h1 className="text-5xl font-black text-white mt-4 mb-6">Sostenibilidad <br/> Integrada.</h1>
            <p className="text-gray-400 text-lg">
                No es un añadido, es el núcleo. Nuestro compromiso es con la tierra, con la gente y con la calidad.
            </p>
         </div>

         <div className="grid lg:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="bg-[#0a0a0a] border border-white/5 rounded-3xl overflow-hidden group hover:border-[#D97706]/30 transition-all duration-500">
                <div className="h-48 bg-black relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#0a0a0a]"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <Sprout size={64} className="text-[#D97706] opacity-20 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500" />
                    </div>
                </div>
                <div className="p-8">
                    <h3 className="text-2xl font-bold text-white mb-4">Ambiental</h3>
                    <ul className="space-y-3 text-gray-400 text-sm">
                        <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-[#D97706] rounded-full"></div> Empaques de totomoxtle</li>
                        <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-[#D97706] rounded-full"></div> Zero-waste en cocinas</li>
                        <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-[#D97706] rounded-full"></div> Reutilización de agua</li>
                    </ul>
                </div>
            </div>

            {/* Card 2 */}
            <div className="bg-[#0a0a0a] border border-white/5 rounded-3xl overflow-hidden group hover:border-[#D97706]/30 transition-all duration-500">
                <div className="h-48 bg-black relative overflow-hidden">
                     <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#0a0a0a]"></div>
                     <div className="absolute inset-0 flex items-center justify-center">
                        <Fingerprint size={64} className="text-[#D97706] opacity-20 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500" />
                    </div>
                </div>
                <div className="p-8">
                    <h3 className="text-2xl font-bold text-white mb-4">Social</h3>
                    <ul className="space-y-3 text-gray-400 text-sm">
                        <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-[#D97706] rounded-full"></div> Comercio justo con Tlaxcala</li>
                        <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-[#D97706] rounded-full"></div> Empleo joven formal</li>
                        <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-[#D97706] rounded-full"></div> Preservación cultural</li>
                    </ul>
                </div>
            </div>

            {/* Card 3 */}
            <div className="bg-[#0a0a0a] border border-white/5 rounded-3xl overflow-hidden group hover:border-[#D97706]/30 transition-all duration-500">
                <div className="h-48 bg-black relative overflow-hidden">
                     <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#0a0a0a]"></div>
                     <div className="absolute inset-0 flex items-center justify-center">
                        <Truck size={64} className="text-[#D97706] opacity-20 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500" />
                    </div>
                </div>
                <div className="p-8">
                    <h3 className="text-2xl font-bold text-white mb-4">Trazabilidad</h3>
                    <ul className="space-y-3 text-gray-400 text-sm">
                        <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-[#D97706] rounded-full"></div> Control de origen a mesa</li>
                        <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-[#D97706] rounded-full"></div> Logística fría certificada</li>
                        <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-[#D97706] rounded-full"></div> Transparencia total</li>
                    </ul>
                </div>
            </div>
         </div>
       </div>
    </div>
  );
}
