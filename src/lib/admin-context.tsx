import React, { createContext, useContext, useState, ReactNode } from 'react';

// --- TIPOS DE DATOS ---
export interface Ingredient {
  id: string;
  name: string;
  unit: string;
  costPerUnit: number;
  supplierId: string;
  stock: number;
}

export interface Supplier {
  id: string;
  name: string;
  contact: string;
  phone: string;
  email: string;
  rating: number; // 1-5
  category: string;
}

export interface Order {
  id: string;
  supplierName: string;
  date: string;
  status: 'Pendiente' | 'En Ruta' | 'Entregado';
  total: number;
  items: number;
}

export interface SaleRecord {
  id: string;
  date: string;
  product: string;
  amount: number;
  quantity: number;
}

// --- ESTADO INICIAL (MOCK DB) ---
const INITIAL_INVENTORY: Ingredient[] = [
  { id: 'ING-001', name: 'Maíz Criollo Blanco', unit: 'kg', costPerUnit: 15.50, supplierId: 'SUP-001', stock: 2500 },
  { id: 'ING-002', name: 'Mayonesa Base', unit: 'lt', costPerUnit: 45.00, supplierId: 'SUP-002', stock: 450 },
  { id: 'ING-003', name: 'Queso Cotija', unit: 'kg', costPerUnit: 120.00, supplierId: 'SUP-001', stock: 120 },
  { id: 'ING-004', name: 'Chile Chipotle Polvo', unit: 'kg', costPerUnit: 85.00, supplierId: 'SUP-003', stock: 15 },
  { id: 'ING-005', name: 'Gas LP', unit: 'lt', costPerUnit: 12.50, supplierId: 'SUP-004', stock: 300 },
];

const INITIAL_SUPPLIERS: Supplier[] = [
  { id: 'SUP-001', name: 'Agropecuaria Tlaxcala', contact: 'Don José', phone: '246-123-4567', email: 'ventas@agrotlax.mx', rating: 5, category: 'Materia Prima' },
  { id: 'SUP-002', name: 'Distribuidora Salsas MX', contact: 'Ana Ruiz', phone: '55-987-6543', email: 'pedidos@salsasmx.com', rating: 4, category: 'Abarrotes' },
  { id: 'SUP-003', name: 'Especias El Molino', contact: 'Carlos M.', phone: '55-111-2222', email: 'contacto@elmolino.mx', rating: 5, category: 'Especias' },
];

const INITIAL_ORDERS: Order[] = [
  { id: 'ORD-2025-001', supplierName: 'Agropecuaria Tlaxcala', date: '2025-10-01', status: 'En Ruta', total: 15500, items: 1000 },
  { id: 'ORD-2025-002', supplierName: 'Distribuidora Salsas MX', date: '2025-10-02', status: 'Pendiente', total: 4500, items: 100 },
];

const INITIAL_SALES: SaleRecord[] = [
  { id: 'VTA-001', date: '2025-10-01', product: 'Elote Montado', amount: 75, quantity: 1 },
  { id: 'VTA-002', date: '2025-10-01', product: 'Esquites Tradicionales', amount: 68, quantity: 1 },
  { id: 'VTA-003', date: '2025-10-01', product: 'Elote Montado', amount: 75, quantity: 1 },
  { id: 'VTA-004', date: '2025-10-02', product: 'Doriesquites', amount: 85, quantity: 1 },
];

// --- CONTEXTO ---
interface AdminContextType {
  inventory: Ingredient[];
  suppliers: Supplier[];
  orders: Order[];
  sales: SaleRecord[];
  invoices: Invoice[];
  addSupplier: (s: Omit<Supplier, 'id'>) => void;
  addOrder: (o: Omit<Order, 'id'>) => void;
  addInvoice: (i: Omit<Invoice, 'id'>) => void;
  updateInvoiceStatus: (id: string, status: Invoice['status']) => void;
  calculateCost: (ingredients: {id: string, qty: number}[], margin: number) => { cost: number, price: number, profit: number };
}

export interface Invoice {
  id: string;
  rfc: string;
  razonSocial: string;
  ticket: string;
  total: number;
  date: string;
  status: 'Pendiente' | 'Facturada' | 'Revisar';
  email: string;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export function AdminProvider({ children }: { children: ReactNode }) {
  const [inventory, setInventory] = useState<Ingredient[]>(INITIAL_INVENTORY);
  const [suppliers, setSuppliers] = useState<Supplier[]>(INITIAL_SUPPLIERS);
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [sales, setSales] = useState<SaleRecord[]>(INITIAL_SALES);
  const [invoices, setInvoices] = useState<Invoice[]>([
    { id: 'FAC-001', rfc: 'XAXX010101000', razonSocial: 'Publico General', ticket: '12345', total: 500.00, date: '2025-10-01', status: 'Pendiente', email: 'cliente@email.com' }
  ]);

  // Actions
  const addSupplier = (s: Omit<Supplier, 'id'>) => {
    const newSupplier = { ...s, id: `SUP-${Math.floor(Math.random() * 1000)}` };
    setSuppliers([...suppliers, newSupplier]);
  };

  const addOrder = (o: Omit<Order, 'id'>) => {
    const newOrder = { ...o, id: `ORD-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000)}` };
    setOrders([newOrder, ...orders]);
  };

  const addInvoice = (i: Omit<Invoice, 'id'>) => {
    const newInvoice = { ...i, id: `FAC-${Date.now().toString().slice(-6)}` };
    setInvoices([newInvoice, ...invoices]);
  };

  const updateInvoiceStatus = (id: string, status: Invoice['status']) => {
    setInvoices(invoices.map(inv => inv.id === id ? { ...inv, status } : inv));
  };

  // Logic: Costing Calculator
  const calculateCost = (recipeIngredients: {id: string, qty: number}[], targetMargin: number) => {
    let totalCost = 0;
    recipeIngredients.forEach(item => {
      const ingredient = inventory.find(inv => inv.id === item.id);
      if (ingredient) {
        totalCost += ingredient.costPerUnit * item.qty;
      }
    });

    // Price = Cost / (1 - Margin%)
    // Margin input is usually 0-100 (e.g., 65 for 65%)
    const marginDecimal = targetMargin / 100;
    const suggestedPrice = totalCost / (1 - marginDecimal);
    const profit = suggestedPrice - totalCost;

    return { cost: totalCost, price: suggestedPrice, profit };
  };

  return (
    <AdminContext.Provider value={{ inventory, suppliers, orders, sales, invoices, addSupplier, addOrder, addInvoice, updateInvoiceStatus, calculateCost }}>
      {children}
    </AdminContext.Provider>
  );
}

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) throw new Error('useAdmin must be used within AdminProvider');
  return context;
};
