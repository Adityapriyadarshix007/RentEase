const mongoose = require('mongoose');
require('dotenv').config();

async function seedAll() {
  await mongoose.connect(process.env.MONGODB_URI);
  const db = mongoose.connection.db;
  
  console.log('✅ Connected to MongoDB\n');
  
  // Clear ALL existing products
  const deleted = await db.collection('products').deleteMany({});
  console.log(`🗑️ Cleared ${deleted.deletedCount} existing products\n`);
  
  // ========== REAL PRODUCTS WITH CITY DATA ==========
  const allProducts = [
    // BEDS (5) - With Real Data
    { 
      name: "Premium King Size Wooden Bed with Storage", 
      cat: "Furniture", 
      sub: "Bed", 
      price: 1899, 
      deposit: 5700,
      brand: "WoodCraft",
      desc: "King size bed with hydraulic storage, solid sheesham wood construction. Includes 2 side tables. Dimensions: 200cm x 190cm x 90cm.",
      city: "All India",
      availableCities: ["Delhi", "Mumbai", "Bangalore", "Kolkata", "Chennai", "Hyderabad", "Pune"]
    },
    { 
      name: "Queen Size Upholstered Bed with Headboard", 
      cat: "Furniture", 
      sub: "Bed", 
      price: 1599, 
      deposit: 4800,
      brand: "SleepWell",
      desc: "Premium queen size bed with tufted headboard and sturdy wooden frame. Dimensions: 210cm x 160cm x 85cm.",
      city: "All India",
      availableCities: ["Delhi", "Mumbai", "Bangalore", "Kolkata", "Hyderabad"]
    },
    { 
      name: "Single Wooden Bed with Underbed Storage", 
      cat: "Furniture", 
      sub: "Bed", 
      price: 899, 
      deposit: 2700,
      brand: "WoodCraft",
      desc: "Space-saving single bed with 3 drawers for storage. Made of premium engineered wood. Dimensions: 190cm x 100cm x 85cm.",
      city: "Delhi",
      availableCities: ["Delhi", "Mumbai", "Bangalore"]
    },
    { 
      name: "Double Storage Bed with Hydraulic Lift", 
      cat: "Furniture", 
      sub: "Bed", 
      price: 2199, 
      deposit: 6600,
      brand: "SpaceSaver",
      desc: "Double bed with hydraulic storage mechanism. Premium high-gloss finish. Dimensions: 200cm x 155cm x 90cm.",
      city: "All India",
      availableCities: ["Delhi", "Mumbai", "Bangalore", "Kolkata", "Chennai", "Hyderabad", "Pune"]
    },
    { 
      name: "Premium Bunk Bed with Study Desk", 
      cat: "Furniture", 
      sub: "Bed", 
      price: 2499, 
      deposit: 7500,
      brand: "StudyNest",
      desc: "Bunk bed with built-in study desk and bookshelf. Ideal for students. Material: Solid pine wood. Dimensions: 200cm x 200cm x 160cm.",
      city: "All India",
      availableCities: ["Delhi", "Mumbai", "Bangalore", "Kolkata", "Pune"]
    },
    
    // SOFAS (5) - With Real Data
    { 
      name: "3-Seater Leather Sofa Set", 
      cat: "Furniture", 
      sub: "Sofa", 
      price: 3499, 
      deposit: 10500,
      brand: "LuxuryHome",
      desc: "Premium 3-seater leather sofa with high-resilience foam cushions. Chrome legs. Dimensions: 210cm x 85cm x 85cm.",
      city: "All India",
      availableCities: ["Delhi", "Mumbai", "Bangalore", "Kolkata", "Hyderabad", "Pune"]
    },
    { 
      name: "L-Shape Fabric Sofa (4 Seater)", 
      cat: "Furniture", 
      sub: "Sofa", 
      price: 3999, 
      deposit: 12000,
      brand: "UrbanLivin",
      desc: "L-shaped 4-seater fabric sofa with chaise lounge. Machine-washable covers. Dimensions: 260cm x 180cm x 85cm.",
      city: "Mumbai",
      availableCities: ["Mumbai", "Pune", "Bangalore"]
    },
    { 
      name: "2-Seater Loveseat with Storage", 
      cat: "Furniture", 
      sub: "Sofa", 
      price: 1899, 
      deposit: 5700,
      brand: "SpaceSaver",
      desc: "Compact 2-seater loveseat with hidden storage in armrests. Dimensions: 160cm x 80cm x 80cm.",
      city: "All India",
      availableCities: ["Delhi", "Mumbai", "Bangalore", "Kolkata", "Chennai"]
    },
    { 
      name: "Sofa Cum Bed (3-in-1)", 
      cat: "Furniture", 
      sub: "Sofa", 
      price: 3299, 
      deposit: 9900,
      brand: "SleepSofa",
      desc: "Multi-functional sofa cum bed. Converts to a comfortable double bed. Dimensions: 200cm x 85cm x 80cm.",
      city: "All India",
      availableCities: ["Delhi", "Mumbai", "Bangalore", "Kolkata", "Hyderabad", "Pune"]
    },
    { 
      name: "Single Seater Premium Recliner", 
      cat: "Furniture", 
      sub: "Sofa", 
      price: 4499, 
      deposit: 13500,
      brand: "ReclinerWorld",
      desc: "Luxurious single seater recliner with swivel base. PU leather upholstery. Dimensions: 100cm x 80cm x 100cm.",
      city: "All India",
      availableCities: ["Delhi", "Mumbai", "Bangalore", "Chennai", "Pune"]
    },
    
    // TABLES (5) - With Real Data
    { 
      name: "6-Seater Wooden Dining Table Set", 
      cat: "Furniture", 
      sub: "Table", 
      price: 1899, 
      deposit: 5700,
      brand: "WoodCraft",
      desc: "6-seater dining table set with 6 cushioned chairs. Solid wood construction. Table: 180cm x 90cm x 76cm.",
      city: "All India",
      availableCities: ["Delhi", "Mumbai", "Bangalore", "Kolkata", "Hyderabad", "Pune", "Chennai"]
    },
    { 
      name: "Modern Coffee Table with Storage", 
      cat: "Furniture", 
      sub: "Table", 
      price: 999, 
      deposit: 3000,
      brand: "UrbanLivin",
      desc: "Modern coffee table with two drawers and shelf. High-gloss finish. Dimensions: 120cm x 60cm x 45cm.",
      city: "All India",
      availableCities: ["Delhi", "Mumbai", "Bangalore", "Kolkata"]
    },
    { 
      name: "Adjustable Height Study Table", 
      cat: "Furniture", 
      sub: "Table", 
      price: 799, 
      deposit: 2400,
      brand: "StudyNest",
      desc: "Adjustable height study table with tiltable top. Built-in cable management. Dimensions: 120cm x 60cm x 75cm.",
      city: "Delhi",
      availableCities: ["Delhi", "Mumbai", "Bangalore"]
    },
    { 
      name: "Premium Center Table with Glass Top", 
      cat: "Furniture", 
      sub: "Table", 
      price: 1199, 
      deposit: 3600,
      brand: "GlassHouse",
      desc: "Elegant center table with tempered glass top and wooden base. Dimensions: 100cm x 100cm x 45cm.",
      city: "All India",
      availableCities: ["Delhi", "Mumbai", "Bangalore", "Kolkata", "Hyderabad", "Pune"]
    },
    { 
      name: "Console Table with Mirror", 
      cat: "Furniture", 
      sub: "Table", 
      price: 1499, 
      deposit: 4500,
      brand: "WoodCraft",
      desc: "Stylish console table with wall-mounted mirror. Perfect for entryways. Dimensions: 120cm x 40cm x 80cm.",
      city: "Mumbai",
      availableCities: ["Mumbai", "Pune", "Bangalore"]
    },
    
    // CHAIRS (5) - With Real Data
    { 
      name: "Ergonomic Office Chair with Lumbar Support", 
      cat: "Furniture", 
      sub: "Chair", 
      price: 899, 
      deposit: 2700,
      brand: "ComfortSeat",
      desc: "Ergonomic office chair with adjustable height, lumbar support, and armrests. Weight capacity: 120kg.",
      city: "All India",
      availableCities: ["Delhi", "Mumbai", "Bangalore", "Kolkata", "Hyderabad", "Pune", "Chennai"]
    },
    { 
      name: "Wooden Dining Chair (Set of 2)", 
      cat: "Furniture", 
      sub: "Chair", 
      price: 499, 
      deposit: 1500,
      brand: "WoodCraft",
      desc: "Set of 2 solid wooden dining chairs with comfortable curved backrest. Dimensions: 45cm x 42cm x 90cm.",
      city: "All India",
      availableCities: ["Delhi", "Mumbai", "Bangalore", "Kolkata"]
    },
    { 
      name: "Rocking Chair with Cushion", 
      cat: "Furniture", 
      sub: "Chair", 
      price: 799, 
      deposit: 2400,
      brand: "RelaxLife",
      desc: "Comfortable rocking chair with removable cushion. Solid teak wood construction. Weight capacity: 100kg.",
      city: "All India",
      availableCities: ["Delhi", "Mumbai", "Bangalore", "Hyderabad", "Pune"]
    },
    { 
      name: "Gaming Chair with Neck Support", 
      cat: "Furniture", 
      sub: "Chair", 
      price: 1299, 
      deposit: 3900,
      brand: "GameSeat",
      desc: "Professional gaming chair with 4D adjustable armrests and backrest. Height: 125-135cm.",
      city: "All India",
      availableCities: ["Delhi", "Mumbai", "Bangalore", "Chennai", "Hyderabad", "Pune"]
    },
    { 
      name: "Accent Chair with Gold Legs", 
      cat: "Furniture", 
      sub: "Chair", 
      price: 699, 
      deposit: 2100,
      brand: "LuxuryHome",
      desc: "Elegant accent chair with gold-finished metal legs and velvet upholstery. Dimensions: 70cm x 65cm x 85cm.",
      city: "Mumbai",
      availableCities: ["Mumbai", "Delhi", "Bangalore"]
    },
    
    // WARDROBES (5) - With Real Data
    { 
      name: "3-Door Wooden Wardrobe with Mirror", 
      cat: "Furniture", 
      sub: "Wardrobe", 
      price: 2499, 
      deposit: 7500,
      brand: "WoodCraft",
      desc: "3-door wooden wardrobe with full-length mirror and 2 drawers. Dimensions: 150cm x 180cm x 60cm.",
      city: "All India",
      availableCities: ["Delhi", "Mumbai", "Bangalore", "Kolkata", "Hyderabad", "Pune", "Chennai"]
    },
    { 
      name: "Sliding Door Wardrobe with 4 Doors", 
      cat: "Furniture", 
      sub: "Wardrobe", 
      price: 2899, 
      deposit: 8700,
      brand: "SpaceSaver",
      desc: "4-door sliding wardrobe with 6 shelves and hanging section. Dimensions: 200cm x 200cm x 65cm.",
      city: "All India",
      availableCities: ["Delhi", "Mumbai", "Bangalore", "Kolkata", "Hyderabad", "Pune"]
    },
    { 
      name: "4-Door Premium Wooden Wardrobe", 
      cat: "Furniture", 
      sub: "Wardrobe", 
      price: 3299, 
      deposit: 9900,
      brand: "WoodCraft",
      desc: "Premium 4-door wardrobe with 4 drawers, hanging rods, and shoe rack. Dimensions: 180cm x 200cm x 65cm.",
      city: "All India",
      availableCities: ["Delhi", "Mumbai", "Bangalore", "Kolkata", "Hyderabad", "Pune", "Chennai"]
    },
    { 
      name: "Corner Wardrobe for Small Spaces", 
      cat: "Furniture", 
      sub: "Wardrobe", 
      price: 1999, 
      deposit: 6000,
      brand: "SpaceSaver",
      desc: "Space-saving corner wardrobe with triangular design. Dimensions: 120cm x 120cm x 200cm.",
      city: "Delhi",
      availableCities: ["Delhi", "Mumbai", "Bangalore"]
    },
    { 
      name: "Portable Closet with Wheels", 
      cat: "Furniture", 
      sub: "Wardrobe", 
      price: 999, 
      deposit: 3000,
      brand: "EasyMove",
      desc: "Lightweight portable closet with wheels and hanging rod. Easy to assemble and move. Dimensions: 150cm x 180cm x 50cm.",
      city: "All India",
      availableCities: ["Delhi", "Mumbai", "Bangalore", "Kolkata", "Hyderabad", "Pune"]
    },
    
    // FRIDGES (5) - With Real Data
    { 
      name: "Double Door Refrigerator 340L", 
      cat: "Appliances", 
      sub: "Fridge", 
      price: 1599, 
      deposit: 4800,
      brand: "Whirlpool",
      desc: "340L double door refrigerator with frost-free technology and 5-star energy rating. Dimensions: 165cm x 70cm x 70cm.",
      city: "All India",
      availableCities: ["Delhi", "Mumbai", "Bangalore", "Kolkata", "Hyderabad", "Pune", "Chennai"]
    },
    { 
      name: "Single Door Refrigerator 190L", 
      cat: "Appliances", 
      sub: "Fridge", 
      price: 999, 
      deposit: 3000,
      brand: "LG",
      desc: "190L single door refrigerator with 5-star energy rating and direct cool technology. Dimensions: 140cm x 55cm x 60cm.",
      city: "All India",
      availableCities: ["Delhi", "Mumbai", "Bangalore", "Kolkata", "Hyderabad", "Pune"]
    },
    { 
      name: "French Door Refrigerator 480L", 
      cat: "Appliances", 
      sub: "Fridge", 
      price: 2499, 
      deposit: 7500,
      brand: "Samsung",
      desc: "480L French door refrigerator with water dispenser and 5-star energy rating. Dimensions: 180cm x 85cm x 75cm.",
      city: "Mumbai",
      availableCities: ["Mumbai", "Delhi", "Bangalore", "Pune"]
    },
    { 
      name: "Side-by-Side Refrigerator 550L", 
      cat: "Appliances", 
      sub: "Fridge", 
      price: 2899, 
      deposit: 8700,
      brand: "LG",
      desc: "550L side-by-side refrigerator with ice maker and stainless steel finish. Dimensions: 180cm x 90cm x 75cm.",
      city: "All India",
      availableCities: ["Delhi", "Mumbai", "Bangalore", "Kolkata", "Hyderabad", "Pune", "Chennai"]
    },
    { 
      name: "Mini Fridge 50L (Single Person)", 
      cat: "Appliances", 
      sub: "Fridge", 
      price: 599, 
      deposit: 1800,
      brand: "Godrej",
      desc: "Compact 50L mini fridge, perfect for students and small spaces. Dimensions: 50cm x 45cm x 50cm.",
      city: "All India",
      availableCities: ["Delhi", "Mumbai", "Bangalore", "Kolkata", "Hyderabad", "Pune", "Chennai"]
    },
    
    // WASHING MACHINES (5) - With Real Data
    { 
      name: "Front Load Washing Machine 7kg", 
      cat: "Appliances", 
      sub: "Washing Machine", 
      price: 1399, 
      deposit: 4200,
      brand: "Samsung",
      desc: "7kg front load washing machine with inverter technology and 1400 RPM. Dimensions: 85cm x 60cm x 60cm.",
      city: "All India",
      availableCities: ["Delhi", "Mumbai", "Bangalore", "Kolkata", "Hyderabad", "Pune", "Chennai"]
    },
    { 
      name: "Top Load Washing Machine 8kg", 
      cat: "Appliances", 
      sub: "Washing Machine", 
      price: 1199, 
      deposit: 3600,
      brand: "LG",
      desc: "8kg top load washing machine with TurboDrum and 5-star energy rating. Dimensions: 95cm x 55cm x 55cm.",
      city: "All India",
      availableCities: ["Delhi", "Mumbai", "Bangalore", "Kolkata", "Hyderabad", "Pune"]
    },
    { 
      name: "Smart Washer with Wi-Fi 7.5kg", 
      cat: "Appliances", 
      sub: "Washing Machine", 
      price: 1799, 
      deposit: 5400,
      brand: "Samsung",
      desc: "7.5kg smart washer with Wi-Fi connectivity and AI Wash. Dimensions: 85cm x 60cm x 60cm.",
      city: "Delhi",
      availableCities: ["Delhi", "Mumbai", "Bangalore"]
    },
    { 
      name: "Semi-Automatic Washer 8kg", 
      cat: "Appliances", 
      sub: "Washing Machine", 
      price: 799, 
      deposit: 2400,
      brand: "Whirlpool",
      desc: "8kg semi-automatic washer with dual tub and rust-proof body. Dimensions: 90cm x 55cm x 60cm.",
      city: "All India",
      availableCities: ["Delhi", "Mumbai", "Bangalore", "Kolkata", "Hyderabad", "Pune", "Chennai"]
    },
    { 
      name: "Compact Washer 5kg (Small Family)", 
      cat: "Appliances", 
      sub: "Washing Machine", 
      price: 899, 
      deposit: 2700,
      brand: "Godrej",
      desc: "5kg compact front load washer perfect for small families and apartments. Dimensions: 75cm x 50cm x 50cm.",
      city: "All India",
      availableCities: ["Delhi", "Mumbai", "Bangalore", "Kolkata", "Hyderabad", "Pune"]
    },
    
    // TVS (5) - With Real Data
    { 
      name: "Samsung 43-inch 4K Ultra HD Smart TV", 
      cat: "Appliances", 
      sub: "TV", 
      price: 1599, 
      deposit: 4800,
      brand: "Samsung",
      desc: "43-inch 4K Ultra HD Smart TV with HDR and Tizen OS. 3 HDMI ports, 2 USB ports. Dimensions: 96cm x 56cm x 6cm.",
      city: "All India",
      availableCities: ["Delhi", "Mumbai", "Bangalore", "Kolkata", "Hyderabad", "Pune", "Chennai"]
    },
    { 
      name: "LG 55-inch QLED 4K TV", 
      cat: "Appliances", 
      sub: "TV", 
      price: 2499, 
      deposit: 7500,
      brand: "LG",
      desc: "55-inch QLED 4K TV with webOS and AI ThinQ. 4 HDMI ports, 3 USB ports. Dimensions: 123cm x 71cm x 5cm.",
      city: "All India",
      availableCities: ["Delhi", "Mumbai", "Bangalore", "Kolkata", "Hyderabad", "Pune", "Chennai"]
    },
    { 
      name: "Sony 32-inch HD Ready LED TV", 
      cat: "Appliances", 
      sub: "TV", 
      price: 999, 
      deposit: 3000,
      brand: "Sony",
      desc: "32-inch HD Ready LED TV with Google TV. 2 HDMI ports, 2 USB ports. Dimensions: 73cm x 43cm x 5cm.",
      city: "All India",
      availableCities: ["Delhi", "Mumbai", "Bangalore", "Kolkata", "Hyderabad", "Pune"]
    },
    { 
      name: "OnePlus 65-inch OLED 4K Smart TV", 
      cat: "Appliances", 
      sub: "TV", 
      price: 3999, 
      deposit: 12000,
      brand: "OnePlus",
      desc: "65-inch OLED 4K Smart TV with Android TV OS. 4 HDMI ports, 3 USB ports. Dimensions: 145cm x 83cm x 5cm.",
      city: "Mumbai",
      availableCities: ["Mumbai", "Delhi", "Bangalore", "Pune"]
    },
    { 
      name: "Mi 50-inch Android 4K TV", 
      cat: "Appliances", 
      sub: "TV", 
      price: 1899, 
      deposit: 5700,
      brand: "Xiaomi",
      desc: "50-inch Android 4K Smart TV with built-in Chromecast. 3 HDMI ports, 2 USB ports. Dimensions: 112cm x 65cm x 5cm.",
      city: "All India",
      availableCities: ["Delhi", "Mumbai", "Bangalore", "Kolkata", "Hyderabad", "Pune", "Chennai"]
    },
    
    // ACs (5) - With Real Data
    { 
      name: "1.5 Ton 5-Star Inverter AC with Wi-Fi", 
      cat: "Appliances", 
      sub: "AC", 
      price: 1899, 
      deposit: 5700,
      brand: "LG",
      desc: "1.5 ton 5-star inverter AC with Wi-Fi control and anti-bacterial filter. Covers 180 sq ft. Dimensions: 100cm x 30cm x 20cm.",
      city: "All India",
      availableCities: ["Delhi", "Mumbai", "Bangalore", "Kolkata", "Hyderabad", "Pune", "Chennai"]
    },
    { 
      name: "1 Ton Split AC with Anti-Dust Filter", 
      cat: "Appliances", 
      sub: "AC", 
      price: 1499, 
      deposit: 4500,
      brand: "Samsung",
      desc: "1 ton split AC with anti-dust filter and 5-star energy rating. Covers 120 sq ft. Dimensions: 80cm x 25cm x 20cm.",
      city: "All India",
      availableCities: ["Delhi", "Mumbai", "Bangalore", "Kolkata", "Hyderabad", "Pune"]
    },
    { 
      name: "2 Ton Window AC with Remote Control", 
      cat: "Appliances", 
      sub: "AC", 
      price: 2199, 
      deposit: 6600,
      brand: "Voltas",
      desc: "2 ton window AC with remote control and 5-star energy rating. Covers 250 sq ft. Dimensions: 65cm x 40cm x 70cm.",
      city: "All India",
      availableCities: ["Delhi", "Mumbai", "Bangalore", "Kolkata", "Hyderabad", "Pune", "Chennai"]
    },
    { 
      name: "Smart Wi-Fi AC 1.5 Ton with Voice Control", 
      cat: "Appliances", 
      sub: "AC", 
      price: 2399, 
      deposit: 7200,
      brand: "Daikin",
      desc: "1.5 ton smart Wi-Fi AC with Google Assistant and Alexa control. 5-star rating. Covers 180 sq ft.",
      city: "Delhi",
      availableCities: ["Delhi", "Mumbai", "Bangalore"]
    },
    { 
      name: "Portable AC 1 Ton (No Installation)", 
      cat: "Appliances", 
      sub: "AC", 
      price: 1699, 
      deposit: 5100,
      brand: "PortableCool",
      desc: "1 ton portable AC with easy no-install setup. Covers 120 sq ft. Includes remote control. Dimensions: 45cm x 35cm x 70cm.",
      city: "All India",
      availableCities: ["Delhi", "Mumbai", "Bangalore", "Kolkata", "Hyderabad", "Pune", "Chennai"]
    },
    
    // MICROWAVES (5) - With Real Data
    { 
      name: "Samsung 28L Convection Microwave Oven", 
      cat: "Appliances", 
      sub: "Microwave", 
      price: 1099, 
      deposit: 3300,
      brand: "Samsung",
      desc: "28L convection microwave oven with 6 auto-cook menus. 1000W power. Dimensions: 50cm x 45cm x 30cm.",
      city: "All India",
      availableCities: ["Delhi", "Mumbai", "Bangalore", "Kolkata", "Hyderabad", "Pune", "Chennai"]
    },
    { 
      name: "LG 20L Solo Microwave Oven", 
      cat: "Appliances", 
      sub: "Microwave", 
      price: 599, 
      deposit: 1800,
      brand: "LG",
      desc: "20L solo microwave oven with 5 power levels. 700W power. Dimensions: 45cm x 35cm x 25cm.",
      city: "All India",
      availableCities: ["Delhi", "Mumbai", "Bangalore", "Kolkata", "Hyderabad", "Pune"]
    },
    { 
      name: "Panasonic 23L Grill Microwave with Sensor", 
      cat: "Appliances", 
      sub: "Microwave", 
      price: 999, 
      deposit: 3000,
      brand: "Panasonic",
      desc: "23L grill microwave with sensor reheat and 5 auto-cook menus. 800W power. Dimensions: 48cm x 40cm x 28cm.",
      city: "All India",
      availableCities: ["Delhi", "Mumbai", "Bangalore", "Kolkata", "Hyderabad", "Pune", "Chennai"]
    },
    { 
      name: "IFB 25L Inverter Microwave with Convection", 
      cat: "Appliances", 
      sub: "Microwave", 
      price: 1299, 
      deposit: 3900,
      brand: "IFB",
      desc: "25L inverter microwave with convection and 10 auto-cook menus. 900W power. Dimensions: 50cm x 42cm x 30cm.",
      city: "Mumbai",
      availableCities: ["Mumbai", "Delhi", "Bangalore", "Pune"]
    },
    { 
      name: "Whirlpool 30L Convection Microwave with Crust", 
      cat: "Appliances", 
      sub: "Microwave", 
      price: 1499, 
      deposit: 4500,
      brand: "Whirlpool",
      desc: "30L convection microwave with crust technology and 8 auto-cook menus. 1200W power. Dimensions: 55cm x 45cm x 32cm.",
      city: "All India",
      availableCities: ["Delhi", "Mumbai", "Bangalore", "Kolkata", "Hyderabad", "Pune", "Chennai"]
    }
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
      description: p.desc,
      monthlyRent: p.price,
      securityDeposit: p.deposit,
      rentalTenureOptions: [1, 3, 6, 12],
      images: [imgUrl, imgUrl, imgUrl],
      quantity: 15,
      availableQuantity: 15,
      brand: p.brand,
      condition: 'good',
      specifications: { brand: p.brand, material: 'High Quality', warranty: '2 years' },
      rating: (4 + Math.random() * 0.8).toFixed(1),
      numReviews: Math.floor(Math.random() * 200) + 50,
      isAvailable: true,
      // ========== NEW CITY FIELDS ==========
      city: p.city,
      availableCities: p.availableCities,
      deliveryCharge: 0
    });
    console.log(`✅ Added: ${p.name} (${p.city})`);
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