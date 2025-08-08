"use client";

import { Button } from "@/components/ui/button";
import { Phone } from "lucide-react";

export default function CallButton({ phone }: { phone: string }) {
  const handleCall = () => {
    window.location.href = `tel:${phone}`;
  };

  return (
    <Button variant="outline" size="sm" onClick={handleCall} className="flex-1">
      <Phone className="h-4 w-4 mr-1" />
      Appeler
    </Button>
  );
}
