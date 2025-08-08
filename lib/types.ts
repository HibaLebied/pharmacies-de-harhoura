export interface TimeSlot {
  open: string;
  close: string;
}

// Type flexible pour gérer les différents formats d'horaires
export type OpeningHours = {
  [key: string]: TimeSlot | TimeSlot[] | { closed: boolean } | undefined;
};

export type Pharmacy = {
  id: string;
  name: string;
  address: string;
  phone?: string;
  opening_hours: OpeningHours; // Utilise le type flexible OpeningHours
  latitude: number;
  longitude: number;
  image_url?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export interface PharmacyWithStatus extends Pharmacy {
  isOpen: boolean;
  nextOpenTime?: string;
}
