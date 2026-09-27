const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const productRoutes = require('./routes/products');
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const Product = require('./models/Product');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/products', productRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running', db: mongoose.connection.readyState });
});

// Seed route — one-time use to populate products
app.post('/api/seed', async (req, res) => {
  const { secret } = req.body;
  if (secret !== 'seed-system-store-2026') {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  const SITE_URL = 'https://the-system-store-htlf.vercel.app';
  const products = [
    { name: 'Boldfit Massager Gun', description: 'Professional-grade muscle massager with 30 speed levels, 6 massage heads, and deep tissue relief for athletes and everyday recovery.', price: 1799, image: `${SITE_URL}/products/boldfit_gun.png` },
    { name: 'OnePlus Earbuds', description: 'True wireless earbuds with active noise cancellation, 30-hour total battery life, and powerful bass. Designed for long-lasting comfort.', price: 2499, image: `${SITE_URL}/products/oneplus_earbuds.png` },
    { name: 'Premium Running Shoes', description: 'Lightweight and breathable running shoes with cushioned soles and arch support. Built for performance on any terrain.', price: 1299, image: `${SITE_URL}/products/shoes.png` },
    { name: 'Urban Sling Bag', description: 'Compact and stylish sling bag with water-resistant fabric, multiple pockets, and a modern design. Perfect for commuters and travellers.', price: 899, image: `${SITE_URL}/products/sling_bag.png` },
    { name: 'Smart Fitness Watch', description: 'Feature-packed smartwatch with heart rate monitoring, GPS, sleep tracking, and 7-day battery life. Compatible with Android and iOS.', price: 3499, image: `${SITE_URL}/products/watch.png` },
  ];
  try {
    await Product.deleteMany({});
    const inserted = await Product.insertMany(products);
    res.json({ success: true, message: `Seeded ${inserted.length} products` });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// MongoDB Connection
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://devendraambalkar11_db_user:mNDZ8qIJ6X9z89HT@cluster0.dn3mmbq.mongodb.net/ecommerce?retryWrites=true&w=majority&appName=Cluster0';

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    // Only listen if not running on Vercel
    if (process.env.NODE_ENV !== 'production') {
      app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
      });
    }
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    // Don't exit process on Vercel, it might crash the serverless function builder
    if (process.env.NODE_ENV !== 'production') {
      process.exit(1);
    }
  });

// Export the Express API for Vercel
module.exports = app;
