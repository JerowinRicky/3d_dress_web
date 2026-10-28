import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateDressSvg } from './dressVisuals.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.join(__dirname, 'data');
const DATA_FILE = path.join(DATA_DIR, 'store.json');

// Ensure data folder exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const initialProducts = [
  {
    id: 'loki-floral-couture',
    productId: 'LK-COUT-001',
    name: 'Petal Blossom Embroidered Tulle Gown',
    category: 'Evening Wear',
    description: 'An ethereal haute-couture floor-length ballgown with hand-embroidered 3D floral appliqués and vine beadwork on a sweetheart corset bodice, flowing into pleated rose chiffon layers.',
    price: 9499,
    originalPrice: 14999,
    discount: '37% OFF',
    rating: 5.0,
    reviewCount: 168,
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: ['Blush Pink', 'Floral Rose'],
    material: 'French Tulle, Silk Crepe, Hand-sewn 3D Blossoms',
    brand: 'LOKI Haute Couture',
    tags: ['Evening', 'Couture', 'Floral', 'Embroidered', 'Sweetheart'],
    status: 'Published',
    featured: true,
    newArrival: true,
    stockQuantity: 12,
    soldCount: 58,
    colorCode: '#F8B4C4',
    dressStyle: 'gown',
    neckline: 'sweetheart',
    showroomPosition: {
      section: 'A',
      rack: 'Left-01',
      side: 'left',
      position: 0,
      displayOrder: 0
    },
    images: {
      front: '/presets/couture-floral-gown.png',
      back: '/presets/couture-floral-gown.png',
      left: '/presets/couture-floral-gown.png',
      right: '/presets/couture-floral-gown.png'
    }
  },
  {
    id: 'loki-01',
    productId: 'LK-EVN-001',
    name: 'Rose Blossom Silk Evening Gown',
    category: 'Evening Wear',
    description: 'A breathtaking floor-length couture evening gown crafted from 100% pure Mulberry silk. Features a sculpted corset bodice with sweetheart neckline and flowing organza cascading hemline. Inspired by morning Parisian rose gardens.',
    price: 6499,
    originalPrice: 9999,
    discount: '35% OFF',
    rating: 4.9,
    reviewCount: 142,
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: ['Soft Blush Pink', 'Rose Gold'],
    material: '100% Pure Mulberry Silk & Delicate Organza',
    brand: 'LOKI Atelier Couture',
    tags: ['Evening', 'Silk', 'Blush', 'Couture', 'Floor-length'],
    status: 'Published',
    featured: true,
    newArrival: true,
    stockQuantity: 18,
    soldCount: 46,
    colorCode: '#F6B6C8',
    dressStyle: 'gown',
    showroomPosition: {
      section: 'A',
      rack: 'Left-01',
      side: 'left',
      position: 0,
      displayOrder: 1
    },
    images: generateDressSvg({
      name: 'Rose Blossom Silk Evening Gown',
      primaryColor: '#F6B6C8',
      secondaryColor: '#FCE4EC',
      accentColor: '#C85C7A',
      style: 'gown'
    })
  },
  {
    id: 'loki-02',
    productId: 'LK-PRT-002',
    name: 'Whispering Peony Chiffon Dress',
    category: 'Party Wear',
    description: 'Airy, whimsical pleated dress featuring hand-pressed accordion pleats and a flattering defined waist. Perfect for cocktail receptions, garden parties, and celebratory soirees.',
    price: 4999,
    originalPrice: 7499,
    discount: '33% OFF',
    rating: 4.8,
    reviewCount: 98,
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Petal Pink', 'Pearl White'],
    material: 'Fine Italian Silk Chiffon with Satin Lining',
    brand: 'LOKI Atelier',
    tags: ['Party', 'Pleated', 'Pink', 'Chiffon'],
    status: 'Published',
    featured: true,
    newArrival: false,
    stockQuantity: 25,
    soldCount: 72,
    colorCode: '#FADADD',
    dressStyle: 'pleated',
    showroomPosition: {
      section: 'A',
      rack: 'Left-01',
      side: 'left',
      position: 1,
      displayOrder: 2
    },
    images: generateDressSvg({
      name: 'Whispering Peony Chiffon Dress',
      primaryColor: '#FADADD',
      secondaryColor: '#FFF0F5',
      accentColor: '#D87093',
      style: 'pleated'
    })
  },
  {
    id: 'loki-03',
    productId: 'LK-PRM-003',
    name: 'Lavender Mist Satin Slip Gown',
    category: 'Premium Collection',
    description: 'Minimalist 90s-inspired liquid satin slip dress in an ethereal soft lavender blush tone. Bias-cut silhouette drapes effortlessly against the body with a delicate cowl neckline and lace-up back.',
    price: 7299,
    originalPrice: 11999,
    discount: '40% OFF',
    rating: 5.0,
    reviewCount: 84,
    sizes: ['S', 'M', 'L'],
    colors: ['Very Light Lavender', 'Blush Tint'],
    material: 'Heavyweight Lustrous Liquid Satin',
    brand: 'LOKI Signature',
    tags: ['Slip', 'Lavender', 'Minimal', 'Satin', 'Cowl Neck'],
    status: 'Published',
    featured: true,
    newArrival: true,
    stockQuantity: 12,
    soldCount: 39,
    colorCode: '#E6D5E8',
    dressStyle: 'slip',
    showroomPosition: {
      section: 'A',
      rack: 'Left-01',
      side: 'left',
      position: 2,
      displayOrder: 3
    },
    images: generateDressSvg({
      name: 'Lavender Mist Satin Slip Gown',
      primaryColor: '#E6D5E8',
      secondaryColor: '#F8EEF8',
      accentColor: '#9370DB',
      style: 'slip'
    })
  },
  {
    id: 'loki-04',
    productId: 'LK-WED-004',
    name: 'Champagne Elegance Tiered Gown',
    category: 'Wedding',
    description: 'An architectural bridal and gala masterpiece. Layered cascading tiers of delicate French tulle over a corset bodice embellished with subtle pearl and metallic shimmer threading.',
    price: 12999,
    originalPrice: 18999,
    discount: '31% OFF',
    rating: 4.9,
    reviewCount: 62,
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: ['Champagne Ivory', 'Rose Gold Accents'],
    material: 'French Tulle, Silk Crepe, Hand-beaded Crystals',
    brand: 'LOKI Bridal & Gala',
    tags: ['Wedding', 'Gala', 'Champagne', 'Couture', 'Tulle'],
    status: 'Published',
    featured: true,
    newArrival: false,
    stockQuantity: 8,
    soldCount: 21,
    colorCode: '#F7EDE2',
    dressStyle: 'a-line',
    showroomPosition: {
      section: 'A',
      rack: 'Right-01',
      side: 'right',
      position: 0,
      displayOrder: 4
    },
    images: generateDressSvg({
      name: 'Champagne Elegance Tiered Gown',
      primaryColor: '#F7EDE2',
      secondaryColor: '#FFFDF9',
      accentColor: '#C49A45',
      style: 'a-line'
    })
  },
  {
    id: 'loki-05',
    productId: 'LK-EVN-005',
    name: 'Blush Dahlia Corset Maxi',
    category: 'Evening Wear',
    description: 'Romantic floor-grazing maxi dress with a structured boned corset, draped off-the-shoulder straps, and a sweeping side leg opening. A customer favorite for galas and red-carpet moments.',
    price: 5599,
    originalPrice: 8499,
    discount: '34% OFF',
    rating: 4.8,
    reviewCount: 110,
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Blush Rose', 'Nude Peach'],
    material: 'Double-faced Silk Crepe with Soft Spandex Blend',
    brand: 'LOKI Atelier',
    tags: ['Evening', 'Corset', 'Blush', 'Maxi', 'Off-shoulder'],
    status: 'Published',
    featured: false,
    newArrival: false,
    stockQuantity: 30,
    soldCount: 88,
    colorCode: '#F4C2C2',
    dressStyle: 'gown',
    showroomPosition: {
      section: 'A',
      rack: 'Right-01',
      side: 'right',
      position: 1,
      displayOrder: 5
    },
    images: generateDressSvg({
      name: 'Blush Dahlia Corset Maxi',
      primaryColor: '#F4C2C2',
      secondaryColor: '#FCE4EC',
      accentColor: '#C85C7A',
      style: 'gown'
    })
  },
  {
    id: 'loki-06',
    productId: 'LK-PRT-006',
    name: 'Aurora Rose Halter Cocktail Dress',
    category: 'Party Wear',
    description: 'Sensational halter-neck mini-to-midi cocktail dress with high-gloss sheen and a sculptural crossover neckline. Tailored for unforgettable nights out.',
    price: 4299,
    originalPrice: 5999,
    discount: '28% OFF',
    rating: 4.7,
    reviewCount: 75,
    sizes: ['XS', 'S', 'M', 'L'],
    colors: ['Deep Rose', 'Warm Blush'],
    material: 'Heavy Silk Satin with stretch comfort lining',
    brand: 'LOKI Atelier',
    tags: ['Party', 'Cocktail', 'Halter', 'Rose', 'Midi'],
    status: 'Published',
    featured: false,
    newArrival: true,
    stockQuantity: 15,
    soldCount: 42,
    colorCode: '#E8A2B8',
    dressStyle: 'cocktail',
    showroomPosition: {
      section: 'A',
      rack: 'Right-01',
      side: 'right',
      position: 2,
      displayOrder: 6
    },
    images: generateDressSvg({
      name: 'Aurora Rose Halter Cocktail Dress',
      primaryColor: '#E8A2B8',
      secondaryColor: '#F8D7E0',
      accentColor: '#A33E5D',
      style: 'cocktail'
    })
  },
  {
    id: 'loki-07',
    productId: 'LK-WED-007',
    name: 'Orchid Breeze Tulle Ballgown',
    category: 'Wedding',
    description: 'Fairytale couture ballgown rendered in softest lilac-pink tones. Featuring three-dimensional embroidered floral blossoms hand-sewn across the bodice and drifting down the voluminous skirt.',
    price: 15499,
    originalPrice: 22999,
    discount: '32% OFF',
    rating: 5.0,
    reviewCount: 31,
    sizes: ['S', 'M', 'L'],
    colors: ['Soft Lilac-Pink', 'Crystal Shimmer'],
    material: 'Embroidered French Tulle, Silk Organza, Pearl Accents',
    brand: 'LOKI Haute Couture',
    tags: ['Wedding', 'Ballgown', 'Lilac', 'Hand-embroidered', 'Floral'],
    status: 'Published',
    featured: true,
    newArrival: true,
    stockQuantity: 6,
    soldCount: 14,
    colorCode: '#DFBEE7',
    dressStyle: 'gown',
    showroomPosition: {
      section: 'B',
      rack: 'Left-02',
      side: 'left',
      position: 0,
      displayOrder: 7
    },
    images: generateDressSvg({
      name: 'Orchid Breeze Tulle Ballgown',
      primaryColor: '#DFBEE7',
      secondaryColor: '#F7EDFA',
      accentColor: '#8A4F9E',
      style: 'gown'
    })
  },
  {
    id: 'loki-08',
    productId: 'LK-CAS-008',
    name: 'Silk Blossom Minimalist Slip',
    category: 'Casual',
    description: 'Effortless luxury daywear. Breathable washed mulberry silk slip that effortlessly transitions from afternoon gallery strolls to sunset rooftop cocktails.',
    price: 3499,
    originalPrice: 4999,
    discount: '30% OFF',
    rating: 4.8,
    reviewCount: 119,
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: ['Cream Pink', 'Cloud White'],
    material: '100% Sandwashed Mulberry Silk',
    brand: 'LOKI Studio',
    tags: ['Casual', 'Daywear', 'Silk', 'Slip', 'Minimalist'],
    status: 'Published',
    featured: false,
    newArrival: false,
    stockQuantity: 22,
    soldCount: 104,
    colorCode: '#FFF0F5',
    dressStyle: 'slip',
    showroomPosition: {
      section: 'B',
      rack: 'Left-02',
      side: 'left',
      position: 1,
      displayOrder: 8
    },
    images: generateDressSvg({
      name: 'Silk Blossom Minimalist Slip',
      primaryColor: '#FFF0F5',
      secondaryColor: '#FFFFFF',
      accentColor: '#D17B88',
      style: 'slip'
    })
  },
  {
    id: 'loki-09',
    productId: 'LK-ARR-009',
    name: 'Starlight Shimmer Mermaid Gown',
    category: 'New Arrivals',
    description: 'Show-stopping figure-hugging silhouette hugging every contour before flaring into a theatrical floor-sweeping mermaid train. Woven with micro-reflector pink crystals.',
    price: 8999,
    originalPrice: 13500,
    discount: '33% OFF',
    rating: 4.9,
    reviewCount: 47,
    sizes: ['XS', 'S', 'M', 'L'],
    colors: ['Glitter Blush', 'Rose Champagne'],
    material: 'Micro-sequin Stretch Crepe & Soft Tulle',
    brand: 'LOKI Atelier',
    tags: ['Mermaid', 'Shimmer', 'New Arrival', 'Evening', 'Red Carpet'],
    status: 'Published',
    featured: true,
    newArrival: true,
    stockQuantity: 14,
    soldCount: 33,
    colorCode: '#F9CAD7',
    dressStyle: 'mermaid',
    showroomPosition: {
      section: 'B',
      rack: 'Right-02',
      side: 'right',
      position: 0,
      displayOrder: 9
    },
    images: generateDressSvg({
      name: 'Starlight Shimmer Mermaid Gown',
      primaryColor: '#F9CAD7',
      secondaryColor: '#FFF5F8',
      accentColor: '#C44D6D',
      style: 'mermaid'
    })
  },
  {
    id: 'loki-10',
    productId: 'LK-SMR-010',
    name: 'Sunlit Peaches Summer Sundress',
    category: 'Summer',
    description: 'Breezy linen-cotton blend sundress with tie-up shoulder ribbons and a fitted smocked back. Soft peach blush tones evoke sun-drenched Mediterranean holidays.',
    price: 3899,
    originalPrice: 5499,
    discount: '29% OFF',
    rating: 4.7,
    reviewCount: 89,
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: ['Peach Blush', 'Sunny Pastel'],
    material: 'Organic French Linen & Cotton Lawn',
    brand: 'LOKI Studio',
    tags: ['Summer', 'Linen', 'Peach', 'Sundress', 'Resort'],
    status: 'Published',
    featured: false,
    newArrival: false,
    stockQuantity: 28,
    soldCount: 65,
    colorCode: '#FFDFD3',
    dressStyle: 'a-line',
    showroomPosition: {
      section: 'B',
      rack: 'Right-02',
      side: 'right',
      position: 1,
      displayOrder: 10
    },
    images: generateDressSvg({
      name: 'Sunlit Peaches Summer Sundress',
      primaryColor: '#FFDFD3',
      secondaryColor: '#FFF6F2',
      accentColor: '#D9755F',
      style: 'a-line'
    })
  }
];

