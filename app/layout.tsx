import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://we-union-store.site"),
  title: {
    default: "WE UNION — Gear Made Personal",
    template: "%s — WE UNION",
  },
  description: "Original sportswear built around identity, achievement, and belonging. Original first. Personal after.",
  applicationName: "WE UNION",
  keywords: ["WE UNION", "personalized sportswear", "original jerseys", "custom team apparel"],
  openGraph: {
    title: "WE UNION — Gear Made Personal",
    description: "Original sportswear built around identity, achievement, and belonging.",
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
  themeColor: "#0a0a0a",
  colorScheme: "dark light",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
