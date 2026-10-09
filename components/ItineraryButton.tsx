"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { MapPin, Navigation } from "lucide-react";

interface ItineraryButtonProps {
  latitude: number;
  longitude: number;
  compact?: boolean;
}

export default function ItineraryButton({
  latitude,
  longitude,
  compact = false,
}: ItineraryButtonProps) {
  const [preferredMap, setPreferredMap] = useState<string>("");
  const [showChoices, setShowChoices] = useState(false);

  const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
  const appleMapsUrl = `https://maps.apple.com/?daddr=${latitude},${longitude}`;
  const wazeUrl = `https://waze.com/ul?ll=${latitude},${longitude}&navigate=yes`;

  useEffect(() => {
    const savedPreference = window.localStorage.getItem("preferredMapApp");
    if (savedPreference === "apple" || savedPreference === "google" || savedPreference === "waze") {
      setPreferredMap(savedPreference);
      return;
    }

    const userAgent = navigator.userAgent || navigator.vendor || "";
    if (/iPad|iPhone|iPod/.test(userAgent)) {
      setPreferredMap("apple");
    } else if (/android/i.test(userAgent)) {
      setPreferredMap("google");
    }
  }, []);

  const openMap = (map: string, savePreference = false) => {
    const urls: Record<string, string> = {
      apple: appleMapsUrl,
      google: googleMapsUrl,
      waze: wazeUrl,
    };

    const url = urls[map];
    if (!url) return;

    if (savePreference) {
      window.localStorage.setItem("preferredMapApp", map);
      setPreferredMap(map);
      setShowChoices(false);
    }

    window.open(url, "_blank", "noopener,noreferrer");
  };

  const handleItineraryClick = () => {
    if (preferredMap) {
      openMap(preferredMap);
      return;
    }

    setShowChoices((current) => !current);
  };

  const wrapperClassName = compact ? "relative inline-flex" : "relative flex-1";
  const buttonClassName = compact
    ? "inline-flex items-center justify-center gap-1 px-3"
    : "w-full flex items-center justify-center gap-1";

  return (
    <div className={wrapperClassName}>
      <Button
        variant="outline"
        size="sm"
        onClick={handleItineraryClick}
        className={buttonClassName}
      >
        <MapPin className="h-4 w-4" />
        Itinéraire
      </Button>

      {showChoices && (
        <div className="absolute bottom-full left-0 z-20 mb-2 grid w-44 gap-1 rounded-md border bg-white p-2 shadow-lg">
          <Button variant="ghost" size="sm" onClick={() => openMap("google", true)} className="justify-start gap-2">
            <Navigation className="h-4 w-4" />
            Google Maps
          </Button>
          <Button variant="ghost" size="sm" onClick={() => openMap("apple", true)} className="justify-start gap-2">
            <Navigation className="h-4 w-4" />
            Apple Maps
          </Button>
          <Button variant="ghost" size="sm" onClick={() => openMap("waze", true)} className="justify-start gap-2">
            <Navigation className="h-4 w-4" />
            Waze
          </Button>
        </div>
      )}
    </div>
  );
}
