const { MongoClient } = require('mongodb');
require('dotenv').config();

async function fixDiscountIndex() {
  const client = new MongoClient(process.env.MONGODB_URI);
  
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    
    const db = client.db();
    const collection = db.collection('discounts');
    
    // List current indexes
    const indexes = await collection.listIndexes().toArray();
    console.log('Current indexes:', indexes.map(idx => ({ name: idx.name, key: idx.key })));
    
    // Try to drop the problematic code_1 index
    try {
      await collection.dropIndex('code_1');
      console.log('✅ Successfully dropped code_1 index');
    } catch (error) {
      if (error.codeName === 'IndexNotFound') {
        console.log('ℹ️ Index code_1 not found, nothing to drop');
      } else {
        console.error('❌ Error dropping index:', error.message);
      }
    }
    
    // Verify indexes after operation
    const indexesAfter = await collection.listIndexes().toArray();
    console.log('Indexes after operation:', indexesAfter.map(idx => ({ name: idx.name, key: idx.key })));
    
  } catch (error) {
    console.error('❌ Connection error:', error);
  } finally {
    await client.close();
    console.log('Disconnected from MongoDB');
  }
}

fixDiscountIndex();
