import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";
import { getSession } from "@/lib/auth";
import { serializeUser } from "@/lib/serialize";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ user: null });

  await connectDB();
  const user = await User.findById(session.sub).lean();
  if (!user) return NextResponse.json({ user: null });

  return NextResponse.json({ user: serializeUser(user) });
}