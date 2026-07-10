import express from 'express';
import cors from 'cors';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

// Load environment variables
dotenv.config();

import { 
  initDb, 
  getProducts, 
  addProduct, 
  deleteProduct, 
  getReviews, 
  addReview, 
  getUsers, 
  addUser, 
  getConsultations, 
  addConsultation 
} from './db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS and JSON body parsers
const allowedOrigins = [process.env.FRONTEND_URL].filter(Boolean);
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || !process.env.FRONTEND_URL || allowedOrigins.includes(origin) || origin.startsWith('http://localhost') || origin.startsWith('http://127.0.0.1')) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
app.use(express.json());

// Programmatically verify & create DB directories and static uploads folders
const UPLOADS_DIR = path.join(__dirname, 'uploads');
const DATA_DIR = path.join(__dirname, 'data');
const PRODUCTS_FILE = path.join(DATA_DIR, 'products.json');
const REVIEWS_FILE = path.join(DATA_DIR, 'reviews.json');
const USERS_FILE = path.join(DATA_DIR, 'users.json');
const CONSULTATIONS_FILE = path.join(DATA_DIR, 'consultations.json');

if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Serve uploads folder statically
app.use('/uploads', express.express ? express.express.static(UPLOADS_DIR) : express.static(UPLOADS_DIR));

// Initial seeded products
const INITIAL_PRODUCTS = [
  {
    id: 'k1',
    name: 'Premium Teak Modular Kitchen',
    category: 'Modular Kitchen',
    price: 345000,
    image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=600&q=80',
    description: 'A beautiful L-shaped modular kitchen made from high-grade water-resistant plywood and natural teak veneer finishing. Includes soft-close drawers and profile handles.',
    features: ['Teak veneer finish', 'Soft-close tandem drawers', 'Waterproof plywood', '10-Year warranty']
  },
  {
    id: 'k2',
    name: 'Modern Charcoal & Wood Kitchen',
    category: 'Modular Kitchen',
    price: 420000,
    image: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=600&q=80',
    description: 'Sleek dual-tone modular kitchen with matte charcoal cabinetry and warm walnut accents. Features pull-out pantries and intelligent corner solutions.',
    features: ['German hardware (Hettich)', 'Quartz countertop fitment', 'Acrylic shutters', 'LED profile lighting']
  },
  {
    id: 'b1',
    name: 'Spacious Sliding Wardrobe',
    category: 'bedroom cupboard',
    price: 85000,
    image: 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=600&q=80',
    description: 'Modern 3-door sliding wardrobe with a full-length dressing mirror, laminate finishes, and internal drawers with secure locks.',
    features: ['Smooth sliding tracks', 'Scratch-resistant laminate', 'Integrated dressing mirror', 'LED hanger rods']
  },
  {
    id: 'b2',
    name: 'Classic Teak Bedroom Cupboard',
    category: 'bedroom cupboard',
    price: 115000,
    image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=600&q=80',
    description: 'Timeless bedroom cupboard handcrafted from seasoned teak wood. Features traditional design carvings with brass hardware handles.',
    features: ['100% Solid Teak Wood', 'Traditional brass handles', 'Rich melamine polish', 'Deep storage drawers']
  },
  {
    id: 't1',
    name: 'Sleek Floating TV Entertainment Unit',
    category: 'TV units & Cupboards',
    price: 48000,
    image: 'https://images.unsplash.com/photo-1593085512500-5d55148d6f0d?auto=format&fit=crop&w=600&q=80',
    description: 'Modern wall-mounted entertainment center with concealed cable management, open display shelves, and matte laminate push-to-open cabinets.',
    features: ['Concealed wiring outlets', 'Push-to-open cabinets', 'Sturdy wall mounts', 'Dual-tone wood & white laminate']
  },
  {
    id: 't2',
    name: 'Grand Hall TV & Showcase Console',
    category: 'TV units & Cupboards',
    price: 72000,
    image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&w=600&q=80',
    description: 'A floor-standing wooden TV unit flanking display cabinets on both sides. Perfect for large living rooms and showcasing decor.',
    features: ['Tempered glass side panels', 'Solid wooden base', 'Accent wood paneling background', 'Spacious storage drawers']
  },
  {
    id: 's1',
    name: 'Glass-Front Antique Showcase',
    category: 'showcase',
    price: 55000,
    image: 'https://images.unsplash.com/photo-1595515106969-1ce29566ff1c?auto=format&fit=crop&w=600&q=80',
    description: 'An elegant glass-front cabinet designed to display your precious chinaware, trophies, and books. Hand-polished to a semi-gloss finish.',
    features: ['Tempered glass doors', 'Adjustable wood shelves', 'Warm spotlight integration', 'Rosewood finish laminate']
  },
  {
    id: 'd1',
    name: 'Solid Teak Main Door',
    category: 'Wooden Door',
    price: 45000,
    image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=600&q=80',
    description: 'Heavy duty, premium quality front entrance door crafted from a single slab of seasoned Burma teak wood. Features a classic paneled design.',
    features: ['100% Burma Teak Wood', 'Termite resistant', 'High-weather resistance varnish', 'Thickness: 38mm']
  },
  {
    id: 'dd1',
    name: 'Geometric Laser-Cut Design Door',
    category: 'pooja cupboard',
    price: 32000,
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=80',
    description: 'Modern designer entrance door with custom laser-engraved geometric shapes and embedded brass inlay work.',
    features: ['Waterproof flush door core', 'Teak veneer veneer cladding', 'Elegant brass strip inlays', 'Modern CNC router engraving']
  },
  {
    id: 'f1',
    name: 'Royal Teak 6-Seater Dining Set',
    category: 'furniture',
    price: 125000,
    image: 'https://images.unsplash.com/photo-1577140917170-285929fb55b7?auto=format&fit=crop&w=600&q=80',
    description: 'A luxurious solid wood dining table with six upholstered matching chairs. Carefully finished to preserve natural wood grains.',
    features: ['Solid Rosewood/Teak Table', 'Cushioned dining chairs', 'Eco-friendly polyurethane coat', 'Sturdy joinery']
  },
  {
    id: 'f2',
    name: 'Handcrafted Wooden Armchair',
    category: 'furniture',
    price: 18500,
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=600&q=80',
    description: 'Ergonomically designed wooden lounge chair with curved armrests and woven cane backing. Adds a vintage touch to your living room.',
    features: ['Natural cane weaving', 'Ergonomic lumbar support', 'Light teak polish', 'Solid ash wood frame']
  },
  {
    id: 'wc1',
    name: 'Ganesha Wooden Wall Carving Panel',
    category: 'Model Wood Carving',
    price: 28000,
    image: 'https://images.unsplash.com/photo-1606744824163-985d376605aa?auto=format&fit=crop&w=600&q=80',
    description: 'Exquisite, detailed wall panel carving of Lord Ganesha, handcrafted by master artisans from single-piece Vengai wood.',
    features: ['100% Handcrafted', 'Single piece hardwood', 'Detailed floral frame border', 'Perfect for pooja room/living entry']
  }
];

