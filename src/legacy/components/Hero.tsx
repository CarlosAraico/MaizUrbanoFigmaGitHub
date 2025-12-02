import { ArrowRight, TrendingUp } from "lucide-react";

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-[#0c0c0c] pt-20">
      {/* Cinematic Background with Gradient Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1752861640242-1d2be06f7fcd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZXhpY2FuJTIwc3RyZWV0JTIwY29ybiUyMGVsb3RlJTIwZXNxdWl0ZXN8ZW58MXx8fHwxNzY0NTQzNTQ0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
          alt="Cinematic Corn Background" 
          className="w-full h-full object-cover opacity-40 scale-105 animate-pulse-slow"
        />
        {/* Sophisticated Gradient: Dark fades from bottom and left */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0c0c0c] via-[#0c0c0c]/80 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#0c0c0c] via-[#0c0c0c]/50 to-transparent"></div>
        
        {/* Golden Glow Effect */}
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-[#f7c86c] rounded-full mix-blend-screen opacity-5 blur-[120px]"></div>
      </div>

      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        <div className="max-w-4xl space-y-8">
          
          {/* Tagline Chip */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#f7c86c]/30 bg-[#f7c86c]/5 backdrop-blur-sm animate-in fade-in slide-in-from-bottom-4 duration-700">
            <span className="w-2 h-2 rounded-full bg-[#f7c86c] animate-pulse"></span>
            <span className="text-[#f7c86c] text-xs font-bold tracking-[0.2em] uppercase">Sistema Operativo Callejero</span>
          </div>

          {/* Main Title */}
          <h1 className="text-5xl sm:text-6xl lg:text-8xl font-extrabold text-[#f9fafb] tracking-tight leading-[1.1] animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100">
            ELOTE CON <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#f7c86c] to-[#ebb45c]">HOODIE.</span>
          </h1>

          <p className="text-xl text-[#9ca3af] max-w-2xl leading-relaxed font-light animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
            Menús replicables. Servicio listo para escalar. La evolución del antojito mexicano con estándares internacionales y alma de barrio.
          </p>

          {/* Metrics / Highlights */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 py-6 border-t border-white/10 animate-in fade-in slide-in-from-bottom-10 duration-700 delay-300">
            <div>
              <p className="text-3xl font-bold text-[#f9fafb]">92%</p>
              <p className="text-xs text-[#f7c86c] uppercase tracking-wider mt-1">Consistencia</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-[#f9fafb]">65%</p>
              <p className="text-xs text-[#f7c86c] uppercase tracking-wider mt-1">Margen Bruto</p>
            </div>
            <div className="hidden md:block">
              <p className="text-3xl font-bold text-[#f9fafb]">+12</p>
              <p className="text-xs text-[#f7c86c] uppercase tracking-wider mt-1">Ubicaciones</p>
            </div>
          </div>

          {/* CTAs */}
          <div className="flex flex-wrap gap-4 animate-in fade-in slide-in-from-bottom-12 duration-700 delay-400">
            <button className="bg-[#f7c86c] hover:bg-[#ebb45c] text-[#0c0c0c] px-8 py-4 rounded text-sm font-bold uppercase tracking-widest transition-transform hover:-translate-y-1 flex items-center gap-2">
              Ordena Ahora <ArrowRight size={18} />
            </button>
            <button className="bg-transparent border border-[#f9fafb]/20 hover:border-[#f7c86c] text-[#f9fafb] hover:text-[#f7c86c] px-8 py-4 rounded text-sm font-bold uppercase tracking-widest transition-colors">
              Ver Modelo de Negocio
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
