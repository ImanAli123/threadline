import { Mail, MessageCircle, Clock, MapPin } from "lucide-react";
import PageShell from "@/components/layout/PageShell";
import ContactForm from "@/components/layout/ContactForm";

export const metadata = {
  title: "Contact | Threadline",
  description: "Get in touch with the Threadline team.",
};

// Demo details: replace these with your real contact information
const CONTACT = {
  email: "hello@threadline.example",
  phone: "+92 300 0000000",
  whatsapp: "923000000000",
  hours: "Monday to Saturday, 10am to 7pm",
  address: "Demo store, Pakistan",
};

export default function ContactPage() {
  const rows = [
    [Mail, "Email", CONTACT.email, `mailto:${CONTACT.email}`],
    [MessageCircle, "WhatsApp", CONTACT.phone, `https://wa.me/${CONTACT.whatsapp}`],
    [Clock, "Hours", CONTACT.hours],
    [MapPin, "Address", CONTACT.address],
  ];

  return (
    <PageShell eyebrow="Contact" title="We would love to hear from you." intro="Questions about an order, sizing or anything else? Send us a message and we will reply within one working day.">
      <div className="grid gap-12 lg:grid-cols-2">
        <ul className="space-y-6">
          {rows.map(([Icon, label, value, href]) => (
            <li key={label} className="flex gap-4">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-stone"><Icon size={18} /></span>
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-charcoal">{label}</p>
                {href ? (
                  <a href={href} className="font-medium underline-offset-4 hover:text-terracotta hover:underline">{value}</a>
                ) : (
                  <p className="font-medium">{value}</p>
                )}
              </div>
            </li>
          ))}
          <li className="text-xs text-charcoal">These contact details are placeholders for the demo store.</li>
        </ul>
        <ContactForm email={CONTACT.email} />
      </div>
    </PageShell>
  );
}
