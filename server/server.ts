import cors from "cors";
import express from "express";
import { createServer as createViteServer } from "vite";
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

const logFile = join(process.cwd(), 'server.log');
function log(message: string) {
  fs.appendFileSync(logFile, message + '\n');
}

process.on('uncaughtException', (err) => {
  log(`Uncaught Exception: ${err.message}\n${err.stack}`);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  log(`Unhandled Rejection: ${reason}`);
});

log('Server starting...');
import Database from 'better-sqlite3';
import multer from 'multer';
import nodemailer from 'nodemailer';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const JWT_SECRET = process.env.JWT_SECRET || 'sewa-secret-key-change-in-prod';

// Email Transporter Setup
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.ethereal.email',
  port: parseInt(process.env.SMTP_PORT || '587'),
  auth: {
    user: process.env.SMTP_USER || 'ethereal_user',
    pass: process.env.SMTP_PASS || 'ethereal_pass'
  }
});

// Helper function to send email
async function sendEmail(to: string, subject: string, html: string) {
  try {
    const info = await transporter.sendMail({
      from: process.env.SMTP_FROM || '"SEWA Goatique" <noreply@sewagoatique.com>',
      to,
      subject,
      html,
    });
    console.log("Message sent: %s", info.messageId);
  } catch (error) {
    console.error("Error sending email:", error);
  }
}

// Ensure uploads directory exists
const uploadsDir = join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// Multer Setup
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir)
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, uniqueSuffix + '-' + file.originalname)
  }
});

const upload = multer({ storage: storage });

// Database Setup
const db = new Database('sewa.db');
db.pragma('journal_mode = WAL');

// Initialize Schema
db.exec(`
  CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    price REAL NOT NULL,
    sale_price REAL,
    stock INTEGER DEFAULT 0,
    category TEXT,
    images TEXT, -- JSON array of image URLs
    ingredients TEXT,
    benefits TEXT,
    is_featured BOOLEAN DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    customer_name TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    customer_phone TEXT,
    shipping_address TEXT,
    total_amount REAL NOT NULL,
    status TEXT DEFAULT 'pending', -- pending, processing, shipped, delivered, cancelled
    payment_method TEXT,
    items TEXT, -- JSON array of order items
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    type TEXT NOT NULL, -- 'contact', 'bulk', 'newsletter'
    name TEXT,
    email TEXT NOT NULL,
    phone TEXT,
    details TEXT, -- JSON with specific fields
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS content (
    key TEXT PRIMARY KEY,
    value TEXT -- JSON content for dynamic sections
  );

  CREATE TABLE IF NOT EXISTS posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    content TEXT NOT NULL,
    excerpt TEXT,
    image TEXT,
    author TEXT,
    published BOOLEAN DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL
  );
`);

// Seed Admin User
const adminCount = db.prepare('SELECT count(*) as count FROM users WHERE username = ?').get('admin') as { count: number };
if (adminCount.count === 0) {
  const hashedPassword = bcrypt.hashSync(process.env.ADMIN_PASSWORD || 'admin123', 10);
  db.prepare('INSERT INTO users (username, password) VALUES (?, ?)').run('admin', hashedPassword);
}

// Seed initial content if empty
db.exec(`
  INSERT OR IGNORE INTO content (key, value) VALUES (
    'homepage_hero',
    '{"headline": "Pure. Ethical. Empowering.", "subheadline": "Handmade goat milk skincare crafted by rural women artisans.", "cta_text": "Shop Now"}'
  );

  INSERT OR IGNORE INTO content (key, value) VALUES (
    'site_branding',
    '{"logo": "", "favicon": "", "heroImage": ""}'
  );
`);

// Seed some products if empty
const productCount = db.prepare('SELECT count(*) as count FROM products').get() as { count: number };
if (productCount.count === 0) {
  const stmt = db.prepare('INSERT INTO products (name, slug, description, price, category, images, ingredients, benefits, is_featured, stock) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');
  
  stmt.run(
    'Goat Milk & Saffron Soap',
    'goat-milk-saffron-soap',
    'Luxurious handmade soap enriched with pure goat milk and Kashmiri saffron. Brightens skin and provides deep hydration.',
    450,
    'Soaps',
    JSON.stringify(['https://images.unsplash.com/photo-1600857062241-98e5b4f9c199?auto=format&fit=crop&q=80&w=800']),
    'Goat Milk, Saffron, Coconut Oil, Olive Oil, Lye',
    'Brightening, Moisturizing, Anti-aging',
    1,
    100
  );

  stmt.run(
    'Lavender & Chamomile Body Butter',
    'lavender-chamomile-body-butter',
    'Rich, creamy body butter that soothes sensitive skin and promotes relaxation.',
    850,
    'Body Care',
    JSON.stringify(['https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&q=80&w=800']),
    'Shea Butter, Goat Milk, Lavender Oil, Chamomile Extract',
    'Calming, Deep Hydration, Soothing',
    1,
    50
  );
  
  stmt.run(
    'Charcoal Detox Face Bar',
    'charcoal-detox-face-bar',
    'Activated charcoal draws out impurities while goat milk nourishes.',
    350,
    'Face Care',
    JSON.stringify(['https://images.unsplash.com/photo-1607006411565-b6d39785890c?auto=format&fit=crop&q=80&w=800']),
    'Activated Charcoal, Goat Milk, Tea Tree Oil',
    'Detoxifying, Acne Control, Balancing',
    0,
    75
  );
}

