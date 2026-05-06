const mongoose = require('mongoose');
require('dotenv').config();

async function addProducts() {
  await mongoose.connect(process.env.MONGODB_URI);
  const db = mongoose.connection.db;
  
  console.log('✅ Connected\n');
  
  // ALL 5 TV PRODUCTS
  const tvs = [
    { name: "Samsung 43-inch 4K Ultra HD Smart TV", price: 1599, deposit: 4800 },
    { name: "LG 55-inch QLED 4K TV", price: 2499, deposit: 7500 },
    { name: "Sony 32-inch HD Ready LED TV", price: 999, deposit: 3000 },
    { name: "OnePlus 65-inch OLED 4K Smart TV", price: 3999, deposit: 12000 },
    { name: "Mi 50-inch Android 4K TV", price: 1899, deposit: 5700 }
  ];
  
  // ALL 5 MICROWAVE PRODUCTS
  const microwaves = [
    { name: "Samsung 28L Convection Microwave Oven", price: 1099, deposit: 3300 },
    { name: "LG 20L Solo Microwave Oven", price: 599, deposit: 1800 },
    { name: "Panasonic 23L Grill Microwave", price: 999, deposit: 3000 },
    { name: "IFB 25L Inverter Microwave", price: 1299, deposit: 3900 },
    { name: "Whirlpool 30L Convection Microwave", price: 1499, deposit: 4500 }
  ];
  
  // TV Images
  const tvImages = [
    'https://rukminim2.flixcart.com/image/312/312/xif0q/television/e/s/w/-original-imahgs5x7j5gznds.jpeg?q=70',
    'https://rukminim2.flixcart.com/image/312/312/xif0q/television/6/o/8/-original-imahh3kms2x57mgx.jpeg?q=70',
    'https://rukminim2.flixcart.com/image/312/312/xif0q/television/4/o/6/marq-by-flipkart-32hdndqee1b-marq-by-flipkart-original-imah6fc3hqjdtbds.jpeg?q=70'
  ];
  
  // Microwave Images
  const microwaveImages = [
    'https://rukminim2.flixcart.com/image/312/312/xif0q/microwave-new/q/m/h/-original-imah7z9yf6aqxkmn.jpeg?q=70',
    'https://rukminim2.flixcart.com/image/312/312/xif0q/microwave-new/j/c/p/-original-imah8yu8dgtsy7zg.jpeg?q=70',
    'https://rukminim2.flixcart.com/image/312/312/xif0q/microwave-new/y/w/q/-original-imahcvp7ykwryytj.jpeg?q=70'
  ];
  
  let added = 0;
  
  // Delete existing TVs and Microwaves first to ensure clean slate
  await db.collection('products').deleteMany({ subCategory: 'TV' });
  await db.collection('products').deleteMany({ subCategory: 'Microwave' });
  console.log('🗑️ Removed existing TVs and Microwaves\n');
  
  // Add all 5 TVs
  for (const tv of tvs) {
    await db.collection('products').insertOne({
      name: tv.name,
      category: 'Appliances',
      subCategory: 'TV',
      description: `Experience cinema at home with ${tv.name}. Features stunning picture quality and smart capabilities.`,
      monthlyRent: tv.price,
      securityDeposit: tv.deposit,
      rentalTenureOptions: [1, 3, 6, 12],
      images: tvImages,
      quantity: 15,
      availableQuantity: 15,
      specifications: {
        brand: tv.name.split(' ')[0],
        screenSize: tv.name.split(' ')[1],
        resolution: '4K UHD',
        smartFeatures: 'Yes',
        warranty: '2 years'
      },
      rating: (4 + Math.random() * 0.9).toFixed(1),
      numReviews: Math.floor(Math.random() * 200) + 100,
      isAvailable: true
    });
    console.log(`✅ Added TV: ${tv.name}`);
    added++;
  }
  
  // Add all 5 Microwaves
  for (const mw of microwaves) {
    await db.collection('products').insertOne({
      name: mw.name,
      category: 'Appliances',
      subCategory: 'Microwave',
      description: `Quick and efficient cooking with ${mw.name}. Perfect for modern kitchens.`,
      monthlyRent: mw.price,
      securityDeposit: mw.deposit,
      rentalTenureOptions: [1, 3, 6, 12],
      images: microwaveImages,
      quantity: 15,
      availableQuantity: 15,
      specifications: {
        brand: mw.name.split(' ')[0],
        capacity: '23L',
        color: 'Black',
        warranty: '2 years'
      },
      rating: (4 + Math.random() * 0.8).toFixed(1),
      numReviews: Math.floor(Math.random() * 150) + 50,
      isAvailable: true
    });
    console.log(`✅ Added Microwave: ${mw.name}`);
    added++;
  }
  
  // Verify final counts
  const finalTVs = await db.collection('products').find({ subCategory: 'TV' }).toArray();
  const finalMicrowaves = await db.collection('products').find({ subCategory: 'Microwave' }).toArray();
  
  console.log(`\n📊 FINAL COUNTS:`);
  console.log(`   TVs: ${finalTVs.length}/5`);
  console.log(`   Microwaves: ${finalMicrowaves.length}/5`);
  console.log(`   Total Added: ${added}\n`);
  
  process.exit(0);
}

addProducts();
