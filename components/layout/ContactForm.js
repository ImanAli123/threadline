"use client";

import { useState } from "react";

const input =
  "w-full rounded-sm border border-taupe bg-white px-4 py-3 text-base outline-none transition focus:border-obsidian sm:text-sm";

export default function ContactForm({ email }) {
  const [form, setForm] = useState({ name: "", from: "", message: "" });
  const [sent, setSent] = useState(false);
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = (e) => {
    e.preventDefault();
    const subject = encodeURIComponent(`Message from ${form.name}`);
    const body = encodeURIComponent(`${form.message}\n\nFrom: ${form.name} (${form.from})`);
    window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
    setSent(true);
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      <div>
        <label htmlFor="c-name" className="mb-1.5 block text-sm font-medium">Your name</label>
        <input id="c-name" required autoComplete="name" value={form.name} onChange={set("name")} className={input} />
      </div>
      <div>
        <label htmlFor="c-email" className="mb-1.5 block text-sm font-medium">Your email</label>
        <input id="c-email" required type="email" autoComplete="email" value={form.from} onChange={set("from")} className={input} />
      </div>
      <div>
        <label htmlFor="c-msg" className="mb-1.5 block text-sm font-medium">Message</label>
        <textarea id="c-msg" required rows={5} value={form.message} onChange={set("message")} className={input} />
      </div>
      <button type="submit" className="w-full rounded-sm bg-obsidian py-4 text-xs font-medium uppercase tracking-[0.2em] text-alabaster transition-colors hover:bg-pop">
        Send message
      </button>
      {sent && <p role="status" className="text-sm text-charcoal">Your email app should open with the message ready to send.</p>}
    </form>
  );
}
