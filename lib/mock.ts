import type { Pharmacy } from "./types"

export const mockPharmacies: Pharmacy[] = [
  {
    id: "1",
    name: "Pharmacie Mock Centrale Harhoura",
    address: "Avenue Mohammed V, Centre Harhoura",
    phone: "+212537123456",
    opening_hours: {
      lun: [
        { open: "08:00", close: "12:00" },
        { open: "14:00", close: "20:00" },
      ],
      mar: [
        { open: "08:00", close: "12:00" },
        { open: "14:00", close: "20:00" },
      ],
      mer: [
        { open: "08:00", close: "12:00" },
        { open: "14:00", close: "20:00" },
      ],
      jeu: [{ open: "08:00", close: "20:00" }],
      ven: [
        { open: "08:00", close: "12:30" },
        { open: "14:00", close: "19:00" },
      ],
      sam: [
        { open: "09:00", close: "13:00" },
        { open: "15:00", close: "18:00" },
      ],
      dim: [],
    },
    latitude: 33.9716,
    longitude: -6.8498,
    image_url: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=300&h=200&fit=crop",
    is_active: true,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
]
