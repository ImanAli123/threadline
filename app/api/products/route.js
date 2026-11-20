import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Product from "@/models/Product";
import { serializeProduct } from "@/lib/serialize";

export async function GET(request) {
  const category = request.nextUrl.searchParams.get("category");

  await connectDB();

  const filter = { active: true };
  if (category && category !== "all" && category !== "new") {
    filter.category = category;
  }
  if (category === "new") filter.isNewArrival = true;

  const docs = await Product.find(filter).sort({ createdAt: 1 }).lean();
  return NextResponse.json({ products: docs.map(serializeProduct) });
}