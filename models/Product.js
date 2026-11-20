import mongoose from "mongoose";

const colorSchema = new mongoose.Schema(
  { name: { type: String, required: true }, hex: { type: String, required: true } },
  { _id: false }
);

const productSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true, trim: true },
    title: { type: String, required: true, trim: true },
    category: {
      type: String,
      required: true,
      enum: ["men", "women", "accessories"],
    },
    price: { type: Number, required: true, min: 0 },
    discountPrice: { type: Number, default: null, min: 0 },
    colors: { type: [colorSchema], default: [] },
    sizes: { type: [String], default: [] },
    description: { type: String, default: "" },
    details: { type: [String], default: [] },
    images: { type: [String], default: [] },
    isNewArrival: { type: Boolean, default: false },
    bestSeller: { type: Boolean, default: false },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    reviewCount: { type: Number, default: 0, min: 0 },
    stock: { type: Number, default: 100, min: 0 },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.models.Product || mongoose.model("Product", productSchema);