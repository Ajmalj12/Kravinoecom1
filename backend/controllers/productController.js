import { v2 as cloudinary } from "cloudinary";
import productModel from "../models/productModel.js";
import userModel from "../models/userModel.js";
import discountModel from "../models/discountModel.js";

// function for add product
export const addProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      category,
      subCategory,
      sizes,
      bestSeller,
    } = req.body;

    const image1 = req.files.image1 && req.files.image1[0];
    const image2 = req.files.image2 && req.files.image2[0];
    const image3 = req.files.image3 && req.files.image3[0];
    const image4 = req.files.image4 && req.files.image4[0];

    const images = [image1, image2, image3, image4].filter(
      (item) => item !== undefined
    );

    const imagesUrl = await Promise.all(
      images.map(async (item) => {
        let result = await cloudinary.uploader.upload(item.path, {
          resource_type: "image",
        });
        return result.secure_url;
      })
    );

    const productData = {
      name,
      description,
      category,
      price: Number(price),
      subCategory,
      bestSeller: bestSeller === "true" ? true : false,
      sizes: JSON.parse(sizes),
      image: imagesUrl,
      date: Date.now(),
    };

    console.log(productData);

    const product = new productModel(productData);

    await product.save();

    res.json({ success: true, message: "Product Added" });
  } catch (e) {
    console.log(e);
    res.json({ success: false, message: e.message });
  }
};

// Helper function to calculate discounted price
const calculateDiscountedPrice = async (productId, originalPrice) => {
  try {
    const discount = await discountModel.findOne({
      applicableProducts: productId,
      active: true,
      startDate: { $lte: new Date() },
      endDate: { $gte: new Date() }
    });

    if (!discount) return null;

    let discountAmount = 0;
    if (discount.type === 'percentage') {
      discountAmount = (originalPrice * discount.value) / 100;
      // Apply max discount limit if specified
      if (discount.maxDiscountAmount && discountAmount > discount.maxDiscountAmount) {
        discountAmount = discount.maxDiscountAmount;
      }
    } else {
      discountAmount = discount.value;
    }

    const discountedPrice = Math.max(0, originalPrice - discountAmount);

    return {
      discountedPrice,
      originalPrice,
      discountAmount,
      discount: {
        type: discount.type,
        value: discount.value,
        title: discount.title,
        description: discount.description
      }
    };
  } catch (error) {
    console.log('Error calculating discount:', error);
    return null;
  }
};

// function for list product
export const listProduct = async (req, res) => {
  try {
    const products = await productModel.find({});
    
    // Calculate discounted prices for all products
    const productsWithDiscounts = await Promise.all(
      products.map(async (product) => {
        const discountInfo = await calculateDiscountedPrice(product._id, product.price);
        return {
          ...product.toObject(),
          discountInfo,
          finalPrice: discountInfo ? discountInfo.discountedPrice : product.price
        };
      })
    );
    
    res.json({ success: true, products: productsWithDiscounts });
  } catch (e) {
    console.log(e);
    res.json({ success: false, message: e.message });
  }
};

// function for remove product
export const removeProduct = async (req, res) => {
  try {
    await productModel.findByIdAndDelete(req.body.id);
    res.json({ success: true, message: "Product Removed" });
  } catch (e) {
    console.log(e);
    res.json({ success: false, message: e.message });
  }
};

// function for single product info
export const singleProduct = async (req, res) => {
  try {
    const { productId } = req.body;
    const product = await productModel.findById(productId);

    if (!product) {
      return res.json({ success: false, message: "Product not found" });
    }

    // Calculate discounted price for single product
    const discountInfo = await calculateDiscountedPrice(product._id, product.price);
    const productWithDiscount = {
      ...product.toObject(),
      discountInfo,
      finalPrice: discountInfo ? discountInfo.discountedPrice : product.price
    };

    res.json({ success: true, product: productWithDiscount });
  } catch (e) {
    console.log(e);
    res.json({ success: false, message: e.message });
  }
};

// add a review to a product
export const addReview = async (req, res) => {
  try {
    const { productId, rating, comment } = req.body;
    const userId = req.user._id;

    if (!productId || !rating || !comment) {
      return res.json({ success: false, message: "Missing required fields" });
    }

    const product = await productModel.findById(productId);
    if (!product) {
      return res.json({ success: false, message: "Product not found" });
    }

    // prevent duplicate reviews by the same user
    const existing = product.reviews.find(r => String(r.user) === String(userId));
    if (existing) {
      return res.json({ success: false, message: "You have already reviewed this product" });
    }

    // Get user's name from the user model
    const user = await userModel.findById(userId);
    const userName = user ? user.name : "Anonymous";

    product.reviews.push({
      user: userId,
      name: userName,
      rating: Number(rating),
      comment,
    });

    // recompute rating avg and count
    product.ratingCount = product.reviews.length;
    product.ratingAverage = product.reviews.reduce((sum, r) => sum + r.rating, 0) / product.ratingCount;

    await product.save();

    res.json({ success: true, message: "Review added", reviews: product.reviews, ratingAverage: product.ratingAverage, ratingCount: product.ratingCount });
  } catch (e) {
    console.log(e);
    res.json({ success: false, message: e.message });
  }
};

// get reviews for a product
export const listReviews = async (req, res) => {
  try {
    const { productId } = req.params;
    const product = await productModel.findById(productId).select("reviews ratingAverage ratingCount");
    if (!product) {
      return res.json({ success: false, message: "Product not found" });
    }
    res.json({ success: true, reviews: product.reviews, ratingAverage: product.ratingAverage, ratingCount: product.ratingCount });
  } catch (e) {
    console.log(e);
    res.json({ success: false, message: e.message });
  }
};
