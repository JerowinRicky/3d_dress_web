import React, { useRef, useMemo, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';
import HangingDress3D from './HangingDress3D';

// Camera & Navigation Manager inside Canvas
function CameraRig({
  targetCameraZ,
  targetLookAngle,
  isInspecting
}) {
  const { camera } = useThree();

  useFrame(() => {
    // Smooth camera Z interpolation (walk down aisle)
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, targetCameraZ.current, 0.08);
    camera.position.y = 1.65;
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, isInspecting ? 0.8 : 0, 0.08);

    // Look target
    const currentAngle = THREE.MathUtils.lerp(camera.rotation.y, targetLookAngle.current, 0.08);
    camera.rotation.y = currentAngle;
  });

  return null;
}

// Single Straight Line Clothing Rack Component (Rose Gold / Brass luxury fixture)
function ClothingRack({ side = 'left', length = 26, zStart = 8 }) {
  const xPos = side === 'left' ? -3.2 : 3.2;
  const goldMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#D4AF37',
    metalness: 0.88,
    roughness: 0.22
  }), []);

  const stanchionCount = 6;
  const stanchions = useMemo(() => {
    const arr = [];
    const step = length / (stanchionCount - 1);
    for (let i = 0; i < stanchionCount; i++) {
      arr.push(zStart - i * step);
    }
    return arr;
  }, [length, zStart]);

  return (
    <group position={[xPos, 0, 0]}>
      {/* Continuous Single-Line Horizontal Hanging Rail */}
      <mesh position={[0, 2.05, zStart - length / 2]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.024, 0.024, length, 24]} />
        <primitive object={goldMat} attach="material" />
      </mesh>

      {/* Top Accent Shelf Bar */}
      <mesh position={[0, 2.3, zStart - length / 2]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.015, 0.015, length, 16]} />
        <primitive object={goldMat} attach="material" />
      </mesh>

      {/* Vertical Support Stanchions with circular weighted floor bases */}
      {stanchions.map((z, idx) => (
        <group key={idx} position={[0, 0, z]}>
          {/* Vertical Post */}
          <mesh position={[0, 1.15, 0]}>
            <cylinderGeometry args={[0.028, 0.028, 2.3, 20]} />
            <primitive object={goldMat} attach="material" />
          </mesh>
          {/* Base Plate */}
          <mesh position={[0, 0.02, 0]}>
            <cylinderGeometry args={[0.22, 0.24, 0.04, 28]} />
            <primitive object={goldMat} attach="material" />
          </mesh>
          {/* Top Decorative Finial */}
          <mesh position={[0, 2.35, 0]}>
            <sphereGeometry args={[0.038, 16, 16]} />
            <primitive object={goldMat} attach="material" />
          </mesh>
        </group>
      ))}

      {/* Warm LED runway strip lighting along the single line rack */}
      <pointLight
        position={[0, 1.95, zStart - length / 2]}
        intensity={1.4}
        distance={length * 0.9}
        color="#FFF2E5"
      />
    </group>
  );
}

// Showroom Architectural Shell (Ceiling, Floor, Columns, Backlit LOKI sign)
function ShowroomArchitecture() {
  const columns = useMemo(() => [
    { x: -4.8, z: 6 },
    { x: -4.8, z: 0 },
    { x: -4.8, z: -6 },
    { x: -4.8, z: -12 },
    { x: 4.8, z: 6 },
    { x: 4.8, z: 0 },
    { x: 4.8, z: -6 },
    { x: 4.8, z: -12 },
  ], []);

  const ceilingLights = useMemo(() => [
    { z: 6 }, { z: 0 }, { z: -6 }, { z: -12 }, { z: -18 }
  ], []);

  return (
    <group>
      {/* High-Gloss Luxury Boutique Floor */}
      <mesh position={[0, 0, -6]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[16, 48]} />
        <meshStandardMaterial
          color="#FFF8FA"
          roughness={0.14}
          metalness={0.12}
        />
      </mesh>

      {/* Runway Center Runner / Rose-tinted Carpet in a Single Line down the Aisle */}
      <mesh position={[0, 0.005, -6]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[2.8, 48]} />
        <meshStandardMaterial
          color="#FFF2F6"
          roughness={0.25}
          metalness={0.05}
        />
      </mesh>

      {/* High Luxury Ceiling with recessed coffers */}
      <mesh position={[0, 4.4, -6]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[16, 48]} />
        <meshStandardMaterial color="#FFFFFF" roughness={0.7} />
      </mesh>

      {/* Recessed Linear Ceiling LED Panels in a Single Center Line */}
      {ceilingLights.map((l, i) => (
        <group key={i} position={[0, 4.38, l.z]}>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <planeGeometry args={[2.0, 3.2]} />
            <meshBasicMaterial color="#FFF9FA" />
          </mesh>
          <pointLight position={[0, -0.4, 0]} intensity={1.5} distance={10} color="#FFF5F8" />
        </group>
      ))}

      {/* Fluted Minimalist Columns */}
      {columns.map((c, i) => (
        <group key={i} position={[c.x, 2.2, c.z]}>
          <mesh>
            <cylinderGeometry args={[0.35, 0.38, 4.4, 32]} />
            <meshStandardMaterial color="#FAF5F7" roughness={0.4} metalness={0.08} />
          </mesh>
          {/* Column Ring Accent */}
          <mesh position={[0, -1.8, 0]}>
            <cylinderGeometry args={[0.4, 0.4, 0.1, 32]} />
            <meshStandardMaterial color="#D4AF37" metalness={0.8} roughness={0.25} />
          </mesh>
        </group>
      ))}

      {/* Back Wall with Grand LOKI Logo & Architectural Niche */}
      <group position={[0, 2.2, -24]}>
        <mesh>
          <planeGeometry args={[16, 4.8]} />
          <meshStandardMaterial color="#FAF0F4" roughness={0.5} />
        </mesh>

        <mesh position={[0, 0, 0.05]}>
          <planeGeometry args={[7.5, 3.6]} />
          <meshStandardMaterial color="#FFF5F8" roughness={0.3} />
        </mesh>

        {/* LOKI Dimensional Signage (Built-in font, safe from network drops) */}
        <Text
          position={[0, 0.6, 0.15]}
          fontSize={1.1}
          color="#3A3033"
          letterSpacing={0.3}
          anchorX="center"
          anchorY="middle"
        >
          L O K I
        </Text>

        <Text
          position={[0, -0.15, 0.15]}
          fontSize={0.24}
          color="#C85C7A"
          letterSpacing={0.25}
          anchorX="center"
          anchorY="middle"
        >
          HAUTE COUTURE ATELIER
        </Text>

        <pointLight position={[0, 0.5, 0.6]} intensity={2.2} distance={8} color="#F6B6C8" />
      </group>

      {/* Ambient Atmospheric Lighting */}
      <ambientLight intensity={1.2} color="#FFF5F8" />
      <directionalLight position={[0, 8, 5]} intensity={1.5} color="#FFF8FA" castShadow />
      <directionalLight position={[0, 8, -12]} intensity={1.3} color="#FFF0F5" />
    </group>
  );
}

