// Location and Distance Utilities
// Google Maps API və ya Yandex Maps üçün hazırlanıb

export interface Coordinates {
  lat: number
  lng: number
}

export interface LocationResult {
  success: boolean
  coordinates?: Coordinates
  error?: string
  address?: string
}

// Calculate distance between two points using Haversine formula
export function calculateDistance(
  point1: Coordinates,
  point2: Coordinates
): number {
  const R = 6371e3 // Earth's radius in meters
  const φ1 = (point1.lat * Math.PI) / 180
  const φ2 = (point2.lat * Math.PI) / 180
  const Δφ = ((point2.lat - point1.lat) * Math.PI) / 180
  const Δλ = ((point2.lng - point1.lng) * Math.PI) / 180

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

  return R * c // Distance in meters
}

// Format distance for display
export function formatDistance(meters: number): string {
  if (meters < 1000) {
    return `${Math.round(meters)} m`
  }
  return `${(meters / 1000).toFixed(1)} km`
}

// Get user's current location using browser Geolocation API
export async function getCurrentLocation(): Promise<LocationResult> {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      resolve({
        success: false,
        error: "Geolocation dəstəklənmir",
      })
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          success: true,
          coordinates: {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          },
        })
      },
      (error) => {
        let errorMessage = "Məkan alına bilmədi"
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = "Məkan icazəsi rədd edildi"
            break
          case error.POSITION_UNAVAILABLE:
            errorMessage = "Məkan məlumatı mövcud deyil"
            break
          case error.TIMEOUT:
            errorMessage = "Məkan sorğusu vaxt aşımına uğradı"
            break
        }
        resolve({
          success: false,
          error: errorMessage,
        })
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000, // 5 minutes cache
      }
    )
  })
}

// Bakı rayonlarının koordinatları
export const BAKU_DISTRICTS: Record<string, Coordinates> = {
  yasamal: { lat: 40.3856, lng: 49.8149 },
  nasimi: { lat: 40.3917, lng: 49.8545 },
  sabail: { lat: 40.3656, lng: 49.8352 },
  narimanov: { lat: 40.4115, lng: 49.8682 },
  xatai: { lat: 40.3947, lng: 49.9082 },
  nizami: { lat: 40.3778, lng: 49.8028 },
  binagadi: { lat: 40.4495, lng: 49.8202 },
  suraxani: { lat: 40.4299, lng: 50.0173 },
  sabunchu: { lat: 40.4458, lng: 49.9482 },
  qaradag: { lat: 40.35, lng: 49.9667 },
  pirallahi: { lat: 40.4833, lng: 50.3 },
  xazar: { lat: 40.5118, lng: 50.1146 },
  abseron: { lat: 40.4417, lng: 49.9417 },
  sumqayit: { lat: 40.5897, lng: 49.6686 },
}

// Get district name from coordinates
export function getDistrictFromCoordinates(coords: Coordinates): string {
  let closestDistrict = "yasamal"
  let minDistance = Infinity

  for (const [district, districtCoords] of Object.entries(BAKU_DISTRICTS)) {
    const distance = calculateDistance(coords, districtCoords)
    if (distance < minDistance) {
      minDistance = distance
      closestDistrict = district
    }
  }

  return closestDistrict
}

// Google Maps API integration (requires API key)
export class GoogleMapsService {
  private apiKey: string

  constructor(apiKey: string) {
    this.apiKey = apiKey
  }

  // Geocode address to coordinates
  async geocodeAddress(address: string): Promise<LocationResult> {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
          address
        )}&key=${this.apiKey}&region=az`
      )
      const data = await response.json()

      if (data.status === "OK" && data.results.length > 0) {
        const location = data.results[0].geometry.location
        return {
          success: true,
          coordinates: { lat: location.lat, lng: location.lng },
          address: data.results[0].formatted_address,
        }
      }
      return {
        success: false,
        error: "Ünvan tapılmadı",
      }
    } catch (error) {
      return {
        success: false,
        error: "Geocoding xətası",
      }
    }
  }

  // Reverse geocode coordinates to address
  async reverseGeocode(coords: Coordinates): Promise<LocationResult> {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${coords.lat},${coords.lng}&key=${this.apiKey}&language=az`
      )
      const data = await response.json()

      if (data.status === "OK" && data.results.length > 0) {
        return {
          success: true,
          coordinates: coords,
          address: data.results[0].formatted_address,
        }
      }
      return {
        success: false,
        error: "Ünvan tapılmadı",
      }
    } catch (error) {
      return {
        success: false,
        error: "Reverse geocoding xətası",
      }
    }
  }

  // Get directions and ETA
  async getDirections(
    origin: Coordinates,
    destination: Coordinates
  ): Promise<{
    distance: string
    duration: string
    success: boolean
  }> {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/directions/json?origin=${origin.lat},${origin.lng}&destination=${destination.lat},${destination.lng}&key=${this.apiKey}&language=az`
      )
      const data = await response.json()

      if (data.status === "OK" && data.routes.length > 0) {
        const leg = data.routes[0].legs[0]
        return {
          success: true,
          distance: leg.distance.text,
          duration: leg.duration.text,
        }
      }
      return {
        success: false,
        distance: "",
        duration: "",
      }
    } catch (error) {
      return {
        success: false,
        distance: "",
        duration: "",
      }
    }
  }
}

// Initialize maps service
export function initMapsService(): GoogleMapsService | null {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
  if (!apiKey) {
    console.warn("Google Maps API key not configured")
    return null
  }
  return new GoogleMapsService(apiKey)
}
