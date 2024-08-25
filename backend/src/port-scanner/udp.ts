import dgram from 'dgram'

const topUdpPorts = [53, 67, 68, 69, 123, 161, 162, 500, 514, 520]

function scanUdpPort(host: string, port: number, timeout = 200) {
  return new Promise<{ port: number, open: boolean }>((resolve) => {
    const socket = dgram.createSocket('udp4')
    let resolved = false

    const timer = setTimeout(() => {
      if (!resolved) {
        socket.close()
        resolved = true
        resolve({ port, open: false })
      }
    }, timeout)

    socket.on('message', () => {
      if (!resolved) {
        clearTimeout(timer)
        socket.close()
        resolved = true
        resolve({ port, open: true })
      }
    })

    socket.on('error', () => {
      if (!resolved) {
        clearTimeout(timer)
        resolved = true
        resolve({ port, open: false })
      }
    })

    socket.send('', port, host, () => {
      // After sending the message, we just wait for any response or timeout
    })
  })
}

export async function scanTopUdpPorts(host: string) {
  const scans = topUdpPorts.map((port) => scanUdpPort(host, port))
  const results = await Promise.all(scans)

  return results.filter(result => result.open).map(result => result.port)
}