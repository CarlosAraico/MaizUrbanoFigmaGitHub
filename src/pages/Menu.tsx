import { useState } from "react";
import { useCart, ProductOption, SauceProfile } from "../lib/cart-context";
import { Plus, Info, Flame, Utensils } from "lucide-react";
import { toast } from "sonner";

const PRODUCTS: ProductOption[] = [
  {
    id: "elote-entero",
    name: "Elote Entero Montado",
    type: "Base",
    price: 75,
    description: "Elote tierno cocido en tequesquite y epazote. Untado con Mantequilla Gloria.",
    image: "https://images.unsplash.com/photo-1616556961871-4e59865a3202?q=80&w=1974&auto=format&fit=crop"
  },
  {
    id: "esquite-tradicional",
    name: "Esquites Salteados",
    type: "Base",
    price: 68,
    description: "Grano sofrito en mantequilla, cebolla, ajo y epazote. Servido en vaso.",
    image: "https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?q=80&w=2070&auto=format&fit=crop"
  },
  {
    id: "panque-elote",
    name: "Panqué de Elote",
    type: "Postre",
    price: 55,
    description: "Postre artesanal con pinole y crema de piloncillo. Receta rústica.",
    image: "https://images.unsplash.com/photo-1601884997407-d62cb4b061c5?q=80&w=2070&auto=format&fit=crop"
  }
];

const PROFILES: { id: SauceProfile; name: string; heat: number; desc: string; color: string }[] = [
  { id: "Original", name: "Original", heat: 0, desc: "Mayonesa Madre + Queso + Chile Polvo", color: "bg-gray-200" },
  { id: "Chipotle", name: "Ahumado (Chipotle)", heat: 1, desc: "Mayonesa Madre + Chipotle Molido", color: "bg-amber-700" },
  { id: "Manzano", name: "Frutal (Manzano)", heat: 2, desc: "Crema de Manzano + Mayonesa Madre", color: "bg-yellow-500" },
  { id: "Habanero", name: "Fuego (Habanero)", heat: 3, desc: "Mayonesa Madre + Crema Habanero", color: "bg-orange-600" },
  { id: "Macha", name: "Crunch (Macha)", heat: 2, desc: "Mayonesa Madre + Salsa Macha (Semillas)", color: "bg-red-900" },
];

