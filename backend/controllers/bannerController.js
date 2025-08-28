import { v2 as cloudinary } from "cloudinary";
import bannerModel from "../models/bannerModel.js";

export const listBanners = async (req, res) => {
  try {
    const { section, includeInactive } = req.query;
    const query = {};
    if (!includeInactive) query.active = true;
    if (section) query.section = section;
    const banners = await bannerModel.find(query).sort({ order: 1, createdAt: -1 });
    res.json({ success: true, banners });
  } catch (e) {
    console.log(e);
    res.json({ success: false, message: e.message });
  }
};

export const addBanner = async (req, res) => {
  try {
    const { title, description, section = "hero", active = false } = req.body;
    const imageFiles = req.files?.images || [];

    if (imageFiles.length === 0) return res.json({ success: false, message: "At least one banner image is required" });

    // Check if trying to set active when another banner in same section is already active
    if (active) {
      const existingActive = await bannerModel.findOne({ section, active: true });
      if (existingActive) {
        return res.json({ success: false, message: `Another banner is already active in ${section} section. Please deactivate it first.` });
      }
    }

    const images = [];
    for (let i = 0; i < imageFiles.length; i++) {
      const uploaded = await cloudinary.uploader.upload(imageFiles[i].path, { resource_type: "image" });
      images.push({ url: uploaded.secure_url, alt: title, order: i });
    }

    const banner = new bannerModel({ title, description, section, active, images });
    await banner.save();

    res.json({ success: true, message: "Banner carousel added", banner });
  } catch (e) {
    console.log(e);
    res.json({ success: false, message: e.message });
  }
};

export const updateBanner = async (req, res) => {
  try {
    const { id, title, description, section, active } = req.body;
    const imageFiles = req.files?.images || [];

    const banner = await bannerModel.findById(id);
    if (!banner) return res.json({ success: false, message: "Banner not found" });

    // Check if trying to set active when another banner in same section is already active
    if (active && !banner.active) {
      const existingActive = await bannerModel.findOne({ section: section || banner.section, active: true, _id: { $ne: id } });
      if (existingActive) {
        return res.json({ success: false, message: `Another banner is already active in ${section || banner.section} section. Please deactivate it first.` });
      }
    }

    const update = { title, description, section, active };
    Object.keys(update).forEach((k) => update[k] === undefined && delete update[k]);

    if (imageFiles.length > 0) {
      const images = [];
      for (let i = 0; i < imageFiles.length; i++) {
        const uploaded = await cloudinary.uploader.upload(imageFiles[i].path, { resource_type: "image" });
        images.push({ url: uploaded.secure_url, alt: title || banner.title, order: i });
      }
      update.images = images;
    }

    const updatedBanner = await bannerModel.findByIdAndUpdate(id, update, { new: true });
    res.json({ success: true, message: "Banner carousel updated", banner: updatedBanner });
  } catch (e) {
    console.log(e);
    res.json({ success: false, message: e.message });
  }
};

export const updateImageOrder = async (req, res) => {
  try {
    const { id, images } = req.body; // images array with updated order
    const banner = await bannerModel.findById(id);
    if (!banner) return res.json({ success: false, message: "Banner not found" });

    banner.images = images;
    await banner.save();
    res.json({ success: true, message: "Image order updated", banner });
  } catch (e) {
    console.log(e);
    res.json({ success: false, message: e.message });
  }
};

export const removeImage = async (req, res) => {
  try {
    const { id, imageIndex } = req.body;
    const banner = await bannerModel.findById(id);
    if (!banner) return res.json({ success: false, message: "Banner not found" });

    if (banner.images.length <= 1) {
      return res.json({ success: false, message: "Cannot remove the last image. Banner must have at least one image." });
    }

    banner.images.splice(imageIndex, 1);
    // Update order for remaining images
    banner.images.forEach((img, idx) => img.order = idx);
    await banner.save();
    res.json({ success: true, message: "Image removed", banner });
  } catch (e) {
    console.log(e);
    res.json({ success: false, message: e.message });
  }
};

export const addImages = async (req, res) => {
  try {
    const { id } = req.body;
    const imageFiles = req.files?.images || [];
    
    if (imageFiles.length === 0) return res.json({ success: false, message: "No images provided" });

    const banner = await bannerModel.findById(id);
    if (!banner) return res.json({ success: false, message: "Banner not found" });

    const newImages = [];
    const startOrder = banner.images.length;
    
    for (let i = 0; i < imageFiles.length; i++) {
      const uploaded = await cloudinary.uploader.upload(imageFiles[i].path, { resource_type: "image" });
      newImages.push({ url: uploaded.secure_url, alt: banner.title, order: startOrder + i });
    }

    banner.images.push(...newImages);
    await banner.save();
    res.json({ success: true, message: "Images added", banner });
  } catch (e) {
    console.log(e);
    res.json({ success: false, message: e.message });
  }
};

export const removeBanner = async (req, res) => {
  try {
    const { id } = req.body;
    await bannerModel.findByIdAndDelete(id);
    res.json({ success: true, message: "Banner removed" });
  } catch (e) {
    console.log(e);
    res.json({ success: false, message: e.message });
  }
}; 