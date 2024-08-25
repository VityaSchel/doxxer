export function OS({ os, browser, batteryCharge, gpu, ram, cpuCores }: {
  os: string
  browser: string
  batteryCharge: number | null
  gpu: string | null
  ram: number | null
  cpuCores: number | null
}) {
  return (
    <div className='flex flex-col gap-8 fixed top-0 left-0 w-full h-full justify-center items-center px-4 1096:p-0'>
      <div className='flex flex-col 1096:flex-row gap-4 items-center 1096:items-end'>
        <div className='flex flex-col gap-2 items-center 1096:w-[30vw]'>
          <OsImage os={os.toLowerCase()} />
          <span className='font-bk text-2xl 1096:text-4xl text-[#D94D25] text-center'>YOUR OS: {os}</span>
        </div>
        <div className='flex flex-col gap-2 items-center 1096:w-[30vw]'>
          <BrowserImage browser={browser.toLowerCase()} />
          <span className='font-bk text-2xl 1096:text-4xl text-[#B23927] text-center'>YOUR BROWSER: {browser}</span>
        </div>
      </div>
      <div className='flex flex-col gap-2 font-bk text-xl 1096:text-4xl text-center'>
        {batteryCharge && <span>BATTERY: {batteryCharge}%</span>}
        {gpu && <span>GPU: {gpu}</span>}
        {ram && <span>RAM: {ram} GB</span>}
        {cpuCores && <span>CPU: {cpuCores} CORES</span>}
      </div>
    </div>
  )
}

function OsImage({ os }: {
  os: string
}) {
  let src: string
  if(os.includes('windows')) {
    src = 'windows-pc'
  } else if (os.includes('macos') || os.includes('mac os') || os.includes('macintosh')) {
    if(os.includes('arm')) {
      src = 'mac-arm'
    } else {
      src = 'mac-intel'
    }
  } else if(os.includes('android')) {
    if (os.includes('android 16') || os.includes('android 15') || os.includes('android 14') || os.includes('android 13') || os.includes('android 12') || os.includes('android 11')) {
      src = 'android-modern'
    } else {
      src = 'android-old'
    }
  } else if(os.includes('ios')) {
    if(os.includes('ios 14') || os.includes('ios 15') || os.includes('ios 16') || os.includes('ios 17') || os.includes('ios 18') || os.includes('ios 19')) {
      src = 'iphone-modern'
    } else {
      src = 'iphone-old'
    }
  } else {
    src = 'linux-pc'
  } 
  return (
    <img src={`/os/${src}.jpg`} alt="os" className='w-[30vw] 1096:h-[30vh]' />
  )
}

function BrowserImage({ browser }: {
  browser: string
}) {
  let src: string
  if (browser.includes('firefox')) {
    src = 'firefox'
  } else if(browser.includes('safari')) {
    src = 'safari'
  } else if(browser.includes('edge')) {
    src = 'edge'
  } else if(browser.includes('opera')) {
    src = 'opera'
  } else if(browser.includes('brave')) {
    src = 'brave'
  } else if(browser.includes('arc')) {
    src = 'arc'
  } else {
    src = 'chrome'
  }
  return (
    <img src={`/browsers/${src}.jpg`} alt="browser" className='w-[30vw] 1096:h-[30vh]' />
  )
}