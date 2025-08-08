"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { MapPin } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

interface ItineraryButtonProps {
  latitude: number;
  longitude: number;
}

export default function ItineraryButton({
  latitude,
  longitude,
}: ItineraryButtonProps) {
  const [preferredMap, setPreferredMap] = useState<string>("");

  const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
  const appleMapsUrl = `https://maps.apple.com/?daddr=${latitude},${longitude}`;
  const wazeUrl = `https://waze.com/ul?ll=${latitude},${longitude}&navigate=yes`;

  useEffect(() => {
    const userAgent = navigator.userAgent || navigator.vendor || "";
    if (/iPad|iPhone|iPod/.test(userAgent)) {
      setPreferredMap("apple");
    } else if (/android/i.test(userAgent)) {
      setPreferredMap("google");
    } else {
      setPreferredMap("menu"); // desktop: menu déroulant
    }
  }, []);

  const openPreferredMap = () => {
    if (preferredMap === "apple") {
      window.open(appleMapsUrl, "_blank");
    } else if (preferredMap === "google") {
      window.open(googleMapsUrl, "_blank");
    }
  };

  if (preferredMap !== "menu") {
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={openPreferredMap}
        className="flex-1 flex items-center justify-center gap-1"
      >
        <MapPin className="h-4 w-4" />
        Itinéraire
      </Button>
    );
  }

  // Menu déroulant desktop
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="flex-1 flex items-center justify-center gap-1"
        >
          <MapPin className="h-4 w-4" />
          Itinéraire
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem>
          <a
            href={googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full block"
          >
            Google Maps
          </a>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <a
            href={appleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full block"
          >
            Apple Maps
          </a>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <a
            href={wazeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full block"
          >
            Waze
          </a>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
