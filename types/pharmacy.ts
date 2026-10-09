export type { Pharmacy, OpeningHours, TimeSlot } from "@/lib/types";

export interface PharmacyStatus {
  id: string;
  is_open: boolean;
  next_opening?: string;
  next_closing?: string;
}
