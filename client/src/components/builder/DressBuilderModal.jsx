import React, { useState, useRef, useMemo, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Html } from '@react-three/drei';
import * as THREE from 'three';
import {
  X,
  Sparkles,
  Palette,
  Scissors,
  Layers,
  Upload,
  Check,
  RotateCcw,
  ShoppingBag,
  Sliders,
  Sun,
  Eye,
  Plus
} from 'lucide-react';
import { createCoutureSkirtGeometry, createCoutureBodiceGeometry } from '../showroom/Dress3DGeometry';
import { processDressImage } from '../../utils/dressProcessor';
import { api } from '../../services/api';

// Interactive 3D Dress Mesh inside the Builder Viewport
function BuilderDressMesh({
  style,
  neckline,
  color,
  accentColor,
  fabricType,
  texture,
  pleatDepth,
  pleatCount
}) {
  const meshRef = useRef();

  const skirtGeom = useMemo(() => {
    return createCoutureSkirtGeometry(style, {
      pleatCount,
      pleatDepth,
      bottomRadius: style === 'ballgown' ? 0.9 : (style === 'mermaid' ? 0.65 : (style === 'slip' ? 0.42 : 0.62))
    });
  }, [style, pleatCount, pleatDepth]);

  const bodiceGeom = useMemo(() => {
    return createCoutureBodiceGeometry(neckline);
  }, [neckline]);

  const dressColor = useMemo(() => new THREE.Color(color), [color]);
  const accColor = useMemo(() => new THREE.Color(accentColor), [accentColor]);
  const goldColor = useMemo(() => new THREE.Color('#D4AF37'), []);

  // Material roughness & metalness based on fabric type
  const matProps = useMemo(() => {
    switch (fabricType) {
      case 'satin':
        return { roughness: 0.18, metalness: 0.35 };
      case 'velvet':
        return { roughness: 0.75, metalness: 0.05 };
      case 'chiffon':
        return { roughness: 0.45, metalness: 0.05, opacity: 0.9, transparent: true };
      case 'shimmer':
        return { roughness: 0.25, metalness: 0.65 };
      default: // silk
        return { roughness: 0.28, metalness: 0.15 };
    }
  }, [fabricType]);

  // Gentle rotating idle
  useFrame((state) => {
    if (!meshRef.current) return;
    meshRef.current.position.y = Math.sin(state.clock.getElapsedTime() * 1.5) * 0.015;
  });

  // Single curved drape geometry for textured dresses
  const singleDrapeGeom = useMemo(() => {
    const geom = new THREE.PlaneGeometry(1.08, 1.76, 32, 32);
    const pos = geom.attributes.position;
    const halfW = 1.08 / 2;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const factor = Math.max(0, 1 - Math.pow(x / halfW, 2));
      pos.setZ(i, factor * 0.08);
    }
    geom.computeVertexNormals();
    return geom;
  }, []);

  return (
    <group ref={meshRef} position={[0, 0.1, 0]}>
      {/* Designer Hanger Hook & Bar */}
      <mesh position={[0, 0.58, 0]}>
        <torusGeometry args={[0.08, 0.014, 16, 24, Math.PI * 1.2]} />
        <meshStandardMaterial color={goldColor} metalness={0.92} roughness={0.18} />
      </mesh>
      <mesh position={[0, 0.46, 0]}>
        <boxGeometry args={[0.82, 0.026, 0.035]} />
        <meshStandardMaterial color="#E8C39E" roughness={0.35} metalness={0.1} />
      </mesh>

      {/* If photo texture is loaded, render SINGLE clean dress (NO duplication, NO extra pink cone skirt) */}
      {texture ? (
        <mesh geometry={singleDrapeGeom} position={[0, -0.44, 0]}>
          <meshStandardMaterial
            map={texture}
            color="#FFFFFF"
            transparent={true}
            alphaTest={0.08}
            roughness={0.3}
            metalness={0.1}
            side={THREE.DoubleSide}
          />
        </mesh>
      ) : (
        <>
          {/* Shoulder Straps */}
          <mesh position={[-0.15, 0.36, 0]} rotation={[0, 0, -0.08]}>
            <cylinderGeometry args={[0.009, 0.009, 0.2, 12]} />
            <meshStandardMaterial color={accColor} roughness={0.3} />
          </mesh>
          <mesh position={[0.15, 0.36, 0]} rotation={[0, 0, 0.08]}>
            <cylinderGeometry args={[0.009, 0.009, 0.2, 12]} />
            <meshStandardMaterial color={accColor} roughness={0.3} />
          </mesh>

          {/* Bodice */}
          <mesh geometry={bodiceGeom} position={[0, 0.16, 0]}>
            <meshStandardMaterial
              color={dressColor}
              {...matProps}
              side={THREE.DoubleSide}
            />
          </mesh>

          {/* Waistband with Gold Accent */}
          <mesh position={[0, -0.05, 0]}>
            <cylinderGeometry args={[0.21, 0.214, 0.048, 36]} />
            <meshStandardMaterial color={accColor} roughness={0.25} metalness={0.4} />
          </mesh>
          <mesh position={[0, -0.05, 0.215]}>
            <boxGeometry args={[0.045, 0.038, 0.016]} />
            <meshStandardMaterial color={goldColor} metalness={0.92} roughness={0.18} />
          </mesh>

          {/* Skirt */}
          <mesh geometry={skirtGeom} position={[0, -0.73, 0]}>
            <meshStandardMaterial
              color={dressColor}
              {...matProps}
              side={THREE.DoubleSide}
            />
          </mesh>
        </>
      )}

      {/* Floor Shadow */}
      <mesh position={[0, -1.65, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.65, 32]} />
        <meshBasicMaterial color="#E2C7D2" transparent opacity={0.35} />
      </mesh>
    </group>
  );
}

