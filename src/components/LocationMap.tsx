'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { Coordinates, getCurrentLocation, formatDistance, calculateDistance } from '@/lib/location'

interface LocationMapProps {
  initialCenter?: Coordinates
  markers?: Array<{
    id: string
    position: Coordinates
    title: string
    onClick?: () => void
  }>
  onLocationSelect?: (coords: Coordinates) => void
  showUserLocation?: boolean
  height?: string
}

export default function LocationMap({
  initialCenter = { lat: 40.4093, lng: 49.8671 }, // Bakı
  markers = [],
  onLocationSelect,
  showUserLocation = true,
  height = '400px',
}: LocationMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const [userLocation, setUserLocation] = useState<Coordinates | null>(null)
  const [selectedLocation, setSelectedLocation] = useState<Coordinates | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Get user location on mount
  useEffect(() => {
    if (showUserLocation) {
      fetchUserLocation()
    }
  }, [showUserLocation])

  const fetchUserLocation = async () => {
    setIsLoading(true)
    setError(null)
    const result = await getCurrentLocation()
    setIsLoading(false)
    
    if (result.success && result.coordinates) {
      setUserLocation(result.coordinates)
    } else {
      setError(result.error || 'Məkan alına bilmədi')
    }
  }

  const handleLocationClick = useCallback((coords: Coordinates) => {
    setSelectedLocation(coords)
    onLocationSelect?.(coords)
  }, [onLocationSelect])

  // Calculate distances from user location
  const markersWithDistance = markers.map((marker) => ({
    ...marker,
    distance: userLocation
      ? formatDistance(calculateDistance(userLocation, marker.position))
      : null,
  }))

  return (
    <div className="relative rounded-lg overflow-hidden border border-gray-200">
      {/* Map Container */}
      <div
        ref={mapRef}
        style={{ height }}
        className="bg-gray-100 relative"
      >
        {/* Simple Map Placeholder - Replace with actual Google Maps when API key is added */}
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-blue-50 to-green-50">
          <div className="text-center p-6">
            <div className="w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            
            {isLoading ? (
              <p className="text-gray-600">Məkanınız axtarılır...</p>
            ) : userLocation ? (
              <div>
                <p className="text-green-600 font-medium mb-1">Məkan təyin edildi ✓</p>
                <p className="text-sm text-gray-500">
                  {userLocation.lat.toFixed(4)}, {userLocation.lng.toFixed(4)}
                </p>
              </div>
            ) : (
              <div>
                <p className="text-gray-600 mb-3">
                  {error || 'Xəritəni görmək üçün Google Maps API açarı lazımdır'}
                </p>
                <button
                  onClick={fetchUserLocation}
                  className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                >
                  Məkanımı tap
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Markers list overlay */}
        {markers.length > 0 && (
          <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-sm rounded-lg shadow-lg max-h-48 overflow-y-auto">
            <div className="p-3 border-b border-gray-100">
              <h4 className="font-medium text-sm text-gray-700">
                {markers.length} usta tapıldı
              </h4>
            </div>
            <div className="divide-y divide-gray-100">
              {markersWithDistance.map((marker) => (
                <button
                  key={marker.id}
                  onClick={() => {
                    handleLocationClick(marker.position)
                    marker.onClick?.()
                  }}
                  className="w-full px-3 py-2 text-left hover:bg-gray-50 transition-colors flex items-center justify-between"
                >
                  <span className="text-sm font-medium text-gray-800">{marker.title}</span>
                  {marker.distance && (
                    <span className="text-xs text-primary font-medium">
                      {marker.distance}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Location info bar */}
      {userLocation && (
        <div className="bg-green-50 px-4 py-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-sm text-green-700">Canlı məkan aktiv</span>
          </div>
          <button
            onClick={fetchUserLocation}
            className="text-sm text-green-600 hover:text-green-800 font-medium"
          >
            Yenilə
          </button>
        </div>
      )}
    </div>
  )
}
