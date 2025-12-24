import React, { createContext, useContext, useMemo, useReducer } from "react";

export type CartItem = {
  id: string;
  name: string;
  price: number;
  qty: number;
};

type State = { items: CartItem[] };

type Action =
  | { type: "add"; item: Omit<CartItem, "qty">; qty?: number }
  | { type: "inc"; id: string }
  | { type: "dec"; id: string }
  | { type: "remove"; id: string }
  | { type: "clear" };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "add": {
      const qty = action.qty ?? 1;
      const found = state.items.find((x) => x.id === action.item.id);
      if (found) {
        return {
          items: state.items.map((x) => (x.id === action.item.id ? { ...x, qty: x.qty + qty } : x)),
        };
      }
      return { items: [...state.items, { ...action.item, qty }] };
    }
    case "inc":
      return { items: state.items.map((x) => (x.id === action.id ? { ...x, qty: x.qty + 1 } : x)) };
    case "dec":
      return {
        items: state.items
          .map((x) => (x.id === action.id ? { ...x, qty: Math.max(0, x.qty - 1) } : x))
          .filter((x) => x.qty > 0),
      };
    case "remove":
      return { items: state.items.filter((x) => x.id !== action.id) };
    case "clear":
      return { items: [] };
    default:
      return state;
  }
}

type CartAPI = {
  items: CartItem[];
  count: number;
  subtotal: number;
  add: (item: Omit<CartItem, "qty">, qty?: number) => void;
  inc: (id: string) => void;
  dec: (id: string) => void;
  remove: (id: string) => void;
  clear: () => void;
};

const Ctx = createContext<CartAPI | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, { items: [] });

  const api = useMemo<CartAPI>(() => {
    const subtotal = state.items.reduce((s, x) => s + x.price * x.qty, 0);
    const count = state.items.reduce((s, x) => s + x.qty, 0);

    return {
      items: state.items,
      count,
      subtotal,
      add: (item, qty) => dispatch({ type: "add", item, qty }),
      inc: (id) => dispatch({ type: "inc", id }),
      dec: (id) => dispatch({ type: "dec", id }),
      remove: (id) => dispatch({ type: "remove", id }),
      clear: () => dispatch({ type: "clear" }),
    };
  }, [state.items]);

  return <Ctx.Provider value={api}>{children}</Ctx.Provider>;
}

export function useCart() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useCart debe usarse dentro de CartProvider");
  return v;
}
