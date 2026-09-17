import type { Metadata } from "next";

import "./globals.css";
import { bakerySchema } from "@/lib/seo";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://praters-bakery.vercel.app"),
  title: "Praters Bakery",
  description: "Simple & Southern bakery in Rock Hill, SC. Pre-order cinnamon rolls, pies, cakes and cookies for Tuesday to Friday pickup.",
  icons: { icon: "/assets/favicon.svg" },
  openGraph: {
    title: "Praters Bakery",
    description: "Simple & Southern bakery in Rock Hill, SC.",
    images: ["/assets/og.jpg"],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/assets/og.jpg"],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Figtree:wght@400;500;600;700&family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700&display=swap"
        />
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(bakerySchema) }}
        />
      </head>
      <body className="pb-body">{children}</body>
    </html>
  );
}
