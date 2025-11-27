import React, { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { useAuth0 } from '@auth0/auth0-react'
import { useRouter } from 'next/router'

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

// Tipos para TypeScript
interface Business {
  id: number
  name: string
  address: string
  phone?: string
  website?: string
  has_menu: boolean
  status: string
  created_at: string
  google_place_url?: string
}

const AdminImport: React.FC = () => {
  const { getAccessTokenSilently } = useAuth0()
  const router = useRouter()
  const [center, setCenter] = useState({ lat: -34.6037, lng: -58.3816 })
  const [radius, setRadius] = useState(2000)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [businesses, setBusinesses] = useState<Business[]>([])
  const [loadingBusinesses, setLoadingBusinesses] = useState(true)

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

  // Función para cargar businesses existentes
  const loadBusinesses = async () => {
    setLoadingBusinesses(true)
    try {
      const token = await getAccessTokenSilently()
      const res = await fetch(`${backendUrl}/admin/businesses`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (res.ok) {
        const data = await res.json()
        setBusinesses(data)
      }
    } catch (error) {
      console.error('Error loading businesses:', error)
    } finally {
      setLoadingBusinesses(false)
    }
  }

  // Cargar businesses al montar el componente
  useEffect(() => {
    loadBusinesses()
  }, [])

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
      
      // Recargar la lista de businesses después de importar
      await loadBusinesses()
    } catch (e) {
      setResult({ error: (e as Error).message })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ 
      padding: '24px', 
      maxWidth: '1400px', 
      margin: '0 auto',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '32px'
      }}>
        <h1 style={{ 
          margin: 0,
          color: '#2c3e50',
          fontSize: '28px',
          fontWeight: '600'
        }}>
          🏪 Importar Restaurantes desde Google Places
        </h1>
        
        <button
          onClick={() => router.push('/admin')}
          style={{
            padding: '10px 16px',
            backgroundColor: '#6b7280',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            fontWeight: '500',
            cursor: 'pointer',
            fontSize: '14px',
            transition: 'background-color 0.2s',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#4b5563'}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#6b7280'}
        >
          ← Volver al Admin Panel
        </button>
      </div>
      
      {/* Sección de Coordenadas y Mapa */}
      <div style={{ 
        backgroundColor: '#f8fafc', 
        padding: '20px', 
        borderRadius: '12px', 
        border: '1px solid #e2e8f0',
        marginBottom: '24px'
      }}>
        <h2 style={{ 
          marginTop: 0, 
          marginBottom: '16px', 
          color: '#374151',
          fontSize: '18px',
          fontWeight: '500'
        }}>
          📍 Seleccionar Ubicación
        </h2>
        
        <div style={{ marginBottom: '16px' }}>
          <label style={{ 
            display: 'block', 
            marginBottom: '12px',
            fontWeight: '500',
            color: '#4b5563'
          }}>
            <strong>Coordenadas:</strong> Haz clic en el mapa o ingresa manualmente
          </label>
          <div style={{ display: 'flex', gap: '12px', marginBottom: '8px' }}>
            <label style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <span style={{ fontSize: '14px', color: '#6b7280' }}>Latitud:</span>
              <input 
                type="number" 
                value={center.lat} 
                onChange={e => setCenter({...center, lat: parseFloat(e.target.value) || center.lat})}
                step="0.0001"
                style={{ 
                  padding: '8px 12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  width: '140px',
                  fontSize: '14px'
                }}
              />
            </label>
            <label style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <span style={{ fontSize: '14px', color: '#6b7280' }}>Longitud:</span>
              <input 
                type="number" 
                value={center.lng} 
                onChange={e => setCenter({...center, lng: parseFloat(e.target.value) || center.lng})}
                step="0.0001"
                style={{ 
                  padding: '8px 12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  width: '140px',
                  fontSize: '14px'
                }}
              />
            </label>
          </div>
          <div style={{ 
            fontSize: '12px', 
            color: '#6b7280',
            backgroundColor: '#fff',
            padding: '8px',
            borderRadius: '6px',
            border: '1px solid #e5e7eb'
          }}>
            💡 <strong>Coordenadas sugeridas:</strong> Palermo (-34.5731, -58.4289) | Microcentro (-34.6033, -58.3817)
          </div>
        </div>

        <div style={{ 
          height: '400px', 
          marginBottom: '16px',
          borderRadius: '8px',
          overflow: 'hidden',
          border: '1px solid #d1d5db'
        }}>
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

        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '16px',
          flexWrap: 'wrap'
        }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontWeight: '500', color: '#4b5563' }}>📏 Radio (metros):</span>
            <input 
              type="number" 
              value={radius} 
              onChange={e => setRadius(Number(e.target.value))} 
              min="100"
              max="50000"
              style={{ 
                padding: '8px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                width: '120px',
                fontSize: '14px'
              }}
            />
          </label>
          <button 
            onClick={handleImport} 
            disabled={loading}
            style={{ 
              padding: '10px 20px',
              backgroundColor: loading ? '#9ca3af' : '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontWeight: '500',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontSize: '14px',
              transition: 'background-color 0.2s'
            }}
          >
            {loading ? '⏳ Importando...' : '🔄 Importar desde Google Places'}
          </button>
        </div>
      </div>

      {/* Resultado de la importación */}
      {result && (
        <div style={{ 
          backgroundColor: result.error ? '#fef2f2' : '#f0fdf4',
          border: `1px solid ${result.error ? '#fecaca' : '#bbf7d0'}`,
          padding: '16px',
          borderRadius: '8px',
          marginBottom: '24px'
        }}>
          <h3 style={{ 
            marginTop: 0, 
            marginBottom: '8px',
            color: result.error ? '#dc2626' : '#16a34a',
            fontSize: '16px'
          }}>
            {result.error ? '❌ Error' : '✅ Importación Completada'}
          </h3>
          <pre style={{ 
            whiteSpace: 'pre-wrap',
            fontSize: '14px',
            margin: 0,
            color: result.error ? '#b91c1c' : '#15803d'
          }}>
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}

      {/* Tabla de Businesses */}
      <div style={{ 
        backgroundColor: 'white', 
        borderRadius: '12px', 
        border: '1px solid #e2e8f0',
        overflow: 'hidden'
      }}>
        <div style={{ 
          padding: '20px',
          borderBottom: '1px solid #e2e8f0',
          backgroundColor: '#f8fafc'
        }}>
          <h2 style={{ 
            margin: 0,
            color: '#374151',
            fontSize: '20px',
            fontWeight: '600'
          }}>
            📊 Restaurantes Guardados ({businesses.length})
          </h2>
        </div>

        {loadingBusinesses ? (
          <div style={{ 
            padding: '40px',
            textAlign: 'center',
            color: '#6b7280'
          }}>
            ⏳ Cargando restaurantes...
          </div>
        ) : businesses.length === 0 ? (
          <div style={{ 
            padding: '40px',
            textAlign: 'center',
            color: '#6b7280'
          }}>
            📭 No hay restaurantes guardados aún. ¡Importa algunos usando el mapa!
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ 
              width: '100%',
              borderCollapse: 'collapse',
              fontSize: '14px'
            }}>
              <thead>
                <tr style={{ backgroundColor: '#f9fafb' }}>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #e5e7eb', color: '#374151', fontWeight: '600' }}>Nombre</th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #e5e7eb', color: '#374151', fontWeight: '600' }}>Dirección</th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #e5e7eb', color: '#374151', fontWeight: '600' }}>Teléfono</th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #e5e7eb', color: '#374151', fontWeight: '600' }}>Website</th>
                  <th style={{ padding: '12px', textAlign: 'center', borderBottom: '1px solid #e5e7eb', color: '#374151', fontWeight: '600' }}>Menú</th>
                  <th style={{ padding: '12px', textAlign: 'center', borderBottom: '1px solid #e5e7eb', color: '#374151', fontWeight: '600' }}>Estado</th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #e5e7eb', color: '#374151', fontWeight: '600' }}>Fecha</th>
                  <th style={{ padding: '12px', textAlign: 'center', borderBottom: '1px solid #e5e7eb', color: '#374151', fontWeight: '600' }}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {businesses.map((business) => (
                  <tr key={business.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                    <td style={{ 
                      padding: '12px',
                      fontWeight: '500',
                      color: '#111827'
                    }}>
                      {business.name}
                    </td>
                    <td style={{ 
                      padding: '12px',
                      color: '#6b7280',
                      fontSize: '13px',
                      maxWidth: '200px'
                    }}>
                      {business.address}
                    </td>
                    <td style={{ padding: '12px', color: '#6b7280' }}>
                      {business.phone || '-'}
                    </td>
                    <td style={{ padding: '12px' }}>
                      {business.website ? (
                        <a 
                          href={business.website} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          style={{ 
                            color: '#3b82f6',
                            textDecoration: 'none',
                            fontSize: '13px'
                          }}
                        >
                          🌐 Sitio web
                        </a>
                      ) : '-'}
                    </td>
                    <td style={{ 
                      padding: '12px',
                      textAlign: 'center'
                    }}>
                      <span style={{ 
                        fontSize: '16px'
                      }}>
                        {business.has_menu ? '✅' : '❌'}
                      </span>
                    </td>
                    <td style={{ 
                      padding: '12px',
                      textAlign: 'center'
                    }}>
                      <span style={{ 
                        padding: '4px 8px',
                        borderRadius: '12px',
                        fontSize: '12px',
                        fontWeight: '500',
                        backgroundColor: 
                          business.status === 'scanned' ? '#dcfce7' : 
                          business.status === 'failed' ? '#fef2f2' : '#fef3c7',
                        color: 
                          business.status === 'scanned' ? '#166534' : 
                          business.status === 'failed' ? '#dc2626' : '#92400e'
                      }}>
                        {business.status === 'pending' ? '⏳ Pendiente' :
                         business.status === 'scanned' ? '✅ Escaneado' :
                         business.status === 'failed' ? '❌ Falló' : business.status}
                      </span>
                    </td>
                    <td style={{ 
                      padding: '12px',
                      color: '#6b7280',
                      fontSize: '13px'
                    }}>
                      {new Date(business.created_at).toLocaleDateString('es-AR', {
                        day: '2-digit',
                        month: '2-digit',
                        year: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </td>
                    <td style={{ 
                      padding: '12px',
                      textAlign: 'center'
                    }}>
                      {business.google_place_url && (
                        <a 
                          href={business.google_place_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          style={{ 
                            color: '#3b82f6',
                            textDecoration: 'none',
                            fontSize: '18px'
                          }}
                          title="Ver en Google Maps"
                        >
                          📍
                        </a>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminImport
