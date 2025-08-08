import { pharmacyService } from "@/lib/pharmacy-service";
import { getCurrentDayStatus } from "@/lib/pharmacy-utils";
import PharmaciesDeGardeClient from "./PharmaciesDeGardeClient";
import { DEMO_PHARMACIES } from "@/lib/mock-data";

export default async function PharmaciesDeGardePage() {
  const { data, isDemo, error } = await pharmacyService.getPharmacies();

  const isFallbackToDemo = isDemo && data === DEMO_PHARMACIES;
  const databaseError = isFallbackToDemo || !!error;

  // Filtrer uniquement les pharmacies ouvertes
  const openPharmacies = data
    .map((pharmacy) => {
      const status = getCurrentDayStatus(pharmacy.opening_hours);
      return {
        ...pharmacy,
        isOpen: status.isOpen,
        nextOpenTime: status.nextChange,
      };
    })
    .filter((pharmacy) => pharmacy.isOpen);

  return (
    <PharmaciesDeGardeClient
      pharmacies={openPharmacies}
      databaseError={databaseError}
    />
  );
}
