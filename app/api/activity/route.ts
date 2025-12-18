import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    // TODO: Combine data from Zabbix problems and Elasticsearch logs

    const mockActivity = {
      activities: [
        {
          severity: "critical",
          message: "Server web-server-03.prod is down",
          source: "zabbix",
          host: "web-server-03.prod",
          time: "1 min ago",
        },
        {
          severity: "warning",
          message: "High CPU usage detected",
          source: "zabbix",
          host: "db-server-01.prod",
          time: "3 min ago",
        },
        {
          severity: "critical",
          message: "Bruteforce attack detected from 192.168.1.45",
          source: "elasticsearch",
          host: "web-server-01.prod",
          time: "5 min ago",
        },
        {
          severity: "info",
          message: "Backup completed successfully",
          source: "zabbix",
          host: "db-server-01.prod",
          time: "8 min ago",
        },
        {
          severity: "warning",
          message: "Memory usage above 80%",
          source: "zabbix",
          host: "db-server-01.prod",
          time: "12 min ago",
        },
        {
          severity: "resolved",
          message: "Network issue resolved",
          source: "zabbix",
          host: "app-server-02.prod",
          time: "15 min ago",
        },
        {
          severity: "critical",
          message: "DDoS attack detected - High HTTP traffic",
          source: "elasticsearch",
          host: "web-server-01.prod",
          time: "18 min ago",
        },
        {
          severity: "info",
          message: "System update completed",
          source: "zabbix",
          host: "cache-server-01.prod",
          time: "22 min ago",
        },
      ],
    }

    return NextResponse.json(mockActivity)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch activity" }, { status: 500 })
  }
}
