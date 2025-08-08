"use client";

import { useState, useEffect } from "react";
import type { Pharmacy, PharmacyWithStatus } from "@/lib/types";
import { getCurrentTime, getCurrentDayStatus } from "@/lib/pharmacy-utils";
import { PharmacyCard } from "@/components/pharmacy-card-list";
import { SearchBar } from "@/components/search-bar";
import { Button } from "@/components/ui/button";
import { Clock, RefreshCw, AlertCircle, MapPin, Home } from "lucide-react";
import Link from "next/link";
import { pharmacyService } from "@/lib/pharmacy-service";
import { DemoBanner } from "@/components/demo-banner";
import { DEMO_PHARMACIES } from "@/lib/mock-data";

export default function PharmacieDeGardePage() {
  const [openPharmacies, setOpenPharmacies] = useState<PharmacyWithStatus[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [databaseError, setDatabaseError] = useState(false);

  useEffect(() => {
    fetchOpenPharmacies();
    const interval = setInterval(fetchOpenPharmacies, 60000);
    return () => clearInterval(interval);
  }, []);

  const fetchOpenPharmacies = async () => {
    try {
      setDatabaseError(false);
      const { data, isDemo, error } = await pharmacyService.getPharmacies();
      const isFallbackToDemo = isDemo && data === DEMO_PHARMACIES;

      if (isFallbackToDemo || error) {
        setDatabaseError(true);
      }

      const pharmaciesWithStatus: PharmacyWithStatus[] = data
        .map((pharmacy: Pharmacy) => {
          const status = getCurrentDayStatus(pharmacy.opening_hours);
          return {
            ...pharmacy,
            isOpen: status.isOpen,
            nextOpenTime: status.nextChange,
          };
        })
        .filter((pharmacy) => pharmacy.isOpen);

      setOpenPharmacies(pharmaciesWithStatus);
      setLastUpdate(new Date());
    } catch (error) {
      console.error(
        "Erreur lors du chargement des pharmacies de garde:",
        error
      );
      setDatabaseError(true);
    } finally {
      setLoading(false);
    }
  };

  const filteredPharmacies = openPharmacies.filter((pharmacy) => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    return (
      pharmacy.name.toLowerCase().includes(query) ||
      pharmacy.address.toLowerCase().includes(query)
    );
  });

  const currentTime = getCurrentTime();

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
            <p className="text-gray-600">
              Recherche des pharmacies ouvertes...
            </p>
          </div>
        </div>
      </div>
    );
  }

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
        <Button
          onClick={fetchOpenPharmacies}
          variant="outline"
          disabled={loading}
        >
          <Home className="h-4 w-4 mr-2" />
          Acceuil
        </Button>
        <Link href="/pharmacies">
          <Button variant="outline">
            <MapPin className="h-4 w-4 mr-2" />
            Voir toutes les pharmacies
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
          openPharmacies.length > 0
            ? "bg-green-50 border border-green-200"
            : "bg-orange-50 border border-orange-200"
        }`}
      >
        <div className="flex items-center gap-3">
          {openPharmacies.length > 0 ? (
            <>
              <div className="h-3 w-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="font-medium text-green-800">
                {openPharmacies.length} pharmacie
                {openPharmacies.length > 1 ? "s" : ""} ouverte
                {openPharmacies.length > 1 ? "s" : ""} maintenant
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
          {openPharmacies.length === 0 ? (
            <>
              <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Aucune pharmacie ouverte
              </h3>
              <p className="text-gray-600 mb-6">
                Toutes les pharmacies sont actuellement fermées. Consultez les
                horaires pour connaître les prochaines ouvertures.
              </p>
              <Link href="/pharmacie">
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
