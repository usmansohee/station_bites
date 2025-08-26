// Script to fix Chef's Specialities duplicates with different apostrophe characters
const { MongoClient } = require('mongodb');

const MONGODB_URI = "mongodb+srv://stationbites227:4Hqr0yaRciDkItjv@cluster0.g6qtkwl.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const DB_NAME = "stationbites227";

async function fixChefDuplicates() {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    
    const db = client.db(DB_NAME);
    
    // Check current categories
    console.log('Current categories:');
    const categories = await db.collection("categories").find({}).toArray();
    categories.forEach(cat => {
      console.log(`  - "${cat.name}" (length: ${cat.name.length})`);
      // Show the actual character codes
      console.log(`    Character codes: ${Array.from(cat.name).map(c => c.charCodeAt(0)).join(', ')}`);
    });
    
    // Find all categories that contain "chef" and "specialities"
    const chefCategories = categories.filter(cat => 
      cat.name.toLowerCase().includes('chef') && 
      cat.name.toLowerCase().includes('specialities')
    );
    
    console.log(`\nFound ${chefCategories.length} Chef's Specialities categories:`);
    chefCategories.forEach(cat => {
      console.log(`  - "${cat.name}" (ID: ${cat._id})`);
    });
    
    if (chefCategories.length <= 1) {
      console.log('No duplicates found for Chef\'s Specialities');
      return;
    }
    
    // Choose the target category (the one with dishes)
    const targetCategory = "chef's specialities";
    
    // Find which category has dishes
    let categoryWithDishes = null;
    let maxDishes = 0;
    
    for (const cat of chefCategories) {
      const dishCount = await db.collection("dishes").countDocuments({ category: cat.name });
      console.log(`Category "${cat.name}" has ${dishCount} dishes`);
      
      if (dishCount > maxDishes) {
        maxDishes = dishCount;
        categoryWithDishes = cat;
      }
    }
    
    console.log(`\nCategory with most dishes: "${categoryWithDishes.name}" (${maxDishes} dishes)`);
    
    // Update all dishes to use the target category
    console.log('\nUpdating all dishes to use consistent category...');
    
    const updateResult = await db.collection("dishes").updateMany(
      {
        $or: chefCategories.map(cat => ({ category: cat.name }))
      },
      { $set: { category: targetCategory } }
    );
    
    console.log(`Updated ${updateResult.modifiedCount} dishes to category: "${targetCategory}"`);
    
    // Delete all duplicate categories except the target one
    console.log('\nDeleting duplicate categories...');
    
    for (const cat of chefCategories) {
      if (cat.name !== targetCategory) {
        console.log(`Deleting duplicate category: "${cat.name}"`);
        await db.collection("categories").deleteOne({ _id: cat._id });
      }
    }
    
    // Create the target category if it doesn't exist
    const targetExists = await db.collection("categories").findOne({ name: targetCategory });
    if (!targetExists) {
      console.log(`Creating target category: "${targetCategory}"`);
      await db.collection("categories").insertOne({
        name: targetCategory,
        createdAt: new Date()
      });
    }
    
    // Verify the fix
    console.log('\nVerifying the fix...');
    const finalCategories = await db.collection("categories").find({}).toArray();
    console.log(`Final categories (${finalCategories.length}):`);
    finalCategories.forEach(cat => console.log(`  - "${cat.name}"`));
    
    const finalDishes = await db.collection("dishes").find({ category: targetCategory }).toArray();
    console.log(`\nDishes in "${targetCategory}": ${finalDishes.length}`);
    finalDishes.forEach(dish => console.log(`  - "${dish.title}"`));
    
    console.log('\nChef\'s Specialities duplicate fix completed!');
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.close();
  }
}

// Run the script
fixChefDuplicates().catch(console.error);
