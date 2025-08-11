"use client";

import { useState, useEffect, useMemo } from "react";
import type { Pharmacy, PharmacyWithStatus } from "@/lib/types";
import { isPharmacyOpenOnDay, getCurrentDayStatus } from "@/lib/pharmacy-utils";
import { PharmacyCard } from "@/components/pharmacy-card-list";
import { SearchBar } from "@/components/search-bar";
import { DayFilter } from "@/components/day-filter";
import { Button } from "@/components/ui/button";
import { MapPin, Clock, Filter, Home } from "lucide-react";
import Link from "next/link";
import { pharmacyService } from "@/lib/pharmacy-service";
import { DemoBanner } from "@/components/demo-banner";

export default function PharmaciesPage() {
  const [pharmacies, setPharmacies] = useState<PharmacyWithStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [databaseError, setDatabaseError] = useState(false);

  useEffect(() => {
    fetchPharmaciesData();
  }, []);

  const fetchPharmaciesData = async () => {
    try {
      console.log("=== Début chargement pharmacies ===");
      setDatabaseError(false);

      const { data, error, isDemo } = await pharmacyService.getPharmacies();

      console.log("Mode démo :", isDemo);
      console.log("Erreur Supabase :", error);
      console.log("Données brutes reçues :", data);

      if (error) {
        console.warn("⚠️ Erreur détectée, basculement en mode erreur.");
        setDatabaseError(true);
        return;
      }

      const pharmaciesWithStatus: PharmacyWithStatus[] = data.map(
        (pharmacy: Pharmacy) => {
          const status = getCurrentDayStatus(pharmacy.opening_hours);
          return {
            ...pharmacy,
            isOpen: status.isOpen,
            nextOpenTime: status.nextChange,
          };
        }
      );

      console.log("Pharmacies après calcul status :", pharmaciesWithStatus);

      setPharmacies(pharmaciesWithStatus);
    } catch (error) {
      console.error("❌ Erreur lors du chargement des pharmacies:", error);
      setDatabaseError(true);
    } finally {
      console.log("=== Fin chargement pharmacies ===");
      setLoading(false);
    }
  };

  const filteredPharmacies = useMemo(() => {
    let filtered = pharmacies;

    // Filtrer par recherche
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (pharmacy) =>
          pharmacy.name.toLowerCase().includes(query) ||
          pharmacy.address.toLowerCase().includes(query)
      );
    }

    // // Filtrer par jour
    // if (selectedDay) {
    //   filtered = filtered.filter((pharmacy) =>
    //     isPharmacyOpenOnDay(
    //       pharmacy.opening_hours,
    //       selectedDay as keyof typeof pharmacy.opening_hours
    //     )
    //   );
    // }

    // Trier
    // if (!selectedDay) {
    //   return filtered.sort((a, b) => {
    //     if (a.isOpen && !b.isOpen) return -1;
    //     if (!a.isOpen && b.isOpen) return 1;
    //     return a.name.localeCompare(b.name);
    //   });
    // }

    return filtered.sort((a, b) => a.name.localeCompare(b.name));
  }, [pharmacies, searchQuery, selectedDay]);

  const openPharmacies = pharmacies.filter((p) => p.isOpen);
  const closedPharmacies = pharmacies.filter((p) => !p.isOpen);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Chargement des pharmacies...</p>
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
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Pharmacies de Harhoura
        </h1>
        <p className="text-gray-600 mb-6">
          Trouvez facilement les pharmacies avec leurs horaires en temps réel
        </p>

        {/* Stats - jour actuel */}
        {!selectedDay && (
          <div className="flex flex-wrap justify-center gap-4 mb-6">
            <div className="bg-green-100 text-green-800 px-4 py-2 rounded-lg">
              <span className="font-semibold">{openPharmacies.length}</span>{" "}
              ouverte
              {openPharmacies.length > 1 ? "s" : ""}
            </div>
            <div className="bg-red-100 text-red-800 px-4 py-2 rounded-lg">
              <span className="font-semibold">{closedPharmacies.length}</span>{" "}
              fermée
              {closedPharmacies.length > 1 ? "s" : ""}
            </div>
          </div>
        )}

        {/* Stats - jour sélectionné */}
        {/* {selectedDay && (
          <div className="flex flex-wrap justify-center gap-4 mb-6">
            <div className="bg-blue-100 text-blue-800 px-4 py-2 rounded-lg">
              <span className="font-semibold">{filteredPharmacies.length}</span>{" "}
              pharmacie
              {filteredPharmacies.length > 1 ? "s" : ""} ouverte
              {filteredPharmacies.length > 1 ? "s" : ""} ce jour
            </div>
          </div>
        )} */}

        {/* Quick Actions */}
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          <Link href="/pharmaciesDeGarde">
            <Button className="bg-green-600 hover:bg-green-700">
              <Clock className="h-4 w-4 mr-2" />
              Pharmacies de garde
            </Button>
          </Link>
          <Link href="/">
            <Button
              variant="outline"
              //onClick={() => setShowFilters(!showFilters)}
            >
              {/* <Filter className="h-4 w-4 mr-2" /> */}
              <Home className="h-4 w-4 mr-2" />
              Accueil
            </Button>
          </Link>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="space-y-4 mb-8">
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Rechercher par nom ou adresse..."
        />

        {/* {showFilters && (
          <div className="bg-white p-4 rounded-lg border">
            <h3 className="font-medium text-gray-900 mb-3">
              Filtrer par jour d'ouverture
            </h3>
            <DayFilter selectedDay={selectedDay} onDayChange={setSelectedDay} />
          </div>
        )} */}
      </div>

      {/* Results */}
      {filteredPharmacies.length === 0 ? (
        <div className="text-center py-12">
          <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {selectedDay
              ? "Aucune pharmacie ouverte ce jour"
              : "Aucune pharmacie trouvée"}
          </h3>
          <p className="text-gray-600">
            {selectedDay
              ? "Aucune pharmacie n'est ouverte pour le jour sélectionné"
              : "Essayez de modifier vos critères de recherche"}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredPharmacies.map((pharmacy) => (
            <PharmacyCard
              key={pharmacy.id}
              pharmacy={pharmacy}
              showSchedule={true}
              selectedDay={selectedDay}
            />
          ))}
        </div>
      )}

      {/* Footer */}
      <div className="mt-12 text-center text-sm text-gray-500">
        <p>
          Les horaires sont mis à jour en temps réel. En cas de doute, contactez
          directement la pharmacie.
        </p>
      </div>
    </div>
  );
}
