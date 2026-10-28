import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  Rotate3d,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Minimize2,
  RotateCcw,
  ShoppingBag,
  Sparkles,
  ShieldCheck,
  Truck,
  ArrowLeft,
  Ruler,
  Star,
  Check
} from 'lucide-react';
import SizeGuideModal from './SizeGuideModal';

const VIEWS = ['front', 'left', 'back', 'right'];

export default function ProductInspectionModal({
  product,
  isOpen,
  onClose,
  onAddToCart,
  onBuyNow
}) {
  if (!isOpen || !product) return null;

  const [activeView, setActiveView] = useState('front');
  const [selectedSize, setSelectedSize] = useState(product.sizes?.[0] || 'M');
  const [zoomLevel, setZoomLevel] = useState(1);
  const [rotationAngle, setRotationAngle] = useState(0); // 0 to 360 deg
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const [addedAnimation, setAddedAnimation] = useState(false);

  const containerRef = useRef(null);

  // Sync activeView with continuous rotationAngle
  useEffect(() => {
    const normalized = ((rotationAngle % 360) + 360) % 360;
    if (normalized >= 315 || normalized < 45) {
      setActiveView('front');
    } else if (normalized >= 45 && normalized < 135) {
      setActiveView('left');
    } else if (normalized >= 135 && normalized < 225) {
      setActiveView('back');
    } else {
      setActiveView('right');
    }
  }, [rotationAngle]);

  const handleSelectView = (view) => {
    setActiveView(view);
    if (view === 'front') setRotationAngle(0);
    if (view === 'left') setRotationAngle(90);
    if (view === 'back') setRotationAngle(180);
    if (view === 'right') setRotationAngle(270);
  };

  // Drag to rotate handlers
  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.clientX || (e.touches && e.touches[0].clientX));
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    const clientX = e.clientX || (e.touches && e.touches[0].clientX);
    const delta = clientX - startX;
    setRotationAngle((prev) => prev - delta * 0.8);
    setStartX(clientX);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleReset = () => {
    setActiveView('front');
    setRotationAngle(0);
    setZoomLevel(1);
  };

  const handleAddToCartClick = () => {
    setAddedAnimation(true);
    onAddToCart({
      productId: product.id || product.productId,
      name: product.name,
      price: product.price,
      size: selectedSize,
      image: product.images?.front || '',
      color: product.colors?.[0] || 'Blush Pink'
    });
    setTimeout(() => setAddedAnimation(false), 1200);
  };

  const handleBuyNowClick = () => {
    onBuyNow({
      productId: product.id || product.productId,
      name: product.name,
      price: product.price,
      size: selectedSize,
      image: product.images?.front || '',
      color: product.colors?.[0] || 'Blush Pink'
    });
  };

  // Determine current image URL
  const currentImageUrl = product.images?.[activeView] || product.images?.front;

  return (
    <>
      <div className="fixed inset-0 z-40 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/60 backdrop-blur-md animate-fadeIn">
        <div
          ref={containerRef}
          className={`glass-panel bg-white/95 w-full max-w-6xl rounded-3xl shadow-2xl border border-[#F6B6C8] flex flex-col lg:flex-row overflow-hidden max-h-[94vh] relative transition-all duration-300 ${
            isFullscreen ? 'fixed inset-0 max-w-none max-h-none rounded-none z-50' : ''
          }`}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onTouchMove={handleMouseMove}
          onTouchEnd={handleMouseUp}
        >
          {/* Top Bar / Close / Back to Showroom button */}
          <div className="absolute top-4 left-4 z-20 flex items-center gap-2">
            <button
              onClick={onClose}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/80 hover:bg-[#FCE4EC] text-[#3A3033] text-xs font-medium border border-[#F2D7E0] transition-all shadow-sm"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-[#C85C7A]" />
              <span>Back to Showroom</span>
            </button>
            <div className="hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#FFF0F5] border border-[#F6B6C8]/60 text-[11px] text-[#C85C7A]">
              <Sparkles className="w-3 h-3" />
              <span>Rack {product.showroomPosition?.rack || 'Left-01'}, Section {product.showroomPosition?.section || 'A'}</span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-20 p-2 rounded-full bg-white/80 hover:bg-[#FCE4EC] text-[#8D7F84] hover:text-[#3A3033] border border-[#F2D7E0] transition-all shadow-sm"
            title="Return to Showroom"
          >
            <X className="w-5 h-5" />
          </button>

          {/* ================= LEFT SIDE: 360° DRESS PRESENTATION ================= */}
          <div className="w-full lg:w-3/5 bg-gradient-to-b from-[#FFF5F8] via-[#FFFFFF] to-[#FFF0F5] p-4 sm:p-8 flex flex-col items-center justify-between relative border-b lg:border-b-0 lg:border-r border-[#F2D7E0] min-h-[420px] lg:min-h-[580px]">
            {/* View controls floating pill */}
            <div className="self-end flex items-center gap-1.5 mt-8 sm:mt-2 mb-2 z-10 glass-panel px-3 py-1.5 rounded-full shadow-sm text-xs text-[#3A3033]">
              <button
                onClick={() => setZoomLevel((z) => Math.min(2.0, z + 0.2))}
                className="p-1 hover:text-[#C85C7A]"
                title="Zoom In"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
              <button
                onClick={() => setZoomLevel((z) => Math.max(0.7, z - 0.2))}
                className="p-1 hover:text-[#C85C7A]"
                title="Zoom Out"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <div className="w-[1px] h-3 bg-[#F2D7E0]" />
              <button
                onClick={handleReset}
                className="p-1 hover:text-[#C85C7A]"
                title="Reset View"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="p-1 hover:text-[#C85C7A]"
                title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
              >
                {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>
            </div>

            {/* MAIN PRODUCT INTERACTIVE 360° CANVAS/VIEW */}
            <div
              className="flex-1 w-full flex items-center justify-center relative cursor-grab active:cursor-grabbing select-none"
              onMouseDown={handleMouseDown}
              onTouchStart={handleMouseDown}
            >
              {/* Radial showroom spotlight glow */}
              <div className="absolute w-72 h-72 rounded-full bg-gradient-to-r from-[#F6B6C8]/25 to-[#FCE4EC]/40 filter blur-3xl pointer-events-none" />

              {/* Product Visual Container with 3D Depth transform */}
              <div
                className="relative transition-transform duration-100 ease-out flex items-center justify-center"
                style={{
                  transform: `scale(${zoomLevel}) rotateY(${rotationAngle * 0.25}deg)`,
                  transformStyle: 'preserve-3d'
                }}
              >
                <img
                  src={currentImageUrl}
                  alt={`${product.name} - ${activeView} view`}
                  className="max-h-[380px] sm:max-h-[460px] w-auto object-contain filter drop-shadow-xl transition-all duration-300"
                  draggable={false}
                />
              </div>

              {/* 360° Drag Rotation Hint Pill */}
              <div className="absolute bottom-2 glass-pill px-3 py-1 rounded-full flex items-center gap-1.5 text-[11px] text-[#8D7F84] pointer-events-none">
                <Rotate3d className="w-3.5 h-3.5 text-[#C85C7A] animate-spin" style={{ animationDuration: '6s' }} />
                <span>Drag horizontally to rotate 360°</span>
              </div>
            </div>

            {/* 4-SIDE VIEW THUMBNAILS: [FRONT] [BACK] [LEFT] [RIGHT] */}
            <div className="w-full mt-4 flex flex-col items-center gap-1.5 z-10">
              <span className="text-[10px] tracking-widest text-[#8D7F84] uppercase font-semibold">
                Multi-Angle Atelier Views
              </span>
              <div className="flex items-center justify-center gap-3">
                {VIEWS.map((view) => {
                  const isActive = activeView === view;
                  const thumbSrc = product.images?.[view] || product.images?.front;
                  return (
                    <button
                      key={view}
                      onClick={() => handleSelectView(view)}
                      className={`group relative flex flex-col items-center rounded-2xl p-1 transition-all duration-200 ${
                        isActive
                          ? 'ring-2 ring-[#C85C7A] bg-white shadow-md scale-105'
                          : 'bg-white/60 hover:bg-white hover:shadow border border-[#F2D7E0]'
                      }`}
                    >
                      <div className="w-12 h-14 sm:w-14 sm:h-16 rounded-xl overflow-hidden bg-[#FFF9FB] flex items-center justify-center p-0.5">
                        <img
                          src={thumbSrc}
                          alt={view}
                          className="w-full h-full object-contain filter drop-shadow-sm"
                        />
                      </div>
                      <span
                        className={`text-[9px] font-bold uppercase tracking-wider mt-1 ${
                          isActive ? 'text-[#C85C7A]' : 'text-[#8D7F84]'
                        }`}
                      >
                        {view}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* ================= RIGHT SIDE: PRODUCT INFORMATION PANEL ================= */}
          <div className="w-full lg:w-2/5 p-6 sm:p-8 flex flex-col justify-between overflow-y-auto max-h-[580px] lg:max-h-none">
            <div>
              {/* Brand and Category Bar */}
              <div className="flex items-center justify-between mb-2">
                <span className="font-serif italic tracking-widest text-sm text-[#C85C7A] font-medium">
                  {product.brand || 'LOKI Atelier Couture'}
                </span>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-[#FFF0F5] text-[#8D7F84] border border-[#F2D7E0]">
                  {product.productId}
                </span>
              </div>

              {/* Product Name */}
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#3A3033] leading-tight mb-2">
                {product.name}
              </h2>

              {/* Price, Discount & Reviews */}
              <div className="flex items-baseline gap-3 mb-4">
                <span className="text-2xl sm:text-3xl font-bold text-[#C85C7A]">
                  ₹{product.price.toLocaleString()}
                </span>
                {product.originalPrice && (
                  <span className="text-sm text-[#8D7F84] line-through">
                    ₹{product.originalPrice.toLocaleString()}
                  </span>
                )}
                {product.discount && (
                  <span className="text-xs bg-[#FCE4EC] text-[#C85C7A] font-semibold px-2 py-0.5 rounded-full">
                    {product.discount}
                  </span>
                )}
              </div>

              {/* Rating & In-Stock indicator */}
              <div className="flex items-center justify-between pb-4 border-b border-[#F2D7E0] mb-4 text-xs">
                <div className="flex items-center gap-1.5">
                  <div className="flex text-[#D4AF37]">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-current" />
                    ))}
                  </div>
                  <span className="font-bold text-[#3A3033]">{product.rating || '4.9'}</span>
                  <span className="text-[#8D7F84]">({product.reviewCount || 128} reviews)</span>
                </div>
                <div className="flex items-center gap-1.5 text-emerald-700 font-medium">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>{product.stockQuantity > 5 ? 'In Stock' : `Low Stock: Only ${product.stockQuantity} left`}</span>
                </div>
              </div>

              {/* Description */}
              <p className="text-xs text-[#6F6065] leading-relaxed mb-5">
                {product.description}
              </p>

              {/* Available Sizes Section */}
              <div className="mb-5">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#3A3033]">
                    Select Couture Size
                  </span>
                  <button
                    onClick={() => setShowSizeGuide(true)}
                    className="flex items-center gap-1 text-xs text-[#C85C7A] hover:underline font-medium"
                  >
                    <Ruler className="w-3 h-3" />
                    <span>Size Guide</span>
                  </button>
                </div>

                <div className="flex flex-wrap gap-2">
                  {['XS', 'S', 'M', 'L', 'XL', 'XXL'].map((size) => {
                    const isAvailable = product.sizes?.includes(size);
                    const isSelected = selectedSize === size;
                    return (
                      <button
                        key={size}
                        disabled={!isAvailable}
                        onClick={() => setSelectedSize(size)}
                        className={`min-w-[42px] h-10 px-3 rounded-xl text-xs font-semibold transition-all ${
                          isSelected
                            ? 'bg-[#F6B6C8] text-white shadow-md ring-2 ring-[#C85C7A]'
                            : isAvailable
                            ? 'bg-white hover:bg-[#FCE4EC] text-[#3A3033] border border-[#F2D7E0]'
                            : 'bg-gray-100 text-gray-300 border border-gray-200 cursor-not-allowed line-through'
                        }`}
                      >
                        {size}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Material & Details Specifications */}
              <div className="space-y-2 mb-6 text-xs bg-[#FFF9FB] p-3.5 rounded-2xl border border-[#F2D7E0]/60">
                <div className="flex justify-between">
                  <span className="text-[#8D7F84]">Color Palette:</span>
                  <span className="font-medium text-[#3A3033]">{product.colors?.join(', ') || 'Soft Pink'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#8D7F84]">Fabric & Composition:</span>
                  <span className="font-medium text-[#3A3033]">{product.material || 'Mulberry Silk & Organza'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#8D7F84]">Category:</span>
                  <span className="font-medium text-[#3A3033]">{product.category}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#8D7F84]">Showroom Display:</span>
                  <span className="font-medium text-[#C85C7A]">Section {product.showroomPosition?.section || 'A'} · {product.showroomPosition?.rack || 'Left-01'}</span>
                </div>
              </div>
            </div>

            {/* ACTION BUTTONS: ADD TO CART & BUY NOW */}
            <div className="pt-2">
              <div className="grid grid-cols-2 gap-3 mb-3">
                {/* ADD TO CART */}
                <button
                  onClick={handleAddToCartClick}
                  className={`flex items-center justify-center gap-2 py-3.5 px-4 rounded-2xl font-semibold text-xs tracking-wider uppercase transition-all duration-300 ${
                    addedAnimation
                      ? 'bg-emerald-600 text-white shadow-lg scale-95'
                      : 'btn-loki'
                  }`}
                >
                  {addedAnimation ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Added to Cart!</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4" />
                      <span>Add to Cart</span>
                    </>
                  )}
                </button>

                {/* BUY NOW */}
                <button
                  onClick={handleBuyNowClick}
                  className="flex items-center justify-center gap-2 py-3.5 px-4 rounded-2xl font-semibold text-xs tracking-wider uppercase bg-[#3A3033] hover:bg-[#201A1C] text-white shadow-md hover:shadow-xl transition-all"
                >
                  <span>Buy Now</span>
                </button>
              </div>

              {/* Trust Badges */}
              <div className="flex items-center justify-center gap-4 text-[11px] text-[#8D7F84] pt-2 border-t border-[#F2D7E0]/50">
                <span className="flex items-center gap-1">
                  <Truck className="w-3.5 h-3.5 text-[#C85C7A]" /> Express Boutique Delivery
                </span>
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#C85C7A]" /> Authentic LOKI Guarantee
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <SizeGuideModal isOpen={showSizeGuide} onClose={() => setShowSizeGuide(false)} />
    </>
  );
}

