import React, { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { useAuth0 } from '@auth0/auth0-react'

// Cargar componentes Leaflet dinámicamente
const Map = dynamic(() => import('react-leaflet').then(mod => mod.MapContainer), { ssr: false })
const TileLayer = dynamic(() => import('react-leaflet').then(mod => mod.TileLayer), { ssr: false })
const Marker = dynamic(() => import('react-leaflet').then(mod => mod.Marker), { ssr: false })

// Componente separado para eventos del mapa
const MapClickHandler = dynamic(() => {
  return import('react-leaflet').then(mod => {
    const { useMapEvents } = mod
    
    return function MapClickHandler({ onLocationChange }: { onLocationChange: (lat: number, lng: number) => void }) {
      useMapEvents({
        click: (e: any) => {
          onLocationChange(e.latlng.lat, e.latlng.lng)
        }
      })
      return null
    }
  })
}, { ssr: false })

const AdminImport: React.FC = () => {
  const { getAccessTokenSilently } = useAuth0()
  const [center, setCenter] = useState({ lat: -34.6037, lng: -58.3816 })
  const [radius, setRadius] = useState(2000)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || ''

  // Fix Leaflet icon issue
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // This fixes the default marker icon issue in Leaflet when using webpack
      delete (window as any).L?.Icon?.Default?.prototype?._getIconUrl
      const L = require('leaflet')
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      })
    }
  }, [])

  const handleLocationChange = (lat: number, lng: number) => {
    setCenter({ lat, lng })
  }

  const handleImport = async () => {
    setLoading(true)
    try {
      // Obtener el token de Auth0
      const token = await getAccessTokenSilently()
      
      const res = await fetch(`${backendUrl}/admin/businesses`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ lat: center.lat, lng: center.lng, radius })
      })
      
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`)
      }
      
      const json = await res.json()
      setResult(json)
    } catch (e) {
      setResult({ error: (e as Error).message })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>Importar restaurantes desde Google Places</h1>
      
      <div style={{ marginBottom: 12 }}>
        <label style={{ display: 'block', marginBottom: 8 }}>
          <strong>Coordenadas:</strong> Haz clic en el mapa o ingresa manualmente
        </label>
        <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
          <label>
            Latitud:
            <input 
              type="number" 
              value={center.lat} 
              onChange={e => setCenter({...center, lat: parseFloat(e.target.value) || center.lat})}
              step="0.0001"
              style={{ marginLeft: 4, width: 120 }}
            />
          </label>
          <label>
            Longitud:
            <input 
              type="number" 
              value={center.lng} 
              onChange={e => setCenter({...center, lng: parseFloat(e.target.value) || center.lng})}
              step="0.0001"
              style={{ marginLeft: 4, width: 120 }}
            />
          </label>
        </div>
        <div style={{ fontSize: 12, color: '#666' }}>
          Coordenadas sugeridas: Palermo (-34.5731, -58.4289) | Microcentro (-34.6033, -58.3817)
        </div>
      </div>

      <div style={{ height: 400, marginBottom: 12 }}>
        {typeof window !== 'undefined' && (
          <Map 
            center={[center.lat, center.lng]} 
            zoom={13} 
            style={{ height: '100%' }}
            key={`${center.lat}-${center.lng}`}
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <Marker position={[center.lat, center.lng]} />
            <MapClickHandler onLocationChange={handleLocationChange} />
          </Map>
        )}
      </div>

      <div style={{ marginBottom: 12 }}>
        <label>Radio (metros): </label>
        <input 
          type="number" 
          value={radius} 
          onChange={e => setRadius(Number(e.target.value))} 
          min="100"
          max="50000"
          style={{ marginLeft: 4, width: 100 }}
        />
        <button onClick={handleImport} disabled={loading} style={{ marginLeft: 8, padding: '8px 16px' }}>
          {loading ? 'Importando...' : 'Importar desde Google Places'}
        </button>
      </div>

      {result && (
        <pre style={{ marginTop: 12, whiteSpace: 'pre-wrap' }}>{JSON.stringify(result, null, 2)}</pre>
      )}
    </div>
  )
}

export default AdminImport
