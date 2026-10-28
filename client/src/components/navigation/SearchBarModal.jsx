import React, { useState } from 'react';
import { Search, X, Sparkles, ArrowRight } from 'lucide-react';

export default function SearchBarModal({
  isOpen,
  onClose,
  searchQuery,
  setSearchQuery,
  products = [],
  onSelectProduct
}) {
  if (!isOpen) return null;

  const suggestions = ['Pink dress', 'Evening dress', 'Wedding dress', 'Party dress', 'Silk slip', 'Ballgown'];

  const matchedProducts = searchQuery
    ? products.filter(
        (p) =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (p.tags && p.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())))
      )
    : [];

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
      <div className="glass-panel bg-white/95 rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-[#F6B6C8] relative">
        <button
          onClick={onClose}
          className="absolute right-5 top-5 p-2 rounded-full hover:bg-[#FCE4EC] text-[#8D7F84] hover:text-[#3A3033]"
        >
          <X className="w-5 h-5" />
        </button>

        <span className="text-[10px] tracking-widest text-[#C85C7A] font-semibold uppercase block mb-1">
          LOKI Showroom Search
        </span>
        <h3 className="font-serif text-2xl font-bold text-[#3A3033] mb-4">
          Search the 3D Boutique
        </h3>

        {/* Input */}
        <div className="relative mb-4">
          <Search className="w-5 h-5 absolute left-3.5 top-3.5 text-[#C85C7A]" />
          <input
            type="text"
            autoFocus
            placeholder="Search pink evening dresses, wedding gowns, silk slips..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#FFF9FB] border border-[#F2D7E0] rounded-2xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#C85C7A]"
          />
        </div>

        {/* Quick Suggestion Pills */}
        <div className="flex flex-wrap items-center gap-1.5 mb-4 text-xs">
          <span className="text-[#8D7F84] mr-1">Trending:</span>
          {suggestions.map((s) => (
            <button
              key={s}
              onClick={() => setSearchQuery(s)}
              className="px-2.5 py-1 rounded-full bg-[#FFF0F5] hover:bg-[#FCE4EC] text-[#3A3033] text-[11px] font-medium border border-[#F2D7E0] transition-all"
            >
              {s}
            </button>
          ))}
        </div>

        {/* Results */}
        {searchQuery && (
          <div className="max-h-60 overflow-y-auto space-y-2 pt-2 border-t border-[#F2D7E0]">
            <span className="text-[11px] text-[#8D7F84] font-medium">
              Found {matchedProducts.length} matching {matchedProducts.length === 1 ? 'dress' : 'dresses'} in 3D showroom:
            </span>
            {matchedProducts.map((p) => (
              <div
                key={p.id}
                onClick={() => {
                  onSelectProduct(p);
                  onClose();
                }}
                className="flex items-center justify-between p-2.5 rounded-2xl bg-[#FFF9FB] hover:bg-[#FFF0F5] border border-[#F2D7E0] cursor-pointer transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-12 bg-white rounded-lg overflow-hidden border border-[#F2D7E0] p-0.5">
                    <img src={p.images?.front} alt={p.name} className="w-full h-full object-contain" />
                  </div>
                  <div>
                    <h5 className="font-serif text-sm font-bold text-[#3A3033] group-hover:text-[#C85C7A] transition-colors">
                      {p.name}
                    </h5>
                    <span className="text-[10px] text-[#8D7F84]">{p.category} · Section {p.showroomPosition?.section || 'A'}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-xs text-[#C85C7A]">₹{p.price.toLocaleString()}</span>
                  <ArrowRight className="w-4 h-4 text-[#8D7F84] group-hover:text-[#C85C7A] transition-colors" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

