import React, { useRef, useState, useEffect, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { processDressImage } from '../../utils/dressProcessor';

// Creates a front or back draped garment shell with realistic 3D volume
function createGarmentShellGeometry(isFront = true, topWidth = 0.68, waistWidth = 0.44, hemWidth = 1.05, height = 1.75, depth = 0.075) {
  const geom = new THREE.PlaneGeometry(0.72, height, 32, 40);
  const pos = geom.attributes.position;
  const halfH = height / 2;
  const sign = isFront ? 1 : -1;

  for (let i = 0; i < pos.count; i++) {
    const rawX = pos.getX(i); // -0.36 to +0.36
    const y = pos.getY(i);
    const normY = (y + halfH) / height; // 0 at hem, 1 at top

    // Taper width naturally:
    let widthScale;
    if (normY > 0.62) {
      widthScale = THREE.MathUtils.lerp(waistWidth / 0.72, topWidth / 0.72, (normY - 0.62) / 0.38);
    } else {
      widthScale = THREE.MathUtils.lerp(hemWidth / 0.72, waistWidth / 0.72, normY / 0.62);
    }
    pos.setX(i, rawX * widthScale);

    // Z-curvature: creates volume between front and back
    const xNorm = rawX / 0.36;
    const archFactor = Math.max(0, 1 - Math.pow(xNorm, 2));

    // Vertical undulating pleat wave on the lower skirt
    const skirtFactor = Math.max(0, 0.62 - normY) / 0.62;
    const pleatWave = Math.sin(xNorm * Math.PI * 3.5) * 0.02 * skirtFactor;

    pos.setZ(i, (archFactor * depth + pleatWave) * sign);
  }

  geom.computeVertexNormals();
  return geom;
}

export default function HangingDress3D({
  product,
  position,
  rotation = [0, 0, 0],
  onSelect,
  isPickedUp = false,
  isHighlighted = false
}) {
  const groupRef = useRef();
  const dressRef = useRef();
  const [hovered, setHovered] = useState(false);
  const [frontTexture, setFrontTexture] = useState(null);
  const [backTexture, setBackTexture] = useState(null);

  // Parse colors
  const dressColor = useMemo(() => new THREE.Color(product.colorCode || '#F6B6C8'), [product.colorCode]);
  const goldColor = useMemo(() => new THREE.Color('#D4AF37'), []);

  // Dual volumetric front and back sculpted gown geometries
  const frontShellGeom = useMemo(() => createGarmentShellGeometry(true, 0.68, 0.44, 1.05, 1.75, 0.075), []);
  const backShellGeom = useMemo(() => createGarmentShellGeometry(false, 0.68, 0.44, 1.05, 1.75, 0.075), []);

  // Safe async texture loader with alpha transparency & automatic background removal
  useEffect(() => {
    let active = true;
    const loader = new THREE.TextureLoader();

    const configureTex = (tex) => {
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.generateMipmaps = true;
      tex.minFilter = THREE.LinearMipmapLinearFilter;
      tex.magFilter = THREE.LinearFilter;
      return tex;
    };

    const frontSrc = product.images?.front;
    const backSrc = product.images?.back;

    if (frontSrc) {
      const isSvg = typeof frontSrc === 'string' && frontSrc.includes('image/svg');
      const isAlreadyIsolated = typeof frontSrc === 'string' && (frontSrc.includes('sliced-') || frontSrc.includes('loki-ai-front-'));

      if (isSvg || isAlreadyIsolated) {
        loader.load(
          frontSrc,
          (tex) => {
            if (!active) return;
            setFrontTexture(configureTex(tex));
          },
          undefined,
          () => { if (active) setFrontTexture(null); }
        );
      } else {
        processDressImage(frontSrc)
          .then((res) => {
            if (!active) return;
            loader.load(res.dataUrl, (tex) => {
              if (active) setFrontTexture(configureTex(tex));
            });
            if (res.views?.back && !backSrc) {
              loader.load(res.views.back, (tex) => {
                if (active) setBackTexture(configureTex(tex));
              });
            }
          })
          .catch(() => {
            if (!active) return;
            loader.load(frontSrc, (tex) => {
              if (active) setFrontTexture(configureTex(tex));
            });
          });
      }
    }

    if (backSrc) {
      const isSvg = typeof backSrc === 'string' && backSrc.includes('image/svg');
      const isAlreadyIsolated = typeof backSrc === 'string' && (backSrc.includes('sliced-') || backSrc.includes('loki-ai-back-'));

      if (isSvg || isAlreadyIsolated) {
        loader.load(
          backSrc,
          (tex) => {
            if (!active) return;
            setBackTexture(configureTex(tex));
          },
          undefined,
          () => { if (active) setBackTexture(null); }
        );
      } else {
        processDressImage(backSrc)
          .then((res) => {
            if (!active) return;
            loader.load(res.dataUrl, (tex) => {
              if (active) setBackTexture(configureTex(tex));
            });
          })
          .catch(() => {
            if (!active) return;
            loader.load(backSrc, (tex) => {
              if (active) setBackTexture(configureTex(tex));
            });
          });
      }
    }

    return () => {
      active = false;
    };
  }, [product.images?.front, product.images?.back]);

  // Gentle idle swaying animation in showroom air currents
  useFrame((state) => {
    if (!dressRef.current) return;
    const t = state.clock.getElapsedTime();
    const swayOffset = (position[0] * 3 + position[2]) * 0.5;

    // Idle gentle sway
    if (!hovered && !isPickedUp) {
      dressRef.current.rotation.z = Math.sin(t * 1.4 + swayOffset) * 0.02;
      dressRef.current.rotation.y = Math.cos(t * 1.1 + swayOffset) * 0.025;
      dressRef.current.position.y = 0;
    } else if (hovered && !isPickedUp) {
      // Hover subtle lift and tilt
      dressRef.current.rotation.z = THREE.MathUtils.lerp(dressRef.current.rotation.z, 0.04, 0.1);
      dressRef.current.position.y = THREE.MathUtils.lerp(dressRef.current.position.y, 0.08, 0.1);
    }
  });

  return (
    <group
      ref={groupRef}
      position={position}
      rotation={rotation}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={() => {
        setHovered(false);
        document.body.style.cursor = 'auto';
      }}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(product);
      }}
    >
      <group ref={dressRef}>
        {/* ================= DESIGNER HANGER (Single Clean Fixture) ================= */}
        {/* Swivel Gold Hook */}
        <mesh position={[0, 0.56, 0]}>
          <torusGeometry args={[0.07, 0.012, 16, 24, Math.PI * 1.2]} />
          <meshStandardMaterial color={goldColor} metalness={0.92} roughness={0.18} />
        </mesh>
        <mesh position={[0, 0.49, 0]}>
          <cylinderGeometry args={[0.012, 0.012, 0.08, 16]} />
          <meshStandardMaterial color={goldColor} metalness={0.92} roughness={0.18} />
        </mesh>

        {/* Sculpted Curved Wooden/Gold Shoulder Hanger Bar */}
        <group position={[0, 0.44, 0]}>
          <mesh>
            <boxGeometry args={[0.82, 0.024, 0.03]} />
            <meshStandardMaterial color="#E8C39E" roughness={0.35} metalness={0.15} />
          </mesh>
          {/* Gold end-caps */}
          <mesh position={[-0.41, 0, 0]}>
            <sphereGeometry args={[0.02, 16, 16]} />
            <meshStandardMaterial color={goldColor} metalness={0.92} roughness={0.2} />
          </mesh>
          <mesh position={[0.41, 0, 0]}>
            <sphereGeometry args={[0.02, 16, 16]} />
            <meshStandardMaterial color={goldColor} metalness={0.92} roughness={0.2} />
          </mesh>
        </group>

        {/* ================= VOLUMETRIC 3D HAUTE-COUTURE GOWN ================= */}
        {/* Front Garment Shell */}
        <mesh geometry={frontShellGeom} position={[0, -0.42, 0]}>
          <meshStandardMaterial
            map={frontTexture || null}
            color={frontTexture ? '#FFFFFF' : dressColor}
            transparent={true}
            alphaTest={0.06}
            roughness={0.32}
            metalness={0.08}
            side={THREE.FrontSide}
            emissive={hovered || isHighlighted ? dressColor : '#000000'}
            emissiveIntensity={hovered ? 0.35 : (isHighlighted ? 0.5 : 0)}
          />
        </mesh>

        {/* Back Garment Shell */}
        <mesh geometry={backShellGeom} position={[0, -0.42, 0]}>
          <meshStandardMaterial
            map={backTexture || frontTexture || null}
            color={backTexture || frontTexture ? '#FFFFFF' : dressColor}
            transparent={true}
            alphaTest={0.06}
            roughness={0.36}
            metalness={0.08}
            side={THREE.FrontSide}
            emissive={hovered || isHighlighted ? dressColor : '#000000'}
            emissiveIntensity={hovered ? 0.35 : (isHighlighted ? 0.5 : 0)}
          />
        </mesh>

        {/* Soft Realistic Contact Shadow on Floor */}
        <mesh position={[0, -1.68, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[0.48, 24]} />
          <meshBasicMaterial color="#DEC0CC" transparent opacity={hovered ? 0.45 : 0.22} />
        </mesh>

        {/* Interactive Floating Hover Tooltip */}
        {hovered && (
          <Html
            position={[0, 0.8, 0]}
            center
            distanceFactor={9}
            style={{ pointerEvents: 'none' }}
          >
            <div className="glass-panel px-3 py-2 rounded-xl shadow-loki text-center whitespace-nowrap border border-[#F6B6C8] transform -translate-y-2 animate-bounce transition-all">
              <span className="text-[10px] tracking-widest uppercase font-semibold text-[#C85C7A] block">
                {product.category}
              </span>
              <p className="font-serif text-sm font-bold text-[#3A3033] leading-tight">
                {product.name}
              </p>
              <div className="flex items-center justify-center gap-1.5 mt-0.5">
                <span className="font-bold text-xs text-[#C85C7A]">₹{product.price.toLocaleString()}</span>
                {product.discount && (
                  <span className="text-[9px] bg-[#FCE4EC] text-[#C85C7A] px-1 py-0.2 rounded font-medium">
                    {product.discount}
                  </span>
                )}
              </div>
              <span className="text-[9px] text-[#8D7F84] mt-1 block">Click to inspect in 360°</span>
            </div>
          </Html>
        )}
      </group>
    </group>
  );
}
