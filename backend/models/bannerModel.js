import mongoose from "mongoose";

const bannerSchema = new mongoose.Schema({
  title: { type: String },
  image: { type: String, required: true },
  productId: { type: mongoose.Schema.Types.ObjectId, ref: "product", required: true },
  active: { type: Boolean, default: true },
  position: { type: String, enum: ["top", "home", "footer"], default: "home" },
  createdAt: { type: Date, default: Date.now }
});

const bannerModel = mongoose.models.banner || mongoose.model("banner", bannerSchema);
export default bannerModel; 