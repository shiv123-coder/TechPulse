const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const User = require('./models/User');
const Product = require('./models/Product');

dotenv.config();

const sampleProducts = [
  {
    name: 'Sony WH-1000XM5 Wireless Noise-Cancelling Headphones',
    description: 'Industry-leading noise cancellation with two processors and eight microphones. Up to 30-hour battery life with quick charging.',
    price: 349.99,
    category: 'Audio',
    imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80',
    stockCount: 15,
    rating: 4.8,
    numReviews: 48,
    featured: true
  },
  {
    name: 'Apple Watch Series 9 GPS 45mm',
    description: 'Smartwatch with S9 SiP, double tap gesture control, brighter display, and advanced health tracking including blood oxygen and ECG.',
    price: 399.00,
    category: 'Wearables',
    imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80',
    stockCount: 22,
    rating: 4.9,
    numReviews: 64,
    featured: true
  },
  {
    name: 'Logitech MX Master 3S Wireless Mouse',
    description: 'Quiet clicks and 8K DPI any-surface tracking. Ergonomic design crafted for precision, comfort, and ultra-fast MagSpeed scrolling.',
    price: 99.99,
    category: 'Accessories',
    imageUrl: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800&auto=format&fit=crop&q=80',
    stockCount: 30,
    rating: 4.7,
    numReviews: 32,
    featured: false
  },
  {
    name: 'Keychron K2 Wireless Mechanical Keyboard',
    description: 'Compact 75% layout mechanical keyboard with Gateron G Pro Brown switches, RGB backlight, and Mac & Windows compatibility.',
    price: 89.99,
    category: 'Accessories',
    imageUrl: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&auto=format&fit=crop&q=80',
    stockCount: 18,
    rating: 4.6,
    numReviews: 29,
    featured: true
  },
  {
    name: 'Fujifilm X-T30 II Mirrorless Camera',
    description: '26.1MP X-Trans CMOS 4 sensor, 4K/30p video, classic retro styling with high-precision autofocus and 18 film simulation modes.',
    price: 899.00,
    category: 'Photography',
    imageUrl: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&auto=format&fit=crop&q=80',
    stockCount: 8,
    rating: 4.9,
    numReviews: 19,
    featured: true
  },
  {
    name: 'Bose SoundLink Flex Bluetooth Speaker',
    description: 'Crisp, clear sound with surprisingly deep bass. Waterproof and dustproof (IP67) with PositionIQ technology for optimal acoustics.',
    price: 149.00,
    category: 'Audio',
    imageUrl: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=800&auto=format&fit=crop&q=80',
    stockCount: 25,
    rating: 4.6,
    numReviews: 41,
    featured: false
  },
  {
    name: 'Bellroy Classic Leather Backpack Plus 24L',
    description: 'Clean modern backpack with designated padded laptop compartment (up to 16"), water-resistant exterior, and contoured lumbar support.',
    price: 179.00,
    category: 'Accessories',
    imageUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=80',
    stockCount: 14,
    rating: 4.5,
    numReviews: 15,
    featured: false
  },
  {
    name: 'Dell UltraSharp 27 4K USB-C Hub Monitor',
    description: '27-inch 4K UHD IPS Black technology display with 98% DCI-P3 color gamut, 90W Power Delivery USB-C, and ultra-thin bezels.',
    price: 579.99,
    category: 'Computers',
    imageUrl: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&auto=format&fit=crop&q=80',
    stockCount: 10,
    rating: 4.8,
    numReviews: 24,
    featured: true
  },
  {
    name: 'Anker 737 Power Bank (PowerCore 24K)',
    description: 'Ultra-powerful 140W two-way fast charging with smart digital display, 24,000mAh capacity to power phones, tablets, and laptops.',
    price: 139.99,
    category: 'Accessories',
    imageUrl: 'https://images.unsplash.com/photo-1609592424109-dd9892f1b177?w=800&auto=format&fit=crop&q=80',
    stockCount: 35,
    rating: 4.7,
    numReviews: 53,
    featured: false
  },
  {
    name: 'Kindle Paperwhite Signature Edition (32GB)',
    description: '6.8-inch glare-free 300 ppi display, adjustable warm light, wireless charging, and up to 10 weeks of battery life.',
    price: 189.99,
    category: 'Wearables',
    imageUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&auto=format&fit=crop&q=80',
    stockCount: 20,
    rating: 4.8,
    numReviews: 38,
    featured: false
  }
];

const seedData = async () => {
  try {
    await connectDB();

    console.log('[Seeder] Cleaning existing database collections...');
    await User.deleteMany();
    await Product.deleteMany();

    console.log('[Seeder] Creating admin and demo users...');
    const adminUser = await User.create({
      name: 'Pluto Admin',
      email: 'admin@ecommerce.com',
      password: 'AdminPassword123!',
      role: 'admin'
    });

    const demoUser = await User.create({
      name: 'Demo Customer',
      email: 'user@ecommerce.com',
      password: 'UserPassword123!',
      role: 'user'
    });

    console.log(`[Seeder] Created Admin: ${adminUser.email} (role: ${adminUser.role})`);
    console.log(`[Seeder] Created User: ${demoUser.email} (role: ${demoUser.role})`);

    console.log('[Seeder] Inserting sample products...');
    const insertedProducts = await Product.insertMany(sampleProducts);
    console.log(`[Seeder] Successfully imported ${insertedProducts.length} products!`);

    console.log('[Seeder] Database Seeding Completed Successfully.');
    process.exit(0);
  } catch (error) {
    console.error(`[Seeder Error] ${error.message}`);
    process.exit(1);
  }
};

seedData();

