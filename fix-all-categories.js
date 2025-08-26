// Comprehensive script to fix all category issues
const { MongoClient } = require('mongodb');

const MONGODB_URI = "mongodb+srv://stationbites227:4Hqr0yaRciDkItjv@cluster0.g6qtkwl.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const DB_NAME = "stationbites227";

async function fixAllCategories() {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    
    const db = client.db(DB_NAME);
    
    // Step 1: Show current state
    console.log('=== CURRENT STATE ===');
    const categories = await db.collection("categories").find({}).toArray();
    console.log(`Total categories: ${categories.length}`);
    
    categories.forEach(cat => {
      console.log(`  - "${cat.name}" (length: ${cat.name.length})`);
    });
    
    // Step 2: Check dishes in each category
    console.log('\n=== DISHES PER CATEGORY ===');
    const categoryStats = [];
    
    for (const cat of categories) {
      const dishCount = await db.collection("dishes").countDocuments({ category: cat.name });
      categoryStats.push({
        name: cat.name,
        id: cat._id,
        dishCount: dishCount
      });
      console.log(`  "${cat.name}": ${dishCount} dishes`);
    }
    
    // Step 3: Find empty categories
    const emptyCategories = categoryStats.filter(cat => cat.dishCount === 0);
    console.log(`\nEmpty categories: ${emptyCategories.length}`);
    emptyCategories.forEach(cat => console.log(`  - "${cat.name}"`));
    
    // Step 4: Find categories with similar names (potential duplicates)
    console.log('\n=== FINDING SIMILAR CATEGORIES ===');
    const similarGroups = [];
    const processed = new Set();
    
    for (const cat1 of categoryStats) {
      if (processed.has(cat1.id.toString())) continue;
      
      const similar = [cat1];
      const normalized1 = cat1.name.toLowerCase().replace(/[^a-z0-9]/g, '');
      
      for (const cat2 of categoryStats) {
        if (cat1.id.toString() === cat2.id.toString()) continue;
        if (processed.has(cat2.id.toString())) continue;
        
        const normalized2 = cat2.name.toLowerCase().replace(/[^a-z0-9]/g, '');
        
        if (normalized1 === normalized2) {
          similar.push(cat2);
          processed.add(cat2.id.toString());
        }
      }
      
      if (similar.length > 1) {
        similarGroups.push(similar);
        console.log(`Similar group: ${similar.map(c => `"${c.name}"`).join(' | ')}`);
      }
      
      processed.add(cat1.id.toString());
    }
    
    // Step 5: Fix each group
    console.log('\n=== FIXING CATEGORIES ===');
    
    for (const group of similarGroups) {
      console.log(`\nFixing group: ${group.map(c => `"${c.name}"`).join(' | ')}`);
      
      // Find the category with most dishes (keep this one)
      const bestCategory = group.reduce((best, current) => 
        current.dishCount > best.dishCount ? current : best
      );
      
      console.log(`  Keeping: "${bestCategory.name}" (${bestCategory.dishCount} dishes)`);
      
      // Update all dishes to use the best category
      const otherCategories = group.filter(c => c.id.toString() !== bestCategory.id.toString());
      
      for (const otherCat of otherCategories) {
        console.log(`  Updating dishes from "${otherCat.name}" to "${bestCategory.name}"`);
        
        const updateResult = await db.collection("dishes").updateMany(
          { category: otherCat.name },
          { $set: { category: bestCategory.name } }
        );
        
        console.log(`    Updated ${updateResult.modifiedCount} dishes`);
        
        // Delete the duplicate category
        await db.collection("categories").deleteOne({ _id: otherCat.id });
        console.log(`    Deleted duplicate category: "${otherCat.name}"`);
      }
    }
    
    // Step 6: Normalize all category names to lowercase
    console.log('\n=== NORMALIZING CATEGORY NAMES ===');
    
    const allCategories = await db.collection("categories").find({}).toArray();
    for (const cat of allCategories) {
      const normalizedName = cat.name.toLowerCase().trim();
      
      if (cat.name !== normalizedName) {
        console.log(`Normalizing: "${cat.name}" -> "${normalizedName}"`);
        
        // Update the category name
        await db.collection("categories").updateOne(
          { _id: cat._id },
          { $set: { name: normalizedName } }
        );
        
        // Update all dishes using this category
        await db.collection("dishes").updateMany(
          { category: cat.name },
          { $set: { category: normalizedName } }
        );
      }
    }
    
    // Step 7: Final verification
    console.log('\n=== FINAL VERIFICATION ===');
    const finalCategories = await db.collection("categories").find({}).toArray();
    console.log(`Final categories: ${finalCategories.length}`);
    
    for (const cat of finalCategories) {
      const dishCount = await db.collection("dishes").countDocuments({ category: cat.name });
      console.log(`  "${cat.name}": ${dishCount} dishes`);
    }
    
    console.log('\n=== ALL CATEGORY ISSUES FIXED ===');
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.close();
  }
}

// Run the script
fixAllCategories().catch(console.error);