const INITIAL_REVIEWS = [
  {
    id: 1,
    name: 'Ramesh Kumar',
    rating: 5,
    comment: 'Selva Harish did an amazing job with our modular kitchen! The teak veneer looks absolutely stunning, and the soft-close drawers work like a charm. Highly recommend their craftsmanship!',
    date: '2026-06-15'
  },
  {
    id: 2,
    name: 'Priya Sundar',
    rating: 5,
    comment: 'Ordered a customized sliding bedroom cupboard and a design door. The finishing is flawless, and they delivered exactly on time. Outstanding wood carving details.',
    date: '2026-06-28'
  },
  {
    id: 3,
    name: 'Vikram Adithya',
    rating: 4,
    comment: 'Excellent TV unit console. The hidden wiring panel keeps the living room looking clean. Very professional team and durable construction materials.',
    date: '2026-07-02'
  }
];

if (!fs.existsSync(PRODUCTS_FILE) || fs.readFileSync(PRODUCTS_FILE, 'utf-8').trim() === '[]' || fs.readFileSync(PRODUCTS_FILE, 'utf-8').trim() === '') {
  fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(INITIAL_PRODUCTS, null, 2), 'utf-8');
}
if (!fs.existsSync(REVIEWS_FILE)) {
  fs.writeFileSync(REVIEWS_FILE, JSON.stringify(INITIAL_REVIEWS, null, 2), 'utf-8');
}
if (!fs.existsSync(USERS_FILE)) {
  fs.writeFileSync(USERS_FILE, JSON.stringify([], null, 2), 'utf-8');
}
if (!fs.existsSync(CONSULTATIONS_FILE)) {
  fs.writeFileSync(CONSULTATIONS_FILE, JSON.stringify([], null, 2), 'utf-8');
}

// Cloudinary Configuration (Optional)
let uploadStorage = null;