const initialOrders = [
  {
    orderId: 'LK-ORD-84920',
    customer: {
      fullName: 'Aria Montgomery',
      email: 'aria.m@fashion.com',
      phone: '+91 98765 43210',
      address: 'Penthouse 14B, Royal Palms Boulevard',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400050'
    },
    items: [
      {
        productId: 'loki-01',
        name: 'Rose Blossom Silk Evening Gown',
        price: 6499,
        size: 'S',
        quantity: 1,
        image: ''
      }
    ],
    subtotal: 6499,
    discount: 500,
    deliveryMethod: 'Express Delivery',
    deliveryFee: 150,
    total: 6149,
    paymentMethod: 'UPI',
    paymentStatus: 'Paid',
    orderStatus: 'Shipped',
    date: new Date(Date.now() - 36 * 3600 * 1000).toISOString(),
    estimatedDelivery: 'Tomorrow, by 6:00 PM'
  },
  {
    orderId: 'LK-ORD-84921',
    customer: {
      fullName: 'Eleanor Vance',
      email: 'eleanor.v@boutique.co',
      phone: '+91 91234 56789',
      address: '22 Camellia Grove, Indiranagar',
      city: 'Bangalore',
      state: 'Karnataka',
      pincode: '560038'
    },
    items: [
      {
        productId: 'loki-03',
        name: 'Lavender Mist Satin Slip Gown',
        price: 7299,
        size: 'M',
        quantity: 1,
        image: ''
      },
      {
        productId: 'loki-02',
        name: 'Whispering Peony Chiffon Dress',
        price: 4999,
        size: 'M',
        quantity: 1,
        image: ''
      }
    ],
    subtotal: 12298,
    discount: 1200,
    deliveryMethod: 'Express Delivery',
    deliveryFee: 150,
    total: 11248,
    paymentMethod: 'Credit/Debit Card',
    paymentStatus: 'Paid',
    orderStatus: 'Processing',
    date: new Date(Date.now() - 12 * 3600 * 1000).toISOString(),
    estimatedDelivery: 'Oct 30, 2026'
  },
  {
    orderId: 'LK-ORD-84922',
    customer: {
      fullName: 'Natasha Romanov',
      email: 'natasha.r@couture.com',
      phone: '+91 97890 12345',
      address: 'Plot 88, Jubilee Hills',
      city: 'Hyderabad',
      state: 'Telangana',
      pincode: '500033'
    },
    items: [
      {
        productId: 'loki-04',
        name: 'Champagne Elegance Tiered Gown',
        price: 12999,
        size: 'XS',
        quantity: 1,
        image: ''
      }
    ],
    subtotal: 12999,
    discount: 1000,
    deliveryMethod: 'Standard Delivery',
    deliveryFee: 0,
    total: 11999,
    paymentMethod: 'UPI',
    paymentStatus: 'Paid',
    orderStatus: 'Confirmed',
    date: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
    estimatedDelivery: 'Nov 02, 2026'
  }
];

