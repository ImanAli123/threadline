import mongoose from "mongoose";

const itemSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
    slug: String,
    title: String,
    color: String,
    size: String,
    qty: { type: Number, min: 1 },
    unitPrice: { type: Number, min: 0 },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    orderNumber: { type: String, required: true, unique: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    customer: {
      name: { type: String, required: true },
      email: { type: String, required: true, lowercase: true },
      phone: { type: String, required: true },
    },
    shipping: {
      address: { type: String, required: true },
      city: { type: String, required: true },
      province: { type: String, default: "" },
      notes: { type: String, default: "" },
    },
    items: { type: [itemSchema], default: [] },
    subtotal: { type: Number, required: true },
    shippingFee: { type: Number, required: true },
    total: { type: Number, required: true },
    paymentMethod: { type: String, enum: ["cod", "bank", "wallet"], required: true },
    paymentStatus: { type: String, enum: ["unpaid", "paid"], default: "unpaid" },
    status: {
      type: String,
      enum: ["pending", "confirmed", "shipped", "delivered", "cancelled"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export default mongoose.models.Order || mongoose.model("Order", orderSchema);
