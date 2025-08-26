// Script to fix Chef's Specialities category specifically
const { MongoClient } = require('mongodb');

const MONGODB_URI = "mongodb+srv://stationbites227:4Hqr0yaRciDkItjv@cluster0.g6qtkwl.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const DB_NAME = "stationbites227";

async function fixChefSpecialities() {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    
    const db = client.db(DB_NAME);
    
    // Check current categories
    console.log('Current categories:');
    const categories = await db.collection("categories").find({}).toArray();
    categories.forEach(cat => console.log(`  - "${cat.name}"`));
    
    // Check dishes with chef specialities category
    console.log('\nDishes with chef specialities category:');
    const chefDishes = await db.collection("dishes").find({
      $or: [
        { category: "Chef's Specialities" },
        { category: "chef's specialities" },
        { category: "Chef's Specialities" },
        { category: "chef's specialities" },
        { category: "Chef Specialities" },
        { category: "chef specialities" }
      ]
    }).toArray();
    
    console.log(`Found ${chefDishes.length} dishes in Chef's Specialities`);
    chefDishes.forEach(dish => console.log(`  - "${dish.title}" (category: "${dish.category}")`));
    
    // Fix the category name to be consistent
    const targetCategory = "chef's specialities";
    
    // Update all variations to the target category
    console.log('\nFixing category names...');
    
    const updateResult = await db.collection("dishes").updateMany(
      {
        $or: [
          { category: "Chef's Specialities" },
          { category: "chef's specialities" },
          { category: "Chef's Specialities" },
          { category: "chef's specialities" },
          { category: "Chef Specialities" },
          { category: "chef specialities" }
        ]
      },
      { $set: { category: targetCategory } }
    );
    
    console.log(`Updated ${updateResult.modifiedCount} dishes to category: "${targetCategory}"`);
    
    // Update or create the category
    const categoryExists = await db.collection("categories").findOne({ name: targetCategory });
    
    if (categoryExists) {
      console.log(`Category "${targetCategory}" already exists`);
    } else {
      // Create the category if it doesn't exist
      await db.collection("categories").insertOne({
        name: targetCategory,
        createdAt: new Date()
      });
      console.log(`Created category: "${targetCategory}"`);
    }
    
    // Verify the fix
    console.log('\nVerifying the fix...');
    const finalChefDishes = await db.collection("dishes").find({ category: targetCategory }).toArray();
    console.log(`Now found ${finalChefDishes.length} dishes in "${targetCategory}"`);
    
    console.log('\nChef Specialities fix completed!');
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.close();
  }
}

// Run the script
fixChefSpecialities().catch(console.error);
