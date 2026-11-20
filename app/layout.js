import { Cormorant_Garamond, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/providers/AuthProvider";
import { StoreProvider } from "@/components/providers/StoreProvider";
import AnnouncementBar from "@/components/layout/AnnouncementBar";
import Footer from "@/components/layout/Footer";
import Chrome from "@/components/layout/Chrome";

const serif = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-serif-head",
});
const sans = Plus_Jakarta_Sans({ subsets: ["latin"], display: "swap", variable: "--font-sans-body" });

export const metadata = {
  title: "Threadline | Modern Everyday Clothing",
  description:
    "Threadline makes clean, lasting clothing from heavyweight cotton, linen and wool. Free delivery over Rs 7,000.",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${serif.variable} ${sans.variable}`}>
      <body className="font-sans antialiased">
        <AuthProvider>
          <StoreProvider>
            <Chrome announcement={<AnnouncementBar />} footer={<Footer />}>
              {children}
            </Chrome>
          </StoreProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
