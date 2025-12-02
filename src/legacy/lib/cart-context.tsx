import React, { createContext, useContext, useState, ReactNode } from 'react';

// Tipos de Producto basados en la ficha técnica
export type SauceProfile = 'Original' | 'Chipotle' | 'Manzano' | 'Habanero' | 'Macha';
export type BaseType = 'Elote' | 'Esquite';

export interface ProductOption {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
  type: 'Base' | 'Postre';
}

export interface CartItem {
  cartId: string;
  productId: string;
  name: string;
  baseType?: BaseType; // Solo para Elotes/Esquites
  profile?: SauceProfile; // Perfil de sabor seleccionado
  price: number;
  quantity: number;
  extras: string[]; // Chapulines, etc.
}

interface CartContextType {
  items: CartItem[];
  addToCart: (item: Omit<CartItem, 'cartId'>) => void;
  removeFromCart: (cartId: string) => void;
  updateQuantity: (cartId: string, delta: number) => void;
  cartTotal: number;
  cartCount: number;
  isCartOpen: boolean;
  toggleCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const addToCart = (newItem: Omit<CartItem, 'cartId'>) => {
    setItems(prev => {
      // Buscar si existe un item idéntico (mismo producto, base y perfil)
      const existing = prev.find(i => 
        i.productId === newItem.productId && 
        i.baseType === newItem.baseType && 
        i.profile === newItem.profile
      );

      if (existing) {
        return prev.map(i => 
          i.cartId === existing.cartId 
            ? { ...i, quantity: i.quantity + newItem.quantity } 
            : i
        );
      }

      return [...prev, { ...newItem, cartId: crypto.randomUUID() }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (cartId: string) => {
    setItems(prev => prev.filter(i => i.cartId !== cartId));
  };

  const updateQuantity = (cartId: string, delta: number) => {
    setItems(prev => prev.map(i => {
      if (i.cartId === cartId) {
        const newQty = i.quantity + delta;
        return newQty > 0 ? { ...i, quantity: newQty } : i;
      }
      return i;
    }));
  };

  const toggleCart = () => setIsCartOpen(!isCartOpen);

  const cartTotal = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const cartCount = items.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <CartContext.Provider value={{ 
      items, 
      addToCart, 
      removeFromCart, 
      updateQuantity, 
      cartTotal, 
      cartCount,
      isCartOpen,
      toggleCart 
    }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
};
