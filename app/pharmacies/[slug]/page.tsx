import { slugify } from "@/lib/slugify";
import { notFound } from "next/navigation";
import { AlertCircle, MapPin, Phone } from "lucide-react";
import { formatOpeningHours, formatPhoneNumber } from "@/lib/pharmacy-utils";
import ItineraryButton from "@/components/ItineraryButton";
import PharmacyStatus from "@/components/PharmacyStatus";
import type { Metadata } from "next";
import { pharmacyService } from "@/lib/pharmacy-service";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const pharmacyName = slug.replace(/-/g, " ");

  return {
    title: `Pharmacie ${pharmacyName}`,
    description: `Informations et horaires de la pharmacie ${pharmacyName}`,
  };
}

export default async function PharmacyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const normalizedSlug = slugify(slug);
  const result = await pharmacyService.getPharmacyBySlug(normalizedSlug);

  if (result.status === "not_found") {
    return notFound();
  }

  if (result.status === "error" || result.status === "not_configured") {
    return (
      <PharmacyDetailError
        title="Impossible de charger cette pharmacie"
        message={
          result.status === "not_configured"
            ? "La connexion Supabase n'est pas configurée pour cet environnement."
            : "Une erreur est survenue lors de la récupération des données."
        }
        detail={result.error}
      />
    );
  }

  const pharmacy = result.data;
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
        <PharmacyStatus opening_hours={pharmacy.opening_hours} />
      </div>

      <div className="mt-6">
        <h2 className="text-lg sm:text-xl font-semibold mb-2">
          Horaires d&apos;ouverture
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
        <ItineraryButton latitude={latitude} longitude={longitude} compact />
      </div>
    </div>
  );
}

function PharmacyDetailError({
  title,
  message,
  detail,
}: {
  title: string;
  message: string;
  detail?: string;
}) {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mx-auto max-w-2xl rounded-lg border border-orange-200 bg-orange-50 p-6 text-orange-900">
        <div className="flex items-start gap-3">
          <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0" />
          <div>
            <h1 className="mb-2 text-xl font-semibold">{title}</h1>
            <p className="text-sm">{message}</p>
            {detail && (
              <p className="mt-3 rounded border border-orange-200 bg-white/70 p-3 text-xs text-orange-800">
                {detail}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
