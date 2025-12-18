// Elasticsearch Integration Module

interface ElasticsearchConfig {
  node: string
  username?: string
  password?: string
}

class ElasticsearchClient {
  private config: ElasticsearchConfig

  constructor(config: ElasticsearchConfig) {
    this.config = config
  }

  private async request(method: string, endpoint: string, body?: any) {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    }

    if (this.config.username && this.config.password) {
      const auth = Buffer.from(`${this.config.username}:${this.config.password}`).toString("base64")
      headers["Authorization"] = `Basic ${auth}`
    }

    const response = await fetch(`${this.config.node}${endpoint}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    })

    if (!response.ok) {
      throw new Error(`Elasticsearch error: ${response.statusText}`)
    }

    return await response.json()
  }

  async indexDocument(index: string, document: any, id?: string) {
    const endpoint = id ? `/${index}/_doc/${id}` : `/${index}/_doc`
    return await this.request("POST", endpoint, document)
  }

  async search(index: string, query: any) {
    return await this.request("POST", `/${index}/_search`, query)
  }

  // Search for bruteforce attempts
  async getBruteforceAttempts(timeRange = "24h") {
    const query = {
      query: {
        bool: {
          should: [
            { match: { "event.outcome": "failure" } },
            { wildcard: { message: "*Failed password*" } },
            { wildcard: { message: "*authentication failure*" } },
          ],
          minimum_should_match: 1,
          filter: {
            range: {
              "@timestamp": {
                gte: `now-${timeRange}`,
                lte: "now",
              },
            },
          },
        },
      },
      size: 100,
      sort: [{ "@timestamp": "desc" }],
    }

    return await this.search("logs-*", query)
  }

  // Search for DDoS attempts
  async getDDoSAttempts(timeRange = "24h") {
    const query = {
      query: {
        bool: {
          must: [{ wildcard: { message: "*HTTP*" } }],
          filter: {
            range: {
              "@timestamp": {
                gte: `now-${timeRange}`,
                lte: "now",
              },
            },
          },
        },
      },
      aggs: {
        by_ip: {
          terms: {
            field: "source.ip",
            size: 10,
          },
        },
        over_time: {
          date_histogram: {
            field: "@timestamp",
            fixed_interval: "4h",
          },
        },
      },
      size: 100,
      sort: [{ "@timestamp": "desc" }],
    }

    return await this.search("logs-*", query)
  }

  // Get aggregated security stats
  async getSecurityStats(timeRange = "24h") {
    const query = {
      query: {
        bool: {
          should: [
            { match: { "event.outcome": "failure" } },
            { wildcard: { message: "*Failed password*" } },
            { wildcard: { message: "*authentication failure*" } },
            { wildcard: { message: "*HTTP*" } },
          ],
          minimum_should_match: 1,
          filter: {
            range: {
              "@timestamp": {
                gte: `now-${timeRange}`,
                lte: "now",
              },
            },
          },
        },
      },
      aggs: {
        by_type: {
          terms: {
            script: {
              source: `
                if (doc['message.keyword'].value.contains('HTTP')) {
                  return 'ddos'
                } else {
                  return 'bruteforce'
                }
              `,
            },
          },
        },
        over_time: {
          date_histogram: {
            field: "@timestamp",
            fixed_interval: "4h",
          },
          aggs: {
            by_type: {
              terms: {
                script: {
                  source: `
                    if (doc['message.keyword'].value.contains('HTTP')) {
                      return 'ddos'
                    } else {
                      return 'bruteforce'
                    }
                  `,
                },
              },
            },
          },
        },
      },
      size: 0,
    }

    return await this.search("logs-*", query)
  }
}

export const elasticsearchClient = new ElasticsearchClient({
  node: process.env.ELASTICSEARCH_URL || "http://localhost:9200",
  username: process.env.ELASTICSEARCH_USERNAME,
  password: process.env.ELASTICSEARCH_PASSWORD,
})

// Usage example:
// const bruteforce = await elasticsearchClient.getBruteforceAttempts()
// const ddos = await elasticsearchClient.getDDoSAttempts()
