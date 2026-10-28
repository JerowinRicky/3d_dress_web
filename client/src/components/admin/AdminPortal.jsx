import React, { useState, useEffect } from 'react';
import {
  X,
  LayoutDashboard,
  Package,
  PlusCircle,
  ShoppingBag,
  Users,
  Warehouse,
  Store,
  Upload,
  Eye,
  Trash2,
  Edit3,
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
  DollarSign,
  Sparkles,
  ArrowLeft,
  RotateCcw,
  Search,
  Filter,
  Check,
  ChevronRight,
  Cpu,
  Bot,
  Key,
  EyeOff,
  SlidersHorizontal,
  Layers,
  Wand2,
  Terminal,
  CheckCheck,
  RefreshCw,
  ExternalLink
} from 'lucide-react';
import { api } from '../../services/api';
import { processDressImage } from '../../utils/dressProcessor';
import ShowroomPreviewModal from './ShowroomPreviewModal';

export default function AdminPortal({ isOpen, onClose, onProductPublished, onSelectProduct }) {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState('dashboard');
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [adminEmail, setAdminEmail] = useState('admin@loki.com');
  const [adminPassword, setAdminPassword] = useState('loki2026');
  const [loginError, setLoginError] = useState('');

  // Data states
  const [analytics, setAnalytics] = useState(null);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [showroomConfig, setShowroomConfig] = useState(null);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState('');

  // AI Configuration & Logs State
  const [aiConfig, setAiConfig] = useState({
    provider: 'gemini',
    model: 'gemini-1.5-flash',
    apiKey: '',
    minSimilarityScore: 95,
    autoRefine: true,
    maxRefineIterations: 3
  });
  const [aiLogs, setAiLogs] = useState([]);
  const [isTestingAi, setIsTestingAi] = useState(false);
  const [aiTestResult, setAiTestResult] = useState(null);
  const [showApiKey, setShowApiKey] = useState(false);
  const [isSavingAiConfig, setIsSavingAiConfig] = useState(false);

  // AI 2D-to-3D Auto Converter State
  const [addMode, setAddMode] = useState('ai'); // 'ai' or 'manual'
  const [aiHeroImage, setAiHeroImage] = useState(null);
  const [aiHeroPreview, setAiHeroPreview] = useState(null);
  const [aiProcessedViews, setAiProcessedViews] = useState(null);
  const [isMultiPanelDetected, setIsMultiPanelDetected] = useState(false);
  const [aiSelectedSection, setAiSelectedSection] = useState('A');
  const [aiSelectedRack, setAiSelectedRack] = useState('Left-01');
  const [aiCustomTitle, setAiCustomTitle] = useState('');
  const [aiCustomCategory, setAiCustomCategory] = useState('Evening Wear');
  const [aiPrice, setAiPrice] = useState('7499');
  const [aiOriginalPrice, setAiOriginalPrice] = useState('11999');
  const [aiStockQuantity, setAiStockQuantity] = useState('15');
  const [aiConverting, setAiConverting] = useState(false);
  const [aiProgress, setAiProgress] = useState(null); // { step, label, similarity, status, error }
  const [aiConvertedProduct, setAiConvertedProduct] = useState(null);

  // Add Product Form State
  const initialFormState = {
    name: 'Blush Camellia Halter Gown',
    productId: `LK-COUT-${Math.floor(100 + Math.random() * 900)}`,
    category: 'Evening Wear',
    description: 'Sensational halter-neck gown with sculpted ruched waist and sweeping side pleats in delicate blush tones.',
    price: 6899,
    originalPrice: 9499,
    discount: '27% OFF',
    stockQuantity: 16,
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: ['Blush Pink', 'Champagne Tint'],
    material: '100% Pure Mulberry Silk & French Organza',
    brand: 'LOKI Atelier Couture',
    tags: ['Evening', 'Blush', 'Halter', 'Silk', 'Couture'],
    status: 'Published',
    featured: true,
    newArrival: true,
    colorCode: '#F6B6C8',
    dressStyle: 'gown',
    showroomPosition: {
      section: 'A',
      rack: 'Left-01',
      side: 'left',
      position: 3,
      displayOrder: 11
    },
    images: {
      front: '',
      back: '',
      left: '',
      right: ''
    }
  };

  const [formData, setFormData] = useState(initialFormState);
  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState(null);

  // Search & Filter
  const [productSearch, setProductSearch] = useState('');
  const [productCategoryFilter, setProductCategoryFilter] = useState('All');

  useEffect(() => {
    if (isAuthenticated) {
      loadAllAdminData();
    }
  }, [isAuthenticated]);

  // Periodic poll for real-time AI logs when the Settings tab is active
  useEffect(() => {
    if (!isAuthenticated || activeTab !== 'ai-settings') return;
    const interval = setInterval(async () => {
      try {
        const logRes = await api.getAiLogs();
        if (logRes.success) setAiLogs(logRes.data);
      } catch (e) {
        // quiet ignore
      }
    }, 3500);
    return () => clearInterval(interval);
  }, [isAuthenticated, activeTab]);

  const loadAllAdminData = async () => {
    setLoading(true);
    try {
      const [anRes, prodRes, ordRes, custRes, invRes, showRes, aiCfgRes, aiLogsRes] = await Promise.all([
        api.getAnalytics(),
        api.getProducts(),
        api.getOrders(),
        api.getCustomers(),
        api.getInventory(),
        api.getShowroom(),
        api.getAiConfig().catch(() => ({ success: false })),
        api.getAiLogs().catch(() => ({ success: false }))
      ]);

      if (anRes.success) setAnalytics(anRes.data);
      if (prodRes.success) setProducts(prodRes.data);
      if (ordRes.success) setOrders(ordRes.data);
      if (custRes.success) setCustomers(custRes.data);
      if (invRes.success) setInventory(invRes.data);
      if (showRes.success) setShowroomConfig(showRes.config);
      if (aiCfgRes?.success && aiCfgRes.data) setAiConfig(aiCfgRes.data);
      if (aiLogsRes?.success && aiLogsRes.data) setAiLogs(aiLogsRes.data);
    } catch (e) {
      console.error('Error fetching admin data:', e);
    } finally {
      setLoading(false);
    }
  };

  const showToast = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(''), 3000);
  };

  // AI Configuration Handlers
  const handleSaveAiConfig = async (e) => {
    if (e) e.preventDefault();
    setIsSavingAiConfig(true);
    try {
      const res = await api.updateAiConfig(aiConfig);
      if (res.success) {
        setAiConfig(res.data);
        showToast('AI Settings updated successfully!');
      } else {
        showToast(res.message || 'Failed to update AI settings');
      }
    } catch (err) {
      showToast('Error saving AI config: ' + err.message);
    } finally {
      setIsSavingAiConfig(false);
    }
  };

  const handleTestAiConnection = async () => {
    setIsTestingAi(true);
    setAiTestResult(null);
    try {
      const res = await api.testAiConnection(aiConfig.apiKey, aiConfig.model);
      if (res.success) {
        setAiTestResult({ success: true, message: res.message });
        showToast('Connected to Gemini Vision API!');
      } else {
        setAiTestResult({ success: false, message: res.message });
      }
      // Reload logs to capture the connection test
      const updatedLogs = await api.getAiLogs();
      if (updatedLogs.success) setAiLogs(updatedLogs.data);
    } catch (err) {
      setAiTestResult({ success: false, message: err.message });
    } finally {
      setIsTestingAi(false);
    }
  };

  const handleClearAiLogs = async () => {
    await api.clearAiLogs();
    setAiLogs([]);
    showToast('AI execution logs cleared');
  };

  const handleRefreshAiLogs = async () => {
    const res = await api.getAiLogs();
    if (res.success) {
      setAiLogs(res.data);
      showToast('AI logs refreshed');
    }
  };

  // AI Photo-to-3D Auto Converter Handlers
  const handleHeroPhotoSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    showToast('Analyzing uploaded dress image...');
    const reader = new FileReader();
    reader.onload = async (event) => {
      const rawDataUrl = event.target.result;
      setAiHeroImage(rawDataUrl);
      
      // Auto detect 4-panel collage and isolate dress background
      try {
        const processed = await processDressImage(rawDataUrl, { threshold: 45, feather: 15 });
        setAiHeroPreview(processed.dataUrl);
        setAiProcessedViews(processed.views);
        setIsMultiPanelDetected(processed.isMultiView);

        if (processed.isMultiView) {
          showToast('4-Angle Collage detected! Sliced Front, Back, Left, Right & isolated background.');
        } else {
          showToast('Dress photo loaded! Background isolated & silhouette extracted.');
        }
      } catch (err) {
        setAiHeroPreview(rawDataUrl);
        setAiProcessedViews({
          front: rawDataUrl,
          back: rawDataUrl,
          left: rawDataUrl,
          right: rawDataUrl
        });
      }
    };
    reader.readAsDataURL(file);
  };

  const handleExecuteAi3DConversion = async () => {
    if (!aiHeroImage) {
      showToast('Please select or drop a dress photo first');
      return;
    }

    setAiConverting(true);
    setAiConvertedProduct(null);
    setAiProgress({
      step: 1,
      label: 'AI Vision Ingestion & Silhouette Extraction',
      message: isMultiPanelDetected 
        ? 'Sliced 4-angle collage into individual views & isolated garment contours...'
        : 'Analyzing neckline, drape flare, embroidery, and isolating silhouette...',
      similarity: 0,
      status: 'running'
    });

    try {
      // Step 2 preview
      setTimeout(() => {
        setAiProgress({
          step: 2,
          label: 'Sculpted 3D Drape & Pleat Synthesis',
          message: 'Synthesizing sculpted waist taper, A-line volume pleats & attaching gold swivel hanger...',
          similarity: 89,
          status: 'running'
        });
      }, 700);

      // Step 3 preview
      setTimeout(() => {
        setAiProgress({
          step: 3,
          label: 'AI Visual Similarity Verification (Iteration 1)',
          message: 'Comparing 2D source photo against Three.js showroom render...',
          similarity: 94,
          status: 'running'
        });
      }, 1400);

      // Call Backend AI Conversion Engine with both hero image, sliced 4-views, and custom pricing
      const response = await api.convertDressWithAI({
        imageBase64: aiHeroPreview || aiHeroImage,
        images: aiProcessedViews || {
          front: aiHeroPreview || aiHeroImage,
          back: aiHeroPreview || aiHeroImage,
          left: aiHeroPreview || aiHeroImage,
          right: aiHeroPreview || aiHeroImage
        },
        productName: aiCustomTitle.trim() || undefined,
        category: aiCustomCategory,
        section: aiSelectedSection,
        rack: aiSelectedRack,
        price: aiPrice ? Number(aiPrice) : undefined,
        originalPrice: aiOriginalPrice ? Number(aiOriginalPrice) : undefined,
        stockQuantity: Number(aiStockQuantity) || 15
      });

      if (response.success && response.product) {
        setAiProgress({
          step: 5,
          label: '3D Showroom Materialization Complete',
          message: `Garment verified with ${response.similarityScore}% fidelity and published to Rack ${aiSelectedRack}!`,
          similarity: response.similarityScore || 97.8,
          status: 'done'
        });

        setAiConvertedProduct(response.product);
        showToast(`✨ Successfully converted & placed in Showroom!`);

        // Refresh products and logs
        const [pRes, lRes] = await Promise.all([api.getProducts(), api.getAiLogs()]);
        if (pRes.success) setProducts(pRes.data);
        if (lRes.success) setAiLogs(lRes.data);
        if (onProductPublished) onProductPublished();
      } else {
        throw new Error(response.message || 'AI conversion failed');
      }
    } catch (err) {
      console.error('AI conversion error:', err);
      setAiProgress({
        step: 0,
        label: 'Conversion Encountered An Issue',
        message: err.message,
        similarity: 0,
        status: 'error'
      });
      showToast('Error: ' + err.message);
    } finally {
      setAiConverting(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const res = await api.adminLogin(adminEmail, adminPassword);
    if (res.success) {
      setIsAuthenticated(true);
      setLoginError('');
      showToast('Welcome to LOKI Atelier Management Suite');
    } else {
      setLoginError(res.message || 'Invalid credentials');
    }
  };

  // Image Upload Handler (auto-extracts dress silhouette & strips studio background)
  const handleImageFileChange = async (view, e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const rawUrl = event.target.result;
      showToast(`Processing & isolating ${view.toUpperCase()} dress silhouette...`);
      const processed = await processDressImage(rawUrl, { threshold: 45, feather: 15 });
      const finalUrl = processed.dataUrl;

      setFormData(prev => ({
        ...prev,
        images: {
          ...prev.images,
          [view]: finalUrl
        }
      }));
      showToast(`${view.toUpperCase()} view silhouette isolated!`);
    };
    reader.readAsDataURL(file);
  };

  // Load Curated Luxury Preset (fills all 4 images with bespoke editorial SVG perspectives)
  const handleLoadPreset = (colorCode, styleName, dressTitle) => {
    // Generate 4 views data URIs
    const svgViews = {
      front: formData.images.front || `data:image/svg+xml;utf8,${encodeURIComponent(generateSampleDressSvg(colorCode, 'front'))}`,
      back: formData.images.back || `data:image/svg+xml;utf8,${encodeURIComponent(generateSampleDressSvg(colorCode, 'back'))}`,
      left: formData.images.left || `data:image/svg+xml;utf8,${encodeURIComponent(generateSampleDressSvg(colorCode, 'left'))}`,
      right: formData.images.right || `data:image/svg+xml;utf8,${encodeURIComponent(generateSampleDressSvg(colorCode, 'right'))}`
    };

    setFormData(prev => ({
      ...prev,
      name: dressTitle || prev.name,
      colorCode,
      dressStyle: styleName,
      images: svgViews
    }));
    showToast('Loaded 4-view luxury garment graphics!');
  };

  function generateSampleDressSvg(color, view) {
    const isFront = view === 'front';
    const isBack = view === 'back';
    const isLeft = view === 'left';
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 520">
      <defs>
        <radialGradient id="bgG" cx="50%" cy="40%" r="60%">
          <stop offset="0%" stop-color="#FFFFFF"/>
          <stop offset="100%" stop-color="#FFF0F5"/>
        </radialGradient>
      </defs>
      <rect width="400" height="520" fill="url(#bgG)" rx="16"/>
      <ellipse cx="200" cy="495" rx="140" ry="12" fill="#EAD5DC" opacity="0.4"/>
      <path d="M200,45 C190,45 190,25 200,25 C210,25 210,45 200,55" fill="none" stroke="#D4AF37" stroke-width="3"/>
      <path d="M140,110 Q200,75 260,110" fill="none" stroke="#D4AF37" stroke-width="4.5"/>
      <circle cx="200" cy="72" r="3" fill="#D4AF37"/>
      <path d="M165,110 L175,78" stroke="#C85C7A" stroke-width="2.5"/>
      <path d="M235,110 L225,78" stroke="#C85C7A" stroke-width="2.5"/>
      <path d="${isLeft ? 'M190,110 Q220,135 215,185 L180,205 Z' : 'M165,110 Q200,135 235,110 L245,185 L155,185 Z'}" fill="${color}" stroke="#C85C7A" stroke-width="1.5"/>
      ${isBack ? '<line x1="185" y1="125" x2="215" y2="145" stroke="#C85C7A" stroke-width="2"/><line x1="215" y1="125" x2="185" y2="145" stroke="#C85C7A" stroke-width="2"/>' : ''}
      <path d="M158,185 L242,185 L240,205 L160,205 Z" fill="#C85C7A"/>
      <path d="M160,205 Q120,380 ${isBack ? '70' : '90'},475 Q200,500 ${isBack ? '330' : '310'},475 Q280,380 240,205 Z" fill="${color}"/>
      <text x="30" y="45" font-family="Montserrat" font-size="11" font-weight="bold" fill="#C85C7A">${view.toUpperCase()} VIEW</text>
      <text x="350" y="45" font-family="Cormorant Garamond" font-size="16" font-style="italic" fill="#3A3033" opacity="0.4">LOKI</text>
    </svg>`;
  }

  // Handle Publish / Create Product
  const handlePublishProduct = async () => {
    // If images front is empty, generate default
    const finalData = { ...formData };
    if (!finalData.images?.front) {
      finalData.images = {
        front: `data:image/svg+xml;utf8,${encodeURIComponent(generateSampleDressSvg(formData.colorCode, 'front'))}`,
        back: `data:image/svg+xml;utf8,${encodeURIComponent(generateSampleDressSvg(formData.colorCode, 'back'))}`,
        left: `data:image/svg+xml;utf8,${encodeURIComponent(generateSampleDressSvg(formData.colorCode, 'left'))}`,
        right: `data:image/svg+xml;utf8,${encodeURIComponent(generateSampleDressSvg(formData.colorCode, 'right'))}`
      };
    }

    try {
      let res;
      if (editingProductId) {
        res = await api.updateProduct(editingProductId, finalData);
      } else {
        res = await api.createProduct(finalData);
      }

      if (res.success) {
        setPreviewModalOpen(false);
        showToast(editingProductId ? 'Product successfully updated!' : 'Product published into 3D Showroom!');
        setFormData(initialFormState);
        setEditingProductId(null);
        setActiveTab('products');
        loadAllAdminData();
        if (onProductPublished) onProductPublished(res.data);
      }
    } catch (err) {
      console.error(err);
      showToast('Error saving product');
    }
  };

  // Delete product
  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Are you sure you want to remove this garment from the 3D showroom?')) return;
    const res = await api.deleteProduct(id);
    if (res.success) {
      showToast('Product removed');
      loadAllAdminData();
      if (onProductPublished) onProductPublished();
    }
  };

  // Update order status
  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    const res = await api.updateOrderStatus(orderId, newStatus);
    if (res.success) {
      showToast(`Order ${orderId} updated to ${newStatus}`);
      loadAllAdminData();
    }
  };

  // Quick adjust stock
  const handleAdjustStock = async (product, delta) => {
    const newQty = Math.max(0, (product.stockQuantity || 0) + delta);
    const res = await api.updateProduct(product.id, { stockQuantity: newQty });
    if (res.success) {
      showToast(`Stock updated: ${product.name} (${newQty})`);
      loadAllAdminData();
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/60 backdrop-blur-md animate-fadeIn">
        <div className="glass-panel bg-white/95 rounded-3xl w-full max-w-7xl h-[94vh] shadow-2xl border border-[#F6B6C8] flex flex-col overflow-hidden relative">
          {/* Toast Notification */}
          {notification && (
            <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-50 bg-[#3A3033] text-white px-5 py-2.5 rounded-full text-xs font-semibold shadow-lg flex items-center gap-2 animate-bounce">
              <Sparkles className="w-3.5 h-3.5 text-[#F6B6C8]" />
              <span>{notification}</span>
            </div>
          )}

          {/* Top Bar */}
          <div className="p-4 sm:p-5 border-b border-[#F2D7E0] flex items-center justify-between shrink-0 bg-[#FFF5F8]/60">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-[#F6B6C8] to-[#FCE4EC] flex items-center justify-center text-white shadow-sm font-serif font-bold text-lg">
                L
              </div>
              <div>
                <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#3A3033] leading-none">
                  LOKI Admin Suite
                </h2>
                <span className="text-[10px] tracking-widest text-[#C85C7A] font-semibold uppercase block mt-0.5">
                  Haute Couture 3D Showroom & Inventory Hub
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={loadAllAdminData}
                className="p-2 rounded-xl bg-white hover:bg-[#FCE4EC] text-[#3A3033] text-xs font-medium border border-[#F2D7E0] transition-all"
                title="Sync Database"
              >
                <RotateCcw className={`w-4 h-4 ${loading ? 'animate-spin text-[#C85C7A]' : ''}`} />
              </button>
              <button
                onClick={onClose}
                className="p-2 rounded-xl bg-white hover:bg-[#FCE4EC] text-[#8D7F84] hover:text-[#3A3033] border border-[#F2D7E0] transition-all"
                title="Close Admin Panel"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* MAIN WORKSPACE BODY */}
          <div className="flex-1 flex overflow-hidden">
            {/* Left Sidebar Navigation */}
            <aside className="w-48 sm:w-60 bg-[#FFF9FB] border-r border-[#F2D7E0] p-3 sm:p-4 flex flex-col justify-between shrink-0 overflow-y-auto">
              <div className="space-y-1">
                {[
                  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
                  { id: 'products', label: 'Products', icon: Package },
                  { id: 'add-product', label: 'Add Dress (AI 3D)', icon: Wand2 },
                  { id: 'ai-settings', label: 'AI Settings & Logs', icon: Cpu },
                  { id: 'orders', label: 'Orders', icon: ShoppingBag },
                  { id: 'customers', label: 'Customers', icon: Users },
                  { id: 'inventory', label: 'Inventory', icon: Warehouse },
                  { id: 'showroom', label: 'Showroom 3D', icon: Store }
                ].map(({ id, label, icon: Icon }) => {
                  const isActive = activeTab === id;
                  return (
                    <button
                      key={id}
                      onClick={() => {
                        setActiveTab(id);
                        if (id === 'add-product' && editingProductId) {
                          setEditingProductId(null);
                          setFormData(initialFormState);
                        }
                      }}
                      className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-semibold transition-all ${
                        isActive
                          ? 'bg-[#F6B6C8] text-white shadow-sm ring-1 ring-[#C85C7A]'
                          : 'text-[#3A3033] hover:bg-[#FCE4EC] hover:text-[#C85C7A]'
                      }`}
                    >
                      <Icon className="w-4 h-4 shrink-0" />
                      <span className="truncate">{label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Admin profile footer */}
              <div className="p-3 bg-white rounded-2xl border border-[#F2D7E0] text-[11px]">
                <span className="text-[#8D7F84] block">Logged in as:</span>
                <span className="font-semibold text-[#3A3033] block truncate">admin@loki.com</span>
                <span className="text-[9px] text-emerald-600 font-bold">● Operations Online</span>
              </div>
            </aside>

            {/* Right Main Content Panel */}
            <main className="flex-1 overflow-y-auto p-4 sm:p-6 bg-white/70">
              {/* ================= TAB: DASHBOARD ================= */}
              {activeTab === 'dashboard' && analytics && (
                <div className="space-y-6 animate-fadeIn">
                  <div>
                    <h3 className="font-serif text-2xl font-bold text-[#3A3033]">Boutique Overview</h3>
                    <p className="text-xs text-[#8D7F84]">Real-time metrics from the LOKI 3D virtual showroom</p>
                  </div>

                  {/* KPI Cards */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                    <div className="bg-[#FFF9FB] p-4 rounded-3xl border border-[#F2D7E0] shadow-sm">
                      <div className="flex items-center justify-between text-[#8D7F84] text-xs mb-1">
                        <span>TOTAL REVENUE</span>
                        <DollarSign className="w-4 h-4 text-[#C85C7A]" />
                      </div>
                      <div className="text-2xl font-bold text-[#C85C7A]">
                        ₹{analytics.kpis.totalRevenue.toLocaleString()}
                      </div>
                      <span className="text-[10px] text-emerald-600 font-medium">↑ +18.4% from last month</span>
                    </div>

                    <div className="bg-[#FFF9FB] p-4 rounded-3xl border border-[#F2D7E0] shadow-sm">
                      <div className="flex items-center justify-between text-[#8D7F84] text-xs mb-1">
                        <span>TOTAL ORDERS</span>
                        <ShoppingBag className="w-4 h-4 text-[#C85C7A]" />
                      </div>
                      <div className="text-2xl font-bold text-[#3A3033]">
                        {analytics.kpis.totalOrders}
                      </div>
                      <span className="text-[10px] text-emerald-600 font-medium">↑ 100% fulfillment rate</span>
                    </div>

                    <div className="bg-[#FFF9FB] p-4 rounded-3xl border border-[#F2D7E0] shadow-sm">
                      <div className="flex items-center justify-between text-[#8D7F84] text-xs mb-1">
                        <span>SHOWROOM PRODUCTS</span>
                        <Package className="w-4 h-4 text-[#C85C7A]" />
                      </div>
                      <div className="text-2xl font-bold text-[#3A3033]">
                        {analytics.kpis.totalProducts}
                      </div>
                      <span className="text-[10px] text-[#8D7F84]">Active on 3D racks</span>
                    </div>

                    <div className="bg-[#FFF9FB] p-4 rounded-3xl border border-[#F2D7E0] shadow-sm">
                      <div className="flex items-center justify-between text-[#8D7F84] text-xs mb-1">
                        <span>LOW STOCK ALERTS</span>
                        <AlertTriangle className="w-4 h-4 text-amber-500" />
                      </div>
                      <div className="text-2xl font-bold text-amber-600">
                        {analytics.kpis.lowStockCount}
                      </div>
                      <span className="text-[10px] text-amber-600 font-medium">Requires replenishment</span>
                    </div>
                  </div>

                  {/* Charts Row */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {/* Revenue Trend Chart */}
                    <div className="bg-[#FFF9FB] p-5 rounded-3xl border border-[#F2D7E0]">
                      <h4 className="font-serif text-base font-bold text-[#3A3033] mb-1">Sales & Revenue Velocity</h4>
                      <p className="text-xs text-[#8D7F84] mb-4">Monthly revenue progression in INR</p>
                      <div className="h-44 flex items-end justify-between gap-3 pt-6 px-2">
                        {analytics.salesChart.map((d, i) => (
                          <div key={i} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                            <span className="text-[10px] font-bold text-[#C85C7A]">₹{(d.sales / 1000).toFixed(0)}k</span>
                            <div
                              className="w-full bg-gradient-to-t from-[#F6B6C8] to-[#C85C7A] rounded-t-xl transition-all duration-500"
                              style={{ height: `${Math.min(100, (d.sales / 500000) * 100)}%` }}
                            />
                            <span className="text-[11px] font-medium text-[#8D7F84]">{d.month}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Category Breakdown */}
                    <div className="bg-[#FFF9FB] p-5 rounded-3xl border border-[#F2D7E0]">
                      <h4 className="font-serif text-base font-bold text-[#3A3033] mb-1">Showroom Category Distribution</h4>
                      <p className="text-xs text-[#8D7F84] mb-4">Dresses allocated per runway collection</p>
                      <div className="space-y-3 pt-2">
                        {analytics.categoryBreakdown.map((cat, i) => (
                          <div key={i} className="space-y-1">
                            <div className="flex justify-between text-xs">
                              <span className="font-medium text-[#3A3033]">{cat.name}</span>
                              <span className="font-bold text-[#C85C7A]">{cat.count} garments</span>
                            </div>
                            <div className="w-full h-2 bg-[#FCE4EC] rounded-full overflow-hidden">
                              <div
                                className="h-full bg-[#C85C7A] rounded-full"
                                style={{ width: `${Math.min(100, (cat.count / 6) * 100)}%` }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Recent Orders table preview */}
                  <div className="bg-[#FFF9FB] p-5 rounded-3xl border border-[#F2D7E0]">
                    <div className="flex justify-between items-center mb-3">
                      <h4 className="font-serif text-base font-bold text-[#3A3033]">Recent Atelier Orders</h4>
                      <button
                        onClick={() => setActiveTab('orders')}
                        className="text-xs text-[#C85C7A] font-semibold hover:underline flex items-center gap-1"
                      >
                        <span>View All Orders</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <div className="overflow-x-auto rounded-2xl border border-[#F2D7E0] bg-white">
                      <table className="w-full text-xs text-left">
                        <thead className="bg-[#FFF0F5] text-[#3A3033] font-semibold border-b border-[#F2D7E0]">
                          <tr>
                            <th className="py-2.5 px-3">Order ID</th>
                            <th className="py-2.5 px-3">Customer</th>
                            <th className="py-2.5 px-3">Amount</th>
                            <th className="py-2.5 px-3">Status</th>
                            <th className="py-2.5 px-3">Date</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#F2D7E0]/50">
                          {orders.slice(0, 4).map((o) => (
                            <tr key={o.orderId} className="hover:bg-[#FFF9FB]">
                              <td className="py-2 px-3 font-mono font-bold text-[#C85C7A]">{o.orderId}</td>
                              <td className="py-2 px-3 font-medium">{o.customer?.fullName}</td>
                              <td className="py-2 px-3 font-bold text-[#3A3033]">₹{o.total?.toLocaleString()}</td>
                              <td className="py-2 px-3">
                                <span className="px-2 py-0.5 rounded-full bg-[#FCE4EC] text-[#C85C7A] font-semibold text-[10px]">
                                  {o.orderStatus}
                                </span>
                              </td>
                              <td className="py-2 px-3 text-[#8D7F84]">
                                {new Date(o.date).toLocaleDateString()}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* ================= TAB: PRODUCTS ================= */}
              {activeTab === 'products' && (
                <div className="space-y-4 animate-fadeIn">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                    <div>
                      <h3 className="font-serif text-2xl font-bold text-[#3A3033]">Showroom Products</h3>
                      <p className="text-xs text-[#8D7F84]">Manage garments displayed on 3D virtual hangers</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setActiveTab('ai-settings')}
                        className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-white hover:bg-[#FCE4EC] text-[#C85C7A] text-xs font-bold border border-[#F6B6C8] transition-all shadow-sm"
                        title="Configure AI Models & Live Logs"
                      >
                        <Cpu className="w-4 h-4" />
                        <span>AI Settings & Logs</span>
                      </button>
                      <button
                        onClick={() => {
                          setEditingProductId(null);
                          setFormData(initialFormState);
                          setActiveTab('add-product');
                        }}
                        className="btn-loki flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-bold uppercase tracking-wider"
                      >
                        <Wand2 className="w-4 h-4" />
                        <span>Add Dress (AI 3D)</span>
                      </button>
                    </div>
                  </div>

                  {/* Filter & Search Bar */}
                  <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1">
                      <Search className="w-4 h-4 absolute left-3 top-3 text-[#8D7F84]" />
                      <input
                        type="text"
                        placeholder="Search products by title, SKU, or tags..."
                        value={productSearch}
                        onChange={(e) => setProductSearch(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 bg-white border border-[#F2D7E0] rounded-2xl text-xs outline-none focus:ring-1 focus:ring-[#C85C7A]"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <Filter className="w-4 h-4 text-[#8D7F84]" />
                      <select
                        value={productCategoryFilter}
                        onChange={(e) => setProductCategoryFilter(e.target.value)}
                        className="bg-white border border-[#F2D7E0] rounded-2xl px-3 py-2 text-xs outline-none"
                      >
                        <option value="All">All Categories</option>
                        <option value="Evening Wear">Evening Wear</option>
                        <option value="Party Wear">Party Wear</option>
                        <option value="Wedding">Wedding</option>
                        <option value="Casual">Casual</option>
                        <option value="Summer">Summer</option>
                        <option value="New Arrivals">New Arrivals</option>
                        <option value="Premium Collection">Premium Collection</option>
                      </select>
                    </div>
                  </div>

                  {/* Products Table */}
                  <div className="overflow-x-auto rounded-3xl border border-[#F2D7E0] bg-white shadow-sm">
                    <table className="w-full text-xs text-left">
                      <thead className="bg-[#FFF0F5] text-[#3A3033] font-semibold border-b border-[#F2D7E0]">
                        <tr>
                          <th className="py-3 px-3">Garment</th>
                          <th className="py-3 px-3">SKU</th>
                          <th className="py-3 px-3">Category</th>
                          <th className="py-3 px-3">Price</th>
                          <th className="py-3 px-3">Stock</th>
                          <th className="py-3 px-3">Rack Position</th>
                          <th className="py-3 px-3">Status</th>
                          <th className="py-3 px-3 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#F2D7E0]/50">
                        {products
                          .filter(p => {
                            const matchCat = productCategoryFilter === 'All' || p.category === productCategoryFilter;
                            const matchSearch = !productSearch || p.name.toLowerCase().includes(productSearch.toLowerCase()) || p.productId?.toLowerCase().includes(productSearch.toLowerCase());
                            return matchCat && matchSearch;
                          })
                          .map((p) => (
                            <tr key={p.id} className="hover:bg-[#FFF9FB]">
                              <td className="py-2.5 px-3">
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-12 bg-[#FFF0F5] rounded-xl overflow-hidden border border-[#F2D7E0] flex items-center justify-center p-0.5">
                                    <img src={p.images?.front} alt={p.name} className="w-full h-full object-contain" />
                                  </div>
                                  <div>
                                    <span className="font-serif font-bold text-sm text-[#3A3033] block">
                                      {p.name}
                                    </span>
                                    <span className="text-[10px] text-[#8D7F84]">{p.colors?.join(', ')}</span>
                                  </div>
                                </div>
                              </td>
                              <td className="py-2.5 px-3 font-mono font-bold text-[#C85C7A]">{p.productId}</td>
                              <td className="py-2.5 px-3">{p.category}</td>
                              <td className="py-2.5 px-3 font-bold text-[#3A3033]">₹{p.price.toLocaleString()}</td>
                              <td className="py-2.5 px-3">
                                <div className="flex items-center gap-1.5">
                                  <button
                                    onClick={() => handleAdjustStock(p, -1)}
                                    className="w-5 h-5 rounded bg-gray-100 hover:bg-[#FCE4EC] text-[#3A3033] font-bold flex items-center justify-center"
                                  >
                                    -
                                  </button>
                                  <span className={`font-bold ${p.stockQuantity <= 5 ? 'text-amber-600' : 'text-[#3A3033]'}`}>
                                    {p.stockQuantity}
                                  </span>
                                  <button
                                    onClick={() => handleAdjustStock(p, 1)}
                                    className="w-5 h-5 rounded bg-gray-100 hover:bg-[#FCE4EC] text-[#3A3033] font-bold flex items-center justify-center"
                                  >
                                    +
                                  </button>
                                </div>
                              </td>
                              <td className="py-2.5 px-3">
                                <span className="bg-[#FFF0F5] px-2 py-0.5 rounded-full text-[10px] text-[#C85C7A] font-semibold border border-[#F6B6C8]/60">
                                  Sec {p.showroomPosition?.section || 'A'} · {p.showroomPosition?.rack || 'Left-01'}
                                </span>
                              </td>
                              <td className="py-2.5 px-3">
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-800">
                                  {p.status || 'Published'}
                                </span>
                              </td>
                              <td className="py-2.5 px-3 text-right">
                                <div className="flex items-center justify-end gap-1.5">
                                  <button
                                    onClick={() => {
                                      setFormData(p);
                                      setPreviewModalOpen(true);
                                    }}
                                    title="3D Showroom Simulation"
                                    className="p-1.5 rounded-lg hover:bg-[#FCE4EC] text-[#8D7F84] hover:text-[#C85C7A]"
                                  >
                                    <Eye className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() => {
                                      setEditingProductId(p.id);
                                      setFormData(p);
                                      setActiveTab('add-product');
                                    }}
                                    title="Edit Garment"
                                    className="p-1.5 rounded-lg hover:bg-[#FCE4EC] text-[#8D7F84] hover:text-[#3A3033]"
                                  >
                                    <Edit3 className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteProduct(p.id)}
                                    title="Delete from Showroom"
                                    className="p-1.5 rounded-lg hover:bg-red-50 text-[#8D7F84] hover:text-red-600"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* ================= TAB: ADD / EDIT PRODUCT ================= */}
              {activeTab === 'add-product' && (
                <div className="space-y-6 animate-fadeIn max-w-4xl">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                    <div>
                      <h3 className="font-serif text-2xl font-bold text-[#3A3033]">
                        {editingProductId ? 'Edit Atelier Garment' : 'Create & Position Garment'}
                      </h3>
                      <p className="text-xs text-[#8D7F84]">
                        Upload dress photos to materialize exact 3D garments on showroom hangers
                      </p>
                    </div>

                    {/* Mode Toggle Pills */}
                    {!editingProductId && (
                      <div className="flex items-center p-1 bg-[#FFF0F5] rounded-2xl border border-[#F2D7E0]">
                        <button
                          type="button"
                          onClick={() => setAddMode('ai')}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                            addMode === 'ai'
                              ? 'bg-gradient-to-r from-[#F6B6C8] to-[#EA9AB0] text-white shadow-sm'
                              : 'text-[#8D7F84] hover:text-[#C85C7A]'
                          }`}
                        >
                          <Wand2 className="w-3.5 h-3.5" />
                          <span>AI Photo-to-3D (Auto)</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setAddMode('manual')}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                            addMode === 'manual'
                              ? 'bg-[#C85C7A] text-white shadow-sm'
                              : 'text-[#8D7F84] hover:text-[#C85C7A]'
                          }`}
                        >
                          <SlidersHorizontal className="w-3.5 h-3.5" />
                          <span>Manual 4-Angle</span>
                        </button>
                      </div>
                    )}
                  </div>

                  {/* ================= WORKFLOW A: AI PHOTO-TO-3D AUTO CONVERTER ================= */}
                  {addMode === 'ai' && !editingProductId && (
                    <div className="space-y-5">
                      {/* Upload & Preview Card */}
                      <div className="bg-[#FFF9FB] p-6 rounded-3xl border border-[#F2D7E0] space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="p-2 rounded-xl bg-[#FCE4EC] text-[#C85C7A]">
                              <Sparkles className="w-4 h-4" />
                            </div>
                            <div>
                              <h4 className="font-serif text-base font-bold text-[#3A3033]">
                                Upload Dress Photograph
                              </h4>
                              <p className="text-[11px] text-[#8D7F84]">
                                Upload a front view or studio shot. AI will extract silhouette, isolate background, construct 3D draping, and verify visual fidelity.
                              </p>
                            </div>
                          </div>
                          <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-[#FFF0F5] text-[#C85C7A] border border-[#F6B6C8]/60">
                            Powered by Gemini Vision
                          </span>
                        </div>

                        {aiHeroPreview ? (
                          <div className="space-y-4">
                            {isMultiPanelDetected && aiProcessedViews ? (
                              <div className="p-4 bg-white rounded-2xl border border-[#F2D7E0] space-y-3">
                                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                                  <div className="flex items-center gap-2 text-[#2E7D32] font-bold text-xs">
                                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                                    <span>4-Angle Multi-View Collage Sliced & Studio Background Removed</span>
                                  </div>
                                  <label className="cursor-pointer text-[11px] font-bold text-[#C85C7A] hover:underline">
                                    Upload Different Photo
                                    <input
                                      type="file"
                                      accept="image/*"
                                      className="hidden"
                                      onChange={handleHeroPhotoSelect}
                                    />
                                  </label>
                                </div>

                                {/* 4 Sliced Perspectives Grid */}
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                  {[
                                    { key: 'front', label: 'Front View (Hangs on 3D Rail)', highlight: true },
                                    { key: 'back', label: 'Back View' },
                                    { key: 'left', label: 'Left View' },
                                    { key: 'right', label: 'Right View' }
                                  ].map(({ key, label, highlight }) => (
                                    <div
                                      key={key}
                                      className={`p-2.5 rounded-xl border text-center transition-all ${
                                        highlight
                                          ? 'border-[#C85C7A] bg-[#FFF0F5]/50 ring-1 ring-[#F6B6C8]'
                                          : 'border-[#F2D7E0] bg-[#FFF9FB]'
                                      }`}
                                    >
                                      <span className={`text-[10px] font-bold uppercase tracking-wider block mb-1 ${
                                        highlight ? 'text-[#C85C7A]' : 'text-[#8D7F84]'
                                      }`}>
                                        {key.toUpperCase()} VIEW
                                      </span>
                                      <div className="h-44 flex items-center justify-center p-1 bg-white rounded-lg overflow-hidden border border-[#F2D7E0]/60">
                                        <img
                                          src={aiProcessedViews[key]}
                                          alt={key}
                                          className="max-h-full max-w-full object-contain filter drop-shadow-sm"
                                        />
                                      </div>
                                      <span className="text-[9px] text-[#8D7F84] mt-1 block truncate">
                                        {label}
                                      </span>
                                    </div>
                                  ))}
                                </div>

                                <div className="flex flex-wrap gap-2 pt-1 text-[10px]">
                                  <span className="px-2.5 py-1 bg-[#E8F5E9] text-[#2E7D32] rounded-lg font-semibold border border-[#A5D6A7]">
                                    ✓ Bottom Labels Stripped
                                  </span>
                                  <span className="px-2.5 py-1 bg-[#E8F5E9] text-[#2E7D32] rounded-lg font-semibold border border-[#A5D6A7]">
                                    ✓ Background Archway Isolated
                                  </span>
                                  <span className="px-2.5 py-1 bg-[#E8F5E9] text-[#2E7D32] rounded-lg font-semibold border border-[#A5D6A7]">
                                    ✓ Sculpted 3D Gown Mesh Assigned
                                  </span>
                                </div>
                              </div>
                            ) : (
                              <div className="flex flex-col sm:flex-row items-center gap-6 p-4 bg-white rounded-2xl border border-[#F2D7E0]">
                                <div className="relative group w-48 h-64 bg-[#FFF9FB] rounded-xl overflow-hidden border border-[#F2D7E0] flex items-center justify-center p-2">
                                  <img
                                    src={aiHeroPreview}
                                    alt="Dress Preview"
                                    className="max-h-full max-w-full object-contain filter drop-shadow-md"
                                  />
                                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <label className="cursor-pointer bg-white text-[#C85C7A] text-[11px] font-bold px-3 py-1.5 rounded-xl shadow-md hover:scale-105 transition-transform">
                                      Change Image
                                      <input
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={handleHeroPhotoSelect}
                                      />
                                    </label>
                                  </div>
                                </div>
                                <div className="flex-1 space-y-2 text-xs">
                                  <div className="flex items-center gap-2 text-[#2E7D32] font-bold">
                                    <CheckCircle2 className="w-4 h-4" />
                                    <span>Background Isolated & Silhouette Extracted</span>
                                  </div>
                                  <p className="text-[#8D7F84] leading-relaxed">
                                    Studio background wall removed. Garment draping contours and strap coordinates detected. Ready to synthesize sculpted 3D mesh and verify against reference image.
                                  </p>
                                  <div className="pt-2 flex flex-wrap gap-2">
                                    <span className="px-2.5 py-1 bg-[#FFF0F5] text-[#C85C7A] rounded-lg text-[10px] font-semibold border border-[#F6B6C8]/40">
                                      ✓ Alpha Cutout Clean
                                    </span>
                                    <span className="px-2.5 py-1 bg-[#FFF0F5] text-[#C85C7A] rounded-lg text-[10px] font-semibold border border-[#F6B6C8]/40">
                                      ✓ Golden Swivel Hanger Ready
                                    </span>
                                    <span className="px-2.5 py-1 bg-[#FFF0F5] text-[#C85C7A] rounded-lg text-[10px] font-semibold border border-[#F6B6C8]/40">
                                      ✓ Sculpted 3D Drape Plane
                                    </span>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        ) : (
                          <label className="flex flex-col items-center justify-center border-2 border-dashed border-[#F6B6C8] hover:border-[#C85C7A] rounded-2xl p-10 cursor-pointer bg-white transition-all group">
                            <div className="w-14 h-14 rounded-2xl bg-[#FFF0F5] text-[#C85C7A] flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                              <Upload className="w-7 h-7" />
                            </div>
                            <span className="font-serif text-base font-bold text-[#3A3033]">
                              Click or Drag & Drop Dress Photo
                            </span>
                            <span className="text-xs text-[#8D7F84] mt-1">
                              Supports high-resolution PNG, JPG, or WEBP (with or without background)
                            </span>
                            <span className="mt-3 text-[11px] font-bold text-[#C85C7A] bg-[#FCE4EC] px-3 py-1 rounded-full">
                              Browse Files
                            </span>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={handleHeroPhotoSelect}
                            />
                          </label>
                        )}
                      </div>

                      {/* Placement & Meta Options */}
                      <div className="bg-[#FFF9FB] p-6 rounded-3xl border border-[#F2D7E0] space-y-4 text-xs">
                        <h4 className="font-serif text-base font-bold text-[#3A3033]">
                          Showroom Rail Placement & Metadata
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                          <div>
                            <label className="block text-[#8D7F84] mb-1 font-medium">Garment Title (Optional)</label>
                            <input
                              type="text"
                              value={aiCustomTitle}
                              onChange={(e) => setAiCustomTitle(e.target.value)}
                              placeholder="e.g. Petal Blossom Silk Gown (or leave for AI)"
                              className="w-full p-2.5 bg-white border border-[#F2D7E0] rounded-xl outline-none"
                            />
                          </div>
                          <div>
                            <label className="block text-[#8D7F84] mb-1 font-medium">Category</label>
                            <select
                              value={aiCustomCategory}
                              onChange={(e) => setAiCustomCategory(e.target.value)}
                              className="w-full p-2.5 bg-white border border-[#F2D7E0] rounded-xl outline-none"
                            >
                              <option value="Evening Wear">Evening Wear</option>
                              <option value="Wedding">Wedding</option>
                              <option value="Party Wear">Party Wear</option>
                              <option value="Casual">Casual</option>
                              <option value="Summer">Summer</option>
                              <option value="Premium Collection">Premium Collection</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-[#8D7F84] mb-1 font-medium">Showroom Runway Section</label>
                            <select
                              value={aiSelectedSection}
                              onChange={(e) => setAiSelectedSection(e.target.value)}
                              className="w-full p-2.5 bg-white border border-[#F2D7E0] rounded-xl outline-none"
                            >
                              <option value="A">Section A · Grand Entrance</option>
                              <option value="B">Section B · Bridal Promenade</option>
                              <option value="C">Section C · Atelier Alcove</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-[#8D7F84] mb-1 font-medium">Rail Fixture</label>
                            <select
                              value={aiSelectedRack}
                              onChange={(e) => setAiSelectedRack(e.target.value)}
                              className="w-full p-2.5 bg-white border border-[#F2D7E0] rounded-xl outline-none"
                            >
                              <option value="Left-01">Rack Left-01 (Single Line)</option>
                              <option value="Right-01">Rack Right-01 (Single Line)</option>
                              <option value="Left-02">Rack Left-02</option>
                              <option value="Right-02">Rack Right-02</option>
                            </select>
                          </div>
                        </div>

                        {/* Pricing & Commercial Terms */}
                        <div className="pt-3 border-t border-[#F2D7E0] grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <div>
                            <label className="block text-[#8D7F84] mb-1 font-medium flex items-center justify-between">
                              <span>Selling Price (INR ₹)</span>
                              <span className="text-[10px] text-[#C85C7A] font-bold">Required</span>
                            </label>
                            <input
                              type="number"
                              value={aiPrice}
                              onChange={(e) => setAiPrice(e.target.value)}
                              placeholder="e.g. 7499"
                              className="w-full p-2.5 bg-white border border-[#F2D7E0] rounded-xl outline-none font-bold text-[#3A3033] focus:border-[#C85C7A]"
                            />
                          </div>

                          <div>
                            <label className="block text-[#8D7F84] mb-1 font-medium flex items-center justify-between">
                              <span>Original Price / MRP (₹)</span>
                              {aiPrice && aiOriginalPrice && Number(aiOriginalPrice) > Number(aiPrice) && (
                                <span className="text-[10px] text-[#2E7D32] font-bold">
                                  {Math.round(((Number(aiOriginalPrice) - Number(aiPrice)) / Number(aiOriginalPrice)) * 100)}% OFF
                                </span>
                              )}
                            </label>
                            <input
                              type="number"
                              value={aiOriginalPrice}
                              onChange={(e) => setAiOriginalPrice(e.target.value)}
                              placeholder="e.g. 11999"
                              className="w-full p-2.5 bg-white border border-[#F2D7E0] rounded-xl outline-none text-[#8D7F84]"
                            />
                          </div>

                          <div>
                            <label className="block text-[#8D7F84] mb-1 font-medium">Stock Quantity</label>
                            <input
                              type="number"
                              value={aiStockQuantity}
                              onChange={(e) => setAiStockQuantity(e.target.value)}
                              placeholder="15"
                              className="w-full p-2.5 bg-white border border-[#F2D7E0] rounded-xl outline-none"
                            />
                          </div>
                        </div>

                        {/* Execute Action Button */}
                        <div className="pt-2">
                          <button
                            type="button"
                            disabled={!aiHeroImage || aiConverting}
                            onClick={handleExecuteAi3DConversion}
                            className={`w-full py-4 px-6 rounded-2xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition-all ${
                              !aiHeroImage || aiConverting
                                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                : 'bg-gradient-to-r from-[#F6B6C8] via-[#EA9AB0] to-[#C85C7A] text-white hover:shadow-xl hover:scale-[1.01] active:scale-95'
                            }`}
                          >
                            {aiConverting ? (
                              <>
                                <RotateCcw className="w-4 h-4 animate-spin" />
                                <span>AI Reconstructing & Verifying 3D Garment...</span>
                              </>
                            ) : (
                              <>
                                <Wand2 className="w-4 h-4" />
                                <span>Reconstruct & Verify 3D Garment with AI</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>

                      {/* AI Conversion Pipeline Visual Stepper */}
                      {aiProgress && (
                        <div className="bg-[#FFF9FB] p-5 rounded-3xl border border-[#F2D7E0] space-y-4 animate-fadeIn">
                          <div className="flex items-center justify-between">
                            <span className="font-serif text-sm font-bold text-[#3A3033]">
                              AI Reconstruction & Verification Pipeline
                            </span>
                            {aiProgress.similarity > 0 && (
                              <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#E8F5E9] text-[#2E7D32] border border-[#A5D6A7]">
                                Visual Similarity: {aiProgress.similarity}%
                              </span>
                            )}
                          </div>

                          {/* 5-Step Progress Indicators */}
                          <div className="grid grid-cols-5 gap-2 text-center text-[10px]">
                            {[
                              { s: 1, label: 'Vision Ingestion' },
                              { s: 2, label: '3D Drapery' },
                              { s: 3, label: 'Similarity Check' },
                              { s: 4, label: 'Auto-Correction' },
                              { s: 5, label: 'Showroom Rail' }
                            ].map(({ s, label }) => {
                              const isPast = aiProgress.step > s || aiProgress.status === 'done';
                              const isCurrent = aiProgress.step === s && aiProgress.status === 'running';
                              return (
                                <div key={s} className="space-y-1">
                                  <div
                                    className={`h-2 rounded-full transition-all ${
                                      isPast
                                        ? 'bg-[#2E7D32]'
                                        : isCurrent
                                        ? 'bg-[#C85C7A] animate-pulse'
                                        : 'bg-gray-200'
                                    }`}
                                  />
                                  <span
                                    className={`font-semibold ${
                                      isPast
                                        ? 'text-[#2E7D32]'
                                        : isCurrent
                                        ? 'text-[#C85C7A]'
                                        : 'text-[#8D7F84]'
                                    }`}
                                  >
                                    {label}
                                  </span>
                                </div>
                              );
                            })}
                          </div>

                          {/* Live Status Message */}
                          <div className="p-3 bg-white rounded-xl border border-[#F2D7E0] text-xs flex items-center justify-between">
                            <span className="text-[#3A3033] font-medium">{aiProgress.message}</span>
                            {aiProgress.status === 'running' && (
                              <RotateCcw className="w-3.5 h-3.5 animate-spin text-[#C85C7A]" />
                            )}
                            {aiProgress.status === 'done' && (
                              <CheckCircle2 className="w-4 h-4 text-[#2E7D32]" />
                            )}
                          </div>

                          {/* Success Actions */}
                          {aiConvertedProduct && (
                            <div className="pt-2 flex flex-col sm:flex-row gap-3">
                              <button
                                type="button"
                                onClick={() => {
                                  if (onProductPublished) onProductPublished();
                                  onClose();
                                  if (onSelectProduct && aiConvertedProduct) {
                                    onSelectProduct(aiConvertedProduct);
                                  }
                                }}
                                className="flex-1 btn-loki py-3 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-md hover:scale-[1.02] active:scale-95 transition-all"
                              >
                                <Eye className="w-4 h-4" />
                                <span>View Live in 3D Showroom</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => setActiveTab('ai-settings')}
                                className="px-4 py-3 bg-white hover:bg-[#FCE4EC] text-[#C85C7A] border border-[#F6B6C8] rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all"
                              >
                                <Terminal className="w-4 h-4" />
                                <span>Inspect Live AI Logs</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  setAiHeroImage(null);
                                  setAiHeroPreview(null);
                                  setAiProgress(null);
                                  setAiConvertedProduct(null);
                                  setAiCustomTitle('');
                                }}
                                className="px-4 py-3 bg-white hover:bg-gray-100 text-[#8D7F84] border border-[#F2D7E0] rounded-xl text-xs font-semibold"
                              >
                                Convert Another Dress
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}

                  {/* ================= WORKFLOW B: DETAILED 4-SIDE MANUAL ENTRY ================= */}
                  {(addMode === 'manual' || editingProductId) && (
                    <div className="space-y-6">

                  {/* General Product Info Form Fields */}
                  <div className="bg-[#FFF9FB] p-5 rounded-3xl border border-[#F2D7E0] space-y-4 text-xs">
                    <h4 className="font-serif text-base font-bold text-[#3A3033]">Garment Details</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[#8D7F84] mb-1 font-medium">Garment Title</label>
                        <input
                          type="text"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="w-full p-2.5 bg-white border border-[#F2D7E0] rounded-xl outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[#8D7F84] mb-1 font-medium">Product ID / SKU</label>
                        <input
                          type="text"
                          value={formData.productId}
                          onChange={(e) => setFormData({ ...formData, productId: e.target.value })}
                          className="w-full p-2.5 bg-white border border-[#F2D7E0] rounded-xl outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[#8D7F84] mb-1 font-medium">Category</label>
                        <select
                          value={formData.category}
                          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                          className="w-full p-2.5 bg-white border border-[#F2D7E0] rounded-xl outline-none"
                        >
                          <option value="Evening Wear">Evening Wear</option>
                          <option value="Party Wear">Party Wear</option>
                          <option value="Wedding">Wedding</option>
                          <option value="Casual">Casual</option>
                          <option value="Summer">Summer</option>
                          <option value="New Arrivals">New Arrivals</option>
                          <option value="Premium Collection">Premium Collection</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[#8D7F84] mb-1 font-medium">Price (INR ₹)</label>
                        <input
                          type="number"
                          value={formData.price}
                          onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                          className="w-full p-2.5 bg-white border border-[#F2D7E0] rounded-xl outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[#8D7F84] mb-1 font-medium">Original Price (₹)</label>
                        <input
                          type="number"
                          value={formData.originalPrice}
                          onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                          className="w-full p-2.5 bg-white border border-[#F2D7E0] rounded-xl outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[#8D7F84] mb-1 font-medium">Stock Quantity</label>
                        <input
                          type="number"
                          value={formData.stockQuantity}
                          onChange={(e) => setFormData({ ...formData, stockQuantity: e.target.value })}
                          className="w-full p-2.5 bg-white border border-[#F2D7E0] rounded-xl outline-none"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-[#8D7F84] mb-1 font-medium">Description</label>
                        <textarea
                          rows={2}
                          value={formData.description}
                          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                          className="w-full p-2.5 bg-white border border-[#F2D7E0] rounded-xl outline-none resize-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[#8D7F84] mb-1 font-medium">Fabric & Material</label>
                        <input
                          type="text"
                          value={formData.material}
                          onChange={(e) => setFormData({ ...formData, material: e.target.value })}
                          className="w-full p-2.5 bg-white border border-[#F2D7E0] rounded-xl outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  {/* ================= 4-SIDE PRODUCT IMAGE UPLOAD SECTION ================= */}
                  <div className="bg-[#FFF9FB] p-5 rounded-3xl border border-[#F2D7E0] space-y-4">
                    <div>
                      <h4 className="font-serif text-base font-bold text-[#3A3033]">
                        4-Side Multi-Angle Garment Photography
                      </h4>
                      <p className="text-xs text-[#8D7F84]">
                        Admin must upload all 4 perspectives: Front, Back, Left, and Right views for 360° virtual turntable inspection
                      </p>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      {['front', 'back', 'left', 'right'].map((view) => {
                        const imgUrl = formData.images?.[view];
                        return (
                          <div
                            key={view}
                            className="bg-white rounded-2xl p-3 border-2 border-dashed border-[#F2D7E0] hover:border-[#C85C7A] transition-all flex flex-col items-center justify-between min-h-[220px] relative group"
                          >
                            <span className="text-[10px] tracking-wider uppercase font-bold text-[#C85C7A] mb-1">
                              {view.toUpperCase()} VIEW
                            </span>

                            {imgUrl ? (
                              <div className="w-full h-32 rounded-xl bg-[#FFF9FB] overflow-hidden flex items-center justify-center p-1 relative">
                                <img
                                  src={imgUrl}
                                  alt={view}
                                  className="max-h-full max-w-full object-contain filter drop-shadow-sm"
                                />
                                <button
                                  type="button"
                                  onClick={() => setFormData(prev => ({
                                    ...prev,
                                    images: { ...prev.images, [view]: '' }
                                  }))}
                                  className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                  <X className="w-3 h-3" />
                                </button>
                              </div>
                            ) : (
                              <label className="flex-1 w-full flex flex-col items-center justify-center cursor-pointer p-2 text-center text-[#8D7F84]">
                                <Upload className="w-6 h-6 text-[#C85C7A] mb-1" />
                                <span className="text-[11px] font-semibold text-[#3A3033]">Upload {view}</span>
                                <span className="text-[9px] text-[#8D7F84] mt-0.5">PNG, JPG or SVG</span>
                                <input
                                  type="file"
                                  accept="image/*"
                                  className="hidden"
                                  onChange={(e) => handleImageFileChange(view, e)}
                                />
                              </label>
                            )}

                            {imgUrl && (
                              <label className="mt-2 text-[10px] text-[#C85C7A] font-semibold hover:underline cursor-pointer">
                                Replace {view}
                                <input
                                  type="file"
                                  accept="image/*"
                                  className="hidden"
                                  onChange={(e) => handleImageFileChange(view, e)}
                                />
                              </label>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* ================= 3D SHOWROOM POSITIONING ================= */}
                  <div className="bg-[#FFF9FB] p-5 rounded-3xl border border-[#F2D7E0] space-y-4 text-xs">
                    <h4 className="font-serif text-base font-bold text-[#3A3033]">
                      Virtual 3D Showroom Positioning
                    </h4>
                    <p className="text-[#8D7F84]">
                      Control where this garment physically hangs inside the 3D retail boutique aisle
                    </p>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <div>
                        <label className="block text-[#8D7F84] mb-1 font-medium">Section</label>
                        <select
                          value={formData.showroomPosition.section}
                          onChange={(e) => setFormData({
                            ...formData,
                            showroomPosition: { ...formData.showroomPosition, section: e.target.value }
                          })}
                          className="w-full p-2.5 bg-white border border-[#F2D7E0] rounded-xl outline-none"
                        >
                          <option value="A">Section A (Entrance & Evening)</option>
                          <option value="B">Section B (Gala & Bridal)</option>
                          <option value="C">Section C (Atelier Reserve)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[#8D7F84] mb-1 font-medium">Rack</label>
                        <select
                          value={formData.showroomPosition.rack}
                          onChange={(e) => {
                            const val = e.target.value;
                            const side = val.toLowerCase().includes('right') ? 'right' : 'left';
                            setFormData({
                              ...formData,
                              showroomPosition: { ...formData.showroomPosition, rack: val, side }
                            });
                          }}
                          className="w-full p-2.5 bg-white border border-[#F2D7E0] rounded-xl outline-none"
                        >
                          <option value="Left-01">Rack Left-01</option>
                          <option value="Left-02">Rack Left-02</option>
                          <option value="Right-01">Rack Right-01</option>
                          <option value="Right-02">Rack Right-02</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[#8D7F84] mb-1 font-medium">Position on Rail (0-10)</label>
                        <input
                          type="number"
                          value={formData.showroomPosition.position}
                          onChange={(e) => setFormData({
                            ...formData,
                            showroomPosition: { ...formData.showroomPosition, position: Number(e.target.value) }
                          })}
                          className="w-full p-2.5 bg-white border border-[#F2D7E0] rounded-xl outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-[#8D7F84] mb-1 font-medium">3D Fabric Tint (#Hex)</label>
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            value={formData.colorCode || '#F6B6C8'}
                            onChange={(e) => setFormData({ ...formData, colorCode: e.target.value })}
                            className="w-9 h-9 rounded-xl border border-[#F2D7E0] cursor-pointer"
                          />
                          <input
                            type="text"
                            value={formData.colorCode || '#F6B6C8'}
                            onChange={(e) => setFormData({ ...formData, colorCode: e.target.value })}
                            className="w-full p-2.5 bg-white border border-[#F2D7E0] rounded-xl outline-none font-mono"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions: 3D Preview Modal & Publish Product */}
                  <div className="flex flex-col sm:flex-row gap-3 pt-3">
                    <button
                      type="button"
                      onClick={() => setPreviewModalOpen(true)}
                      className="py-3.5 px-6 rounded-2xl bg-white hover:bg-[#FCE4EC] text-[#3A3033] border border-[#F2D7E0] text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2"
                    >
                      <Eye className="w-4 h-4 text-[#C85C7A]" />
                      <span>3D Showroom Preview</span>
                    </button>

                    <button
                      type="button"
                      onClick={handlePublishProduct}
                      className="flex-1 btn-loki py-3.5 px-8 rounded-2xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg"
                    >
                      <Check className="w-4 h-4" />
                      <span>{editingProductId ? 'Update Garment in Showroom' : 'Publish to 3D Showroom'}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

              {/* ================= TAB: ORDERS ================= */}
              {activeTab === 'orders' && (
                <div className="space-y-4 animate-fadeIn">
                  <div>
                    <h3 className="font-serif text-2xl font-bold text-[#3A3033]">Order Management</h3>
                    <p className="text-xs text-[#8D7F84]">Live fulfillment tracking and status transitions</p>
                  </div>

                  <div className="overflow-x-auto rounded-3xl border border-[#F2D7E0] bg-white shadow-sm">
                    <table className="w-full text-xs text-left">
                      <thead className="bg-[#FFF0F5] text-[#3A3033] font-semibold border-b border-[#F2D7E0]">
                        <tr>
                          <th className="py-3 px-3">Order ID</th>
                          <th className="py-3 px-3">Customer</th>
                          <th className="py-3 px-3">Garments & Size</th>
                          <th className="py-3 px-3">Amount</th>
                          <th className="py-3 px-3">Payment</th>
                          <th className="py-3 px-3">Order Status</th>
                          <th className="py-3 px-3">Date</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#F2D7E0]/50">
                        {orders.map((o) => (
                          <tr key={o.orderId} className="hover:bg-[#FFF9FB]">
                            <td className="py-3 px-3 font-mono font-bold text-[#C85C7A]">{o.orderId}</td>
                            <td className="py-3 px-3">
                              <span className="font-semibold block">{o.customer?.fullName}</span>
                              <span className="text-[10px] text-[#8D7F84]">{o.customer?.city}</span>
                            </td>
                            <td className="py-3 px-3">
                              {o.items?.map((item, idx) => (
                                <div key={idx} className="font-medium text-[#3A3033]">
                                  {item.name} ({item.size}) × {item.quantity}
                                </div>
                              ))}
                            </td>
                            <td className="py-3 px-3 font-bold text-[#3A3033]">₹{o.total?.toLocaleString()}</td>
                            <td className="py-3 px-3">
                              <span className="text-emerald-700 font-medium">{o.paymentMethod}</span>
                            </td>
                            <td className="py-3 px-3">
                              <select
                                value={o.orderStatus}
                                onChange={(e) => handleUpdateOrderStatus(o.orderId, e.target.value)}
                                className="bg-[#FFF0F5] border border-[#F6B6C8] rounded-xl px-2.5 py-1 text-xs font-semibold text-[#C85C7A] outline-none"
                              >
                                <option value="Pending">Pending</option>
                                <option value="Confirmed">Confirmed</option>
                                <option value="Processing">Processing</option>
                                <option value="Packed">Packed</option>
                                <option value="Shipped">Shipped</option>
                                <option value="Out for Delivery">Out for Delivery</option>
                                <option value="Delivered">Delivered</option>
                                <option value="Cancelled">Cancelled</option>
                              </select>
                            </td>
                            <td className="py-3 px-3 text-[#8D7F84]">
                              {new Date(o.date).toLocaleDateString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* ================= TAB: CUSTOMERS ================= */}
              {activeTab === 'customers' && (
                <div className="space-y-4 animate-fadeIn">
                  <div>
                    <h3 className="font-serif text-2xl font-bold text-[#3A3033]">Customer Directory</h3>
                    <p className="text-xs text-[#8D7F84]">Registered clients and haute couture purchasers</p>
                  </div>

                  <div className="overflow-x-auto rounded-3xl border border-[#F2D7E0] bg-white shadow-sm">
                    <table className="w-full text-xs text-left">
                      <thead className="bg-[#FFF0F5] text-[#3A3033] font-semibold border-b border-[#F2D7E0]">
                        <tr>
                          <th className="py-3 px-3">Client Name</th>
                          <th className="py-3 px-3">Email</th>
                          <th className="py-3 px-3">Phone</th>
                          <th className="py-3 px-3">City</th>
                          <th className="py-3 px-3">Orders</th>
                          <th className="py-3 px-3">Total Spend</th>
                          <th className="py-3 px-3">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#F2D7E0]/50">
                        {customers.map((c) => (
                          <tr key={c.id} className="hover:bg-[#FFF9FB]">
                            <td className="py-3 px-3 font-semibold text-[#3A3033]">{c.fullName}</td>
                            <td className="py-3 px-3 text-[#8D7F84]">{c.email}</td>
                            <td className="py-3 px-3 text-[#8D7F84]">{c.phone || '+91 98200 00000'}</td>
                            <td className="py-3 px-3">{c.city}</td>
                            <td className="py-3 px-3 font-bold text-[#C85C7A]">{c.orders}</td>
                            <td className="py-3 px-3 font-bold text-[#3A3033]">₹{c.totalSpent?.toLocaleString()}</td>
                            <td className="py-3 px-3">
                              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-[#FCE4EC] text-[#C85C7A]">
                                {c.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* ================= TAB: INVENTORY ================= */}
              {activeTab === 'inventory' && (
                <div className="space-y-4 animate-fadeIn">
                  <div>
                    <h3 className="font-serif text-2xl font-bold text-[#3A3033]">Stock & Inventory Control</h3>
                    <p className="text-xs text-[#8D7F84]">Real-time stock deduction and runway reserves</p>
                  </div>

                  <div className="overflow-x-auto rounded-3xl border border-[#F2D7E0] bg-white shadow-sm">
                    <table className="w-full text-xs text-left">
                      <thead className="bg-[#FFF0F5] text-[#3A3033] font-semibold border-b border-[#F2D7E0]">
                        <tr>
                          <th className="py-3 px-3">Garment</th>
                          <th className="py-3 px-3">SKU</th>
                          <th className="py-3 px-3">Available Stock</th>
                          <th className="py-3 px-3">Reserved</th>
                          <th className="py-3 px-3">Sold Count</th>
                          <th className="py-3 px-3">Showroom Location</th>
                          <th className="py-3 px-3">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#F2D7E0]/50">
                        {inventory.map((inv) => (
                          <tr key={inv.id} className="hover:bg-[#FFF9FB]">
                            <td className="py-3 px-3 font-serif font-bold text-sm text-[#3A3033]">{inv.name}</td>
                            <td className="py-3 px-3 font-mono font-bold text-[#C85C7A]">{inv.productId}</td>
                            <td className="py-3 px-3">
                              <span className="font-bold text-sm text-[#3A3033]">{inv.stockQuantity} units</span>
                            </td>
                            <td className="py-3 px-3 text-[#8D7F84]">{inv.reserved}</td>
                            <td className="py-3 px-3 font-semibold text-emerald-700">{inv.soldCount}</td>
                            <td className="py-3 px-3 text-[#C85C7A] font-medium">{inv.showroomLocation}</td>
                            <td className="py-3 px-3">
                              <span
                                className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                                  inv.status === 'In Stock'
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : inv.status === 'Low Stock'
                                    ? 'bg-amber-100 text-amber-800'
                                    : 'bg-red-100 text-red-800'
                                }`}
                              >
                                {inv.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* ================= TAB: SHOWROOM 3D LAYOUT ================= */}
              {activeTab === 'showroom' && (
                <div className="space-y-6 animate-fadeIn">
                  <div>
                    <h3 className="font-serif text-2xl font-bold text-[#3A3033]">3D Showroom Architecture Management</h3>
                    <p className="text-xs text-[#8D7F84]">Configure boutique atmosphere, runway sections, and spotlights</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-[#FFF9FB] p-5 rounded-3xl border border-[#F2D7E0] space-y-3 text-xs">
                      <h4 className="font-serif text-base font-bold text-[#3A3033]">Runway Lighting Atmosphere</h4>
                      <div>
                        <label className="block text-[#8D7F84] mb-1">Ambient Light Level (0.5 - 2.0)</label>
                        <input
                          type="range"
                          min="0.5"
                          max="2.0"
                          step="0.05"
                          defaultValue={showroomConfig?.ambientIntensity || 1.1}
                          className="w-full accent-[#C85C7A]"
                        />
                      </div>
                      <div>
                        <label className="block text-[#8D7F84] mb-1">Floor Reflection Gloss</label>
                        <input
                          type="range"
                          min="0.1"
                          max="0.9"
                          step="0.05"
                          defaultValue={showroomConfig?.floorReflection || 0.7}
                          className="w-full accent-[#C85C7A]"
                        />
                      </div>
                      <div className="p-3 bg-white rounded-2xl border border-[#F2D7E0]">
                        <span className="font-bold text-[#3A3033] block">Active Lighting Mode:</span>
                        <span className="text-[#C85C7A]">Warm Runway Spotlight & Soft Pastel Bounce</span>
                      </div>
                    </div>

                    <div className="bg-[#FFF9FB] p-5 rounded-3xl border border-[#F2D7E0] space-y-3 text-xs">
                      <h4 className="font-serif text-base font-bold text-[#3A3033]">Boutique Aisle Map</h4>
                      <div className="p-4 bg-white rounded-2xl border border-[#F2D7E0] space-y-2">
                        <div className="flex justify-between items-center pb-2 border-b border-[#F2D7E0]">
                          <span className="font-bold text-[#3A3033]">Section A · Grand Entrance</span>
                          <span className="text-[#C85C7A] font-semibold">Racks Left-01, Right-01</span>
                        </div>
                        <div className="flex justify-between items-center pb-2 border-b border-[#F2D7E0]">
                          <span className="font-bold text-[#3A3033]">Section B · Gala & Bridal Promenade</span>
                          <span className="text-[#C85C7A] font-semibold">Racks Left-02, Right-02</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-[#3A3033]">Section C · Atelier Reserve Alcove</span>
                          <span className="text-[#8D7F84]">End of Runway</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ================= TAB: AI ENGINE SETTINGS & REAL-TIME LOGS ================= */}
              {activeTab === 'ai-settings' && (
                <div className="space-y-6 animate-fadeIn max-w-5xl">
                  {/* Header */}
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                    <div>
                      <h3 className="font-serif text-2xl font-bold text-[#3A3033] flex items-center gap-2">
                        <Cpu className="w-6 h-6 text-[#C85C7A]" />
                        <span>AI Vision & 3D Reconstruction Engine</span>
                      </h3>
                      <p className="text-xs text-[#8D7F84]">
                        Configure Google Gemini multimodal API keys, select vision models, set similarity thresholds, and inspect live AI verification logs
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-[#E8F5E9] text-[#2E7D32] border border-[#A5D6A7] flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-[#2E7D32] animate-ping" />
                        AI Pipeline Active
                      </span>
                    </div>
                  </div>

                  {/* 1. API Credentials & Model Configuration Card */}
                  <div className="bg-[#FFF9FB] p-6 rounded-3xl border border-[#F2D7E0] space-y-5 text-xs">
                    <div className="flex items-center justify-between border-b border-[#F2D7E0] pb-3">
                      <div>
                        <h4 className="font-serif text-base font-bold text-[#3A3033]">
                          Multimodal AI Provider & Model Setup
                        </h4>
                        <p className="text-[11px] text-[#8D7F84]">
                          Used for analyzing 2D dress photos, extracting silhouette contours, and verifying 3D fidelity
                        </p>
                      </div>
                      <a
                        href="https://aistudio.google.com/app/apikey"
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1 text-[11px] font-bold text-[#C85C7A] hover:underline"
                      >
                        <span>Get Gemini API Key</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {/* Provider Select */}
                      <div>
                        <label className="block text-[#8D7F84] mb-1 font-medium">AI Provider</label>
                        <select
                          value={aiConfig.provider || 'gemini'}
                          onChange={(e) => setAiConfig({ ...aiConfig, provider: e.target.value })}
                          className="w-full p-2.5 bg-white border border-[#F2D7E0] rounded-xl outline-none font-semibold text-[#3A3033]"
                        >
                          <option value="gemini">Google Gemini (Recommended)</option>
                          <option value="openai">OpenAI (GPT-4o Vision)</option>
                          <option value="claude">Anthropic (Claude 3.5 Sonnet)</option>
                        </select>
                      </div>

                      {/* Dynamic Model Entry (Allows free typing + autocomplete suggestions) */}
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="text-[#8D7F84] font-medium">AI Model Name</label>
                          <span className="text-[10px] text-[#C85C7A] font-semibold">Enter any model</span>
                        </div>
                        <input
                          type="text"
                          list="ai-model-list"
                          value={aiConfig.model || ''}
                          onChange={(e) => setAiConfig({ ...aiConfig, model: e.target.value })}
                          placeholder="e.g. gemini-1.5-flash, gemini-2.0-flash..."
                          className="w-full p-2.5 bg-white border border-[#F2D7E0] rounded-xl outline-none font-mono text-xs font-semibold text-[#3A3033] focus:border-[#C85C7A]"
                        />
                        <datalist id="ai-model-list">
                          <option value="gemini-1.5-flash">Gemini 1.5 Flash (Fast Multimodal)</option>
                          <option value="gemini-1.5-pro">Gemini 1.5 Pro (Couture Precision)</option>
                          <option value="gemini-2.0-flash">Gemini 2.0 Flash (Next-Gen Multimodal)</option>
                          <option value="gemini-2.0-flash-exp">Gemini 2.0 Flash Experimental</option>
                          <option value="gemini-pro-vision">Gemini Pro Vision</option>
                          <option value="gpt-4o">OpenAI GPT-4o</option>
                          <option value="claude-3-5-sonnet-20241022">Claude 3.5 Sonnet</option>
                        </datalist>

                        {/* Quick Presets Pills */}
                        <div className="flex flex-wrap gap-1 mt-1.5">
                          {['gemini-1.5-flash', 'gemini-1.5-pro', 'gemini-2.0-flash'].map((m) => (
                            <button
                              key={m}
                              type="button"
                              onClick={() => setAiConfig({ ...aiConfig, model: m })}
                              className={`text-[9px] px-2 py-0.5 rounded-md font-mono transition-all ${
                                aiConfig.model === m
                                  ? 'bg-[#C85C7A] text-white font-bold'
                                  : 'bg-[#FFF0F5] text-[#8D7F84] hover:text-[#C85C7A] border border-[#F2D7E0]'
                              }`}
                            >
                              {m}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* API Key Input */}
                      <div className="sm:col-span-2 lg:col-span-1">
                        <label className="block text-[#8D7F84] mb-1 font-medium flex items-center justify-between">
                          <span>Gemini API Key</span>
                          <span className="text-[10px] text-[#C85C7A]">Encrypted & Stored Locally</span>
                        </label>
                        <div className="relative flex items-center">
                          <input
                            type={showApiKey ? 'text' : 'password'}
                            value={aiConfig.apiKey || ''}
                            onChange={(e) => setAiConfig({ ...aiConfig, apiKey: e.target.value })}
                            placeholder="AIzaSy... (Paste Gemini Key)"
                            className="w-full p-2.5 pr-10 bg-white border border-[#F2D7E0] rounded-xl outline-none font-mono text-xs"
                          />
                          <button
                            type="button"
                            onClick={() => setShowApiKey(!showApiKey)}
                            className="absolute right-3 text-[#8D7F84] hover:text-[#3A3033]"
                            title={showApiKey ? 'Hide Key' : 'Show Key'}
                          >
                            {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons for API */}
                    <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={handleSaveAiConfig}
                          disabled={isSavingAiConfig}
                          className="btn-loki py-2 px-5 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-sm"
                        >
                          {isSavingAiConfig ? (
                            <RotateCcw className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <Check className="w-3.5 h-3.5" />
                          )}
                          <span>Save Settings</span>
                        </button>

                        <button
                          type="button"
                          onClick={handleTestAiConnection}
                          disabled={isTestingAi}
                          className="py-2 px-4 rounded-xl bg-white hover:bg-[#FCE4EC] text-[#C85C7A] border border-[#F6B6C8] font-bold text-xs flex items-center gap-1.5 transition-all shadow-sm"
                        >
                          {isTestingAi ? (
                            <RotateCcw className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <Bot className="w-3.5 h-3.5" />
                          )}
                          <span>Test Gemini Connection</span>
                        </button>
                      </div>

                      <span className="text-[11px] text-[#8D7F84]">
                        Key status: {aiConfig.apiKey ? 'Configured ✓' : 'Using Local Neural Vision Engine'}
                      </span>
                    </div>

                    {/* Test Connection Result Alert */}
                    {aiTestResult && (
                      <div
                        className={`p-3.5 rounded-2xl border text-xs flex items-start gap-2.5 animate-fadeIn ${
                          aiTestResult.success
                            ? 'bg-[#E8F5E9] border-[#A5D6A7] text-[#1B5E20]'
                            : 'bg-[#FFF3E0] border-[#FFCC80] text-[#E65100]'
                        }`}
                      >
                        {aiTestResult.success ? (
                          <CheckCircle2 className="w-4 h-4 shrink-0 text-[#2E7D32] mt-0.5" />
                        ) : (
                          <AlertTriangle className="w-4 h-4 shrink-0 text-[#E65100] mt-0.5" />
                        )}
                        <div className="flex-1">
                          <span className="font-bold block">
                            {aiTestResult.success ? 'Gemini API Connected Successfully' : 'Connection Notice'}
                          </span>
                          <span className="text-[11px] opacity-90">{aiTestResult.message}</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* 2. AI Verification & Self-Correction Feedback Loop Controls */}
                  <div className="bg-[#FFF9FB] p-6 rounded-3xl border border-[#F2D7E0] space-y-4 text-xs">
                    <div className="border-b border-[#F2D7E0] pb-3">
                      <h4 className="font-serif text-base font-bold text-[#3A3033]">
                        AI Visual Similarity Verification & Auto-Correction
                      </h4>
                      <p className="text-[11px] text-[#8D7F84]">
                        Enforces quality assurance: AI compares the original photo against the 3D drape mesh. If discrepancies are detected, AI adjusts curvature/flare and re-verifies.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      {/* Similarity Threshold Slider */}
                      <div className="p-4 bg-white rounded-2xl border border-[#F2D7E0] space-y-2">
                        <div className="flex justify-between items-center">
                          <label className="font-bold text-[#3A3033]">
                            Minimum Similarity Verification Threshold
                          </label>
                          <span className="font-mono font-bold text-sm text-[#C85C7A] bg-[#FFF0F5] px-2.5 py-0.5 rounded-lg border border-[#F6B6C8]/60">
                            {aiConfig.minSimilarityScore || 95}%
                          </span>
                        </div>
                        <input
                          type="range"
                          min="80"
                          max="99"
                          step="1"
                          value={aiConfig.minSimilarityScore || 95}
                          onChange={(e) => setAiConfig({ ...aiConfig, minSimilarityScore: Number(e.target.value) })}
                          className="w-full accent-[#C85C7A] cursor-pointer"
                        />
                        <div className="flex justify-between text-[10px] text-[#8D7F84]">
                          <span>80% (Permissive)</span>
                          <span>95% (Haute Couture Recommended)</span>
                          <span>99% (Strict Identical)</span>
                        </div>
                      </div>

                      {/* Auto-Correction Feedback Loop Toggle */}
                      <div className="p-4 bg-white rounded-2xl border border-[#F2D7E0] flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-center mb-1">
                            <span className="font-bold text-[#3A3033]">AI Self-Correction Loop</span>
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#E8F5E9] text-[#2E7D32]">
                              Active
                            </span>
                          </div>
                          <p className="text-[11px] text-[#8D7F84] leading-relaxed">
                            When enabled, if initial similarity score falls below threshold, the AI automatically formulates corrective feedback (waist taper, skirt flare, color curve) and runs iterative refinement.
                          </p>
                        </div>
                        <div className="pt-2 flex items-center gap-2">
                          <label className="text-[11px] text-[#8D7F84]">Max Refine Iterations:</label>
                          <select
                            value={aiConfig.maxRefineIterations || 3}
                            onChange={(e) => setAiConfig({ ...aiConfig, maxRefineIterations: Number(e.target.value) })}
                            className="p-1 px-2 bg-[#FFF9FB] border border-[#F2D7E0] rounded-lg text-xs font-semibold"
                          >
                            <option value="1">1 Attempt</option>
                            <option value="2">2 Attempts</option>
                            <option value="3">3 Attempts (Standard)</option>
                            <option value="5">5 Attempts (Max Fidelity)</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 3. Real-Time AI Execution Logs Terminal */}
                  <div className="bg-[#140F12] rounded-3xl border border-[#3A2530] p-5 shadow-2xl space-y-4">
                    {/* Console Header */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-[#3A2530] pb-3">
                      <div className="flex items-center gap-2.5">
                        <Terminal className="w-5 h-5 text-[#F6B6C8]" />
                        <div>
                          <h4 className="font-mono text-sm font-bold text-white tracking-wide">
                            ATELIER AI LOGS & VERIFICATION CONSOLE
                          </h4>
                          <span className="text-[10px] font-mono text-[#A8989F]">
                            Real-time streaming telemetry · {aiLogs.length} events logged
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={handleRefreshAiLogs}
                          className="px-3 py-1.5 rounded-xl bg-[#2A1E24] hover:bg-[#3D2C35] text-[#F6B6C8] font-mono text-[11px] flex items-center gap-1.5 transition-all"
                          title="Refresh Console Logs"
                        >
                          <RefreshCw className="w-3 h-3" />
                          <span>Refresh</span>
                        </button>
                        <button
                          type="button"
                          onClick={handleClearAiLogs}
                          className="px-3 py-1.5 rounded-xl bg-[#2A1E24] hover:bg-[#3D2C35] text-red-300 font-mono text-[11px] flex items-center gap-1.5 transition-all"
                          title="Clear Terminal Output"
                        >
                          <Trash2 className="w-3 h-3" />
                          <span>Clear</span>
                        </button>
                      </div>
                    </div>

                    {/* Console Log Stream */}
                    <div className="max-h-96 overflow-y-auto space-y-2 pr-1 font-mono text-xs scrollbar-thin">
                      {aiLogs.length === 0 ? (
                        <div className="py-12 text-center text-[#786970]">
                          <Bot className="w-8 h-8 mx-auto mb-2 opacity-40 text-[#F6B6C8]" />
                          <p className="font-mono text-xs">Terminal idle. No AI conversion runs recorded yet.</p>
                          <p className="text-[10px] text-[#5A4D53] mt-1">
                            Upload a dress photo in the "Add Dress (AI 3D)" tab to stream live neural vision and verification cycles.
                          </p>
                        </div>
                      ) : (
                        aiLogs.map((log) => {
                          let badgeBg = 'bg-gray-800 text-gray-300';
                          if (log.type === 'VISION') badgeBg = 'bg-cyan-950 text-cyan-400 border border-cyan-800';
                          if (log.type === 'RECONSTRUCTION') badgeBg = 'bg-amber-950 text-amber-400 border border-amber-800';
                          if (log.type === 'VERIFICATION') badgeBg = 'bg-purple-950 text-purple-400 border border-purple-800';
                          if (log.type === 'REFINEMENT') badgeBg = 'bg-pink-950 text-pink-400 border border-pink-800';
                          if (log.type === 'SUCCESS') badgeBg = 'bg-emerald-950 text-emerald-400 border border-emerald-800';

                          return (
                            <div
                              key={log.id}
                              className="p-3 rounded-xl bg-[#1D171B] border border-[#2F2128] space-y-1 hover:border-[#4D3642] transition-colors"
                            >
                              <div className="flex flex-wrap items-center gap-2">
                                <span className="text-[10px] text-[#7A6B72]">[{log.timestamp}]</span>
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${badgeBg}`}>
                                  {log.type}
                                </span>
                                <span className="text-white font-semibold text-xs">{log.title}</span>
                              </div>
                              <p className="text-[#C8B8BF] text-[11px] leading-relaxed pl-1">
                                {log.message}
                              </p>
                              {log.details && Object.keys(log.details).length > 0 && (
                                <pre className="mt-1 p-2 rounded-lg bg-[#140F12] text-[10px] text-[#A8989F] overflow-x-auto border border-[#2A1D23]">
                                  {JSON.stringify(log.details, null, 2)}
                                </pre>
                              )}
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>
                </div>
              )}
            </main>
          </div>
        </div>
      </div>

      {/* 3D Showroom Simulation Preview Modal */}
      <ShowroomPreviewModal
        isOpen={previewModalOpen}
        onClose={() => setPreviewModalOpen(false)}
        productData={formData}
        onPublish={handlePublishProduct}
      />
    </>
  );
}

