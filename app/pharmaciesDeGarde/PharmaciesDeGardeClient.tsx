"use client";

import { useEffect, useState } from "react";
import type { PharmacyWithStatus } from "@/lib/types";
import { getCurrentTime } from "@/lib/pharmacy-utils";
import { PharmacyCard } from "@/components/pharmacy-card-list";
import { SearchBar } from "@/components/search-bar";
import { Button } from "@/components/ui/button";
import { Clock, RefreshCw, AlertCircle, MapPin, Home } from "lucide-react";
import Link from "next/link";
import { DemoBanner } from "@/components/demo-banner";

type Props = {
  pharmacies: PharmacyWithStatus[];
  databaseError: boolean;
};

export default function PharmaciesDeGardeClient({
  pharmacies,
  databaseError,
}: Props) {
  const [searchQuery, setSearchQuery] = useState("");
  const [lastUpdate] = useState(new Date()); // snapshot au chargement
  const [currentTime, setCurrentTime] = useState("");

  // Initialise currentTime uniquement côté client pour éviter le mismatch SSR
  useEffect(() => {
    setCurrentTime(getCurrentTime());
  }, []);

  const filteredPharmacies = pharmacies.filter((pharmacy) => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    return (
      pharmacy.name.toLowerCase().includes(query) ||
      pharmacy.address.toLowerCase().includes(query)
    );
  });

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <DemoBanner showDatabaseError={databaseError} />

      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Clock className="h-8 w-8 text-green-600" />
          <h1 className="text-3xl font-bold text-gray-900">
            Pharmacies de Garde
          </h1>
        </div>

        <p className="text-gray-600 mb-4">
          Pharmacies actuellement ouvertes à Harhoura
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-gray-500">
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>Heure actuelle: {currentTime}</span>
          </div>
          <div className="flex items-center gap-1">
            <RefreshCw className="h-4 w-4" />
            <span>
              Dernière mise à jour:{" "}
              {lastUpdate.toLocaleTimeString("fr-FR", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap justify-center gap-3 mb-8">
        <Link href="/pharmacies">
          <Button className="bg-green-600 hover:bg-green-700">
            <MapPin className="h-4 w-4 mr-2" />
            Voir toutes les pharmacies
          </Button>
        </Link>
        <Link href="/">
          <Button variant="outline">
            <Home className="h-4 w-4 mr-2" />
            Accueil
          </Button>
        </Link>
      </div>

      {/* Search */}
      <div className="mb-8">
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Rechercher parmi les pharmacies ouvertes..."
        />
      </div>

      {/* Status Banner */}
      <div
        className={`p-4 rounded-lg mb-8 ${
          pharmacies.length > 0
            ? "bg-green-50 border border-green-200"
            : "bg-orange-50 border border-orange-200"
        }`}
      >
        <div className="flex items-center gap-3">
          {pharmacies.length > 0 ? (
            <>
              <div className="h-3 w-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="font-medium text-green-800">
                {pharmacies.length} pharmacie
                {pharmacies.length > 1 ? "s" : ""} ouverte
                {pharmacies.length > 1 ? "s" : ""} maintenant
              </span>
            </>
          ) : (
            <>
              <AlertCircle className="h-5 w-5 text-orange-600" />
              <span className="font-medium text-orange-800">
                Aucune pharmacie ouverte actuellement
              </span>
            </>
          )}
        </div>
      </div>

      {/* Results */}
      {filteredPharmacies.length === 0 ? (
        <div className="text-center py-12">
          {pharmacies.length === 0 ? (
            <>
              <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Aucune pharmacie ouverte
              </h3>
              <p className="text-gray-600 mb-6">
                Toutes les pharmacies sont actuellement fermées. Consultez les
                horaires pour connaître les prochaines ouvertures.
              </p>
              <Link href="/pharmacies">
                <Button>Voir toutes les pharmacies</Button>
              </Link>
            </>
          ) : (
            <>
              <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Aucun résultat
              </h3>
              <p className="text-gray-600">
                Aucune pharmacie ouverte ne correspond à votre recherche
              </p>
            </>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredPharmacies.map((pharmacy) => (
            <PharmacyCard
              key={pharmacy.id}
              pharmacy={pharmacy}
              showSchedule={false}
            />
          ))}
        </div>
      )}

      {/* Emergency Info */}
      <div className="mt-12 p-6 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="font-medium text-blue-900 mb-2">
              En cas d'urgence médicale
            </h3>
            <p className="text-blue-800 text-sm">
              Si aucune pharmacie n'est ouverte et que vous avez besoin de
              médicaments en urgence, contactez le SAMU (15) ou rendez-vous aux
              urgences de l'hôpital le plus proche.
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-8 text-center text-sm text-gray-500">
        <p>
          Les informations sont mises à jour automatiquement toutes les minutes.
          En cas de doute, contactez directement la pharmacie.
        </p>
      </div>
    </div>
  );
}
