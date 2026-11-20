import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Product from "@/models/Product";
import { requireAdmin } from "@/lib/auth";
import { serializeProduct } from "@/lib/serialize";
import { productSchema } from "@/lib/productSchema";
import { refreshStore } from "@/lib/revalidate";

const forbidden = () => NextResponse.json({ error: "Forbidden" }, { status: 403 });

export async function GET() {
  if (!(await requireAdmin())) return forbidden();
  await connectDB();
  const docs = await Product.find().sort({ createdAt: -1 }).lean();
  return NextResponse.json({
    products: docs.map((d) => ({ ...serializeProduct(d), active: d.active, isNewArrival: d.isNewArrival })),
  });
}

export async function POST(request) {
  if (!(await requireAdmin())) return forbidden();

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
  const parsed = productSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
  }

  await connectDB();
  try {
    const doc = await Product.create(parsed.data);
    refreshStore();
    return NextResponse.json({ product: { id: String(doc._id) } }, { status: 201 });
  } catch (err) {
    if (err?.code === 11000) {
      return NextResponse.json({ error: "A product with this slug already exists" }, { status: 409 });
    }
    return NextResponse.json({ error: "Could not save the product" }, { status: 500 });
  }
}
