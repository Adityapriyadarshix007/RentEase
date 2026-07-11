const mongoose = require('mongoose');
require('dotenv').config();

async function createIndexes() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');
    
    const db = mongoose.connection.db;
    const collection = db.collection('products');
    
    // List all existing indexes
    const existingIndexes = await collection.indexes();
    console.log('📋 Existing indexes:', existingIndexes.map(i => i.name));
    
    // Create indexes
    console.log('\n🔨 Creating indexes...');
    
    // Single field indexes
    await collection.createIndex({ name: 1 });
    await collection.createIndex({ category: 1 });
    await collection.createIndex({ subCategory: 1 });
    await collection.createIndex({ monthlyRent: 1 });
    await collection.createIndex({ rating: -1 });
    await collection.createIndex({ availableQuantity: 1 });
    await collection.createIndex({ isAvailable: 1 });
    await collection.createIndex({ createdAt: -1 });
    await collection.createIndex({ city: 1 });
    await collection.createIndex({ brand: 1 });
    
    // Compound indexes for common queries
    await collection.createIndex({ category: 1, city: 1 });
    await collection.createIndex({ subCategory: 1, city: 1 });
    await collection.createIndex({ monthlyRent: 1, city: 1 });
    await collection.createIndex({ rating: -1, city: 1 });
    await collection.createIndex({ createdAt: -1, city: 1 });
    
    // Text search index
    await collection.createIndex(
      { name: 'text', description: 'text', brand: 'text' },
      { weights: { name: 10, brand: 5, description: 1 } }
    );
    
    console.log('\n✅ All indexes created successfully!');
    
    // List all indexes after creation
    const finalIndexes = await collection.indexes();
    console.log('\n📋 Final indexes:', finalIndexes.map(i => i.name));
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating indexes:', error);
    process.exit(1);
  }
}

createIndexes();
