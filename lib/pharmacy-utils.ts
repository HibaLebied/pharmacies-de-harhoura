import type { OpeningHours, TimeSlot } from "./types";
import type { Pharmacy } from "@/types/pharmacy";

export const DAYS_FR = {
  lun: "Lundi",
  mar: "Mardi",
  mer: "Mercredi",
  jeu: "Jeudi",
  ven: "Vendredi",
  sam: "Samedi",
  dim: "Dimanche",
} as const;

export const DAYS_ORDER = [
  "lun",
  "mar",
  "mer",
  "jeu",
  "ven",
  "sam",
  "dim",
] as const;

export function getCurrentDay(): keyof OpeningHours {
  const now = new Date();
  // now.getDay() retourne 0 pour Dimanche, 1 pour Lundi...
  // DAYS_ORDER commence par Lundi (index 0)
  // Donc, si c'est Dimanche (0), on veut l'index 6 ("dim")
  // Sinon, on soustrait 1 pour aligner (Lundi 1 -> index 0 "lun")
  const dayIndex = now.getDay();
  return DAYS_ORDER[dayIndex === 0 ? 6 : dayIndex - 1];
}

export function getCurrentTime(): string {
  const now = new Date();
  return now.toTimeString().slice(0, 5); // Format HH:MM
}

export function isTimeInRange(
  currentTime: string,
  timeSlot: TimeSlot
): boolean {
  return currentTime >= timeSlot.open && currentTime <= timeSlot.close;
}

/**
 * Vérifie si une pharmacie est ouverte à l'instant
 */
export function isPharmacyOpen(openingHours: OpeningHours): boolean {
  const currentDay = getCurrentDay();
  const currentTime = getCurrentTime();
  const todayHours = openingHours[currentDay];

  // Si fermé aujourd'hui ou pas d'horaires définis
  if (
    !todayHours ||
    (typeof todayHours === "object" &&
      "closed" in todayHours &&
      todayHours.closed)
  ) {
    return false;
  }

  let intervals: TimeSlot[] = [];
  if (Array.isArray(todayHours)) {
    intervals = todayHours;
  } else if (
    typeof todayHours === "object" &&
    "open" in todayHours &&
    "close" in todayHours
  ) {
    intervals = [todayHours];
  }

  for (const interval of intervals) {
    const [openHour, openMin] = interval.open.split(":").map(Number);
    const [closeHour, closeMin] = interval.close.split(":").map(Number);
    const openTime = openHour * 60 + openMin;
    const closeTime = closeHour * 60 + closeMin;
    const currentMinutes =
      Number.parseInt(currentTime.split(":")[0]) * 60 +
      Number.parseInt(currentTime.split(":")[1]);

    if (currentMinutes >= openTime && currentMinutes <= closeTime) {
      return true; // Ouvert dans cette plage
    }
  }

  return false; // Fermé
}

export function isPharmacyOpenOnDay(
  openingHours: OpeningHours,
  day: keyof OpeningHours
): boolean {
  const daySlots = openingHours[day];
  return (
    !!daySlots &&
    !(typeof daySlots === "object" && "closed" in daySlots && daySlots.closed)
  );
}

/**
 * Donne la prochaine heure d'ouverture
 */
export function getNextOpenTime(openingHours: OpeningHours): string | null {
  const now = new Date();
  const days = ["dim", "lun", "mar", "mer", "jeu", "ven", "sam"];
  const dayNames = [
    "Dimanche",
    "Lundi",
    "Mardi",
    "Mercredi",
    "Jeudi",
    "Vendredi",
    "Samedi",
  ];

  for (let i = 0; i < 7; i++) {
    const checkDate = new Date(now);
    checkDate.setDate(now.getDate() + i);
    const dayKey = DAYS_ORDER[
      checkDate.getDay() === 0 ? 6 : checkDate.getDay() - 1
    ] as keyof OpeningHours;
    const dayHours = openingHours[dayKey];

    if (
      dayHours &&
      !(typeof dayHours === "object" && "closed" in dayHours && dayHours.closed)
    ) {
      let intervals: TimeSlot[] = [];
      if (Array.isArray(dayHours)) {
        intervals = dayHours;
      } else if (
        typeof dayHours === "object" &&
        "open" in dayHours &&
        "close" in dayHours
      ) {
        intervals = [dayHours];
      }

      for (const interval of intervals) {
        const [openHour, openMin] = interval.open.split(":").map(Number);
        const openTime = openHour * 60 + openMin;
        const currentTimeMinutes =
          i === 0 ? now.getHours() * 60 + now.getMinutes() : 0;

        if (currentTimeMinutes < openTime) {
          const dayLabel =
            i === 0 ? "Aujourd'hui" : dayNames[checkDate.getDay()];
          return `${dayLabel} à ${interval.open}`;
        }
      }
    }
  }

  return null; // Pas d'ouverture prévue dans les 7 jours
}

