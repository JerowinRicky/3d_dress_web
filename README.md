# LOKI · 3D Haute Couture Dress E-Commerce Platform

> **"Step into fashion."**  
> An immersive, luxury 3D fashion showroom web platform inspired by modern haute-couture flagship stores.

---

## 🌸 Overview

**LOKI** replaces traditional, flat 2D e-commerce grids with a physically simulated **3D virtual retail showroom**. Customers walk down a symmetrical, high-gloss runway aisle lined with luxury dresses hanging on rose-gold racks, pick up garments with cinematic animations, inspect them in interactive 360° multi-angle views, and complete a seamless 5-step checkout.

A connected **LOKI Admin Panel** allows store directors to manage orders, live inventory, customers, and upload garments with dedicated **4-view product imagery (Front, Back, Left, Right)** that automatically materialize inside the 3D showroom.

---

## 🏛️ Core Architecture & Features

### 1. Customer Storefront
- **Immersive 3D Showroom**:
  - Long symmetrical fashion aisle with high-gloss reflective floor.
  - Symmetrical rose-gold clothing racks lining both left and right sides.
  - Realistic 3D dresses hanging from designer hangers with natural fabric sway animations.
  - High white ceiling with recessed linear LED panels and runway spotlights.
  - Luminous rear feature wall with backlit **LOKI HAUTE COUTURE** branding.
  - Soft atmospheric depth fog in blush pink and warm white.
- **Showroom Navigation**:
  - Mouse drag / touch drag to rotate and look around.
  - Mouse wheel / scroll to glide forward and backward through the aisle.
  - Keyboard navigation via `W`/`S` or `Up`/`Down` arrow keys.
  - On-screen touch-friendly walk controls with Center Reset.
  - Runway Aisle Depth Minimap and quick-jump section buttons:
    - *Section A: Evening & Party Couture*
    - *Section B: Gala & Bridal Promenade*
    - *Section C: Atelier Reserve Alcove*
- **Cinematic Pick-Up Animation**:
  - Hovering a dress triggers a subtle glow and floating price tooltip.
  - Clicking a dress smoothly detaches it from the rack, sweeps it toward the camera, and transitions into inspection mode.
- **360° Multi-Angle Product Inspection (Left Side)**:
  - Interactive 360° horizontal drag-to-rotate turntable.
  - 4 dedicated thumbnail selectors: `[ FRONT ]`, `[ BACK ]`, `[ LEFT ]`, `[ RIGHT ]`.
  - Zoom in/out, view reset, and fullscreen inspection modes.
- **Product Information Panel (Right Side)**:
  - Product name, atelier pricing, original price, discount tag, 5-star rating.
  - Editorial description, fabric composition, colorway, and showroom rack position badge.
  - Interactive size selection (`XS`, `S`, `M`, `L`, `XL`, `XXL`) with a **Couture Size Guide Modal**.
  - **ADD TO CART** with micro-animations and badge counters.
  - **BUY NOW** with direct transition to the checkout flow.
- **5-Step Checkout Flow**:
  - **Step 1: Product Confirmation** – Verify selected pieces, sizes, and quantities.
  - **Step 2: Customer Information** – Name, email, phone, address, city, state, pincode.
  - **Step 3: Delivery Method** – Standard Boutique Delivery (Free) vs. Express VIP Courier (₹150).
  - **Step 4: Payment** – UPI / QR Code, Credit/Debit Cards, Net Banking, Cash on Delivery.
  - **Step 5: Order Confirmation** – Animated confetti celebration, generated Order ID (`LK-ORD-XXXXX`), estimated delivery date, and instant automated stock deduction.
- **Shopping Bag (Cart)**:
  - Slide-over drawer with item thumbnails, size indicators, quantity adjusters, free shipping progress bar, promo code support (`LOKI10` for 10% off), and checkout triggers.
- **Customer Wardrobe & Orders**:
  - Order tracking timeline: `Confirmed` ➔ `Processing` ➔ `Shipped` ➔ `Delivered`.
- **Search & Category System**:
  - Category filter pills: *All, Dresses, Evening Wear, Party Wear, Casual, Wedding, Summer, New Arrivals, Premium Collection*.
  - Live search modal highlighting and spotlighting matching dresses in the 3D showroom.
- **Lounge Ambiance**:
  - Web Audio API synthesizer for soft ambient showroom chime.

---

### 2. Connected LOKI Admin Panel
- **Secure Authentication**:
  - Pre-filled credentials: `admin@loki.com` / `loki2026`.
- **Atelier Dashboard**:
  - KPI Cards: Total Products, Total Orders, Total Customers, Total Revenue, Low Stock Alerts.
  - Interactive charts: Monthly sales velocity, category distribution, recent orders table.
- **Product Management**:
  - Search, filter by category/status, adjust stock, edit, delete, or inspect garments.
- **Dedicated 4-Side Image Upload & Garment Creator**:
  - Upload cards for:
    1. **FRONT VIEW**
    2. **BACK VIEW**
    3. **LEFT VIEW**
    4. **RIGHT VIEW**
  - Drag & drop / file picker support + **1-Click Curated Luxury Presets** for rapid testing.
  - Showroom positioning controls: Section (`A`, `B`, `C`), Rack (`Left-01`, `Right-01`, etc.), and Rail Position (0–10).
  - **3D SHOWROOM PREVIEW MODAL**: Visualizes the garment on a gold hanger before publishing.
- **Order Management**:
  - Live status transition dropdown: *Pending, Confirmed, Processing, Packed, Shipped, Out for Delivery, Delivered, Cancelled*.
- **Customer Management**:
  - Client directory with order counts, total spend, and VIP status.
- **Live Inventory Control**:
  - SKU, available stock, reserved, sold, low-stock threshold with real-time `+` / `-` stock adjusters.
- **3D Showroom Architecture Management**:
  - Runway lighting levels, floor reflection sliders, and aisle layout maps.

---

## 🎨 Color Palette & Visual Identity

- **Primary Light Pink**: `#F6B6C8`
- **Soft Blush**: `#FCE4EC`
- **Warm Champagne / Gold**: `#D4AF37`, `#F7EDE2`
- **Lavender Blush**: `#E6D5E8`, `#F3E8FF`
- **Background**: `#FFF9FB`
- **Luxury Slate Text**: `#3A3033`
- **Dark Rose Accent**: `#C85C7A`
- **Typography**: *Cormorant Garamond* (Serif Editorial) & *Montserrat* (Clean Luxury Modern).

---

## 🚀 How to Run

### 1. Production / Unified Server (Frontend + Backend on Port 5001)
```bash
# Start the unified full-stack server
node server/server.js
```
Open **[http://localhost:5001](http://localhost:5001)** in your browser.

### 2. Development Mode with Hot Module Replacement (HMR)
```bash
# In terminal 1 (Backend REST API):
cd server
npm start

# In terminal 2 (Vite Client Dev Server):
cd client
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)**. Vite automatically proxies `/api` and `/uploads` to the Express backend.

---

## 🔑 Admin Credentials
- **Email**: `admin@loki.com`
- **Password**: `loki2026`
- **Access**: Click the **Admin** button in the top navigation bar.

