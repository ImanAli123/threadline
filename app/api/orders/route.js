import { NextResponse } from "next/server";
import { randomInt } from "node:crypto";
import mongoose from "mongoose";
import { z } from "zod";
import connectDB from "@/lib/db";
import Product from "@/models/Product";
import Order from "@/models/Order";
import { getSession } from "@/lib/auth";
import { FREE_SHIPPING_THRESHOLD, SHIPPING_FEE } from "@/lib/utils";

const PROVINCES = [
  "Punjab", "Sindh", "Khyber Pakhtunkhwa", "Balochistan",
  "Islamabad Capital Territory", "Gilgit-Baltistan", "Azad Jammu & Kashmir",
];

const schema = z.object({
  customer: z.object({
    name: z.string().trim().min(2, "Please enter your full name").max(80),
    email: z.string().trim().email("Please enter a valid email address"),
    phone: z
      .string()
      .trim()
      .refine(
        (v) => /^(?:\+92|92|0)3\d{9}$/.test(v.replace(/[\s-]/g, "")),
        "Please enter a valid mobile number, for example 0300 1234567"
      ),
  }),
  shipping: z.object({
    address: z.string().trim().min(8, "Please enter your full delivery address").max(200),
    city: z.string().trim().min(2, "Please enter your city").max(60),
    province: z.enum(PROVINCES, { message: "Please choose your province" }),
    notes: z.string().trim().max(300).optional().default(""),
  }),
  paymentMethod: z.enum(["cod", "bank", "wallet"], { message: "Please choose a payment method" }),
  items: z
    .array(
      z.object({
        slug: z.string().min(1).max(100),
        color: z.string().min(1).max(40),
        size: z.string().min(1).max(20),
        qty: z.number().int().min(1).max(10),
      })
    )
    .min(1, "Your cart is empty")
    .max(30),
});

const fail = (message, status = 400) => NextResponse.json({ error: message }, { status });

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return fail("Invalid request");
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) return fail(parsed.error.issues[0].message);
  const { customer, shipping, paymentMethod, items } = parsed.data;

  await connectDB();

  // Never trust prices from the browser: load them from the database
  const slugs = [...new Set(items.map((i) => i.slug))];
  const docs = await Product.find({ slug: { $in: slugs }, active: true }).lean();
  const bySlug = new Map(docs.map((d) => [d.slug, d]));

  const lines = [];
  for (const it of items) {
    const p = bySlug.get(it.slug);
    if (!p) return fail("An item in your cart is no longer available. Please remove it and try again.");
    if (!p.sizes.includes(it.size) || !p.colors.some((c) => c.name === it.color)) {
      return fail(`The selected size or colour for "${p.title}" is not available.`);
    }
    lines.push({
      product: p._id,
      slug: p.slug,
      title: p.title,
      color: it.color,
      size: it.size,
      qty: it.qty,
      unitPrice: p.discountPrice ?? p.price,
    });
  }

  const subtotal = lines.reduce((sum, l) => sum + l.unitPrice * l.qty, 0);
  const shippingFee = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
  const total = subtotal + shippingFee;

  const session = await getSession();
  const userId = session?.sub && mongoose.isValidObjectId(session.sub) ? session.sub : null;

  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const order = await Order.create({
        orderNumber: `TL-${randomInt(100000, 1000000)}`,
        user: userId,
        customer: { ...customer, phone: customer.phone.replace(/[\s-]/g, "") },
        shipping,
        items: lines,
        subtotal,
        shippingFee,
        total,
        paymentMethod,
      });
      // Reduce stock (best effort)
      try {
        await Product.bulkWrite(
          lines.map((l) => ({
            updateOne: { filter: { _id: l.product, stock: { $gte: l.qty } }, update: { $inc: { stock: -l.qty } } },
          }))
        );
      } catch {}
      return NextResponse.json(
        { order: { orderNumber: order.orderNumber, total: order.total } },
        { status: 201 }
      );
    } catch (err) {
      if (err?.code === 11000) continue; // order number collision: try another
      return fail("Could not place your order. Please try again.", 500);
    }
  }
  return fail("Could not place your order. Please try again.", 500);
}
