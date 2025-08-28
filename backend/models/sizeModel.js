import mongoose from "mongoose";

const sizeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    category: {
        type: String,
        enum: ['clothing', 'shoes', 'accessories', 'general'],
        default: 'general'
    },
    sortOrder: {
        type: Number,
        default: 0
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

const sizeModel = mongoose.models.size || mongoose.model("size", sizeSchema);

export default sizeModel;
