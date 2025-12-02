import { useState, useEffect } from "react";
import { useAdmin, Invoice } from "../../lib/admin-context";
import { 
  FileText, 
  Search, 
  MessageSquare, 
  Send, 
  MoreHorizontal, 
  Check, 
  AlertCircle, 
  RefreshCw,
  Copy
} from "lucide-react";

// --- MOCK AI FUNCTION ---
// Simulates the Gemini behavior from the original HTML
const simulateAI = async (prompt: string): Promise<string> => {
    await new Promise(r => setTimeout(r, 1500)); // Fake latency
    if (prompt.includes("correo")) {
        return `Estimado Cliente,\n\nLe informamos que su factura con ticket ${prompt.match(/ticket (\w+)/)?.[1] || '...'} ha cambiado de estado.\n\nAdjunto encontrará los archivos PDF y XML correspondientes a su compra. Agradecemos su preferencia en Maíz Urbano.\n\nAtte.\nEquipo de Finanzas`;
    }
    if (prompt.includes("analista")) {
        return "ANÁLISIS FINANCIERO RÁPIDO:\n1. Tendencia de facturación estable con incremento del 5% vs semana anterior.\n2. El ticket promedio se mantiene en $350.00 MXN.\n3. Se detectan 2 facturas pendientes por validar RFC. Se recomienda acción inmediata.";
    }
    return "Como asistente fiscal virtual, puedo confirmarte que el RFC debe coincidir exactamente con la Constancia de Situación Fiscal para evitar rechazos en el timbrado 4.0.";
};