const initialCustomers = [
  {
    id: 'cust-1',
    fullName: 'Aria Montgomery',
    email: 'aria.m@fashion.com',
    phone: '+91 98765 43210',
    city: 'Mumbai',
    orders: 3,
    totalSpent: 21890,
    registrationDate: '2026-08-14',
    status: 'VIP Customer'
  },
  {
    id: 'cust-2',
    fullName: 'Eleanor Vance',
    email: 'eleanor.v@boutique.co',
    phone: '+91 91234 56789',
    city: 'Bangalore',
    orders: 2,
    totalSpent: 16450,
    registrationDate: '2026-09-02',
    status: 'Active'
  },
  {
    id: 'cust-3',
    fullName: 'Natasha Romanov',
    email: 'natasha.r@couture.com',
    phone: '+91 97890 12345',
    city: 'Hyderabad',
    orders: 1,
    totalSpent: 11999,
    registrationDate: '2026-10-18',
    status: 'New'
  },
  {
    id: 'cust-4',
    fullName: 'Chloe Dupont',
    email: 'chloe.d@parisfashion.com',
    phone: '+91 94567 89012',
    city: 'New Delhi',
    orders: 4,
    totalSpent: 34500,
    registrationDate: '2026-07-22',
    status: 'VIP Customer'
  }
];

