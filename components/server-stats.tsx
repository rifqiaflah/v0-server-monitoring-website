"use client"

import { useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Activity, Server, TrendingUp, AlertTriangle } from "lucide-react"
import useSWR from "swr"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export function ServerStats() {
  const { data, error, mutate } = useSWR("/api/stats", fetcher, {
    refreshInterval: 5000,
  })

  useEffect(() => {
    // Auto-refresh every 5 seconds
    const interval = setInterval(() => mutate(), 5000)
    return () => clearInterval(interval)
  }, [mutate])

  if (error) return <div className="text-destructive">Failed to load stats</div>
  if (!data) return <div className="text-muted-foreground">Loading...</div>

  const upPercentage = data.total > 0 ? (data.up / data.total) * 100 : 0

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card className="border-border bg-card">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Total Servers</CardTitle>
          <Server className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-foreground">{data.total}</div>
          <p className="text-xs text-muted-foreground">Monitored hosts</p>
        </CardContent>
      </Card>

      <Card className="border-border bg-card">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Servers Up</CardTitle>
          <Activity className="h-4 w-4 text-chart-2" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-chart-2">{data.up}</div>
          <p className="text-xs text-muted-foreground">Online and healthy</p>
        </CardContent>
      </Card>

      <Card className="border-border bg-card">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Servers Down</CardTitle>
          <AlertTriangle className="h-4 w-4 text-destructive" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-destructive">{data.down}</div>
          <p className="text-xs text-muted-foreground">Requires attention</p>
        </CardContent>
      </Card>

      <Card className="border-border bg-card">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Uptime Today</CardTitle>
          <TrendingUp className="h-4 w-4 text-chart-1" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-chart-1">{upPercentage.toFixed(1)}%</div>
          <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-secondary">
            <div className="h-full bg-chart-1 transition-all duration-500" style={{ width: `${upPercentage}%` }} />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
