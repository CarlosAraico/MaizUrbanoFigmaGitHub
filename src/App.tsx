import { useState, useEffect } from "react";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import { CartDrawer } from "./components/CartDrawer";
import { CartProvider } from "./lib/cart-context";
import { AuthProvider, useAuth } from "./lib/auth-context";
import { AdminProvider } from "./lib/admin-context";
import { ContentProvider } from "./lib/content-context"; // Provider

// Public Pages
import { Home } from "./pages/Home";
import { Menu } from "./pages/Menu";
import { Franchise } from "./pages/Franchise";
import { Impact } from "./pages/Impact";
import { Contact } from "./pages/Contact";
import { Login } from "./pages/Login";
import { PublicInvoicing } from "./pages/PublicInvoicing"; // New Page
import { Careers } from "./pages/Careers"; // New Page

// Admin Pages
import { DashboardLayout } from "./pages/admin/DashboardLayout";
import { Inventory } from "./pages/admin/Inventory";
import { Orders } from "./pages/admin/Orders";
import { Suppliers } from "./pages/admin/Suppliers";
import { Reports } from "./pages/admin/Reports";
import { Costing } from "./pages/admin/Costing";
import { Logistics } from "./pages/admin/Logistics";
import { Invoicing } from "./pages/admin/Invoicing";
import { Config } from "./pages/admin/Config"; // New Admin Page

function AppContent() {
  const [route, setRoute] = useState(window.location.hash || '#inicio');
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const handleHashChange = () => setRoute(window.location.hash || '#inicio');
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const renderPage = () => {
    // Admin Routes (Protected)
    if (route.startsWith('#admin') && isAuthenticated) {
        switch (route) {
            case '#admin/inventario': return <DashboardLayout><Inventory /></DashboardLayout>;
            case '#admin/ordenes': return <DashboardLayout><Orders /></DashboardLayout>;
            case '#admin/proveedores': return <DashboardLayout><Suppliers /></DashboardLayout>;
            case '#admin/reportes': return <DashboardLayout><Reports /></DashboardLayout>;
            case '#admin/costeos': return <DashboardLayout><Costing /></DashboardLayout>;
            case '#admin/logistica': return <DashboardLayout><Logistics /></DashboardLayout>;
            case '#admin/facturacion': return <DashboardLayout><Invoicing /></DashboardLayout>;
            case '#admin/config': return <DashboardLayout><Config /></DashboardLayout>; // CMS
            default: return <DashboardLayout><Reports /></DashboardLayout>;
        }
    }

    // Public Routes
    switch (route) {
      case '#menu': return <Menu />;
      case '#franquicias': return <Franchise />;
      case '#impacto': return <Impact />;
      case '#contacto': return <Contact />;
      case '#login': return <Login />;
      case '#facturacion-publica': return <PublicInvoicing />; // New
      case '#bolsa-trabajo': return <Careers />; // New
      case '#inicio':
      default: return <Home />;
    }
  };

  const isFullScreen = route === '#login' || route.startsWith('#admin');

  return (
    <div className="min-h-screen bg-[#050505] font-sans text-[#f9fafb] selection:bg-[#FFB800] selection:text-black overflow-x-hidden">
      {!isFullScreen && <Navbar currentRoute={route} />}
      
      <main className={!isFullScreen ? "pt-0" : ""}>
        {renderPage()}
      </main>
      
      <CartDrawer />
      {!isFullScreen && <Footer />}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <AdminProvider>
            <ContentProvider>
                <AppContent />
            </ContentProvider>
        </AdminProvider>
      </CartProvider>
    </AuthProvider>
  );
}
