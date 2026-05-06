const mongoose = require('mongoose');
require('dotenv').config();

const productSchema = new mongoose.Schema({
  name: String,
  category: String,
  subCategory: String,
  description: String,
  monthlyRent: Number,
  securityDeposit: Number,
  rentalTenureOptions: [Number],
  images: [String],
  quantity: Number,
  availableQuantity: Number,
  specifications: Object,
  reviews: Array,
  rating: Number,
  numReviews: Number
});

const Product = mongoose.model('Product', productSchema);

async function updateProducts() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');
    
    // Get all products
    const products = await Product.find({});
    console.log(`Found ${products.length} products\n`);
    
    // Update each product with missing fields
    for (const product of products) {
      let needsUpdate = false;
      const updates = {};
      
      if (!product.specifications || Object.keys(product.specifications).length === 0) {
        updates.specifications = {
          brand: 'Premium Brand',
          model: 'Standard Model',
          color: 'Various',
          dimensions: 'Standard Size',
          weight: 'Standard Weight',
          material: 'High Quality Material',
          warranty: '1 Year Warranty'
        };
        needsUpdate = true;
      }
      
      if (product.rating === undefined) {
        updates.rating = 4.5;
        needsUpdate = true;
      }
      
      if (product.numReviews === undefined) {
        updates.numReviews = 0;
        needsUpdate = true;
      }
      
      if (product.reviews === undefined) {
        updates.reviews = [];
        needsUpdate = true;
      }
      
      if (needsUpdate) {
        await Product.updateOne({ _id: product._id }, { $set: updates });
        console.log(`✅ Updated: ${product.name}`);
      }
    }
    
    // Verify the update
    const sample = await Product.findOne({});
    console.log('\n📦 Sample Product After Update:');
    console.log(`   Name: ${sample.name}`);
    console.log(`   Specifications: ${JSON.stringify(sample.specifications)}`);
    console.log(`   Rating: ${sample.rating}`);
    console.log(`   Num Reviews: ${sample.numReviews}`);
    
    console.log('\n✅ All products updated successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

updateProducts();
