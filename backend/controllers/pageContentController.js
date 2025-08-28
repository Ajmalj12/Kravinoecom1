import pageContentModel from "../models/pageContentModel.js";
import { v2 as cloudinary } from "cloudinary";

export const listPageContent = async (req, res) => {
  try {
    const { page } = req.query;
    if (!page) return res.json({ success: false, message: "Missing page" });
    const items = await pageContentModel.find({ page });
    res.json({ success: true, items });
  } catch (e) {
    console.log(e);
    res.json({ success: false, message: e.message });
  }
};

export const upsertPageContent = async (req, res) => {
  try {
    const { page, key, value } = req.body;
    if (!page || !key) return res.json({ success: false, message: "Missing page or key" });
    const doc = await pageContentModel.findOneAndUpdate(
      { page, key },
      { $set: { value, updatedAt: new Date() } },
      { new: true, upsert: true }
    );
    res.json({ success: true, item: doc });
  } catch (e) {
    console.log(e);
    res.json({ success: false, message: e.message });
  }
};

export const uploadPageImage = async (req, res) => {
  try {
    const { page, key } = req.body;
    const file = req.files?.image?.[0];
    if (!page || !key) return res.json({ success: false, message: "Missing page or key" });
    if (!file) return res.json({ success: false, message: "Image file is required" });

    const uploaded = await cloudinary.uploader.upload(file.path, { resource_type: "image" });
    const value = uploaded.secure_url;

    const doc = await pageContentModel.findOneAndUpdate(
      { page, key },
      { $set: { value, updatedAt: new Date() } },
      { new: true, upsert: true }
    );
    res.json({ success: true, item: doc });
  } catch (e) {
    console.log(e);
    res.json({ success: false, message: e.message });
  }
}; 