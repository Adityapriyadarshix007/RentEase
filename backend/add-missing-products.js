const mongoose = require('mongoose');
require('dotenv').config();

async function addMissing() {
  await mongoose.connect(process.env.MONGODB_URI);
  const db = mongoose.connection.db;
  
  console.log('✅ Connected to MongoDB\n');
  
  // Check current counts
  let microwaves = await db.collection('products').find({ subCategory: 'Microwave' }).toArray();
  let acs = await db.collection('products').find({ subCategory: 'AC' }).toArray();
  
  console.log(`Current Microwaves: ${microwaves.length}`);
  console.log(`Current ACs: ${acs.length}\n`);
  
  // MICROWAVE PRODUCTS (5 total)
  const allMicrowaves = [
    { name: "Samsung 28L Convection Microwave Oven", price: 1099, deposit: 3300 },
    { name: "LG 20L Solo Microwave Oven", price: 599, deposit: 1800 },
    { name: "Panasonic 23L Grill Microwave", price: 999, deposit: 3000 },
    { name: "IFB 25L Inverter Microwave", price: 1299, deposit: 3900 },
    { name: "Whirlpool 30L Convection Microwave", price: 1499, deposit: 4500 }
  ];
  
  // AC PRODUCTS (5 total)
  const allACs = [
    { name: "1.5 Ton 5-Star Inverter AC", price: 1899, deposit: 5700 },
    { name: "1 Ton Split AC with Filter", price: 1499, deposit: 4500 },
    { name: "2 Ton Window AC", price: 2199, deposit: 6600 },
    { name: "Smart Wi-Fi AC 1.5 Ton", price: 2399, deposit: 7200 },
    { name: "Portable AC 1 Ton", price: 1699, deposit: 5100 }
  ];
  
  let added = 0;
  
  // Add missing Microwaves
  for (const m of allMicrowaves) {
    const exists = await db.collection('products').findOne({ name: m.name });
    if (!exists) {
      await db.collection('products').insertOne({
        name: m.name,
        category: 'Appliances',
        subCategory: 'Microwave',
        description: `Premium ${m.name} with advanced cooking technology. Features multiple cooking modes and energy efficiency.`,
        monthlyRent: m.price,
        securityDeposit: m.deposit,
        rentalTenureOptions: [1, 3, 6, 12],
        images: [
          'https://rukminim2.flixcart.com/image/312/312/xif0q/microwave-new/q/m/h/-original-imah7z9yf6aqxkmn.jpeg?q=70',
          'https://rukminim2.flixcart.com/image/312/312/xif0q/microwave-new/j/c/p/-original-imah8yu8dgtsy7zg.jpeg?q=70',
          'https://rukminim2.flixcart.com/image/312/312/xif0q/microwave-new/y/w/q/-original-imahcvp7ykwryytj.jpeg?q=70'
        ],
        quantity: 15,
        availableQuantity: 15,
        specifications: {
          brand: m.name.split(' ')[0],
          capacity: '23L',
          color: 'Black',
          warranty: '2 years'
        },
        rating: (4 + Math.random() * 0.8).toFixed(1),
        numReviews: Math.floor(Math.random() * 150) + 50,
        isAvailable: true
      });
      console.log(`✅ Added Microwave: ${m.name}`);
      added++;
    } else {
      console.log(`⚠️ Already exists: ${m.name}`);
    }
  }
  
  // Add missing ACs
  for (const a of allACs) {
    const exists = await db.collection('products').findOne({ name: a.name });
    if (!exists) {
      await db.collection('products').insertOne({
        name: a.name,
        category: 'Appliances',
        subCategory: 'AC',
        description: `Powerful ${a.name} with energy-efficient cooling technology. Perfect for beating the heat.`,
        monthlyRent: a.price,
        securityDeposit: a.deposit,
        rentalTenureOptions: [1, 3, 6, 12],
        images: [
          'https://rukminim2.flixcart.com/image/312/312/xif0q/air-conditioner-new/v/z/c/-original-imahgfjzxdtkge6p.jpeg?q=70',
          'https://rukminim2.flixcart.com/image/312/312/xif0q/air-conditioner-new/3/p/m/-original-imahhpvzd6fgvptt.jpeg?q=70',
          'https://rukminim2.flixcart.com/image/312/312/xif0q/air-conditioner-new/r/y/p/-original-imahjm2fvshaeffh.jpeg?q=70'
        ],
        quantity: 12,
        availableQuantity: 12,
        specifications: {
          brand: 'CoolAir',
          capacity: a.name.split(' ')[0],
          energyRating: '5 Star',
          warranty: '2 years'
        },
        rating: (4 + Math.random() * 0.8).toFixed(1),
        numReviews: Math.floor(Math.random() * 180) + 40,
        isAvailable: true
      });
      console.log(`✅ Added AC: ${a.name}`);
      added++;
    } else {
      console.log(`⚠️ Already exists: ${a.name}`);
    }
  }
  
  // Final counts
  microwaves = await db.collection('products').find({ subCategory: 'Microwave' }).toArray();
  acs = await db.collection('products').find({ subCategory: 'AC' }).toArray();
  const total = await db.collection('products').countDocuments();
  
  console.log(`\n📊 FINAL COUNTS:`);
  console.log(`   Microwaves: ${microwaves.length}/5`);
  console.log(`   ACs: ${acs.length}/5`);
  console.log(`   Total Products: ${total}`);
  console.log(`   Added ${added} new products\n`);
  
  process.exit(0);
}

addMissing();
