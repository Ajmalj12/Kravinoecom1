import mongoose from "mongoose";

const discountSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  type: { type: String, enum: ["percentage", "fixed"], required: true },
  value: { type: Number, required: true }, // percentage (0-100) or fixed amount
  maxDiscountAmount: { type: Number }, // max discount for percentage type
  applicableProducts: [{ type: mongoose.Schema.Types.ObjectId, ref: "product" }], // empty = all products
  applicableCategories: [{ type: String }], // empty = all categories
  active: { type: Boolean, default: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  showOnHomePage: { type: Boolean, default: false }, // show in live offers section
  createdAt: { type: Date, default: Date.now }
});


const discountModel = mongoose.models.discount || mongoose.model("discount", discountSchema);
export default discountModel;
