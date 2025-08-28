const mongoose = require('mongoose');
require('dotenv').config();

async function dropCodeIndex() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
    
    // Get the native MongoDB driver
    const db = mongoose.connection.db;
    const collection = db.collection('discounts');
    
    // List all indexes first
    const indexes = await collection.listIndexes().toArray();
    console.log('Current indexes:');
    indexes.forEach(index => {
      console.log(`- ${index.name}: ${JSON.stringify(index.key)}`);
    });
    
    // Try to drop the code_1 index
    try {
      const result = await collection.dropIndex('code_1');
      console.log('✅ Successfully dropped code_1 index');
    } catch (error) {
      if (error.codeName === 'IndexNotFound') {
        console.log('ℹ️ code_1 index not found');
      } else {
        console.error('❌ Error dropping code_1 index:', error.message);
      }
    }
    
    // Also try dropping any index that might be causing issues with null values
    try {
      const result = await collection.dropIndex({ code: 1 });
      console.log('✅ Successfully dropped code index by key');
    } catch (error) {
      console.log('ℹ️ No code index found by key');
    }
    
    // List indexes after dropping
    const indexesAfter = await collection.listIndexes().toArray();
    console.log('\nIndexes after cleanup:');
    indexesAfter.forEach(index => {
      console.log(`- ${index.name}: ${JSON.stringify(index.key)}`);
    });
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
    process.exit(0);
  }
}

dropCodeIndex();
