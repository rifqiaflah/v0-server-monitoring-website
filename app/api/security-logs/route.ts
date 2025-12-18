import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    // TODO: Replace with actual Elasticsearch query
    // Query: event.outcome: "failure" OR message: "*Failed password*" OR message: "*authentication failure*"
    // AND message: "HTTP" for DDoS

    const mockData = {
      bruteforceCount: 147,
      ddosCount: 23,
      timeSeriesData: [
        { time: "00:00", bruteforce: 12, ddos: 2 },
        { time: "04:00", bruteforce: 8, ddos: 1 },
        { time: "08:00", bruteforce: 15, ddos: 4 },
        { time: "12:00", bruteforce: 23, ddos: 6 },
        { time: "16:00", bruteforce: 31, ddos: 5 },
        { time: "20:00", bruteforce: 28, ddos: 3 },
        { time: "Now", bruteforce: 30, ddos: 2 },
      ],
      recentEvents: [
        {
          type: "bruteforce",
          message: "Multiple failed SSH login attempts detected",
          source: "192.168.1.45",
          time: "2 min ago",
        },
        {
          type: "ddos",
          message: "High volume HTTP requests from single IP",
          source: "10.0.0.123",
          time: "5 min ago",
        },
        {
          type: "bruteforce",
          message: "Failed password authentication",
          source: "172.16.0.89",
          time: "8 min ago",
        },
        {
          type: "bruteforce",
          message: "Authentication failure detected",
          source: "192.168.1.67",
          time: "12 min ago",
        },
        {
          type: "ddos",
          message: "Suspicious HTTP traffic pattern",
          source: "203.0.113.42",
          time: "15 min ago",
        },
      ],
    }

    return NextResponse.json(mockData)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch security logs" }, { status: 500 })
  }
}
