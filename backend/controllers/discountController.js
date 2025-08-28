import discountModel from "../models/discountModel.js";
import productModel from "../models/productModel.js";

export const listDiscounts = async (req, res) => {
  try {
    const { includeInactive } = req.query;
    const query = {};
    if (!includeInactive) query.active = true;
    const discounts = await discountModel.find(query).populate('applicableProducts', 'name').sort({ createdAt: -1 });
    res.json({ success: true, discounts });
  } catch (e) {
    console.log(e);
    res.json({ success: false, message: e.message });
  }
};

export const createDiscount = async (req, res) => {
  try {
    const { title, description, type, value, maxDiscountAmount, applicableProducts, applicableCategories, active, startDate, endDate, showOnHomePage } = req.body;

    // Validation
    if (!title || !type || !value || !startDate || !endDate) {
      return res.json({ success: false, message: "Missing required fields" });
    }

    if (new Date(startDate) >= new Date(endDate)) {
      return res.json({ success: false, message: "End date must be after start date" });
    }

    if (type === "percentage" && (value < 0 || value > 100)) {
      return res.json({ success: false, message: "Percentage discount must be between 0-100" });
    }

    // Create discount without any code field
    const discountData = {
      title,
      description,
      type,
      value,
      maxDiscountAmount,
      applicableProducts: applicableProducts || [],
      applicableCategories: applicableCategories || [],
      active: active !== undefined ? active : true,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      showOnHomePage: showOnHomePage || false
    };

    const discount = new discountModel(discountData);
    await discount.save();
    res.json({ success: true, message: "Discount created successfully", discount });
  } catch (e) {
    console.log(e);
    // Handle the specific MongoDB duplicate key error for code field
    if (e.code === 11000 && (e.message.includes('code_1') || e.message.includes('code: null'))) {
      res.json({ 
        success: false, 
        message: "Database has an old index on 'code' field. Please run: db.discounts.dropIndex('code_1') in MongoDB to fix this issue." 
      });
    } else {
      res.json({ success: false, message: e.message });
    }
  }
};

export const updateDiscount = async (req, res) => {
  try {
    const { id, ...updateData } = req.body;
    
    
    if (updateData.startDate && updateData.endDate) {
      if (new Date(updateData.startDate) >= new Date(updateData.endDate)) {
        return res.json({ success: false, message: "End date must be after start date" });
      }
    }

    if (updateData.type === "percentage" && updateData.value && (updateData.value < 0 || updateData.value > 100)) {
      return res.json({ success: false, message: "Percentage discount must be between 0-100" });
    }

    const discount = await discountModel.findByIdAndUpdate(id, updateData, { new: true });
    if (!discount) return res.json({ success: false, message: "Discount not found" });

    res.json({ success: true, message: "Discount updated successfully", discount });
  } catch (e) {
    console.log(e);
    res.json({ success: false, message: e.message });
  }
};

export const removeDiscount = async (req, res) => {
  try {
    const { id } = req.body;
    await discountModel.findByIdAndDelete(id);
    res.json({ success: true, message: "Discount removed successfully" });
  } catch (e) {
    console.log(e);
    res.json({ success: false, message: e.message });
  }
};

// Get active discounts for products display
export const getActiveDiscounts = async (req, res) => {
  try {
    const discounts = await discountModel.find({
      active: true,
      startDate: { $lte: new Date() },
      endDate: { $gte: new Date() }
    }).populate('applicableProducts', 'name price');
    
    res.json({ success: true, discounts });
  } catch (e) {
    console.log(e);
    res.json({ success: false, message: e.message });
  }
};

// Get home page discounts (for Live Offers section)
export const getHomePageDiscounts = async (req, res) => {
  try {
    const discounts = await discountModel.find({
      active: true,
      showOnHomePage: true,
      startDate: { $lte: new Date() },
      endDate: { $gte: new Date() }
    }).populate('applicableProducts', 'name price image category subCategory');
    
    res.json({ success: true, discounts });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Add product to discount
export const addProductToDiscount = async (req, res) => {
  try {
    const { discountId, productId } = req.body;

    const discount = await discountModel.findById(discountId);
    if (!discount) {
      return res.json({ success: false, message: 'Discount not found' });
    }

    // Check if product is already in the discount
    const isAlreadyIncluded = discount.applicableProducts.some(p => p.toString() === productId);
    if (isAlreadyIncluded) {
      return res.json({ success: false, message: 'Product already included in this discount' });
    }

    discount.applicableProducts.push(productId);
    await discount.save();

    res.json({ success: true, message: 'Product added to discount successfully' });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Remove product from discount
export const removeProductFromDiscount = async (req, res) => {
  try {
    const { discountId, productId } = req.body;

    const discount = await discountModel.findById(discountId);
    if (!discount) {
      return res.json({ success: false, message: 'Discount not found' });
    }

    discount.applicableProducts = discount.applicableProducts.filter(p => p.toString() !== productId);
    await discount.save();

    res.json({ success: true, message: 'Product removed from discount successfully' });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export const applyDiscount = async (req, res) => {
  try {
    const { discountId } = req.body;
    
    const discount = await discountModel.findById(discountId);
    if (!discount) {
      return res.json({ success: false, message: "Discount not found" });
    }

    // Increment usage count
    discount.usedCount += 1;
    await discount.save();

    res.json({ success: true, message: "Discount applied successfully" });
  } catch (e) {
    console.log(e);
    res.json({ success: false, message: e.message });
  }
};
