import React, { useState, useEffect, useRef } from 'react';
import ShowroomScene from './components/showroom/ShowroomScene';
import ShowroomControls from './components/showroom/ShowroomControls';
import FloatingHeader from './components/navigation/FloatingHeader';
import CategoryFilterBar from './components/navigation/CategoryFilterBar';
import SearchBarModal from './components/navigation/SearchBarModal';
import ProductInspectionModal from './components/product/ProductInspectionModal';
import CartDrawer from './components/cart/CartDrawer';
import CheckoutModal from './components/checkout/CheckoutModal';
import CustomerAccountModal from './components/account/CustomerAccountModal';
import AdminPortal from './components/admin/AdminPortal';
import { api } from './services/api';

// Safe Error Boundary to prevent any canvas crashes or black screen
class ShowroomErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(err) {
    console.warn('Showroom Canvas caught error:', err);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="w-full h-full flex flex-col items-center justify-center bg-[#FFF5F8] text-[#3A3033] p-6 text-center">
          <div className="w-16 h-16 rounded-full bg-[#FCE4EC] flex items-center justify-center text-[#C85C7A] mb-3 shadow-md">
            🌸
          </div>
          <h3 className="font-serif text-2xl font-bold mb-1">LOKI Haute Couture Boutique</h3>
          <p className="text-xs text-[#8D7F84] mb-4 max-w-sm">
            Entering the virtual salon. If 3D rendering pauses, click below to restore full graphics.
          </p>
          <button
            onClick={() => this.setState({ hasError: false })}
            className="btn-loki px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider"
          >
            Enter 3D Salon
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function App() {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [showCategoryBar, setShowCategoryBar] = useState(true);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [checkoutData, setCheckoutData] = useState(null);

  // Cart State (stored in localStorage)
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem('loki_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Camera navigation coordinates (Z-axis depth along aisle, Y rotation angle)
  const cameraZRef = useRef(8.5);
  const targetCameraZ = useRef(8.5);
  const lookAngleRef = useRef(0);
  const targetLookAngle = useRef(0);
  const [activeSection, setActiveSection] = useState('A');
  const [renderTrigger, setRenderTrigger] = useState(0);

  // Save cart to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('loki_cart', JSON.stringify(cartItems));
    } catch (e) {
      console.error(e);
    }
  }, [cartItems]);

  // Load products from backend API
  const loadProducts = async () => {
    try {
      const res = await api.getProducts();
      if (res.success && res.data) {
        setProducts(res.data);
      }
    } catch (e) {
      console.error('Error loading products from server:', e);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  // Update active section based on camera Z depth
  useEffect(() => {
    const checkDepth = () => {
      const z = targetCameraZ.current;
      if (z > 0) setActiveSection('A');
      else if (z > -10) setActiveSection('B');
      else setActiveSection('C');
      setRenderTrigger((r) => r + 1);
    };
    const interval = setInterval(checkDepth, 250);
    return () => clearInterval(interval);
  }, []);

  // Walkthrough navigation actions
  const handleWalk = (delta) => {
    // min Z is 9 (entrance), max Z is -18 (alcove)
    const newZ = Math.max(-18, Math.min(9, targetCameraZ.current - delta));
    targetCameraZ.current = newZ;
    setRenderTrigger((r) => r + 1);
  };

  const handleTurn = (deltaAngle) => {
    targetLookAngle.current += deltaAngle;
    setRenderTrigger((r) => r + 1);
  };

  const handleResetView = () => {
    targetCameraZ.current = 8.5;
    targetLookAngle.current = 0;
    setRenderTrigger((r) => r + 1);
  };

  const handleJumpSection = (section, zCoord) => {
    setActiveSection(section);
    targetCameraZ.current = zCoord;
    setRenderTrigger((r) => r + 1);
  };

  // Keyboard navigation listener (WASD / Arrows)
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Don't capture when typing in inputs or when inspecting
      if (
        selectedProduct ||
        isSearchOpen ||
        isCartOpen ||
        isCheckoutOpen ||
        isAdminOpen ||
        isAccountOpen
      ) {
        return;
      }

      if (e.key === 'w' || e.key === 'W' || e.key === 'ArrowUp') {
        handleWalk(1.8);
      } else if (e.key === 's' || e.key === 'S' || e.key === 'ArrowDown') {
        handleWalk(-1.8);
      } else if (e.key === 'a' || e.key === 'A' || e.key === 'ArrowLeft') {
        handleTurn(0.12);
      } else if (e.key === 'd' || e.key === 'D' || e.key === 'ArrowRight') {
        handleTurn(-0.12);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedProduct, isSearchOpen, isCartOpen, isCheckoutOpen, isAdminOpen, isAccountOpen]);

  // Mouse wheel scroll to walk down aisle
  useEffect(() => {
    const handleWheel = (e) => {
      if (
        selectedProduct ||
        isSearchOpen ||
        isCartOpen ||
        isCheckoutOpen ||
        isAdminOpen ||
        isAccountOpen
      ) {
        return;
      }
      const delta = e.deltaY * 0.006;
      handleWalk(delta);
    };

    window.addEventListener('wheel', handleWheel, { passive: true });
    return () => window.removeEventListener('wheel', handleWheel);
  }, [selectedProduct, isSearchOpen, isCartOpen, isCheckoutOpen, isAdminOpen, isAccountOpen]);

  // Cart operations
  const handleAddToCart = (productItem) => {
    setCartItems((prev) => {
      const existing = prev.find(
        (i) => i.productId === productItem.productId && i.size === productItem.size
      );
      if (existing) {
        return prev.map((i) =>
          i.productId === productItem.productId && i.size === productItem.size
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );
      }
      return [...prev, { ...productItem, quantity: 1 }];
    });
  };

  const handleUpdateQuantity = (productId, size, qty) => {
    if (qty <= 0) {
      handleRemoveItem(productId, size);
      return;
    }
    setCartItems((prev) =>
      prev.map((i) =>
        i.productId === productId && i.size === size ? { ...i, quantity: qty } : i
      )
    );
  };

  const handleRemoveItem = (productId, size) => {
    setCartItems((prev) =>
      prev.filter((i) => !(i.productId === productId && i.size === size))
    );
  };

  // Direct "Buy Now" flow
  const handleBuyNow = (productItem) => {
    setSelectedProduct(null);
    setCheckoutData({
      items: [{ ...productItem, quantity: 1 }],
      subtotal: productItem.price,
      discount: 0,
      deliveryFee: 0,
      total: productItem.price
    });
    setIsCheckoutOpen(true);
  };

  // Cart Checkout
  const handleProceedToCheckoutFromCart = (data) => {
    setIsCartOpen(false);
    setCheckoutData(data);
    setIsCheckoutOpen(true);
  };

  const handleOrderSuccess = () => {
    setCartItems([]);
    loadProducts(); // Refresh stock
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#FFF5F8]">
      {/* 1. MINIMAL LUXURY FLOATING HEADER */}
      <FloatingHeader
        cartCount={cartItems.reduce((acc, i) => acc + i.quantity, 0)}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenAccount={() => setIsAccountOpen(true)}
        onOpenAdmin={() => setIsAdminOpen(true)}
        showCategoryBar={showCategoryBar}
        setShowCategoryBar={setShowCategoryBar}
        onResetShowroom={handleResetView}
      />

      {/* 2. CATEGORY FILTER PILLS */}
      {showCategoryBar && !selectedProduct && (
        <CategoryFilterBar
          activeCategory={activeCategory}
          onSelectCategory={setActiveCategory}
        />
      )}

      {/* 3. MAIN 3D SHOWROOM EXPERIENCE CANVAS */}
      <ShowroomErrorBoundary>
        <ShowroomScene
          products={products}
          selectedProduct={selectedProduct}
          onSelectProduct={(p) => setSelectedProduct(p)}
          activeCategory={activeCategory}
          searchQuery={searchQuery}
          targetCameraZ={targetCameraZ}
          targetLookAngle={targetLookAngle}
          isInspecting={!!selectedProduct}
        />
      </ShowroomErrorBoundary>

      {/* 4. SHOWROOM CONTROLS OVERLAY (WALK, TURN, DEPTH BAR) */}
      {!selectedProduct && (
        <ShowroomControls
          currentZ={targetCameraZ.current}
          onWalk={handleWalk}
          onTurn={handleTurn}
          onResetView={handleResetView}
          onJumpSection={handleJumpSection}
          activeSection={activeSection}
        />
      )}

      {/* 5. CINEMATIC PRODUCT INSPECTION MODAL (LEFT 360° / RIGHT INFO PANEL) */}
      <ProductInspectionModal
        product={selectedProduct}
        isOpen={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={handleAddToCart}
        onBuyNow={handleBuyNow}
      />

      {/* 6. SLIDE-OVER SHOPPING BAG DRAWER */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onProceedToCheckout={handleProceedToCheckoutFromCart}
      />

      {/* 7. 5-STEP HAUTE COUTURE CHECKOUT FLOW */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        checkoutData={checkoutData}
        onOrderSuccess={handleOrderSuccess}
        onViewOrders={() => {
          setIsCheckoutOpen(false);
          setIsAccountOpen(true);
        }}
      />

      {/* 8. CUSTOMER WARDROBE & ORDER HISTORY */}
      <CustomerAccountModal
        isOpen={isAccountOpen}
        onClose={() => setIsAccountOpen(false)}
      />

      {/* 9. SEARCH MODAL */}
      <SearchBarModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        products={products}
        onSelectProduct={(p) => setSelectedProduct(p)}
      />

      {/* 10. LOKI ADMIN PANEL SUITE */}
      <AdminPortal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        onProductPublished={loadProducts}
        onSelectProduct={(p) => {
          loadProducts();
          setSelectedProduct(p);
          if (p.showroomPosition?.section === 'B') {
            targetCameraZ.current = -5;
          } else if (p.showroomPosition?.section === 'C') {
            targetCameraZ.current = -14;
          } else {
            targetCameraZ.current = 5;
          }
        }}
      />
    </div>
  );
}

