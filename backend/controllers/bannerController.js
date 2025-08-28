import { v2 as cloudinary } from "cloudinary";
import bannerModel from "../models/bannerModel.js";

export const listBanners = async (req, res) => {
  try {
    const { position, includeInactive } = req.query;
    const query = {};
    if (!includeInactive) query.active = true;
    if (position) query.position = position;
    const banners = await bannerModel.find(query).sort({ createdAt: -1 });
    res.json({ success: true, banners });
  } catch (e) {
    console.log(e);
    res.json({ success: false, message: e.message });
  }
};

export const addBanner = async (req, res) => {
  try {
    const { productId, title, position = "home", active = true } = req.body;
    const imageFile = req.files?.image?.[0];

    if (!imageFile) return res.json({ success: false, message: "Banner image is required" });

    const uploaded = await cloudinary.uploader.upload(imageFile.path, { resource_type: "image" });

    const banner = new bannerModel({ title, productId, position, active, image: uploaded.secure_url });
    await banner.save();

    res.json({ success: true, message: "Banner added", banner });
  } catch (e) {
    console.log(e);
    res.json({ success: false, message: e.message });
  }
};

export const updateBanner = async (req, res) => {
  try {
    const { id, title, productId, position, active } = req.body;
    const imageFile = req.files?.image?.[0];

    const update = { title, productId, position, active };
    Object.keys(update).forEach((k) => update[k] === undefined && delete update[k]);

    if (imageFile) {
      const uploaded = await cloudinary.uploader.upload(imageFile.path, { resource_type: "image" });
      update.image = uploaded.secure_url;
    }

    const banner = await bannerModel.findByIdAndUpdate(id, update, { new: true });
    if (!banner) return res.json({ success: false, message: "Banner not found" });

    res.json({ success: true, message: "Banner updated", banner });
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