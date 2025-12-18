// Zabbix API Integration Module

interface ZabbixConfig {
  url: string
  username: string
  password: string
}

class ZabbixAPI {
  private config: ZabbixConfig
  private authToken: string | null = null

  constructor(config: ZabbixConfig) {
    this.config = config
  }

  private async request(method: string, params: any = {}) {
    const response = await fetch(`${this.config.url}/api_jsonrpc.php`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        jsonrpc: "2.0",
        method,
        params,
        auth: this.authToken,
        id: 1,
      }),
    })

    const data = await response.json()

    if (data.error) {
      throw new Error(data.error.message)
    }

    return data.result
  }

  async authenticate() {
    this.authToken = await this.request("user.login", {
      user: this.config.username,
      password: this.config.password,
    })
    return this.authToken
  }

  async getHosts() {
    return await this.request("host.get", {
      output: ["hostid", "host", "name", "status"],
      selectInterfaces: ["ip"],
    })
  }

  async getHostItems(hostid: string) {
    return await this.request("item.get", {
      output: "extend",
      hostids: hostid,
      search: {
        key_: ["system.cpu.util", "vm.memory.util", "net.if.in", "net.if.out"],
      },
      sortfield: "name",
    })
  }

  async getProblems() {
    return await this.request("problem.get", {
      output: "extend",
      selectAcknowledges: "extend",
      recent: true,
      sortfield: ["eventid"],
      sortorder: "DESC",
    })
  }

  async getTriggers() {
    return await this.request("trigger.get", {
      output: "extend",
      filter: {
        value: 1, // Only active triggers
      },
      selectHosts: ["hostid", "name"],
      sortfield: "lastchange",
      sortorder: "DESC",
    })
  }
}

export const zabbixClient = new ZabbixAPI({
  url: process.env.ZABBIX_URL || "http://localhost/zabbix",
  username: process.env.ZABBIX_USERNAME || "Admin",
  password: process.env.ZABBIX_PASSWORD || "zabbix",
})

// Usage example:
// await zabbixClient.authenticate()
// const hosts = await zabbixClient.getHosts()
