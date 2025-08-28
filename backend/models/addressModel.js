import mongoose from "mongoose";

const addressSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
  fullName: { type: String, required: true },
  phone: { type: String, required: true },
  addressLine1: { type: String, required: true },
  addressLine2: { type: String },
  city: { type: String, required: true },
  state: { type: String, required: true },
  zipCode: { type: String, required: true },
  country: { type: String, required: true, default: "India" },
  isDefault: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

// Ensure only one default address per user
addressSchema.pre('save', async function(next) {
  if (this.isDefault) {
    await this.constructor.updateMany(
      { userId: this.userId, _id: { $ne: this._id } },
      { isDefault: false }
    );
  }
  next();
});

const addressModel = mongoose.models.address || mongoose.model("address", addressSchema);
export default addressModel;
