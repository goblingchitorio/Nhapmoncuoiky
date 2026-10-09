import React, { useState, useRef, useCallback, useEffect } from 'react';
import { BeforeAfterItem } from '../types';
import { MoveHorizontal, Sparkles, AlertOctagon, ExternalLink, MapPin, Eye, ChevronDown, ChevronUp, ArrowLeftRight, Newspaper } from 'lucide-react';
import MiniMap from './MiniMap';

interface BeforeAfterSliderProps {
  item: BeforeAfterItem;
}

const BeforeAfterSlider: React.FC<BeforeAfterSliderProps> = ({ item }) => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const [containerWidth, setContainerWidth] = useState<number>(0);
  // Default showMiniMap to true, ensuring the small map is clearly visible!
  const [showMiniMap, setShowMiniMap] = useState<boolean>(true);
  const [isReversed, setIsReversed] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'slider' | 'map'>('slider');
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.clientWidth);
      }
    };
    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const percent = Math.max(0, Math.min((x / rect.width) * 100, 100));
    setSliderPosition(percent);
  }, []);

  const handleTouchMove = (e: React.TouchEvent) => {
    handleMove(e.touches[0].clientX);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    handleMove(e.clientX);
  };

  const hasCoords = !!item.coordinates;

  // Determine current before and after images based on reverse toggle
  const currentBeforeImg = isReversed ? item.afterImg : item.beforeImg;
  const currentAfterImg = isReversed ? item.beforeImg : item.afterImg;
  const currentBeforeLabel = isReversed ? item.afterLabel : item.beforeLabel;
  const currentAfterLabel = isReversed ? item.beforeLabel : item.afterLabel;

  return (
    <div className="bg-zinc-900/90 rounded-2xl border border-zinc-800 p-5 md:p-6 shadow-xl backdrop-blur-md flex flex-col justify-between">
      {/* Header with Title and Controls */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 gap-2">
          <div>
            <h4 className="text-lg font-bold text-white flex items-center gap-2">
              <span>{item.title}</span>
            </h4>
            <div className="flex items-center gap-2 mt-0.5">
              <p className="text-xs text-emerald-400 font-medium flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                <span>{item.location}</span>
              </p>
              {hasCoords && (
                <span className="text-[10px] font-mono text-zinc-400 bg-zinc-950 px-2 py-0.5 rounded border border-zinc-800">
                  {item.coordinates?.lat.toFixed(4)}°N, {item.coordinates?.lng.toFixed(4)}°E
                </span>
              )}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            {/* Quick Swap Before/After button */}
            <button
              type="button"
              onClick={() => setIsReversed(prev => !prev)}
              className="text-xs px-2.5 py-1.5 rounded-lg border border-zinc-700 bg-zinc-950 hover:bg-zinc-800 text-zinc-300 hover:text-white font-medium flex items-center gap-1 transition-all"
              title="Đổi thứ tự hình ảnh: Trước ⇄ Sau"
            >
              <ArrowLeftRight className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">Đảo hình</span>
            </button>

            {/* Toggle Mini Map Visibility */}
            {hasCoords && (
              <button
                type="button"
                onClick={() => setShowMiniMap(prev => !prev)}
                className={`text-xs px-2.5 py-1.5 rounded-lg border font-medium flex items-center gap-1.5 transition-all shadow-sm ${
                  showMiniMap
                    ? 'bg-emerald-600 border-emerald-500 text-white shadow-emerald-900/40'
                    : 'bg-zinc-950 border-emerald-500/50 text-emerald-300 hover:bg-emerald-950/60'
                }`}
                title="Bật/tắt bản đồ nhỏ vị trí thực địa"
              >
                <MapPin className="w-3.5 h-3.5 text-emerald-300" />
                <span>Bản đồ nhỏ Google</span>
                {showMiniMap ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
              </button>
            )}

            <a
              href={item.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs px-2.5 py-1.5 rounded-lg border border-rose-500/40 bg-rose-950/70 hover:bg-rose-600 text-rose-200 hover:text-white font-semibold inline-flex items-center gap-1.5 transition-all shadow-md group"
              title={`Mở trực tiếp bài báo phóng sự trên ${item.source}`}
            >
              <Newspaper className="w-3.5 h-3.5 text-rose-400 group-hover:text-white" />
              <span>Bài báo: {item.source}</span>
              <ExternalLink className="w-3 h-3 text-rose-300 group-hover:text-white" />
            </a>
          </div>
        </div>

        {/* View Switcher Tabs (Only if coordinates present) */}
        {hasCoords && (
          <div className="flex items-center gap-1.5 mb-3 bg-zinc-950 p-1 rounded-xl border border-zinc-800 text-xs">
            <button
              type="button"
              onClick={() => setActiveTab('slider')}
              className={`flex-1 py-1.5 px-3 rounded-lg font-medium transition-all flex items-center justify-center gap-1.5 ${
                activeTab === 'slider'
                  ? 'bg-zinc-800 text-white shadow'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Eye className="w-3.5 h-3.5 text-emerald-400" />
              <span>Ảnh So sánh Trước / Sau</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab('map');
                setShowMiniMap(true);
              }}
              className={`flex-1 py-1.5 px-3 rounded-lg font-medium transition-all flex items-center justify-center gap-1.5 ${
                activeTab === 'map'
                  ? 'bg-blue-600 text-white shadow'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <MapPin className="w-3.5 h-3.5 text-rose-400" />
              <span>Xem Toàn màn hình Google Maps</span>
            </button>
          </div>
        )}

        {/* Tab 1: Interactive Slider Container */}
        {activeTab === 'slider' ? (
          <div
            ref={containerRef}
            className="relative w-full h-72 sm:h-96 rounded-xl overflow-hidden cursor-ew-resize select-none border border-zinc-700/60"
            onMouseDown={() => setIsDragging(true)}
            onMouseUp={() => setIsDragging(false)}
            onMouseLeave={() => setIsDragging(false)}
            onMouseMove={handleMouseMove}
            onTouchMove={handleTouchMove}
          >
            {/* "After" Image (Background - Cleaned / Beautiful) */}
            <img
              src={currentAfterImg}
              alt={currentAfterLabel}
              className="absolute inset-0 w-full h-full object-cover pointer-events-none"
            />

            {/* "After" Label Badge */}
            <div className="absolute top-4 right-4 z-10 px-3 py-1 rounded-md bg-emerald-950/85 border border-emerald-500/50 text-emerald-300 text-xs font-semibold backdrop-blur-md flex items-center gap-1.5 shadow-lg">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>{isReversed ? 'Trước khi phục hồi' : 'Sau khi dọn dẹp'}</span>
            </div>

            {/* "Before" Image (Clipped Overlay - Polluted) */}
            <div
              className="absolute inset-0 overflow-hidden pointer-events-none"
              style={{ width: `${sliderPosition}%` }}
            >
              <img
                src={currentBeforeImg}
                alt={currentBeforeLabel}
                className="absolute inset-0 w-full h-full object-cover max-w-none"
                style={{
                  width: containerWidth > 0 ? `${containerWidth}px` : (containerRef.current?.clientWidth ? `${containerRef.current.clientWidth}px` : '100%')
                }}
              />
            </div>

            {/* "Before" Label Badge */}
            <div className="absolute top-4 left-4 z-10 px-3 py-1 rounded-md bg-rose-950/85 border border-rose-500/50 text-rose-300 text-xs font-semibold backdrop-blur-md flex items-center gap-1.5 shadow-lg">
              <AlertOctagon className="w-3.5 h-3.5 text-rose-400" />
              <span>{isReversed ? 'Sau khi dọn dẹp' : 'Trước khi phục hồi'}</span>
            </div>

            {/* Slider Divider Bar */}
            <div
              className="absolute top-0 bottom-0 w-1 bg-white shadow-[0_0_10px_rgba(255,255,255,0.7)] pointer-events-none z-20"
              style={{ left: `${sliderPosition}%` }}
            >
              <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-white text-zinc-950 flex items-center justify-center shadow-xl border-2 border-emerald-500">
                <MoveHorizontal className="w-4 h-4" />
              </div>
            </div>

            {/* Hint overlay at bottom */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 px-3 py-1 rounded-full bg-zinc-950/75 border border-zinc-700/60 text-zinc-300 text-[11px] backdrop-blur-sm pointer-events-none whitespace-nowrap">
              Kéo thanh trượt để so sánh Trước &amp; Sau
            </div>
          </div>
        ) : (
          /* Tab 2: Full Map View inside card */
          item.coordinates && (
            <div className="w-full h-72 sm:h-96">
              <MiniMap
                lat={item.coordinates.lat}
                lng={item.coordinates.lng}
                title={item.title}
                locationName={item.location}
                zoom={item.mapZoom || 16}
                height="h-72 sm:h-96"
              />
            </div>
          )
        )}

        {/* Embedded Persistent Mini Map Panel when showMiniMap is TRUE and on slider view */}
        {hasCoords && showMiniMap && activeTab === 'slider' && item.coordinates && (
          <div className="mt-4 transition-all duration-300 animate-fadeIn">
            <div className="flex items-center justify-between text-xs text-zinc-400 mb-1.5 px-1">
              <div className="flex items-center gap-2 font-semibold text-emerald-400">
                <div className="flex items-center gap-1 bg-zinc-950 px-1.5 py-0.5 rounded border border-zinc-800">
                  <span className="text-[#4285F4] font-black text-xs">G</span>
                  <span className="text-[#EA4335] font-black text-xs">o</span>
                  <span className="text-[#FBBC05] font-black text-xs">o</span>
                  <span className="text-[#4285F4] font-black text-xs">g</span>
                  <span className="text-[#34A853] font-black text-xs">l</span>
                  <span className="text-[#EA4335] font-black text-xs">e</span>
                  <span className="text-zinc-200 font-bold ml-1 text-[10px]">Maps</span>
                </div>
                <span>Bản đồ nhỏ vị trí thực địa trên Google Maps:</span>
              </div>
              <span className="text-[11px] text-zinc-400 font-mono hidden sm:inline">
                {item.coordinates.lat.toFixed(4)}°N, {item.coordinates.lng.toFixed(4)}°E
              </span>
            </div>
            <MiniMap
              lat={item.coordinates.lat}
              lng={item.coordinates.lng}
              title={item.title}
              locationName={item.location}
              zoom={item.mapZoom || 16}
              height="h-56 sm:h-64"
            />
          </div>
        )}
      </div>

      {/* Description */}
      <div className="mt-4 pt-3 border-t border-zinc-800 text-xs sm:text-sm text-zinc-300 leading-relaxed">
        {item.description}
      </div>

      {/* Direct Newspaper Article Citation Card */}
      <div className="mt-4 p-3.5 rounded-xl bg-zinc-950 border border-zinc-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-start gap-2.5">
          <div className="p-2 rounded-lg bg-rose-500/10 text-rose-400 shrink-0 mt-0.5 sm:mt-0">
            <Newspaper className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[10px] text-rose-400 font-semibold uppercase tracking-wider">
              Bài báo tư liệu phóng sự thực trạng:
            </div>
            <div className="text-white font-bold text-xs sm:text-sm mt-0.5 leading-snug">
              {item.articleTitle || item.title}
            </div>
            <div className="text-[11px] text-zinc-400 mt-0.5">
              Nguồn dẫn chứng: <strong className="text-zinc-200">{item.source}</strong>
            </div>
          </div>
        </div>

        <a
          href={item.sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="px-3.5 py-2 rounded-lg bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white font-semibold transition-all inline-flex items-center justify-center gap-1.5 shrink-0 shadow-md shadow-rose-950/40"
          title={`Xem trực tiếp bài báo gốc trên ${item.source}`}
        >
          <span>Đọc bài báo trực tiếp</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>
    </div>
  );
};

export default BeforeAfterSlider;
