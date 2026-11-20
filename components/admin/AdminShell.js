"use client";

import Link from "next/link";
import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, Package, ShoppingCart, Store, LogOut } from "lucide-react";
import { useAuth } from "@/components/providers/AuthProvider";

const nav = [
  ["/admin", "Dashboard", LayoutDashboard],
  ["/admin/products", "Products", Package],
  ["/admin/orders", "Orders", ShoppingCart],
];

export default function AdminShell({ children }) {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !user) router.replace("/login");
  }, [loading, user, router]);

  if (loading || !user) {
    return <div className="grid min-h-screen place-items-center text-sm text-charcoal">Loading…</div>;
  }

  if (user.role !== "admin") {
    return (
      <div className="mx-auto max-w-md px-4 py-28 text-center">
        <h1 className="font-serif text-3xl">Admin access only</h1>
        <p className="mt-3 text-charcoal">Your account does not have permission to view this area.</p>
        <Link href="/" className="mt-6 inline-block underline underline-offset-4">Back to the store</Link>
      </div>
    );
  }

  const isActive = (href) => (href === "/admin" ? pathname === "/admin" : pathname.startsWith(href));

  return (
    <div className="min-h-screen bg-alabaster lg:grid lg:grid-cols-[230px_1fr]">
      <aside className="bg-obsidian text-alabaster lg:sticky lg:top-0 lg:flex lg:h-screen lg:flex-col">
        <div className="px-4 py-4 lg:px-6 lg:py-8">
          <Link href="/admin" className="font-serif text-xl uppercase tracking-[0.2em]">Threadline</Link>
          <p className="text-[10px] uppercase tracking-[0.2em] text-white/50">Admin</p>
        </div>
        <nav className="flex gap-1 overflow-x-auto px-2 pb-3 lg:flex-1 lg:flex-col lg:px-3 lg:pb-0">
          {nav.map(([href, label, Icon]) => (
            <Link
              key={href}
              href={href}
              className={`flex shrink-0 items-center gap-2.5 rounded-sm px-3 py-2.5 text-sm transition-colors ${isActive(href) ? "bg-white/15" : "text-white/70 hover:bg-white/10"}`}
            >
              <Icon size={16} /> {label}
            </Link>
          ))}
          <Link href="/" className="flex shrink-0 items-center gap-2.5 rounded-sm px-3 py-2.5 text-sm text-white/70 hover:bg-white/10 lg:mt-auto">
            <Store size={16} /> View store
          </Link>
          <button
            onClick={async () => { await logout(); router.push("/"); }}
            className="flex shrink-0 items-center gap-2.5 rounded-sm px-3 py-2.5 text-sm text-white/70 hover:bg-white/10 lg:mb-6"
          >
            <LogOut size={16} /> Log out
          </button>
        </nav>
      </aside>
      <div className="min-w-0 p-4 sm:p-8">{children}</div>
    </div>
  );
}
