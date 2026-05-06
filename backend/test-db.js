const mongoose = require('mongoose');
require('dotenv').config();

console.log('🔍 Testing MongoDB Connection...');
console.log('Connection String:', process.env.MONGODB_URI?.replace(/\/\/(.*)@/, '//***:***@'));

async function testConnection() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB Connected Successfully!');
    
    // Test database operations
    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();
    console.log(`📊 Database: ${db.databaseName}`);
    console.log(`📚 Collections: ${collections.map(c => c.name).join(', ') || 'none'}`);
    
    await mongoose.disconnect();
    console.log('✅ Connection test completed!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Connection Error:', error.message);
    if (error.message.includes('bad auth')) {
      console.error('\n🔧 Fix: Your username or password is incorrect.');
      console.error('Please check your MongoDB Atlas credentials in the .env file');
    }
    if (error.message.includes('ENOTFOUND')) {
      console.error('\n🔧 Fix: Cannot reach MongoDB Atlas. Check your cluster address.');
    }
    process.exit(1);
  }
}

testConnection();
