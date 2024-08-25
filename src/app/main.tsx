import React from 'react'
import '@/shared/styles/global.css'
import '@/shared/styles/fonts.css'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Map } from '@/widgets/map'
import { Transitions } from '@/widgets/transitions'
import { ProxyUsage } from '@/widgets/proxy-usage'
import { Network } from '@/widgets/network'
import { IpInfoResponse } from '../../types/ipinfo.io'
import { OS } from '@/widgets/os'
import { TorrentDownloads } from '@/widgets/torrent-downloads'
import cx from 'classnames'
import copy from 'copy-to-clipboard'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

function App() {
  const [ipv4, setIpv4] = React.useState('')
  const [ipv6, setIpv6] = React.useState('')
  const [hostname, setHostname] = React.useState('')
  const [asn, setAsn] = React.useState('')
  const [cidr, setCidr] = React.useState('')
  const [ispAddress, setIspAddress] = React.useState('')
  const [ispContact, setIspContact] = React.useState('')
  const [lat, setLat] = React.useState<number | null>(null)
  const [lon, setLon] = React.useState<number | null>(null)
  const [vpnUse, setVpnUse] = React.useState(false)
  const [torUse, setTorUse] = React.useState(false)
  const [proxyUse, setProxyUse] = React.useState(false)
  const [proxyService, setProxyService] = React.useState('')
  const [udpOpenPorts, setUdpOpenPorts] = React.useState<string[]>([])
  const [tcpOpenPorts, setTcpOpenPorts] = React.useState<string[]>([])
  const [os, setOs] = React.useState('')
  const [browser, setBrowser] = React.useState('')
  const [batteryCharge, setBatteryCharge] = React.useState<number | null>(null)
  const [gpu, setGpu] = React.useState<string | null>(null)
  const [ram, setRam] = React.useState<number | null>(null)
  const [cpuCores, setCpuCores] = React.useState<number | null>(null)
  const [downloads, setDownloads] = React.useState<{ name: string, date: string }[]>([])

  const [ready, setReady] = React.useState(false)
  const [videoLoaded, setVideoLoaded] = React.useState(false)
  const [audioLoaded, setAudioLoaded] = React.useState(false)
  const [videoPlaying, setVideoPlaying] = React.useState(false)
  const [started, setStarted] = React.useState(false)
  const videoRef = React.useRef<HTMLVideoElement>(null)
  const audioRef = React.useRef<HTMLAudioElement>(null)
  const [showProxyUsage, setShowProxyUsage] = React.useState(false)
  const [showMap, setShowMap] = React.useState(false)
  const [showNetwork, setShowNetwork] = React.useState(false)
  const [showOs, setShowOs] = React.useState(false)
  const [showTorrentDownloads, setShowTorrentDownloads] = React.useState(false)
  
  const [transition1, setTransition1] = React.useState(false)
  const [ended, setEnded] = React.useState(false)

  React.useEffect(() => {
    if (videoRef.current) {
      videoRef.current.addEventListener('canplaythrough', () => {
        setVideoLoaded(true)
      })
    }
  }, [videoRef])

  React.useEffect(() => {
    if (audioRef.current) {
      audioRef.current.addEventListener('canplaythrough', () => {
        setAudioLoaded(true)
      })
    }
  }, [audioRef])

  React.useEffect(() => {
    fetchOwnIp()
  }, [])

  const fetchOwnIp = async () => {
    try {
      const [ipv4, ipv6] = await Promise.all([
        fetch('https://api4.ipify.org/?format=json').then(req => req.json() as Promise<{ ip: string }>),
        fetch('https://api64.ipify.org/?format=json').then(req => req.json() as Promise<{ ip: string }>)
      ])
      setIpv4(ipv4.ip)
      if(ipv6.ip !== ipv4.ip) {
        setIpv6(ipv6.ip)
      }
    } catch {
      const [ipv4, ipv6] = await Promise.all([
        fetch(import.meta.env.VITE_API_URL + '/ipv4').then(req => req.json() as Promise<{ ip: string }>),
        fetch(import.meta.env.VITE_API_URL + '/ipv6').then(req => req.json() as Promise<{ ip: string }>)
      ])
      setIpv4(ipv4.ip)
      if (ipv6.ip !== ipv4.ip) {
        setIpv6(ipv6.ip)
      }
    }
  }

  React.useEffect(() => {
    if (ipv4) {
      setCpuCores(navigator.hardwareConcurrency || null)
      setRam('deviceMemory' in navigator ? (navigator.deviceMemory as number) || null : null)
      Promise.all([
        fetchIp2GeoInfo(ipv4),
        scanPorts(),
        getBatteryCharge(),
        getGpu(),
        getTorrentDownloads()
      ]).then(() => {
        getSoftware()
          .then(() => setReady(true))
      })
    }
  }, [ipv4])

  const fetchIp2GeoInfo = async (ipv4: string) => {
    const getByGps = () => {
      return new Promise<{ lat: number | null, lon: number | null }>(resolve => {
        let resolved = false
        setTimeout(() => {
          if(resolved) return
          resolved = true
          resolve({
            lat: null,
            lon: null
          })
        }, 4999)
        navigator.geolocation.getCurrentPosition((geo) => {
          if (resolved) return
          resolved = true
          resolve({
            lat: geo.coords.latitude,
            lon: geo.coords.longitude
          })
        }, () => {
          if (resolved) return
          resolved = true
          resolve({
            lat: null,
            lon: null
          })
        }, {
          enableHighAccuracy: false,
          timeout: 5000
        })
      })
    }
    const getByIp = async () => {
      let response: IpInfoResponse
      try {
        const request = await fetch('https://ipinfo.io/widget/demo/' + ipv4)
        if(request.status === 200) {
          response = await request.json()
        } else {
          throw new Error()
        }
      } catch {
        response = await fetch(import.meta.env.VITE_API_URL + '/ip2geo')
          .then(req => req.json())
      }
      setHostname(response.data.hostname)
      setAsn(response.data.asn.domain)
      setCidr(response.data.asn.route)
      const [lat, lon] = response.data.loc.split(',').map(parseFloat)
      setVpnUse(response.data.privacy.vpn)
      setTorUse(response.data.privacy.tor)
      setProxyUse(response.data.privacy.proxy)
      setProxyService(response.data.privacy.service)
      setIspAddress(response.data.abuse.address)
      setIspContact(response.data.abuse.phone || response.data.abuse.email)
      return { lat, lon }
    }
    
    const [ipGeo, gpsGeo] = await Promise.all([
      getByIp(),
      getByGps()
    ])

    if(gpsGeo.lat !== null && gpsGeo.lon !== null) {
      setLat(gpsGeo.lat)
      setLon(gpsGeo.lon)
    } else {
      setLat(ipGeo.lat)
      setLon(ipGeo.lon)
    }
  }

  const scanPorts = async () => {
    const request = await fetch(import.meta.env.VITE_API_URL + '/scanme')
      .then(req => req.json() as Promise<{ udp: string[], tcp: string[] }>)
    setUdpOpenPorts(request.udp)
    setTcpOpenPorts(request.tcp)
  }

  const getBatteryCharge = async () => {
    if ('getBattery' in navigator) {
      const level = (await (navigator.getBattery as () => { level: number })()).level * 100
      setBatteryCharge(level)
    } else {
      setBatteryCharge(null)
    }
  }

  const getGpu = async () => {
    if ('gpu' in navigator) {
      const adapter = await (navigator.gpu as { requestAdapter: () => { architecture: string, vendor: string } }).requestAdapter()
      if (adapter) {
        let gpu = adapter.vendor
        if(adapter.architecture) {
          gpu += ' ' + adapter.architecture
        }
        setGpu(gpu)
      }
    } else {
      setGpu(null)
    }
  }

  const getSoftware = async () => {
    const { os, browser } = await fetch(import.meta.env.VITE_API_URL + '/software')
      .then(req => req.json() as Promise<{ os: string, browser: string }>)
    setOs(os)
    setBrowser(browser)
  }

  const getTorrentDownloads = async () => {
    const downloads = await fetch(import.meta.env.VITE_API_URL + '/torrents')
      .then(req => req.json() as Promise<{ name: string, date: string }[]>)
    setDownloads(downloads)
  }

  const handleStart = () => {
    const video = videoRef.current
    const audio = audioRef.current
    if (video && audio) {
      audio.play()
      setTimeout(() => {
        video.play()
        setVideoPlaying(true)
        setStarted(true)
        setTimeout(() => {
          setVideoPlaying(false)
          video.currentTime = 16.900
          video.pause()

          if(torUse || vpnUse || proxyUse) {
            setShowProxyUsage(true)
          } else if(lat !== null && lon !== null) {
            setShowMap(true)
          } else {
            setShowProxyUsage(true)
          }

          setTimeout(() => {
            setTransition1(true)
            setTimeout(() => {
              setShowMap(false)
              setShowProxyUsage(false)
              setShowNetwork(true)
            }, 750/2)

            setTimeout(() => {
              setShowNetwork(false)
              setShowOs(true)

              setTimeout(() => {
                setShowOs(false)
                setShowTorrentDownloads(true)
    
                setTimeout(() => {
                  setShowTorrentDownloads(false)
      
                  setVideoPlaying(true)
                  video.currentTime = 16.900
                  video.play()
                  video.addEventListener('ended', () => setEnded(true))
                }, 5.465 * 1000)
              }, 4.649 * 1000)
            }, 10.974 * 1000)
          }, 3.979 * 1000)
        }, 5.812 * 1000)
      }, new AudioContext().outputLatency)
    }
  }

  const handleShare = () => {
    if('share' in navigator) {
      navigator.share({
        url: window.location.href,
      })
    } else {
      copy(window.location.href)
      alert('Link copied to clipboard')
    }
  }

  return (
    <main className='w-full h-full relative top-0 left-0'>
      {showProxyUsage && (
        <ProxyUsage 
          vpn={vpnUse} 
          tor={torUse} 
          proxy={proxyUse}
          proxyService={proxyService}
        />
      )}
      <Map 
        point={{
          lat: lat,
          long: lon
        }}
        visible={showMap && lat !== null && lon !== null}
      />
      {showNetwork && <Network
        ipv4={ipv4}
        ipv6={ipv6}
        hostname={hostname}
        cidr={cidr}
        asn={asn}
        ispAddress={ispAddress}
        ispContact={ispContact}
        udpOpenPorts={udpOpenPorts}
        tcpOpenPorts={tcpOpenPorts}
      />}
      {showOs && <OS
        os={os}
        browser={browser}
        batteryCharge={batteryCharge}
        gpu={gpu}
        ram={ram}
        cpuCores={cpuCores}
      />}
      {showTorrentDownloads && <TorrentDownloads downloads={downloads} />}
      <Transitions 
        burgerTransitionVisible={transition1}
      />
      <div className={cx('bg-black w-full h-full absolute top-0 left-0 flex items-center justify-center z-[100]', {
        'opacity-0': (started && !videoPlaying),
        'opacity-100': (!started || videoPlaying),
      })}>
        <video src='/whopper.mp4' preload='auto' className='pointer-events-none' tabIndex={-1} ref={videoRef} muted />
        <audio src='/whopper-dox-audio.mp3' preload='auto' ref={audioRef} />
        {!started && (
          <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center'>
            {(ready && videoLoaded && audioLoaded) ? (
              <button className='bg-white rounded-full overflow-hidden' onClick={handleStart}>
                <svg xmlns="http://www.w3.org/2000/svg" width="10vw" height="10vw" viewBox="0 0 24 24"><path fill="currentColor" d="M8 17.175V6.825q0-.425.3-.713t.7-.287q.125 0 .263.037t.262.113l8.15 5.175q.225.15.338.375t.112.475t-.112.475t-.338.375l-8.15 5.175q-.125.075-.262.113T9 18.175q-.4 0-.7-.288t-.3-.712"></path></svg>
              </button>
            ) : (
              <div className='animate-spin'>
                <svg xmlns="http://www.w3.org/2000/svg" width="10vw" height="10vw" viewBox="0 0 16 16"><path fill="white" d="M2.501 8a5.5 5.5 0 1 1 5.5 5.5A.75.75 0 0 0 8 15a7 7 0 1 0-7-7a.75.75 0 0 0 1.501 0"></path></svg>
              </div>
            )}
          </div>
        )}
      </div>
      <div className={cx('flex flex-col absolute top-0 left-0 bg-black w-full h-full items-center justify-center text-neutral-400 z-[200] gap-2 duration-1000 delay-1000', {
        'opacity-0 pointer-events-none': !ended,
        'opacity-100': ended
      })}>
        <span className='text-xl font-medium'>
          <button className='bg-indigo-600 px-3 py-1 rounded-lg font-semibold text-white mr-1' onClick={handleShare}>Share</button> with your friends
        </span>
        <div className='absolute mt-48 flex flex-col gap-2 items-center'>
          <span className='flex gap-2'>
            <span>Made by <a href='https://hloth.dev' className='hover:text-white font-medium transition-colors'>hloth</a></span>·<span className='flex items-center gap-1'>Source on <a href='https://github.com/VityaSchel/doxxer' className='hover:text-white font-medium transition-colors'><svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5c.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34c-.46-1.16-1.11-1.47-1.11-1.47c-.91-.62.07-.6.07-.6c1 .07 1.53 1.03 1.53 1.03c.87 1.52 2.34 1.07 2.91.83c.09-.65.35-1.09.63-1.34c-2.22-.25-4.55-1.11-4.55-4.92c0-1.11.38-2 1.03-2.71c-.1-.25-.45-1.29.1-2.64c0 0 .84-.27 2.75 1.02c.79-.22 1.65-.33 2.5-.33s1.71.11 2.5.33c1.91-1.29 2.75-1.02 2.75-1.02c.55 1.35.2 2.39.1 2.64c.65.71 1.03 1.6 1.03 2.71c0 3.82-2.34 4.66-4.57 4.91c.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2"></path></svg></a></span>
          </span>
          <span className='text-gray-600'>
            <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" className='inline mr-2'><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M14.854 4H9.146C6.65 4 4.529 5.683 3.753 8.029c-.255.772-.383 1.158-.062 1.565c.32.406.843.406 1.887.406h12.844c1.044 0 1.566 0 1.887-.406s.194-.793-.062-1.565C19.471 5.683 17.35 4 14.854 4M4 16h-.5a1.5 1.5 0 0 1 0-3h7.894a2 2 0 0 1 1.11.336l1.941 1.294a1 1 0 0 0 1.11 0l1.941-1.294a2 2 0 0 1 1.11-.336H20.5a1.5 1.5 0 0 1 0 3H20M4 16l.432 1.728A3 3 0 0 0 7.342 20h9.316a3 3 0 0 0 2.91-2.272L20 16M4 16h7m9 0h-1.5m-3.492-9h-.01M10.5 6.5l-1 1" color="currentColor"></path></svg>
            p.s. I don&apos;t save or keep your data
            <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" className='inline ml-2'><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M14.854 4H9.146C6.65 4 4.529 5.683 3.753 8.029c-.255.772-.383 1.158-.062 1.565c.32.406.843.406 1.887.406h12.844c1.044 0 1.566 0 1.887-.406s.194-.793-.062-1.565C19.471 5.683 17.35 4 14.854 4M4 16h-.5a1.5 1.5 0 0 1 0-3h7.894a2 2 0 0 1 1.11.336l1.941 1.294a1 1 0 0 0 1.11 0l1.941-1.294a2 2 0 0 1 1.11-.336H20.5a1.5 1.5 0 0 1 0 3H20M4 16l.432 1.728A3 3 0 0 0 7.342 20h9.316a3 3 0 0 0 2.91-2.272L20 16M4 16h7m9 0h-1.5m-3.492-9h-.01M10.5 6.5l-1 1" color="currentColor"></path></svg>
          </span>
        </div>
      </div>
    </main>
  )
}