import { ReactNode, useState } from "react";
import { useAuth } from "../../lib/auth-context";
import mascot from "figma:asset/977616d74818f53990cc4e902fb699936122e684.png";
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users, 
  Settings, 
  LogOut, 
  Bell,
  Search,
  Menu,
  Calculator,
  FileBarChart,
  Map,
  FileText
} from "lucide-react";

export function DashboardLayout({ children }: { children: ReactNode }) {
  const { logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const currentHash = window.location.hash;

  const handleLogout = () => {
    logout();
    window.location.hash = '#inicio';
  };

  const navItems = [
    { icon: FileBarChart, label: "Reportes & Ventas", href: "#admin/reportes" },
    { icon: Calculator, label: "Calculadora Costos", href: "#admin/costeos" },
    { icon: Package, label: "Inventario", href: "#admin/inventario" },
    { icon: ShoppingCart, label: "Órdenes Compra", href: "#admin/ordenes" },
    { icon: Map, label: "Logística", href: "#admin/logistica" },
    { icon: FileText, label: "Facturación", href: "#admin/facturacion" },
    { icon: Users, label: "Proveedores", href: "#admin/proveedores" },
    { icon: Settings, label: "Configuración", href: "#admin/config" },
  ];

  return (
    <div className="min-h-screen bg-[#050505] flex overflow-hidden">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-[#0a0a0a] border-r border-white/5 flex flex-col transition-all duration-300 fixed h-full z-30 shadow-2xl`}>
         <div className="p-6 flex items-center gap-3 border-b border-white/5 h-20 overflow-hidden">
            <div className="w-8 h-8 rounded-full bg-[#0B2818] border border-[#FFB800]/30 flex items-center justify-center flex-shrink-0">
                <img src={mascot} alt="Mascot" className="w-full h-full object-cover scale-110 translate-y-0.5" />
            </div>
            <div className={`transition-opacity duration-300 flex flex-col ${sidebarOpen ? 'opacity-100' : 'opacity-0 hidden'}`}>
                <h1 className="text-white font-black text-sm tracking-tighter whitespace-nowrap">MAÍZ URBANO</h1>
                {/* Small logo/text below name as requested */}
                 <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-[#FFB800] rounded-full"></div>
                    <p className="text-[#FFB800] text-[9px] uppercase tracking-wider font-bold">Admin Console</p>
                 </div>
            </div>
         </div>

         <nav className="flex-1 py-6 px-3 space-y-1">
            <p className={`px-3 text-[10px] uppercase tracking-widest text-gray-600 font-bold mb-2 ${sidebarOpen ? 'block' : 'hidden'}`}>Operativo</p>
            {navItems.map((item) => {
                const isActive = currentHash === item.href;
                return (
                    <a 
                        key={item.label} 
                        href={item.href}
                        className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-all group relative ${isActive ? 'bg-[#FFB800]/10 text-[#FFB800]' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                    >
                        {isActive && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-[#FFB800] rounded-r-full"></div>}
                        <item.icon size={20} className={isActive ? 'text-[#FFB800]' : 'text-gray-500 group-hover:text-white'} />
                        <span className={`font-medium text-sm ${sidebarOpen ? 'block' : 'hidden'} whitespace-nowrap`}>{item.label}</span>
                    </a>
                );
            })}
         </nav>

         <div className="p-3 border-t border-white/5">
            <button 
                onClick={handleLogout}
                className="flex items-center gap-3 px-3 py-3 rounded-lg text-red-400 hover:bg-red-900/20 hover:text-red-300 w-full transition-all overflow-hidden"
            >
                <LogOut size={20} className="flex-shrink-0" />
                <span className={`font-medium text-sm ${sidebarOpen ? 'block' : 'hidden'} whitespace-nowrap`}>Cerrar Sesión</span>
            </button>
         </div>
      </aside>

      {/* Main Content */}
      <div className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-20'}`}>
        {/* Topbar */}
        <header className="h-20 bg-[#050505]/80 backdrop-blur-xl border-b border-white/5 flex items-center justify-between px-8 sticky top-0 z-20">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-gray-400 hover:text-white">
                <Menu size={24} />
            </button>

            <div className="flex items-center gap-6">
                <div className="relative hidden md:block">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" size={16} />
                    <input 
                        type="text" 
                        placeholder="Buscar SKU, Orden..." 
                        className="bg-[#0a0a0a] border border-white/10 rounded-full py-2 pl-10 pr-4 text-sm text-white focus:border-[#FFB800] focus:outline-none w-64 transition-all focus:w-80"
                    />
                </div>
                <button className="relative text-gray-400 hover:text-white">
                    <Bell size={20} />
                    <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border border-black"></span>
                </button>
                <div className="flex items-center gap-3 border-l border-white/10 pl-6">
                    <div className="text-right hidden md:block">
                        <p className="text-white text-sm font-bold">Fernando Palacio</p>
                        <p className="text-gray-500 text-xs">Director General</p>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#FFB800] to-[#0B2818] p-[1px] shadow-[0_0_10px_rgba(255,184,0,0.2)]">
                        <div className="w-full h-full rounded-full bg-black flex items-center justify-center text-[#FFB800] font-bold text-xs">FP</div>
                    </div>
                </div>
            </div>
        </header>

        {/* Content Area */}
        <main className="p-8 flex-1 overflow-y-auto relative">
            {children}
        </main>
      </div>
    </div>
  );
}
