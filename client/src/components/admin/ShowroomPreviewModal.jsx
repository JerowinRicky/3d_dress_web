import React from 'react';
import { X, Sparkles, Check, ArrowRight } from 'lucide-react';

export default function ShowroomPreviewModal({
  isOpen,
  onClose,
  productData,
  onPublish
}) {
  if (!isOpen || !productData) return null;

  const frontImg = productData.images?.front;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="glass-panel bg-white/95 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-[#F6B6C8] relative">
        <button
          onClick={onClose}
          className="absolute right-5 top-5 p-2 rounded-full hover:bg-[#FCE4EC] text-[#8D7F84] hover:text-[#3A3033]"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-1">
          <Sparkles className="w-4 h-4 text-[#C85C7A]" />
          <span className="text-[10px] tracking-widest text-[#C85C7A] font-semibold uppercase">
            3D Showroom Simulation
          </span>
        </div>

        <h3 className="font-serif text-2xl font-bold text-[#3A3033] mb-4">
          Showroom Rack Placement Preview
        </h3>

        {/* 3D Boutique Rack Simulation Canvas Card */}
        <div className="w-full h-80 rounded-2xl bg-gradient-to-b from-[#FFF0F5] to-[#FFFFFF] border border-[#F2D7E0] relative flex flex-col items-center justify-center overflow-hidden shadow-inner p-4">
          {/* Simulated ceiling track light beam */}
          <div className="absolute top-0 w-36 h-full bg-gradient-to-b from-white/80 via-white/20 to-transparent blur-md pointer-events-none" />

          {/* Gold Hanging Rail Fixture */}
          <div className="w-3/4 h-2 bg-gradient-to-r from-[#D4AF37] via-[#FFF3B0] to-[#D4AF37] rounded-full shadow-md relative mb-2">
            {/* Hanging Ring / Hook */}
            <div className="w-4 h-6 border-2 border-[#D4AF37] rounded-t-full absolute left-1/2 transform -translate-x-1/2 -top-4 shadow-sm" />
          </div>

          {/* Dress Visual Card on Hanger */}
          <div className="relative flex flex-col items-center">
            {frontImg ? (
              <img
                src={frontImg}
                alt={productData.name}
                className="max-h-56 w-auto object-contain filter drop-shadow-xl"
              />
            ) : (
              <div className="w-40 h-52 bg-[#FCE4EC] rounded-2xl flex items-center justify-center text-xs text-[#8D7F84]">
                Front View Pending
              </div>
            )}
            {/* Subtle shadow on reflective floor */}
            <div className="w-32 h-3 rounded-full bg-[#E0C6D0]/40 blur-xs mt-1" />
          </div>

          {/* Placement Tag Badge */}
          <div className="absolute bottom-3 left-4 right-4 glass-panel p-2 rounded-xl flex items-center justify-between text-xs border border-[#F6B6C8]">
            <div>
              <span className="text-[10px] text-[#8D7F84] uppercase font-semibold block">Showroom Location</span>
              <span className="font-bold text-[#3A3033]">
                Section {productData.showroomPosition?.section || 'A'} · {productData.showroomPosition?.rack || 'Left-01'} (Pos {productData.showroomPosition?.position ?? 0})
              </span>
            </div>
            <div className="text-right">
              <span className="font-bold text-sm text-[#C85C7A]">₹{Number(productData.price || 0).toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Product meta */}
        <div className="my-4 text-xs space-y-1">
          <p className="font-serif text-lg font-bold text-[#3A3033]">{productData.name}</p>
          <p className="text-[#8D7F84]">{productData.category} · {productData.material || 'Mulberry Silk'}</p>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-2 border-t border-[#F2D7E0]">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-xl bg-white hover:bg-[#FCE4EC] text-[#3A3033] border border-[#F2D7E0] text-xs font-semibold"
          >
            Adjust Form
          </button>
          <button
            onClick={onPublish}
            className="flex-1 py-3 rounded-xl btn-loki text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-md"
          >
            <Check className="w-4 h-4" />
            <span>Publish to Showroom</span>
          </button>
        </div>
      </div>
    </div>
  );
}

