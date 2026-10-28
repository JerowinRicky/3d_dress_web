// Generates crisp, luxury fashion editorial illustrations for 4 camera angles:
// Front, Back, Left, and Right views with soft blush / pastel palettes

export function generateDressSvg({ name, primaryColor, secondaryColor, accentColor, style = 'gown' }) {
  const c1 = primaryColor || '#F6B6C8';
  const c2 = secondaryColor || '#FCE4EC';
  const cAcc = accentColor || '#C85C7A';

  const makeSvg = (view) => {
    let dressPath = '';
    let details = '';
    let angleLabel = view.toUpperCase();

    if (view === 'front') {
      dressPath = `
        <!-- Bodice Front -->
        <path d="M165,110 Q190,125 200,160 Q210,125 235,110 L245,185 Q200,200 155,185 Z" fill="${c1}" stroke="${cAcc}" stroke-width="1.5" />
        <!-- Sweetheart/Neckline -->
        <path d="M175,110 Q200,135 225,110 Q200,122 175,110 Z" fill="${c2}" opacity="0.9" />
        <!-- Waistband with subtle rose buckle -->
        <path d="M158,185 L242,185 L240,205 L160,205 Z" fill="${cAcc}" />
        <circle cx="200" cy="195" r="5" fill="#FFF" stroke="${cAcc}" stroke-width="1.5" />
        <!-- Sweeping Skirt Front with Pleats and Volumetric Shading -->
        <path d="M160,205 Q120,380 90,470 Q200,490 310,470 Q280,380 240,205 Z" fill="url(#skirtGradFront)" />
        <path d="M180,205 Q165,340 145,475" stroke="${cAcc}" stroke-width="1.2" opacity="0.4" fill="none" />
        <path d="M200,205 Q200,340 200,480" stroke="${cAcc}" stroke-width="1.5" opacity="0.5" fill="none" />
        <path d="M220,205 Q235,340 255,475" stroke="${cAcc}" stroke-width="1.2" opacity="0.4" fill="none" />
      `;
      details = `
        <!-- Floating organza overlay -->
        <path d="M155,185 Q110,340 100,465 Q150,480 200,475 Q150,330 158,195 Z" fill="#FFF" opacity="0.18" />
      `;
    } else if (view === 'back') {
      dressPath = `
        <!-- Bodice Back (Low scoop / lace-up corset) -->
        <path d="M165,110 L175,170 Q200,185 225,170 L235,110 L245,185 Q200,200 155,185 Z" fill="${c1}" stroke="${cAcc}" stroke-width="1.5" />
        <!-- Corset Lacing -->
        <line x1="185" y1="120" x2="215" y2="135" stroke="${cAcc}" stroke-width="2" />
        <line x1="215" y1="120" x2="185" y2="135" stroke="${cAcc}" stroke-width="2" />
        <line x1="185" y1="140" x2="215" y2="155" stroke="${cAcc}" stroke-width="2" />
        <line x1="215" y1="140" x2="185" y2="155" stroke="${cAcc}" stroke-width="2" />
        <line x1="190" y1="160" x2="210" y2="170" stroke="${cAcc}" stroke-width="2" />
        <!-- Waistband Back with delicate bow tie -->
        <path d="M158,185 L242,185 L240,205 L160,205 Z" fill="${cAcc}" />
        <ellipse cx="193" cy="205" rx="10" ry="5" fill="${c1}" stroke="${cAcc}" stroke-width="1" />
        <ellipse cx="207" cy="205" rx="10" ry="5" fill="${c1}" stroke="${cAcc}" stroke-width="1" />
        <!-- Skirt Back with Flowing Train -->
        <path d="M160,205 Q115,380 75,485 Q200,510 325,485 Q285,380 240,205 Z" fill="url(#skirtGradBack)" />
        <path d="M200,205 Q200,360 200,500" stroke="${cAcc}" stroke-width="2" opacity="0.6" fill="none" stroke-dasharray="4,4" />
      `;
      details = `
        <!-- Flowing back train ribbon -->
        <path d="M195,205 Q175,320 160,490" stroke="${c2}" stroke-width="6" opacity="0.5" fill="none" />
        <path d="M205,205 Q225,320 240,490" stroke="${c2}" stroke-width="6" opacity="0.5" fill="none" />
      `;
    } else if (view === 'left') {
      dressPath = `
        <!-- Bodice Left Profile -->
        <path d="M190,110 Q215,130 220,165 Q215,190 200,205 L180,205 Q180,160 185,110 Z" fill="${c1}" stroke="${cAcc}" stroke-width="1.5" />
        <!-- Bust line & curvature -->
        <path d="M190,110 Q225,140 215,185 L185,185 Z" fill="${c2}" opacity="0.5" />
        <path d="M180,185 L205,185 L202,205 L180,205 Z" fill="${cAcc}" />
        <!-- Skirt Left Profile with High Slit & Elegant Side Flare -->
        <path d="M180,205 Q160,330 130,475 Q210,485 240,470 Q230,350 202,205 Z" fill="url(#skirtGradProfile)" />
        <!-- Elegant Side Slit Accent -->
        <path d="M210,240 Q215,350 225,440" stroke="#FFF" stroke-width="3" opacity="0.8" fill="none" />
      `;
      details = `
        <text x="200" y="360" font-family="Montserrat" font-size="9" fill="${cAcc}" opacity="0.4" text-anchor="middle">ATELIER DRAPE</text>
      `;
    } else {
      // Right view
      dressPath = `
        <!-- Bodice Right Profile -->
        <path d="M210,110 Q185,130 180,165 Q185,190 200,205 L220,205 Q220,160 215,110 Z" fill="${c1}" stroke="${cAcc}" stroke-width="1.5" />
        <!-- Bust line & curvature -->
        <path d="M210,110 Q175,140 185,185 L215,185 Z" fill="${c2}" opacity="0.5" />
        <path d="M195,185 L220,185 L220,205 L198,205 Z" fill="${cAcc}" />
        <!-- Skirt Right Profile with Cascading Hemline -->
        <path d="M198,205 Q170,350 160,470 Q190,485 270,475 Q240,330 220,205 Z" fill="url(#skirtGradProfile)" />
        <path d="M190,240 Q185,350 175,440" stroke="#FFF" stroke-width="3" opacity="0.8" fill="none" />
      `;
      details = `
        <text x="200" y="360" font-family="Montserrat" font-size="9" fill="${cAcc}" opacity="0.4" text-anchor="middle">LOKI COUTURE</text>
      `;
    }

    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 520" width="400" height="520">
      <defs>
        <linearGradient id="skirtGradFront" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="${c1}" />
          <stop offset="50%" stop-color="${c2}" />
          <stop offset="100%" stop-color="${c1}" />
        </linearGradient>
        <linearGradient id="skirtGradBack" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="${c1}" />
          <stop offset="70%" stop-color="${c2}" />
          <stop offset="100%" stop-color="${cAcc}" stop-opacity="0.6" />
        </linearGradient>
        <linearGradient id="skirtGradProfile" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="${c1}" />
          <stop offset="60%" stop-color="${c2}" />
          <stop offset="100%" stop-color="${cAcc}" stop-opacity="0.5" />
        </linearGradient>
        <filter id="subtleGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="8" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
        <radialGradient id="studioLighting" cx="50%" cy="30%" r="70%">
          <stop offset="0%" stop-color="#FFFFFF" stop-opacity="1" />
          <stop offset="60%" stop-color="#FFF5F8" stop-opacity="0.9" />
          <stop offset="100%" stop-color="#FCE4EC" stop-opacity="0.6" />
        </radialGradient>
      </defs>

      <!-- Showroom Studio Backdrop with Soft Radial Vignette -->
      <rect width="400" height="520" fill="url(#studioLighting)" rx="16" />
      
      <!-- Subtle Luxury Floor Reflection Line -->
      <ellipse cx="200" cy="495" rx="140" ry="12" fill="#EAD5DC" opacity="0.4" />
      <ellipse cx="200" cy="495" rx="70" ry="6" fill="${cAcc}" opacity="0.2" />

      <!-- Rose Gold Designer Hanger with Hook -->
      <path d="M200,45 C190,45 190,25 200,25 C210,25 210,45 200,55" fill="none" stroke="#D4AF37" stroke-width="3" stroke-linecap="round" />
      <path d="M140,110 Q200,75 260,110" fill="none" stroke="#D4AF37" stroke-width="4.5" stroke-linecap="round" />
      <circle cx="200" cy="72" r="3" fill="#D4AF37" />

      <!-- Dress Straps / Sleeves -->
      <path d="M165,110 L175,78" stroke="${cAcc}" stroke-width="2.5" />
      <path d="M235,110 L225,78" stroke="${cAcc}" stroke-width="2.5" />

      <!-- Dress Geometry -->
      ${dressPath}
      ${details}

      <!-- Editorial Watermark & Angle Badge -->
      <g transform="translate(20, 30)">
        <rect x="0" y="0" width="75" height="24" rx="12" fill="#FFFFFF" fill-opacity="0.85" stroke="#F2D7E0" stroke-width="1" />
        <text x="37.5" y="16" font-family="Montserrat" font-size="10" font-weight="600" fill="${cAcc}" text-anchor="middle" letter-spacing="1.5">${angleLabel}</text>
      </g>
      
      <g transform="translate(300, 30)">
        <text x="80" y="16" font-family="Cormorant Garamond" font-size="16" font-weight="600" font-style="italic" fill="#3A3033" opacity="0.4" text-anchor="end">LOKI</text>
      </g>
    </svg>`;
  };

  const toDataUrl = (svgStr) => `data:image/svg+xml;utf8,${encodeURIComponent(svgStr)}`;

  return {
    front: toDataUrl(makeSvg('front')),
    back: toDataUrl(makeSvg('back')),
    left: toDataUrl(makeSvg('left')),
    right: toDataUrl(makeSvg('right'))
  };
}

