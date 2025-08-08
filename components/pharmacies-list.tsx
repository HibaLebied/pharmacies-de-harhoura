"use client";

import { useEffect, useState } from "react";
import type { Pharmacy, OpeningHours, TimeSlot } from "@/lib/types";
import { pharmacyService } from "@/lib/pharmacy-service";
import { PharmacyCard } from "./pharmacy-card";
import { Input } from "@/components/ui/input";
import { Search, Filter, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { isPharmacyOpen } from "@/lib/pharmacy-utils";
import { supabase } from "@/lib/supabase";

export function PharmaciesList() {
  const [pharmacies, setPharmacies] = useState<Pharmacy[]>([]);
  const [filteredPharmacies, setFilteredPharmacies] = useState<Pharmacy[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "open" | "closed">(
    "all"
  );
  const [isDemo, setIsDemo] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPharmacies();

    // ✅ Supabase Realtime
    const channel = supabase
      .channel("pharmacies-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "pharmacies" },
        (payload) => {
          console.log("🔄 Changement détecté :", payload);
          fetchPharmacies();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  useEffect(() => {
    filterPharmacies();
  }, [pharmacies, searchTerm, statusFilter]);

  const fetchPharmacies = async () => {
    try {
      setLoading(true);
      const result = await pharmacyService.getPharmacies();

      setPharmacies(result.data);
      setIsDemo(result.isDemo);

      if (result.error) {
        setError(result.error);
      }
    } catch (error) {
      console.error("Erreur lors du chargement des pharmacies:", error);
      setError("Erreur de chargement des données");
    } finally {
      setLoading(false);
    }
  };

  const filterPharmacies = () => {
    let filtered = pharmacies;

    // 🔍 Recherche
    if (searchTerm) {
      filtered = filtered.filter(
        (pharmacy) =>
          pharmacy.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          pharmacy.address.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // 🟢/🔴 Statut
    if (statusFilter !== "all") {
      filtered = filtered.filter((pharmacy) => {
        const isOpen = isPharmacyOpen(pharmacy.opening_hours);
        return statusFilter === "open" ? isOpen : !isOpen;
      });
    }

    setFilteredPharmacies(filtered);
  };

  if (loading) {
    return <PharmaciesListSkeleton />;
  }

  return (
    <div className="space-y-6">
      {/* Alerte mode démo */}
      {isDemo && (
        <Alert className="border-blue-200 bg-blue-50">
          <Info className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-800">
            <strong>Mode démonstration</strong> - Vous visualisez des données
            d'exemple.
            {error && (
              <details className="mt-2">
                <summary className="cursor-pointer text-sm">
                  Voir les détails
                </summary>
                <p className="text-xs mt-1 text-blue-700">{error}</p>
              </details>
            )}
          </AlertDescription>
        </Alert>
      )}

      {/* Filtres */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Rechercher une pharmacie..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="flex items-center bg-transparent"
            >
              <Filter className="h-4 w-4 mr-2" />
              {statusFilter === "all"
                ? "Toutes"
                : statusFilter === "open"
                ? "Ouvertes"
                : "Fermées"}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => setStatusFilter("all")}>
              Toutes les pharmacies
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setStatusFilter("open")}>
              Pharmacies ouvertes
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setStatusFilter("closed")}>
              Pharmacies fermées
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Résultats */}
      <div className="text-sm text-gray-600 mb-4">
        {filteredPharmacies.length} pharmacie
        {filteredPharmacies.length > 1 ? "s" : ""} trouvée
        {filteredPharmacies.length > 1 ? "s" : ""}
        {isDemo && " (données de démonstration)"}
      </div>

      {/* Liste */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredPharmacies.map((pharmacy) => (
          <PharmacyCard key={pharmacy.id} pharmacy={pharmacy} />
        ))}
      </div>

      {filteredPharmacies.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">Aucune pharmacie trouvée</p>
        </div>
      )}
    </div>
  );
}

function PharmaciesListSkeleton() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="bg-white rounded-lg shadow-md p-6 animate-pulse"
        >
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
          <div className="h-3 bg-gray-200 rounded w-2/3 mb-4"></div>
          <div className="h-8 bg-gray-200 rounded w-20"></div>
        </div>
      ))}
    </div>
  );
}
