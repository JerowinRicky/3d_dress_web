import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, Sparkles, Tag } from 'lucide-react';

export default function CartDrawer({
  isOpen,
  onClose,
  items = [],
  onUpdateQuantity,
  onRemoveItem,
  onProceedToCheckout
}) {
  const [promoCode, setPromoCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [promoError, setPromoError] = useState('');
  const [promoSuccess, setPromoSuccess] = useState('');

  if (!isOpen) return null;

  const subtotal = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const discountAmount = Math.round(subtotal * (discountPercent / 100));
  const freeShippingThreshold = 5000;
  const isFreeShipping = subtotal >= freeShippingThreshold;
  const deliveryFee = items.length === 0 ? 0 : (isFreeShipping ? 0 : 250);
  const total = Math.max(0, subtotal - discountAmount + deliveryFee);

  const applyPromo = (e) => {
    e.preventDefault();
    if (promoCode.trim().toUpperCase() === 'LOKI10') {
      setDiscountPercent(10);
      setPromoSuccess('10% Haute Couture savings applied!');
      setPromoError('');
    } else if (promoCode.trim().toUpperCase() === 'FIRSTLOKI') {
      setDiscountPercent(15);
      setPromoSuccess('15% VIP Welcome discount applied!');
      setPromoError('');
    } else {
      setPromoError('Invalid coupon code. Try "LOKI10"');
      setPromoSuccess('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-sm animate-fadeIn">
      <div className="glass-panel bg-white/95 w-full max-w-md h-full flex flex-col shadow-2xl border-l border-[#F6B6C8] animate-slideLeft">
        {/* Header */}
        <div className="p-5 border-b border-[#F2D7E0] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-[#C85C7A]" />
            <h3 className="font-serif text-xl font-bold text-[#3A3033]">
              Your Shopping Bag
            </h3>
            <span className="text-xs bg-[#FCE4EC] text-[#C85C7A] font-bold px-2 py-0.5 rounded-full">
              {items.reduce((sum, item) => sum + item.quantity, 0)}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-[#FCE4EC] text-[#8D7F84] hover:text-[#3A3033] transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free shipping meter */}
        <div className="bg-[#FFF0F5] px-5 py-2.5 text-xs border-b border-[#F2D7E0]/60">
          {isFreeShipping ? (
            <div className="flex items-center gap-1.5 text-emerald-700 font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Complimentary Boutique Shipping unlocked!</span>
            </div>
          ) : (
            <div>
              <span className="text-[#3A3033]">
                Add <strong className="text-[#C85C7A]">₹{(freeShippingThreshold - subtotal).toLocaleString()}</strong> more for Complimentary Delivery
              </span>
              <div className="w-full h-1.5 bg-[#F2D7E0] rounded-full mt-1.5 overflow-hidden">
                <div
                  className="h-full bg-[#C85C7A] transition-all duration-300"
                  style={{ width: `${Math.min(100, (subtotal / freeShippingThreshold) * 100)}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Cart Item List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-[#8D7F84]">
              <div className="w-16 h-16 rounded-full bg-[#FCE4EC] flex items-center justify-center mb-3">
                <ShoppingBag className="w-8 h-8 text-[#C85C7A]" />
              </div>
              <p className="font-serif text-lg font-semibold text-[#3A3033]">Your bag is empty</p>
              <p className="text-xs mt-1 max-w-[220px]">
                Browse our 3D Showroom aisle to pick up your dream dresses.
              </p>
              <button
                onClick={onClose}
                className="mt-5 btn-loki px-5 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider"
              >
                Explore Showroom
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={`${item.productId}-${item.size}`}
                className="flex gap-3 bg-[#FFF9FB] p-3 rounded-2xl border border-[#F2D7E0]/70 shadow-sm"
              >
                <div className="w-16 h-20 rounded-xl bg-white overflow-hidden flex items-center justify-center border border-[#F2D7E0]">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-contain p-1"
                  />
                </div>
                <div className="flex-1 flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-serif text-sm font-bold text-[#3A3033] line-clamp-1">
                        {item.name}
                      </h4>
                      <p className="text-[11px] text-[#8D7F84] mt-0.5">
                        Size: <span className="font-semibold text-[#C85C7A]">{item.size}</span>
                        {item.color ? ` · ${item.color}` : ''}
                      </p>
                    </div>
                    <button
                      onClick={() => onRemoveItem(item.productId, item.size)}
                      className="text-[#8D7F84] hover:text-[#C85C7A] transition-all p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <span className="font-bold text-sm text-[#C85C7A]">
                      ₹{(item.price * item.quantity).toLocaleString()}
                    </span>
                    <div className="flex items-center gap-2 border border-[#F2D7E0] bg-white rounded-lg px-2 py-0.5">
                      <button
                        onClick={() => onUpdateQuantity(item.productId, item.size, item.quantity - 1)}
                        className="text-[#8D7F84] hover:text-[#3A3033]"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-xs font-semibold w-4 text-center">{item.quantity}</span>
                      <button
                        onClick={() => onUpdateQuantity(item.productId, item.size, item.quantity + 1)}
                        className="text-[#8D7F84] hover:text-[#3A3033]"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer & Order Summary */}
        {items.length > 0 && (
          <div className="p-5 border-t border-[#F2D7E0] bg-[#FFF5F8]/60 space-y-3">
            {/* Promo Code Input */}
            <form onSubmit={applyPromo} className="flex gap-2">
              <div className="relative flex-1">
                <Tag className="w-3.5 h-3.5 absolute left-3 top-3 text-[#8D7F84]" />
                <input
                  type="text"
                  placeholder="Promo Code (try LOKI10)"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  className="w-full bg-white border border-[#F2D7E0] rounded-xl pl-9 pr-3 py-2 text-xs uppercase tracking-wider focus:outline-none focus:ring-1 focus:ring-[#C85C7A]"
                />
              </div>
              <button
                type="submit"
                className="px-4 py-2 bg-[#3A3033] text-white rounded-xl text-xs font-semibold hover:bg-black transition-all"
              >
                Apply
              </button>
            </form>

            {promoError && <p className="text-[11px] text-red-500">{promoError}</p>}
            {promoSuccess && <p className="text-[11px] text-emerald-600 font-semibold">{promoSuccess}</p>}

            {/* Price Calculations */}
            <div className="space-y-1.5 text-xs text-[#6F6065] pt-1">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-medium text-[#3A3033]">₹{subtotal.toLocaleString()}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-[#C85C7A] font-semibold">
                  <span>Haute Couture Discount</span>
                  <span>-₹{discountAmount.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Estimated Delivery</span>
                <span>{deliveryFee === 0 ? <strong className="text-emerald-700">FREE</strong> : `₹${deliveryFee}`}</span>
              </div>
              <div className="flex justify-between text-base font-bold text-[#3A3033] pt-2 border-t border-[#F2D7E0]">
                <span>Total Amount</span>
                <span className="text-[#C85C7A]">₹{total.toLocaleString()}</span>
              </div>
            </div>

            {/* Buttons: Checkout & Continue Shopping */}
            <div className="space-y-2 pt-2">
              <button
                onClick={() => {
                  onClose();
                  onProceedToCheckout({
                    items,
                    subtotal,
                    discount: discountAmount,
                    deliveryFee,
                    total
                  });
                }}
                className="w-full py-3.5 rounded-2xl btn-loki text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onClose}
                className="w-full py-2.5 rounded-2xl bg-white hover:bg-[#FCE4EC] text-[#3A3033] text-xs font-medium border border-[#F2D7E0] transition-all"
              >
                Continue Shopping in 3D Showroom
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

