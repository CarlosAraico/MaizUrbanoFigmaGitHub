import { Badge } from "./ui/badge";
import { Button } from "./ui/button";

const products = [
  {
    id: 1,
    name: "Elote Montado",
    description: "Grano tierno, mayonesa con limón, queso cotija, polvo de chile, toque de mantequilla ahumada.",
    price: "$75",
    tag: "Listo en 3 minutos",
    image: "https://images.unsplash.com/photo-1752861640242-1d2be06f7fcd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZXhpY2FuJTIwc3RyZWV0JTIwY29ybiUyMGVsb3RlJTIwZXNxdWl0ZXN8ZW58MXx8fHwxNzY0NTQzNTQ0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  },
  {
    id: 2,
    name: "Esquites",
    description: "Caldo con epazote, granos salteados, queso fresco, serrano tatemado, mayonesa de chipotle opcional.",
    price: "$68",
    tag: "Entrega sin derrames",
    image: "https://images.unsplash.com/photo-1762765684587-14f711d01957?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZXhpY2FuJTIwZm9vZCUyMHRhY29zJTIwdmlicmFudHxlbnwxfHx8fDE3NjQ1NDM1NDR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  },
  {
    id: 3,
    name: "Panqué de Elote",
    description: "Panqué húmedo de maíz criollo, vainilla de Papantla, crumble de pepitas y glaseado de piloncillo.",
    price: "$85",
    tag: "Perfecto para compartir",
    image: "https://images.unsplash.com/photo-1704613278892-0056895dd46a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3JuJTIwZmllbGQlMjBhZ3JpY3VsdHVyZSUyMGFlc3RoZXRpY3xlbnwxfHx8fDE3NjQ1NDM1NDR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  },
];

export function ProductGrid() {
  return (
    <section id="menu" className="py-24 bg-[#FDF7E3]">
      <div className="container mx-auto px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
            <div>
                <p className="font-mono text-xs uppercase tracking-[0.3em] text-green-800 font-bold mb-4">Menú</p>
                <h2 className="font-black text-4xl sm:text-5xl text-stone-900 tracking-tight">
                    Antojos estrella
                </h2>
                <p className="mt-6 text-lg text-stone-600 max-w-2xl">
                    Maíz criollo, salsas de casa y empaques de entrega segura.
                </p>
            </div>
            <Button variant="outline" className="border-amber-400/60 bg-white/50 hover:bg-amber-400 hover:text-stone-950 hover:border-amber-400 text-amber-600 uppercase tracking-widest font-bold text-xs py-6 px-8 rounded-full transition-all">
                Ordenar por WhatsApp
            </Button>
        </div>
        
        <div className="grid gap-8 md:grid-cols-3">
          {products.map((product) => (
            <article key={product.id} className="group relative overflow-hidden rounded-2xl bg-white shadow-lg ring-1 ring-stone-200 hover:ring-amber-400/50 transition-all duration-500 hover:-translate-y-1">
              <div className="h-64 w-full overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="h-full w-full object-cover transition duration-700 group-hover:scale-110 group-hover:rotate-1"
                />
              </div>
              <div className="flex flex-col gap-4 p-8">
                <div className="flex items-center justify-between">
                    <h3 className="font-black text-2xl text-stone-900">{product.name}</h3>
                    <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-mono uppercase tracking-[0.2em] text-green-900 font-bold">
                        {product.price}
                    </span>
                </div>
                <p className="text-sm leading-relaxed text-stone-600">{product.description}</p>
                <div className="pt-4 border-t border-stone-100">
                    <p className="text-[10px] font-mono uppercase tracking-[0.25em] text-amber-600 font-bold">{product.tag}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
