import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    // TODO: Replace with actual Zabbix API call to get host data

    const mockHosts = {
      hosts: [
        {
          hostid: "1",
          name: "web-server-01.prod",
          status: "up",
          cpu: 45,
          ram: 62,
          bandwidthIn: 15728640, // 15 MB/s
          bandwidthOut: 8388608, // 8 MB/s
        },
        {
          hostid: "2",
          name: "db-server-01.prod",
          status: "up",
          cpu: 78,
          ram: 85,
          bandwidthIn: 5242880, // 5 MB/s
          bandwidthOut: 2097152, // 2 MB/s
        },
        {
          hostid: "3",
          name: "app-server-01.prod",
          status: "down",
          cpu: 0,
          ram: 0,
          bandwidthIn: 0,
          bandwidthOut: 0,
        },
        {
          hostid: "4",
          name: "cache-server-01.prod",
          status: "up",
          cpu: 32,
          ram: 48,
          bandwidthIn: 20971520, // 20 MB/s
          bandwidthOut: 18874368, // 18 MB/s
        },
        {
          hostid: "5",
          name: "api-server-01.prod",
          status: "up",
          cpu: 56,
          ram: 71,
          bandwidthIn: 12582912, // 12 MB/s
          bandwidthOut: 10485760, // 10 MB/s
        },
      ],
    }

    return NextResponse.json(mockHosts)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch hosts" }, { status: 500 })
  }
}
