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
        
        // Category is optional but if provided, must be valid
        if (dish.category && (typeof dish.category !== 'string' || dish.category.trim().length < 2)) {
            errors.push({
                index: i,
                error: "Dish category must be at least 2 characters long if provided",
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
        const trimmedCategory = dish.category ? dish.category.trim().toLowerCase() : null;
        
        // Check if dish already exists (by title only if no category)
        let existingDish;
        if (trimmedCategory) {
            existingDish = await db.collection("dishes").findOne({ 
                title: { $regex: new RegExp(`^${trimmedTitle}$`, 'i') },
                category: trimmedCategory
            });
        } else {
            existingDish = await db.collection("dishes").findOne({ 
                title: { $regex: new RegExp(`^${trimmedTitle}$`, 'i') }
            });
        }
        
        if (existingDish) {
            errors.push({
                index: i,
                error: "Dish already exists with this title",
                data: dish
            });
            continue;
        }
        
        // Automatically create category if provided and doesn't exist
        if (trimmedCategory) {
            const categoryExists = await db.collection("categories").findOne({ 
                name: trimmedCategory 
            });
            
            if (!categoryExists) {
                await db.collection("categories").insertOne({
                    name: trimmedCategory,
                    createdAt: new Date()
                });
            }
        }
        
        validDishes.push({
            title: trimmedTitle,
            createdAt: new Date(),
            // Optional fields - only include if provided
            ...(trimmedCategory && { category: trimmedCategory.toLowerCase() }), // Always save in lowercase
            ...(dish.regularPrice && { regularPrice: parseFloat(dish.regularPrice) }),
            ...(dish.largePrice && { largePrice: parseFloat(dish.largePrice) }),
            ...(dish.kingPrice && { kingPrice: parseFloat(dish.kingPrice) }),
            ...(dish.image && { image: dish.image.trim() }),
            ...(dish.description && { description: dish.description.trim() })
        });
    }
    
    console.log("Valid dishes to insert:", validDishes.length);
    console.log("Errors found:", errors.length);
    
    if (validDishes.length === 0) {
        return {
            success: false,
            message: "No valid dishes to insert",
            errors: errors
        };
    }
    
    // Perform bulk insert
    console.log("Inserting dishes:", validDishes);
    const insertResult = await db.collection("dishes").insertMany(validDishes);
    console.log("Insert result:", insertResult);
    
    // Check if insert was successful
    if (!insertResult || !insertResult.insertedIds) {
        console.error("Insert failed:", insertResult);
        return {
            success: false,
            message: "Failed to insert dishes - database error",
            errors: errors
        };
    }
    
    const insertedCount = Object.keys(insertResult.insertedIds).length;
    console.log("Inserted count:", insertedCount);
    
    return {
        success: true,
        message: `Successfully inserted ${insertedCount} dishes`,
        insertedCount: insertedCount,
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
