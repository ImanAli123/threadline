import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import connectDB from "@/lib/db";
import User from "@/models/User";
import { createToken, setAuthCookie } from "@/lib/auth";
import { serializeUser } from "@/lib/serialize";

const schema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(1).max(100),
});

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Please enter your email and password" },
      { status: 400 }
    );
  }

  const { email, password } = parsed.data;

  await connectDB();
  const user = await User.findOne({ email: email.toLowerCase() }).select(
    "+passwordHash"
  );

  // Same message for "no such user" and "wrong password" so attackers learn nothing
  const invalid = NextResponse.json(
    { error: "Invalid email or password" },
    { status: 401 }
  );

  if (!user) return invalid;
  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return invalid;

  const token = await createToken({ sub: String(user._id), role: user.role });
  await setAuthCookie(token);

  return NextResponse.json({ user: serializeUser(user) });
}