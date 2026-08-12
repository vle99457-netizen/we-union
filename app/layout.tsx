import type { Metadata, Viewport } from "next";
import "@fontsource/bebas-neue/400.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://we-union-store.vle99457.chatgpt.site"),
  title: {
    default: "WE | Gear Made Personal",
    template: "%s | WE",
  },
  description: "Premium American sportswear with original embroidery and considered personalization.",
  applicationName: "WE",
  keywords: ["WE", "custom sportswear", "embroidered apparel", "personalized jerseys", "team apparel"],
  openGraph: {
    title: "WE | Gear Made Personal",
    description: "Premium American sportswear with original embroidery and considered personalization.",
    type: "website",
  },
  other: {
    "codex-preview": "development",
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0b0c0e",
  colorScheme: "dark light",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
