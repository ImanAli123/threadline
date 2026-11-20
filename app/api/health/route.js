import { NextResponse } from "next/server";
import mongoose from "mongoose";

// Development-only checker. Delete this file before you deploy.
export async function GET(request) {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  const path = request.nextUrl.pathname;

  const env = {
    MONGODB_URI: Boolean(process.env.MONGODB_URI),
    JWT_SECRET: Boolean(process.env.JWT_SECRET),
    ADMIN_EMAIL: Boolean(process.env.ADMIN_EMAIL),
    ADMIN_PASSWORD: Boolean(process.env.ADMIN_PASSWORD),
  };

  const uri = process.env.MONGODB_URI || "";
  const uriShape = uri
    ? {
        scheme: uri.split("://")[0],
        hasPlaceholderLeft: uri.includes("<") || uri.includes(">"),
        hasDatabaseName: /\/[A-Za-z0-9_-]+\?/.test(uri),
        hasQuotesOrSpaces: /["'\s]/.test(uri),
      }
    : null;

  let db;
  if (!uri) {
    db = { ok: false, message: "MONGODB_URI is empty or not loaded" };
  } else {
    let conn;
    try {
      conn = await mongoose.createConnection(uri, { serverSelectionTimeoutMS: 8000 }).asPromise();
      db = { ok: true, database: conn.name };
    } catch (e) {
      db = { ok: false, message: e.message, code: e.code ?? null };
    } finally {
      await conn?.close().catch(() => {});
    }
  }
  return NextResponse.json({ path, env, uriShape, db });
}
