"use client";

import { useState } from "react";

export default function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  const onSubmit = (e) => {
    e.preventDefault();
    setDone(true);
    setEmail("");
  };

  return (
    <form onSubmit={onSubmit} className="max-w-md pt-2">
      <div className="flex items-stretch overflow-hidden rounded-sm border border-white/25 transition-colors focus-within:border-terracotta">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email address"
          aria-label="Email address"
          className="w-full bg-transparent px-4 py-3.5 text-base text-alabaster sm:text-sm placeholder:text-white/40 focus:outline-none"
        />
        <button type="submit" className="shrink-0 bg-alabaster px-6 text-xs font-medium uppercase tracking-[0.18em] text-obsidian transition-colors hover:bg-pop hover:text-alabaster">
          Join
        </button>
      </div>
      {done && <p role="status" className="mt-3 text-xs text-terracotta">You’re on the list. Your 10% code is STUDIO10.</p>}
    </form>
  );
}
