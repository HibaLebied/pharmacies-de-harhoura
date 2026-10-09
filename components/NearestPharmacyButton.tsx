"use client";

import { useState } from "react";
import { getSupabaseClient } from "@/lib/supabase";

type NearestPharmacy = {
  name: string;
  address: string;
  phone?: string;
  distance?: number;
};

export default function NearestPharmacyButton() {
  const [loading, setLoading] = useState(false);
  const [nearestPharmacy, setNearestPharmacy] =
    useState<NearestPharmacy | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleClick() {
    const supabase = getSupabaseClient();

    if (!supabase) {
      setError("La connexion Supabase n'est pas configurée pour cet environnement.");
      return;
    }

    if (!navigator.geolocation) {
      setError("La géolocalisation n'est pas supportée par votre navigateur.");
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
            setNearestPharmacy(pharmacy as NearestPharmacy);
            setError(null);
          }
        } catch (err) {
          setError("Une erreur inattendue est survenue.");
          setNearestPharmacy(null);
        } finally {
          setLoading(false);
        }
      },
      (err) => {
        const denied = err.code === err.PERMISSION_DENIED;
        setError(
          denied
            ? "Localisation refusée. Autorisez la géolocalisation pour trouver la pharmacie la plus proche."
            : "Impossible d'obtenir votre localisation."
        );
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