async function startServer() {
  const app = express();
  const PORT = process.env.PORT || 3000;

  app.use(express.json());
  app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));
  
  // Serve uploaded files
  app.use('/uploads', express.static(uploadsDir));

  // API Routes
  const apiRouter = express.Router();

  // Middleware to verify JWT
  const authenticateToken = (req: any, res: any, next: any) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.sendStatus(401);

    jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
      if (err) return res.sendStatus(403);
      req.user = user;
      next();
    });
  };

  // Admin Login
  apiRouter.post('/admin/login', (req, res) => {
    const { username, password } = req.body;
    const user = db.prepare('SELECT * FROM users WHERE username = ?').get(username || 'admin') as any;
    
    if (user && bcrypt.compareSync(password, user.password)) {
      const token = jwt.sign({ username: user.username }, JWT_SECRET, { expiresIn: '24h' });
      res.json({ success: true, token });
    } else {
      res.status(401).json({ error: 'Invalid credentials' });
    }
  });

  // File Upload API (Protected)
  apiRouter.post('/upload', authenticateToken, upload.single('image'), (req, res) => {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    const baseUrl = process.env.BASE_URL || `https://sewa-goatique-api.onrender.com`;
    const fileUrl = `${baseUrl}/uploads/${req.file.filename}`;
    res.json({ url: fileUrl });
  });

  // Products API
  apiRouter.get('/products', (req, res) => {
    const products = db.prepare('SELECT * FROM products ORDER BY created_at DESC').all();
    const parsedProducts = products.map((p: any) => ({
      ...p,
      images: JSON.parse(p.images || '[]')
    }));
    res.json(parsedProducts);
  });

  apiRouter.get('/products/:slug', (req, res) => {
    const product = db.prepare('SELECT * FROM products WHERE slug = ?').get(req.params.slug);
    if (product) {
       const parsedProduct = {
        ...product as any,
        images: JSON.parse((product as any).images || '[]')
      };
      res.json(parsedProduct);
    } else {
      res.status(404).json({ error: 'Product not found' });
    }
  });

  apiRouter.post('/products', authenticateToken, (req, res) => {
    try {
      const { name, slug, description, price, category, stock, images } = req.body;
      const stmt = db.prepare('INSERT INTO products (name, slug, description, price, category, stock, images) VALUES (?, ?, ?, ?, ?, ?, ?)');
      const info = stmt.run(name, slug, description, price, category, stock, JSON.stringify(images));
      res.json({ success: true, id: info.lastInsertRowid });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to create product' });
    }
  });

  apiRouter.delete('/products/:id', authenticateToken, (req, res) => {
    try {
      const stmt = db.prepare('DELETE FROM products WHERE id = ?');
      stmt.run(req.params.id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete product' });
    }
  });
  
  // Orders API
  apiRouter.post('/orders', async (req, res) => {
    try {
      const { customer_name, customer_email, customer_phone, shipping_address, total_amount, items, payment_method } = req.body;
      const stmt = db.prepare('INSERT INTO orders (customer_name, customer_email, customer_phone, shipping_address, total_amount, items, payment_method) VALUES (?, ?, ?, ?, ?, ?, ?)');
      const info = stmt.run(customer_name, customer_email, customer_phone, shipping_address, total_amount, JSON.stringify(items), payment_method);
      
      // Send Confirmation Email
      const emailHtml = `
        <h1>Order Confirmation</h1>
        <p>Dear ${customer_name},</p>
        <p>Thank you for your order! Your order ID is #${info.lastInsertRowid}.</p>
        <p>Total Amount: ₹${total_amount}</p>
        <p>We will notify you when your order is shipped.</p>
        <br>
        <p>Best regards,</p>
        <p>SEWA Goatique Team</p>
      `;
      sendEmail(customer_email, `Order Confirmation #${info.lastInsertRowid}`, emailHtml);

      res.json({ success: true, orderId: info.lastInsertRowid });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to create order' });
    }
  });

  apiRouter.get('/orders', (req, res) => {
    // In a real app, this would be authenticated
    const orders = db.prepare('SELECT * FROM orders ORDER BY created_at DESC').all();
    const parsedOrders = orders.map((o: any) => ({
      ...o,
      items: JSON.parse(o.items || '[]')
    }));
    res.json(parsedOrders);
  });

  apiRouter.get('/orders/:id', (req, res) => {
    const order = db.prepare('SELECT * FROM orders WHERE id = ?').get(req.params.id);
    if (order) {
      res.json({
        ...order as any,
        items: JSON.parse((order as any).items || '[]')
      });
    } else {
      res.status(404).json({ error: 'Order not found' });
    }
  });

  apiRouter.put('/orders/:id/status', authenticateToken, (req, res) => {
    const { status } = req.body;
    const stmt = db.prepare('UPDATE orders SET status = ? WHERE id = ?');
    stmt.run(status, req.params.id);
    res.json({ success: true });
  });

  // Messages API (Contact, Bulk, Newsletter)
  apiRouter.post('/messages', (req, res) => {
    try {
      const { type, name, email, phone, details } = req.body;
      const stmt = db.prepare('INSERT INTO messages (type, name, email, phone, details) VALUES (?, ?, ?, ?, ?)');
      stmt.run(type, name, email, phone, JSON.stringify(details || {}));
      
      // Send Confirmation Email for Contact/Bulk
      if (type === 'contact' || type === 'bulk') {
        const subject = type === 'bulk' ? 'Bulk Order Inquiry Received' : 'Contact Inquiry Received';
        const emailHtml = `
          <h1>We received your message</h1>
          <p>Dear ${name || 'Customer'},</p>
          <p>Thank you for contacting us. We have received your inquiry and will get back to you shortly.</p>
          <br>
          <p>Best regards,</p>
          <p>SEWA Goatique Team</p>
        `;
        sendEmail(email, subject, emailHtml);
      }

      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: 'Failed to save message' });
    }
  });

  apiRouter.get('/messages', (req, res) => {
    const messages = db.prepare('SELECT * FROM messages ORDER BY created_at DESC').all();
    const parsedMessages = messages.map((m: any) => ({
      ...m,
      details: JSON.parse(m.details || '{}')
    }));
    res.json(parsedMessages);
  });

  // Content API
  apiRouter.get('/content/:key', (req, res) => {
    const content = db.prepare('SELECT value FROM content WHERE key = ?').get(req.params.key);
    if (content) {
      res.json(JSON.parse((content as any).value));
    } else {
      res.json({});
    }
  });

  apiRouter.post('/content/:key', authenticateToken, (req, res) => {
    const { value } = req.body;
    const stmt = db.prepare('INSERT OR REPLACE INTO content (key, value) VALUES (?, ?)');
    stmt.run(req.params.key, JSON.stringify(value));
    res.json({ success: true });
  });

  // Blog Posts API
  apiRouter.get('/posts', (req, res) => {
    const posts = db.prepare('SELECT * FROM posts ORDER BY created_at DESC').all();
    res.json(posts);
  });

  apiRouter.get('/posts/:slug', (req, res) => {
    const post = db.prepare('SELECT * FROM posts WHERE slug = ?').get(req.params.slug);
    if (post) {
      res.json(post);
    } else {
      res.status(404).json({ error: 'Post not found' });
    }
  });

  apiRouter.post('/posts', authenticateToken, (req, res) => {
    try {
      const { title, slug, content, excerpt, image, author, published } = req.body;
      const stmt = db.prepare('INSERT INTO posts (title, slug, content, excerpt, image, author, published) VALUES (?, ?, ?, ?, ?, ?, ?)');
      const info = stmt.run(title, slug, content, excerpt, image, author, published ? 1 : 0);
      res.json({ success: true, id: info.lastInsertRowid });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to create post' });
    }
  });

  apiRouter.put('/posts/:id', authenticateToken, (req, res) => {
    try {
      const { title, slug, content, excerpt, image, author, published } = req.body;
      const stmt = db.prepare('UPDATE posts SET title = ?, slug = ?, content = ?, excerpt = ?, image = ?, author = ?, published = ? WHERE id = ?');
      stmt.run(title, slug, content, excerpt, image, author, published ? 1 : 0, req.params.id);
      res.json({ success: true });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to update post' });
    }
  });

  apiRouter.delete('/posts/:id', authenticateToken, (req, res) => {
    try {
      const stmt = db.prepare('DELETE FROM posts WHERE id = ?');
      stmt.run(req.params.id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete post' });
    }
  });

  app.use('/api', apiRouter);

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    console.log("Creating Vite server...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    console.log("Vite server created.");
    app.use(vite.middlewares);
  } else {
    // Production static file serving (placeholder for build output)
    app.use(express.static(join(__dirname, 'dist')));
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
