import { Elysia } from 'elysia'
import type { IpInfoResponse } from '../../types/ipinfo.io'
import { scanTopTcpPorts } from './port-scanner/tcp'
import { scanTopUdpPorts } from './port-scanner/udp'
import UserAgentParser from 'ua-parser-js'
import cors from '@elysiajs/cors'
import _ from 'lodash'

const app = new Elysia()
  .use(cors({ origin: process.env.DEPLOYED_DOMAIN }))
  .on('mapResponse', ({ set }) => {
    set.headers['Accept-CH'] = 'sec-ch-ua-platform, sec-ch-ua-platform-version, sec-ch-ua-full-version-list, sec-ch-ua-arch, sec-ch-ua-model, sec-ch-ua-bitness'
  })
  .onError(console.error)
const port = 3000

app.get('/scanme', async ({ headers, request }) => {
  let ip = headers['x-forwarded-for'] ?? app.server?.requestIP(request)?.address
  if (!ip) {
    return { error: 'No IP address found' }
  }
  if (ip === '::ffff:127.0.0.1' || ip === '::1') {
    ip = await fetch('https://api64.ipify.org/?format=json').then(req => req.json()).then(data => data.ip)
  }
  const [tcp, udp] = await Promise.all([
    scanTopTcpPorts(ip as string),
    scanTopUdpPorts(ip as string)
  ])
  return { tcp, udp }
})

const ipcache = new Map<string, IpInfoResponse>()
const demoResponse: IpInfoResponse = {
  data: {
    abuse: {
      address: 'yourmom',
      email: 'ligma@4.20am',
      phone: '+420 69 420 6969'
    },
    asn: {
      domain: 'sissynet',
      route: '192.168.0.0/128'
    },
    hostname: 'bobsburgers',
    loc: '38.89767627173018, -77.03651907490817',
    privacy: {
      proxy: false,
      tor: false,
      vpn: false,
      service: ''
    }
  },
}

app.get('/ip2geo', async ({ headers, request }) => {
  const ip = headers['x-forwarded-for'] ?? app.server?.requestIP(request)?.address
  if (!ip) {
    return { error: 'No IP address found' }
  }
  if (ip === '::ffff:127.0.0.1' || ip === '::1') {
    return demoResponse
  }
  if (ipcache.has(ip)) {
    return ipcache.get(ip)
  }
  const ipInfoRequest = await fetch('https://ipinfo.io/widget/demo/' + ip)
  let response: IpInfoResponse
  if (ipInfoRequest.status === 200) {
    response = await ipInfoRequest.json()
    ipcache.set(ip, response)
  } else {
    const ipInfoRequest = await fetch('https://ipinfo.io/' + ip + '?token=' + process.env.IPINFO_TOKEN)
    if (ipInfoRequest.status === 200) {
      response = await ipInfoRequest.json()
    } else {
      return { error: 'Failed to get info about IP' }
    }
  }
  return response
})

const trimSec = (str: string | undefined) => str?.trim().replaceAll(/^"/g, '').replaceAll(/"$/g, '')

app.get('/software', async ({ headers }) => {
  const platform = trimSec(headers['sec-ch-ua-platform'])
  const version = trimSec(headers['sec-ch-ua-platform-version'])
  const arch = trimSec(headers['sec-ch-ua-arch'])
  const bitness = trimSec(headers['sec-ch-ua-bitness'])
  let os: string
  if(platform) {
    os = platform
    if (version) os += ' ' + version
    if (arch) os += ' ' + arch
    if (bitness) os += ' ' + bitness + 'bit'
  } else {
    const ua = new UserAgentParser(headers['user-agent'])
    os = ua.getOS().name ?? 'PC'  
    const version = ua.getOS().version
    if (version) os += ' ' + version
    const vendor = ua.getDevice().vendor
    if (vendor) {
      os += ' ' + vendor
      const model = ua.getDevice().model
      if (model) os += ' ' + model
    }
    const arch = ua.getCPU().architecture
    if (arch) os += ' ' + arch
  }

  let browser: string
  const softwareVersions = (headers['sec-ch-ua-full-version-list'] ?? '').split(/, ?/g).map(s => s.trim())
  const chromeVersion = softwareVersions.find(v => v && v.includes('Chrome'))?.split(';v=')[1]
  if(chromeVersion) {
    browser = 'Google Chrome ' + trimSec(chromeVersion)
  } else {
    const ua = new UserAgentParser(headers['user-agent'])
    browser = ua.getBrowser().name ?? 'Unknown browser'
    const browserVersion = ua.getBrowser().version
    if (browserVersion) {
      browser += ' ' + browserVersion
    }
  }

  return {
    os,
    browser
  }
})

type TorrentDownload = { name: string, date: string }
const ipCache = new Map<string, TorrentDownload[]>()
app.get('/torrents', async ({ headers, request }) => {
  let ip = headers['x-forwarded-for'] ?? app.server?.requestIP(request)?.address
  if (!ip) {
    return { error: 'No IP address found' }
  }
  if (ip === '::ffff:127.0.0.1' || ip === '::1') {
    ip = await fetch('https://api64.ipify.org/?format=json').then(req => req.json()).then(data => data.ip)
  }
  if (ipCache.has(ip as string)) {
    return ipCache.get(ip as string)
  }
  const response = await fetch(`https://${process.env.I_KNOW_WHAT_YOU_DOWNLOAD_COM_API_URL}/history/peer?ip=${ip}&days=30&contents=10&lang=en&key=${process.env.I_KNOW_WHAT_YOU_DOWNLOAD_COM_API_KEY}`)
    .then(req => req.json() as Promise<{ contents: { name: string, startDate: string }[] }>)
  const downloads = response.contents.map(c => ({ name: c.name, date: c.startDate }))
  ipCache.set(ip as string, _.uniqBy(downloads, 'name'))
  return downloads
})

app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})
