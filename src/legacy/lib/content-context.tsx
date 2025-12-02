import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface Promo {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  type: 'main' | 'news';
}

export interface SiteConfig {
  brand: {
    name: string;
    logoUrl: string;
    heroTitle: string;
    heroSubtitle: string;
  };
  links: {
    uberEats: string;
    googleMaps: string;
    instagram: string;
  };
  promotions: Promo[];
}

const INITIAL_CONFIG: SiteConfig = {
  brand: {
    name: "MAÍZ URBANO",
    logoUrl: "figma:asset/977616d74818f53990cc4e902fb699936122e684.png",
    heroTitle: "CORN REVOLUTION",
    heroSubtitle: "Elotes y Esquites de Autor | Recetas Ancestrales, Estilo Urbano"
  },
  links: {
    uberEats: "https://www.ubereats.com/mx",
    googleMaps: "https://goo.gl/maps/example",
    instagram: "https://instagram.com"
  },
  promotions: [
    {
      id: '1',
      title: "Elote Hoodie: Black Edition",
      subtitle: "Maíz cacahuazintle asado al carbón, cubierto de ceniza de tortilla y mayonesa de habanero negro.",
      image: "https://images.unsplash.com/photo-1633331713723-815bc3a787dc?q=80&w=2670&auto=format&fit=crop", 
      type: 'main'
    },
    {
      id: '2',
      title: "Esquites con Tuétano",
      subtitle: "La joya de la corona. Servidos en hueso de caña horneado por 12 horas.",
      image: "https://images.unsplash.com/photo-1567125785565-3346ae94db81?q=80&w=2574&auto=format&fit=crop",
      type: 'main'
    },
    {
      id: '3',
      title: "Tostiesquites Volcánicos",
      subtitle: "Con salsa macha de hormiga chicatana.",
      image: "https://images.unsplash.com/photo-1514518373237-335e2596d62e?q=80&w=2572&auto=format&fit=crop",
      type: 'news'
    },
    {
      id: '4',
      title: "Elote Dorado (24K)",
      subtitle: "Edición limitada de aniversario.",
      image: "https://images.unsplash.com/photo-1551326844-d46d995f6df0?q=80&w=2670&auto=format&fit=crop",
      type: 'news'
    }
  ]
};

interface ContentContextType {
  config: SiteConfig;
  updateBrand: (key: keyof SiteConfig['brand'], value: string) => void;
  updateLink: (key: keyof SiteConfig['links'], value: string) => void;
  updatePromo: (id: string, field: keyof Promo, value: string) => void;
}

const ContentContext = createContext<ContentContextType | undefined>(undefined);

export function ContentProvider({ children }: { children: ReactNode }) {
  const [config, setConfig] = useState<SiteConfig>(INITIAL_CONFIG);

  const updateBrand = (key: keyof SiteConfig['brand'], value: string) => {
    setConfig(prev => ({ ...prev, brand: { ...prev.brand, [key]: value } }));
  };

  const updateLink = (key: keyof SiteConfig['links'], value: string) => {
    setConfig(prev => ({ ...prev, links: { ...prev.links, [key]: value } }));
  };

  const updatePromo = (id: string, field: keyof Promo, value: string) => {
    setConfig(prev => ({
      ...prev,
      promotions: prev.promotions.map(p => p.id === id ? { ...p, [field]: value } : p)
    }));
  };

  return (
    <ContentContext.Provider value={{ config, updateBrand, updateLink, updatePromo }}>
      {children}
    </ContentContext.Provider>
  );
}

export const useContent = () => {
  const context = useContext(ContentContext);
  if (!context) throw new Error('useContent must be used within ContentProvider');
  return context;
};
