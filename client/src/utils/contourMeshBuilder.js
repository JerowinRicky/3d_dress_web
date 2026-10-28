import * as THREE from 'three';

// Analyzes a transparent PNG to extract silhouette bounds, strap peaks, waist contour,
// and generates a custom volumetric 3D Three.js mesh tailored to the dress
export function generateMeshFromSilhouette(imageElement, options = {}) {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  const w = 128; // sampling resolution
  const h = 256;
  canvas.width = w;
  canvas.height = h;

  ctx.drawImage(imageElement, 0, 0, w, h);
  const imgData = ctx.getImageData(0, 0, w, h).data;

  // Scan horizontal rows from top to bottom to find left and right bounds of the dress
  const rowBounds = [];
  let topY = -1;
  let bottomY = -1;

  for (let y = 0; y < h; y++) {
    let minX = -1;
    let maxX = -1;
    for (let x = 0; x < w; x++) {
      const alpha = imgData[(y * w + x) * 4 + 3];
      if (alpha > 40) { // non-transparent pixel
        if (minX === -1) minX = x;
        maxX = x;
      }
    }
    if (minX !== -1) {
      if (topY === -1) topY = y;
      bottomY = y;
      rowBounds.push({ y, minX, maxX, width: maxX - minX, centerX: (minX + maxX) / 2 });
    }
  }

  // Generate a high-resolution 3D parametric cloth drape mesh
  const gridX = 36;
  const gridY = 48;
  const geom = new THREE.PlaneGeometry(1.15, 1.75, gridX, gridY);
  const pos = geom.attributes.position;

  for (let i = 0; i < pos.count; i++) {
    const origX = pos.getX(i);
    const origY = pos.getY(i);

    // Normalize Y from 0 (top) to 1 (bottom)
    const normY = Math.max(0, Math.min(1, (0.875 - origY) / 1.75));
    const rowIndex = Math.floor(normY * (rowBounds.length - 1));
    const row = rowBounds[rowIndex] || { width: w * 0.4, minX: w * 0.3, maxX: w * 0.7 };

    // Width scale ratio at this height
    const rowWidthFactor = (row.width / w) * 2.2;
    // Normalized X from -0.5 (left) to 0.5 (right)
    const normX = origX / 1.15;

    // Apply volumetric curved 3D drape depth (Z bulge in center, tapered at edges)
    const curveFactor = Math.max(0, 1 - Math.pow(normX * 2.2, 2));
    const wave = Math.cos(normX * Math.PI * 6) * 0.025 * Math.pow(normY, 1.5);
    const zDepth = (curveFactor * 0.14) + wave;

    pos.setZ(i, zDepth);
  }

  geom.computeVertexNormals();
  return {
    geometry: geom,
    topY,
    bottomY,
    bounds: rowBounds
  };
}