class Database {
  constructor() {
    this.data = {
      products: [],
      orders: [],
      customers: [],
      categories: [
        'All',
        'Dresses',
        'Evening Wear',
        'Party Wear',
        'Casual',
        'Wedding',
        'Summer',
        'New Arrivals',
        'Premium Collection'
      ],
      showroomConfig: {
        theme: 'Haute Couture Pink & Blush',
        lightingMode: 'Warm Runway Spotlight',
        ambientIntensity: 0.85,
        spotlightIntensity: 1.4,
        floorReflection: 0.7,
        aisleLength: 30,
        rackSpacing: 3.5,
        sections: [
          { id: 'A', name: 'Grand Entrance & Evening Couture', aisleRange: [0, 14], rackCount: 2 },
          { id: 'B', name: 'Bridal, Party & Gala Promenade', aisleRange: [14, 28], rackCount: 2 }
        ]
      },
      aiSettings: {
        provider: 'gemini',
        model: 'gemini-1.5-flash',
        apiKey: '',
        minSimilarityScore: 95,
        autoRefine: true,
        maxRefineIterations: 3
      },
      aiLogs: []
    };
    this.init();
  }

  init() {
    try {
      if (fs.existsSync(DATA_FILE)) {
        const raw = fs.readFileSync(DATA_FILE, 'utf8');
        this.data = JSON.parse(raw);
        if (!this.data.aiSettings) {
          this.data.aiSettings = {
            provider: 'gemini',
            model: 'gemini-1.5-flash',
            apiKey: '',
            minSimilarityScore: 95,
            autoRefine: true,
            maxRefineIterations: 3
          };
        }
        if (!Array.isArray(this.data.aiLogs)) {
          this.data.aiLogs = [];
        }
      } else {
        this.data.products = initialProducts;
        this.data.orders = initialOrders;
        this.data.customers = initialCustomers;
        this.save();
      }
    } catch (err) {
      console.error('Error loading store data, resetting to defaults:', err);
      this.data.products = initialProducts;
      this.data.orders = initialOrders;
      this.data.customers = initialCustomers;
      this.save();
    }
  }

