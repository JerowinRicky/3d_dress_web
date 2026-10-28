import React from 'react';
import { Sparkles } from 'lucide-react';

const CATEGORIES = [
  'All',
  'Dresses',
  'Evening Wear',
  'Party Wear',
  'Casual',
  'Wedding',
  'Summer',
  'New Arrivals',
  'Premium Collection'
];

export default function CategoryFilterBar({ activeCategory, onSelectCategory }) {
  return (
    <div className="fixed top-20 left-0 right-0 z-30 flex justify-center px-3 sm:px-4 pointer-events-none">
      <div className="glass-panel px-3 py-1.5 rounded-full flex flex-nowrap items-center gap-1.5 shadow-loki overflow-x-auto max-w-[95vw] pointer-events-auto whitespace-nowrap">
        {CATEGORIES.map((cat) => {
          const isActive = activeCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => onSelectCategory(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 ${
                isActive
                  ? 'bg-[#F6B6C8] text-white shadow-sm ring-1 ring-[#C85C7A]'
                  : 'text-[#3A3033] hover:bg-[#FCE4EC] hover:text-[#C85C7A]'
              }`}
            >
              {cat === 'New Arrivals' && <Sparkles className="w-3 h-3 inline mr-1 text-[#C85C7A]" />}
              {cat}
            </button>
          );
        })}
      </div>
    </div>
  );
}

