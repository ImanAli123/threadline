import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { z } from "zod";
import connectDB from "@/lib/db";
import Order from "@/models/Order";
import { requireAdmin } from "@/lib/auth";

const schema = z
  .object({
    status: z.enum(["pending", "confirmed", "shipped", "delivered", "cancelled"]).optional(),
    paymentStatus: z.enum(["unpaid", "paid"]).optional(),
  })
  .refine((d) => d.status || d.paymentStatus, { message: "Nothing to update" });

export async function PATCH(request, { params }) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const { id } = await params;
  if (!mongoose.isValidObjectId(id)) return NextResponse.json({ error: "Order not found" }, { status: 404 });

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });

  await connectDB();
  const doc = await Order.findByIdAndUpdate(id, { $set: parsed.data }, { new: true });
  if (!doc) return NextResponse.json({ error: "Order not found" }, { status: 404 });
  return NextResponse.json({ ok: true });
}
