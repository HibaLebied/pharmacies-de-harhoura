export interface Pharmacy {
  id: string;
  name: string;
  address: string;
  phone?: string;
  opening_hours: {
    [key: string]: {
      open?: string;
      close?: string;
      closed?: boolean;
    };
  };
  latitude: number;
  longitude: number;
  image_url?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface PharmacyStatus {
  id: string;
  is_open: boolean;
  next_opening?: string;
  next_closing?: string;
}
