import { Instagram, Facebook, Twitter } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-[#050505] border-t border-white/5 pt-20 pb-10">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="grid md:grid-cols-4 gap-12 mb-16">
          <div className="md:col-span-2">
            <span className="font-black text-[#f7c86c] text-2xl block mb-4">MU</span>
            <p className="text-[#9ca3af] max-w-xs leading-relaxed text-sm">
              Sistema Operativo Callejero. Redefiniendo la experiencia del antojito mexicano a través de tecnología, estandarización y diseño.
            </p>
          </div>
          
          <div>
            <h4 className="text-[#f9fafb] font-bold text-sm uppercase tracking-widest mb-6">Compañía</h4>
            <ul className="space-y-4 text-sm text-[#9ca3af]">
              <li><a href="#nosotros" className="hover:text-[#f7c86c] transition-colors">Nosotros</a></li>
              <li><a href="#impacto" className="hover:text-[#f7c86c] transition-colors">Impacto</a></li>
              <li><a href="#empleo" className="hover:text-[#f7c86c] transition-colors">Carreras</a></li>
              <li><a href="#prensa" className="hover:text-[#f7c86c] transition-colors">Prensa</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-[#f9fafb] font-bold text-sm uppercase tracking-widest mb-6">Legal</h4>
            <ul className="space-y-4 text-sm text-[#9ca3af]">
              <li><a href="#" className="hover:text-[#f7c86c] transition-colors">Términos y Condiciones</a></li>
              <li><a href="#" className="hover:text-[#f7c86c] transition-colors">Aviso de Privacidad</a></li>
              <li><a href="#" className="hover:text-[#f7c86c] transition-colors">Cookies</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[#525252] text-xs">© 2025 Maíz Urbano. Todos los derechos reservados.</p>
          
          <div className="flex gap-6">
            <a href="#" className="text-[#9ca3af] hover:text-[#f7c86c] transition-colors"><Instagram size={20} /></a>
            <a href="#" className="text-[#9ca3af] hover:text-[#f7c86c] transition-colors"><Facebook size={20} /></a>
            <a href="#" className="text-[#9ca3af] hover:text-[#f7c86c] transition-colors"><Twitter size={20} /></a>
          </div>
        </div>
      </div>
    </footer>
  );
}
