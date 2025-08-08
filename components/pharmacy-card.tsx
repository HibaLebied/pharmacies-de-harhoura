import type { Pharmacy } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { MapPin, Phone, Clock } from "lucide-react";
import {
  getCurrentDayStatus,
  formatOpeningHours,
  formatPhoneNumber,
} from "@/lib/pharmacy-utils";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import CallButton from "./CallButton"; // Nouveau Client Component
import DirectionsButton from "./DirectionsButton"; // Nouveau Client Component
import Link from "next/link";
import ItineraryButton from "./ItineraryButton";
import { slugify } from "@/lib/slugify";
import { PharmacyWithStatus } from "@/lib/types";

interface PharmacyCardProps {
  pharmacy: Pharmacy;
}

export function PharmacyCard({ pharmacy }: PharmacyCardProps) {
  const dayStatus = getCurrentDayStatus(pharmacy.opening_hours);
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="font-semibold text-lg text-gray-900 mb-1">
              {pharmacy.name}
            </h3>
            <div className="flex items-center text-gray-600 text-sm">
              <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
              <span className="line-clamp-2">{pharmacy.address}</span>
            </div>
          </div>
          <Badge
            variant={dayStatus.isOpen ? "default" : "secondary"}
            className={
              dayStatus.isOpen
                ? "bg-green-500 hover:bg-green-600"
                : "bg-red-500 hover:bg-red-600 text-white"
            }
          >
            {dayStatus.isOpen ? "Ouverte" : "Fermée"}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="pb-3">
        {pharmacy.image_url && (
          <div className="mb-4">
            <Image
              src={pharmacy.image_url || "/placeholder.svg"}
              alt={pharmacy.name}
              width={300}
              height={200}
              className="w-full h-32 object-cover rounded-md"
            />
          </div>
        )}

        <div className="space-y-2 text-sm">
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

          {pharmacy.phone && (
            <div className="flex items-center text-gray-600">
              <Phone className="h-4 w-4 mr-1" />
              <span>{formatPhoneNumber(pharmacy.phone)}</span>
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter className="pt-3 border-t flex gap-2">
        {/* Boutons déplacés dans des Client Components */}
        <ItineraryButton
          latitude={pharmacy.latitude}
          longitude={pharmacy.longitude}
        />

        <Link
          href={`/pharmacies/${slugify(pharmacy.name)}`}
          className="flex items-center gap-1 px-3 py-2 rounded-md border text-sm text-gray-700 hover:bg-gray-100"
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

        {/* <Dialog>
          <DialogTrigger asChild>
            <button className="flex items-center gap-1 px-3 py-2 border rounded-md text-sm">
              <Clock className="h-4 w-4 mr-1" />
              Horaires
            </button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{pharmacy.name}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Statut actuel</h4>
                <div className="flex items-center gap-2">
                  <Badge
                    variant={dayStatus.isOpen ? "default" : "secondary"}
                    className={
                      dayStatus.isOpen
                        ? "bg-green-500"
                        : "bg-red-500 text-white"
                    }
                  >
                    {dayStatus.status}
                  </Badge>
                  {dayStatus.nextChange && (
                    <span className="text-sm text-gray-600">
                      {dayStatus.nextChange}
                    </span>
                  )}
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">Horaires d'ouverture</h4>
                <pre className="text-sm text-gray-600 whitespace-pre-line font-sans">
                  {formatOpeningHours(pharmacy.opening_hours)}
                </pre>
              </div>

              {pharmacy.phone && (
                <div>
                  <h4 className="font-medium mb-2">Contact</h4>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">
                      {formatPhoneNumber(pharmacy.phone)}
                    </span>
                    <CallButton phone={pharmacy.phone} />
                  </div>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog> */}
      </CardFooter>
    </Card>
  );
}
