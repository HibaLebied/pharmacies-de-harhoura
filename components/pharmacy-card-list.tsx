import { Phone, MapPin, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { PharmacyWithStatus } from "@/lib/types";
import {
  DAYS_FR,
  formatTimeSlots,
  getCurrentDay,
  formatPhoneNumber,
  getCurrentDayStatus,
} from "@/lib/pharmacy-utils";
import Link from "next/link";
import { slugify } from "@/lib/slugify";

interface PharmacyCardProps {
  pharmacy: PharmacyWithStatus;
  showSchedule?: boolean;
  selectedDay?: string | null;
}

export function PharmacyCard({
  pharmacy,
  showSchedule = false,
  selectedDay = null,
}: PharmacyCardProps) {
  const currentDay = getCurrentDay();
  const displayDay =
    (selectedDay as keyof typeof pharmacy.opening_hours) || currentDay;
  const displaySlots = pharmacy.opening_hours[displayDay] || [];
  const isToday = displayDay === currentDay;

  const dayStatus = getCurrentDayStatus(pharmacy.opening_hours);

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div>
        <CardContent className="flex-1 p-4">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-3">
            <h3 className="font-semibold text-lg text-gray-900">
              {pharmacy.name}
            </h3>
            <div className="flex">
              <Link
                href={`/pharmacies/${slugify(pharmacy.name)}`}
                className="flex items-center gap-1 px-3 py-2 mr-2 rounded-md border text-sm text-gray-700 hover:bg-gray-100"
              >
                <span>Voir plus</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </Link>
              <Badge
                variant={dayStatus.isOpen ? "default" : "secondary"}
                className={
                  dayStatus.isOpen
                    ? "bg-green-500 hover:bg-green-600"
                    : "bg-red-500 hover:bg-red-600 text-white"
                }
              >
                {dayStatus.status}
              </Badge>
            </div>
          </div>

          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex items-start gap-2">
              <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <span>{pharmacy.address}</span>
            </div>

            {pharmacy.phone && (
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 flex-shrink-0" />
                <a
                  href={`tel:${pharmacy.phone}`}
                  className="text-blue-600 hover:underline"
                >
                  {formatPhoneNumber(pharmacy.phone)}
                </a>
              </div>
            )}

            {dayStatus.nextChange && (
              <div
                className={`flex items-center ${
                  dayStatus.isOpen ? "text-green-600" : "text-orange-600"
                }`}
              >
                <Clock className="h-4 w-4 mr-1" />
                <span>{dayStatus.nextChange}</span>
              </div>
            )}
          </div>

          {showSchedule && (
            <div className="mt-4 pt-3 border-t">
              <h4 className="font-medium text-sm text-gray-900 mb-2">
                Horaires{" "}
                {isToday ? "aujourd'hui" : selectedDay ? "le" : "aujourd'hui"} (
                {DAYS_FR[displayDay as keyof typeof DAYS_FR]})
              </h4>
              <div className="text-xs">
                <div className="flex justify-between">
                  <span className="font-medium">
                    {DAYS_FR[displayDay as keyof typeof DAYS_FR]}:
                  </span>
                  <span className="text-gray-600">
                    {formatTimeSlots(displaySlots)}
                  </span>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </div>
    </Card>
  );
}
