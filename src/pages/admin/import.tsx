import React, { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'

// Load Leaflet only in client
const Map = dynamic(() => import('react-leaflet').then(mod => mod.MapContainer), { ssr: false })
const TileLayer = dynamic(() => import('react-leaflet').then(mod => mod.TileLayer), { ssr: false })
const Marker = dynamic(() => import('react-leaflet').then(mod => mod.Marker), { ssr: false })

const AdminImport: React.FC = () => {
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

  const handleImport = async () => {
    setLoading(true)
    try {
      const res = await fetch(`${backendUrl}/admin/businesses`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lat: center.lat, lng: center.lng, radius })
      })
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
      <div style={{ height: 400 }}>
        {typeof window !== 'undefined' && (
          <Map center={[center.lat, center.lng]} zoom={13} style={{ height: '100%' }}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <Marker position={[center.lat, center.lng]} />
          </Map>
        )}
      </div>

      <div style={{ marginTop: 12 }}>
        <label>Radius (meters): </label>
        <input type="number" value={radius} onChange={e => setRadius(Number(e.target.value))} />
        <button onClick={handleImport} disabled={loading} style={{ marginLeft: 8 }}>
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
