import express from 'express';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { db } from './db.js';
import { convertDressImageWithAI } from './aiService.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Static uploads folder
const UPLOADS_DIR = path.join(__dirname, 'uploads');
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}
app.use('/uploads', express.static(UPLOADS_DIR));

// Multer Storage Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOADS_DIR);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname) || '.png';
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, `loki-${file.fieldname}-${uniqueSuffix}${ext}`);
  }
});
const upload = multer({ storage });

// Admin Auth Route
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  // Default demo admin credentials: admin@loki.com / loki2026 or any email
  if ((email === 'admin@loki.com' && password === 'loki2026') || (email && password)) {
    return res.json({
      success: true,
      token: 'loki-admin-jwt-token-authenticated',
      user: {
        id: 'adm-01',
        name: 'LOKI Atelier Administrator',
        email: email || 'admin@loki.com',
        role: 'Head of Showroom Operations'
      }
    });
  }
  return res.status(401).json({ success: false, message: 'Invalid credentials. Use admin@loki.com / loki2026' });
});

// Products REST API
app.get('/api/products', (req, res) => {
  const { category, search, status } = req.query;
  const products = db.getProducts({ category, search, status });
  res.json({ success: true, count: products.length, data: products });
});

app.get('/api/products/:id', (req, res) => {
  const product = db.getProductById(req.params.id);
  if (!product) {
    return res.status(404).json({ success: false, message: 'Product not found' });
  }
  res.json({ success: true, data: product });
});

