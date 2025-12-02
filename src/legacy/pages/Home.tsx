import mascot from "figma:asset/977616d74818f53990cc4e902fb699936122e684.png";
import { ArrowRight, PlayCircle } from "lucide-react";
import { PromotionsSection } from "../components/PromotionsSection";
import { InteractiveMenu } from "../components/InteractiveMenu";
import { BentoGrid } from "../components/BentoGrid";
import { useContent } from "../lib/content-context";

export function Home() {
  const { config } = useContent();

  return (
    <div className="flex flex-col">
      {/* HERO SECTION */}
      <section className="relative min-h-screen flex items-center overflow-hidden bg-[#050505]">
        {/* Dynamic Backgrounds */}
        <div className="absolute inset-0 z-0 pointer-events-none">
            <div className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] bg-[#0B2818] rounded-full blur-[150px] opacity-60 animate-pulse-slow"></div>
            <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-[#FFB800] rounded-full blur-[150px] opacity-10"></div>
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
        </div>

        <div className="container mx-auto px-6 lg:px-12 relative z-10 pt-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            
            {/* Text Content */}
            <div className="order-2 lg:order-1 space-y-10">
                <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full border border-[#FFB800]/30 bg-[#FFB800]/5 backdrop-blur-md animate-in fade-in slide-in-from-left duration-1000">
                    <span className="w-2 h-2 bg-[#FFB800] rounded-full animate-pulse"></span>
                    <span className="text-[#FFB800] text-[10px] font-black tracking-[0.3em] uppercase">{config.brand.name} V.2025</span>
                </div>

                <h1 className="text-6xl sm:text-7xl lg:text-8xl font-black text-white tracking-tighter leading-[0.9] animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-100">
                    {config.brand.heroTitle} <br/>
                    <span className="text-[#FFB800]">SUPREMO.</span> <br/>
                    ESTILO <br/>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0B2818] to-[#1a5c32] stroke-white" style={{ WebkitTextStroke: '1px white' }}>URBANO.</span>
                </h1>

                <p className="text-xl text-gray-400 max-w-lg font-light leading-relaxed border-l-4 border-[#FFB800] pl-6 animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-300">
                    {config.brand.heroSubtitle}
                </p>

                <div className="flex flex-wrap gap-6 pt-4 animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-500">
                    <a href="#menu" className="px-10 py-5 bg-[#FFB800] text-black font-black uppercase tracking-widest rounded-full hover:bg-white hover:scale-105 transition-all duration-300 shadow-[0_0_30px_rgba(255,184,0,0.4)] flex items-center gap-3">
                        Ver Menú <ArrowRight size={20} />
                    </a>
                    <button className="px-10 py-5 border border-white/20 text-white font-bold uppercase tracking-widest rounded-full hover:border-[#FFB800] hover:text-[#FFB800] transition-all duration-300 flex items-center gap-3">
                        <PlayCircle size={20} /> Concepto
                    </button>
                </div>
            </div>

            {/* Mascot Hero Image */}
            <div className="order-1 lg:order-2 relative flex justify-center lg:justify-end animate-in fade-in slide-in-from-right duration-1000 delay-300">
                <div className="relative w-full max-w-[600px] aspect-square">
                    <div className="absolute inset-0 bg-gradient-to-tr from-[#FFB800]/20 to-[#0B2818]/40 rounded-full blur-[80px] animate-pulse-slow"></div>
                    <img 
                        src={mascot} 
                        alt="Elote con Hoodie" 
                        className="w-full h-full object-contain relative z-10 drop-shadow-[0_20px_50px_rgba(0,0,0,0.8)] hover:scale-105 transition-transform duration-700 ease-out"
                    />
                </div>
            </div>

          </div>
        </div>
      </section>

      {/* NEW PROMOTIONS SECTION */}
      <PromotionsSection />

      {/* INTERACTIVE MENU */}
      <InteractiveMenu />

      {/* BENTO GRID IMPACT */}
      <BentoGrid />
    </div>
  );
}