export function Invoicing() {
  const { invoices, addInvoice, updateInvoiceStatus } = useAdmin();
  const [activeTab, setActiveTab] = useState<'solicitud' | 'consulta' | 'dashboard'>('solicitud');
  const [loading, setLoading] = useState(false);
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  
  // Form State
  const [form, setForm] = useState({ rfc: '', razon: '', ticket: '', total: '', email: '' });
  
  // Search State
  const [query, setQuery] = useState({ rfc: '', ticket: '' });
  const [searchResults, setSearchResults] = useState<Invoice[]>([]);

  // Chat State
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMsg, setChatMsg] = useState('');
  const [chatHistory, setChatHistory] = useState<{role: 'user'|'bot', text: string}[]>([
    { role: 'bot', text: 'Hola, soy tu experto en facturación SAT 4.0. ¿Dudas con algún régimen fiscal?' }
  ]);

  const handleSolicitud = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
        addInvoice({
            rfc: form.rfc,
            razonSocial: form.razon,
            ticket: form.ticket,
            total: Number(form.total),
            email: form.email,
            date: new Date().toISOString().split('T')[0],
            status: 'Pendiente'
        });
        setLoading(false);
        setForm({ rfc: '', razon: '', ticket: '', total: '', email: '' });
        alert('Solicitud registrada con éxito');
    }, 1000);
  };

  const handleSearch = () => {
    const res = invoices.filter(i => 
        (query.rfc && i.rfc.includes(query.rfc)) || 
        (query.ticket && i.ticket.includes(query.ticket))
    );
    setSearchResults(res);
  };

  const handleAIChat = async () => {
    if (!chatMsg) return;
    const userText = chatMsg;
    setChatHistory(prev => [...prev, { role: 'user', text: userText }]);
    setChatMsg('');
    
    const botText = await simulateAI(userText);
    setChatHistory(prev => [...prev, { role: 'bot', text: botText }]);
  };

  const handleAIDashboard = async () => {
      setLoading(true);
      const res = await simulateAI("analista financiero");
      setAiResponse(res);
      setLoading(false);
  };

  const generateEmailDraft = async (inv: Invoice) => {
      const draft = await simulateAI(`generar correo ticket ${inv.ticket}`);
      alert(`Borrador Copiado al Portapapeles:\n\n${draft}`);
  };

  // --- SUB-COMPONENTS ---
  
  // 1. SOLICITUD VIEW
  const SolicitudView = () => (
      <div className="max-w-2xl mx-auto">
          <div className="bg-[#0a0a0a] border border-[#FFD600]/30 rounded-2xl p-8 shadow-[0_0_30px_rgba(255,214,0,0.05)] relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#FFD600] to-transparent opacity-50"></div>
              
              <h2 className="text-2xl font-black text-white mb-6 flex items-center gap-3">
                  <FileText className="text-[#FFD600]" /> NUEVA SOLICITUD CFDI
              </h2>

              <form onSubmit={handleSolicitud} className="space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-2">
                          <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">RFC Cliente</label>
                          <input required value={form.rfc} onChange={e => setForm({...form, rfc: e.target.value})} className="w-full bg-black border border-white/10 rounded-lg p-3 text-[#FFD600] font-mono focus:border-[#FFD600] outline-none" placeholder="XAXX010101000" />
                      </div>
                      <div className="space-y-2">
                          <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Razón Social</label>
                          <input required value={form.razon} onChange={e => setForm({...form, razon: e.target.value})} className="w-full bg-black border border-white/10 rounded-lg p-3 text-white focus:border-[#FFD600] outline-none" placeholder="Nombre Completo" />
                      </div>
                  </div>

                  <div className="grid grid-cols-3 gap-6">
                      <div className="space-y-2">
                          <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">No. Ticket</label>
                          <input required value={form.ticket} onChange={e => setForm({...form, ticket: e.target.value})} className="w-full bg-black border border-white/10 rounded-lg p-3 text-white focus:border-[#FFD600] outline-none" placeholder="12345" />
                      </div>
                      <div className="space-y-2">
                          <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Monto Total</label>
                          <input required type="number" value={form.total} onChange={e => setForm({...form, total: e.target.value})} className="w-full bg-black border border-white/10 rounded-lg p-3 text-white focus:border-[#FFD600] outline-none" placeholder="0.00" />
                      </div>
                      <div className="space-y-2">
                          <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Uso CFDI</label>
                          <select className="w-full bg-black border border-white/10 rounded-lg p-3 text-white focus:border-[#FFD600] outline-none">
                              <option>G03 - Gastos Gral</option>
                              <option>P01 - Por Definir</option>
                          </select>
                      </div>
                  </div>

                  <div className="space-y-2">
                      <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Correo Electrónico</label>
                      <input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="w-full bg-black border border-white/10 rounded-lg p-3 text-white focus:border-[#FFD600] outline-none" placeholder="cliente@empresa.com" />
                  </div>

                  <div className="pt-4 flex gap-4">
                      <button type="button" className="px-6 py-3 rounded-lg border border-white/20 text-white hover:bg-white/5 font-bold text-xs uppercase tracking-widest">Auto-Fill Demo</button>
                      <button type="submit" disabled={loading} className="flex-1 bg-[#FFD600] text-black font-black text-sm uppercase tracking-widest py-3 rounded-lg hover:bg-white transition-colors disabled:opacity-50">
                          {loading ? 'Procesando...' : 'Registrar Factura'}
                      </button>
                  </div>
              </form>
          </div>
      </div>
  );

  // 2. DASHBOARD VIEW
  const DashboardView = () => {
      const total = invoices.reduce((acc, curr) => acc + curr.total, 0);
      const pending = invoices.filter(i => i.status === 'Pendiente').length;

      return (
          <div className="space-y-8">
              <div className="grid grid-cols-3 gap-6">
                  <div className="bg-[#0a0a0a] border border-white/10 p-6 rounded-xl text-center">
                      <h3 className="text-4xl font-black text-white mb-1">{invoices.length}</h3>
                      <p className="text-xs text-gray-500 uppercase tracking-widest">Solicitudes</p>
                  </div>
                  <div className="bg-[#0a0a0a] border border-[#FFD600]/50 p-6 rounded-xl text-center relative overflow-hidden">
                      <div className="absolute inset-0 bg-[#FFD600]/5"></div>
                      <h3 className="text-4xl font-black text-[#FFD600] mb-1 relative z-10">${total.toLocaleString()}</h3>
                      <p className="text-xs text-[#FFD600]/70 uppercase tracking-widest relative z-10">Monto Facturado</p>
                  </div>
                  <div className="bg-[#0a0a0a] border border-white/10 p-6 rounded-xl text-center">
                      <h3 className="text-4xl font-black text-white mb-1">{pending}</h3>
                      <p className="text-xs text-gray-500 uppercase tracking-widest">Pendientes</p>
                  </div>
              </div>

              <div className="bg-[#0a0a0a] border border-white/10 rounded-xl overflow-hidden">
                  <div className="p-6 border-b border-white/10 flex justify-between items-center">
                      <h3 className="font-bold text-white">Log de Transacciones</h3>
                      <button onClick={handleAIDashboard} className="text-[#FFD600] text-xs font-bold border border-[#FFD600] px-3 py-1 rounded hover:bg-[#FFD600] hover:text-black transition-colors">
                          {loading ? 'Analizando...' : 'AI ANALYSIS'}
                      </button>
                  </div>
                  
                  {aiResponse && (
                      <div className="bg-[#FFD600]/10 p-4 border-b border-[#FFD600]/20 text-sm text-[#FFD600] font-mono whitespace-pre-wrap animate-in fade-in">
                          {aiResponse}
                      </div>
                  )}

                  <table className="w-full text-left text-sm">
                      <thead className="bg-white/5 text-gray-400 font-bold uppercase text-xs">
                          <tr>
                              <th className="p-4">ID</th>
                              <th className="p-4">RFC</th>
                              <th className="p-4">Ticket</th>
                              <th className="p-4 text-right">Total</th>
                              <th className="p-4 text-center">Status</th>
                              <th className="p-4 text-right">Acciones</th>
                          </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                          {invoices.map(inv => (
                              <tr key={inv.id} className="hover:bg-white/5 text-gray-300">
                                  <td className="p-4 font-mono text-xs text-gray-500">{inv.id}</td>
                                  <td className="p-4 font-mono text-[#FFD600]">{inv.rfc}</td>
                                  <td className="p-4">{inv.ticket}</td>
                                  <td className="p-4 text-right font-bold">${inv.total}</td>
                                  <td className="p-4 text-center">
                                      <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${
                                          inv.status === 'Facturada' ? 'bg-green-900/30 text-green-500' : 
                                          inv.status === 'Revisar' ? 'bg-red-900/30 text-red-500' : 
                                          'bg-yellow-900/30 text-yellow-500'
                                      }`}>{inv.status}</span>
                                  </td>
                                  <td className="p-4 text-right flex justify-end gap-2">
                                      {inv.status !== 'Facturada' && (
                                          <button onClick={() => updateInvoiceStatus(inv.id, 'Facturada')} className="p-1 hover:text-[#FFD600]" title="Marcar Facturada"><Check size={16} /></button>
                                      )}
                                      <button onClick={() => generateEmailDraft(inv)} className="p-1 hover:text-[#FFD600]" title="Redactar Correo"><MessageSquare size={16} /></button>
                                  </td>
                              </tr>
                          ))}
                      </tbody>
                  </table>
              </div>
          </div>
      );
  };

  return (
    <div className="space-y-8 relative z-10 pb-20">
        {/* Header & Tabs */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
                <h2 className="text-3xl font-black text-white tracking-tight flex items-center gap-2">
                    Portal de Facturación <span className="text-[10px] bg-[#FFD600] text-black px-2 py-1 rounded font-bold tracking-normal align-middle">NEON EDITION</span>
                </h2>
                <p className="text-gray-500 mt-1 font-mono text-xs">SYSTEM.STATUS: ONLINE | MODE: PERMISIVE</p>
            </div>
            
            <div className="flex bg-[#111] p-1 rounded-lg border border-white/10">
                {(['solicitud', 'consulta', 'dashboard'] as const).map((tab) => (
                    <button 
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-6 py-2 rounded-md text-xs font-bold uppercase tracking-widest transition-all ${activeTab === tab ? 'bg-[#FFD600] text-black shadow-[0_0_15px_#FFD600]' : 'text-gray-400 hover:text-white'}`}
                    >
                        {tab}
                    </button>
                ))}
            </div>
        </div>

        {/* Main Content Area */}
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            {activeTab === 'solicitud' && <SolicitudView />}
            {activeTab === 'dashboard' && <DashboardView />}
            {activeTab === 'consulta' && (
                <div className="max-w-md mx-auto text-center py-12 bg-[#0a0a0a] border border-white/5 rounded-2xl">
                    <Search size={48} className="mx-auto text-gray-600 mb-4" />
                    <h3 className="text-xl font-bold text-white mb-4">Consulta de Estatus</h3>
                    <div className="px-8 space-y-4">
                        <input placeholder="RFC" className="w-full bg-black border border-white/10 rounded p-3 text-white" />
                        <input placeholder="Ticket" className="w-full bg-black border border-white/10 rounded p-3 text-white" />
                        <button className="w-full bg-[#333] text-white font-bold py-3 rounded hover:bg-[#FFD600] hover:text-black transition-colors">BUSCAR</button>
                    </div>
                </div>
            )}
        </div>

        {/* Floating AI Chat Widget */}
        <div className="fixed bottom-8 right-8 z-50 flex flex-col items-end">
            {chatOpen && (
                <div className="bg-[#0a0a0a] border border-[#FFD600] rounded-xl w-80 h-96 mb-4 shadow-[0_10px_40px_rgba(0,0,0,0.8)] flex flex-col overflow-hidden animate-in slide-in-from-bottom-10">
                    <div className="bg-[#FFD600] p-3 flex justify-between items-center">
                        <span className="text-black font-bold text-xs flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div> ASISTENTE FISCAL IA
                        </span>
                        <button onClick={() => setChatOpen(false)} className="text-black hover:opacity-50"><X size={16} /></button>
                    </div>
                    <div className="flex-1 p-4 overflow-y-auto space-y-3">
                        {chatHistory.map((msg, i) => (
                            <div key={i} className={`p-2 rounded-lg text-xs max-w-[85%] ${msg.role === 'user' ? 'bg-[#222] text-white ml-auto' : 'bg-[#FFD600]/10 text-[#FFD600] border border-[#FFD600]/20'}`}>
                                {msg.text}
                            </div>
                        ))}
                    </div>
                    <div className="p-3 border-t border-white/10 flex gap-2 bg-black">
                        <input 
                            value={chatMsg}
                            onChange={e => setChatMsg(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && handleAIChat()}
                            className="flex-1 bg-[#111] border border-white/10 rounded px-3 py-2 text-xs text-white outline-none focus:border-[#FFD600]"
                            placeholder="Escribe tu duda..."
                        />
                        <button onClick={handleAIChat} className="text-[#FFD600] hover:text-white"><Send size={16} /></button>
                    </div>
                </div>
            )}
            <button 
                onClick={() => setChatOpen(!chatOpen)}
                className="w-14 h-14 bg-[#FFD600] rounded-full flex items-center justify-center text-black shadow-[0_0_20px_rgba(255,214,0,0.4)] hover:scale-110 transition-transform border-2 border-black"
            >
                <MessageSquare size={24} fill="black" />
            </button>
        </div>
    </div>
  );
}
