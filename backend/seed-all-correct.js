const mongoose = require('mongoose');
require('dotenv').config();

async function seedAll() {
  await mongoose.connect(process.env.MONGODB_URI);
  const db = mongoose.connection.db;
  
  console.log('✅ Connected to MongoDB\n');
  
  // Clear ALL existing products
  const deleted = await db.collection('products').deleteMany({});
  console.log(`🗑️ Cleared ${deleted.deletedCount} existing products\n`);
  
  // ========== VALID CITIES (Must match Product model enum) ==========
  const VALID_CITIES = ['Delhi', 'Mumbai', 'Bangalore', 'Kolkata', 'Chennai', 'Hyderabad', 'Pune'];
  
  // ========== 5 PRODUCTS PER CITY ==========
  const cityProducts = [
    // ===== DELHI PRODUCTS (5) =====
    { 
      name: "Premium King Size Wooden Bed with Storage", 
      cat: "Furniture", 
      sub: "Bed", 
      price: 1899, 
      deposit: 5700,
      brand: "WoodCraft",
      desc: "King size bed with hydraulic storage, solid sheesham wood construction. Dimensions: 200cm x 190cm x 90cm.",
      city: "Delhi",
      availableCities: ["Delhi", "Mumbai", "Bangalore", "Pune"],
      outOfCityDeliveryCharge: 299
    },
    { 
      name: "3-Seater Leather Sofa Set", 
      cat: "Furniture", 
      sub: "Sofa", 
      price: 3499, 
      deposit: 10500,
      brand: "LuxuryHome",
      desc: "Premium 3-seater leather sofa with high-resilience foam cushions.",
      city: "Delhi",
      availableCities: ["Delhi", "Mumbai", "Bangalore", "Pune"],
      outOfCityDeliveryCharge: 299
    },
    { 
      name: "6-Seater Wooden Dining Table Set", 
      cat: "Furniture", 
      sub: "Table", 
      price: 1899, 
      deposit: 5700,
      brand: "WoodCraft",
      desc: "6-seater dining table set with 6 cushioned chairs. Solid wood construction.",
      city: "Delhi",
      availableCities: ["Delhi", "Mumbai", "Bangalore", "Pune"],
      outOfCityDeliveryCharge: 299
    },
    { 
      name: "Ergonomic Office Chair with Lumbar Support", 
      cat: "Furniture", 
      sub: "Chair", 
      price: 899, 
      deposit: 2700,
      brand: "ComfortSeat",
      desc: "Ergonomic office chair with adjustable height, lumbar support, and armrests.",
      city: "Delhi",
      availableCities: ["Delhi", "Mumbai", "Bangalore", "Pune"],
      outOfCityDeliveryCharge: 199
    },
    { 
      name: "3-Door Wooden Wardrobe with Mirror", 
      cat: "Furniture", 
      sub: "Wardrobe", 
      price: 2499, 
      deposit: 7500,
      brand: "WoodCraft",
      desc: "3-door wooden wardrobe with full-length mirror and 2 drawers.",
      city: "Delhi",
      availableCities: ["Delhi", "Mumbai", "Bangalore", "Pune"],
      outOfCityDeliveryCharge: 299
    },
    
    // ===== MUMBAI PRODUCTS (5) =====
    { 
      name: "Queen Size Upholstered Bed with Headboard", 
      cat: "Furniture", 
      sub: "Bed", 
      price: 1599, 
      deposit: 4800,
      brand: "SleepWell",
      desc: "Premium queen size bed with tufted headboard and sturdy wooden frame.",
      city: "Mumbai",
      availableCities: ["Mumbai", "Delhi", "Pune", "Bangalore"],
      outOfCityDeliveryCharge: 399
    },
    { 
      name: "L-Shape Fabric Sofa (4 Seater)", 
      cat: "Furniture", 
      sub: "Sofa", 
      price: 3999, 
      deposit: 12000,
      brand: "UrbanLivin",
      desc: "L-shaped 4-seater fabric sofa with chaise lounge. Machine-washable covers.",
      city: "Mumbai",
      availableCities: ["Mumbai", "Delhi", "Pune", "Bangalore"],
      outOfCityDeliveryCharge: 399
    },
    { 
      name: "Modern Coffee Table with Storage", 
      cat: "Furniture", 
      sub: "Table", 
      price: 999, 
      deposit: 3000,
      brand: "UrbanLivin",
      desc: "Modern coffee table with two drawers and shelf. High-gloss finish.",
      city: "Mumbai",
      availableCities: ["Mumbai", "Delhi", "Pune", "Bangalore"],
      outOfCityDeliveryCharge: 299
    },
    { 
      name: "Wooden Dining Chair (Set of 2)", 
      cat: "Furniture", 
      sub: "Chair", 
      price: 499, 
      deposit: 1500,
      brand: "WoodCraft",
      desc: "Set of 2 solid wooden dining chairs with comfortable curved backrest.",
      city: "Mumbai",
      availableCities: ["Mumbai", "Delhi", "Pune", "Bangalore"],
      outOfCityDeliveryCharge: 299
    },
    { 
      name: "Sliding Door Wardrobe with 4 Doors", 
      cat: "Furniture", 
      sub: "Wardrobe", 
      price: 2899, 
      deposit: 8700,
      brand: "SpaceSaver",
      desc: "4-door sliding wardrobe with 6 shelves and hanging section.",
      city: "Mumbai",
      availableCities: ["Mumbai", "Delhi", "Pune", "Bangalore"],
      outOfCityDeliveryCharge: 399
    },
    
    // ===== BANGALORE PRODUCTS (5) =====
    { 
      name: "Double Storage Bed with Hydraulic Lift", 
      cat: "Furniture", 
      sub: "Bed", 
      price: 2199, 
      deposit: 6600,
      brand: "SpaceSaver",
      desc: "Double bed with hydraulic storage mechanism. Premium high-gloss finish.",
      city: "Bangalore",
      availableCities: ["Bangalore", "Hyderabad", "Chennai", "Mumbai"],
      outOfCityDeliveryCharge: 399
    },
    { 
      name: "2-Seater Loveseat with Storage", 
      cat: "Furniture", 
      sub: "Sofa", 
      price: 1899, 
      deposit: 5700,
      brand: "SpaceSaver",
      desc: "Compact 2-seater loveseat with hidden storage in armrests.",
      city: "Bangalore",
      availableCities: ["Bangalore", "Hyderabad", "Chennai", "Mumbai"],
      outOfCityDeliveryCharge: 299
    },
    { 
      name: "Premium Center Table with Glass Top", 
      cat: "Furniture", 
      sub: "Table", 
      price: 1199, 
      deposit: 3600,
      brand: "GlassHouse",
      desc: "Elegant center table with tempered glass top and wooden base.",
      city: "Bangalore",
      availableCities: ["Bangalore", "Hyderabad", "Chennai", "Mumbai"],
      outOfCityDeliveryCharge: 299
    },
    { 
      name: "Rocking Chair with Cushion", 
      cat: "Furniture", 
      sub: "Chair", 
      price: 799, 
      deposit: 2400,
      brand: "RelaxLife",
      desc: "Comfortable rocking chair with removable cushion. Solid teak wood construction.",
      city: "Bangalore",
      availableCities: ["Bangalore", "Hyderabad", "Chennai", "Mumbai"],
      outOfCityDeliveryCharge: 299
    },
    { 
      name: "4-Door Premium Wooden Wardrobe", 
      cat: "Furniture", 
      sub: "Wardrobe", 
      price: 3299, 
      deposit: 9900,
      brand: "WoodCraft",
      desc: "Premium 4-door wardrobe with 4 drawers, hanging rods, and shoe rack.",
      city: "Bangalore",
      availableCities: ["Bangalore", "Hyderabad", "Chennai", "Mumbai"],
      outOfCityDeliveryCharge: 399
    },
    
    // ===== KOLKATA PRODUCTS (5) =====
    { 
      name: "Premium Bunk Bed with Study Desk", 
      cat: "Furniture", 
      sub: "Bed", 
      price: 2499, 
      deposit: 7500,
      brand: "StudyNest",
      desc: "Bunk bed with built-in study desk and bookshelf. Ideal for students.",
      city: "Kolkata",
      availableCities: ["Kolkata", "Delhi", "Mumbai", "Bangalore"],
      outOfCityDeliveryCharge: 499
    },
    { 
      name: "Sofa Cum Bed (3-in-1)", 
      cat: "Furniture", 
      sub: "Sofa", 
      price: 3299, 
      deposit: 9900,
      brand: "SleepSofa",
      desc: "Multi-functional sofa cum bed. Converts to a comfortable double bed.",
      city: "Kolkata",
      availableCities: ["Kolkata", "Delhi", "Mumbai", "Bangalore"],
      outOfCityDeliveryCharge: 499
    },
    { 
      name: "Console Table with Mirror", 
      cat: "Furniture", 
      sub: "Table", 
      price: 1499, 
      deposit: 4500,
      brand: "WoodCraft",
      desc: "Stylish console table with wall-mounted mirror. Perfect for entryways.",
      city: "Kolkata",
      availableCities: ["Kolkata", "Delhi", "Mumbai", "Bangalore"],
      outOfCityDeliveryCharge: 499
    },
    { 
      name: "Gaming Chair with Neck Support", 
      cat: "Furniture", 
      sub: "Chair", 
      price: 1299, 
      deposit: 3900,
      brand: "GameSeat",
      desc: "Professional gaming chair with 4D adjustable armrests and backrest.",
      city: "Kolkata",
      availableCities: ["Kolkata", "Delhi", "Mumbai", "Bangalore"],
      outOfCityDeliveryCharge: 499
    },
    { 
      name: "Corner Wardrobe for Small Spaces", 
      cat: "Furniture", 
      sub: "Wardrobe", 
      price: 1999, 
      deposit: 6000,
      brand: "SpaceSaver",
      desc: "Space-saving corner wardrobe with triangular design.",
      city: "Kolkata",
      availableCities: ["Kolkata", "Delhi", "Mumbai", "Bangalore"],
      outOfCityDeliveryCharge: 499
    },
    
    // ===== CHENNAI PRODUCTS (5) =====
    { 
      name: "Single Wooden Bed with Underbed Storage", 
      cat: "Furniture", 
      sub: "Bed", 
      price: 899, 
      deposit: 2700,
      brand: "WoodCraft",
      desc: "Space-saving single bed with 3 drawers for storage.",
      city: "Chennai",
      availableCities: ["Chennai", "Bangalore", "Hyderabad", "Mumbai"],
      outOfCityDeliveryCharge: 499
    },
    { 
      name: "Single Seater Premium Recliner", 
      cat: "Furniture", 
      sub: "Sofa", 
      price: 4499, 
      deposit: 13500,
      brand: "ReclinerWorld",
      desc: "Luxurious single seater recliner with swivel base. PU leather upholstery.",
      city: "Chennai",
      availableCities: ["Chennai", "Bangalore", "Hyderabad", "Mumbai"],
      outOfCityDeliveryCharge: 499
    },
    { 
      name: "Adjustable Height Study Table", 
      cat: "Furniture", 
      sub: "Table", 
      price: 799, 
      deposit: 2400,
      brand: "StudyNest",
      desc: "Adjustable height study table with tiltable top. Built-in cable management.",
      city: "Chennai",
      availableCities: ["Chennai", "Bangalore", "Hyderabad", "Mumbai"],
      outOfCityDeliveryCharge: 499
    },
    { 
      name: "Accent Chair with Gold Legs", 
      cat: "Furniture", 
      sub: "Chair", 
      price: 699, 
      deposit: 2100,
      brand: "LuxuryHome",
      desc: "Elegant accent chair with gold-finished metal legs and velvet upholstery.",
      city: "Chennai",
      availableCities: ["Chennai", "Bangalore", "Hyderabad", "Mumbai"],
      outOfCityDeliveryCharge: 499
    },
    { 
      name: "Portable Closet with Wheels", 
      cat: "Furniture", 
      sub: "Wardrobe", 
      price: 999, 
      deposit: 3000,
      brand: "EasyMove",
      desc: "Lightweight portable closet with wheels and hanging rod.",
      city: "Chennai",
      availableCities: ["Chennai", "Bangalore", "Hyderabad", "Mumbai"],
      outOfCityDeliveryCharge: 499
    },
    
    // ===== HYDERABAD PRODUCTS (5) =====
    { 
      name: "Premium Wooden Bed with Hydraulic Storage", 
      cat: "Furniture", 
      sub: "Bed", 
      price: 1799, 
      deposit: 5400,
      brand: "WoodCraft",
      desc: "Premium wooden bed with hydraulic storage. Solid sheesham wood construction.",
      city: "Hyderabad",
      availableCities: ["Hyderabad", "Bangalore", "Chennai", "Mumbai"],
      outOfCityDeliveryCharge: 399
    },
    { 
      name: "Premium Fabric Sofa (3 Seater)", 
      cat: "Furniture", 
      sub: "Sofa", 
      price: 2899, 
      deposit: 8700,
      brand: "LuxuryHome",
      desc: "Premium 3-seater fabric sofa with high-resilience foam cushions.",
      city: "Hyderabad",
      availableCities: ["Hyderabad", "Bangalore", "Chennai", "Mumbai"],
      outOfCityDeliveryCharge: 399
    },
    { 
      name: "Wooden Dining Table (4 Seater)", 
      cat: "Furniture", 
      sub: "Table", 
      price: 1299, 
      deposit: 3900,
      brand: "WoodCraft",
      desc: "4-seater wooden dining table with solid wood construction.",
      city: "Hyderabad",
      availableCities: ["Hyderabad", "Bangalore", "Chennai", "Mumbai"],
      outOfCityDeliveryCharge: 399
    },
    { 
      name: "Executive Office Chair", 
      cat: "Furniture", 
      sub: "Chair", 
      price: 1099, 
      deposit: 3300,
      brand: "ComfortSeat",
      desc: "Executive office chair with premium leather and ergonomic design.",
      city: "Hyderabad",
      availableCities: ["Hyderabad", "Bangalore", "Chennai", "Mumbai"],
      outOfCityDeliveryCharge: 399
    },
    { 
      name: "Premium Wardrobe with Mirror", 
      cat: "Furniture", 
      sub: "Wardrobe", 
      price: 2799, 
      deposit: 8400,
      brand: "SpaceSaver",
      desc: "Premium wardrobe with full-length mirror and multiple storage options.",
      city: "Hyderabad",
      availableCities: ["Hyderabad", "Bangalore", "Chennai", "Mumbai"],
      outOfCityDeliveryCharge: 399
    },
    
    // ===== PUNE PRODUCTS (5) =====
    { 
      name: "Comfort Queen Bed with Storage", 
      cat: "Furniture", 
      sub: "Bed", 
      price: 1699, 
      deposit: 5100,
      brand: "SleepWell",
      desc: "Comfort queen bed with storage drawers. Perfect for modern homes.",
      city: "Pune",
      availableCities: ["Pune", "Mumbai", "Delhi", "Bangalore"],
      outOfCityDeliveryCharge: 299
    },
    { 
      name: "Modern Fabric Sofa (L-Shape)", 
      cat: "Furniture", 
      sub: "Sofa", 
      price: 3699, 
      deposit: 11100,
      brand: "UrbanLivin",
      desc: "Modern L-shape fabric sofa with premium cushioning.",
      city: "Pune",
      availableCities: ["Pune", "Mumbai", "Delhi", "Bangalore"],
      outOfCityDeliveryCharge: 299
    },
    { 
      name: "Study Table with Bookshelf", 
      cat: "Furniture", 
      sub: "Table", 
      price: 899, 
      deposit: 2700,
      brand: "StudyNest",
      desc: "Study table with built-in bookshelf and storage compartments.",
      city: "Pune",
      availableCities: ["Pune", "Mumbai", "Delhi", "Bangalore"],
      outOfCityDeliveryCharge: 299
    },
    { 
      name: "Dining Chair Set (4 pieces)", 
      cat: "Furniture", 
      sub: "Chair", 
      price: 899, 
      deposit: 2700,
      brand: "WoodCraft",
      desc: "Set of 4 premium wooden dining chairs with comfortable seating.",
      city: "Pune",
      availableCities: ["Pune", "Mumbai", "Delhi", "Bangalore"],
      outOfCityDeliveryCharge: 299
    },
    { 
      name: "Sliding Wardrobe with Mirror", 
      cat: "Furniture", 
      sub: "Wardrobe", 
      price: 2599, 
      deposit: 7800,
      brand: "SpaceSaver",
      desc: "Spacious sliding wardrobe with mirror and multiple shelves.",
      city: "Pune",
      availableCities: ["Pune", "Mumbai", "Delhi", "Bangalore"],
      outOfCityDeliveryCharge: 299
    }
  ];
  
  // ========== ALL INDIA PRODUCTS (Remaining) ==========
  const allIndiaProducts = [
    // BEDS
    { 
      name: "King Size Wooden Bed with Storage (All India)", 
      cat: "Furniture", 
      sub: "Bed", 
      price: 1899, 
      deposit: 5700,
      brand: "WoodCraft",
      desc: "King size bed with hydraulic storage. Available all across India.",
      city: "All India",
      availableCities: VALID_CITIES,
      outOfCityDeliveryCharge: 299
    },
    { 
      name: "Queen Size Bed with Headboard (All India)", 
      cat: "Furniture", 
      sub: "Bed", 
      price: 1599, 
      deposit: 4800,
      brand: "SleepWell",
      desc: "Queen size bed with tufted headboard. Available all across India.",
      city: "All India",
      availableCities: VALID_CITIES,
      outOfCityDeliveryCharge: 299
    },
    { 
      name: "Single Bed with Underbed Storage (All India)", 
      cat: "Furniture", 
      sub: "Bed", 
      price: 899, 
      deposit: 2700,
      brand: "WoodCraft",
      desc: "Single bed with underbed storage. Available all across India.",
      city: "All India",
      availableCities: VALID_CITIES,
      outOfCityDeliveryCharge: 299
    },
    
    // SOFAS
    { 
      name: "3-Seater Leather Sofa (All India)", 
      cat: "Furniture", 
      sub: "Sofa", 
      price: 3499, 
      deposit: 10500,
      brand: "LuxuryHome",
      desc: "3-seater leather sofa. Available all across India.",
      city: "All India",
      availableCities: VALID_CITIES,
      outOfCityDeliveryCharge: 299
    },
    { 
      name: "2-Seater Loveseat with Storage (All India)", 
      cat: "Furniture", 
      sub: "Sofa", 
      price: 1899, 
      deposit: 5700,
      brand: "SpaceSaver",
      desc: "2-seater loveseat with storage. Available all across India.",
      city: "All India",
      availableCities: VALID_CITIES,
      outOfCityDeliveryCharge: 299
    },
    { 
      name: "Sofa Cum Bed 3-in-1 (All India)", 
      cat: "Furniture", 
      sub: "Sofa", 
      price: 3299, 
      deposit: 9900,
      brand: "SleepSofa",
      desc: "Sofa cum bed 3-in-1. Available all across India.",
      city: "All India",
      availableCities: VALID_CITIES,
      outOfCityDeliveryCharge: 299
    },
    { 
      name: "Single Seater Premium Recliner (All India)", 
      cat: "Furniture", 
      sub: "Sofa", 
      price: 4499, 
      deposit: 13500,
      brand: "ReclinerWorld",
      desc: "Single seater premium recliner. Available all across India.",
      city: "All India",
      availableCities: VALID_CITIES,
      outOfCityDeliveryCharge: 499
    },
    
    // TABLES
    { 
      name: "6-Seater Dining Table Set (All India)", 
      cat: "Furniture", 
      sub: "Table", 
      price: 1899, 
      deposit: 5700,
      brand: "WoodCraft",
      desc: "6-seater dining table set. Available all across India.",
      city: "All India",
      availableCities: VALID_CITIES,
      outOfCityDeliveryCharge: 299
    },
    { 
      name: "Modern Coffee Table (All India)", 
      cat: "Furniture", 
      sub: "Table", 
      price: 999, 
      deposit: 3000,
      brand: "UrbanLivin",
      desc: "Modern coffee table with storage. Available all across India.",
      city: "All India",
      availableCities: VALID_CITIES,
      outOfCityDeliveryCharge: 299
    },
    { 
      name: "Premium Center Table Glass Top (All India)", 
      cat: "Furniture", 
      sub: "Table", 
      price: 1199, 
      deposit: 3600,
      brand: "GlassHouse",
      desc: "Premium center table with glass top. Available all across India.",
      city: "All India",
      availableCities: VALID_CITIES,
      outOfCityDeliveryCharge: 299
    },
    
    // CHAIRS
    { 
      name: "Ergonomic Office Chair (All India)", 
      cat: "Furniture", 
      sub: "Chair", 
      price: 899, 
      deposit: 2700,
      brand: "ComfortSeat",
      desc: "Ergonomic office chair with lumbar support. Available all across India.",
      city: "All India",
      availableCities: VALID_CITIES,
      outOfCityDeliveryCharge: 199
    },
    { 
      name: "Wooden Dining Chair Set of 2 (All India)", 
      cat: "Furniture", 
      sub: "Chair", 
      price: 499, 
      deposit: 1500,
      brand: "WoodCraft",
      desc: "Set of 2 wooden dining chairs. Available all across India.",
      city: "All India",
      availableCities: VALID_CITIES,
      outOfCityDeliveryCharge: 299
    },
    { 
      name: "Rocking Chair with Cushion (All India)", 
      cat: "Furniture", 
      sub: "Chair", 
      price: 799, 
      deposit: 2400,
      brand: "RelaxLife",
      desc: "Rocking chair with cushion. Available all across India.",
      city: "All India",
      availableCities: VALID_CITIES,
      outOfCityDeliveryCharge: 299
    },
    { 
      name: "Gaming Chair with Neck Support (All India)", 
      cat: "Furniture", 
      sub: "Chair", 
      price: 1299, 
      deposit: 3900,
      brand: "GameSeat",
      desc: "Gaming chair with neck support. Available all across India.",
      city: "All India",
      availableCities: VALID_CITIES,
      outOfCityDeliveryCharge: 299
    },
    
    // WARDROBES
    { 
      name: "3-Door Wooden Wardrobe (All India)", 
      cat: "Furniture", 
      sub: "Wardrobe", 
      price: 2499, 
      deposit: 7500,
      brand: "WoodCraft",
      desc: "3-door wooden wardrobe with mirror. Available all across India.",
      city: "All India",
      availableCities: VALID_CITIES,
      outOfCityDeliveryCharge: 299
    },
    { 
      name: "Sliding Door Wardrobe 4 Doors (All India)", 
      cat: "Furniture", 
      sub: "Wardrobe", 
      price: 2899, 
      deposit: 8700,
      brand: "SpaceSaver",
      desc: "4-door sliding wardrobe. Available all across India.",
      city: "All India",
      availableCities: VALID_CITIES,
      outOfCityDeliveryCharge: 399
    },
    { 
      name: "4-Door Premium Wooden Wardrobe (All India)", 
      cat: "Furniture", 
      sub: "Wardrobe", 
      price: 3299, 
      deposit: 9900,
      brand: "WoodCraft",
      desc: "4-door premium wooden wardrobe. Available all across India.",
      city: "All India",
      availableCities: VALID_CITIES,
      outOfCityDeliveryCharge: 299
    },
    { 
      name: "Portable Closet with Wheels (All India)", 
      cat: "Furniture", 
      sub: "Wardrobe", 
      price: 999, 
      deposit: 3000,
      brand: "EasyMove",
      desc: "Portable closet with wheels. Available all across India.",
      city: "All India",
      availableCities: VALID_CITIES,
      outOfCityDeliveryCharge: 299
    },
    
    // APPLIANCES - All India
    { 
      name: "Double Door Refrigerator 340L (All India)", 
      cat: "Appliances", 
      sub: "Fridge", 
      price: 1599, 
      deposit: 4800,
      brand: "Whirlpool",
      desc: "Double door refrigerator 340L. Available all across India.",
      city: "All India",
      availableCities: VALID_CITIES,
      outOfCityDeliveryCharge: 399
    },
    { 
      name: "Single Door Refrigerator 190L (All India)", 
      cat: "Appliances", 
      sub: "Fridge", 
      price: 999, 
      deposit: 3000,
      brand: "LG",
      desc: "Single door refrigerator 190L. Available all across India.",
      city: "All India",
      availableCities: VALID_CITIES,
      outOfCityDeliveryCharge: 299
    },
    { 
      name: "Front Load Washing Machine 7kg (All India)", 
      cat: "Appliances", 
      sub: "Washing Machine", 
      price: 1399, 
      deposit: 4200,
      brand: "Samsung",
      desc: "Front load washing machine 7kg. Available all across India.",
      city: "All India",
      availableCities: VALID_CITIES,
      outOfCityDeliveryCharge: 399
    },
    { 
      name: "Top Load Washing Machine 8kg (All India)", 
      cat: "Appliances", 
      sub: "Washing Machine", 
      price: 1199, 
      deposit: 3600,
      brand: "LG",
      desc: "Top load washing machine 8kg. Available all across India.",
      city: "All India",
      availableCities: VALID_CITIES,
      outOfCityDeliveryCharge: 299
    },
    { 
      name: "Samsung 43-inch 4K Smart TV (All India)", 
      cat: "Appliances", 
      sub: "TV", 
      price: 1599, 
      deposit: 4800,
      brand: "Samsung",
      desc: "43-inch 4K Smart TV. Available all across India.",
      city: "All India",
      availableCities: VALID_CITIES,
      outOfCityDeliveryCharge: 299
    },
    { 
      name: "LG 55-inch QLED 4K TV (All India)", 
      cat: "Appliances", 
      sub: "TV", 
      price: 2499, 
      deposit: 7500,
      brand: "LG",
      desc: "55-inch QLED 4K TV. Available all across India.",
      city: "All India",
      availableCities: VALID_CITIES,
      outOfCityDeliveryCharge: 399
    },
    { 
      name: "1.5 Ton 5-Star Inverter AC (All India)", 
      cat: "Appliances", 
      sub: "AC", 
      price: 1899, 
      deposit: 5700,
      brand: "LG",
      desc: "1.5 ton 5-star inverter AC. Available all across India.",
      city: "All India",
      availableCities: VALID_CITIES,
      outOfCityDeliveryCharge: 399
    },
    { 
      name: "1 Ton Split AC (All India)", 
      cat: "Appliances", 
      sub: "AC", 
      price: 1499, 
      deposit: 4500,
      brand: "Samsung",
      desc: "1 ton split AC. Available all across India.",
      city: "All India",
      availableCities: VALID_CITIES,
      outOfCityDeliveryCharge: 299
    },
    { 
      name: "Samsung 28L Convection Microwave (All India)", 
      cat: "Appliances", 
      sub: "Microwave", 
      price: 1099, 
      deposit: 3300,
      brand: "Samsung",
      desc: "28L convection microwave oven. Available all across India.",
      city: "All India",
      availableCities: VALID_CITIES,
      outOfCityDeliveryCharge: 299
    },
    { 
      name: "LG 20L Solo Microwave Oven (All India)", 
      cat: "Appliances", 
      sub: "Microwave", 
      price: 599, 
      deposit: 1800,
      brand: "LG",
      desc: "20L solo microwave oven. Available all across India.",
      city: "All India",
      availableCities: VALID_CITIES,
      outOfCityDeliveryCharge: 199
    },
    { 
      name: "Panasonic 23L Grill Microwave (All India)", 
      cat: "Appliances", 
      sub: "Microwave", 
      price: 999, 
      deposit: 3000,
      brand: "Panasonic",
      desc: "23L grill microwave with sensor. Available all across India.",
      city: "All India",
      availableCities: VALID_CITIES,
      outOfCityDeliveryCharge: 299
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
  
  // Combine all products
  const allProducts = [...cityProducts, ...allIndiaProducts];
  let count = 0;
  
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
      city: p.city,
      availableCities: p.availableCities,
      deliveryCharge: 0,
      outOfCityDeliveryCharge: p.outOfCityDeliveryCharge || 299
    });
    count++;
    console.log(`✅ [${count}/${allProducts.length}] ${p.name} (${p.city}) - ${p.availableCities.length} cities - Out of city: ₹${p.outOfCityDeliveryCharge || 299}`);
  }
  
  // Final verification
  const total = await db.collection('products').countDocuments();
  const cityCounts = await db.collection('products').aggregate([
    { $group: { _id: '$city', count: { $sum: 1 } } }
  ]).toArray();
  
  console.log(`\n📊 FINAL COUNTS:`);
  console.log(`   Total Products: ${total}`);
  console.log(`\n🏙️ CITY DISTRIBUTION:`);
  const expectedCities = ['Delhi', 'Mumbai', 'Bangalore', 'Kolkata', 'Chennai', 'Hyderabad', 'Pune', 'All India'];
  cityCounts.forEach(c => {
    const expected = expectedCities.includes(c._id) ? '✅' : '⚠️';
    console.log(`   ${expected} ${c._id}: ${c.count} products`);
  });
  
  console.log('\n🎉 ALL PRODUCTS ADDED SUCCESSFULLY WITH DELIVERY CHARGES!\n');
  console.log('📝 Delivery Charge Logic:');
  console.log('   - If user\'s city matches product city → Free delivery (₹0)');
  console.log('   - If user\'s city is in availableCities → Free delivery (₹0)');
  console.log('   - If user\'s city is NOT in availableCities → outOfCityDeliveryCharge applies');
  console.log('\n📝 Valid Cities (from Product model enum):');
  console.log(`   ${VALID_CITIES.join(', ')}`);
  
  process.exit(0);
}

seedAll();