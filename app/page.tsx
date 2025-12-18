import { Suspense } from "react"
import { ServerStats } from "@/components/server-stats"
import { SecurityMonitor } from "@/components/security-monitor"
import { HostList } from "@/components/host-list"
import { RealtimeClock } from "@/components/realtime-clock"
import { ActivityFeed } from "@/components/activity-feed"

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Server Monitoring Dashboard</h1>
            <p className="text-sm text-muted-foreground">
              Real-time infrastructure monitoring with Zabbix & Elasticsearch
            </p>
          </div>
          <RealtimeClock />
        </div>
      </header>

      <main className="p-6">
        <div className="grid gap-6">
          {/* Stats Overview */}
          <Suspense fallback={<div className="h-32 animate-pulse rounded-lg bg-muted" />}>
            <ServerStats />
          </Suspense>

          {/* Security Monitoring */}
          <Suspense fallback={<div className="h-96 animate-pulse rounded-lg bg-muted" />}>
            <SecurityMonitor />
          </Suspense>

          {/* Activity Feed & Host List */}
          <div className="grid gap-6 lg:grid-cols-2">
            <Suspense fallback={<div className="h-96 animate-pulse rounded-lg bg-muted" />}>
              <ActivityFeed />
            </Suspense>

            <Suspense fallback={<div className="h-96 animate-pulse rounded-lg bg-muted" />}>
              <HostList />
            </Suspense>
          </div>
        </div>
      </main>
    </div>
  )
}
