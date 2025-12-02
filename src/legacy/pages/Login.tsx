import { useState } from "react";
import { useAuth } from "../lib/auth-context";
import { ArrowLeft, Lock, User } from "lucide-react";
import mascot from "figma:asset/977616d74818f53990cc4e902fb699936122e684.png";

export function Login() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulation of API call
    setTimeout(() => {
        login('admin');
        window.location.hash = '#admin/inventario';
        setLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-6 relative overflow-hidden">
       {/* Background FX */}
       <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10"></div>
       <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-[#0B2818] rounded-full blur-[150px] opacity-40"></div>
       <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-[#FFB800] rounded-full blur-[150px] opacity-20"></div>

       <a href="#inicio" className="absolute top-8 left-8 text-gray-500 hover:text-white flex items-center gap-2 transition-colors z-20">
            <ArrowLeft size={20} /> Regresar
       </a>

       <div className="w-full max-w-md relative z-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
           {/* Card */}
           <div className="bg-[#0a0a0a]/80 backdrop-blur-2xl border border-white/10 p-10 rounded-3xl shadow-2xl ring-1 ring-white/5">
                <div className="text-center mb-10">
                    <div className="w-24 h-24 mx-auto bg-[#0B2818] rounded-full border-2 border-[#FFB800]/30 flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(255,184,0,0.15)]">
                        <img src={mascot} alt="Logo" className="w-full h-full object-cover scale-110 translate-y-1" />
                    </div>
                    <h2 className="text-2xl font-black text-white tracking-tight mb-2">ACCESO AL SISTEMA</h2>
                    <p className="text-gray-400 text-sm">Gestión Operativa Maíz Urbano</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-[#FFB800] text-[10px] font-bold uppercase tracking-widest ml-1">Usuario / Email</label>
                        <div className="relative">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                            <input 
                                type="email" 
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-black/50 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white focus:border-[#FFB800] focus:ring-1 focus:ring-[#FFB800] focus:outline-none transition-all placeholder:text-gray-700"
                                placeholder="admin@maizurbano.mx"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[#FFB800] text-[10px] font-bold uppercase tracking-widest ml-1">Contraseña</label>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                            <input 
                                type="password" 
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-black/50 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white focus:border-[#FFB800] focus:ring-1 focus:ring-[#FFB800] focus:outline-none transition-all placeholder:text-gray-700"
                                placeholder="••••••••"
                                required
                            />
                        </div>
                    </div>

                    <button 
                        type="submit" 
                        disabled={loading}
                        className="w-full bg-[#FFB800] text-black font-black uppercase tracking-widest py-4 rounded-xl hover:bg-white transition-all duration-300 shadow-[0_0_20px_rgba(255,184,0,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.3)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            <span className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></span>
                        ) : "Iniciar Sesión"}
                    </button>
                </form>

                <div className="mt-8 text-center">
                    <a href="#" className="text-xs text-gray-500 hover:text-[#FFB800] transition-colors">¿Olvidaste tu contraseña?</a>
                </div>
           </div>
       </div>
    </div>
  );
}
