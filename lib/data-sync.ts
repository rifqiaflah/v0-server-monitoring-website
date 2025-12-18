// Background job to sync Zabbix data to Elasticsearch

import { zabbixClient } from "./zabbix"
import { elasticsearchClient } from "./elasticsearch"

export async function syncZabbixToElasticsearch() {
  try {
    // Authenticate with Zabbix
    await zabbixClient.authenticate()

    // Get all hosts
    const hosts = await zabbixClient.getHosts()

    // Index each host in Elasticsearch
    for (const host of hosts) {
      await elasticsearchClient.indexDocument(
        "zabbix-hosts",
        {
          hostid: host.hostid,
          name: host.name,
          status: host.status === "0" ? "up" : "down",
          timestamp: new Date().toISOString(),
        },
        host.hostid,
      )

      // Get host items (metrics)
      const items = await zabbixClient.getHostItems(host.hostid)

      for (const item of items) {
        await elasticsearchClient.indexDocument("zabbix-metrics", {
          hostid: host.hostid,
          hostname: host.name,
          itemid: item.itemid,
          key: item.key_,
          value: item.lastvalue,
          timestamp: new Date().toISOString(),
        })
      }
    }

    // Get problems/triggers
    const problems = await zabbixClient.getProblems()

    for (const problem of problems) {
      await elasticsearchClient.indexDocument("zabbix-problems", {
        eventid: problem.eventid,
        objectid: problem.objectid,
        name: problem.name,
        severity: problem.severity,
        timestamp: new Date(Number.parseInt(problem.clock) * 1000).toISOString(),
      })
    }

    console.log("[v0] Zabbix data synced to Elasticsearch successfully")
    return { success: true }
  } catch (error) {
    console.error("[v0] Error syncing Zabbix to Elasticsearch:", error)
    throw error
  }
}

// Run this function periodically (e.g., every 5 minutes)
// You can use a cron job or Next.js API route with scheduled execution