const isCloudinaryConfigured = 
  process.env.CLOUDINARY_CLOUD_NAME && 
  process.env.CLOUDINARY_API_KEY && 
  process.env.CLOUDINARY_API_SECRET;

if (isCloudinaryConfigured) {
  console.log('Cloudinary Configuration: API credentials detected. Initializing Cloudinary storage...');
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  });

  uploadStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: 'selvaharish-uploads',
      allowed_formats: ['jpg', 'jpeg', 'png', 'webp', 'gif'],
      public_id: (req, file) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        return 'furniture-' + uniqueSuffix;
      }
    }
  });
} else {
  console.log('Cloudinary Configuration: No credentials found. Falling back to local disk storage.');
  uploadStorage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, UPLOADS_DIR);
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      const ext = path.extname(file.originalname);
      cb(null, 'furniture-' + uniqueSuffix + ext);
    }
  });
}

const upload = multer({ 
  storage: uploadStorage,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// --- API ROUTES ---

// 1. GET Products
app.get('/api/products', async (req, res) => {
  try {
    const products = await getProducts();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Could not fetch products database' });
  }
});

// 2. POST Product (Multipart File Upload)
app.post('/api/products', upload.single('image'), async (req, res) => {
  try {
    const { name, price, category, description, materials } = req.body;
    
    if (!name || !price || !category) {
      return res.status(400).json({ error: 'Missing name, price or category.' });
    }
    if (!req.file) {
      return res.status(400).json({ error: 'Missing product photograph.' });
    }

    // Dynamically resolve image serving URL (Cloudinary path vs Local filename)
    let imageUrl = '';
    if (req.file.path && req.file.path.startsWith('http')) {
      imageUrl = req.file.path;
    } else {
      const baseUrl = req.protocol + '://' + req.get('host');
      imageUrl = `${baseUrl}/uploads/${req.file.filename}`;
    }

    const materialsArray = materials
      ? materials.split(',').map((m) => m.trim()).filter(Boolean)
      : [];

    const newProduct = {
      id: 'custom_' + Date.now(),
      name,
      price: parseInt(price, 10),
      category,
      image: imageUrl,
      description: description || `Bespoke handcrafted item by SELVA HARISH workshops under ${category}.`,
      materials: materialsArray,
      features: ['100% Solid Timber', 'Premium Finish Polish', 'Handmade craftsmanship', '5-Year structural warranty']
    };

    await addProduct(newProduct);

    res.status(201).json(newProduct);
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ error: 'Internal server error while saving product' });
  }
});

// 3. GET Reviews
app.get('/api/reviews', async (req, res) => {
  try {
    const reviews = await getReviews();
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ error: 'Could not fetch reviews database' });
  }
});

// 4. POST Review
app.post('/api/reviews', async (req, res) => {
  try {
    const { name, rating, comment } = req.body;
    if (!name || !rating || !comment) {
      return res.status(400).json({ error: 'Missing review name, rating or comment details.' });
    }

    const newReview = {
      id: Date.now(),
      name,
      rating: parseInt(rating, 10),
      comment,
      date: new Date().toISOString().split('T')[0]
    };

    await addReview(newReview);

    res.status(201).json(newReview);
  } catch (error) {
    res.status(500).json({ error: 'Could not save review feedback' });
  }
});

// 5. DELETE Product card
app.delete('/api/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const products = await getProducts();
    const productToDelete = products.find((p) => p.id === id);

    if (!productToDelete) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Delete custom uploaded file from disk if it was saved locally (checking if URL contains "/uploads/")
    if (productToDelete.image && productToDelete.image.includes('/uploads/')) {
      const filename = productToDelete.image.split('/uploads/')[1];
      if (filename) {
        const filePath = path.join(UPLOADS_DIR, filename);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }
    }

    const success = await deleteProduct(id);
    if (!success) {
      return res.status(404).json({ error: 'Product not found or already deleted' });
    }

    res.json({ success: true, message: 'Product card deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ error: 'Failed to delete product card' });
  }
});

// 6. POST Register
app.post('/api/register', async (req, res) => {
  try {
    const { username, password, email } = req.body;
    if (!username || !password || !email) {
      return res.status(400).json({ error: 'Missing registration details.' });
    }

    const cleanUser = username.trim();
    if (cleanUser.toLowerCase() === 'admin') {
      return res.status(400).json({ error: 'Cannot register with reserved username "Admin".' });
    }

    const users = await getUsers();
    const exists = users.some(u => u.username.toLowerCase() === cleanUser.toLowerCase());

    if (exists) {
      return res.status(400).json({ error: 'Username is already taken!' });
    }

    const newUser = {
      id: Date.now(),
      username: cleanUser,
      password,
      email: email.trim()
    };

    await addUser(newUser);

    res.status(201).json({ success: true, user: { username: cleanUser, role: 'user', email: email.trim() } });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Failed to complete user registration' });
  }
});

