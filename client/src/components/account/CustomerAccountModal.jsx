import React, { useState, useEffect } from 'react';
import { X, Package, Clock, CheckCircle2, Truck, Sparkles, User } from 'lucide-react';
import { api } from '../../services/api';

const STATUS_STEPS = [
  'Pending',
  'Confirmed',
  'Processing',
  'Packed',
  'Shipped',
  'Out for Delivery',
  'Delivered'
];

export default function CustomerAccountModal({ isOpen, onClose }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      loadOrders();
    }
  }, [isOpen]);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const res = await api.getOrders();
      if (res.success) {
        setOrders(res.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-md animate-fadeIn">
      <div className="glass-panel bg-white/95 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-[#F6B6C8] relative max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#F2D7E0] shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#FCE4EC] flex items-center justify-center text-[#C85C7A]">
              <User className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] tracking-widest text-[#C85C7A] font-semibold uppercase">
                Customer Atelier Portal
              </span>
              <h3 className="font-serif text-2xl font-bold text-[#3A3033]">
                My Orders & Wardrobe
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-[#FCE4EC] text-[#8D7F84] hover:text-[#3A3033] transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto py-5 space-y-4">
          {loading ? (
            <div className="text-center py-12 text-[#8D7F84] text-xs">
              <Sparkles className="w-6 h-6 text-[#C85C7A] animate-spin mx-auto mb-2" />
              Loading your couture orders...
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-12 text-[#8D7F84]">
              <Package className="w-10 h-10 mx-auto text-[#C85C7A] mb-2 opacity-60" />
              <p className="font-serif text-lg font-bold text-[#3A3033]">No orders placed yet</p>
              <p className="text-xs mt-1">Explore our 3D showroom to order your first piece.</p>
            </div>
          ) : (
            orders.map((order) => {
              const currentStepIdx = STATUS_STEPS.indexOf(order.orderStatus);
              return (
                <div
                  key={order.orderId}
                  className="bg-[#FFF9FB] p-5 rounded-3xl border border-[#F2D7E0] shadow-sm space-y-4"
                >
                  <div className="flex flex-wrap justify-between items-start gap-2">
                    <div>
                      <span className="text-[10px] font-mono font-bold text-[#C85C7A] bg-[#FFF0F5] px-2 py-0.5 rounded-full border border-[#F6B6C8]/60">
                        {order.orderId}
                      </span>
                      <h4 className="font-serif text-base font-bold text-[#3A3033] mt-1">
                        {order.items?.map(i => i.name).join(', ') || 'LOKI Atelier Garment'}
                      </h4>
                      <p className="text-xs text-[#8D7F84]">
                        Placed on {new Date(order.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </p>
                    </div>

                    <div className="text-right">
                      <span className="font-bold text-base text-[#C85C7A]">
                        ₹{order.total.toLocaleString()}
                      </span>
                      <span className="block text-[11px] font-semibold text-emerald-700">
                        ● {order.orderStatus}
                      </span>
                    </div>
                  </div>

                  {/* Tracking Stepper */}
                  <div className="pt-2">
                    <span className="text-[10px] tracking-wider uppercase font-semibold text-[#8D7F84] block mb-2">
                      Live Delivery Progress
                    </span>
                    <div className="flex items-center justify-between text-[10px] relative">
                      <div className="absolute top-2.5 left-2 right-2 h-0.5 bg-[#F2D7E0] -z-0" />
                      {['Confirmed', 'Processing', 'Shipped', 'Delivered'].map((st) => {
                        const isDone = STATUS_STEPS.indexOf(order.orderStatus) >= STATUS_STEPS.indexOf(st);
                        const isCurrent = order.orderStatus === st;
                        return (
                          <div key={st} className="flex flex-col items-center z-10">
                            <div
                              className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-[9px] transition-all ${
                                isCurrent
                                  ? 'bg-[#C85C7A] text-white ring-4 ring-[#FCE4EC]'
                                  : isDone
                                  ? 'bg-[#F6B6C8] text-white'
                                  : 'bg-white border border-[#F2D7E0] text-[#8D7F84]'
                              }`}
                            >
                              {isDone ? '✓' : ''}
                            </div>
                            <span className={`mt-1 font-medium ${isDone ? 'text-[#3A3033]' : 'text-[#8D7F84]'}`}>
                              {st}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Delivery Info */}
                  <div className="bg-[#FFF0F5] p-3 rounded-2xl flex justify-between items-center text-xs">
                    <span className="text-[#8D7F84] flex items-center gap-1.5">
                      <Truck className="w-3.5 h-3.5 text-[#C85C7A]" /> Delivery: {order.deliveryMethod}
                    </span>
                    <span className="font-semibold text-[#3A3033]">
                      Est: {order.estimatedDelivery}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

