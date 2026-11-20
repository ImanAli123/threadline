import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Product from "@/models/Product";
import { serializeProduct } from "@/lib/serialize";

export async function GET(request, { params }) {
  const { slug } = await params;

  await connectDB();
  const doc = await Product.findOne({ slug, active: true }).lean();

  if (!doc) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }
  return NextResponse.json({ product: serializeProduct(doc) });
}