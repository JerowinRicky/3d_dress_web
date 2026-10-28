import React from 'react';
import { X, Ruler, Sparkles } from 'lucide-react';

export default function SizeGuideModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fadeIn">
      <div className="glass-panel bg-white/95 rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-[#F6B6C8] relative">
        <button
          onClick={onClose}
          className="absolute right-5 top-5 p-2 rounded-full hover:bg-[#FCE4EC] text-[#8D7F84] hover:text-[#3A3033] transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-2">
          <Ruler className="w-5 h-5 text-[#C85C7A]" />
          <span className="text-xs font-semibold tracking-widest text-[#C85C7A] uppercase">
            LOKI Atelier Standards
          </span>
        </div>

        <h3 className="font-serif text-2xl font-bold text-[#3A3033] mb-4">
          Couture Size & Measurement Guide
        </h3>

        <p className="text-xs text-[#8D7F84] mb-4 leading-relaxed">
          Every LOKI garment is tailored according to European and Parisian haute-couture sizing standards with premium stretch and contour lining.
        </p>

        <div className="overflow-x-auto rounded-2xl border border-[#F2D7E0] mb-4">
          <table className="w-full text-xs text-left">
            <thead className="bg-[#FFF0F5] text-[#3A3033] font-semibold border-b border-[#F2D7E0]">
              <tr>
                <th className="py-2.5 px-3">Size</th>
                <th className="py-2.5 px-3">Bust (in)</th>
                <th className="py-2.5 px-3">Waist (in)</th>
                <th className="py-2.5 px-3">Hips (in)</th>
                <th className="py-2.5 px-3">Length</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F2D7E0]/50 text-[#3A3033]">
              <tr className="hover:bg-[#FFF9FB]">
                <td className="py-2 px-3 font-bold text-[#C85C7A]">XS (0-2)</td>
                <td className="py-2 px-3">32 - 33</td>
                <td className="py-2 px-3">24 - 25</td>
                <td className="py-2 px-3">34 - 35</td>
                <td className="py-2 px-3">58"</td>
              </tr>
              <tr className="hover:bg-[#FFF9FB]">
                <td className="py-2 px-3 font-bold text-[#C85C7A]">S (4-6)</td>
                <td className="py-2 px-3">34 - 35</td>
                <td className="py-2 px-3">26 - 27</td>
                <td className="py-2 px-3">36 - 37</td>
                <td className="py-2 px-3">59"</td>
              </tr>
              <tr className="hover:bg-[#FFF9FB]">
                <td className="py-2 px-3 font-bold text-[#C85C7A]">M (8-10)</td>
                <td className="py-2 px-3">36 - 37</td>
                <td className="py-2 px-3">28 - 29</td>
                <td className="py-2 px-3">38 - 39</td>
                <td className="py-2 px-3">60"</td>
              </tr>
              <tr className="hover:bg-[#FFF9FB]">
                <td className="py-2 px-3 font-bold text-[#C85C7A]">L (12-14)</td>
                <td className="py-2 px-3">38 - 40</td>
                <td className="py-2 px-3">30 - 32</td>
                <td className="py-2 px-3">40 - 42</td>
                <td className="py-2 px-3">60"</td>
              </tr>
              <tr className="hover:bg-[#FFF9FB]">
                <td className="py-2 px-3 font-bold text-[#C85C7A]">XL (16)</td>
                <td className="py-2 px-3">41 - 43</td>
                <td className="py-2 px-3">33 - 35</td>
                <td className="py-2 px-3">43 - 45</td>
                <td className="py-2 px-3">61"</td>
              </tr>
              <tr className="hover:bg-[#FFF9FB]">
                <td className="py-2 px-3 font-bold text-[#C85C7A]">XXL (18)</td>
                <td className="py-2 px-3">44 - 46</td>
                <td className="py-2 px-3">36 - 38</td>
                <td className="py-2 px-3">46 - 48</td>
                <td className="py-2 px-3">61"</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="bg-[#FFF0F5] p-3 rounded-2xl flex items-start gap-2.5 text-xs text-[#3A3033]">
          <Sparkles className="w-4 h-4 text-[#C85C7A] shrink-0 mt-0.5" />
          <span>
            <strong>Atelier Custom Fit Guarantee:</strong> Need bespoke tailoring? Our concierge offers complimentary alteration consultations after placing your order.
          </span>
        </div>
      </div>
    </div>
  );
}

