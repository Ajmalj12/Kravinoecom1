import mongoose from "mongoose";

const sectionSchema = new mongoose.Schema({
  page: { type: String, required: true }, // e.g., 'home', 'about', 'contact', 'collection'
  component: { type: String, required: true }, // e.g., 'LatestCollection', 'BestSeller'
  title: { type: String },
  active: { type: Boolean, default: true },
  order: { type: Number, default: 0 },
  settings: { type: Object, default: {} },
  createdAt: { type: Date, default: Date.now },
});

sectionSchema.index({ page: 1, component: 1 }, { unique: true });

const sectionModel = mongoose.models.section || mongoose.model("section", sectionSchema);
export default sectionModel; 