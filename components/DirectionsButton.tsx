"use client";

import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";

export default function DirectionsButton({
  latitude,
  longitude,
}: {
  latitude: number;
  longitude: number;
}) {
  const handleDirections = () => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
    window.open(url, "_blank");
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleDirections}
      className="flex-1"
    >
      <ExternalLink className="h-4 w-4 mr-1" />
      Itinéraire
    </Button>
  );
}
