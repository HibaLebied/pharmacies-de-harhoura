import { Suspense } from "react";
import { PharmaciesList } from "@/components/pharmacies-list";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { Cross, Clock, Phone, Settings, Navigation } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import NearestPharmacyButton from "@/components/NearestPharmacyButton";
import HeroButton from "@/components/HeroButton";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "Pharmacies Harhoura - Trouvez la pharmacie la plus proche en temps réel",
  description:
    "Consultez les pharmacies ouvertes à Harhoura avec horaires à jour, localisation précise et contacts directs. Trouvez rapidement votre pharmacie de garde la plus proche.",
  keywords: [
    "pharmacie Harhoura",
    "pharmacie de garde Harhoura",
    "pharmacie ouverte maintenant Harhoura",
    "horaires pharmacie Harhoura",
    "localisation pharmacie Harhoura",
    "pharmacies de garde Harhoura",
    "urgence pharmacie Harhoura",
  ],
  openGraph: {
    title: "Pharmacies Harhoura - Trouvez la pharmacie ouverte la plus proche",
    description:
      "Liste des pharmacies ouvertes à Harhoura avec horaires en temps réel et localisation précise sur carte.",
    url: "https://pharmacies-de-harhoura.vercel.app/",
    images: [
      {
        url: "https://pharmacies-de-harhoura.vercel.app/og/pharmacies-og.png",
        width: 1200,
        height: 630,
        alt: "Pharmacies Harhoura - Trouvez la pharmacie la plus proche",
      },
    ],
    siteName: "Pharmacies Harhoura",
    locale: "fr_FR",
    type: "website",
  },
  twitter: {
    title: "Pharmacies Harhoura - Pharmacie ouverte la plus proche",
    description:
      "Trouvez rapidement une pharmacie ouverte à Harhoura avec horaires et localisation en temps réel.",
    images: ["https://pharmacies-de-harhoura.vercel.app/og/pharmacies-og.png"],
  },
};

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo + Titre */}
            <Link href="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-green-600 to-emerald-500 rounded-lg flex items-center justify-center">
                <Cross className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  Pharmacies Harhoura
                </h1>
                <p className="text-sm text-gray-600">
                  Trouvez votre pharmacie rapidement
                </p>
              </div>
            </Link>

            {/* Actions - cachées sur mobile */}
            <div className="hidden md:flex items-center space-x-6">
              <div className="flex items-center">
                {/* <Link href="/admin">
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs sm:text-sm"
                  >
                    <Settings className="h-4 w-4 mr-1 sm:mr-2" />
                    <span className="hidden sm:inline">Configuration</span>
                  </Button>
                </Link> */}
              </div>

              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                <span>Statut en temps réel</span>
              </div>
              <div className="flex items-center">
                <Phone className="h-4 w-4 mr-1" />
                <span>Contacts directs</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section
        className="container mx-auto px-4 py-6 sm:py-8"
        aria-label="Section d’introduction et recherche de pharmacie"
      >
        <div className="backdrop-blur-sm rounded-2xl lg:rounded-3xl p-6 lg:pt-12 lg:pb-6 lg:px-12 mb-8 lg:mb-12 border border-white/20 overflow-hidden">
          <div className="flex flex-col items-center text-center gap-8 lg:gap-12">
            {/* Contenu textuel */}
            <div className="w-full max-w-2xl">
              <div className="inline-flex items-center bg-gradient-to-r from-emerald-100 to-teal-100 px-4 py-2 rounded-full text-sm font-medium text-emerald-800 mb-6">
                <Navigation className="h-4 w-4 mr-2" aria-hidden="true" />
                Service de géolocalisation disponible
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                Trouvez votre{" "}
                <span className="bg-gradient-to-r from-green-600 to-green-800 bg-clip-text text-transparent">
                  pharmacie
                </span>{" "}
                la plus proche à Harhoura
              </h1>

              <p className="text-lg lg:text-xl text-gray-600 mb-8 leading-relaxed">
                Consultez en temps réel les horaires d'ouverture, la
                localisation précise, et contactez directement les pharmacies de
                garde à Harhoura.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <NearestPharmacyButton aria-label="Trouver la pharmacie la plus proche" />
                <HeroButton aria-label="Voir les pharmacies de Harhoura" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Liste des pharmacies */}
      <section className="bg-gray-50 py-16 sm:py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Pharmacies de garde disponibles à Harhoura
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Localisez en temps les pharmacies ouvertes à Harhoura et
              contactez-les facilement.
            </p>
          </div>

          <Suspense fallback={<PharmaciesListSkeleton />}>
            <div id="pharmacies-list">
              <PharmaciesList />
            </div>
          </Suspense>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t mt-8 sm:mt-16">
        <div className="container mx-auto px-4 py-6 sm:py-8">
          <div className="text-center text-gray-600 text-sm sm:text-base">
            <p>&copy; 2024 Harhoura.ma - Tous droits réservés</p>
            <p className="mt-2 text-xs sm:text-sm">
              Informations mises à jour en temps réel
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function PharmaciesListSkeleton() {
  return (
    <div className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="bg-white rounded-lg shadow-md p-4 sm:p-6 animate-pulse"
        >
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-3 sm:mb-4"></div>
          <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
          <div className="h-3 bg-gray-200 rounded w-2/3 mb-3 sm:mb-4"></div>
          <div className="h-8 bg-gray-200 rounded w-20"></div>
        </div>
      ))}
    </div>
  );
}
