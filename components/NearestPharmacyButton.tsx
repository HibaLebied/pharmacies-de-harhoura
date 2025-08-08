"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function NearestPharmacyButton() {
  const [loading, setLoading] = useState(false);
  const [nearestPharmacy, setNearestPharmacy] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleClick() {
    if (!navigator.geolocation) {
      alert("La géolocalisation n’est pas supportée par votre navigateur.");
      return;
    }

    const userConsent = confirm(
      "Nous avons besoin de votre localisation pour trouver la pharmacie la plus proche. Voulez-vous autoriser ?"
    );

    if (!userConsent) return;

    setLoading(true);
    setError(null);
    setNearestPharmacy(null);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        console.log("User location:", latitude, longitude);

        try {
          // Appel direct Supabase RPC
          const { data, error } = await supabase.rpc(
            "find_nearest_open_pharmacy",
            {
              user_lat: latitude,
              user_lng: longitude,
            }
          );

          if (error) {
            console.error("Supabase RPC error:", error.message ?? error);
            setError("Erreur lors de la recherche : " + (error.message ?? ""));
            setNearestPharmacy(null);
          } else if (
            !data ||
            (Array.isArray(data) && data.length === 0) ||
            Object.keys(data).length === 0 ||
            data.name === null
          ) {
            // data peut être null si aucune pharmacie trouvée
            setError("Aucune pharmacie ouverte trouvée.");
            setNearestPharmacy(null);
          } else {
            // Parfois data est un objet (pas un tableau) car fonction PL/pgSQL retourne table limit 1
            // donc pas forcément data[0], juste data directement
            const pharmacy = Array.isArray(data) ? data[0] : data;
            setNearestPharmacy(pharmacy);
            setError(null);
          }
        } catch (err) {
          console.error("Erreur inattendue :", err);
          setError("Une erreur inattendue est survenue.");
          setNearestPharmacy(null);
        } finally {
          setLoading(false);
        }
      },
      (err) => {
        console.error(err);
        setError("Impossible d’obtenir votre localisation.");
        setLoading(false);
      }
    );
  }

  return (
    <div>
      <button
        onClick={handleClick}
        disabled={loading}
        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
      >
        {loading
          ? "Recherche en cours..."
          : "Trouver la pharmacie la plus proche"}
      </button>

      {error && <p className="text-red-500 mt-2">{error}</p>}

      {nearestPharmacy && (
        <div className="mt-4 p-4 border rounded bg-green-50">
          <h2 className="text-lg font-bold text-green-800">
            {nearestPharmacy.name}
          </h2>
          <p>{nearestPharmacy.address}</p>
          <p>{nearestPharmacy.phone}</p>
          <p>📍 Distance estimée: {nearestPharmacy.distance?.toFixed(2)} km</p>
        </div>
      )}
    </div>
  );
}
