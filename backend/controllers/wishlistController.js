import wishlistModel from "../models/wishlistModel.js";
import productModel from "../models/productModel.js";

// Get user's wishlist
export const getWishlist = async (req, res) => {
  try {
    const userId = req.user._id;
    
    let wishlist = await wishlistModel
      .findOne({ userId })
      .populate('products.productId', 'name price image category subCategory bestSeller');
    
    if (!wishlist) {
      wishlist = await wishlistModel.create({ userId, products: [] });
    }
    
    res.json({ success: true, wishlist: wishlist.products });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Add product to wishlist
export const addToWishlist = async (req, res) => {
  try {
    const userId = req.user._id;
    const { productId } = req.body;
    
    // Check if product exists
    const product = await productModel.findById(productId);
    if (!product) {
      return res.json({ success: false, message: "Product not found" });
    }
    
    let wishlist = await wishlistModel.findOne({ userId });
    
    if (!wishlist) {
      wishlist = await wishlistModel.create({ 
        userId, 
        products: [{ productId }] 
      });
    } else {
      // Check if product already in wishlist
      const existingProduct = wishlist.products.find(
        item => item.productId.toString() === productId
      );
      
      if (existingProduct) {
        return res.json({ success: false, message: "Product already in wishlist" });
      }
      
      wishlist.products.push({ productId });
      await wishlist.save();
    }
    
    res.json({ success: true, message: "Product added to wishlist" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Remove product from wishlist
export const removeFromWishlist = async (req, res) => {
  try {
    const userId = req.user._id;
    const { productId } = req.body;
    
    const wishlist = await wishlistModel.findOne({ userId });
    
    if (!wishlist) {
      return res.json({ success: false, message: "Wishlist not found" });
    }
    
    wishlist.products = wishlist.products.filter(
      item => item.productId.toString() !== productId
    );
    
    await wishlist.save();
    
    res.json({ success: true, message: "Product removed from wishlist" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Check if product is in wishlist
export const isInWishlist = async (req, res) => {
  try {
    const userId = req.user._id;
    const { productId } = req.params;
    
    const wishlist = await wishlistModel.findOne({ userId });
    
    if (!wishlist) {
      return res.json({ success: true, isInWishlist: false });
    }
    
    const isInWishlist = wishlist.products.some(
      item => item.productId.toString() === productId
    );
    
    res.json({ success: true, isInWishlist });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Clear entire wishlist
export const clearWishlist = async (req, res) => {
  try {
    const userId = req.user._id;
    
    await wishlistModel.findOneAndUpdate(
      { userId },
      { products: [] },
      { upsert: true }
    );
    
    res.json({ success: true, message: "Wishlist cleared" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};
