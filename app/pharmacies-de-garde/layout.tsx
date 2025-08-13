import type { ReactNode } from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pharmacies de Garde à Harhoura - Ouvertes Maintenant",
  description:
    "Consultez la liste des pharmacies de garde actuellement ouvertes à Harhoura avec horaires en temps réel, adresses et contacts directs.",
  keywords: [
    "pharmacie de garde Harhoura",
    "pharmacies ouvertes Harhoura",
    "pharmacie urgence Harhoura",
    "horaires pharmacie de garde Harhoura",
    "localisation pharmacie de garde Harhoura",
  ],
  openGraph: {
    title: "Pharmacies de Garde à Harhoura - Ouvertes Maintenant",
    description:
      "Trouvez rapidement une pharmacie de garde ouverte à Harhoura avec horaires et localisation à jour.",
    url: "https://pharmacies-de-harhoura.vercel.app/pharmaciesDeGarde",
    images: [
      {
        url: "https://pharmacies-de-harhoura.vercel.app/og/pharmaciesDeGarde-og.png",
        width: 1200,
        height: 630,
        alt: "Pharmacies de Garde à Harhoura - Ouvertes Maintenant",
      },
    ],
    siteName: "Pharmacies Harhoura",
    locale: "fr_FR",
    type: "website",
  },
  twitter: {
    title: "Pharmacies de Garde à Harhoura",
    description:
      "Liste des pharmacies de garde ouvertes à Harhoura avec horaires, adresses et contacts pour une recherche rapide.",
    images: [
      "https://pharmacies-de-harhoura.vercel.app/og/pharmaciesDeGarde-og.png",
    ],
  },
};

export default function PharmaciesLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <div className="min-h-screen bg-gray-50">{children}</div>;
}
