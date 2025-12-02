import { useState } from "react";
import { Menu, X, ShoppingBag, User, Star, ExternalLink } from "lucide-react";
import { useAuth } from "../lib/auth-context";
import { useCart } from "../lib/cart-context";
import { useContent } from "../lib/content-context";

function RatingModal({ onClose }: { onClose: () => void }) {
    const { config } = useContent();
    const [rating, setRating] = useState(0);
    const [sent, setSent] = useState(false);

    if (sent) return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 backdrop-blur-sm animate-in fade-in">
            <div className="bg-[#111] p-8 rounded-2xl text-center border border-[#FFB800]">
                <h3 className="text-2xl font-bold text-white mb-2">¡Gracias!</h3>
                <p className="text-gray-400 mb-4">Tu opinión nos ayuda a mejorar.</p>
                <div className="flex gap-2 justify-center">
                    <a 
                        href={config.links.googleMaps} 
                        target="_blank" 
                        className="bg-[#FFB800] text-black font-bold px-4 py-2 rounded text-sm flex items-center gap-2 hover:bg-white"
                    >
                        <ExternalLink size={14} /> Dejar reseña en Google
                    </a>
                    <button onClick={onClose} className="text-gray-500 hover:text-white text-sm underline">Cerrar</button>
                </div>
            </div>
        </div>
    );

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 backdrop-blur-sm animate-in fade-in">
            <div className="bg-[#111] p-8 rounded-2xl text-center border border-white/10 max-w-sm w-full relative">
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-white"><X size={18} /></button>
                <h3 className="text-xl font-bold text-white mb-6">Califica tu experiencia</h3>
                <div className="flex justify-center gap-2 mb-8">
                    {[1,2,3,4,5].map(s => (
                        <button key={s} onClick={() => setRating(s)} className="transition-transform hover:scale-125">
                            <Star size={32} className={s <= rating ? "fill-[#FFB800] text-[#FFB800]" : "text-gray-700"} />
                        </button>
                    ))}
                </div>
                <button 
                    onClick={() => setSent(true)}
                    disabled={rating === 0}
                    className="w-full bg-white text-black font-bold py-3 rounded disabled:opacity-50 hover:bg-[#FFB800] transition-colors"
                >
                    Enviar Calificación
                </button>
            </div>
        </div>
    );
}

export function Navbar({ currentRoute }: { currentRoute: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [showRating, setShowRating] = useState(false);
  const { isAuthenticated, logout } = useAuth();
  
  // CORRECTED CART USAGE
  const { items, toggleCart } = useCart();
  
  const { config } = useContent();

  const navLinks = [
    { name: 'Menú', href: '#menu' },
    { name: 'Franquicias', href: '#franquicias' },
    { name: 'Impacto', href: '#impacto' },
    { name: 'Facturación', href: '#facturacion-publica' },
    { name: 'Bolsa de Trabajo', href: '#bolsa-trabajo' },
    { name: 'Contacto', href: '#contacto' },
  ];

  return (
    <>
      <nav className="fixed w-full z-50 bg-black/80 backdrop-blur-lg border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            
            <div className="flex-shrink-0 cursor-pointer" onClick={() => window.location.hash = ''}>
               <img src={config.brand.logoUrl} alt="Logo" className="h-12 w-auto object-contain" />
            </div>
            
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-8">
                {navLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.href}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-300 ${
                      currentRoute === link.href 
                        ? 'text-[#FFB800]' 
                        : 'text-gray-300 hover:text-[#FFB800]'
                    }`}
                  >
                    {link.name}
                  </a>
                ))}
              </div>
            </div>

            <div className="hidden md:flex items-center gap-6">
              <a 
                href={config.links.uberEats} 
                target="_blank"
                className="bg-[#06C167] text-black px-4 py-2 rounded-full text-xs font-bold uppercase hover:bg-white transition-colors flex items-center gap-2"
              >
                Pide en Uber Eats
              </a>

              <button 
                 onClick={() => setShowRating(true)}
                 className="text-white hover:text-[#FFB800]"
              >
                  <Star size={20} />
              </button>

              <button 
                onClick={toggleCart}
                className="relative p-2 text-gray-400 hover:text-[#FFB800] transition-colors"
              >
                <ShoppingBag size={20} />
                {items.length > 0 && (
                  <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-black transform translate-x-1/4 -translate-y-1/4 bg-[#FFB800] rounded-full">
                    {items.length}
                  </span>
                )}
              </button>

              {isAuthenticated ? (
                <div className="flex items-center gap-4">
                    <a href="#admin" className="text-sm font-bold text-[#FFB800] border border-[#FFB800] px-4 py-2 rounded-full hover:bg-[#FFB800] hover:text-black transition-all">
                        Dashboard
                    </a>
                </div>
              ) : (
                 <a href="#login" className="text-gray-400 hover:text-white">
                    <User size={20} />
                 </a>
              )}
            </div>

            <div className="-mr-2 flex md:hidden">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none"
              >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {isOpen && (
          <div className="md:hidden bg-black border-b border-white/10">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="text-gray-300 hover:text-[#FFB800] block px-3 py-2 rounded-md text-base font-medium"
                  onClick={() => setIsOpen(false)}
                >
                  {link.name}
                </a>
              ))}
               <a href={config.links.uberEats} target="_blank" className="text-[#06C167] block px-3 py-2 rounded-md text-base font-bold">
                  Pedir en Uber Eats
               </a>
            </div>
          </div>
        )}
      </nav>
      
      {showRating && <RatingModal onClose={() => setShowRating(false)} />}
    </>
  );
}
