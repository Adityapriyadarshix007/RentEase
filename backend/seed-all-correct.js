const mongoose = require('mongoose');
require('dotenv').config();

async function seedAll() {
  await mongoose.connect(process.env.MONGODB_URI);
  const db = mongoose.connection.db;
  
  console.log('✅ Connected to MongoDB\n');
  
  // Clear ALL existing products
  const deleted = await db.collection('products').deleteMany({});
  console.log(`🗑️ Cleared ${deleted.deletedCount} existing products\n`);
  
  // ALL 50 PRODUCTS (5 in each category)
  const allProducts = [
    // BEDS (5)
    { name: "Premium King Size Wooden Bed", cat: "Furniture", sub: "Bed", price: 1899, deposit: 5700 },
    { name: "Queen Size Upholstered Bed", cat: "Furniture", sub: "Bed", price: 1599, deposit: 4800 },
    { name: "Single Wooden Bed", cat: "Furniture", sub: "Bed", price: 899, deposit: 2700 },
    { name: "Double Storage Bed", cat: "Furniture", sub: "Bed", price: 2199, deposit: 6600 },
    { name: "Premium Bunk Bed", cat: "Furniture", sub: "Bed", price: 2499, deposit: 7500 },
    // SOFAS (5)
    { name: "3-Seater Leather Sofa", cat: "Furniture", sub: "Sofa", price: 3499, deposit: 10500 },
    { name: "L-Shape Fabric Sofa", cat: "Furniture", sub: "Sofa", price: 3999, deposit: 12000 },
    { name: "2-Seater Loveseat", cat: "Furniture", sub: "Sofa", price: 1899, deposit: 5700 },
    { name: "Sofa Cum Bed", cat: "Furniture", sub: "Sofa", price: 3299, deposit: 9900 },
    { name: "Single Seater Recliner", cat: "Furniture", sub: "Sofa", price: 4499, deposit: 13500 },
    // TABLES (5)
    { name: "6-Seater Dining Table", cat: "Furniture", sub: "Table", price: 1899, deposit: 5700 },
    { name: "Modern Coffee Table", cat: "Furniture", sub: "Table", price: 999, deposit: 3000 },
    { name: "Adjustable Study Table", cat: "Furniture", sub: "Table", price: 799, deposit: 2400 },
    { name: "Center Table", cat: "Furniture", sub: "Table", price: 1199, deposit: 3600 },
    { name: "Console Table", cat: "Furniture", sub: "Table", price: 1499, deposit: 4500 },
    // CHAIRS (5)
    { name: "Ergonomic Office Chair", cat: "Furniture", sub: "Chair", price: 899, deposit: 2700 },
    { name: "Wooden Dining Chair", cat: "Furniture", sub: "Chair", price: 499, deposit: 1500 },
    { name: "Rocking Chair", cat: "Furniture", sub: "Chair", price: 799, deposit: 2400 },
    { name: "Gaming Chair", cat: "Furniture", sub: "Chair", price: 1299, deposit: 3900 },
    { name: "Accent Chair", cat: "Furniture", sub: "Chair", price: 699, deposit: 2100 },
    // WARDROBES (5)
    { name: "3-Door Wooden Wardrobe", cat: "Furniture", sub: "Wardrobe", price: 2499, deposit: 7500 },
    { name: "Sliding Door Wardrobe", cat: "Furniture", sub: "Wardrobe", price: 2899, deposit: 8700 },
    { name: "4-Door Premium Wardrobe", cat: "Furniture", sub: "Wardrobe", price: 3299, deposit: 9900 },
    { name: "Corner Wardrobe", cat: "Furniture", sub: "Wardrobe", price: 1999, deposit: 6000 },
    { name: "Portable Closet", cat: "Furniture", sub: "Wardrobe", price: 999, deposit: 3000 },
    // FRIDGES (5)
    { name: "Double Door Refrigerator", cat: "Appliances", sub: "Fridge", price: 1599, deposit: 4800 },
    { name: "Single Door Fridge", cat: "Appliances", sub: "Fridge", price: 999, deposit: 3000 },
    { name: "French Door Fridge", cat: "Appliances", sub: "Fridge", price: 2499, deposit: 7500 },
    { name: "Side-by-Side Fridge", cat: "Appliances", sub: "Fridge", price: 2899, deposit: 8700 },
    { name: "Mini Fridge", cat: "Appliances", sub: "Fridge", price: 599, deposit: 1800 },
    // WASHING MACHINES (5)
    { name: "Front Load Washer", cat: "Appliances", sub: "Washing Machine", price: 1399, deposit: 4200 },
    { name: "Top Load Washer", cat: "Appliances", sub: "Washing Machine", price: 1199, deposit: 3600 },
    { name: "Smart Washer", cat: "Appliances", sub: "Washing Machine", price: 1799, deposit: 5400 },
    { name: "Semi-Automatic Washer", cat: "Appliances", sub: "Washing Machine", price: 799, deposit: 2400 },
    { name: "Compact Washer", cat: "Appliances", sub: "Washing Machine", price: 899, deposit: 2700 },
    // TVS (5) - ALL 5
    { name: "Samsung 43-inch 4K Ultra HD Smart TV", cat: "Appliances", sub: "TV", price: 1599, deposit: 4800 },
    { name: "LG 55-inch QLED 4K TV", cat: "Appliances", sub: "TV", price: 2499, deposit: 7500 },
    { name: "Sony 32-inch HD Ready LED TV", cat: "Appliances", sub: "TV", price: 999, deposit: 3000 },
    { name: "OnePlus 65-inch OLED 4K Smart TV", cat: "Appliances", sub: "TV", price: 3999, deposit: 12000 },
    { name: "Mi 50-inch Android 4K TV", cat: "Appliances", sub: "TV", price: 1899, deposit: 5700 },
    // ACS (5)
    { name: "1.5 Ton 5-Star Inverter AC", cat: "Appliances", sub: "AC", price: 1899, deposit: 5700 },
    { name: "1 Ton Split AC with Filter", cat: "Appliances", sub: "AC", price: 1499, deposit: 4500 },
    { name: "2 Ton Window AC", cat: "Appliances", sub: "AC", price: 2199, deposit: 6600 },
    { name: "Smart Wi-Fi AC 1.5 Ton", cat: "Appliances", sub: "AC", price: 2399, deposit: 7200 },
    { name: "Portable AC 1 Ton", cat: "Appliances", sub: "AC", price: 1699, deposit: 5100 },
    // MICROWAVES (5) - ALL 5
    { name: "Samsung 28L Convection Microwave Oven", cat: "Appliances", sub: "Microwave", price: 1099, deposit: 3300 },
    { name: "LG 20L Solo Microwave Oven", cat: "Appliances", sub: "Microwave", price: 599, deposit: 1800 },
    { name: "Panasonic 23L Grill Microwave", cat: "Appliances", sub: "Microwave", price: 999, deposit: 3000 },
    { name: "IFB 25L Inverter Microwave", cat: "Appliances", sub: "Microwave", price: 1299, deposit: 3900 },
    { name: "Whirlpool 30L Convection Microwave", cat: "Appliances", sub: "Microwave", price: 1499, deposit: 4500 }
  ];
  
  const images = {
    bed: 'https://rukminim2.flixcart.com/image/612/612/xif0q/bed/e/e/d/-original-imahh5h4wsqeveha.jpeg?q=70',
    sofa: 'https://rukminim2.flixcart.com/image/612/612/xif0q/sofa-sectional/z/i/v/left-facing-152-00-maroon-254-00-cotton-no-60-qt-n49v-rti1-original-imah9h58mzqvrw3x.jpeg?q=70',
    table: 'https://rukminim2.flixcart.com/image/612/612/xif0q/office-study-table/h/c/k/60-plywood-engineered-wood-mst-008-wow-lukzer-75-white-oak-brown-original-imahmffg2szrqkep.jpeg?q=70',
    chair: 'https://rukminim2.flixcart.com/image/612/612/xif0q/living-room-chair/x/n/g/76-brass-acacia-kasia-64-30-otis-swivel-brass-kingsman-original-imahmd25faeps4su.jpeg?q=70',
    wardrobe: 'https://rukminim2.flixcart.com/image/612/612/xif0q/wardrobe-closet/2/1/k/-original-imahggevxxaccz6z.jpeg?q=70',
    fridge: 'https://rukminim2.flixcart.com/image/312/312/xif0q/refrigerator-new/s/g/o/-original-imahgmmskmny7syy.jpeg?q=70',
    washingMachine: 'https://rukminim2.flixcart.com/image/312/312/xif0q/washing-machine-new/s/d/w/-original-imahhu2aywbxpuhz.jpeg?q=70',
    tv: 'https://rukminim2.flixcart.com/image/312/312/xif0q/television/e/s/w/-original-imahgs5x7j5gznds.jpeg?q=70',
    ac: 'https://rukminim2.flixcart.com/image/312/312/xif0q/air-conditioner-new/v/z/c/-original-imahgfjzxdtkge6p.jpeg?q=70',
    microwave: 'https://rukminim2.flixcart.com/image/312/312/xif0q/microwave-new/q/m/h/-original-imah7z9yf6aqxkmn.jpeg?q=70'
  };
  
  for (const p of allProducts) {
    let imgKey = p.sub.toLowerCase();
    if (imgKey === 'washing machine') imgKey = 'washingMachine';
    const imgUrl = images[imgKey] || images.bed;
    
    await db.collection('products').insertOne({
      name: p.name,
      category: p.cat,
      subCategory: p.sub,
      description: `Premium ${p.sub.toLowerCase()} for your home. High-quality product with elegant design.`,
      monthlyRent: p.price,
      securityDeposit: p.deposit,
      rentalTenureOptions: [1, 3, 6, 12],
      images: [imgUrl, imgUrl, imgUrl],
      quantity: 15,
      availableQuantity: 15,
      specifications: { brand: 'Premium', material: 'High Quality', warranty: '2 years' },
      rating: (4 + Math.random() * 0.8).toFixed(1),
      numReviews: Math.floor(Math.random() * 200) + 50,
      isAvailable: true
    });
    console.log(`✅ Added: ${p.name}`);
  }
  
  // Final verification
  const finalTVs = await db.collection('products').find({ subCategory: 'TV' }).toArray();
  const finalMicrowaves = await db.collection('products').find({ subCategory: 'Microwave' }).toArray();
  const total = await db.collection('products').countDocuments();
  
  console.log(`\n📊 FINAL COUNTS:`);
  console.log(`   Total Products: ${total}`);
  console.log(`   TVs: ${finalTVs.length}/5`);
  console.log(`   Microwaves: ${finalMicrowaves.length}/5`);
  
  console.log('\n🎉 ALL 50 PRODUCTS ADDED SUCCESSFULLY!\n');
  
  process.exit(0);
}

seedAll();
