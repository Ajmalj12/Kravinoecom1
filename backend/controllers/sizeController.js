import sizeModel from "../models/sizeModel.js";

// Get all sizes
const getSizes = async (req, res) => {
    try {
        const sizes = await sizeModel.find({ isActive: true }).sort({ sortOrder: 1, name: 1 });
        res.json({ success: true, sizes });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// Add new size
const addSize = async (req, res) => {
    try {
        const { name, description, category, sortOrder } = req.body;

        // Check if size already exists
        const existingSize = await sizeModel.findOne({ name });
        if (existingSize) {
            return res.json({ success: false, message: "Size already exists" });
        }

        const sizeData = {
            name,
            description,
            category: category || 'general',
            sortOrder: sortOrder || 0
        };

        const size = new sizeModel(sizeData);
        await size.save();

        res.json({ success: true, message: "Size added successfully", size });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// Update size
const updateSize = async (req, res) => {
    try {
        const { id, name, description, category, sortOrder, isActive } = req.body;

        const updateData = {
            name,
            description,
            category,
            sortOrder,
            isActive
        };

        const size = await sizeModel.findByIdAndUpdate(id, updateData, { new: true });
        
        if (!size) {
            return res.json({ success: false, message: "Size not found" });
        }

        res.json({ success: true, message: "Size updated successfully", size });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// Delete size (soft delete)
const deleteSize = async (req, res) => {
    try {
        const { id } = req.body;

        const size = await sizeModel.findByIdAndUpdate(
            id, 
            { isActive: false }, 
            { new: true }
        );

        if (!size) {
            return res.json({ success: false, message: "Size not found" });
        }

        res.json({ success: true, message: "Size deleted successfully" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// Seed initial sizes
const seedSizes = async (req, res) => {
    try {
        // Check if sizes already exist
        const existingSizes = await sizeModel.find();
        if (existingSizes.length > 0) {
            return res.json({ success: false, message: "Sizes already exist in database" });
        }

        const initialSizes = [
            { name: "XS", description: "Extra Small", category: "clothing", sortOrder: 1 },
            { name: "S", description: "Small", category: "clothing", sortOrder: 2 },
            { name: "M", description: "Medium", category: "clothing", sortOrder: 3 },
            { name: "L", description: "Large", category: "clothing", sortOrder: 4 },
            { name: "XL", description: "Extra Large", category: "clothing", sortOrder: 5 },
            { name: "XXL", description: "Double Extra Large", category: "clothing", sortOrder: 6 },
            { name: "XXXL", description: "Triple Extra Large", category: "clothing", sortOrder: 7 },
            { name: "28", description: "Waist 28 inches", category: "clothing", sortOrder: 8 },
            { name: "30", description: "Waist 30 inches", category: "clothing", sortOrder: 9 },
            { name: "32", description: "Waist 32 inches", category: "clothing", sortOrder: 10 },
            { name: "34", description: "Waist 34 inches", category: "clothing", sortOrder: 11 },
            { name: "36", description: "Waist 36 inches", category: "clothing", sortOrder: 12 },
            { name: "38", description: "Waist 38 inches", category: "clothing", sortOrder: 13 },
            { name: "40", description: "Waist 40 inches", category: "clothing", sortOrder: 14 },
            { name: "42", description: "Waist 42 inches", category: "clothing", sortOrder: 15 },
            { name: "6", description: "Size 6", category: "shoes", sortOrder: 16 },
            { name: "7", description: "Size 7", category: "shoes", sortOrder: 17 },
            { name: "8", description: "Size 8", category: "shoes", sortOrder: 18 },
            { name: "9", description: "Size 9", category: "shoes", sortOrder: 19 },
            { name: "10", description: "Size 10", category: "shoes", sortOrder: 20 },
            { name: "11", description: "Size 11", category: "shoes", sortOrder: 21 },
            { name: "12", description: "Size 12", category: "shoes", sortOrder: 22 },
            { name: "One Size", description: "One size fits all", category: "accessories", sortOrder: 23 },
            { name: "Free Size", description: "Free size", category: "general", sortOrder: 24 }
        ];

        await sizeModel.insertMany(initialSizes);
        res.json({ success: true, message: "Initial sizes seeded successfully" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

export { 
    getSizes, 
    addSize, 
    updateSize, 
    deleteSize, 
    seedSizes 
};
