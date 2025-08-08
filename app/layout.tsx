import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Pharmacie de Garde Harhoura | Horaires & Localisation",
  description:
    "Trouvez facilement une pharmacie de garde à Harhoura : horaires en temps réel, localisation sur la carte et contacts directs.",
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
      url: "https://pharmacies-harhoura-project.vercel.app/",
    },
  ],
  creator: "Pharmacies Harhoura",
  metadataBase: new URL("https://pharmacies-harhoura-project.vercel.app/"),
  openGraph: {
    title: "Pharmacies de Garde Harhoura - Ouvertes Maintenant",
    description:
      "Consultez la liste des pharmacies ouvertes à Harhoura avec horaires à jour et localisation précise.",
    url: "https://pharmacies-harhoura-project.vercel.app/",
    siteName: "Pharmacies Harhoura",
    images: [
      {
        url: "https://pharmacies-harhoura-project.vercel.app/og/og-image.png",
        width: 1200,
        height: 630,
        alt: "Pharmacies de Garde Harhoura - Ouvertes Maintenant",
      },
    ],
    locale: "fr_FR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Pharmacies de Garde Harhoura",
    description:
      "Trouvez une pharmacie de garde à Harhoura. Horaires et localisation mis à jour en temps réel.",
    images: ["https://pharmacies-harhoura-project.vercel.app/og/og-image.png"],
    creator: "@harhoura_ma",
  },
  icons: {
    icon: "/icons/favicon.ico", // plus simple
    apple: "/icons/apple-touch-icon.png",
    shortcut: "/icons/favicon.ico",
  },
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
