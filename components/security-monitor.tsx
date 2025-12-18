"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from "recharts"
import useSWR from "swr"
import { Shield, AlertCircle } from "lucide-react"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export function SecurityMonitor() {
  const { data, error } = useSWR("/api/security-logs", fetcher, {
    refreshInterval: 10000,
  })

  if (error) return <div className="text-destructive">Failed to load security data</div>
  if (!data) return <div className="text-muted-foreground">Loading...</div>

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Card className="border-border bg-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold text-foreground">Security Threats</CardTitle>
            <Shield className="h-5 w-5 text-chart-1" />
          </div>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data.timeSeriesData}>
              <XAxis dataKey="time" stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                  color: "hsl(var(--foreground))",
                }}
              />
              <Legend />
              <Bar
                dataKey="bruteforce"
                fill="hsl(var(--destructive))"
                name="Bruteforce Attacks"
                radius={[4, 4, 0, 0]}
              />
              <Bar dataKey="ddos" fill="hsl(var(--chart-3))" name="DDoS Attempts" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>

          <div className="mt-4 grid grid-cols-2 gap-4">
            <div className="rounded-lg bg-destructive/10 p-3">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-destructive" />
                <span className="text-xs font-medium text-destructive">Bruteforce</span>
              </div>
              <div className="mt-1 text-2xl font-bold text-destructive">{data.bruteforceCount}</div>
              <p className="text-xs text-muted-foreground">Last 24h</p>
            </div>

            <div className="rounded-lg bg-chart-3/10 p-3">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-chart-3" />
                <span className="text-xs font-medium text-chart-3">DDoS</span>
              </div>
              <div className="mt-1 text-2xl font-bold text-chart-3">{data.ddosCount}</div>
              <p className="text-xs text-muted-foreground">Last 24h</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-foreground">Recent Security Events</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 overflow-y-auto" style={{ maxHeight: "380px" }}>
            {data.recentEvents?.map((event: any, index: number) => (
              <div
                key={index}
                className="flex items-start gap-3 rounded-lg border border-border bg-secondary/50 p-3 transition-colors hover:bg-secondary"
              >
                <div
                  className={`mt-0.5 h-2 w-2 rounded-full ${event.type === "bruteforce" ? "bg-destructive" : "bg-chart-3"}`}
                />
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium text-foreground">{event.message}</p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>{event.source}</span>
                    <span>•</span>
                    <span>{event.time}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
