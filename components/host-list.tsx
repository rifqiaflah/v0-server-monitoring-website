"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Cpu, HardDrive, ArrowUp, ArrowDown } from "lucide-react"
import useSWR from "swr"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B"
  const k = 1024
  const sizes = ["B", "KB", "MB", "GB", "TB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
}

export function HostList() {
  const { data, error } = useSWR("/api/hosts", fetcher, {
    refreshInterval: 5000,
  })

  if (error) return <div className="text-destructive">Failed to load hosts</div>
  if (!data) return <div className="text-muted-foreground">Loading...</div>

  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-foreground">Zabbix Hosts</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 overflow-y-auto" style={{ maxHeight: "380px" }}>
          {data.hosts?.map((host: any) => (
            <div
              key={host.hostid}
              className="rounded-lg border border-border bg-secondary/50 p-4 transition-colors hover:bg-secondary"
            >
              <div className="mb-3 flex items-center justify-between">
                <h3 className="font-semibold text-foreground">{host.name}</h3>
                <span
                  className={`rounded-full px-2 py-1 text-xs font-medium ${
                    host.status === "up" ? "bg-chart-2/20 text-chart-2" : "bg-destructive/20 text-destructive"
                  }`}
                >
                  {host.status}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Cpu className="h-4 w-4 text-chart-1" />
                    <span className="text-xs text-muted-foreground">CPU</span>
                  </div>
                  <div className="text-lg font-bold text-foreground">{host.cpu}%</div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-secondary">
                    <div className="h-full bg-chart-1 transition-all" style={{ width: `${host.cpu}%` }} />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <HardDrive className="h-4 w-4 text-chart-4" />
                    <span className="text-xs text-muted-foreground">RAM</span>
                  </div>
                  <div className="text-lg font-bold text-foreground">{host.ram}%</div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-secondary">
                    <div className="h-full bg-chart-4 transition-all" style={{ width: `${host.ram}%` }} />
                  </div>
                </div>
              </div>

              <div className="mt-3 grid grid-cols-2 gap-3 border-t border-border pt-3">
                <div className="flex items-center gap-2">
                  <ArrowDown className="h-3.5 w-3.5 text-chart-2" />
                  <div>
                    <p className="text-xs text-muted-foreground">In</p>
                    <p className="text-sm font-semibold text-foreground">{formatBytes(host.bandwidthIn)}/s</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <ArrowUp className="h-3.5 w-3.5 text-chart-3" />
                  <div>
                    <p className="text-xs text-muted-foreground">Out</p>
                    <p className="text-sm font-semibold text-foreground">{formatBytes(host.bandwidthOut)}/s</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