export function formatTimeSlots(
  slots: TimeSlot[] | TimeSlot | { closed: boolean } | undefined
): string {
  if (
    !slots ||
    (typeof slots === "object" && "closed" in slots && slots.closed)
  )
    return "Fermée";

  if (Array.isArray(slots)) {
    return slots.map((slot) => `${slot.open} - ${slot.close}`).join(" / ");
  }

  if (typeof slots === "object" && "open" in slots && "close" in slots) {
    return `${slots.open} - ${slots.close}`;
  }

  return "Fermée"; // Fallback si le format n'est pas reconnu
}

/**
 * Statut actuel d'une pharmacie
 */
export function getCurrentDayStatus(openingHours: OpeningHours): {
  isOpen: boolean;
  status: string;
  nextChange?: string;
} {
  const currentDay = getCurrentDay();
  const currentTime = getCurrentTime();
  const todayHours = openingHours[currentDay];

  // Jour fermé ou pas d'horaires définis
  if (
    !todayHours ||
    (typeof todayHours === "object" &&
      "closed" in todayHours &&
      todayHours.closed)
  ) {
    const nextOpening = getNextOpenTime(openingHours);
    return {
      isOpen: false,
      status: "Fermée aujourd'hui",
      nextChange: nextOpening || undefined,
    };
  }

  let intervals: TimeSlot[] = [];
  if (Array.isArray(todayHours)) {
    intervals = todayHours;
  } else if (
    typeof todayHours === "object" &&
    "open" in todayHours &&
    "close" in todayHours
  ) {
    intervals = [todayHours];
  }

  const currentMinutes =
    Number.parseInt(currentTime.split(":")[0]) * 60 +
    Number.parseInt(currentTime.split(":")[1]);

  for (const interval of intervals) {
    const [openHour, openMin] = interval.open.split(":").map(Number);
    const [closeHour, closeMin] = interval.close.split(":").map(Number);
    const openTime = openHour * 60 + openMin;
    const closeTime = closeHour * 60 + closeMin;

    if (currentMinutes < openTime) {
      return {
        isOpen: false,
        status: "Fermée",
        nextChange: `Ouvre à ${interval.open}`,
      };
    }
    if (currentMinutes >= openTime && currentMinutes <= closeTime) {
      return {
        isOpen: true,
        status: "Ouverte",
        nextChange: `Ferme à ${interval.close}`,
      };
    }
  }

  const nextOpening = getNextOpenTime(openingHours);
  return {
    isOpen: false,
    status: "Fermée",
    nextChange: nextOpening || undefined,
  };
}

/**
 * Formate un numéro de téléphone marocain
 */
export function formatPhoneNumber(phone: string): string {
  if (phone.startsWith("+212")) {
    const number = phone.substring(4);
    if (number.length === 9) {
      return `+212 ${number.substring(0, 3)} ${number.substring(
        3,
        6
      )} ${number.substring(6)}`;
    }
  }
  return phone;
}

/**
 * Calcul la distance entre deux points GPS
 */
export function getDistanceFromUser(
  userLat: number,
  userLon: number,
  pharmacyLat: number,
  pharmacyLon: number
): number {
  const R = 6371; // Rayon de la Terre en km
  const dLat = deg2rad(pharmacyLat - userLat);
  const dLon = deg2rad(pharmacyLon - userLon);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(userLat)) *
      Math.cos(deg2rad(pharmacyLat)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c; // Distance en km
  return Math.round(d * 100) / 100; // Arrondir à 2 décimales
}

export function formatOpeningHours(
  openingHours: Pharmacy["opening_hours"]
): string {
  const days = [
    { key: "lun", name: "Lundi" },
    { key: "mar", name: "Mardi" },
    { key: "mer", name: "Mercredi" },
    { key: "jeu", name: "Jeudi" },
    { key: "ven", name: "Vendredi" },
    { key: "sam", name: "Samedi" },
    { key: "dim", name: "Dimanche" },
  ];

  return days
    .map((day) => {
      const intervals = openingHours?.[day.key];

      // 🟡 Si pas défini ou si "closed: true"
      if (!intervals || (Array.isArray(intervals) && intervals.length === 0)) {
        return `${day.name}: Fermé`;
      }

      // 🟡 Si ancien format { open, close }
      if (!Array.isArray(intervals) && intervals.open && intervals.close) {
        return `${day.name}: ${intervals.open} - ${intervals.close}`;
      }

      // 🟢 Si c'est bien un tableau d'intervalles
      if (Array.isArray(intervals)) {
        const hoursStr = intervals
          .map(
            (interval: { open: string; close: string }) =>
              `${interval.open} - ${interval.close}`
          )
          .join(" / ");
        return `${day.name}: ${hoursStr}`;
      }

      return `${day.name}: Fermée`;
    })
    .join("\n");
}

function deg2rad(deg: number): number {
  return deg * (Math.PI / 180);
}