// 7. POST Login
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Missing email or password' });
    }

    const cleanEmail = email.trim().toLowerCase();
    
    // Check static Admin login (works if entered in admin tab or customer email input)
    if (cleanEmail === 'selva' && password === 'selva@123') {
      return res.json({ success: true, user: { username: 'selva', role: 'admin' } });
    }

    // Check custom registered users matching by email
    const users = await getUsers();
    const foundUser = users.find(
      (u) => u.email.toLowerCase() === cleanEmail && u.password === password
    );

    if (foundUser) {
      return res.json({ success: true, user: { username: foundUser.username, role: 'user', email: foundUser.email } });
    }

    res.status(401).json({ error: 'Invalid email or password' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to complete login request' });
  }
});

// Helper: send background message via UltraMsg gateway
const sendWhatsappBackground = async (toPhone, messageText) => {
  // =========================================================================
  // AUTOMATED BACKGROUND WHATSAPP NOTIFICATION CONFIGURATION
  // =========================================================================
  const INSTANCE_ID = process.env.ULTRAMSG_INSTANCE_ID || ''; // Enter your UltraMsg Instance ID here
  const TOKEN = process.env.ULTRAMSG_TOKEN || '';       // Enter your UltraMsg Token here

  if (!INSTANCE_ID || !TOKEN) {
    console.log('\n--- SIMULATED BACKGROUND WHATSAPP MESSAGE SENT ---');
    console.log(`To: ${toPhone}`);
    console.log(`Message:\n${messageText}`);
    console.log('--------------------------------------------------\n');
    return { success: true, status: 'simulated' };
  }

  try {
    const url = `https://api.ultramsg.com/${INSTANCE_ID}/messages/chat`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        token: TOKEN,
        to: toPhone,
        body: messageText,
        priority: '10'
      })
    });
    const data = await response.json();
    console.log('UltraMsg API Response:', data);
    return { success: true, response: data };
  } catch (err) {
    console.error('Failed to send background WhatsApp via UltraMsg:', err);
    return { success: false, error: err.message };
  }
};

// 8. POST consultations (Book Consultation)
app.post('/api/consultations', async (req, res) => {
  try {
    const { username, phone, address, cart, total } = req.body;
    if (!username || !phone || !address || !cart || !total) {
      return res.status(400).json({ error: 'Missing booking details' });
    }

    const newBooking = {
      id: 'book_' + Date.now(),
      username,
      phone,
      address,
      cart,
      total,
      date: new Date().toISOString()
    };

    await addConsultation(newBooking);

    // Format a detailed message summarizing the booking
    const itemsText = cart
      .map((item, idx) => `• ${item.name} x ${item.quantity} [₹${item.price * item.quantity}]`)
      .join('\n');
    
    const formattedTotal = new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(total);

    const message = `*SELVA HARISH - NEW CONSULTATION BOOKING*\n\n` +
      `*Client Name*: ${username}\n` +
      `*Contact Phone*: ${phone}\n` +
      `*Delivery Address*: ${address}\n\n` +
      `*Requested Items*:\n${itemsText}\n\n` +
      `*Estimated Cost*: ${formattedTotal}\n\n` +
      `Booking logged to database. Please coordinate measurements.`;

    // Dynamic Admin WhatsApp phone number
    const ADMIN_WHATSAPP_NUMBER = process.env.ADMIN_WHATSAPP_NUMBER || '919894390408'; 

    await sendWhatsappBackground(ADMIN_WHATSAPP_NUMBER, message);

    res.status(201).json({ 
      success: true, 
      bookingId: newBooking.id,
      whatsappUrl: `https://wa.me/${ADMIN_WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`
    });
  } catch (error) {
    console.error('Booking error:', error);
    res.status(500).json({ error: 'Failed to record consultation booking' });
  }
});

// Start Server
initDb().then(() => {
  app.listen(PORT, () => {
    console.log(`Backend Server running at http://localhost:${PORT}`);
  });
}).catch((err) => {
  console.error('Failed to initialize database on startup:', err);
  app.listen(PORT, () => {
    console.log(`Backend Server running at http://localhost:${PORT} (Database failed to connect)`);
  });
});
