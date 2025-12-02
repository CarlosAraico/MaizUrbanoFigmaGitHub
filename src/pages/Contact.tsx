import { Mail, MapPin, Phone, Clock, Send } from "lucide-react";

export function Contact() {
  return (
    <div className="bg-[#050505] min-h-screen pt-24">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="grid lg:grid-cols-2 gap-16 pb-24">
          {/* Info Section */}
          <div>
            <span className="text-[#D97706] font-mono text-xs uppercase tracking-[0.3em]">Contacto Corporativo</span>
            <h2 className="text-5xl font-black text-white mt-4 mb-8">HABLEMOS DE <br/> NEGOCIOS.</h2>
            
            <div className="space-y-8 mb-12">
              <div className="flex items-start gap-6 group">
                <div className="w-12 h-12 bg-[#111] border border-white/10 rounded-xl flex items-center justify-center text-[#D97706] group-hover:bg-[#D97706] group-hover:text-black transition-all">
                  <Phone size={24} />
                </div>
                <div>
                  <h3 className="text-white font-bold text-lg mb-1">Línea Directa</h3>
                  <p className="text-gray-400 text-sm mb-1">Atención a Inversionistas y Franquicias</p>
                  <div className="flex flex-col gap-1">
                    <a href="tel:5521180848" className="text-white hover:text-[#D97706] transition-colors font-mono text-lg">Fernando Palacio: 55 2118 0848</a>
                    <a href="tel:7772168377" className="text-white hover:text-[#D97706] transition-colors font-mono text-lg">Carlos Araico: 777 216 8377</a>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-6 group">
                <div className="w-12 h-12 bg-[#111] border border-white/10 rounded-xl flex items-center justify-center text-[#D97706] group-hover:bg-[#D97706] group-hover:text-black transition-all">
                  <MapPin size={24} />
                </div>
                <div>
                  <h3 className="text-white font-bold text-lg mb-1">CEDIS Central</h3>
                  <p className="text-gray-400 text-sm mb-2">Centro de Distribución y Operaciones</p>
                  <p className="text-white leading-relaxed max-w-xs">
                    Andes 91, Los Alpes, Álvaro Obregón, 01010 Ciudad de México, CDMX
                  </p>
                  <a 
                    href="https://maps.app.goo.gl/Wjdi4maQyvwR4jUj8" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-[#D97706] text-sm font-bold uppercase tracking-widest mt-2 inline-block border-b border-[#D97706] hover:text-white hover:border-white transition-all"
                  >
                    Ver en Google Maps
                  </a>
                </div>
              </div>
            </div>

            {/* Interactive Map Embed */}
            <div className="w-full h-[300px] rounded-2xl overflow-hidden border border-white/10 grayscale hover:grayscale-0 transition-all duration-700 relative group">
                 <iframe 
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3764.197467233153!2d-99.1917656!3d19.3606223!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x85d2001013413793%3A0x6977542480625475!2sAndes%2091%2C%20Los%20Alpes%2C%20%C3%81lvaro%20Obreg%C3%B3n%2C%2001010%20Ciudad%20de%20M%C3%A9xico%2C%20CDMX!5e0!3m2!1sen!2smx!4v1701450000000!5m2!1sen!2smx" 
                    width="100%" 
                    height="100%" 
                    style={{ border: 0 }} 
                    allowFullScreen 
                    loading="lazy" 
                    referrerPolicy="no-referrer-when-downgrade"
                    className="absolute inset-0"
                 ></iframe>
                 {/* Overlay to keep style consistent until hover */}
                 <div className="absolute inset-0 bg-[#D97706]/10 pointer-events-none group-hover:opacity-0 transition-opacity"></div>
            </div>
          </div>

          {/* Form Section */}
          <div className="bg-[#111] p-8 lg:p-12 rounded-3xl border border-white/5 shadow-2xl">
            <h3 className="text-2xl font-bold text-white mb-6">Envíanos un mensaje</h3>
            <form className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-[#D97706] uppercase tracking-widest">Nombre</label>
                  <input type="text" className="w-full bg-black border border-white/10 rounded-lg p-4 text-white focus:border-[#D97706] focus:outline-none transition-colors" placeholder="Tu nombre" />
                </div>
                <div className="space-y-2">
                    <label className="text-xs font-bold text-[#D97706] uppercase tracking-widest">Teléfono</label>
                    <input type="tel" className="w-full bg-black border border-white/10 rounded-lg p-4 text-white focus:border-[#D97706] focus:outline-none transition-colors" placeholder="55 1234 5678" />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-xs font-bold text-[#D97706] uppercase tracking-widest">Email</label>
                <input type="email" className="w-full bg-black border border-white/10 rounded-lg p-4 text-white focus:border-[#D97706] focus:outline-none transition-colors" placeholder="nombre@empresa.com" />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-[#D97706] uppercase tracking-widest">Asunto</label>
                <select className="w-full bg-black border border-white/10 rounded-lg p-4 text-white focus:border-[#D97706] focus:outline-none transition-colors">
                    <option>Información de Franquicias</option>
                    <option>Propuesta a Proveedores</option>
                    <option>Prensa / Medios</option>
                    <option>Otro</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-[#D97706] uppercase tracking-widest">Mensaje</label>
                <textarea rows={4} className="w-full bg-black border border-white/10 rounded-lg p-4 text-white focus:border-[#D97706] focus:outline-none transition-colors resize-none" placeholder="¿Cómo podemos ayudarte?"></textarea>
              </div>

              <button type="submit" className="w-full bg-[#D97706] hover:bg-[#b45309] text-black font-black uppercase tracking-widest py-5 rounded-lg transition-all hover:scale-[1.02] flex items-center justify-center gap-2">
                Enviar Mensaje <Send size={18} />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
