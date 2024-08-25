import React from 'react'
import { Earth } from '@/features/earth'
import cx from 'classnames'

export function Map({ point, visible }: {
  point: { lat: number | null, long: number | null }
  visible: boolean
}) {
  const [name, setName] = React.useState('')
  const [marker, setMarker] = React.useState('')
  const [reveal, setReveal] = React.useState(false)
  const lastNominatimRequest = React.useRef<{ lat: number, long: number } | undefined>()

  React.useEffect(() => {
    reverseGeoCode(point)
  }, [point])

  const reverseGeoCode = async (point: { lat: number | null, long: number | null }) => {
    if(point.lat === null || point.long === null) return
    if (lastNominatimRequest.current !== undefined && lastNominatimRequest.current.lat === point.lat && lastNominatimRequest.current.long === point.long) return
    lastNominatimRequest.current = {
      lat: point.lat,
      long: point.long
    }
    const response = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${point.lat}&lon=${point.long}&format=json`, {
      headers: {
        'accept-language': 'en'
      }
    })
      .then(res => res.json() as Promise<{ error: string } | { display_name: string }>)
    if('display_name' in response) {
      setName(response.display_name)
    }
    if ('address' in response && typeof response.address === 'object' && response.address) {
      if('road' in response.address && typeof response.address.road === 'string') {
        setMarker(response.address.road)
      } else if ('village' in response.address && typeof response.address.village === 'string') {
        setMarker(response.address.village)
      }
    }
  }

  React.useEffect(() => {
    if(visible) {
      setTimeout(() => {
        setReveal(true)
      }, 3 * 1000)
    }
  }, [visible])

  return (
    <div className={cx('fixed top-0 left-0 w-full h-full', {
      'opacity-0': !visible,
      'opacity-100': visible
    })}>
      <div className={cx('absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-px h-px flex flex-col items-center justify-end z-10 gap-4 filter-shadow-big transition-opacity', {
        'opacity-0': !reveal,
        'opacity-100': reveal
      })}>
        <span className='text-white font-semibold text-center w-64 block leading-tight text-shadow-big'>
          {marker}
        </span>
        <svg xmlns="http://www.w3.org/2000/svg" width="48px" height="48px" viewBox="0 0 24 24" className='shrink-0'><path fill="red" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7m0 9.5a2.5 2.5 0 0 1 0-5a2.5 2.5 0 0 1 0 5"></path></svg>
      </div>
      <h1 className={cx('absolute font-bk z-10 top-[2vw] left-[3vw] bk-text transition-opacity', {
        'opacity-0': !reveal,
        'opacity-100': reveal
      })}>
        {name}
      </h1>
      <Earth point={point} visible={visible} />
    </div>
  )
}