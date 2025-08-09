import { supabase } from "@/lib/supabase";
import { slugify } from "@/lib/slugify";
import { notFound } from "next/navigation";
import { MapPin, Phone } from "lucide-react";
import { formatOpeningHours, formatPhoneNumber } from "@/lib/pharmacy-utils";
import ItineraryButton from "@/components/ItineraryButton";
import PharmacyStatus from "@/components/PharmacyStatus"; // ✅ Nouveau import
import { Metadata } from "next";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = params;

  return {
    title: `Pharmacie ${slug.replace(/-/g, " ")}`,
    description: `Informations et horaires de la pharmacie ${slug.replace(
      /-/g,
      " "
    )}`,
  };
}

export default async function PharmacyPage({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = params;

  // Récupérer toutes les pharmacies
  const { data: pharmacies, error } = await supabase
    .from("pharmacies")
    .select("*");

  if (error) {
    console.error("Erreur Supabase:", error);
    return notFound();
  }

  if (!pharmacies || pharmacies.length === 0) {
    console.warn("Aucune pharmacie trouvée dans la base de données");
    return notFound();
  }

  // Trouver la pharmacie correspondant au slug
  const pharmacy = pharmacies.find((ph) => {
    const pharmacySlug = slugify(ph.name);
    return pharmacySlug === slug;
  });

  if (!pharmacy) {
    console.warn(`Aucune pharmacie trouvée pour le slug: ${slug}`);
    console.warn(
      "Slugs disponibles:",
      pharmacies.map((p) => slugify(p.name))
    );
    return notFound();
  }

  const { latitude, longitude } = pharmacy;

  return (
    <div className="container mx-auto px-4 py-6 sm:py-8">
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 text-center sm:text-left">
        {pharmacy.name}
      </h1>

      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center text-gray-700">
          <MapPin className="h-5 w-5 mb-1 sm:mb-0 sm:mr-2 text-gray-500" />
          <span className="text-base sm:text-lg">{pharmacy.address}</span>
        </div>

        {pharmacy.phone && (
          <div className="flex flex-col sm:flex-row sm:items-center text-gray-700">
            <Phone className="h-5 w-5 mb-1 sm:mb-0 sm:mr-2 text-gray-500" />
            <span className="text-base sm:text-lg">
              {formatPhoneNumber(pharmacy.phone)}
            </span>
          </div>
        )}
      </div>

      <div className="mt-6">
        <h2 className="text-lg sm:text-xl font-semibold mb-2">Statut actuel</h2>
        {/* ✅ Composant client qui calcule le statut après le montage */}
        <PharmacyStatus opening_hours={pharmacy.opening_hours} />
      </div>

      <div className="mt-6">
        <h2 className="text-lg sm:text-xl font-semibold mb-2">
          Horaires d'ouverture
        </h2>
        {pharmacy.opening_hours ? (
          <pre className="text-sm sm:text-base text-gray-700 whitespace-pre-line font-sans">
            {formatOpeningHours(pharmacy.opening_hours)}
          </pre>
        ) : (
          <p className="text-sm text-gray-500">Aucun horaire disponible.</p>
        )}
      </div>

      <div className="mt-8">
        <ItineraryButton latitude={latitude} longitude={longitude} />
      </div>
    </div>
  );
}
