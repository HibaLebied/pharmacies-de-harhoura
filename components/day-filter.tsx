"use client"

import { Button } from "@/components/ui/button"
import { DAYS_FR, DAYS_ORDER, getCurrentDay } from "@/lib/pharmacy-utils"

interface DayFilterProps {
  selectedDay: string | null
  onDayChange: (day: string | null) => void
}

export function DayFilter({ selectedDay, onDayChange }: DayFilterProps) {
  const currentDay = getCurrentDay()

  return (
    <div className="flex flex-wrap gap-2">
      <Button variant={selectedDay === null ? "default" : "outline"} size="sm" onClick={() => onDayChange(null)}>
        Tous les jours
      </Button>

      {DAYS_ORDER.map((day) => (
        <Button
          key={day}
          variant={selectedDay === day ? "default" : "outline"}
          size="sm"
          onClick={() => onDayChange(day)}
          className={day === currentDay ? "ring-2 ring-blue-300" : ""}
        >
          {DAYS_FR[day]}
          {day === currentDay && <span className="ml-1 text-xs">(Aujourd'hui)</span>}
        </Button>
      ))}
    </div>
  )
}