export function Menu() {
  const { addToCart } = useCart();
  const [selectedProduct, setSelectedProduct] = useState<ProductOption | null>(null);
  const [selectedProfile, setSelectedProfile] = useState<SauceProfile>("Original");

  const handleAddToCart = (product: ProductOption) => {
    if (product.type === 'Base') {
      // Si es base, abrir modal o selección rápida de perfil.
      // Para simplificar UX aquí, asumimos que selecciona perfil antes o hay un default.
      // Aquí usaremos el estado selectedProfile.
      addToCart({
        productId: product.id,
        name: product.name,
        price: product.price,
        quantity: 1,
        baseType: product.id.includes('elote') ? 'Elote' : 'Esquite',
        profile: selectedProfile,
        extras: []
      });
    } else {
      // Postre directo
      addToCart({
        productId: product.id,
        name: product.name,
        price: product.price,
        quantity: 1,
        extras: []
      });
    }
    // toast.success("Agregado al carrito"); 
    // Note: Toast logic would be implemented with a provider
  };

  return (
    <div className="bg-[#0a0a0a] min-h-screen pb-24">
      {/* Menu Header */}
      <section className="pt-32 pb-16 px-6 lg:px-12 border-b border-white/5">
        <div className="container mx-auto">
          <span className="text-[#D97706] font-mono text-xs uppercase tracking-[0.3em]">El Arsenal de Sabores</span>
          <h2 className="text-5xl md:text-7xl font-black text-white mt-4 mb-6">NUESTRO MENÚ.</h2>
          <p className="text-gray-400 max-w-2xl text-lg">
            Arquitectura de sabores por capas. Maíz criollo nixtamalizado, bases lácteas artesanales y chiles endémicos.
          </p>
        </div>
      </section>

      {/* Configurator (Visual) */}
      <section className="py-12 border-b border-white/5 bg-[#050505] sticky top-20 z-30 shadow-2xl">
        <div className="container mx-auto px-6 lg:px-12">
          <p className="text-gray-500 text-xs uppercase tracking-widest mb-4 font-bold">1. Elige tu Perfil de Sabor (Para Elotes y Esquites)</p>
          <div className="flex overflow-x-auto gap-4 pb-2 no-scrollbar">
            {PROFILES.map((profile) => (
              <button
                key={profile.id}
                onClick={() => setSelectedProfile(profile.id)}
                className={`flex-shrink-0 p-4 rounded-xl border transition-all min-w-[200px] text-left group ${
                  selectedProfile === profile.id 
                    ? "bg-[#1a1a1a] border-[#D97706] ring-1 ring-[#D97706]" 
                    : "bg-[#111] border-white/10 hover:border-white/30"
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <span className={`w-3 h-3 rounded-full ${profile.color} shadow-[0_0_10px_currentColor]`}></span>
                  <div className="flex gap-0.5">
                    {[...Array(3)].map((_, i) => (
                      <Flame 
                        key={i} 
                        size={12} 
                        className={i < profile.heat ? "text-[#D97706] fill-[#D97706]" : "text-gray-800"} 
                      />
                    ))}
                  </div>
                </div>
                <p className={`font-bold text-sm ${selectedProfile === profile.id ? "text-white" : "text-gray-300"}`}>
                  {profile.name}
                </p>
                <p className="text-[10px] text-gray-500 mt-1 leading-tight">{profile.desc}</p>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-16 container mx-auto px-6 lg:px-12">
        <p className="text-gray-500 text-xs uppercase tracking-widest mb-8 font-bold">2. Elige tu Base o Postre</p>
        <div className="grid md:grid-cols-3 gap-8">
          {PRODUCTS.map((product) => (
            <div key={product.id} className="group bg-[#111] rounded-2xl overflow-hidden border border-white/5 hover:border-[#D97706]/50 transition-all duration-500 hover:-translate-y-2">
              <div className="aspect-[4/3] relative overflow-hidden">
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="w-full h-full object-cover opacity-80 group-hover:scale-110 group-hover:opacity-100 transition-all duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#111] via-transparent to-transparent"></div>
                
                {/* Badge */}
                {product.type === 'Base' && (
                  <div className="absolute top-4 right-4 bg-black/60 backdrop-blur border border-white/10 px-3 py-1 rounded-full">
                    <span className="text-[#D97706] text-[10px] font-bold uppercase tracking-widest">
                      {selectedProfile} Style
                    </span>
                  </div>
                )}
              </div>

              <div className="p-8">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-1">{product.name}</h3>
                    <p className="text-[#D97706] font-mono font-bold text-lg">${product.price}</p>
                  </div>
                </div>
                
                <p className="text-gray-400 text-sm mb-8 leading-relaxed min-h-[60px]">
                  {product.description}
                </p>

                <div className="flex flex-col gap-3">
                  {/* Dynamic description based on selection */}
                  {product.type === 'Base' && (
                    <div className="flex items-center gap-2 text-xs text-gray-500 bg-black/30 p-3 rounded border border-white/5">
                      <Utensils size={14} />
                      <span>Incluye: Mantequilla Gloria + {PROFILES.find(p => p.id === selectedProfile)?.desc}</span>
                    </div>
                  )}

                  <button 
                    onClick={() => handleAddToCart(product)}
                    className="w-full bg-white text-black font-bold uppercase tracking-widest py-4 hover:bg-[#D97706] hover:text-black transition-colors flex items-center justify-center gap-2 group-active:scale-95"
                  >
                    Agregar <Plus size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
