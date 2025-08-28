import mongoose from "mongoose";

const bannerSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  images: [{ 
    url: { type: String, required: true },
    alt: { type: String },
    text: { type: String },
    link: { type: String },
    order: { type: Number, default: 0 }
  }],
  active: { type: Boolean, default: false },
  section: { type: String, enum: ["hero", "home", "footer", "top", "middle"], default: "hero" },
  order: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

const bannerModel = mongoose.models.banner || mongoose.model("banner", bannerSchema);
export default bannerModel;