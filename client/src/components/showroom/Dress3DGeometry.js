import * as THREE from 'three';

// Creates a natural, undulating haute-couture cloth skirt with realistic folds & drapes
export function createCoutureSkirtGeometry(style = 'gown', options = {}) {
  const {
    pleatCount = style === 'pleated' ? 14 : 8,
    pleatDepth = style === 'ballgown' ? 0.08 : 0.05,
    topRadius = 0.21,
    bottomRadius = style === 'ballgown' ? 0.85 : (style === 'mermaid' ? 0.65 : (style === 'slip' ? 0.42 : 0.60)),
    height = 1.35
  } = options;

  const geom = new THREE.CylinderGeometry(topRadius, bottomRadius, height, 64, 32, true);
  const pos = geom.attributes.position;
  const halfH = height / 2;

  for (let i = 0; i < pos.count; i++) {
    const y = pos.getY(i);
    let x = pos.getX(i);
    let z = pos.getZ(i);
    const angle = Math.atan2(z, x);
    let radius = Math.sqrt(x * x + z * z);

    // Normalize height from waist (0.0) to floor (1.0)
    const factor = Math.max(0, (halfH - y) / height);

    if (style === 'mermaid') {
      // Mermaid: tight down to thighs (factor < 0.6), dramatic flare below
      if (factor < 0.55) {
        radius = topRadius * (1 + 0.15 * Math.sin(factor * Math.PI));
      } else {
        const fl = (factor - 0.55) / 0.45;
        radius = topRadius * 1.1 + (bottomRadius - topRadius * 1.1) * Math.pow(fl, 1.8);
        const wave = Math.cos(angle * pleatCount) * pleatDepth * 1.4 * fl;
        radius += wave;
      }
    } else if (style === 'ballgown') {
      // Voluminous bell curvature
      const bell = Math.sin(factor * Math.PI * 0.5);
      radius = topRadius + (bottomRadius - topRadius) * bell;
      const wave = Math.cos(angle * pleatCount) * (pleatDepth * 1.2 * factor);
      radius += wave;
    } else if (style === 'slip') {
      // Subtle liquid satin bias drape
      const wave = Math.cos(angle * 5) * (0.02 * factor) + Math.sin(angle * 3) * (0.015 * factor);
      radius += wave;
    } else {
      // Classic A-line / Couture Evening Gown with natural cascading ripples
      const wave = (Math.cos(angle * pleatCount) * 0.7 + Math.cos(angle * (pleatCount * 2)) * 0.3) * pleatDepth * factor;
      radius += wave;
    }

    pos.setX(i, Math.cos(angle) * radius);
    pos.setZ(i, Math.sin(angle) * radius);
  }

  geom.computeVertexNormals();
  return geom;
}

// Creates sculpted bodice with bust contours and tailored waist
export function createCoutureBodiceGeometry(neckline = 'sweetheart') {
  const geom = new THREE.CylinderGeometry(0.24, 0.20, 0.42, 48, 16, true);
  const pos = geom.attributes.position;
  const halfH = 0.21;

  for (let i = 0; i < pos.count; i++) {
    const y = pos.getY(i);
    let x = pos.getX(i);
    let z = pos.getZ(i);
    const angle = Math.atan2(z, x);
    let radius = Math.sqrt(x * x + z * z);

    // Front bust projection (positive Z)
    const isFront = z > 0;
    if (isFront && y > -0.05) {
      // Natural bust curves on left & right chest
      const sideFactor = Math.abs(x) / 0.2;
      const bustBulge = Math.sin(sideFactor * Math.PI) * 0.045 * (y + 0.1);
      z += bustBulge;
      
      // Sweetheart neckline dip in middle
      if (neckline === 'sweetheart' && Math.abs(x) < 0.06 && y > 0.1) {
        pos.setY(i, y - 0.05 * (1 - Math.abs(x) / 0.06));
      }
    }

    pos.setX(i, x);
    pos.setZ(i, z);
  }

  geom.computeVertexNormals();
  return geom;
}

