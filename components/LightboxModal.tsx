import React, { useState } from 'react';
import { GalleryItem } from '../types';
import { X, ExternalLink, Calendar, MapPin, Award, Navigation, Newspaper } from 'lucide-react';
import MiniMap from './MiniMap';

interface LightboxModalProps {
  item: GalleryItem | null;
  onClose: () => void;
}

const LightboxModal: React.FC<LightboxModalProps> = ({ item, onClose }) => {
  const [showMap, setShowMap] = useState<boolean>(true);
  if (!item) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/90 backdrop-blur-md animate-fadeIn">
      {/* Background click to close */}
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative z-10 max-w-4xl w-full bg-zinc-900 border border-zinc-700/80 rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header bar */}
        <div className="flex items-center justify-between p-4 border-b border-zinc-800 bg-zinc-950">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded text-xs font-semibold bg-emerald-950 border border-emerald-500/40 text-emerald-400">
              {item.category}
            </span>
            <span className="text-xs text-zinc-400 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              {item.year}
            </span>
            {item.coordinates && (
              <span className="text-[10px] text-emerald-400 font-mono bg-zinc-900 border border-emerald-500/30 px-2 py-0.5 rounded flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                <span>{item.coordinates.lat.toFixed(4)}°N, {item.coordinates.lng.toFixed(4)}°E</span>
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {item.coordinates && (
              <button
                type="button"
                onClick={() => setShowMap(!showMap)}
                className={`text-xs px-2.5 py-1 rounded-md border font-medium flex items-center gap-1 transition-colors ${
                  showMap
                    ? 'bg-emerald-600 border-emerald-500 text-white'
                    : 'bg-zinc-800 border-zinc-700 text-zinc-300 hover:text-white'
                }`}
              >
                <Navigation className="w-3 h-3" />
                <span>Bản đồ nhỏ</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* High-res Image preview */}
        <div className="relative bg-black flex items-center justify-center overflow-hidden max-h-[55vh]">
          <img
            src={item.imageUrl}
            alt={item.title}
            className="w-full h-full object-contain max-h-[53vh]"
          />
        </div>

        {/* Details & Official Citation */}
        <div className="p-5 sm:p-6 bg-zinc-900/90 overflow-y-auto">
          <h3 className="text-lg sm:text-xl font-bold text-white mb-2">{item.title}</h3>

          <div className="flex items-center gap-2 text-xs text-emerald-400 mb-3">
            <MapPin className="w-3.5 h-3.5" />
            <span>{item.location}</span>
          </div>

          <p className="text-zinc-300 text-sm leading-relaxed mb-4">
            {item.caption}
          </p>

          {/* Embedded Mini Map in Modal */}
          {item.coordinates && showMap && (
            <div className="mb-4">
              <div className="text-xs font-semibold text-emerald-400 mb-1.5 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <div className="flex items-center gap-0.5 bg-zinc-950 px-1.5 py-0.5 rounded border border-zinc-800 text-[10px]">
                    <span className="text-[#4285F4] font-black">G</span>
                    <span className="text-[#EA4335] font-black">o</span>
                    <span className="text-[#FBBC05] font-black">o</span>
                    <span className="text-[#4285F4] font-black">g</span>
                    <span className="text-[#34A853] font-black">l</span>
                    <span className="text-[#EA4335] font-black">e</span>
                    <span className="text-zinc-300 font-bold ml-1">Maps</span>
                  </div>
                  <span>Bản đồ nhỏ định vị thực địa chính xác:</span>
                </div>
                <span className="text-[11px] text-zinc-400 font-mono">
                  {item.coordinates.lat.toFixed(4)}°N, {item.coordinates.lng.toFixed(4)}°E
                </span>
              </div>
              <MiniMap
                lat={item.coordinates.lat}
                lng={item.coordinates.lng}
                title={item.title}
                locationName={item.location}
                zoom={16}
                height="h-52 sm:h-60"
              />
            </div>
          )}

          {/* Direct Newspaper Article Citation Banner */}
          <div className="mb-4 p-4 rounded-xl bg-gradient-to-r from-rose-950/40 via-zinc-950 to-rose-950/20 border border-rose-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-lg">
            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-xl bg-rose-500/20 text-rose-400 shrink-0 mt-0.5">
                <Newspaper className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[11px] font-bold text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
                  <span>BÀI BÁO TƯ LIỆU GỐC TRỰC TIẾP</span>
                  <span className="text-zinc-600">·</span>
                  <span className="text-zinc-200 font-semibold">{item.source}</span>
                </div>
                <div className="text-sm font-bold text-white mt-0.5 leading-snug">
                  {item.articleTitle || item.title}
                </div>
                <div className="text-xs text-zinc-400 mt-1">
                  Hình ảnh tư liệu thực tế được ghi nhận trong bài báo phóng sự môi trường.
                </div>
              </div>
            </div>
            <a
              href={item.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-rose-900/40 transition-all shrink-0 hover:scale-[1.02]"
              title={`Truy cập trực tiếp bài báo trên ${item.source}`}
            >
              <span>Đọc bài báo trực tiếp</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>

          <div className="pt-4 border-t border-zinc-800 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-zinc-400">
              <Award className="w-4 h-4 text-emerald-400" />
              <span>
                Nguồn tư liệu báo chí chính thống:{' '}
                <strong className="text-emerald-300 font-semibold">{item.source}</strong> ({item.year})
              </span>
            </div>

            <div className="flex items-center gap-2">
              <a
                href={item.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-semibold transition-colors flex items-center gap-1.5 shadow-md shadow-rose-900/30"
                title={`Mở bài báo trực tiếp: ${item.source}`}
              >
                <Newspaper className="w-3.5 h-3.5" />
                <span>Mở bài báo ({item.source})</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <button
                onClick={onClose}
                className="px-4 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white font-medium transition-colors"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LightboxModal;
