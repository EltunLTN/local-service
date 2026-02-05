'use client'

import * as React from 'react'
import { MapPin, Navigation, Search, X, Loader2, ChevronRight } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { BAKU_DISTRICTS } from '@/lib/constants'
import { useDebounce } from '@/hooks'

interface Address {
  id?: string
  label: string
  fullAddress: string
  district: string
  lat?: number
  lng?: number
}

interface AddressPickerProps {
  value?: Address | null
  onChange?: (address: Address | null) => void
  onCurrentLocation?: () => void
  className?: string
  placeholder?: string
  showCurrentLocation?: boolean
  savedAddresses?: Address[]
  error?: string
}

export function AddressPicker({
  value,
  onChange,
  onCurrentLocation,
  className,
  placeholder = 'Ünvanı daxil edin...',
  showCurrentLocation = true,
  savedAddresses = [],
  error,
}: AddressPickerProps) {
  const [isOpen, setIsOpen] = React.useState(false)
  const [searchQuery, setSearchQuery] = React.useState('')
  const [isLoading, setIsLoading] = React.useState(false)
  const [suggestions, setSuggestions] = React.useState<Address[]>([])
  const inputRef = React.useRef<HTMLInputElement>(null)
  const containerRef = React.useRef<HTMLDivElement>(null)

  const debouncedSearch = useDebounce(searchQuery, 300)

  // Mock search - replace with actual geocoding API
  React.useEffect(() => {
    if (!debouncedSearch) {
      setSuggestions([])
      return
    }

    setIsLoading(true)
    // Simulated API call
    setTimeout(() => {
      const mockSuggestions: Address[] = [
        {
          fullAddress: `${debouncedSearch}, Bakı, Azərbaycan`,
          label: 'Ev',
          district: 'Yasamal',
          lat: 40.4093,
          lng: 49.8671,
        },
        {
          fullAddress: `${debouncedSearch} küç. 15, Bakı`,
          label: 'İş',
          district: 'Nəsimi',
          lat: 40.3789,
          lng: 49.8526,
        },
      ]
      setSuggestions(mockSuggestions)
      setIsLoading(false)
    }, 500)
  }, [debouncedSearch])

  // Close on outside click
  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSelectAddress = (address: Address) => {
    onChange?.(address)
    setSearchQuery('')
    setIsOpen(false)
  }

  const handleClear = () => {
    onChange?.(null)
    setSearchQuery('')
  }

  const handleGetCurrentLocation = async () => {
    if (!navigator.geolocation) {
      alert('Geolokasiya dəstəklənmir')
      return
    }

    setIsLoading(true)
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords
        // Mock reverse geocoding
        const address: Address = {
          fullAddress: 'Cari yerləşmə',
          label: 'Cari ünvan',
          district: 'Bakı',
          lat: latitude,
          lng: longitude,
        }
        onChange?.(address)
        setIsLoading(false)
        setIsOpen(false)
      },
      (error) => {
        console.error('Geolocation error:', error)
        setIsLoading(false)
      }
    )
  }

  return (
    <div ref={containerRef} className={cn('relative', className)}>
      {/* Selected Address or Input */}
      {value ? (
        <div
          onClick={() => setIsOpen(true)}
          className={cn(
            'flex items-center gap-3 p-3 bg-white border rounded-xl cursor-pointer hover:border-gray-300 transition-colors',
            error && 'border-red-300'
          )}
        >
          <MapPin className="h-5 w-5 text-primary flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="font-medium text-gray-900 truncate">{value.fullAddress}</p>
            <p className="text-sm text-gray-500">{value.district}</p>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation()
              handleClear()
            }}
            className="p-1 hover:bg-gray-100 rounded-full"
          >
            <X className="h-4 w-4 text-gray-400" />
          </button>
        </div>
      ) : (
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            ref={inputRef}
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value)
              setIsOpen(true)
            }}
            onFocus={() => setIsOpen(true)}
            placeholder={placeholder}
            className={cn('pl-10', error && 'border-red-300')}
          />
          {isLoading && (
            <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 animate-spin" />
          )}
        </div>
      )}

      {/* Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-lg border border-gray-100 z-50 overflow-hidden"
          >
            {/* Current Location */}
            {showCurrentLocation && (
              <button
                onClick={handleGetCurrentLocation}
                className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 transition-colors border-b border-gray-100"
              >
                <Navigation className="h-5 w-5 text-primary" />
                <span className="font-medium text-primary">Cari yerləşməni istifadə et</span>
              </button>
            )}

            {/* Saved Addresses */}
            {savedAddresses.length > 0 && (
              <div className="border-b border-gray-100">
                <p className="px-3 py-2 text-xs text-gray-500 uppercase tracking-wide">
                  Saxlanmış ünvanlar
                </p>
                {savedAddresses.map((address, index) => (
                  <button
                    key={index}
                    onClick={() => handleSelectAddress(address)}
                    className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 transition-colors"
                  >
                    <MapPin className="h-5 w-5 text-gray-400" />
                    <div className="flex-1 text-left">
                      <p className="font-medium text-gray-900">{address.label}</p>
                      <p className="text-sm text-gray-500 truncate">{address.fullAddress}</p>
                    </div>
                    <ChevronRight className="h-4 w-4 text-gray-400" />
                  </button>
                ))}
              </div>
            )}

            {/* Search Suggestions */}
            {suggestions.length > 0 && (
              <div>
                <p className="px-3 py-2 text-xs text-gray-500 uppercase tracking-wide">
                  Axtarış nəticələri
                </p>
                {suggestions.map((address, index) => (
                  <button
                    key={index}
                    onClick={() => handleSelectAddress(address)}
                    className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 transition-colors"
                  >
                    <MapPin className="h-5 w-5 text-gray-400" />
                    <div className="flex-1 text-left">
                      <p className="font-medium text-gray-900">{address.fullAddress}</p>
                      <p className="text-sm text-gray-500">{address.district}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {/* Districts */}
            {!searchQuery && (
              <div className="max-h-48 overflow-y-auto">
                <p className="px-3 py-2 text-xs text-gray-500 uppercase tracking-wide">
                  Rayonlar
                </p>
                <div className="grid grid-cols-2 gap-1 p-2">
                  {BAKU_DISTRICTS.map((district) => (
                    <button
                      key={district.id}
                      onClick={() => handleSelectAddress({
                        fullAddress: `${district.name}, Bakı`,
                        label: district.name,
                        district: district.name,
                      })}
                      className="text-left px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors text-sm"
                    >
                      {district.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* No results */}
            {searchQuery && suggestions.length === 0 && !isLoading && (
              <p className="p-4 text-sm text-gray-500 text-center">
                Ünvan tapılmadı
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error */}
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  )
}

// District Selector
interface DistrictSelectorProps {
  value?: string
  onChange?: (district: string) => void
  className?: string
  error?: string
}

export function DistrictSelector({
  value,
  onChange,
  className,
  error,
}: DistrictSelectorProps) {
  return (
    <div className={cn('space-y-2', className)}>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
        {BAKU_DISTRICTS.map((district) => (
          <button
            key={district.id}
            type="button"
            onClick={() => onChange?.(district.id)}
            className={cn(
              'px-3 py-2 rounded-lg border text-sm transition-all',
              value === district.id
                ? 'border-primary bg-primary/10 text-primary font-medium'
                : 'border-gray-200 hover:border-gray-300 text-gray-700'
            )}
          >
            {district.name}
          </button>
        ))}
      </div>
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  )
}
