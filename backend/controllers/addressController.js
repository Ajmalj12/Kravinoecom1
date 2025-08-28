import addressModel from "../models/addressModel.js";

// Add new address
export const addAddress = async (req, res) => {
  try {
    const { userId, fullName, phone, addressLine1, addressLine2, city, state, zipCode, country, isDefault } = req.body;

    if (!fullName || !phone || !addressLine1 || !city || !state || !zipCode) {
      return res.json({ success: false, message: "All required fields must be filled" });
    }

    const addressData = {
      userId,
      fullName,
      phone,
      addressLine1,
      addressLine2: addressLine2 || "",
      city,
      state,
      zipCode,
      country: country || "India",
      isDefault: isDefault || false
    };

    const address = new addressModel(addressData);
    await address.save();

    res.json({ success: true, message: "Address added successfully", address });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Get all addresses for a user
export const getUserAddresses = async (req, res) => {
  try {
    const { userId } = req.body;
    const addresses = await addressModel.find({ userId }).sort({ isDefault: -1, createdAt: -1 });
    
    res.json({ success: true, addresses });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Update address
export const updateAddress = async (req, res) => {
  try {
    const { addressId, fullName, phone, addressLine1, addressLine2, city, state, zipCode, country, isDefault } = req.body;

    if (!addressId) {
      return res.json({ success: false, message: "Address ID is required" });
    }

    const updateData = {
      fullName,
      phone,
      addressLine1,
      addressLine2: addressLine2 || "",
      city,
      state,
      zipCode,
      country: country || "India",
      isDefault: isDefault || false
    };

    const address = await addressModel.findByIdAndUpdate(addressId, updateData, { new: true });
    
    if (!address) {
      return res.json({ success: false, message: "Address not found" });
    }

    res.json({ success: true, message: "Address updated successfully", address });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Delete address
export const deleteAddress = async (req, res) => {
  try {
    const { addressId } = req.body;

    if (!addressId) {
      return res.json({ success: false, message: "Address ID is required" });
    }

    const address = await addressModel.findByIdAndDelete(addressId);
    
    if (!address) {
      return res.json({ success: false, message: "Address not found" });
    }

    res.json({ success: true, message: "Address deleted successfully" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Set default address
export const setDefaultAddress = async (req, res) => {
  try {
    const { addressId, userId } = req.body;

    if (!addressId || !userId) {
      return res.json({ success: false, message: "Address ID and User ID are required" });
    }

    // Remove default from all user addresses
    await addressModel.updateMany({ userId }, { isDefault: false });
    
    // Set new default
    const address = await addressModel.findByIdAndUpdate(addressId, { isDefault: true }, { new: true });
    
    if (!address) {
      return res.json({ success: false, message: "Address not found" });
    }

    res.json({ success: true, message: "Default address updated successfully", address });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Get single address
export const getAddress = async (req, res) => {
  try {
    const { addressId } = req.body;
    
    if (!addressId) {
      return res.json({ success: false, message: "Address ID is required" });
    }

    const address = await addressModel.findById(addressId);
    
    if (!address) {
      return res.json({ success: false, message: "Address not found" });
    }

    res.json({ success: true, address });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};
