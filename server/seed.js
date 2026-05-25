const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const Product = require('./models/Product');
const User = require('./models/User');

const products = [
  {
    name: 'JORDAN ZION 4 PF',
    category: 'Basketball Shoes',
    price: 12795,
    image: '/shoes/JORDAN+ZION+4+PF.png',
    description: 'Dominate the court with the Jordan Zion 4 PF.',
    stock: 50,
  },
  {
    name: 'AIR FORCE 1 07 FRESH',
    category: "Men's Shoes",
    price: 11295,
    image: "/shoes/AIR+FORCE+1+'07+FRESH.png",
    description: 'Classic street style with a fresh update.',
    stock: 80,
  },
  {
    name: 'AIR JORDAN 1 MID',
    category: "Men's Shoes",
    price: 11495,
    image: '/shoes/AIR+JORDAN+1+MID.png',
    description: 'Iconic silhouette meets everyday comfort.',
    stock: 60,
  },
  {
    name: 'JORDAN NU RETRO 1 G',
    category: 'Golf Shoes',
    price: 13995,
    image: '/shoes/JORDAN+NU+RETRO+1+G.png',
    description: 'Performance golf shoe with retro Jordan style.',
    stock: 30,
  },
  {
    name: 'NIKE DUNK LOW RETRO',
    category: "Men's Shoes",
    price: 10257,
    image: '/shoes/NIKE+DUNK+LOW+RETRO.png',
    description: 'The timeless Dunk Low returns in classic form.',
    stock: 100,
  },
  {
    name: 'NIKE VOMERO 18',
    category: "Men's Road Running Shoes",
    price: 13295,
    image: '/shoes/NIKE+VOMERO+18.png',
    description: 'Ultimate cushioning for long-distance running.',
    stock: 45,
  },
  {
    name: 'VAPOR 16 CLUB FG MG',
    category: "Men's Football Shoes",
    price: 4495,
    image: '/shoes/VAPOR+16+CLUB+FG_MG.png',
    description: 'Speed-engineered football studs for any surface.',
    stock: 70,
  },
  {
    name: 'NIKE ZOOMX VAPORFLY 3',
    category: "Men's Road Running Shoes",
    price: 20695,
    image: '/shoes/NIKE+ZOOMX+VAPORFLY+3.png',
    description: 'Elite racing shoe designed to break records.',
    stock: 25,
  },
];

const adminUser = {
  name: 'Admin',
  email: 'admin@sprintsoul.co',
  password: 'Admin@123',
  role: 'admin',
};

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await Product.deleteMany({});
    await User.deleteMany({ role: 'admin' });
    console.log('🗑️  Cleared existing products & admin users');

    // Seed products
    await Product.insertMany(products);
    console.log(`✅ Seeded ${products.length} products`);

    // Seed admin user
    await User.create(adminUser);
    console.log('✅ Seeded admin user: admin@sprintsoul.co / Admin@123');

    mongoose.disconnect();
    console.log('🎉 Database seeded successfully!');
  } catch (err) {
    console.error('❌ Seed error:', err.message);
    process.exit(1);
  }
}

seed();
