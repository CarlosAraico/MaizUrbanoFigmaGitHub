import { useState } from "react";
import { useContent, Promo } from "../../lib/content-context";
import { Save, RefreshCw, Upload } from "lucide-react";

export function Config() {
  const { config, updateBrand, updateLink, updatePromo } = useContent();
  const [saving, setSaving] = useState(false);

  const handleSave = () => {
      setSaving(true);
      setTimeout(() => {
          setSaving(false);
          alert("Cambios publicados en la web en tiempo real.");
      }, 1000);
  };

  return (
    <div className="space-y-8 pb-20 max-w-5xl mx-auto">
        <div className="flex justify-between items-center border-b border-white/10 pb-6">
            <div>
                <h2 className="text-3xl font-black text-white tracking-tight">Configuración del Sitio</h2>
                <p className="text-gray-500 mt-1">CMS: Control total del Frontend</p>
            </div>
            <button 
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-2 px-6 py-3 bg-[#FFB800] text-black rounded-lg hover:bg-white transition-colors text-sm font-bold shadow-[0_0_15px_rgba(255,184,0,0.3)]"
            >
                {saving ? <RefreshCw className="animate-spin" size={18} /> : <Save size={18} />}
                {saving ? 'Publicando...' : 'Publicar Cambios'}
            </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Branding Section */}
            <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-6 space-y-6">
                <h3 className="text-white font-bold text-lg mb-4">Identidad de Marca</h3>
                
                <div className="space-y-2">
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Nombre del Negocio</label>
                    <input 
                        value={config.brand.name}
                        onChange={(e) => updateBrand('name', e.target.value)}
                        className="w-full bg-[#151515] border border-white/10 rounded p-3 text-white focus:border-[#FFB800] outline-none"
                    />
                </div>
                
                <div className="space-y-2">
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Héroe Titulo (Home)</label>
                    <input 
                        value={config.brand.heroTitle}
                        onChange={(e) => updateBrand('heroTitle', e.target.value)}
                        className="w-full bg-[#151515] border border-white/10 rounded p-3 text-[#FFB800] font-black text-lg focus:border-[#FFB800] outline-none"
                    />
                </div>

                 <div className="space-y-2">
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Links Externos</label>
                    <div className="grid gap-3">
                        <input 
                            placeholder="Link Uber Eats"
                            value={config.links.uberEats}
                            onChange={(e) => updateLink('uberEats', e.target.value)}
                            className="w-full bg-[#151515] border border-white/10 rounded p-3 text-gray-300 text-xs focus:border-[#FFB800] outline-none"
                        />
                        <input 
                            placeholder="Link Google Maps"
                            value={config.links.googleMaps}
                            onChange={(e) => updateLink('googleMaps', e.target.value)}
                            className="w-full bg-[#151515] border border-white/10 rounded p-3 text-gray-300 text-xs focus:border-[#FFB800] outline-none"
                        />
                    </div>
                </div>
            </div>

            {/* Promotions Editor */}
            <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-6 space-y-6">
                <h3 className="text-white font-bold text-lg mb-4">Gestor de Promociones</h3>
                <div className="space-y-6 max-h-[500px] overflow-y-auto pr-2">
                    {config.promotions.map((promo) => (
                        <div key={promo.id} className="bg-[#151515] p-4 rounded-xl border border-white/5 relative group">
                            <span className="absolute top-2 right-2 text-[10px] bg-black px-2 py-1 rounded text-gray-500 border border-white/10">
                                {promo.type === 'main' ? 'PRINCIPAL' : 'LATERAL'}
                            </span>
                            
                            <div className="flex gap-4 items-start mb-4">
                                <div className="w-16 h-16 bg-black rounded-lg overflow-hidden relative">
                                    <img src={promo.image} className="w-full h-full object-cover opacity-50" />
                                    <Upload size={12} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white" />
                                </div>
                                <div className="flex-1 space-y-2">
                                    <input 
                                        value={promo.title}
                                        onChange={(e) => updatePromo(promo.id, 'title', e.target.value)}
                                        className="w-full bg-black border border-white/10 rounded px-2 py-1 text-white text-sm focus:border-[#FFB800] outline-none font-bold"
                                    />
                                    <input 
                                        value={promo.subtitle}
                                        onChange={(e) => updatePromo(promo.id, 'subtitle', e.target.value)}
                                        className="w-full bg-black border border-white/10 rounded px-2 py-1 text-gray-400 text-xs focus:border-[#FFB800] outline-none"
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    </div>
  );
}
