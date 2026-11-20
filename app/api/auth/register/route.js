import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import connectDB from "@/lib/db";
import User from "@/models/User";
import { createToken, setAuthCookie } from "@/lib/auth";
import { serializeUser } from "@/lib/serialize";

const schema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(60),
  email: z.string().trim().email("Please enter a valid email"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(100, "Password is too long"),
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
      { error: parsed.error.issues[0].message },
      { status: 400 }
    );
  }

  const { name, email, password } = parsed.data;

  await connectDB();

  const exists = await User.findOne({ email: email.toLowerCase() });
  if (exists) {
    return NextResponse.json(
      { error: "An account with this email already exists" },
      { status: 409 }
    );
  }

  try {
    // Role is always "customer" here, so nobody can sign up as admin
    const user = await User.create({
      name,
      email,
      passwordHash: await bcrypt.hash(password, 10),
      role: "customer",
    });

    const token = await createToken({
      sub: String(user._id),
      role: user.role,
    });
    await setAuthCookie(token);

    return NextResponse.json({ user: serializeUser(user) }, { status: 201 });
  } catch (err) {
    if (err?.code === 11000) {
      return NextResponse.json(
        { error: "An account with this email already exists" },
        { status: 409 }
      );
    }
    return NextResponse.json({ error: "Could not create account" }, { status: 500 });
  }
}