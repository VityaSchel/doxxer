import net from 'net'

const topTcpPorts = [80, 443, 22, 21, 25, 23, 53, 110, 143, 27017]

function scanTcpPort(host: string, port: number, timeout = 200) {
  return new Promise<{ port: number, open: boolean }>((resolve) => {
    const socket = new net.Socket()
    let resolved = false

    const timer = setTimeout(() => {
      if (!resolved) {
        resolved = true
        socket.destroy()
        resolve({ port, open: false })
      }
    }, timeout)

    socket.setTimeout(timeout)
    socket.on('connect', () => {
      if(!resolved) {
        clearTimeout(timer)
        resolved = true
        socket.destroy()
        resolve({ port, open: true })
      }
    })

    socket.on('timeout', () => {
      if (!resolved) {
        clearTimeout(timer)
        resolved = true
        socket.destroy()
        resolve({ port, open: false })
      }
    })

    socket.on('error', () => {
      if (!resolved) {
        clearTimeout(timer)
        resolved = true
        resolve({ port, open: false })
      }
    })

    socket.connect(port, host)
  })
}

export async function scanTopTcpPorts(host: string) {
  const scans = topTcpPorts.map((port) => scanTcpPort(host, port))
  const results = await Promise.all(scans)

  return results.filter(result => result.open).map(result => result.port)
}