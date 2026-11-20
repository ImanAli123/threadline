import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Product from "@/models/Product";
import Order from "@/models/Order";
import User from "@/models/User";
import { requireAdmin } from "@/lib/auth";

export async function GET() {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  await connectDB();

  const since = new Date(Date.now() - 8 * 24 * 60 * 60 * 1000);
  const notCancelled = { status: { $ne: "cancelled" } };

  const [productCount, orderCount, customerCount, revenue, byStatus, daily, recent, lowStock] = await Promise.all([
    Product.countDocuments(),
    Order.countDocuments(),
    User.countDocuments({ role: "customer" }),
    Order.aggregate([{ $match: notCancelled }, { $group: { _id: null, total: { $sum: "$total" } } }]),
    Order.aggregate([{ $group: { _id: "$status", count: { $sum: 1 } } }]),
    Order.aggregate([
      { $match: { ...notCancelled, createdAt: { $gte: since } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt", timezone: "Asia/Karachi" } },
          total: { $sum: "$total" },
          orders: { $sum: 1 },
        },
      },
    ]),
    Order.find().sort({ createdAt: -1 }).limit(5).select("orderNumber customer.name total status createdAt").lean(),
    Product.find({ stock: { $lt: 10 } }).sort({ stock: 1 }).limit(5).select("title stock").lean(),
  ]);

  return NextResponse.json({
    productCount,
    orderCount,
    customerCount,
    revenue: revenue[0]?.total ?? 0,
    byStatus: Object.fromEntries(byStatus.map((s) => [s._id, s.count])),
    daily: daily.map((d) => ({ date: d._id, total: d.total, orders: d.orders })),
    recent: recent.map((o) => ({
      id: String(o._id),
      orderNumber: o.orderNumber,
      name: o.customer?.name,
      total: o.total,
      status: o.status,
      createdAt: o.createdAt,
    })),
    lowStock: lowStock.map((p) => ({ id: String(p._id), title: p.title, stock: p.stock })),
  });
}
