"use client";

import { Button } from "@/components/ui/button";
import { List } from "lucide-react";
import Link from "next/link";

export default function HeroButton() {
  const scrollToList = () => {
    document.getElementById("pharmacies-list")?.scrollIntoView({
      behavior: "smooth",
    });
  };

  return (
    // <Button
    //   variant="outline"
    //   size="lg"
    //   className="w-full sm:w-auto border-green-200 hover:bg-green-50 bg-transparent"
    //   onClick={scrollToList}
    // >
    //   <List className="h-5 w-5 mr-2" />
    //   Voir la liste des pharmacies
    // </Button>
    <Link href="/pharmacies">
      <Button
        variant="outline"
        size="lg"
        className="w-full sm:w-auto border-green-200 hover:bg-green-50 bg-transparent"
      >
        <List className="h-5 w-5 mr-2" />
        Voir la liste des pharmacies
      </Button>
    </Link>
  );
}
