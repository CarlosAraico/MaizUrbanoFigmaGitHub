import { useState, useEffect, useRef } from "react";
import { Save, Trash2, Navigation, MapPin, Search, Crosshair } from "lucide-react";

// --- CONFIGURACIÓN ---
// Usamos tiles de CartoDB Dark Matter para el look "Corn Revolution" GRATIS
const TILE_LAYER = "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png";
const TILE_ATTR = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>';

// --- TYPES ---
interface LogPoint {
    id: string;
    name: string;
    address: string;
    lat: number;
    lng: number;
}

export function Logistics() {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);
  const markersLayerRef = useRef<any>(null);
  const routeLayerRef = useRef<any>(null);

  const [isMapReady, setIsMapReady] = useState(false);
  const [points, setPoints] = useState<LogPoint[]>([
      { id: '1', name: 'CEDIS Central', address: 'Central de Abastos', lat: 19.3745, lng: -99.0883 },
      { id: '2', name: 'Sucursal Roma', address: 'Roma Norte', lat: 19.4194, lng: -99.1626 }
  ]);
  const [tempPoint, setTempPoint] = useState<LogPoint | null>(null);
  const [newPointName, setNewPointName] = useState("");

  // --- 1. CARGA DEFENSIVA DE LEAFLET (CDN) ---
  // Esto evita el 100% de errores de compilación de Vite/Webpack
  useEffect(() => {
    const loadLeaflet = async () => {
        if (document.getElementById('leaflet-css')) return initMap(); // Ya cargado

        // Inyectar CSS
        const link = document.createElement('link');
        link.id = 'leaflet-css';
        link.rel = 'stylesheet';
        link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        document.head.appendChild(link);

        // Inyectar JS
        const script = document.createElement('script');
        script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
        script.async = true;
        script.onload = () => initMap();
        document.body.appendChild(script);
    };

    loadLeaflet();
  }, []);

  // --- 2. INICIALIZAR MAPA ---
  const initMap = () => {
      if (!mapContainerRef.current || mapInstance.current) return;
      
      // @ts-ignore - L es global tras cargar el script
      const L = window.L;
      
      const map = L.map(mapContainerRef.current).setView([19.4326, -99.1332], 13);

      // Capa Oscura (Gratis)
      L.tileLayer(TILE_LAYER, {
          attribution: TILE_ATTR,
          subdomains: 'abcd',
          maxZoom: 19
      }).addTo(map);

      // Capas para marcadores y rutas
      markersLayerRef.current = L.layerGroup().addTo(map);
      routeLayerRef.current = L.layerGroup().addTo(map);

      mapInstance.current = map;
      setIsMapReady(true);

      // Click para agregar
      map.on('click', (e: any) => {
          const { lat, lng } = e.latlng;
          setTempPoint({
              id: 'temp',
              name: 'Nuevo Destino',
              address: `${lat.toFixed(4)}, ${lng.toFixed(4)}`,
              lat, lng
          });
      });
  };

  // --- 3. RENDERIZADO REACTIVO ---
  useEffect(() => {
      if (!isMapReady || !mapInstance.current) return;
      
      // @ts-ignore
      const L = window.L;
      const layerGroup = markersLayerRef.current;
      layerGroup.clearLayers(); // Limpiar marcadores previos

      // ICONOS PERSONALIZADOS
      const goldIcon = L.divIcon({
          className: 'custom-div-icon',
          html: `<div style="background-color:#FFB800;width:12px;height:12px;border-radius:50%;border:2px solid white;box-shadow:0 0 10px #FFB800;"></div>`,
          iconSize: [12, 12],
          iconAnchor: [6, 6]
      });

      const blueIcon = L.divIcon({
        className: 'custom-div-icon',
        html: `<div style="background-color:#3B82F6;width:12px;height:12px;border-radius:50%;border:2px solid white;box-shadow:0 0 10px #3B82F6;"></div>`,
        iconSize: [12, 12],
        iconAnchor: [6, 6]
      });

      // DIBUJAR PUNTOS GUARDADOS
      points.forEach(p => {
          const marker = L.marker([p.lat, p.lng], { icon: goldIcon })
            .bindPopup(`
                <div style="color:black; font-family:sans-serif;">
                    <div style="font-weight:bold; margin-bottom:4px;">${p.name}</div>
                    <div style="font-size:12px; color:#666; margin-bottom:8px;">${p.address}</div>
                    <a href="https://waze.com/ul?ll=${p.lat},${p.lng}&navigate=yes" target="_blank" 
                       style="display:inline-block; background:#33ccff; color:white; text-decoration:none; padding:4px 8px; border-radius:4px; font-size:11px; font-weight:bold;">
                       🚗 Ir con Waze
                    </a>
                </div>
            `);
          layerGroup.addLayer(marker);
      });

      // DIBUJAR PUNTO TEMPORAL
      if (tempPoint) {
          const marker = L.marker([tempPoint.lat, tempPoint.lng], { icon: blueIcon })
            .bindPopup("Guardar este punto...")
            .openPopup();
          layerGroup.addLayer(marker);
      }

      // DIBUJAR RUTA (Línea recta simple por ahora, OSRM es posible gratis)
      if (points.length > 1) {
        // @ts-ignore
        const latlngs = points.map(p => [p.lat, p.lng]);
        // @ts-ignore
        if (routeLayerRef.current) routeLayerRef.current.clearLayers();
        // @ts-ignore
        L.polyline(latlngs, { color: '#FFB800', weight: 3, opacity: 0.6, dashArray: '10, 10' }).addTo(routeLayerRef.current);
      }

  }, [points, tempPoint, isMapReady]);

  // --- ACTIONS ---
  const savePoint = () => {
      if (!tempPoint || !newPointName) return;
      setPoints([...points, { ...tempPoint, id: Date.now().toString(), name: newPointName }]);
      setTempPoint(null);
      setNewPointName("");
  };

  const handleLocate = () => {
      if(navigator.geolocation && mapInstance.current) {
          navigator.geolocation.getCurrentPosition(pos => {
              mapInstance.current.setView([pos.coords.latitude, pos.coords.longitude], 15);
          });
      }
  }

  return (
    <div className="h-[calc(100vh-100px)] flex flex-col gap-4">
        
        {/* HEADER */}
        <div className="flex justify-between items-end px-1">
            <div>
                <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
                    Logística <span className="text-[#FFB800]">Open</span>Map
                </h2>
                <p className="text-gray-500 text-xs">Motor Gratuito • Tiles CartoDB • Waze Integration</p>
            </div>
            <div className="flex gap-2">
                <div className="bg-green-900/30 text-green-400 border border-green-500/30 px-3 py-1 rounded text-xs font-bold flex items-center">
                    GRATIS (ILIMITADO)
                </div>
            </div>
        </div>

        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 overflow-hidden">
            
            {/* PANEL LATERAL */}
            <div className="lg:col-span-3 bg-[#0a0a0a] border border-white/10 rounded-2xl flex flex-col overflow-hidden">
                <div className="p-4 border-b border-white/10 bg-[#111]">
                    <h3 className="text-[#FFB800] font-bold text-xs uppercase mb-2">Puntos de Entrega</h3>
                    <div className="text-xs text-gray-500 mb-4">Gestiona tus paradas y genera rutas.</div>
                </div>
                
                <div className="flex-1 overflow-y-auto p-4 space-y-2">
                    {points.map((p, idx) => (
                        <div key={p.id} className="group bg-white/5 p-3 rounded border border-white/5 hover:border-[#FFB800]/50 transition-all">
                            <div className="flex justify-between items-start mb-2">
                                <div className="flex gap-2">
                                    <span className="bg-[#FFB800] text-black text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full shrink-0">{idx + 1}</span>
                                    <div>
                                        <div className="text-white text-sm font-bold leading-none mb-1">{p.name}</div>
                                        <div className="text-gray-500 text-[10px]">{p.address}</div>
                                    </div>
                                </div>
                                <button onClick={() => setPoints(points.filter(x => x.id !== p.id))} className="text-gray-600 hover:text-red-500"><Trash2 size={14}/></button>
                            </div>
                            
                            {/* BOTÓN WAZE INTEGRADO */}
                            <a 
                                href={`https://waze.com/ul?ll=${p.lat},${p.lng}&navigate=yes`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-center gap-2 w-full bg-[#33ccff]/10 text-[#33ccff] hover:bg-[#33ccff] hover:text-black border border-[#33ccff]/30 py-1.5 rounded text-xs font-bold transition-colors"
                            >
                                <Navigation size={12} /> Navegar con Waze
                            </a>
                        </div>
                    ))}
                </div>
            </div>

            {/* MAPA LEAFLET */}
            <div className="lg:col-span-9 relative rounded-2xl border border-white/10 bg-[#151515] overflow-hidden">
                
                {/* POPUP GUARDAR */}
                {tempPoint && (
                    <div className="absolute top-4 left-4 z-[1000] bg-[#111] border border-[#FFB800] p-4 rounded-xl shadow-2xl w-64 animate-in fade-in slide-in-from-top-2">
                        <h3 className="text-white font-bold text-sm mb-2">Nuevo Punto</h3>
                        <div className="text-xs text-gray-400 mb-3">{tempPoint.address}</div>
                        <input 
                            autoFocus
                            className="w-full bg-black border border-white/20 text-white text-sm rounded p-2 mb-2 outline-none focus:border-[#FFB800]" 
                            placeholder="Nombre del lugar..."
                            value={newPointName}
                            onChange={e => setNewPointName(e.target.value)}
                        />
                        <div className="flex gap-2">
                            <button onClick={savePoint} className="flex-1 bg-[#FFB800] text-black text-xs font-bold py-2 rounded hover:bg-white">Guardar</button>
                            <button onClick={() => setTempPoint(null)} className="flex-1 bg-zinc-800 text-white text-xs font-bold py-2 rounded hover:bg-zinc-700">Cancelar</button>
                        </div>
                    </div>
                )}

                {/* BOTÓN MI UBICACIÓN */}
                <button 
                    onClick={handleLocate}
                    className="absolute bottom-8 right-8 z-[1000] bg-white text-black p-3 rounded-full shadow-xl hover:scale-110 transition-transform"
                >
                    <Crosshair size={24} />
                </button>

                {/* CONTENEDOR MAPA */}
                <div ref={mapContainerRef} className="w-full h-full bg-[#151515] relative z-0" />
                
                {!isMapReady && (
                    <div className="absolute inset-0 flex items-center justify-center text-gray-500 bg-[#151515] z-10">
                        Cargando Motor de Mapas...
                    </div>
                )}
            </div>
        </div>
    </div>
  );
}