  save() {
    try {
      fs.writeFileSync(DATA_FILE, JSON.stringify(this.data, null, 2), 'utf8');
    } catch (err) {
      console.error('Error saving store data:', err);
    }
  }

  // Products
  getProducts(filter = {}) {
    let list = [...this.data.products];
    if (filter.category && filter.category !== 'All') {
      list = list.filter(p => p.category.toLowerCase() === filter.category.toLowerCase() || (p.tags && p.tags.some(t => t.toLowerCase() === filter.category.toLowerCase())));
    }
    if (filter.search) {
      const q = filter.search.toLowerCase();
      list = list.filter(p => 
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        (p.tags && p.tags.some(t => t.toLowerCase().includes(q)))
      );
    }
    if (filter.status) {
      list = list.filter(p => p.status === filter.status);
    }
    return list;
  }

  getProductById(id) {
    return this.data.products.find(p => p.id === id || p.productId === id);
  }

  createProduct(productData) {
    const id = 'loki-' + Date.now().toString(36);
    const productId = productData.productId || `LK-NEW-${Math.floor(100 + Math.random() * 900)}`;
    
    // Assign showroom position if missing
    const section = productData.showroomPosition?.section || 'A';
    const rack = productData.showroomPosition?.rack || 'Left-01';
    const side = rack.toLowerCase().includes('right') ? 'right' : 'left';
    const existingInRack = this.data.products.filter(p => 
      p.showroomPosition?.section === section && 
      p.showroomPosition?.rack === rack
    ).length;

    const newProduct = {
      id,
      productId,
      name: productData.name || 'Untitled Couture Dress',
      category: productData.category || 'Evening Wear',
      description: productData.description || 'Exclusive LOKI creation with luxurious bespoke tailoring.',
      price: Number(productData.price) || 4999,
      originalPrice: Number(productData.originalPrice) || (Number(productData.price) * 1.4),
      discount: productData.discount || 'Special Launch',
      rating: 5.0,
      reviewCount: 1,
      sizes: productData.sizes && productData.sizes.length ? productData.sizes : ['XS', 'S', 'M', 'L', 'XL'],
      colors: productData.colors || ['Blush Pink'],
      material: productData.material || 'Mulberry Silk & Chiffon',
      brand: productData.brand || 'LOKI Atelier',
      tags: productData.tags || ['Dresses', 'New Arrival', 'LOKI'],
      status: productData.status || 'Published',
      featured: !!productData.featured,
      newArrival: productData.newArrival !== undefined ? !!productData.newArrival : true,
      stockQuantity: Number(productData.stockQuantity) || 20,
      soldCount: 0,
      colorCode: productData.colorCode || '#F6B6C8',
      dressStyle: productData.dressStyle || 'gown',
      showroomPosition: {
        section,
        rack,
        side,
        position: productData.showroomPosition?.position !== undefined ? Number(productData.showroomPosition.position) : existingInRack,
        displayOrder: Number(productData.showroomPosition?.displayOrder) || (this.data.products.length + 1)
      },
      images: productData.images || generateDressSvg({
        name: productData.name,
        primaryColor: productData.colorCode || '#F6B6C8',
        secondaryColor: '#FFF0F5',
        accentColor: '#C85C7A',
        style: productData.dressStyle || 'gown'
      })
    };

    this.data.products.unshift(newProduct);
    this.save();
    return newProduct;
  }

