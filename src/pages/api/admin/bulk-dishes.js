import { connectToDatabase } from "../../../util/mongodb";
import { ObjectId } from "mongodb";

export default async (req, res) => {
    try {
        if (req.method === "POST") {
            const { db } = await connectToDatabase();
            
            const { operation, dishes } = req.body;
            
            // Validate input
            if (!operation || !['insert', 'delete'].includes(operation)) {
                return res.status(400).json({ 
                    message: "Operation must be 'insert' or 'delete'" 
                });
            }
            
            if (operation === 'insert' && (!Array.isArray(dishes) || dishes.length === 0)) {
                return res.status(400).json({ 
                    message: "Dishes must be a non-empty array for insert operation" 
                });
            }
            
            let result;
            
            switch (operation) {
                case 'insert':
                    result = await handleBulkInsert(db, dishes);
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
        console.error("Bulk dishes error:", err);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

async function handleBulkInsert(db, dishes) {
    const validDishes = [];
    const errors = [];
    
    // Validate each dish
    for (let i = 0; i < dishes.length; i++) {
        const dish = dishes[i];
        
        // Required fields validation
        if (!dish.title || typeof dish.title !== 'string' || dish.title.trim().length < 2) {
            errors.push({
                index: i,
                error: "Dish title must be at least 2 characters long",
                data: dish
            });
            continue;
        }
        
        if (!dish.category || typeof dish.category !== 'string' || dish.category.trim().length < 2) {
            errors.push({
                index: i,
                error: "Dish category must be at least 2 characters long",
                data: dish
            });
            continue;
        }
        
        // Validate prices - at least one price must be provided
        if (!dish.regularPrice && !dish.largePrice && !dish.kingPrice) {
            errors.push({
                index: i,
                error: "At least one price must be provided (regularPrice, largePrice, or kingPrice)",
                data: dish
            });
            continue;
        }
        
        // Validate each price if provided
        if (dish.regularPrice && (isNaN(dish.regularPrice) || parseFloat(dish.regularPrice) <= 0)) {
            errors.push({
                index: i,
                error: "Regular price must be a positive number",
                data: dish
            });
            continue;
        }
        
        if (dish.largePrice && (isNaN(dish.largePrice) || parseFloat(dish.largePrice) <= 0)) {
            errors.push({
                index: i,
                error: "Large price must be a positive number",
                data: dish
            });
            continue;
        }
        
        if (dish.kingPrice && (isNaN(dish.kingPrice) || parseFloat(dish.kingPrice) <= 0)) {
            errors.push({
                index: i,
                error: "King price must be a positive number",
                data: dish
            });
            continue;
        }
        

        
        const trimmedTitle = dish.title.trim();
        const trimmedCategory = dish.category.trim().toLowerCase(); // Convert to lowercase
        
        // Check if dish already exists (by title and category combination)
        const existingDish = await db.collection("dishes").findOne({ 
            title: { $regex: new RegExp(`^${trimmedTitle}$`, 'i') },
            category: trimmedCategory
        });
        
        if (existingDish) {
            errors.push({
                index: i,
                error: "Dish already exists with this title and category",
                data: dish
            });
            continue;
        }
        
        // Automatically create category if it doesn't exist
        const categoryExists = await db.collection("categories").findOne({ 
            name: trimmedCategory 
        });
        
        if (!categoryExists) {
            await db.collection("categories").insertOne({
                name: trimmedCategory,
                createdAt: new Date()
            });
        }
        
        validDishes.push({
            title: trimmedTitle,
            category: trimmedCategory.toLowerCase(), // Convert to lowercase
            createdAt: new Date(),
            // Prices - only include if provided
            ...(dish.regularPrice && { regularPrice: parseFloat(dish.regularPrice) }),
            ...(dish.largePrice && { largePrice: parseFloat(dish.largePrice) }),
            ...(dish.kingPrice && { kingPrice: parseFloat(dish.kingPrice) }),
            // Optional fields
            ...(dish.image && { image: dish.image.trim() }),
            ...(dish.description && { description: dish.description.trim() })
        });
    }
    
    if (validDishes.length === 0) {
        return {
            success: false,
            message: "No valid dishes to insert",
            errors: errors
        };
    }
    
    // Perform bulk insert
    const insertResult = await db.collection("dishes").insertMany(validDishes);
    
    return {
        success: true,
        message: `Successfully inserted ${insertResult.insertedIds.length} dishes`,
        insertedCount: insertResult.insertedIds.length,
        insertedIds: Object.values(insertResult.insertedIds),
        errors: errors
    };
}

async function handleDeleteAll(db) {
    try {
        // Delete all dishes
        const deleteResult = await db.collection("dishes").deleteMany({});
        
        return {
            success: true,
            message: `Successfully deleted ALL dishes (${deleteResult.deletedCount} total)`,
            deletedCount: deleteResult.deletedCount
        };
    } catch (error) {
        return {
            success: false,
            message: "Failed to delete all dishes",
            error: error.message
        };
    }
}
