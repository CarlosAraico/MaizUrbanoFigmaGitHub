import { useState } from "react";
import { useContent } from "../lib/content-context";
import { ArrowRight, Star } from "lucide-react";

export function PromotionsSection() {
  const { config } = useContent();
  const mains = config.promotions.filter(p => p.type === 'main');
  const news = config.promotions.filter(p => p.type === 'news');

  return (
    <section className="py-20 px-8 bg-[#080808] relative overflow-hidden">
        {/* Background Accent */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#FFB800] opacity-5 blur-[150px] rounded-full pointer-events-none"></div>

        <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-end mb-12">
                <div>
                    <h2 className="text-4xl font-black text-white tracking-tight mb-2">PROMOS & NOVEDADES</h2>
                    <div className="h-1 w-20 bg-[#FFB800]"></div>
                </div>
                <p className="text-gray-400 text-sm hidden md:block">Mantente actualizado con nuestras últimas creaciones.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Main Promotions (Left & Center) */}
                {mains.map((promo, idx) => (
                    <div key={promo.id} className={`${idx === 0 ? 'lg:col-span-5' : 'lg:col-span-4'} group relative h-[400px] rounded-2xl overflow-hidden cursor-pointer`}>
                        <img 
                            src={promo.image} 
                            alt={promo.title} 
                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-90"></div>
                        
                        <div className="absolute bottom-0 left-0 p-8 w-full">
                            <h3 className="text-3xl font-bold text-white mb-2 leading-none">{promo.title}</h3>
                            <p className="text-gray-300 mb-6 line-clamp-2">{promo.subtitle}</p>
                            <button className="px-6 py-2 border border-white/30 text-white text-xs font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-all">
                                Ver Detalles
                            </button>
                        </div>
                    </div>
                ))}

                {/* News List (Right Side) */}
                <div className="lg:col-span-3 flex flex-col gap-4">
                    <h3 className="text-white font-bold text-lg mb-2 flex items-center gap-2">
                        <Star className="text-[#FFB800] fill-[#FFB800]" size={16} /> Lo Nuevo
                    </h3>
                    {news.map(item => (
                        <div key={item.id} className="flex-1 bg-[#111] border border-white/5 rounded-xl p-4 flex gap-4 hover:border-[#FFB800]/50 transition-colors cursor-pointer group">
                            <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                                <img src={item.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                            </div>
                            <div className="flex flex-col justify-center">
                                <h4 className="text-white font-bold leading-tight mb-1 group-hover:text-[#FFB800]">{item.title}</h4>
                                <p className="text-xs text-gray-500 line-clamp-2">{item.subtitle}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Footer Banner like the image */}
            <div className="mt-12 bg-[#111] border border-[#FFB800]/20 rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
                 <div className="absolute left-0 top-0 bottom-0 w-2 bg-[#FFB800]"></div>
                 <div className="flex items-center gap-4 z-10">
                     <div className="flex -space-x-3">
                        {[1,2,3,4].map(i => (
                            <div key={i} className="w-10 h-10 rounded-full border-2 border-[#111] bg-gray-800 overflow-hidden">
                                <img src={`https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=100&q=80`} className="w-full h-full object-cover" />
                            </div>
                        ))}
                     </div>
                     <p className="text-[#FFB800] font-bold text-lg">Te regalamos $100 MXN en tu primer pedido.</p>
                 </div>
                 <button className="bg-[#FFB800] text-black font-bold px-6 py-3 rounded-lg hover:bg-white transition-colors z-10 text-sm uppercase">
                     Canjear Ahora
                 </button>
            </div>
        </div>
    </section>
  );
}