// Main 3D Showroom Scene
export default function ShowroomScene({
  products = [],
  selectedProduct = null,
  onSelectProduct,
  activeCategory = 'All',
  searchQuery = '',
  targetCameraZ,
  targetLookAngle,
  isInspecting
}) {
  const containerRef = useRef();

  // Position products in a perfectly aligned SINGLE LINE on Left and Right racks
  const positionedProducts = useMemo(() => {
    // Filter published products
    const filtered = products.filter(p => {
      const matchCat = activeCategory === 'All' || 
        p.category?.toLowerCase() === activeCategory.toLowerCase() ||
        (p.tags && p.tags.some(t => t.toLowerCase() === activeCategory.toLowerCase()));
      const matchSearch = !searchQuery || 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchSearch;
    });

    const leftList = [];
    const rightList = [];

    // Group alternatingly or by assigned side into a single continuous straight line
    filtered.forEach((p, idx) => {
      const side = p.showroomPosition?.side || (idx % 2 === 0 ? 'left' : 'right');
      const sideIndex = side === 'left' ? leftList.length : rightList.length;

      // Each dress positioned in a clean single line spaced by 2.2m along the aisle rail
      const z = 6 - (sideIndex * 2.2);
      const x = side === 'left' ? -3.2 : 3.2;
      const rotY = side === 'left' ? Math.PI / 2 : -Math.PI / 2;

      const item = {
        product: p,
        position: [x, 1.5, z],
        rotation: [0, rotY, 0],
        isHighlighted: !!searchQuery && p.name.toLowerCase().includes(searchQuery.toLowerCase())
      };

      if (side === 'left') {
        leftList.push(item);
      } else {
        rightList.push(item);
      }
    });

    return [...leftList, ...rightList];
  }, [products, activeCategory, searchQuery]);

  return (
    <div ref={containerRef} className="showroom-viewport w-full h-full select-none cursor-grab active:cursor-grabbing bg-[#FFF5F8]">
      <Canvas
        shadows
        camera={{ position: [0, 1.65, 8.5], fov: 52, near: 0.1, far: 80 }}
        gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
      >
        <color attach="background" args={['#FFF5F8']} />
        <fog attach="fog" args={['#FFF3F7', 12, 38]} />

        <Suspense fallback={null}>
          {/* Dynamic Camera Navigation Controller */}
          <CameraRig
            targetCameraZ={targetCameraZ}
            targetLookAngle={targetLookAngle}
            isInspecting={isInspecting}
          />

          {/* 3D Boutique Architecture */}
          <ShowroomArchitecture />

          {/* Left & Right Clothing Racks (Single continuous line on each side) */}
          <ClothingRack side="left" length={26} zStart={8} />
          <ClothingRack side="right" length={26} zStart={8} />

          {/* Dresses Hanging on Racks in a Single Line */}
          {positionedProducts.map(({ product, position, rotation, isHighlighted }) => (
            <HangingDress3D
              key={product.id || product.productId}
              product={product}
              position={position}
              rotation={rotation}
              onSelect={onSelectProduct}
              isPickedUp={selectedProduct?.id === product.id}
              isHighlighted={isHighlighted}
            />
          ))}
        </Suspense>
      </Canvas>
    </div>
  );
}