const LUXURY_PALETTES = [
  { name: 'Blush Camellia', hex: '#F6B6C8', accent: '#C85C7A' },
  { name: 'Dusty Rose', hex: '#E8A2B8', accent: '#9C3D5A' },
  { name: 'Lavender Mist', hex: '#E6D5E8', accent: '#8A5D96' },
  { name: 'Champagne Glow', hex: '#F7EDE2', accent: '#B8860B' },
  { name: 'Cloud White', hex: '#FFF9FB', accent: '#D4AF37' },
  { name: 'Peach Satin', hex: '#FFDFD3', accent: '#D9755F' },
  { name: 'Royal Magenta', hex: '#C85C7A', accent: '#4A1525' },
  { name: 'Midnight Atelier', hex: '#2C2B3E', accent: '#D4AF37' }
];

export default function DressBuilderModal({
  isOpen,
  onClose,
  onProductCreated,
  onAddToCart
}) {
  if (!isOpen) return null;

  // Customizer States
  const [dressName, setDressName] = useState('Bespoke Atelier Creation');
  const [style, setStyle] = useState('gown'); // gown, mermaid, ballgown, slip, pleated
  const [neckline, setNeckline] = useState('sweetheart'); // sweetheart, halter, cowl, off-shoulder
  const [color, setColor] = useState('#F6B6C8');
  const [accentColor, setAccentColor] = useState('#C85C7A');
  const [fabricType, setFabricType] = useState('silk'); // silk, satin, velvet, chiffon, shimmer
  const [pleatCount, setPleatCount] = useState(10);
  const [pleatDepth, setPleatDepth] = useState(0.06);
  const [price, setPrice] = useState(7499);
  const [showroomSection, setShowroomSection] = useState('A');
  const [showroomRack, setShowroomRack] = useState('Left-01');

  // Texture state
  const [texture, setTexture] = useState(null);
  const [texturePreview, setTexturePreview] = useState('');
  const [isPublishing, setIsPublishing] = useState(false);
  const [activeTab, setActiveTab] = useState('style'); // style, fabric, details, showroom

  // Handle image upload with auto background removal and clean dress isolation
  const handleTextureUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const rawUrl = event.target.result;
      // Auto-extract dress silhouette and remove studio background walls
      const processed = await processDressImage(rawUrl, { threshold: 45, feather: 15 });
      const finalUrl = processed.dataUrl;

      setTexturePreview(finalUrl);
      const loader = new THREE.TextureLoader();
      loader.load(finalUrl, (tex) => {
        tex.colorSpace = THREE.SRGBColorSpace;
        setTexture(tex);
      });
    };
    reader.readAsDataURL(file);
  };

  // 1-Click Load the Real Floral Embroidered Couture Gown (from user upload)
  const handleLoadRealFloralGown = async () => {
    setDressName('Rose Petal Embroidered Tulle Gown');
    setStyle('gown');
    setNeckline('sweetheart');
    setColor('#F8B4C4');
    setAccentColor('#C85C7A');
    setFabricType('silk');
    setPrice(9499);

    const presetUrl = '/presets/couture-floral-gown.png';
    const processed = await processDressImage(presetUrl, { threshold: 45, feather: 15 });
    setTexturePreview(processed.dataUrl);

    const loader = new THREE.TextureLoader();
    loader.load(processed.dataUrl, (tex) => {
      tex.colorSpace = THREE.SRGBColorSpace;
      setTexture(tex);
    });
  };

  // Generate 4 views SVG representations for product record
  const generatePreviewData = () => {
    const makeSvg = (view) => `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 520" width="400" height="520">
        <rect width="400" height="520" fill="#FFF5F8" rx="16"/>
        <ellipse cx="200" cy="495" rx="140" ry="12" fill="#EAD5DC" opacity="0.4"/>
        <path d="M200,45 C190,45 190,25 200,25 C210,25 210,45 200,55" fill="none" stroke="#D4AF37" stroke-width="3"/>
        <path d="M140,110 Q200,75 260,110" fill="none" stroke="#D4AF37" stroke-width="4.5"/>
        <circle cx="200" cy="72" r="3" fill="#D4AF37"/>
        <path d="M165,110 L175,78" stroke="${accentColor}" stroke-width="2.5"/>
        <path d="M235,110 L225,78" stroke="${accentColor}" stroke-width="2.5"/>
        <path d="M165,110 Q200,135 235,110 L245,185 L155,185 Z" fill="${color}" stroke="${accentColor}" stroke-width="1.5"/>
        <path d="M158,185 L242,185 L240,205 L160,205 Z" fill="${accentColor}"/>
        <path d="M160,205 Q120,380 90,475 Q200,500 310,475 Q280,380 240,205 Z" fill="${color}"/>
        <text x="30" y="45" font-family="Montserrat" font-size="11" font-weight="bold" fill="${accentColor}">${view.toUpperCase()} VIEW</text>
        <text x="350" y="45" font-family="Cormorant Garamond" font-size="16" font-style="italic" fill="#3A3033" opacity="0.4">LOKI</text>
      </svg>
    `;

    const toDataUri = (svgStr) => `data:image/svg+xml;utf8,${encodeURIComponent(svgStr)}`;
    return {
      front: texturePreview || toDataUri(makeSvg('front')),
      back: toDataUri(makeSvg('back')),
      left: toDataUri(makeSvg('left')),
      right: toDataUri(makeSvg('right'))
    };
  };

  // Publish to 3D Showroom
  const handlePublishToShowroom = async () => {
    setIsPublishing(true);
    try {
      const side = showroomRack.toLowerCase().includes('right') ? 'right' : 'left';
      const images = generatePreviewData();
      const payload = {
        name: dressName,
        category: style === 'ballgown' ? 'Wedding' : (style === 'mermaid' || style === 'gown' ? 'Evening Wear' : 'Party Wear'),
        description: `Custom 3D Haute Couture piece tailored in ${fabricType.toUpperCase()}. Sculpted ${neckline} neckline with flowing ${style} silhouette.`,
        price: Number(price),
        originalPrice: Math.round(Number(price) * 1.35),
        discount: 'Bespoke Atelier',
        stockQuantity: 10,
        colorCode: color,
        accentColor,
        dressStyle: style,
        neckline,
        showroomPosition: {
          section: showroomSection,
          rack: showroomRack,
          side,
          position: 0,
          displayOrder: 1
        },
        images
      };

      const res = await api.createProduct(payload);
      if (res.success) {
        if (onProductCreated) onProductCreated(res.data);
        onClose();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsPublishing(false);
    }
  };

  // Direct Order / Add to Bag
  const handleOrderCustomPiece = () => {
    const images = generatePreviewData();
    if (onAddToCart) {
      onAddToCart({
        productId: 'custom-' + Date.now().toString(36),
        name: dressName,
        price: Number(price),
        size: 'M (Custom Tailored)',
        image: images.front,
        color: LUXURY_PALETTES.find(p => p.hex === color)?.name || 'Custom Blush'
      });
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/60 backdrop-blur-md animate-fadeIn">
      <div className="glass-panel bg-white/95 rounded-3xl w-full max-w-6xl h-[92vh] shadow-2xl border border-[#F6B6C8] flex flex-col lg:flex-row overflow-hidden relative">
        {/* Top Header */}
        <div className="absolute top-4 left-4 z-20 flex items-center gap-2">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/90 border border-[#F6B6C8] shadow-sm">
            <Sparkles className="w-4 h-4 text-[#C85C7A]" />
            <span className="font-serif font-bold text-sm text-[#3A3033]">
              LOKI 3D Atelier Dress Builder
            </span>
          </div>
        </div>

        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-white/80 hover:bg-[#FCE4EC] text-[#8D7F84] hover:text-[#3A3033] border border-[#F2D7E0] transition-all shadow-sm"
        >
          <X className="w-5 h-5" />
        </button>

        {/* ================= LEFT SIDE: LIVE 3D INTERACTIVE BUILDER CANVAS ================= */}
        <div className="w-full lg:w-3/5 bg-gradient-to-b from-[#FFF5F8] via-[#FFFFFF] to-[#FFF0F5] relative flex flex-col items-center justify-center border-b lg:border-b-0 lg:border-r border-[#F2D7E0] min-h-[380px] lg:min-h-full">
          {/* Studio Canvas */}
          <div className="w-full h-full cursor-grab active:cursor-grabbing">
            <Canvas
              shadows
              camera={{ position: [0, 0.4, 3.2], fov: 42 }}
              gl={{ antialias: true, powerPreference: 'high-performance' }}
            >
              <color attach="background" args={['#FFF6F9']} />
              <fog attach="fog" args={['#FFF6F9', 5, 12]} />

              <ambientLight intensity={1.2} />
              <directionalLight position={[2, 4, 3]} intensity={1.6} castShadow />
              <directionalLight position={[-2, 3, -2]} intensity={0.9} color="#FFEBF2" />
              <pointLight position={[0, -1, 1.5]} intensity={0.6} color="#FFF" />

              <Suspense fallback={null}>
                <BuilderDressMesh
                  style={style}
                  neckline={neckline}
                  color={color}
                  accentColor={accentColor}
                  fabricType={fabricType}
                  texture={texture}
                  pleatDepth={pleatDepth}
                  pleatCount={pleatCount}
                />
              </Suspense>

              <OrbitControls
                enablePan={false}
                minDistance={1.8}
                maxDistance={5.5}
                maxPolarAngle={Math.PI / 1.7}
                minPolarAngle={Math.PI / 3}
              />
            </Canvas>
          </div>

          {/* 360 Hint */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 glass-pill px-3 py-1 rounded-full text-[11px] text-[#8D7F84] flex items-center gap-1.5 pointer-events-none">
            <RotateCcw className="w-3.5 h-3.5 text-[#C85C7A] animate-spin" style={{ animationDuration: '8s' }} />
            <span>Drag to rotate 3D garment · Scroll to zoom</span>
          </div>
        </div>

        {/* ================= RIGHT SIDE: BUILDER CONTROLS PANEL ================= */}
        <div className="w-full lg:w-2/5 p-6 flex flex-col justify-between overflow-y-auto max-h-[580px] lg:max-h-none bg-white">
          <div className="space-y-5">
            {/* Title & Live Pricing */}
            <div>
              <span className="text-[10px] tracking-widest text-[#C85C7A] font-semibold uppercase block">
                Haute Couture Customization
              </span>
              <input
                type="text"
                value={dressName}
                onChange={(e) => setDressName(e.target.value)}
                className="font-serif text-2xl font-bold text-[#3A3033] w-full border-b border-[#F2D7E0] pb-1 outline-none focus:border-[#C85C7A] bg-transparent"
              />
              <div className="flex items-center justify-between mt-2">
                <span className="font-bold text-xl text-[#C85C7A]">₹{price.toLocaleString()}</span>
                <span className="text-xs bg-[#FFF0F5] text-[#C85C7A] px-2.5 py-0.5 rounded-full font-semibold border border-[#F6B6C8]/60">
                  Custom Atelier Tailoring
                </span>
              </div>
            </div>

            {/* Customizer Subtabs */}
            <div className="flex items-center gap-1 p-1 bg-[#FFF0F5] rounded-2xl border border-[#F2D7E0]">
              {[
                { id: 'style', label: 'Silhouette', icon: Scissors },
                { id: 'fabric', label: 'Fabrics & Colors', icon: Palette },
                { id: 'texture', label: 'Pattern Upload', icon: Upload },
                { id: 'showroom', label: 'Rack Placement', icon: Layers }
              ].map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1 transition-all ${
                    activeTab === id
                      ? 'bg-white text-[#C85C7A] shadow-sm'
                      : 'text-[#8D7F84] hover:text-[#3A3033]'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">{label}</span>
                </button>
              ))}
            </div>

            {/* ================= TAB 1: SILHOUETTE & NECKLINE ================= */}
            {activeTab === 'style' && (
              <div className="space-y-4 text-xs animate-fadeIn">
                {/* Silhouette Selection */}
                <div>
                  <label className="block text-[#8D7F84] mb-1.5 font-semibold uppercase tracking-wider text-[10px]">
                    1. Couture Skirt Silhouette
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { id: 'gown', name: 'A-Line Flowing Gown', desc: 'Cascading natural pleats' },
                      { id: 'ballgown', name: 'Royal Ballgown', desc: 'Voluminous bell shape' },
                      { id: 'mermaid', name: 'Mermaid Contour', desc: 'Fitted with flared hem' },
                      { id: 'slip', name: 'Liquid Satin Slip', desc: 'Effortless bias-cut' },
                      { id: 'pleated', name: 'Accordion Pleated', desc: 'Crisp pressed folds' }
                    ].map((s) => (
                      <button
                        key={s.id}
                        onClick={() => setStyle(s.id)}
                        className={`p-2.5 rounded-2xl border text-left transition-all ${
                          style === s.id
                            ? 'bg-[#FFF0F5] border-[#C85C7A] ring-1 ring-[#C85C7A]'
                            : 'bg-white border-[#F2D7E0] hover:bg-[#FFF9FB]'
                        }`}
                      >
                        <span className="font-bold text-xs text-[#3A3033] block">{s.name}</span>
                        <span className="text-[10px] text-[#8D7F84] block mt-0.5">{s.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Neckline Selection */}
                <div>
                  <label className="block text-[#8D7F84] mb-1.5 font-semibold uppercase tracking-wider text-[10px]">
                    2. Bodice Neckline Contour
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'sweetheart', name: 'Sweetheart' },
                      { id: 'cowl', name: 'Slip Cowl' },
                      { id: 'halter', name: 'Halter Cross' }
                    ].map((n) => (
                      <button
                        key={n.id}
                        onClick={() => setNeckline(n.id)}
                        className={`py-2 px-3 rounded-xl border text-center font-medium transition-all ${
                          neckline === n.id
                            ? 'bg-[#F6B6C8] text-white font-bold shadow-sm'
                            : 'bg-white border-[#F2D7E0] text-[#3A3033] hover:bg-[#FCE4EC]'
                        }`}
                      >
                        {n.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Pleat Depth Slider */}
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-[#8D7F84] font-medium">Cloth Ripple Depth</span>
                    <span className="font-bold text-[#C85C7A]">{Math.round(pleatDepth * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0.02"
                    max="0.12"
                    step="0.01"
                    value={pleatDepth}
                    onChange={(e) => setPleatDepth(parseFloat(e.target.value))}
                    className="w-full accent-[#C85C7A]"
                  />
                </div>
              </div>
            )}

            {/* ================= TAB 2: FABRICS & COLORS ================= */}
            {activeTab === 'fabric' && (
              <div className="space-y-4 text-xs animate-fadeIn">
                {/* Fabric Material Selection */}
                <div>
                  <label className="block text-[#8D7F84] mb-1.5 font-semibold uppercase tracking-wider text-[10px]">
                    Atelier Fabric Composition
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { id: 'silk', name: 'Pure Mulberry Silk', desc: 'Soft satin luster' },
                      { id: 'satin', name: 'Heavy Liquid Satin', desc: 'High reflective sheen' },
                      { id: 'velvet', name: 'Royal Velvet', desc: 'Deep rich matte luxury' },
                      { id: 'chiffon', name: 'Italian Chiffon', desc: 'Airy semi-translucent' },
                      { id: 'shimmer', name: 'Micro-Sequin Shimmer', desc: 'Sparkling runway crystals' }
                    ].map((f) => (
                      <button
                        key={f.id}
                        onClick={() => setFabricType(f.id)}
                        className={`p-2.5 rounded-2xl border text-left transition-all ${
                          fabricType === f.id
                            ? 'bg-[#FFF0F5] border-[#C85C7A] ring-1 ring-[#C85C7A]'
                            : 'bg-white border-[#F2D7E0] hover:bg-[#FFF9FB]'
                        }`}
                      >
                        <span className="font-bold text-xs text-[#3A3033] block">{f.name}</span>
                        <span className="text-[10px] text-[#8D7F84] block mt-0.5">{f.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Luxury Color Swatches */}
                <div>
                  <label className="block text-[#8D7F84] mb-1.5 font-semibold uppercase tracking-wider text-[10px]">
                    Signature Pastel Palette
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {LUXURY_PALETTES.map((pal) => (
                      <button
                        key={pal.hex}
                        onClick={() => {
                          setColor(pal.hex);
                          setAccentColor(pal.accent);
                        }}
                        className={`flex flex-col items-center p-2 rounded-2xl border transition-all ${
                          color === pal.hex
                            ? 'border-[#C85C7A] bg-[#FFF0F5] shadow-sm ring-1 ring-[#C85C7A]'
                            : 'border-[#F2D7E0] bg-white hover:bg-[#FFF9FB]'
                        }`}
                      >
                        <span
                          className="w-7 h-7 rounded-full shadow-inner border border-black/10 mb-1"
                          style={{ backgroundColor: pal.hex }}
                        />
                        <span className="text-[9px] text-[#3A3033] font-medium text-center truncate w-full">
                          {pal.name}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Custom Color Picker */}
                <div className="flex items-center gap-3 p-3 bg-[#FFF9FB] rounded-2xl border border-[#F2D7E0]">
                  <input
                    type="color"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    className="w-10 h-10 rounded-xl border border-[#F2D7E0] cursor-pointer"
                  />
                  <div>
                    <span className="font-semibold text-xs text-[#3A3033] block">Custom Hex Shade</span>
                    <span className="font-mono text-xs text-[#8D7F84]">{color}</span>
                  </div>
                </div>
              </div>
            )}

            {/* ================= TAB 3: PATTERN / PHOTO TEXTURE UPLOAD ================= */}
            {activeTab === 'texture' && (
              <div className="space-y-4 text-xs animate-fadeIn">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold text-xs text-[#3A3033]">Upload Fabric Print or Dress Photo</h4>
                    <p className="text-[11px] text-[#8D7F84] mt-0.5">
                      Auto-extracts the dress silhouette & strips studio background walls for realistic 3D showroom drape
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleLoadRealFloralGown}
                    className="px-3 py-1.5 rounded-full bg-[#FFF0F5] hover:bg-[#FCE4EC] text-[#C85C7A] text-[11px] font-bold border border-[#F6B6C8] flex items-center gap-1 shrink-0 shadow-sm"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Load Floral Couture Photo</span>
                  </button>
                </div>

                <div className="border-2 border-dashed border-[#F2D7E0] hover:border-[#C85C7A] rounded-2xl p-6 text-center bg-[#FFF9FB] transition-all">
                  {texturePreview ? (
                    <div className="space-y-3">
                      <div className="w-24 h-24 mx-auto rounded-xl overflow-hidden border border-[#F2D7E0] shadow-sm">
                        <img src={texturePreview} alt="Preview" className="w-full h-full object-cover" />
                      </div>
                      <span className="text-emerald-700 font-semibold text-xs block">
                        ✓ Fabric pattern successfully mapped onto 3D dress!
                      </span>
                      <button
                        onClick={() => {
                          setTexture(null);
                          setTexturePreview('');
                        }}
                        className="text-xs text-red-500 hover:underline font-medium"
                      >
                        Remove Texture
                      </button>
                    </div>
                  ) : (
                    <label className="cursor-pointer flex flex-col items-center">
                      <Upload className="w-8 h-8 text-[#C85C7A] mb-2" />
                      <span className="font-bold text-xs text-[#3A3033]">Choose Photo or Fabric File</span>
                      <span className="text-[10px] text-[#8D7F84] mt-1">Supports PNG, JPG, WebP</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleTextureUpload}
                      />
                    </label>
                  )}
                </div>
              </div>
            )}

            {/* ================= TAB 4: SHOWROOM PLACEMENT ================= */}
            {activeTab === 'showroom' && (
              <div className="space-y-4 text-xs animate-fadeIn">
                <div>
                  <h4 className="font-bold text-xs text-[#3A3033]">Virtual 3D Showroom Location</h4>
                  <p className="text-[11px] text-[#8D7F84] mt-0.5">
                    Choose which aisle section and rack rail this dress will hang on
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[#8D7F84] mb-1 font-medium">Runway Section</label>
                    <select
                      value={showroomSection}
                      onChange={(e) => setShowroomSection(e.target.value)}
                      className="w-full p-2.5 bg-white border border-[#F2D7E0] rounded-xl outline-none"
                    >
                      <option value="A">Section A · Grand Entrance</option>
                      <option value="B">Section B · Bridal Promenade</option>
                      <option value="C">Section C · Atelier Alcove</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[#8D7F84] mb-1 font-medium">Rack Side & Rail</label>
                    <select
                      value={showroomRack}
                      onChange={(e) => setShowroomRack(e.target.value)}
                      className="w-full p-2.5 bg-white border border-[#F2D7E0] rounded-xl outline-none"
                    >
                      <option value="Left-01">Rack Left-01</option>
                      <option value="Left-02">Rack Left-02</option>
                      <option value="Right-01">Rack Right-01</option>
                      <option value="Right-02">Rack Right-02</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[#8D7F84] mb-1 font-medium">Boutique Price (INR ₹)</label>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full p-2.5 bg-white border border-[#F2D7E0] rounded-xl outline-none"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="pt-4 border-t border-[#F2D7E0] space-y-2">
            <button
              onClick={handlePublishToShowroom}
              disabled={isPublishing}
              className="w-full py-3.5 rounded-2xl btn-loki text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-md"
            >
              {isPublishing ? (
                <span>Materializing on Showroom Rack...</span>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  <span>Publish to 3D Showroom Rack</span>
                </>
              )}
            </button>

            <button
              onClick={handleOrderCustomPiece}
              className="w-full py-3 rounded-2xl bg-[#3A3033] hover:bg-black text-white text-xs font-semibold tracking-wider uppercase flex items-center justify-center gap-2 transition-all"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Order Custom Atelier Piece · ₹{Number(price).toLocaleString()}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

