import * as leaflet from 'leaflet'

declare global {
  interface Window {
    WE: typeof leaflet
  }
}

export {}