  updateProduct(id, updateData) {
    const idx = this.data.products.findIndex(p => p.id === id || p.productId === id);
    if (idx === -1) return null;

    this.data.products[idx] = {
      ...this.data.products[idx],
      ...updateData,
      showroomPosition: {
        ...this.data.products[idx].showroomPosition,
        ...(updateData.showroomPosition || {})
      }
    };
    this.save();
    return this.data.products[idx];
  }

  deleteProduct(id) {
    const initialLen = this.data.products.length;
    this.data.products = this.data.products.filter(p => p.id !== id && p.productId !== id);
    const deleted = this.data.products.length < initialLen;
    if (deleted) this.save();
    return deleted;
  }

  // Orders
  getOrders() {
    return this.data.orders;
  }

  createOrder(orderData) {
    const orderId = `LK-ORD-${Math.floor(10000 + Math.random() * 90000)}`;
    const newOrder = {
      orderId,
      customer: orderData.customer,
      items: orderData.items || [],
      subtotal: Number(orderData.subtotal) || 0,
      discount: Number(orderData.discount) || 0,
      deliveryMethod: orderData.deliveryMethod || 'Standard Delivery',
      deliveryFee: Number(orderData.deliveryFee) || 0,
      total: Number(orderData.total) || 0,
      paymentMethod: orderData.paymentMethod || 'UPI',
      paymentStatus: 'Paid',
      orderStatus: 'Confirmed',
      date: new Date().toISOString(),
      estimatedDelivery: orderData.deliveryMethod === 'Express Delivery' ? 'In 1-2 business days' : 'In 3-5 business days'
    };

    // Deduct stock quantity and increase soldCount
    for (const item of newOrder.items) {
      const product = this.data.products.find(p => p.id === item.productId || p.productId === item.productId);
      if (product) {
        product.stockQuantity = Math.max(0, product.stockQuantity - (item.quantity || 1));
        product.soldCount = (product.soldCount || 0) + (item.quantity || 1);
      }
    }

    // Record or update customer
    if (orderData.customer?.email) {
      const existingCust = this.data.customers.find(c => c.email.toLowerCase() === orderData.customer.email.toLowerCase());
      if (existingCust) {
        existingCust.orders += 1;
        existingCust.totalSpent += newOrder.total;
      } else {
        this.data.customers.push({
          id: 'cust-' + Date.now().toString(36),
          fullName: orderData.customer.fullName || 'Valued Client',
          email: orderData.customer.email,
          phone: orderData.customer.phone || '',
          city: orderData.customer.city || 'Mumbai',
          orders: 1,
          totalSpent: newOrder.total,
          registrationDate: new Date().toISOString().split('T')[0],
          status: 'Active'
        });
      }
    }

    this.data.orders.unshift(newOrder);
    this.save();
    return newOrder;
  }

