import { useState } from "react";
import { useAdmin, Ingredient } from "../../lib/admin-context";
import { Calculator, DollarSign, TrendingUp, ChefHat } from "lucide-react";

export function Costing() {
  const { inventory, calculateCost } = useAdmin();
  
  // State for recipe builder
  const [recipeName, setRecipeName] = useState("Nuevo Producto");
  const [selectedIngredients, setSelectedIngredients] = useState<{id: string, qty: number}[]>([
    { id: 'ING-001', qty: 0.2 }, // 200g maiz default
    { id: 'ING-002', qty: 0.05 }  // 50ml mayonesa default
  ]);
  const [margin, setMargin] = useState(65); // 65% margin target

  // Live Calculation
  const result = calculateCost(selectedIngredients, margin);

  const handleAddIngredient = () => {
    // Add first available ingredient not already in list, or default first
    setSelectedIngredients([...selectedIngredients, { id: inventory[0].id, qty: 0 }]);
  };

  const updateIngredient = (index: number, field: 'id' | 'qty', value: string | number) => {
    const newList = [...selectedIngredients];
    if (field === 'id') newList[index].id = value as string;
    if (field === 'qty') newList[index].qty = Number(value);
    setSelectedIngredients(newList);
  };

  const removeIngredient = (index: number) => {
    setSelectedIngredients(selectedIngredients.filter((_, i) => i !== index));
  };

  return (
    <div className="max-w-6xl mx-auto relative z-10 space-y-8">
        <div>
            <h2 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
                <Calculator className="text-[#FFB800]" size={32} /> Calculadora de Costos
            </h2>
            <p className="text-gray-500 mt-1">Ingeniería de menú y análisis de rentabilidad unitaria.</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
            {/* Left: Recipe Builder */}
            <div className="bg-[#0a0a0a] border border-white/5 rounded-3xl p-8 shadow-xl">
                <div className="mb-6">
                    <label className="text-xs font-bold text-[#FFB800] uppercase tracking-widest mb-2 block">Nombre del Producto</label>
                    <input 
                        type="text" 
                        value={recipeName}
                        onChange={(e) => setRecipeName(e.target.value)}
                        className="w-full bg-black border border-white/10 rounded-xl p-4 text-white font-bold text-lg focus:border-[#FFB800] outline-none"
                    />
                </div>

                <div className="space-y-4 mb-6">
                    <div className="flex justify-between items-end border-b border-white/10 pb-2">
                        <span className="text-white font-bold text-sm">Ingredientes (Receta)</span>
                        <button onClick={handleAddIngredient} className="text-[#FFB800] text-xs font-bold hover:underline">+ Agregar Insumo</button>
                    </div>
                    
                    {selectedIngredients.map((item, index) => (
                        <div key={index} className="flex gap-3 items-center">
                            <select 
                                value={item.id}
                                onChange={(e) => updateIngredient(index, 'id', e.target.value)}
                                className="flex-1 bg-[#111] text-white text-sm rounded-lg p-3 border border-white/10 outline-none focus:border-[#FFB800]"
                            >
                                {inventory.map(inv => (
                                    <option key={inv.id} value={inv.id}>{inv.name} (${inv.costPerUnit}/{inv.unit})</option>
                                ))}
                            </select>
                            <input 
                                type="number" 
                                value={item.qty}
                                onChange={(e) => updateIngredient(index, 'qty', e.target.value)}
                                className="w-24 bg-[#111] text-white text-sm rounded-lg p-3 border border-white/10 outline-none focus:border-[#FFB800]"
                                step="0.01"
                            />
                            <button onClick={() => removeIngredient(index)} className="text-gray-600 hover:text-red-500">x</button>
                        </div>
                    ))}
                </div>

                <div className="bg-[#111] rounded-xl p-6 border border-white/5">
                    <div className="flex justify-between items-center mb-4">
                        <label className="text-white font-bold text-sm">Margen Objetivo (%)</label>
                        <span className="text-[#FFB800] font-mono font-bold text-xl">{margin}%</span>
                    </div>
                    <input 
                        type="range" 
                        min="20" 
                        max="90" 
                        value={margin}
                        onChange={(e) => setMargin(Number(e.target.value))}
                        className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-[#FFB800]"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-2 uppercase tracking-widest">
                        <span>Min (20%)</span>
                        <span>Recomendado (65-70%)</span>
                        <span>Max (90%)</span>
                    </div>
                </div>
            </div>

            {/* Right: Results Card */}
            <div className="bg-[#0a0a0a] border border-white/5 rounded-3xl p-8 shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-[#FFB800]/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>
                
                <h3 className="text-xl font-bold text-white mb-8 relative z-10">Análisis Financiero</h3>

                <div className="grid gap-6 relative z-10">
                    <div className="bg-[#151515] p-6 rounded-2xl border-l-4 border-red-500">
                        <p className="text-gray-400 text-xs uppercase tracking-widest mb-1">Costo Total Insumos</p>
                        <div className="flex items-center gap-2">
                            <DollarSign size={24} className="text-red-500" />
                            <span className="text-3xl font-black text-white">${result.cost.toFixed(2)}</span>
                        </div>
                    </div>

                    <div className="bg-[#151515] p-6 rounded-2xl border-l-4 border-[#FFB800]">
                        <p className="text-gray-400 text-xs uppercase tracking-widest mb-1">Precio Venta Sugerido</p>
                        <div className="flex items-center gap-2">
                            <TrendingUp size={24} className="text-[#FFB800]" />
                            <span className="text-4xl font-black text-white">${result.price.toFixed(2)}</span>
                        </div>
                        <p className="text-xs text-gray-500 mt-2">Calculado para obtener {margin}% de margen bruto.</p>
                    </div>

                    <div className="bg-[#151515] p-6 rounded-2xl border-l-4 border-green-500">
                        <p className="text-gray-400 text-xs uppercase tracking-widest mb-1">Utilidad Bruta por Unidad</p>
                        <div className="flex items-center gap-2">
                            <ChefHat size={24} className="text-green-500" />
                            <span className="text-3xl font-black text-white">${result.profit.toFixed(2)}</span>
                        </div>
                    </div>
                </div>

                <button className="w-full mt-8 bg-[#FFB800] text-black font-black uppercase tracking-widest py-4 rounded-xl hover:bg-white transition-all shadow-lg">
                    Guardar en Menú
                </button>
            </div>
        </div>
    </div>
  );
}
