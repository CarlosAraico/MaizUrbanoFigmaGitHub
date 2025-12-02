import { Plus } from "lucide-react";

const menuItems = [
  {
    id: 1,
    name: "Elote Montado",
    description: "Grano tierno, mayonesa con limón, queso cotija, polvo de chile.",
    price: "$75",
    image: "https://images.unsplash.com/photo-1752861640242-1d2be06f7fcd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZXhpY2FuJTIwc3RyZWV0JTIwY29ybiUyMGVsb3RlJTIwZXNxdWl0ZXN8ZW58MXx8fHwxNzY0NTQzNTQ0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
  },
  {
    id: 2,
    name: "Esquites Callejeros",
    description: "Caldo con epazote, granos salteados, tuétano opcional.",
    price: "$68",
    image: "https://images.unsplash.com/photo-1762765684587-14f711d01957?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZXhpY2FuJTIwZm9vZCUyMHRhY29zJTIwdmlicmFudHxlbnwxfHx8fDE3NjQ1NDM1NDR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
  },
  {
    id: 3,
    name: "Doriesquites",
    description: "La fusión perfecta: tus totopos favoritos con nuestra receta secreta.",
    price: "$85",
    image: "https://images.unsplash.com/photo-1704613278892-0056895dd46a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3JuJTIwZmllbGQlMjBhZ3JpY3VsdHVyZSUyMGFlc3RoZXRpY3xlbnwxfHx8fDE3NjQ1NDM1NDR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
  }
];

export function Menu() {
  return (
    <section id="menu" className="py-24 bg-[#0c0c0c] relative">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 border-b border-white/10 pb-8">
          <div>
            <span className="text-[#f7c86c] font-mono text-xs uppercase tracking-[0.3em]">MU-MENU</span>
            <h2 className="text-4xl md:text-5xl font-bold text-[#f9fafb] mt-2">Antojitos de Autor</h2>
          </div>
          <p className="text-[#9ca3af] max-w-md text-sm md:text-right mt-4 md:mt-0">
            Selección premium de maíz criollo preparado al momento con ingredientes de origen controlado.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {menuItems.map((item) => (
            <div key={item.id} className="group bg-[#141414] border border-white/5 rounded-lg overflow-hidden hover:border-[#f7c86c]/50 transition-all duration-500 hover:-translate-y-2">
              <div className="relative h-64 overflow-hidden">
                <img 
                  src={item.image} 
                  alt={item.name} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-80 group-hover:opacity-100"
                />
                <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-[#141414] to-transparent"></div>
                <button className="absolute bottom-4 right-4 bg-[#f7c86c] text-[#0c0c0c] p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0">
                  <Plus size={20} />
                </button>
              </div>
              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-bold text-[#f9fafb]">{item.name}</h3>
                  <span className="text-[#f7c86c] font-mono font-bold">{item.price}</span>
                </div>
                <p className="text-[#9ca3af] text-sm font-light leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