  updateOrderStatus(orderId, status) {
    const order = this.data.orders.find(o => o.orderId === orderId);
    if (!order) return null;
    order.orderStatus = status;
    this.save();
    return order;
  }

  // Customers
  getCustomers() {
    return this.data.customers;
  }

  // Inventory
  getInventory() {
    return this.data.products.map(p => ({
      id: p.id,
      productId: p.productId,
      name: p.name,
      category: p.category,
      price: p.price,
      stockQuantity: p.stockQuantity,
      soldCount: p.soldCount || 0,
      reserved: Math.min(2, Math.floor(p.stockQuantity * 0.1)),
      status: p.stockQuantity <= 0 ? 'Out of Stock' : (p.stockQuantity <= 5 ? 'Low Stock' : 'In Stock'),
      showroomLocation: `${p.showroomPosition?.section || 'A'} - ${p.showroomPosition?.rack || 'Left-01'} (Pos ${p.showroomPosition?.position ?? 0})`
    }));
  }

  // Showroom Configuration
  getShowroomConfig() {
    return this.data.showroomConfig;
  }

  updateShowroomConfig(cfg) {
    this.data.showroomConfig = { ...this.data.showroomConfig, ...cfg };
    this.save();
    return this.data.showroomConfig;
  }

  // Analytics
  getAnalytics() {
    const totalProducts = this.data.products.length;
    const totalOrders = this.data.orders.length;
    const totalCustomers = this.data.customers.length;
    const totalRevenue = this.data.orders.reduce((sum, o) => sum + (o.total || 0), 0);
    const lowStockCount = this.data.products.filter(p => p.stockQuantity <= 5).length;

    // Monthly sales simulation for chart
    const salesChart = [
      { month: 'May', sales: 185000, orders: 28 },
      { month: 'Jun', sales: 242000, orders: 36 },
      { month: 'Jul', sales: 310000, orders: 48 },
      { month: 'Aug', sales: 289000, orders: 42 },
      { month: 'Sep', sales: 412000, orders: 61 },
      { month: 'Oct', sales: totalRevenue + 180000, orders: totalOrders + 25 }
    ];

    const categoryBreakdown = this.data.categories.filter(c => c !== 'All').map(cat => ({
      name: cat,
      count: this.data.products.filter(p => p.category === cat).length
    }));

    return {
      kpis: {
        totalProducts,
        totalOrders,
        totalCustomers,
        totalRevenue,
        lowStockCount,
        averageOrderValue: totalOrders ? Math.round(totalRevenue / totalOrders) : 0
      },
      salesChart,
      categoryBreakdown,
      recentOrders: this.data.orders.slice(0, 5)
    };
  }

  // AI Configuration & Settings
  getAiSettings() {
    return this.data.aiSettings || {
      provider: 'gemini',
      model: 'gemini-1.5-flash',
      apiKey: '',
      minSimilarityScore: 95,
      autoRefine: true,
      maxRefineIterations: 3
    };
  }

  updateAiSettings(settings) {
    this.data.aiSettings = {
      ...(this.data.aiSettings || {}),
      ...settings
    };
    this.save();
    return this.data.aiSettings;
  }

  // Real-time AI Logs
  getAiLogs() {
    return this.data.aiLogs || [];
  }

  addAiLog(logEntry) {
    if (!this.data.aiLogs) this.data.aiLogs = [];
    this.data.aiLogs.unshift(logEntry);
    if (this.data.aiLogs.length > 150) {
      this.data.aiLogs = this.data.aiLogs.slice(0, 150);
    }
    this.save();
    return logEntry;
  }

  clearAiLogs() {
    this.data.aiLogs = [];
    this.save();
    return true;
  }
}

export const db = new Database();

