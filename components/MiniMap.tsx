import React, { useEffect, useRef, useState, useCallback } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin, Navigation, ExternalLink, Layers, LocateFixed, ZoomIn, ZoomOut } from 'lucide-react';

interface MiniMapProps {
  lat: number;
  lng: number;
  title: string;
  locationName: string;
  zoom?: number;
  className?: string;
  height?: string;
  showControls?: boolean;
}

export const MiniMap: React.FC<MiniMapProps> = ({
  lat,
  lng,
  title,
  locationName,
  zoom = 16,
  className = '',
  height = 'h-60',
  showControls = true
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const currentTileLayerRef = useRef<L.TileLayer | null>(null);
  const [mapType, setMapType] = useState<'roadmap' | 'satellite'>('roadmap');

  // Helper to switch tile layers
  const setTileLayer = useCallback((map: L.Map, type: 'roadmap' | 'satellite') => {
    if (currentTileLayerRef.current) {
      map.removeLayer(currentTileLayerRef.current);
    }

    let tileUrl = '';
    let maxZoom = 20;

    if (type === 'satellite') {
      // Google Maps Satellite Hybrid (Satellite + Roads & Labels)
      tileUrl = 'https://mt{s}.google.com/vt/lyrs=y&x={x}&y={y}&z={z}';
      maxZoom = 20;
    } else {
      // Google Maps Standard Roadmap (Yellow highways, blue water, clear Vietnamese street names)
      tileUrl = 'https://mt{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}';
      maxZoom = 20;
    }

    const tileLayer = L.tileLayer(tileUrl, {
      maxZoom,
      subdomains: ['0', '1', '2', '3'],
      attribution: '© Google Maps'
    }).addTo(map);

    currentTileLayerRef.current = tileLayer;
  }, []);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Clean up any existing map instance on this container
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    try {
      const map = L.map(mapContainerRef.current, {
        center: [lat, lng],
        zoom: zoom,
        zoomControl: false,
        attributionControl: false,
        scrollWheelZoom: true,
        dragging: true,
        touchZoom: true
      });

      mapInstanceRef.current = map;

      // Apply initial tile layer (Google Maps standard)
      setTileLayer(map, mapType);

      // Iconic Google Maps Red Marker Pin
      const googlePinIcon = L.divIcon({
        className: 'google-maps-custom-marker',
        html: `
          <div style="position: relative; width: 36px; height: 44px; display: flex; flex-direction: column; align-items: center; justify-content: center; cursor: pointer; filter: drop-shadow(0 4px 6px rgba(0,0,0,0.5));">
            <!-- Pulsing radar ring on ground -->
            <div style="position: absolute; bottom: 2px; width: 22px; height: 10px; border-radius: 50%; background-color: rgba(234, 67, 53, 0.4); animation: ping 1.8s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
            
            <!-- SVG Google Maps Pin -->
            <svg width="34" height="42" viewBox="0 0 384 512" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M172.268 501.67C26.97 291.031 0 269.413 0 192 0 85.961 85.961 0 192 0s192 85.961 192 192c0 77.413-26.97 99.031-172.268 309.67-9.535 13.774-29.93 13.773-39.464 0z" fill="#EA4335"/>
              <path d="M192 272c44.183 0 80-35.817 80-80s-35.817-80-80-80-80 35.817-80 80 35.817 80 80 80z" fill="#FFFFFF"/>
              <circle cx="192" cy="192" r="42" fill="#B31412"/>
            </svg>
          </div>
        `,
        iconSize: [36, 44],
        iconAnchor: [18, 42],
        popupAnchor: [0, -42]
      });

      const marker = L.marker([lat, lng], { icon: googlePinIcon }).addTo(map);

      // Google Maps style popup card
      marker.bindPopup(`
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 13px; color: #202124; min-width: 200px; padding: 2px;">
          <div style="font-size: 11px; font-weight: 700; color: #EA4335; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 2px; display: flex; align-items: center; gap: 4px;">
            <span>📍 Vị trí thực địa</span>
          </div>
          <strong style="color: #1a73e8; display: block; font-size: 14px; margin-bottom: 4px; line-height: 1.3;">${title}</strong>
          <span style="color: #3c4043; font-size: 12px; display: block; margin-bottom: 6px;">${locationName}</span>
          <div style="background: #f1f3f4; padding: 4px 8px; border-radius: 6px; font-size: 11px; color: #5f6368; font-family: monospace;">
            Tọa độ: ${lat.toFixed(5)}°N, ${lng.toFixed(5)}°E
          </div>
        </div>
      `, {
        closeButton: true,
        autoPan: true
      });

      // Periodic invalidateSize to guarantee tiles render crystal clear immediately
      const timer1 = setTimeout(() => map.invalidateSize(), 50);
      const timer2 = setTimeout(() => map.invalidateSize(), 250);
      const timer3 = setTimeout(() => map.invalidateSize(), 600);

      // ResizeObserver to automatically adjust on any DOM layout changes
      const resizeObserver = new ResizeObserver(() => {
        if (mapInstanceRef.current) {
          mapInstanceRef.current.invalidateSize();
        }
      });
      resizeObserver.observe(mapContainerRef.current);

      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
        clearTimeout(timer3);
        resizeObserver.disconnect();
        if (mapInstanceRef.current) {
          mapInstanceRef.current.remove();
          mapInstanceRef.current = null;
        }
      };
    } catch (err) {
      console.warn('MiniMap init warning:', err);
    }
  }, [lat, lng, zoom, title, locationName, setTileLayer]);

  // Handle tile switch dynamically without destroying map instance
  useEffect(() => {
    if (mapInstanceRef.current) {
      setTileLayer(mapInstanceRef.current, mapType);
    }
  }, [mapType, setTileLayer]);

  const handleRecenter = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView([lat, lng], zoom, { animate: true });
    }
  };

  const handleZoomIn = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.zoomIn();
    }
  };

  const handleZoomOut = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.zoomOut();
    }
  };

  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;

  return (
    <div className={`relative rounded-xl overflow-hidden border-2 border-emerald-500/40 bg-zinc-950 shadow-2xl ${className}`}>
      {/* Google Maps Header Bar */}
      <div className="bg-zinc-900/95 border-b border-zinc-800 px-3.5 py-2 flex items-center justify-between text-xs backdrop-blur-md z-10 relative">
        <div className="flex items-center gap-2 font-semibold text-white">
          {/* Authentic Google Maps Badge */}
          <div className="flex items-center gap-1 bg-zinc-950 px-2 py-0.5 rounded-md border border-zinc-700/80 shadow-inner">
            <span className="text-[#4285F4] font-black text-xs">G</span>
            <span className="text-[#EA4335] font-black text-xs">o</span>
            <span className="text-[#FBBC05] font-black text-xs">o</span>
            <span className="text-[#4285F4] font-black text-xs">g</span>
            <span className="text-[#34A853] font-black text-xs">l</span>
            <span className="text-[#EA4335] font-black text-xs">e</span>
            <span className="text-zinc-200 font-bold ml-1 text-[11px]">Maps</span>
          </div>
          <span className="text-emerald-400 font-medium truncate max-w-[140px] sm:max-w-xs">{title}</span>
        </div>

        {/* Action buttons in header */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Map Layer Switcher: Roadmap vs Satellite */}
          <div className="flex items-center bg-zinc-950 rounded-lg p-0.5 border border-zinc-800 text-[11px]">
            <button
              type="button"
              onClick={() => setMapType('roadmap')}
              className={`px-2 py-0.5 rounded-md font-medium transition-colors ${
                mapType === 'roadmap'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-zinc-400 hover:text-white'
              }`}
              title="Bản đồ đường phố Google Maps"
            >
              Đường phố
            </button>
            <button
              type="button"
              onClick={() => setMapType('satellite')}
              className={`px-2 py-0.5 rounded-md font-medium transition-colors ${
                mapType === 'satellite'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-zinc-400 hover:text-white'
              }`}
              title="Ảnh vệ tinh Google Maps"
            >
              Vệ tinh
            </button>
          </div>

          {/* Direct link to Google Maps */}
          <a
            href={googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[11px] font-medium text-white hover:text-white bg-blue-600 hover:bg-blue-500 px-2.5 py-1 rounded-lg transition-colors flex items-center gap-1 shadow"
            title="Mở trực tiếp trên ứng dụng Google Maps"
          >
            <span>Mở Maps</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>

      {/* Map Canvas Container */}
      <div className="relative w-full">
        <div ref={mapContainerRef} className={`w-full ${height} z-0 bg-zinc-900`} />

        {/* Custom Google Maps Style Zoom & Navigation Floating Controls */}
        {showControls && (
          <div className="absolute top-3 right-3 z-[400] flex flex-col gap-1.5 shadow-lg">
            <button
              type="button"
              onClick={handleRecenter}
              className="w-8 h-8 rounded-lg bg-white/95 hover:bg-white text-zinc-800 hover:text-blue-600 flex items-center justify-center shadow-md transition-colors border border-zinc-200"
              title="Định vị lại trung tâm tọa độ"
            >
              <LocateFixed className="w-4 h-4 text-zinc-700 hover:text-blue-600" />
            </button>
            <div className="flex flex-col rounded-lg overflow-hidden bg-white/95 border border-zinc-200 shadow-md">
              <button
                type="button"
                onClick={handleZoomIn}
                className="w-8 h-8 hover:bg-zinc-100 text-zinc-800 flex items-center justify-center transition-colors border-b border-zinc-200"
                title="Phóng to bản đồ"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={handleZoomOut}
                className="w-8 h-8 hover:bg-zinc-100 text-zinc-800 flex items-center justify-center transition-colors"
                title="Thu nhỏ bản đồ"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Google Maps Watermark in bottom-left */}
        <div className="absolute bottom-2 left-2 z-[400] pointer-events-none select-none flex items-center gap-1 bg-white/90 backdrop-blur-sm px-2 py-0.5 rounded shadow text-[10px] font-sans font-bold border border-zinc-200/80">
          <span className="text-[#4285F4]">G</span>
          <span className="text-[#EA4335]">o</span>
          <span className="text-[#FBBC05]">o</span>
          <span className="text-[#4285F4]">g</span>
          <span className="text-[#34A853]">l</span>
          <span className="text-[#EA4335]">e</span>
        </div>

        {/* Bottom Badge with real location */}
        <div className="absolute bottom-2 right-2 z-[400] pointer-events-none bg-zinc-950/85 backdrop-blur-md border border-zinc-800 px-2.5 py-1 rounded-md text-[11px] text-zinc-200 flex items-center gap-1.5 shadow max-w-[70%] truncate">
          <Navigation className="w-3 h-3 text-emerald-400 shrink-0" />
          <span className="truncate">{locationName}</span>
        </div>
      </div>
    </div>
  );
};

export default MiniMap;
