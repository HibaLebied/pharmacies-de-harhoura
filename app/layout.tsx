import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Pharmacies Harhoura - Horaires & Localisation en temps réel",
  description:
    "Trouvez facilement les pharmacies ouvertes à Harhoura, avec horaires, localisation et contacts directs.",
  keywords: [
    "pharmacie de garde Harhoura",
    "pharmacie ouverte maintenant Harhoura",
    "horaires pharmacie Harhoura",
    "localisation pharmacie Harhoura",
    "pharmacie urgence Harhoura",
    "liste pharmacies Harhoura",
    "Harhoura.ma",
  ],
  authors: [
    {
      name: "Pharmacies Harhoura",
      url: "https://pharmacies-de-harhoura.vercel.app/",
    },
  ],
  creator: "Pharmacies Harhoura",
  metadataBase: new URL("https://pharmacies-de-harhoura.vercel.app/"),
  openGraph: {
    siteName: "Pharmacies Harhoura",
    locale: "fr_FR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    creator: "@harhoura_ma",
  },
  icons: {
    icon: "/icons/favicon.ico",
    apple: "/icons/apple-touch-icon.png",
    shortcut: "/icons/favicon.ico",
  },
};

export const viewport = {
  themeColor: "#0A9D58", // Vert pharmacie
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className={inter.className}>
        <div className="min-h-screen bg-gray-50">{children}</div>
      </body>
    </html>
  );
}
