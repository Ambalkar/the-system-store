const mongoose = require('mongoose');
const Product = require('../models/Product');

module.exports = async (req, res) => {
  // Only allow POST with a secret key for security
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { secret } = req.body;
  if (secret !== 'seed-system-store-2026') {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://devendraambalkar11_db_user:mNDZ8qIJ6X9z89HT@cluster0.dn3mmbq.mongodb.net/ecommerce?retryWrites=true&w=majority&appName=Cluster0';
  const SITE_URL = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : 'https://the-system-store-htlf.vercel.app';

  const products = [
    {
      name: 'Boldfit Massager Gun',
      description: 'Professional-grade muscle massager with 30 speed levels, 6 massage heads, and deep tissue relief for athletes and everyday recovery.',
      price: 1799,
      image: `${SITE_URL}/products/boldfit_gun.png`,
    },
    {
      name: 'OnePlus Earbuds',
      description: 'True wireless earbuds with active noise cancellation, 30-hour total battery life, and powerful bass. Designed for long-lasting comfort.',
      price: 2499,
      image: `${SITE_URL}/products/oneplus_earbuds.png`,
    },
    {
      name: 'Premium Running Shoes',
      description: 'Lightweight and breathable running shoes with cushioned soles and arch support. Built for performance on any terrain.',
      price: 1299,
      image: `${SITE_URL}/products/shoes.png`,
    },
    {
      name: 'Urban Sling Bag',
      description: 'Compact and stylish sling bag with water-resistant fabric, multiple pockets, and a modern design. Perfect for commuters and travellers.',
      price: 899,
      image: `${SITE_URL}/products/sling_bag.png`,
    },
    {
      name: 'Smart Fitness Watch',
      description: 'Feature-packed smartwatch with heart rate monitoring, GPS, sleep tracking, and 7-day battery life. Compatible with Android and iOS.',
      price: 3499,
      image: `${SITE_URL}/products/watch.png`,
    },
  ];

  try {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(MONGODB_URI);
    }
    await Product.deleteMany({});
    const inserted = await Product.insertMany(products);
    res.status(200).json({
      success: true,
      message: `Seeded ${inserted.length} products`,
      products: inserted.map(p => ({ name: p.name, image: p.image }))
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
