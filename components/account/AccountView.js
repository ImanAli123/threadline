"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { LogOut, Package, Heart } from "lucide-react";
import { useAuth } from "@/components/providers/AuthProvider";

export default function AccountView() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();

  // Visitors who are not logged in get sent to the login page
  useEffect(() => {
    if (!loading && !user) router.replace("/login");
  }, [loading, user, router]);

  if (loading || !user) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <div className="mb-6 h-10 w-64 animate-pulse rounded bg-black/10" />
        <div className="h-40 animate-pulse rounded-2xl bg-black/10" />
      </div>
    );
  }

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-widest text-black/50">My account</p>
          <h1 className="mt-1 font-display text-4xl">Hello, {user.name.split(" ")[0]}</h1>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 rounded-full border border-black/20 px-5 py-2.5 text-sm font-medium transition hover:border-brand"
        >
          <LogOut size={16} /> Log out
        </button>
      </div>

      <div className="mt-8 rounded-2xl bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider">Profile</h2>
        <dl className="space-y-3 text-sm">
          <div className="flex justify-between gap-4">
            <dt className="text-black/60">Name</dt>
            <dd>{user.name}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-black/60">Email</dt>
            <dd className="break-all">{user.email}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-black/60">Account type</dt>
            <dd>
              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold ${
                  user.role === "admin"
                    ? "bg-accent text-white"
                    : "bg-black/5 text-black/70"
                }`}
              >
                {user.role === "admin" ? "Admin" : "Customer"}
              </span>
            </dd>
          </div>
        </dl>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <Package className="mb-3 text-accent" />
          <h3 className="font-semibold">Orders</h3>
          <p className="mt-1 text-sm text-black/60">
            Your order history will appear here once checkout is ready.
          </p>
        </div>
        <Link
          href="/wishlist"
          className="rounded-2xl bg-white p-6 shadow-sm transition hover:shadow-md"
        >
          <Heart className="mb-3 text-accent" />
          <h3 className="font-semibold">Wishlist</h3>
          <p className="mt-1 text-sm text-black/60">View the items you saved.</p>
        </Link>
      </div>

      {user.role === "admin" && (
        <Link
          href="/admin"
          className="mt-6 block rounded-2xl bg-brand p-6 text-white transition hover:bg-accent"
        >
          <h3 className="font-semibold">Open admin panel →</h3>
          <p className="mt-1 text-sm text-white/70">
            Manage products and orders.
          </p>
        </Link>
      )}
    </div>
  );
}