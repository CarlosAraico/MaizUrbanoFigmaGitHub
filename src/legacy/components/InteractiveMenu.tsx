import { ChevronRight } from "lucide-react";

const MENU_ITEMS = [
    {
        id: 1,
        title: "Elote Clásico",
        price: "$45",
        desc: "Mayonesa casera, queso cotija, chile piquín.",
        image: "https://images.unsplash.com/photo-1534706936143-9492ad78b515?auto=format&fit=crop&w=500&q=80"
    },
    {
        id: 2,
        title: "Esquites Tuétano",
        price: "$85",
        desc: "Caldo de res concentrado, epazote, tuétano asado.",
        image: "https://images.unsplash.com/photo-1626202158924-114813442807?auto=format&fit=crop&w=500&q=80"
    },
    {
        id: 3,
        title: "Doriesquites",
        price: "$75",
        desc: "Sobre cama de Nachos, queso amarillo, elote desgranado.",
        image: "https://images.unsplash.com/photo-1625938145744-e38051539994?auto=format&fit=crop&w=500&q=80"
    }
];

export function InteractiveMenu() {
  return (
    <section id="menu" className="py-20 bg-[#050505]">
        <div className="max-w-7xl mx-auto px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
                <div>
                    <span className="text-[#FFB800] font-bold tracking-widest uppercase text-xs mb-2 block">Nuestra Carta</span>
                    <h2 className="text-4xl md:text-5xl font-black text-white">Menú Estelar</h2>
                </div>
                <a href="#menu-completo" className="flex items-center gap-2 text-white border-b border-[#FFB800] pb-1 hover:text-[#FFB800] transition-colors">
                    Ver menú completo <ChevronRight size={16} />
                </a>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
                {MENU_ITEMS.map(item => (
                    <div key={item.id} className="group cursor-pointer">
                        <div className="relative aspect-[4/5] overflow-hidden rounded-2xl mb-6">
                            <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors z-10"></div>
                            <img 
                                src={item.image} 
                                alt={item.title} 
                                className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                            />
                            <div className="absolute top-4 right-4 bg-black/80 backdrop-blur text-[#FFB800] font-bold px-3 py-1 rounded-full z-20">
                                {item.price}
                            </div>
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-[#FFB800] transition-colors">{item.title}</h3>
                        <p className="text-gray-500 text-sm">{item.desc}</p>
                    </div>
                ))}
            </div>
        </div>
    </section>
  );
}
