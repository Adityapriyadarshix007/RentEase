const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../backend/models/User.model');
const Product = require('../backend/models/Product.model');
const Category = require('../backend/models/Category.model');

dotenv.config();

const users = [
  {
    name: 'Admin User',
    email: 'admin@rentease.com',
    password: 'admin123',
    phone: '9876543210',
    role: 'admin',
    address: {
      street: 'Admin Street',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400001'
    }
  },
  {
    name: 'John Doe',
    email: 'john@example.com',
    password: 'john123',
    phone: '9876543211',
    role: 'user',
    address: {
      street: 'User Street',
      city: 'Delhi',
      state: 'Delhi',
      pincode: '110001'
    }
  }
];

const products = [
  {
    name: 'Premium Wooden Bed',
    category: 'Furniture',
    subCategory: 'Bed',
    description: 'King size wooden bed with storage drawers. Made from premium teak wood with elegant design.',
    monthlyRent: 1500,
    securityDeposit: 5000,
    rentalTenureOptions: [1, 3, 6, 12],
    quantity: 10,
    availableQuantity: 10,
    images: ['https://via.placeholder.com/400x300?text=Bed'],
    specifications: {
      brand: 'SleepWell',
      material: 'Solid Wood',
      dimensions: '78x72 inches',
      color: 'Walnut'
    }
  },
  {
    name: 'L-Shaped Sofa',
    category: 'Furniture',
    subCategory: 'Sofa',
    description: 'Comfortable L-shaped sofa with premium fabric. Perfect for living rooms.',
    monthlyRent: 2000,
    securityDeposit: 7000,
    rentalTenureOptions: [1, 3, 6, 12],
    quantity: 8,
    availableQuantity: 8,
    images: ['https://via.placeholder.com/400x300?text=Sofa'],
    specifications: {
      brand: 'UrbanLounge',
      material: 'Fabric + Foam',
      dimensions: '90x65 inches',
      color: 'Grey'
    }
  },
  {
    name: 'Double Door Refrigerator',
    category: 'Appliances',
    subCategory: 'Fridge',
    description: '340L Frost-free double door refrigerator with inverter technology.',
    monthlyRent: 2500,
    securityDeposit: 8000,
    rentalTenureOptions: [1, 3, 6, 12],
    quantity: 5,
    availableQuantity: 5,
    images: ['https://via.placeholder.com/400x300?text=Fridge'],
    specifications: {
      brand: 'Samsung',
      model: 'RT34M',
      color: 'Black',
      capacity: '340L'
    }
  },
  {
    name: 'Fully Automatic Washing Machine',
    category: 'Appliances',
    subCategory: 'Washing Machine',
    description: '7kg fully automatic front load washing machine with multiple wash programs.',
    monthlyRent: 1800,
    securityDeposit: 6000,
    rentalTenureOptions: [1, 3, 6, 12],
    quantity: 6,
    availableQuantity: 6,
    images: ['https://via.placeholder.com/400x300?text=Washing+Machine'],
    specifications: {
      brand: 'LG',
      model: 'FHM7',
      color: 'White',
      capacity: '7kg'
    }
  },
  {
    name: '55 inch 4K Smart TV',
    category: 'Appliances',
    subCategory: 'TV',
    description: '55 inch 4K Ultra HD Smart LED TV with built-in apps and voice control.',
    monthlyRent: 3000,
    securityDeposit: 10000,
    rentalTenureOptions: [1, 3, 6, 12],
    quantity: 5,
    availableQuantity: 5,
    images: ['https://via.placeholder.com/400x300?text=TV'],
    specifications: {
      brand: 'Sony',
      model: 'X55K',
      color: 'Black',
      screenSize: '55 inches'
    }
  },
  {
    name: '1.5 Ton Split AC',
    category: 'Appliances',
    subCategory: 'AC',
    description: '1.5 ton 3-star inverter split AC with copper condenser and anti-dust filter.',
    monthlyRent: 2800,
    securityDeposit: 9000,
    rentalTenureOptions: [1, 3, 6, 12],
    quantity: 7,
    availableQuantity: 7,
    images: ['https://via.placeholder.com/400x300?text=AC'],
    specifications: {
      brand: 'Daikin',
      model: 'FTK35',
      color: 'White',
      capacity: '1.5 Ton'
    }
  },
  {
    name: 'Wooden Dining Table',
    category: 'Furniture',
    subCategory: 'Dining Table',
    description: '6-seater wooden dining table set with chairs. Beautiful finish and sturdy design.',
    monthlyRent: 2200,
    securityDeposit: 7500,
    rentalTenureOptions: [1, 3, 6, 12],
    quantity: 4,
    availableQuantity: 4,
    images: ['https://via.placeholder.com/400x300?text=Dining+Table'],
    specifications: {
      brand: 'WoodCraft',
      material: 'Sheesham Wood',
      dimensions: '72x36 inches',
      color: 'Honey'
    }
  },
  {
    name: 'Study Table with Chair',
    category: 'Furniture',
    subCategory: 'Table',
    description: 'Ergonomic study table with adjustable chair. Perfect for home office or study.',
    monthlyRent: 1200,
    securityDeposit: 4000,
    rentalTenureOptions: [1, 3, 6, 12],
    quantity: 12,
    availableQuantity: 12,
    images: ['https://via.placeholder.com/400x300?text=Study+Table'],
    specifications: {
      brand: 'WorkSpace',
      material: 'Engineered Wood',
      dimensions: '48x24 inches',
      color: 'White'
    }
  }
];

const categories = [
  { name: 'Furniture', slug: 'furniture', order: 1 },
  { name: 'Appliances', slug: 'appliances', order: 2 }
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Product.deleteMany({});
    await Category.deleteMany({});
    console.log('Cleared existing data');

    // Insert users
    const createdUsers = await User.insertMany(users);
    console.log(`${createdUsers.length} users created`);

    // Insert categories
    const createdCategories = await Category.insertMany(categories);
    console.log(`${createdCategories.length} categories created`);

    // Insert products
    const createdProducts = await Product.insertMany(products);
    console.log(`${createdProducts.length} products created`);

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();