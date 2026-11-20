"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, X, ShoppingBag, User, Heart } from "lucide-react";
import { useStore } from "@/components/providers/StoreProvider";
import { useAuth } from "@/components/providers/AuthProvider";

const links = [
  { href: "/shop?category=new", label: "New Arrivals" },
  { href: "/shop?category=women", label: "Women" },
  { href: "/shop?category=men", label: "Men" },
  { href: "/shop?category=accessories", label: "Accessories" },
  { href: "/#lookbook", label: "Lookbook" },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const { cartCount, wishlist, openCart } = useStore();
  const { user } = useAuth();
  const account = user ? "/account" : "/login";

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-stone bg-alabaster/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between px-4 sm:h-20 sm:px-8">
        <div className="flex flex-1 items-center gap-6 lg:gap-8">
          <button className="-ml-2 p-2 hover:text-pop lg:hidden" onClick={() => setOpen(true)} aria-label="Open menu">
            <Menu size={20} strokeWidth={1.5} />
          </button>
          <nav className="hidden items-center gap-7 text-[13px] font-medium tracking-wide text-obsidian/80 lg:flex">
            {links.map((l) => (
              <Link key={l.label} href={l.href} className="transition-colors hover:text-pop">{l.label}</Link>
            ))}
          </nav>
        </div>

        <Link href="/" className="shrink-0 font-serif text-2xl font-semibold uppercase tracking-[0.26em] sm:text-[28px]">
          Threadline
        </Link>

        <div className="flex flex-1 items-center justify-end gap-1 sm:gap-4">
          <Link href="/wishlist" aria-label="Wishlist" className="relative hidden p-2 hover:text-pop sm:inline-flex">
            <Heart size={18} strokeWidth={1.5} />
            {wishlist.length > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-pop px-1 text-[10px] font-medium text-white">{wishlist.length}</span>
            )}
          </Link>
          <Link href={account} aria-label={user ? "My account" : "Log in"} className="hidden p-2 hover:text-pop sm:inline-flex">
            <User size={18} strokeWidth={1.5} />
          </Link>
          <button onClick={openCart} aria-label="Open bag" className="flex items-center gap-1.5 p-2 hover:text-pop">
            <ShoppingBag size={18} strokeWidth={1.5} />
            <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-pop px-1.5 text-[11px] font-medium text-white">{cartCount}</span>
          </button>
        </div>
      </div>

      <div className={`fixed inset-0 z-50 lg:hidden ${open ? "" : "pointer-events-none"}`}>
        <div onClick={() => setOpen(false)} className={`absolute inset-0 bg-obsidian/40 transition-opacity ${open ? "opacity-100" : "opacity-0"}`} />
        <aside inert={!open} className={`relative flex h-full w-80 max-w-[85vw] flex-col justify-between bg-alabaster p-6 shadow-2xl transition-transform duration-300 ${open ? "translate-x-0" : "-translate-x-full"}`}>
          <div>
            <div className="flex items-center justify-between border-b border-stone pb-6">
              <span className="font-serif text-xl font-semibold uppercase tracking-[0.24em]">Threadline</span>
              <button onClick={() => setOpen(false)} aria-label="Close menu" className="p-2 hover:text-pop"><X size={20} /></button>
            </div>
            <nav className="mt-8 flex flex-col gap-5 font-serif text-2xl">
              {links.map((l) => (
                <Link key={l.label} href={l.href} onClick={() => setOpen(false)} className="hover:text-pop">{l.label}</Link>
              ))}
            </nav>
          </div>
          <div className="space-y-3 border-t border-stone pt-6 text-sm">
            <Link href={account} onClick={() => setOpen(false)} className="block hover:text-pop">{user ? "My account" : "Log in / Register"}</Link>
            <Link href="/wishlist" onClick={() => setOpen(false)} className="block hover:text-pop">Wishlist</Link>
          </div>
        </aside>
      </div>
    </header>
  );
}