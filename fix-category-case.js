// Script to fix category case inconsistencies
// Run this to normalize all existing categories to lowercase

const { MongoClient } = require('mongodb');

const MONGODB_URI = "mongodb+srv://stationbites227:4Hqr0yaRciDkItjv@cluster0.g6qtkwl.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const DB_NAME = "stationbites227";

async function fixCategoryCase() {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    
    const db = client.db(DB_NAME);
    
    // Fix categories collection
    console.log('Fixing categories collection...');
    const categories = await db.collection("categories").find({}).toArray();
    
    for (const category of categories) {
      if (category.name && category.name !== category.name.toLowerCase()) {
        console.log(`Updating category: "${category.name}" -> "${category.name.toLowerCase()}"`);
        await db.collection("categories").updateOne(
          { _id: category._id },
          { $set: { name: category.name.toLowerCase() } }
        );
      }
    }
    
    // Fix dishes collection
    console.log('Fixing dishes collection...');
    const dishes = await db.collection("dishes").find({}).toArray();
    
    for (const dish of dishes) {
      if (dish.category && dish.category !== dish.category.toLowerCase()) {
        console.log(`Updating dish "${dish.title}" category: "${dish.category}" -> "${dish.category.toLowerCase()}"`);
        await db.collection("dishes").updateOne(
          { _id: dish._id },
          { $set: { category: dish.category.toLowerCase() } }
        );
      }
    }
    
    console.log('Category case fixing completed!');
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.close();
  }
}

// Run the script
fixCategoryCase().catch(console.error);
