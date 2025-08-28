import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const dropDiscountCodeIndex = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
    
    const db = mongoose.connection.db;
    const collection = db.collection('discounts');
    
    // Check if the index exists
    const indexes = await collection.indexes();
    console.log('Existing indexes:', indexes.map(idx => idx.name));
    
    // Drop the problematic code_1 index if it exists
    try {
      await collection.dropIndex('code_1');
      console.log('Successfully dropped code_1 index');
    } catch (error) {
      if (error.code === 27) {
        console.log('Index code_1 does not exist, nothing to drop');
      } else {
        console.error('Error dropping index:', error.message);
      }
    }
    
    // List indexes after dropping
    const indexesAfter = await collection.indexes();
    console.log('Indexes after dropping:', indexesAfter.map(idx => idx.name));
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
};

dropDiscountCodeIndex();
