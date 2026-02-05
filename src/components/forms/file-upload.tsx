'use client'

import * as React from 'react'
import { Upload, X, Image as ImageIcon, FileText, Loader2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'

interface FileUploadProps {
  accept?: string
  multiple?: boolean
  maxFiles?: number
  maxSize?: number  // in MB
  value?: File[]
  onChange?: (files: File[]) => void
  onUpload?: (files: File[]) => Promise<string[]>
  className?: string
  disabled?: boolean
  preview?: boolean
  label?: string
  description?: string
  error?: string
}

export function FileUpload({
  accept = 'image/*',
  multiple = false,
  maxFiles = 5,
  maxSize = 5,
  value = [],
  onChange,
  onUpload,
  className,
  disabled = false,
  preview = true,
  label,
  description,
  error,
}: FileUploadProps) {
  const inputRef = React.useRef<HTMLInputElement>(null)
  const [isDragging, setIsDragging] = React.useState(false)
  const [isUploading, setIsUploading] = React.useState(false)
  const [previews, setPreviews] = React.useState<{ file: File; url: string }[]>([])
  const [localError, setLocalError] = React.useState<string>('')

  // Generate previews
  React.useEffect(() => {
    const newPreviews = value.map((file) => ({
      file,
      url: URL.createObjectURL(file),
    }))
    setPreviews(newPreviews)

    return () => {
      newPreviews.forEach(({ url }) => URL.revokeObjectURL(url))
    }
  }, [value])

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (!disabled) setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
    if (disabled) return

    const droppedFiles = Array.from(e.dataTransfer.files)
    handleFiles(droppedFiles)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || [])
    handleFiles(selectedFiles)
    // Reset input
    if (inputRef.current) {
      inputRef.current.value = ''
    }
  }

  const handleFiles = async (newFiles: File[]) => {
    setLocalError('')

    // Validate file types
    const invalidFiles = newFiles.filter((file) => {
      if (accept === 'image/*') {
        return !file.type.startsWith('image/')
      }
      return false
    })

    if (invalidFiles.length > 0) {
      setLocalError('Bəzi fayllar dəstəklənmir')
      return
    }

    // Validate file sizes
    const oversizedFiles = newFiles.filter((file) => file.size > maxSize * 1024 * 1024)
    if (oversizedFiles.length > 0) {
      setLocalError(`Faylların maksimum ölçüsü ${maxSize}MB olmalıdır`)
      return
    }

    // Check max files limit
    const totalFiles = value.length + newFiles.length
    if (totalFiles > maxFiles) {
      setLocalError(`Maksimum ${maxFiles} fayl yükləyə bilərsiniz`)
      return
    }

    const updatedFiles = multiple ? [...value, ...newFiles] : newFiles.slice(0, 1)
    
    if (onUpload) {
      setIsUploading(true)
      try {
        await onUpload(newFiles)
        onChange?.(updatedFiles)
      } catch (err) {
        setLocalError('Yükləmə zamanı xəta baş verdi')
      } finally {
        setIsUploading(false)
      }
    } else {
      onChange?.(updatedFiles)
    }
  }

  const removeFile = (index: number) => {
    const updatedFiles = value.filter((_, i) => i !== index)
    onChange?.(updatedFiles)
  }

  const displayError = error || localError

  return (
    <div className={cn('space-y-2', className)}>
      {label && (
        <label className="text-sm font-medium text-gray-700">{label}</label>
      )}

      {/* Drop Zone */}
      <div
        onDragEnter={handleDragEnter}
        onDragOver={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={cn(
          'relative border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all',
          isDragging && 'border-primary bg-primary/5',
          !isDragging && 'border-gray-200 hover:border-gray-300',
          disabled && 'opacity-50 cursor-not-allowed',
          displayError && 'border-red-300'
        )}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleInputChange}
          disabled={disabled || isUploading}
          className="hidden"
        />

        {isUploading ? (
          <div className="py-4">
            <Loader2 className="h-10 w-10 text-primary mx-auto animate-spin" />
            <p className="mt-2 text-sm text-gray-600">Yüklənir...</p>
          </div>
        ) : (
          <>
            <Upload className={cn(
              'h-10 w-10 mx-auto mb-3',
              isDragging ? 'text-primary' : 'text-gray-400'
            )} />
            <p className="text-sm font-medium text-gray-700">
              {isDragging ? 'Faylları buraxın' : 'Faylları sürükləyin və ya klikləyin'}
            </p>
            {description && (
              <p className="text-xs text-gray-500 mt-1">{description}</p>
            )}
            <p className="text-xs text-gray-400 mt-2">
              Maksimum {maxSize}MB, {maxFiles} fayl
            </p>
          </>
        )}
      </div>

      {/* Error */}
      {displayError && (
        <p className="text-sm text-red-500">{displayError}</p>
      )}

      {/* Previews */}
      {preview && previews.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
          <AnimatePresence>
            {previews.map(({ file, url }, index) => (
              <motion.div
                key={url}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="relative aspect-square rounded-lg overflow-hidden bg-gray-100 group"
              >
                {file.type.startsWith('image/') ? (
                  <img
                    src={url}
                    alt={file.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <FileText className="h-8 w-8 text-gray-400" />
                  </div>
                )}
                
                {/* Remove Button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    removeFile(index)
                  }}
                  className="absolute top-1 right-1 p-1 bg-black/50 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="h-4 w-4" />
                </button>

                {/* File Name */}
                <div className="absolute bottom-0 left-0 right-0 p-1 bg-black/50 text-white text-xs truncate">
                  {file.name}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  )
}

// Avatar Upload Component
interface AvatarUploadProps {
  value?: string
  onChange?: (file: File | null) => void
  onUpload?: (file: File) => Promise<string>
  size?: number
  className?: string
  disabled?: boolean
}

export function AvatarUpload({
  value,
  onChange,
  onUpload,
  size = 120,
  className,
  disabled = false,
}: AvatarUploadProps) {
  const inputRef = React.useRef<HTMLInputElement>(null)
  const [preview, setPreview] = React.useState<string | null>(null)
  const [isUploading, setIsUploading] = React.useState(false)

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Create preview
    const url = URL.createObjectURL(file)
    setPreview(url)

    if (onUpload) {
      setIsUploading(true)
      try {
        await onUpload(file)
        onChange?.(file)
      } catch (err) {
        setPreview(null)
      } finally {
        setIsUploading(false)
      }
    } else {
      onChange?.(file)
    }
  }

  const displayImage = preview || value

  return (
    <div className={cn('relative inline-block', className)}>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleChange}
        disabled={disabled || isUploading}
        className="hidden"
      />

      <div
        onClick={() => inputRef.current?.click()}
        style={{ width: size, height: size }}
        className={cn(
          'rounded-full overflow-hidden bg-gray-100 cursor-pointer relative group',
          disabled && 'opacity-50 cursor-not-allowed'
        )}
      >
        {displayImage ? (
          <img
            src={displayImage}
            alt="Avatar"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <ImageIcon className="h-8 w-8 text-gray-400" />
          </div>
        )}

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          {isUploading ? (
            <Loader2 className="h-6 w-6 text-white animate-spin" />
          ) : (
            <Upload className="h-6 w-6 text-white" />
          )}
        </div>
      </div>
    </div>
  )
}
