import { connectToDatabase } from "../../../util/mongodb";
import { ObjectId } from "mongodb";

export default async (req, res) => {
    try {
        if (req.method === "POST") {
            const { db } = await connectToDatabase();
            
            const { operation, categories } = req.body;
            
            // Validate input
            if (!operation || !['insert', 'delete'].includes(operation)) {
                return res.status(400).json({ 
                    message: "Operation must be 'insert' or 'delete'" 
                });
            }
            
            if (operation === 'insert' && (!Array.isArray(categories) || categories.length === 0)) {
                return res.status(400).json({ 
                    message: "Categories must be a non-empty array for insert operation" 
                });
            }
            
            let result;
            
            switch (operation) {
                case 'insert':
                    result = await handleBulkInsert(db, categories);
                    break;
                case 'delete':
                    result = await handleDeleteAll(db);
                    break;
                default:
                    return res.status(400).json({ message: "Invalid operation" });
            }
            
            return res.status(200).json(result);
            
        } else {
            return res.status(405).json({ message: "Method not allowed" });
        }
    } catch (err) {
        console.error("Bulk categories error:", err);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

async function handleBulkInsert(db, categories) {
    const validCategories = [];
    const errors = [];
    
    // Validate each category
    for (let i = 0; i < categories.length; i++) {
        const category = categories[i];
        
        if (!category.name || typeof category.name !== 'string' || category.name.trim().length < 2) {
            errors.push({
                index: i,
                error: "Category name must be at least 2 characters long",
                data: category
            });
            continue;
        }
        
        const trimmedName = category.name.trim();
        
        // Check if category already exists
        const existingCategory = await db.collection("categories").findOne({ 
            name: { $regex: new RegExp(`^${trimmedName}$`, 'i') } 
        });
        
        if (existingCategory) {
            errors.push({
                index: i,
                error: "Category already exists",
                data: category
            });
            continue;
        }
        
        validCategories.push({
            name: trimmedName,
            createdAt: new Date(),
            ...(category.description && { description: category.description.trim() }),
            ...(category.isActive !== undefined && { isActive: category.isActive })
        });
    }
    
    if (validCategories.length === 0) {
        return {
            success: false,
            message: "No valid categories to insert",
            errors: errors
        };
    }
    
    // Perform bulk insert
    const insertResult = await db.collection("categories").insertMany(validCategories);
    
    return {
        success: true,
        message: `Successfully inserted ${insertResult.insertedIds.length} categories`,
        insertedCount: insertResult.insertedIds.length,
        insertedIds: Object.values(insertResult.insertedIds),
        errors: errors
    };
}



async function handleDeleteAll(db) {
    try {
        // Delete all categories
        const deleteResult = await db.collection("categories").deleteMany({});
        
        return {
            success: true,
            message: `Successfully deleted ALL categories (${deleteResult.deletedCount} total)`,
            deletedCount: deleteResult.deletedCount
        };
    } catch (error) {
        return {
            success: false,
            message: "Failed to delete all categories",
            error: error.message
        };
    }
}
