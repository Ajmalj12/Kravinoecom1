import express from "express";
import {
  addProduct,
  listProduct,
  removeProduct,
  singleProduct,
} from "../controllers/productController.js";
import upload from "../middleware/multer.js";
import adminAuth from "../middleware/adminAuth.js";
import Product from "../models/productModel.js";

const productRouter = express.Router();

productRouter.post(
  "/add",
  adminAuth,
  upload.fields([
    { name: "image1", maxCount: 1 },
    { name: "image2", maxCount: 1 },
    { name: "image3", maxCount: 1 },
    { name: "image4", maxCount: 1 },
  ]),
  addProduct
);
productRouter.post("/single", singleProduct);
productRouter.post("/remove", adminAuth, removeProduct);
productRouter.get("/list", listProduct);

// Add update product route
productRouter.post("/update", adminAuth, async (req, res) => {
  try {
    const { id, ...updateData } = req.body;
    
    if (!id) {
      return res.status(400).json({ success: false, message: "Product ID is required" });
    }
    
    const updatedProduct = await Product.findByIdAndUpdate(
      id, 
      updateData, 
      { new: true }
    );
    
    if (!updatedProduct) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }
    
    res.json({ 
      success: true, 
      message: "Product updated successfully", 
      product: updatedProduct 
    });
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ success: false, message: "Failed to update product" });
  }
});

export default productRouter;
