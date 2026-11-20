import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Order from "@/models/Order";
import { requireAdmin } from "@/lib/auth";

const STATUSES = ["pending", "confirmed", "shipped", "delivered", "cancelled"];

export async function GET(request) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const status = request.nextUrl.searchParams.get("status");
  const filter = STATUSES.includes(status) ? { status } : {};

  await connectDB();
  const docs = await Order.find(filter).sort({ createdAt: -1 }).limit(200).lean();

  return NextResponse.json({
    orders: docs.map((o) => ({
      id: String(o._id),
      orderNumber: o.orderNumber,
      createdAt: o.createdAt,
      customer: o.customer,
      shipping: o.shipping,
      items: o.items.map((i) => ({
        title: i.title, color: i.color, size: i.size, qty: i.qty, unitPrice: i.unitPrice,
      })),
      subtotal: o.subtotal,
      shippingFee: o.shippingFee,
      total: o.total,
      paymentMethod: o.paymentMethod,
      paymentStatus: o.paymentStatus,
      status: o.status,
    })),
  });
}
