import type { ReactNode } from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pharmacies à Harhoura - Liste et horaires en temps réel",
  description:
    "Découvrez la liste complète des pharmacies à Harhoura avec horaires d'ouverture en temps réel, adresses et contacts pour trouver rapidement celle qu'il vous faut.",
  keywords: [
    "pharmacies Harhoura",
    "horaires pharmacies Harhoura",
    "pharmacie ouverte Harhoura",
    "liste pharmacies Harhoura",
    "contact pharmacie Harhoura",
    "pharmacie localisation Harhoura",
  ],
  openGraph: {
    title: "Pharmacies à Harhoura - Horaires et contacts à jour",
    description:
      "Accédez à la liste actualisée des pharmacies à Harhoura avec horaires et contacts pour une localisation rapide.",
    url: "https://pharmacies-de-harhoura.vercel.app/pharmacies",
    images: [
      {
        url: "https://pharmacies-de-harhoura.vercel.app/og/pharmacies-og.png",
        width: 1200,
        height: 630,
        alt: "Liste des pharmacies à Harhoura avec horaires en temps réel",
      },
    ],
    siteName: "Pharmacies Harhoura",
    locale: "fr_FR",
    type: "website",
  },
  twitter: {
    title: "Pharmacies à Harhoura - Horaires en temps réel",
    description:
      "Liste des pharmacies ouvertes à Harhoura avec horaires, adresses et contacts pour une recherche rapide.",
    images: ["https://pharmacies-de-harhoura.vercel.app/og/pharmacies-og.png"],
  },
};

export default function PharmaciesLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <div className="min-h-screen bg-gray-50">{children}</div>;
}
