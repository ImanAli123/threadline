import { NextResponse } from "next/server";
import mongoose from "mongoose";
import connectDB from "@/lib/db";
import Product from "@/models/Product";
import { requireAdmin } from "@/lib/auth";
import { serializeProduct } from "@/lib/serialize";
import { productSchema } from "@/lib/productSchema";
import { refreshStore } from "@/lib/revalidate";

const forbidden = () => NextResponse.json({ error: "Forbidden" }, { status: 403 });
const notFound = () => NextResponse.json({ error: "Product not found" }, { status: 404 });

export async function GET(_request, { params }) {
  if (!(await requireAdmin())) return forbidden();
  const { id } = await params;
  if (!mongoose.isValidObjectId(id)) return notFound();

  await connectDB();
  const doc = await Product.findById(id).lean();
  if (!doc) return notFound();
  return NextResponse.json({
    product: { ...serializeProduct(doc), active: doc.active, isNewArrival: doc.isNewArrival },
  });
}

export async function PUT(request, { params }) {
  if (!(await requireAdmin())) return forbidden();
  const { id } = await params;
  if (!mongoose.isValidObjectId(id)) return notFound();

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
    const doc = await Product.findByIdAndUpdate(id, { $set: parsed.data }, { new: true });
    if (!doc) return notFound();
    refreshStore();
    return NextResponse.json({ ok: true });
  } catch (err) {
    if (err?.code === 11000) {
      return NextResponse.json({ error: "A product with this slug already exists" }, { status: 409 });
    }
    return NextResponse.json({ error: "Could not save the product" }, { status: 500 });
  }
}

export async function DELETE(_request, { params }) {
  if (!(await requireAdmin())) return forbidden();
  const { id } = await params;
  if (!mongoose.isValidObjectId(id)) return notFound();

  await connectDB();
  const doc = await Product.findByIdAndDelete(id);
  if (!doc) return notFound();
  refreshStore();
  return NextResponse.json({ ok: true });
}
