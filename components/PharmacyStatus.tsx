"use client";

import { useEffect, useState } from "react";
import { getCurrentDayStatus } from "@/lib/pharmacy-utils";
import { Badge } from "@/components/ui/badge";

interface Props {
  opening_hours: any;
}

export default function PharmacyStatus({ opening_hours }: Props) {
  const [status, setStatus] = useState<{
    isOpen: boolean;
    status: string;
    nextChange?: string;
  } | null>(null);

  useEffect(() => {
    // Calcul du statut uniquement côté client
    setStatus(getCurrentDayStatus(opening_hours));
  }, [opening_hours]);

  if (!status) {
    return <span>Chargement...</span>;
  }

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
      <Badge
        variant={status.isOpen ? "default" : "secondary"}
        className={
          status.isOpen
            ? "bg-green-500 hover:bg-green-600"
            : "bg-red-500 hover:bg-red-600 text-white"
        }
      >
        {status.status}
      </Badge>
      {status.nextChange && (
        <span className="text-sm text-gray-500">{status.nextChange}</span>
      )}
    </div>
  );
}
