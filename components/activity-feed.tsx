"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, CheckCircle, Info, XCircle } from "lucide-react"
import useSWR from "swr"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export function ActivityFeed() {
  const { data, error } = useSWR("/api/activity", fetcher, {
    refreshInterval: 5000,
  })

  if (error) return <div className="text-destructive">Failed to load activity</div>
  if (!data) return <div className="text-muted-foreground">Loading...</div>

  const getIcon = (severity: string) => {
    switch (severity) {
      case "critical":
        return <XCircle className="h-4 w-4 text-destructive" />
      case "warning":
        return <AlertCircle className="h-4 w-4 text-chart-3" />
      case "info":
        return <Info className="h-4 w-4 text-chart-1" />
      case "resolved":
        return <CheckCircle className="h-4 w-4 text-chart-2" />
      default:
        return <Info className="h-4 w-4 text-muted-foreground" />
    }
  }

  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-foreground">Activity Feed</CardTitle>
        <p className="text-sm text-muted-foreground">Problems & Logs from Zabbix and Elasticsearch</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 overflow-y-auto" style={{ maxHeight: "380px" }}>
          {data.activities?.map((activity: any, index: number) => (
            <div
              key={index}
              className="flex gap-3 rounded-lg border border-border bg-secondary/50 p-3 transition-colors hover:bg-secondary"
            >
              <div className="mt-1">{getIcon(activity.severity)}</div>
              <div className="flex-1 space-y-1">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-medium text-foreground">{activity.message}</p>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">{activity.time}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span
                    className={`rounded px-1.5 py-0.5 font-medium ${
                      activity.source === "zabbix" ? "bg-chart-1/20 text-chart-1" : "bg-chart-4/20 text-chart-4"
                    }`}
                  >
                    {activity.source}
                  </span>
                  {activity.host && <span>• {activity.host}</span>}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
