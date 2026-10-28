import React, { useState } from 'react';
import {
  ShoppingBag,
  Search,
  User,
  SlidersHorizontal,
  Volume2,
  VolumeX,
  Shield,
  Sparkles
} from 'lucide-react';

export default function FloatingHeader({
  cartCount = 0,
  onOpenCart,
  onOpenSearch,
  onOpenAccount,
  onOpenAdmin,
  onOpenBuilder,
  showCategoryBar,
  setShowCategoryBar,
  onResetShowroom
}) {
  const [isPlayingSound, setIsPlayingSound] = useState(false);

  // Soft boutique lounge audio synthesis using Web Audio API
  const toggleLoungeAudio = () => {
    if (!isPlayingSound) {
      try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        const ctx = new AudioContext();
        // Play soft harp-like ambient chime
        const playChime = () => {
          const notes = [261.63, 329.63, 392.00, 523.25, 659.25];
          notes.forEach((freq, idx) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.18);
            gain.gain.setValueAtTime(0.001, ctx.currentTime + idx * 0.18);
            gain.gain.exponentialRampToValueAtTime(0.04, ctx.currentTime + idx * 0.18 + 0.05);
            gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + idx * 0.18 + 1.8);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(ctx.currentTime + idx * 0.18);
            osc.stop(ctx.currentTime + idx * 0.18 + 2.0);
          });
        };
        playChime();
        setIsPlayingSound(true);
      } catch (e) {
        setIsPlayingSound(false);
      }
    } else {
      setIsPlayingSound(false);
    }
  };

  return (
    <header className="fixed top-4 left-0 right-0 z-30 px-3 sm:px-6 pointer-events-none">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* LOKI Luxury Brand Logo */}
        <div
          onClick={onResetShowroom}
          className="glass-panel px-4 py-2 rounded-2xl flex items-center gap-3 cursor-pointer shadow-loki hover:shadow-soft-glow transition-all duration-300 pointer-events-auto group"
        >
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#F6B6C8] to-[#FCE4EC] flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform">
            <span className="font-serif font-bold text-base text-[#3A3033]">L</span>
          </div>
          <div>
            <h1 className="font-serif text-xl sm:text-2xl font-bold tracking-[0.25em] text-[#3A3033] leading-none">
              LOKI
            </h1>
            <span className="text-[9px] tracking-widest uppercase text-[#C85C7A] font-semibold block mt-0.5">
              Step into fashion · 3D
            </span>
          </div>
        </div>

        {/* Right Nav Action Controls */}
        <div className="glass-panel px-3 py-2 rounded-2xl flex items-center gap-2 sm:gap-3 shadow-loki pointer-events-auto">
          {/* Categories Toggle */}
          <button
            onClick={() => setShowCategoryBar(!showCategoryBar)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              showCategoryBar
                ? 'bg-[#F6B6C8] text-white shadow-sm'
                : 'text-[#3A3033] hover:bg-[#FCE4EC]'
            }`}
            title="Filter Categories"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Categories</span>
          </button>

          {/* Search Trigger */}
          <button
            onClick={onOpenSearch}
            className="p-2 rounded-xl text-[#3A3033] hover:bg-[#FCE4EC] hover:text-[#C85C7A] transition-all"
            title="Search Showroom"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Audio Ambiance */}
          <button
            onClick={toggleLoungeAudio}
            className={`p-2 rounded-xl transition-all ${
              isPlayingSound ? 'text-[#C85C7A] bg-[#FFF0F5]' : 'text-[#8D7F84] hover:bg-[#FCE4EC]'
            }`}
            title={isPlayingSound ? 'Mute Showroom Audio' : 'Play Atelier Ambiance'}
          >
            {isPlayingSound ? <Volume2 className="w-4 h-4 animate-pulse" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Customer Orders */}
          <button
            onClick={onOpenAccount}
            className="p-2 rounded-xl text-[#3A3033] hover:bg-[#FCE4EC] hover:text-[#C85C7A] transition-all"
            title="My Orders & Wardrobe"
          >
            <User className="w-4 h-4" />
          </button>

          {/* Cart Trigger */}
          <button
            onClick={onOpenCart}
            className="btn-loki relative flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider"
            title="Shopping Cart"
          >
            <ShoppingBag className="w-4 h-4" />
            <span className="hidden sm:inline">Bag</span>
            {cartCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-white text-[#C85C7A] font-bold text-[10px] flex items-center justify-center shadow-sm">
                {cartCount}
              </span>
            )}
          </button>

          <div className="w-[1px] h-6 bg-[#F2D7E0] mx-0.5" />

          {/* ADMIN PORTAL BUTTON */}
          <button
            onClick={onOpenAdmin}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#FFF0F5] hover:bg-[#FCE4EC] text-[#C85C7A] text-xs font-bold border border-[#F6B6C8]/60 transition-all hover:scale-105"
            title="Open LOKI Admin Panel"
          >
            <Shield className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Admin</span>
          </button>
        </div>
      </div>
    </header>
  );
}

