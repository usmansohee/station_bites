// Script to clean up duplicate categories and fix special characters
const { MongoClient } = require('mongodb');

const MONGODB_URI = "mongodb+srv://stationbites227:4Hqr0yaRciDkItjv@cluster0.g6qtkwl.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const DB_NAME = "stationbites227";

async function cleanDuplicateCategories() {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    
    const db = client.db(DB_NAME);
    
    // Get all categories
    const categories = await db.collection("categories").find({}).toArray();
    console.log(`Found ${categories.length} categories`);
    
    // Group by normalized name
    const categoryGroups = {};
    categories.forEach(category => {
      const normalizedName = category.name.toLowerCase().trim();
      if (!categoryGroups[normalizedName]) {
        categoryGroups[normalizedName] = [];
      }
      categoryGroups[normalizedName].push(category);
    });
    
    // Find duplicates
    const duplicates = Object.entries(categoryGroups).filter(([name, cats]) => cats.length > 1);
    
    if (duplicates.length === 0) {
      console.log('No duplicate categories found!');
      return;
    }
    
    console.log(`Found ${duplicates.length} duplicate category groups:`);
    
    // Clean up duplicates
    for (const [normalizedName, categoryList] of duplicates) {
      console.log(`\nCategory: "${normalizedName}" (${categoryList.length} duplicates)`);
      
      // Keep the first one, delete the rest
      const [keepCategory, ...deleteCategories] = categoryList;
      
      console.log(`  Keeping: ${keepCategory.name} (ID: ${keepCategory._id})`);
      
      for (const deleteCategory of deleteCategories) {
        console.log(`  Deleting: ${deleteCategory.name} (ID: ${deleteCategory._id})`);
        
        // Update all dishes using this category to use the kept category
        await db.collection("dishes").updateMany(
          { category: deleteCategory.name },
          { $set: { category: keepCategory.name } }
        );
        
        // Delete the duplicate category
        await db.collection("categories").deleteOne({ _id: deleteCategory._id });
      }
    }
    
    // Fix special characters in category names
    console.log('\nFixing special characters in category names...');
    const allCategories = await db.collection("categories").find({}).toArray();
    
    for (const category of allCategories) {
      let fixedName = category.name;
      let needsUpdate = false;
      
      // Fix common special characters
      if (category.name.includes("'")) {
        fixedName = category.name.replace(/'/g, "'"); // Replace smart quotes
        needsUpdate = true;
      }
      
      if (category.name.includes("'")) {
        fixedName = category.name.replace(/'/g, "'"); // Replace smart quotes
        needsUpdate = true;
      }
      
      if (category.name.includes("…")) {
        fixedName = category.name.replace(/…/g, "..."); // Replace ellipsis
        needsUpdate = true;
      }
      
      if (needsUpdate) {
        console.log(`Fixing category: "${category.name}" -> "${fixedName}"`);
        await db.collection("categories").updateOne(
          { _id: category._id },
          { $set: { name: fixedName.toLowerCase() } }
        );
        
        // Update dishes using this category
        await db.collection("dishes").updateMany(
          { category: category.name },
          { $set: { category: fixedName.toLowerCase() } }
        );
      }
    }
    
    console.log('\nDuplicate cleanup and special character fixing completed!');
    
    // Show final categories
    const finalCategories = await db.collection("categories").find({}).toArray();
    console.log(`\nFinal categories (${finalCategories.length}):`);
    finalCategories.forEach(cat => console.log(`  - ${cat.name}`));
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.close();
  }
}

// Run the script
cleanDuplicateCategories().catch(console.error);
