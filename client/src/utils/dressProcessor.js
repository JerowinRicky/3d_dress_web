// High-performance client-side image processor for fashion dresses
// Automatically detects 4-angle collages, slices Front/Back/Left/Right views,
// extracts pristine dress silhouettes with alpha transparency, and strips studio backgrounds.

export function processDressImage(imageSrc, options = {}) {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      const fullW = img.naturalWidth || img.width;
      const fullH = img.naturalHeight || img.height;
      const aspectRatio = fullW / fullH;

      // Detect if this is a 4-panel multi-angle view collage (aspect ratio >= 1.25)
      const isMultiView = aspectRatio >= 1.25;
      const panelCount = isMultiView ? 4 : 1;

      // Helper: isolate dress from background on a specific canvas region
      function isolatePanel(sourceX, sourceY, sourceW, sourceH) {
        const c = document.createElement('canvas');
        c.width = sourceW;
        c.height = sourceH;
        const ctx = c.getContext('2d');

        // Draw source region
        ctx.drawImage(img, sourceX, sourceY, sourceW, sourceH, 0, 0, sourceW, sourceH);
        const imgData = ctx.getImageData(0, 0, sourceW, sourceH);
        const data = imgData.data;

        // Strip bottom text labels (e.g. "FRONT VIEW", "BACK VIEW" banner in bottom 8.8%)
        const labelBannerHeight = sourceH * 0.088;
        const bannerStartY = sourceH - labelBannerHeight;

        // Strip top mannequin stand finial (top 8%)
        const standFinialHeight = sourceH * 0.08;

        for (let y = 0; y < sourceH; y++) {
          for (let x = 0; x < sourceW; x++) {
            const idx = (y * sourceW + x) * 4;
            const r = data[idx];
            const g = data[idx + 1];
            const b = data[idx + 2];

            // 1. Remove bottom label banner and top stand finial completely
            if (y >= bannerStartY || y <= standFinialHeight) {
              data[idx + 3] = 0;
              continue;
            }

            // 2. White vertical divider between panels (border 2px)
            if (x <= 1 || x >= sourceW - 2) {
              data[idx + 3] = 0;
              continue;
            }

            // 3. Remove mannequin neck wood/linen (top center area below finial)
            const isTopNeck = y < sourceH * 0.17 && Math.abs(x - sourceW / 2) < sourceW * 0.16;
            if (isTopNeck && (g - b > 13) && (r - g < 38)) {
              data[idx + 3] = 0;
              continue;
            }

            // 4. Accurate Chromatic Garment Isolation vs Studio Architecture:
            // The studio background (archway, pillars, beige wall) is warm yellow/beige/terracotta: (g - b >= 13 && r - g <= 36).
            const isStudioBg = (g - b >= 13) && (r - g <= 36);
            if (isStudioBg) {
              data[idx + 3] = 0;
              continue;
            }

            // The couture dress is pink/rose silk and tulle:
            const diffRG = r - g; // Red excess over green
            const diffGB = g - b; // Green excess over blue
            const isDress = (diffRG >= 38 && diffGB <= 14);
            const isDressSoftBorder = (diffRG >= 26 && diffGB <= 11 && y > 115);

            if (isDress) {
              // 100% Opaque vibrant dress
              data[idx + 3] = 255;
            } else if (isDressSoftBorder) {
              // Soft tulle border anti-aliasing
              const factor = (diffRG - 26) / 12;
              data[idx + 3] = Math.round(factor * 220);
            } else if (diffRG >= 20 && diffGB <= 8 && y > 115) {
              // Outer tulle veil
              data[idx + 3] = 140;
            } else {
              // Neutral background transparent
              data[idx + 3] = 0;
            }
          }
        }

        ctx.putImageData(imgData, 0, 0);
        return c.toDataURL('image/png');
      }

      if (isMultiView) {
        const panelW = Math.floor(fullW / 4);
        const frontUrl = isolatePanel(0, 0, panelW, fullH);
        const backUrl = isolatePanel(panelW, 0, panelW, fullH);
        const leftUrl = isolatePanel(panelW * 2, 0, panelW, fullH);
        const rightUrl = isolatePanel(panelW * 3, 0, panelW, fullH);

        resolve({
          isMultiView: true,
          dataUrl: frontUrl, // Primary view for hanging on rack
          views: {
            front: frontUrl,
            back: backUrl,
            left: leftUrl,
            right: rightUrl
          },
          originalWidth: panelW,
          originalHeight: fullH
        });
      } else {
        const frontUrl = isolatePanel(0, 0, fullW, fullH);
        resolve({
          isMultiView: false,
          dataUrl: frontUrl,
          views: {
            front: frontUrl,
            back: frontUrl,
            left: frontUrl,
            right: frontUrl
          },
          originalWidth: fullW,
          originalHeight: fullH
        });
      }
    };

    img.onerror = () => {
      resolve({
        isMultiView: false,
        dataUrl: imageSrc,
        views: { front: imageSrc, back: imageSrc, left: imageSrc, right: imageSrc },
        originalWidth: 400,
        originalHeight: 600
      });
    };

    img.src = imageSrc;
  });
}

// Generates micro-surface 3D normal map from fabric photograph
// Allows Three.js spotlights to bring out realistic 3D depth in embroidery, lace, and cloth pleats
export function generateFabricNormalMap(imageSrc) {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const w = Math.min(512, img.naturalWidth || 512);
      const h = Math.min(768, img.naturalHeight || 768);
      canvas.width = w;
      canvas.height = h;

      ctx.drawImage(img, 0, 0, w, h);
      const src = ctx.getImageData(0, 0, w, h).data;
      const out = ctx.createImageData(w, h);
      const dst = out.data;

      // Sobel normal filter
      for (let y = 1; y < h - 1; y++) {
        for (let x = 1; x < w - 1; x++) {
          const idx = (y * w + x) * 4;
          const left = ((y * w + (x - 1)) * 4);
          const right = ((y * w + (x + 1)) * 4);
          const up = (((y - 1) * w + x) * 4);
          const down = (((y + 1) * w + x) * 4);

          const lumL = (src[left] * 0.299 + src[left + 1] * 0.587 + src[left + 2] * 0.114) / 255;
          const lumR = (src[right] * 0.299 + src[right + 1] * 0.587 + src[right + 2] * 0.114) / 255;
          const lumU = (src[up] * 0.299 + src[up + 1] * 0.587 + src[up + 2] * 0.114) / 255;
          const lumD = (src[down] * 0.299 + src[down + 1] * 0.587 + src[down + 2] * 0.114) / 255;

          const dx = (lumR - lumL) * 2.5;
          const dy = (lumD - lumU) * 2.5;
          const dz = 1.0;

          const len = Math.sqrt(dx * dx + dy * dy + dz * dz);
          const nx = (dx / len) * 0.5 + 0.5;
          const ny = (dy / len) * 0.5 + 0.5;
          const nz = (dz / len) * 0.5 + 0.5;

          dst[idx] = Math.floor(nx * 255);
          dst[idx + 1] = Math.floor(ny * 255);
          dst[idx + 2] = Math.floor(nz * 255);
          dst[idx + 3] = src[idx + 3]; // preserve transparency
        }
      }

      ctx.putImageData(out, 0, 0);
      resolve(canvas.toDataURL('image/png'));
    };

    img.onerror = () => resolve(null);
    img.src = imageSrc;
  });
}

