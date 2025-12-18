"use client"

import { useEffect, useState } from "react"
import { Clock } from "lucide-react"

export function RealtimeClock() {
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  return (
    <div className="flex items-center gap-2 rounded-lg border border-border bg-secondary/50 px-4 py-2">
      <Clock className="h-4 w-4 text-chart-1" />
      <div className="text-right">
        <div className="font-mono text-lg font-bold text-foreground">{time.toLocaleTimeString("id-ID")}</div>
        <div className="text-xs text-muted-foreground">
          {time.toLocaleDateString("id-ID", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </div>
      </div>
    </div>
  )
}