app.post('/api/products', (req, res) => {
  try {
    const newProduct = db.createProduct(req.body);
    res.status(201).json({
      success: true,
      message: 'Product published and positioned in 3D Showroom',
      data: newProduct
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.put('/api/products/:id', (req, res) => {
  const updated = db.updateProduct(req.params.id, req.body);
  if (!updated) {
    return res.status(404).json({ success: false, message: 'Product not found' });
  }
  res.json({ success: true, message: 'Product updated', data: updated });
});

app.delete('/api/products/:id', (req, res) => {
  const deleted = db.deleteProduct(req.params.id);
  if (!deleted) {
    return res.status(404).json({ success: false, message: 'Product not found' });
  }
  res.json({ success: true, message: 'Product deleted successfully' });
});

// 4-Side Product Image Upload Endpoint
app.post('/api/upload-4views', upload.fields([
  { name: 'front', maxCount: 1 },
  { name: 'back', maxCount: 1 },
  { name: 'left', maxCount: 1 },
  { name: 'right', maxCount: 1 }
]), (req, res) => {
  try {
    const files = req.files || {};
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    
    const result = {
      front: files.front ? `${baseUrl}/uploads/${files.front[0].filename}` : null,
      back: files.back ? `${baseUrl}/uploads/${files.back[0].filename}` : null,
      left: files.left ? `${baseUrl}/uploads/${files.left[0].filename}` : null,
      right: files.right ? `${baseUrl}/uploads/${files.right[0].filename}` : null,
    };

    res.json({
      success: true,
      message: '4-side product views uploaded successfully',
      data: result
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Single Image Upload Endpoint
app.post('/api/upload', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'No file uploaded' });
  }
  const baseUrl = `${req.protocol}://${req.get('host')}`;
  res.json({
    success: true,
    url: `${baseUrl}/uploads/${req.file.filename}`,
    filename: req.file.filename
  });
});

// Categories
app.get('/api/categories', (req, res) => {
  res.json({ success: true, data: db.data.categories });
});

// Orders
app.get('/api/orders', (req, res) => {
  res.json({ success: true, data: db.getOrders() });
});

app.post('/api/orders', (req, res) => {
  try {
    const order = db.createOrder(req.body);
    res.status(201).json({
      success: true,
      message: 'Order placed successfully',
      data: order
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.put('/api/orders/:id/status', (req, res) => {
  const { status } = req.body;
  const updated = db.updateOrderStatus(req.params.id, status);
  if (!updated) {
    return res.status(404).json({ success: false, message: 'Order not found' });
  }
  res.json({ success: true, message: 'Order status updated', data: updated });
});

// Customers
app.get('/api/customers', (req, res) => {
  res.json({ success: true, data: db.getCustomers() });
});

// Inventory
app.get('/api/inventory', (req, res) => {
  res.json({ success: true, data: db.getInventory() });
});

// Showroom Config & Positions
app.get('/api/showroom', (req, res) => {
  res.json({
    success: true,
    config: db.getShowroomConfig(),
    products: db.getProducts()
  });
});

app.put('/api/showroom', (req, res) => {
  const updated = db.updateShowroomConfig(req.body);
  res.json({ success: true, message: 'Showroom configuration updated', data: updated });
});

// Analytics Dashboard
app.get('/api/analytics', (req, res) => {
  res.json({ success: true, data: db.getAnalytics() });
});

// ================= AI CONFIG & 3D CONVERSION ENGINE ROUTES =================
// Get AI Settings
app.get('/api/ai/config', (req, res) => {
  res.json({ success: true, data: db.getAiSettings() });
});

// Update AI Settings (API Key, Model, Provider, Verification Threshold)
app.put('/api/ai/config', (req, res) => {
  const updated = db.updateAiSettings(req.body);
  res.json({ success: true, message: 'AI configuration updated successfully', data: updated });
});

// Get Live AI Logs
app.get('/api/ai/logs', (req, res) => {
  res.json({ success: true, data: db.getAiLogs() });
});

// Clear AI Logs
app.delete('/api/ai/logs', (req, res) => {
  db.clearAiLogs();
  res.json({ success: true, message: 'AI execution logs cleared' });
});

// Test Gemini / AI Connection
app.post('/api/ai/test-connection', async (req, res) => {
  try {
    const { apiKey, model } = req.body;
    const keyToUse = apiKey || db.getAiSettings().apiKey;
    const modelToUse = model || db.getAiSettings().model || 'gemini-1.5-flash';

    if (!keyToUse || keyToUse.trim().length < 8) {
      return res.status(400).json({
        success: false,
        message: 'No Gemini API Key provided. Please enter a valid API Key from Google AI Studio.'
      });
    }

    const testUrl = `https://generativelanguage.googleapis.com/v1beta/models/${modelToUse}?key=${keyToUse}`;
    const response = await fetch(testUrl);
    const data = await response.json();

    if (data.name) {
      db.addAiLog({
        id: 'test-' + Date.now(),
        timestamp: new Date().toLocaleTimeString(),
        type: 'SUCCESS',
        title: 'Gemini Connection Verified',
        message: `Successfully connected to ${data.displayName || modelToUse} (Google Gemini Vision API)`,
        details: { model: modelToUse }
      });

      return res.json({
        success: true,
        message: `Connected successfully to Google Gemini (${modelToUse})`,
        modelInfo: data
      });
    } else {
      const errMsg = data.error?.message || 'API responded with error';
      db.addAiLog({
        id: 'test-' + Date.now(),
        timestamp: new Date().toLocaleTimeString(),
        type: 'VISION',
        title: 'Gemini Connection Test Failed',
        message: errMsg
      });
      return res.status(400).json({ success: false, message: errMsg });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Helper to persist base64 data URLs as physical PNG files in /uploads/
function saveBase64Image(dataUrl, prefix = 'dress') {
  if (!dataUrl || typeof dataUrl !== 'string' || !dataUrl.includes(';base64,')) {
    return dataUrl;
  }
  try {
    const parts = dataUrl.split(';base64,');
    const buffer = Buffer.from(parts[1], 'base64');
    const filename = `loki-ai-${prefix}-${Date.now()}-${Math.round(Math.random() * 1e4)}.png`;
    const filePath = path.join(UPLOADS_DIR, filename);
    fs.writeFileSync(filePath, buffer);
    return `/uploads/${filename}`;
  } catch (err) {
    console.error('Error saving base64 image:', err);
    return dataUrl;
  }
}

// AI 2D-to-3D Garment Conversion Pipeline
app.post('/api/ai/convert-dress', async (req, res) => {
  try {
    const {
      imageBase64,
      imageUrl,
      images,
      productName,
      category,
      section,
      rack,
      price,
      originalPrice,
      stockQuantity
    } = req.body;

    if (!imageBase64 && !imageUrl && !images) {
      return res.status(400).json({ success: false, message: 'Please provide a dress image (imageBase64, imageUrl, or images)' });
    }

    // Persist base64 images as disk files in /uploads/
    let processedImages = null;
    if (images && typeof images === 'object') {
      processedImages = {
        front: saveBase64Image(images.front, 'front'),
        back: saveBase64Image(images.back, 'back'),
        left: saveBase64Image(images.left, 'left'),
        right: saveBase64Image(images.right, 'right')
      };
    } else if (imageBase64) {
      const savedFront = saveBase64Image(imageBase64, 'front');
      processedImages = {
        front: savedFront,
        back: savedFront,
        left: savedFront,
        right: savedFront
      };
    }

    const result = await convertDressImageWithAI({
      imageBase64: imageBase64 || imageUrl || images?.front,
      imageUrl: processedImages?.front || imageUrl,
      images: processedImages,
      productName,
      category,
      section,
      rack,
      price,
      originalPrice,
      stockQuantity
    });

    res.json(result);
  } catch (err) {
    console.error('AI 3D conversion error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    brand: 'LOKI 3D Dress Platform',
    timestamp: new Date().toISOString()
  });
});

// Serve frontend static build if available
const CLIENT_DIST = path.join(__dirname, '..', 'client', 'dist');
if (fs.existsSync(CLIENT_DIST)) {
  app.use(express.static(CLIENT_DIST));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api') || req.path.startsWith('/uploads')) {
      return next();
    }
    res.sendFile(path.join(CLIENT_DIST, 'index.html'));
  });
}

// Error handling to prevent exit
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
});
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

// Keep stdin open to prevent premature termination on Windows background subshells
if (process.stdin.isTTY === false) {
  process.stdin.resume();
}

// Start Express Server
const server = app.listen(PORT, () => {
  console.log(`🌸 LOKI Backend Server running on http://localhost:${PORT}`);
});

server.on('error', (err) => {
  console.error('Server error:', err);
});
