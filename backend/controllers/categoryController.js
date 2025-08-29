import categoryModel from "../models/categoryModel.js";
import { v2 as cloudinary } from 'cloudinary';

// Get all categories
const getCategories = async (req, res) => {
    try {
        const categories = await categoryModel.find({ isActive: true }).sort({ createdAt: -1 });
        res.json({ success: true, categories });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// Add new category
const addCategory = async (req, res) => {
    try {
        const { name, description, subCategories } = req.body;

        // Check if category already exists
        const existingCategory = await categoryModel.findOne({ name });
        if (existingCategory) {
            return res.json({ success: false, message: "Category already exists" });
        }

        const categoryData = {
            name,
            description,
            subCategories: subCategories || []
        };

        const category = new categoryModel(categoryData);
        await category.save();

        res.json({ success: true, message: "Category added successfully", category });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// Update category
const updateCategory = async (req, res) => {
    try {
        const { id, name, description, subCategories, isActive } = req.body;

        const updateData = {
            name,
            description,
            subCategories,
            isActive
        };

        const category = await categoryModel.findByIdAndUpdate(id, updateData, { new: true });
        
        if (!category) {
            return res.json({ success: false, message: "Category not found" });
        }

        res.json({ success: true, message: "Category updated successfully", category });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// Delete category (soft delete)
const deleteCategory = async (req, res) => {
    try {
        const { id } = req.body;

        const category = await categoryModel.findByIdAndUpdate(
            id, 
            { isActive: false }, 
            { new: true }
        );

        if (!category) {
            return res.json({ success: false, message: "Category not found" });
        }

        res.json({ success: true, message: "Category deleted successfully" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// Add subcategory to existing category
const addSubCategory = async (req, res) => {
    try {
        const { categoryId, name, description } = req.body;

        const category = await categoryModel.findById(categoryId);
        if (!category) {
            return res.json({ success: false, message: "Category not found" });
        }

        // Check if subcategory already exists in this category
        const existingSubCategory = category.subCategories.find(sub => sub.name === name);
        if (existingSubCategory) {
            return res.json({ success: false, message: "Subcategory already exists in this category" });
        }

        category.subCategories.push({ name, description });
        await category.save();

        res.json({ success: true, message: "Subcategory added successfully", category });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// Remove subcategory from category
const removeSubCategory = async (req, res) => {
    try {
        const { categoryId, subCategoryId } = req.body;

        const category = await categoryModel.findById(categoryId);
        if (!category) {
            return res.json({ success: false, message: "Category not found" });
        }

        category.subCategories = category.subCategories.filter(
            sub => sub._id.toString() !== subCategoryId
        );
        await category.save();

        res.json({ success: true, message: "Subcategory removed successfully", category });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// Seed initial categories
const seedCategories = async (req, res) => {
    try {
        // Check if categories already exist
        const existingCategories = await categoryModel.find();
        if (existingCategories.length > 0) {
            return res.json({ success: false, message: "Categories already exist in database" });
        }

        const initialCategories = [
            {
                name: "Men",
                description: "Men's clothing and accessories",
                subCategories: [
                    { name: "Topwear", description: "T-shirts, shirts, hoodies" },
                    { name: "Bottomwear", description: "Pants, jeans, shorts" },
                    { name: "Winterwear", description: "Jackets, sweaters, coats" },
                    { name: "Shirts", description: "Formal and casual shirts" },
                    { name: "Pants", description: "Trousers and formal pants" },
                    { name: "Jackets", description: "Blazers and casual jackets" },
                    { name: "Accessories", description: "Belts, watches, wallets" }
                ]
            },
            {
                name: "Women",
                description: "Women's clothing and accessories",
                subCategories: [
                    { name: "Topwear", description: "Blouses, t-shirts, tops" },
                    { name: "Bottomwear", description: "Pants, jeans, leggings" },
                    { name: "Winterwear", description: "Coats, sweaters, cardigans" },
                    { name: "Dresses", description: "Casual and formal dresses" },
                    { name: "Tops", description: "Blouses and casual tops" },
                    { name: "Skirts", description: "Mini, midi, and maxi skirts" },
                    { name: "Accessories", description: "Bags, jewelry, scarves" }
                ]
            },
            {
                name: "Kids",
                description: "Children's clothing and accessories",
                subCategories: [
                    { name: "Topwear", description: "T-shirts, shirts for kids" },
                    { name: "Bottomwear", description: "Pants, shorts for kids" },
                    { name: "Winterwear", description: "Jackets, sweaters for kids" },
                    { name: "Boys", description: "Boys specific clothing" },
                    { name: "Girls", description: "Girls specific clothing" },
                    { name: "Infants", description: "Baby and toddler clothing" },
                    { name: "Accessories", description: "Kids bags, hats, shoes" }
                ]
            }
        ];

        await categoryModel.insertMany(initialCategories);
        res.json({ success: true, message: "Initial categories seeded successfully" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// Upload category image
const uploadCategoryImage = async (req, res) => {
    try {
        const { categoryId } = req.params;
        
        if (!req.file) {
            return res.json({ success: false, message: "No image file provided" });
        }

        // Upload image to cloudinary
        const imageUpload = await cloudinary.uploader.upload(req.file.path, {
            resource_type: "image"
        });

        // Update category with image URL
        const category = await categoryModel.findByIdAndUpdate(
            categoryId,
            { image: imageUpload.secure_url },
            { new: true }
        );

        if (!category) {
            return res.json({ success: false, message: "Category not found" });
        }

        res.json({ 
            success: true, 
            message: "Category image uploaded successfully",
            imageUrl: imageUpload.secure_url,
            category 
        });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// Upload subcategory image
const uploadSubcategoryImage = async (req, res) => {
    try {
        const { categoryId, subcategoryId } = req.params;
        
        if (!req.file) {
            return res.json({ success: false, message: "No image file provided" });
        }

        // Upload image to cloudinary
        const imageUpload = await cloudinary.uploader.upload(req.file.path, {
            resource_type: "image"
        });

        // Find category and update subcategory image
        const category = await categoryModel.findById(categoryId);
        if (!category) {
            return res.json({ success: false, message: "Category not found" });
        }

        const subcategory = category.subCategories.id(subcategoryId);
        if (!subcategory) {
            return res.json({ success: false, message: "Subcategory not found" });
        }

        subcategory.image = imageUpload.secure_url;
        await category.save();

        res.json({ 
            success: true, 
            message: "Subcategory image uploaded successfully",
            imageUrl: imageUpload.secure_url,
            category 
        });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// Toggle category visibility in navigation
const toggleCategoryVisibility = async (req, res) => {
    try {
        const { categoryId, showInNavigation } = req.body;

        const category = await categoryModel.findByIdAndUpdate(
            categoryId,
            { showInNavigation },
            { new: true }
        );

        if (!category) {
            return res.json({ success: false, message: "Category not found" });
        }

        res.json({ 
            success: true, 
            message: "Category visibility updated successfully",
            category 
        });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// Toggle subcategory visibility in navigation
const toggleSubcategoryVisibility = async (req, res) => {
    try {
        const { categoryId, subcategoryId, showInNavigation } = req.body;

        const category = await categoryModel.findById(categoryId);
        if (!category) {
            return res.json({ success: false, message: "Category not found" });
        }

        const subcategory = category.subCategories.id(subcategoryId);
        if (!subcategory) {
            return res.json({ success: false, message: "Subcategory not found" });
        }

        subcategory.showInNavigation = showInNavigation;
        await category.save();

        res.json({ 
            success: true, 
            message: "Subcategory visibility updated successfully",
            category 
        });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

export { 
    getCategories, 
    addCategory, 
    updateCategory, 
    deleteCategory, 
    addSubCategory, 
    removeSubCategory,
    seedCategories,
    uploadCategoryImage,
    uploadSubcategoryImage,
    toggleCategoryVisibility,
    toggleSubcategoryVisibility
};
