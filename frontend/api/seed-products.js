const mongoose = require('mongoose');
const Product = require('./models/Product');

const MONGODB_URI = 'mongodb+srv://devendraambalkar11_db_user:mNDZ8qIJ6X9z89HT@cluster0.dn3mmbq.mongodb.net/ecommerce?retryWrites=true&w=majority&appName=Cluster0';

// Replace SITE_URL with your actual Vercel deployment URL
// e.g. https://the-system-store.vercel.app
const SITE_URL = process.env.SITE_URL || 'http://localhost:3000';

const products = [
  {
    name: 'Boldfit Massager Gun',
    description: 'Professional-grade muscle massager gun with 30 speed levels, 6 massage heads, and deep tissue relief for athletes and everyday recovery.',
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

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB Atlas');

    // Clear existing products
    await Product.deleteMany({});
    console.log('Cleared existing products');

    // Insert new products
    const inserted = await Product.insertMany(products);
    console.log(`✅ Seeded ${inserted.length} products successfully`);
    inserted.forEach(p => console.log(`  - ${p.name} → ${p.image}`));
  } catch (err) {
    console.error('Seed error:', err);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

seed();
