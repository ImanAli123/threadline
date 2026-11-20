import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import connectDB from "@/lib/db";
import Product from "@/models/Product";
import User from "@/models/User";
import { products } from "@/data/products";

export async function GET(request) {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  // ?reset=true deletes all products first
  const reset = request.nextUrl.searchParams.get("reset") === "true";

  await connectDB();
  if (reset) await Product.deleteMany({});

  const ops = products.map(({ id, isNew, ...rest }) => ({
    updateOne: {
      filter: { slug: rest.slug },
      update: { $set: { ...rest, isNewArrival: isNew } },
      upsert: true,
    },
  }));
  const result = await Product.bulkWrite(ops);

  // Create the demo admin user
  const email = process.env.ADMIN_EMAIL?.toLowerCase().trim();
  const password = process.env.ADMIN_PASSWORD;
  let admin = "skipped (ADMIN_EMAIL / ADMIN_PASSWORD not set)";

  if (email && password) {
    const existing = await User.findOne({ email });
    if (existing) {
      if (existing.role !== "admin") {
        existing.role = "admin";
        await existing.save();
        admin = "existing user promoted to admin";
      } else {
        admin = "already exists";
      }
    } else {
      await User.create({
        name: "Store Admin",
        email,
        passwordHash: await bcrypt.hash(password, 10),
        role: "admin",
      });
      admin = "created";
    }
  }

  return NextResponse.json({
    ok: true,
    products: products.length,
    newProducts: result.upsertedCount,
    updatedProducts: result.modifiedCount,
    admin,
  });
}