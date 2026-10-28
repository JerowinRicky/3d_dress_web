import React, { useState } from 'react';
import {
  X,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Truck,
  CreditCard,
  QrCode,
  Building,
  Banknote,
  ShieldCheck,
  Sparkles,
  ShoppingBag,
  Clock,
  MapPin,
  ExternalLink
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { api } from '../../services/api';

export default function CheckoutModal({
  isOpen,
  onClose,
  checkoutData,
  onOrderSuccess,
  onViewOrders
}) {
  if (!isOpen || !checkoutData) return null;

  const [step, setStep] = useState(1);
  const [customerInfo, setCustomerInfo] = useState({
    fullName: 'Sophia Laurent',
    email: 'sophia.l@couture.com',
    phone: '+91 98200 12345',
    address: 'Apt 12B, Rosewood Residences, Pali Hill',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400050'
  });
  const [deliveryMethod, setDeliveryMethod] = useState('Standard Delivery');
  const [paymentMethod, setPaymentMethod] = useState('UPI');
  const [upiId, setUpiId] = useState('sophia@okhdfcbank');
  const [cardNumber, setCardNumber] = useState('4532 •••• •••• 8821');
  const [cardExpiry, setCardExpiry] = useState('09/28');
  const [cardCvv, setCardCvv] = useState('•••');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState(null);

  const items = checkoutData.items || [];
  const subtotal = checkoutData.subtotal || items.reduce((s, i) => s + (i.price * i.quantity), 0);
  const discount = checkoutData.discount || 0;
  const deliveryFee = deliveryMethod === 'Express Delivery' ? 150 : 0;
  const total = Math.max(0, subtotal - discount + deliveryFee);

  const handleNext = () => {
    if (step < 4) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handlePlaceOrder = async () => {
    setIsSubmitting(true);
    try {
      const payload = {
        customer: customerInfo,
        items: items.map(item => ({
          productId: item.productId,
          name: item.name,
          price: item.price,
          size: item.size,
          quantity: item.quantity,
          image: item.image
        })),
        subtotal,
        discount,
        deliveryMethod,
        deliveryFee,
        total,
        paymentMethod
      };

      const res = await api.createOrder(payload);
      if (res.success) {
        setConfirmedOrder(res.data);
        setStep(5);
        // Trigger celebratory confetti
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#F6B6C8', '#C85C7A', '#FCE4EC', '#D4AF37', '#FFFFFF']
        });
        if (onOrderSuccess) onOrderSuccess(res.data);
      }
    } catch (err) {
      console.error('Order creation error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-md animate-fadeIn">
      <div className="glass-panel bg-white/95 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-[#F6B6C8] relative max-h-[92vh] flex flex-col overflow-hidden">
        {/* Header & Steps Indicator */}
        <div className="flex items-center justify-between pb-4 border-b border-[#F2D7E0] shrink-0">
          <div>
            <span className="text-[10px] tracking-widest text-[#C85C7A] font-semibold uppercase">
              LOKI Atelier Concierge
            </span>
            <h3 className="font-serif text-2xl font-bold text-[#3A3033]">
              {step === 5 ? 'Order Confirmed' : 'Haute Couture Checkout'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-[#FCE4EC] text-[#8D7F84] hover:text-[#3A3033] transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 5-Step Visual Stepper Bar */}
        {step < 5 && (
          <div className="py-4 border-b border-[#F2D7E0]/60 shrink-0">
            <div className="flex items-center justify-between text-xs">
              {[
                { s: 1, label: 'Confirmation' },
                { s: 2, label: 'Customer' },
                { s: 3, label: 'Delivery' },
                { s: 4, label: 'Payment' }
              ].map(({ s, label }) => (
                <div key={s} className="flex items-center gap-1.5">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-[11px] transition-all ${
                      step === s
                        ? 'bg-[#F6B6C8] text-white ring-2 ring-[#C85C7A]'
                        : step > s
                        ? 'bg-[#C85C7A] text-white'
                        : 'bg-[#FFF0F5] text-[#8D7F84]'
                    }`}
                  >
                    {step > s ? '✓' : s}
                  </div>
                  <span className={`hidden sm:inline font-medium ${step >= s ? 'text-[#3A3033]' : 'text-[#8D7F84]'}`}>
                    {label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STEP CONTENT BODY */}
        <div className="flex-1 overflow-y-auto py-5 space-y-4">
          {/* ================= STEP 1: PRODUCT CONFIRMATION ================= */}
          {step === 1 && (
            <div className="space-y-4">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-[#3A3033]">
                Step 1 · Selected Showroom Pieces
              </h4>
              <div className="space-y-3">
                {items.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex gap-4 p-3.5 bg-[#FFF9FB] rounded-2xl border border-[#F2D7E0] items-center"
                  >
                    <div className="w-16 h-20 rounded-xl bg-white overflow-hidden flex items-center justify-center border border-[#F2D7E0] p-1">
                      <img src={item.image} alt={item.name} className="w-full h-full object-contain" />
                    </div>
                    <div className="flex-1">
                      <h5 className="font-serif text-base font-bold text-[#3A3033]">{item.name}</h5>
                      <div className="flex items-center gap-2 text-xs text-[#8D7F84] mt-1">
                        <span>Size: <strong className="text-[#C85C7A]">{item.size}</strong></span>
                        <span>·</span>
                        <span>Qty: <strong>{item.quantity}</strong></span>
                      </div>
                      <p className="font-bold text-sm text-[#C85C7A] mt-1.5">
                        ₹{(item.price * item.quantity).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Summary table */}
              <div className="bg-[#FFF0F5] p-4 rounded-2xl space-y-2 text-xs text-[#3A3033]">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-medium">₹{subtotal.toLocaleString()}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-[#C85C7A] font-semibold">
                    <span>Discount</span>
                    <span>-₹{discount.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-sm pt-2 border-t border-[#F2D7E0]">
                  <span>Total Amount</span>
                  <span className="text-[#C85C7A]">₹{total.toLocaleString()}</span>
                </div>
              </div>
            </div>
          )}

          {/* ================= STEP 2: CUSTOMER INFORMATION ================= */}
          {step === 2 && (
            <div className="space-y-4">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-[#3A3033]">
                Step 2 · Customer Information & Delivery Address
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block text-[#8D7F84] mb-1 font-medium">Full Name</label>
                  <input
                    type="text"
                    value={customerInfo.fullName}
                    onChange={(e) => setCustomerInfo({ ...customerInfo, fullName: e.target.value })}
                    className="w-full p-2.5 bg-white border border-[#F2D7E0] rounded-xl focus:ring-1 focus:ring-[#C85C7A] outline-none"
                    placeholder="Enter your name"
                  />
                </div>
                <div>
                  <label className="block text-[#8D7F84] mb-1 font-medium">Email Address</label>
                  <input
                    type="email"
                    value={customerInfo.email}
                    onChange={(e) => setCustomerInfo({ ...customerInfo, email: e.target.value })}
                    className="w-full p-2.5 bg-white border border-[#F2D7E0] rounded-xl focus:ring-1 focus:ring-[#C85C7A] outline-none"
                    placeholder="name@fashion.com"
                  />
                </div>
                <div>
                  <label className="block text-[#8D7F84] mb-1 font-medium">Phone Number</label>
                  <input
                    type="tel"
                    value={customerInfo.phone}
                    onChange={(e) => setCustomerInfo({ ...customerInfo, phone: e.target.value })}
                    className="w-full p-2.5 bg-white border border-[#F2D7E0] rounded-xl focus:ring-1 focus:ring-[#C85C7A] outline-none"
                    placeholder="+91 98765 43210"
                  />
                </div>
                <div>
                  <label className="block text-[#8D7F84] mb-1 font-medium">Pincode</label>
                  <input
                    type="text"
                    value={customerInfo.pincode}
                    onChange={(e) => setCustomerInfo({ ...customerInfo, pincode: e.target.value })}
                    className="w-full p-2.5 bg-white border border-[#F2D7E0] rounded-xl focus:ring-1 focus:ring-[#C85C7A] outline-none"
                    placeholder="400050"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-[#8D7F84] mb-1 font-medium">Street Address / Penthouse</label>
                  <input
                    type="text"
                    value={customerInfo.address}
                    onChange={(e) => setCustomerInfo({ ...customerInfo, address: e.target.value })}
                    className="w-full p-2.5 bg-white border border-[#F2D7E0] rounded-xl focus:ring-1 focus:ring-[#C85C7A] outline-none"
                    placeholder="Suite, apartment, landmark"
                  />
                </div>
                <div>
                  <label className="block text-[#8D7F84] mb-1 font-medium">City</label>
                  <input
                    type="text"
                    value={customerInfo.city}
                    onChange={(e) => setCustomerInfo({ ...customerInfo, city: e.target.value })}
                    className="w-full p-2.5 bg-white border border-[#F2D7E0] rounded-xl focus:ring-1 focus:ring-[#C85C7A] outline-none"
                    placeholder="Mumbai"
                  />
                </div>
                <div>
                  <label className="block text-[#8D7F84] mb-1 font-medium">State</label>
                  <input
                    type="text"
                    value={customerInfo.state}
                    onChange={(e) => setCustomerInfo({ ...customerInfo, state: e.target.value })}
                    className="w-full p-2.5 bg-white border border-[#F2D7E0] rounded-xl focus:ring-1 focus:ring-[#C85C7A] outline-none"
                    placeholder="Maharashtra"
                  />
                </div>
              </div>
            </div>
          )}

          {/* ================= STEP 3: DELIVERY METHOD ================= */}
          {step === 3 && (
            <div className="space-y-4">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-[#3A3033]">
                Step 3 · Delivery Method
              </h4>

              <div className="space-y-3">
                <label
                  onClick={() => setDeliveryMethod('Standard Delivery')}
                  className={`flex items-start gap-3.5 p-4 rounded-2xl border cursor-pointer transition-all ${
                    deliveryMethod === 'Standard Delivery'
                      ? 'bg-[#FFF0F5] border-[#C85C7A] ring-1 ring-[#C85C7A]'
                      : 'bg-white border-[#F2D7E0] hover:bg-[#FFF9FB]'
                  }`}
                >
                  <input
                    type="radio"
                    name="delivery"
                    checked={deliveryMethod === 'Standard Delivery'}
                    onChange={() => setDeliveryMethod('Standard Delivery')}
                    className="mt-1 accent-[#C85C7A]"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-[#3A3033]">Standard Boutique Delivery</span>
                      <span className="font-bold text-xs text-emerald-700">COMPLIMENTARY</span>
                    </div>
                    <p className="text-xs text-[#8D7F84] mt-0.5">
                      Delivery in 3-5 business days in custom LOKI luxury garment packaging.
                    </p>
                  </div>
                </label>

                <label
                  onClick={() => setDeliveryMethod('Express Delivery')}
                  className={`flex items-start gap-3.5 p-4 rounded-2xl border cursor-pointer transition-all ${
                    deliveryMethod === 'Express Delivery'
                      ? 'bg-[#FFF0F5] border-[#C85C7A] ring-1 ring-[#C85C7A]'
                      : 'bg-white border-[#F2D7E0] hover:bg-[#FFF9FB]'
                  }`}
                >
                  <input
                    type="radio"
                    name="delivery"
                    checked={deliveryMethod === 'Express Delivery'}
                    onChange={() => setDeliveryMethod('Express Delivery')}
                    className="mt-1 accent-[#C85C7A]"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-[#3A3033] flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-[#C85C7A]" /> Express VIP Courier
                      </span>
                      <span className="font-bold text-xs text-[#C85C7A]">₹150</span>
                    </div>
                    <p className="text-xs text-[#8D7F84] mt-0.5">
                      Guaranteed delivery in 24-48 hours with priority atelier steaming and velvet hanger.
                    </p>
                  </div>
                </label>
              </div>

              {/* Delivery Address Preview */}
              <div className="p-3.5 rounded-2xl bg-[#FFF9FB] border border-[#F2D7E0] flex items-start gap-2.5 text-xs">
                <MapPin className="w-4 h-4 text-[#C85C7A] shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-[#3A3033]">Delivering to: </span>
                  <span className="text-[#6F6065]">
                    {customerInfo.fullName}, {customerInfo.address}, {customerInfo.city}, {customerInfo.pincode}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* ================= STEP 4: PAYMENT ================= */}
          {step === 4 && (
            <div className="space-y-4">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-[#3A3033]">
                Step 4 · Payment Method
              </h4>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: 'UPI', label: 'UPI / QR', icon: QrCode },
                  { id: 'Credit/Debit Card', label: 'Cards', icon: CreditCard },
                  { id: 'Net Banking', label: 'Net Banking', icon: Building },
                  { id: 'Cash on Delivery', label: 'Cash on Delivery', icon: Banknote }
                ].map(({ id, label, icon: Icon }) => (
                  <button
                    key={id}
                    onClick={() => setPaymentMethod(id)}
                    className={`flex flex-col items-center justify-center p-3 rounded-2xl border text-xs font-semibold transition-all ${
                      paymentMethod === id
                        ? 'bg-[#FFF0F5] border-[#C85C7A] text-[#C85C7A] shadow-sm ring-1 ring-[#C85C7A]'
                        : 'bg-white border-[#F2D7E0] text-[#3A3033] hover:bg-[#FFF9FB]'
                    }`}
                  >
                    <Icon className="w-5 h-5 mb-1 text-[#C85C7A]" />
                    <span>{label}</span>
                  </button>
                ))}
              </div>

              {/* Payment Specific Form */}
              {paymentMethod === 'UPI' && (
                <div className="bg-[#FFF9FB] p-4 rounded-2xl border border-[#F2D7E0] space-y-3 text-xs">
                  <div className="flex items-center gap-3">
                    <div className="w-20 h-20 bg-white p-1 rounded-xl border border-[#F2D7E0] flex items-center justify-center">
                      <QrCode className="w-16 h-16 text-[#3A3033]" />
                    </div>
                    <div>
                      <p className="font-semibold text-[#3A3033]">Scan QR code with any UPI App</p>
                      <p className="text-[#8D7F84] text-[11px] mt-0.5">Google Pay, PhonePe, Paytm, BHIM</p>
                    </div>
                  </div>
                  <div>
                    <label className="block text-[#8D7F84] mb-1 font-medium">Or enter UPI ID</label>
                    <input
                      type="text"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      className="w-full p-2.5 bg-white border border-[#F2D7E0] rounded-xl outline-none"
                    />
                  </div>
                </div>
              )}

              {paymentMethod === 'Credit/Debit Card' && (
                <div className="bg-[#FFF9FB] p-4 rounded-2xl border border-[#F2D7E0] space-y-3 text-xs">
                  <div>
                    <label className="block text-[#8D7F84] mb-1 font-medium">Card Number</label>
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      className="w-full p-2.5 bg-white border border-[#F2D7E0] rounded-xl outline-none"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[#8D7F84] mb-1 font-medium">Expiry</label>
                      <input
                        type="text"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        className="w-full p-2.5 bg-white border border-[#F2D7E0] rounded-xl outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[#8D7F84] mb-1 font-medium">CVV</label>
                      <input
                        type="password"
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value)}
                        className="w-full p-2.5 bg-white border border-[#F2D7E0] rounded-xl outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              {paymentMethod === 'Net Banking' && (
                <div className="bg-[#FFF9FB] p-4 rounded-2xl border border-[#F2D7E0] text-xs">
                  <p className="font-medium text-[#3A3033] mb-2">Select Preferred Bank:</p>
                  <div className="grid grid-cols-2 gap-2">
                    {['HDFC Bank', 'ICICI Bank', 'State Bank of India', 'Axis Bank'].map((b) => (
                      <button
                        key={b}
                        className="p-2 rounded-xl bg-white border border-[#F2D7E0] hover:border-[#C85C7A] text-left"
                      >
                        {b}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {paymentMethod === 'Cash on Delivery' && (
                <div className="bg-[#FFF9FB] p-4 rounded-2xl border border-[#F2D7E0] text-xs space-y-1">
                  <p className="font-semibold text-[#3A3033]">Cash on Boutique Delivery</p>
                  <p className="text-[#8D7F84]">Pay securely in cash or via UPI when the courier delivers your dress.</p>
                </div>
              )}

              {/* Total Payable */}
              <div className="p-3.5 rounded-2xl bg-[#FFF0F5] border border-[#F2D7E0] flex justify-between items-center text-sm font-bold">
                <span className="text-[#3A3033]">Total Payable</span>
                <span className="text-[#C85C7A] text-lg">₹{total.toLocaleString()}</span>
              </div>
            </div>
          )}

          {/* ================= STEP 5: ORDER CONFIRMATION ================= */}
          {step === 5 && confirmedOrder && (
            <div className="space-y-5 text-center py-2 animate-fadeIn">
              <div className="w-16 h-16 rounded-full bg-[#FCE4EC] flex items-center justify-center mx-auto text-[#C85C7A] shadow-soft-glow">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div>
                <span className="text-xs uppercase tracking-widest text-[#C85C7A] font-bold">
                  Order Successfully Placed
                </span>
                <h4 className="font-serif text-3xl font-bold text-[#3A3033] mt-1">
                  Thank You, {customerInfo.fullName.split(' ')[0]}!
                </h4>
                <p className="text-xs text-[#8D7F84] mt-1">
                  Order ID: <strong className="font-mono text-[#3A3033]">{confirmedOrder.orderId}</strong>
                </p>
              </div>

              {/* Confirmation Details Card */}
              <div className="bg-[#FFF9FB] p-5 rounded-3xl border border-[#F2D7E0] text-left space-y-3 text-xs">
                <div className="flex justify-between items-center pb-2 border-b border-[#F2D7E0]/60">
                  <span className="text-[#8D7F84]">Estimated Delivery:</span>
                  <span className="font-bold text-[#C85C7A] flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" /> {confirmedOrder.estimatedDelivery}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#8D7F84]">Items Ordered:</span>
                  <span className="font-medium text-[#3A3033]">
                    {confirmedOrder.items?.map(i => `${i.name} (${i.size})`).join(', ')}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#8D7F84]">Total Paid:</span>
                  <span className="font-bold text-sm text-[#C85C7A]">₹{confirmedOrder.total.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#8D7F84]">Delivery Address:</span>
                  <span className="text-[#3A3033] text-right truncate max-w-[220px]">
                    {confirmedOrder.customer?.address}, {confirmedOrder.customer?.city}
                  </span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-[#F2D7E0]/60">
                  <span className="text-[#8D7F84]">Payment Method:</span>
                  <span className="font-semibold text-emerald-700">{confirmedOrder.paymentMethod} (Verified)</span>
                </div>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={onClose}
                  className="btn-loki py-3 px-6 rounded-2xl text-xs font-bold uppercase tracking-wider"
                >
                  Return to 3D Showroom
                </button>
                <button
                  onClick={() => {
                    onClose();
                    if (onViewOrders) onViewOrders();
                  }}
                  className="py-3 px-6 rounded-2xl bg-white hover:bg-[#FCE4EC] text-[#3A3033] border border-[#F2D7E0] text-xs font-semibold"
                >
                  View in My Orders
                </button>
              </div>
            </div>
          )}
        </div>

        {/* FOOTER NAVIGATION BUTTONS (Steps 1-4) */}
        {step < 5 && (
          <div className="pt-4 border-t border-[#F2D7E0] flex justify-between items-center shrink-0">
            {step > 1 ? (
              <button
                onClick={handleBack}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-white hover:bg-[#FCE4EC] text-[#3A3033] text-xs font-semibold border border-[#F2D7E0] transition-all"
              >
                <ArrowLeft className="w-4 h-4 text-[#C85C7A]" />
                <span>Back</span>
              </button>
            ) : (
              <div />
            )}

            {step < 4 ? (
              <button
                onClick={handleNext}
                className="btn-loki flex items-center gap-2 px-6 py-2.5 rounded-2xl text-xs font-bold uppercase tracking-wider"
              >
                <span>Continue</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handlePlaceOrder}
                disabled={isSubmitting}
                className="btn-loki flex items-center gap-2 px-8 py-3 rounded-2xl text-xs font-bold uppercase tracking-wider shadow-lg"
              >
                {isSubmitting ? (
                  <span>Securing Order...</span>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Complete Order · ₹{total.toLocaleString()}</span>
                  </>
                )}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

