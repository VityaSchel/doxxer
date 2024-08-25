import { LatLngBoundsExpression } from 'leaflet'
import React from 'react'

export function Earth({ point, visible }: {
  point: { lat: number | null, long: number | null }
  visible: boolean
}) {
  const earthRef = React.useRef<any>()
  const initialized = React.useRef(false)

  const calculateBounds = (lat: number, long: number, zoom: number) => {
    const latOffset = 0.1 / zoom
    const longOffset = 0.1 / zoom

    const bounds: LatLngBoundsExpression = [
      [lat - latOffset, long - longOffset], // Southwest
      [lat + latOffset, long + longOffset]  // Northeast
    ]

    return bounds
  }

  React.useEffect(() => {
    if (initialized.current) return
    initialized.current = true
    const earth = window.WE.map('earth_div')
    window.WE.tileLayer('http://{s}.google.com/vt/lyrs=s,r&hl=en&x={x}&y={y}&z={z}', {
      attribution: '© OpenStreetMap contributors',
      subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
    }).addTo(earth)
    earth.setZoom(4)
    earthRef.current = earth
  }, [])

  React.useEffect(() => {
    if (visible && point.lat && point.long) {
      earthRef.current.panInsideBounds(calculateBounds(point.lat, point.long, 100), {
        duration: 2,
        easeLinearity: 0
      })
    }
  }, [visible, point])

  return (
    <div id="earth_div" className='absolute top-0 left-0 w-full h-full pointer-events-none'></div>
  )
}