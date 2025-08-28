import mongoose from "mongoose";

const pageContentSchema = new mongoose.Schema({
  page: { type: String, required: true }, // about, contact, collection
  key: { type: String, required: true }, // e.g., heading, body, heroImage
  value: { type: mongoose.Schema.Types.Mixed },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

pageContentSchema.index({ page: 1, key: 1 }, { unique: true });

pageContentSchema.pre('save', function(next) { this.updatedAt = new Date(); next(); });

const pageContentModel = mongoose.models.pagecontent || mongoose.model("pagecontent", pageContentSchema);
export default pageContentModel; 