import React from 'react';
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight, RotateCcw, Compass, MapPin } from 'lucide-react';

export default function ShowroomControls({
  currentZ,
  onWalk,
  onTurn,
  onResetView,
  onJumpSection,
  activeSection = 'A'
}) {
  // Calculate aisle progress (range from Z = 8 down to Z = -16)
  const minZ = 8;
  const maxZ = -16;
  const progressPercent = Math.min(100, Math.max(0, ((minZ - currentZ) / (minZ - maxZ)) * 100));

  return (
    <>
      {/* Bottom Center Navigation Console in a Single Elegant Horizontal Line */}
      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-20 pointer-events-auto max-w-[95vw]">
        <div className="glass-panel px-3 sm:px-4 py-2 rounded-full flex items-center gap-2 sm:gap-3 shadow-loki border border-[#F6B6C8]/80 whitespace-nowrap overflow-x-auto no-scrollbar">
          
          {/* Section Jump Badges (Single line) */}
          <div className="flex items-center gap-1 text-xs">
            <span className="text-[#8D7F84] text-[11px] font-medium hidden md:flex items-center gap-1 mr-1">
              <MapPin className="w-3 h-3 text-[#C85C7A]" /> Section:
            </span>
            <button
              onClick={() => onJumpSection('A', 6)}
              className={`px-2.5 sm:px-3 py-1 rounded-full transition-all text-xs font-semibold ${
                activeSection === 'A'
                  ? 'bg-[#F6B6C8] text-white shadow-sm ring-1 ring-[#C85C7A]'
                  : 'text-[#3A3033] hover:bg-[#FCE4EC]'
              }`}
            >
              A · Evening
            </button>
            <button
              onClick={() => onJumpSection('B', -4)}
              className={`px-2.5 sm:px-3 py-1 rounded-full transition-all text-xs font-semibold ${
                activeSection === 'B'
                  ? 'bg-[#F6B6C8] text-white shadow-sm ring-1 ring-[#C85C7A]'
                  : 'text-[#3A3033] hover:bg-[#FCE4EC]'
              }`}
            >
              B · Bridal & Gala
            </button>
            <button
              onClick={() => onJumpSection('C', -13)}
              className={`px-2.5 sm:px-3 py-1 rounded-full transition-all text-xs font-semibold ${
                activeSection === 'C'
                  ? 'bg-[#F6B6C8] text-white shadow-sm ring-1 ring-[#C85C7A]'
                  : 'text-[#3A3033] hover:bg-[#FCE4EC]'
              }`}
            >
              C · Atelier
            </button>
          </div>

          <div className="h-6 w-[1px] bg-[#F2D7E0] shrink-0" />

          {/* Direction & Walk Controls (Single line) */}
          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={() => onTurn(0.15)}
              title="Look Left"
              className="p-1.5 sm:p-2 rounded-full bg-white/80 hover:bg-[#FCE4EC] text-[#3A3033] transition-all active:scale-95 border border-[#F2D7E0]"
            >
              <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#C85C7A]" />
            </button>

            <button
              onClick={() => onWalk(2.2)}
              title="Walk Forward into Showroom"
              className="p-1.5 sm:p-2 rounded-full bg-[#F6B6C8] hover:bg-[#C85C7A] text-white transition-all active:scale-95 shadow-sm"
            >
              <ArrowUp className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>

            <button
              onClick={() => onWalk(-2.2)}
              title="Walk Backward"
              className="p-1.5 sm:p-2 rounded-full bg-white/80 hover:bg-[#FCE4EC] text-[#3A3033] transition-all active:scale-95 border border-[#F2D7E0]"
            >
              <ArrowDown className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#C85C7A]" />
            </button>

            <button
              onClick={() => onTurn(-0.15)}
              title="Look Right"
              className="p-1.5 sm:p-2 rounded-full bg-white/80 hover:bg-[#FCE4EC] text-[#3A3033] transition-all active:scale-95 border border-[#F2D7E0]"
            >
              <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#C85C7A]" />
            </button>
          </div>

          <div className="h-6 w-[1px] bg-[#F2D7E0] shrink-0" />

          {/* Reset Center View Button */}
          <button
            onClick={onResetView}
            title="Reset Center Camera"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/80 hover:bg-[#FCE4EC] text-[#3A3033] text-xs font-semibold border border-[#F2D7E0] transition-all active:scale-95 shrink-0"
          >
            <RotateCcw className="w-3.5 h-3.5 text-[#C85C7A]" />
            <span className="hidden sm:inline">Center</span>
          </button>

          {/* Desktop Keyboard Walk hint (Single line) */}
          <div className="hidden xl:flex items-center gap-1 text-[11px] text-[#8D7F84] pl-1 shrink-0">
            <span className="px-1.5 py-0.5 rounded bg-white border border-[#F2D7E0] font-mono text-[10px]">W</span>
            <span className="px-1.5 py-0.5 rounded bg-white border border-[#F2D7E0] font-mono text-[10px]">S</span>
            <span>Walk</span>
          </div>

        </div>
      </div>

      {/* Right-Side Vertical Aisle Runway Depth Progress Bar */}
      <div className="fixed right-6 top-1/2 transform -translate-y-1/2 z-20 hidden md:flex flex-col items-center gap-2 pointer-events-none">
        <span className="text-[10px] tracking-widest text-[#8D7F84] uppercase font-semibold rotate-90 my-2">
          Aisle Depth
        </span>
        <div className="w-1.5 h-36 bg-[#FCE4EC] rounded-full overflow-hidden p-0.5 border border-[#F2D7E0]">
          <div
            className="w-full bg-[#C85C7A] rounded-full transition-all duration-300"
            style={{ height: `${progressPercent}%` }}
          />
        </div>
        <Compass className="w-3.5 h-3.5 text-[#C85C7A] mt-2 animate-pulse" />
      </div>
    </>
  );
}
