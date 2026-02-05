'use client'

import * as React from 'react'
import { useForm, UseFormReturn, FieldValues, Path, SubmitHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ZodSchema } from 'zod'
import { cn } from '@/lib/utils'

// Form Context
interface FormContextValue<T extends FieldValues> {
  form: UseFormReturn<T>
}

const FormContext = React.createContext<FormContextValue<any> | undefined>(undefined)

function useFormContext<T extends FieldValues>() {
  const context = React.useContext(FormContext)
  if (!context) {
    throw new Error('Form components must be used within a Form')
  }
  return context as FormContextValue<T>
}

// Form Root
interface FormProps<T extends FieldValues> {
  schema: ZodSchema<T>
  onSubmit: SubmitHandler<T>
  defaultValues?: Partial<T>
  children: React.ReactNode
  className?: string
}

export function Form<T extends FieldValues>({
  schema,
  onSubmit,
  defaultValues,
  children,
  className,
}: FormProps<T>) {
  const form = useForm<T>({
    resolver: zodResolver(schema),
    defaultValues: defaultValues as any,
  })

  return (
    <FormContext.Provider value={{ form }}>
      <form onSubmit={form.handleSubmit(onSubmit)} className={className}>
        {children}
      </form>
    </FormContext.Provider>
  )
}

// Form Field
interface FormFieldProps<T extends FieldValues> {
  name: Path<T>
  children: (props: {
    field: ReturnType<UseFormReturn<T>['register']>
    error?: string
    isDirty: boolean
    isTouched: boolean
  }) => React.ReactNode
}

export function FormField<T extends FieldValues>({ name, children }: FormFieldProps<T>) {
  const { form } = useFormContext<T>()
  const { register, formState: { errors, dirtyFields, touchedFields } } = form
  
  const error = errors[name]?.message as string | undefined
  const isDirty = !!(dirtyFields as Record<string, boolean>)[name as string]
  const isTouched = !!(touchedFields as Record<string, boolean>)[name as string]

  return <>{children({ field: register(name), error, isDirty, isTouched })}</>
}

// Form Item (wrapper for form field)
interface FormItemProps {
  className?: string
  children: React.ReactNode
}

export function FormItem({ className, children }: FormItemProps) {
  return (
    <div className={cn('space-y-2', className)}>
      {children}
    </div>
  )
}

// Form Label
interface FormLabelProps {
  htmlFor?: string
  required?: boolean
  className?: string
  children: React.ReactNode
}

export function FormLabel({ htmlFor, required, className, children }: FormLabelProps) {
  return (
    <label
      htmlFor={htmlFor}
      className={cn(
        'text-sm font-medium text-gray-700',
        className
      )}
    >
      {children}
      {required && <span className="text-red-500 ml-1">*</span>}
    </label>
  )
}

// Form Error
interface FormErrorProps {
  message?: string
  className?: string
}

export function FormError({ message, className }: FormErrorProps) {
  if (!message) return null

  return (
    <p className={cn('text-sm text-red-500', className)}>
      {message}
    </p>
  )
}

// Form Description
interface FormDescriptionProps {
  className?: string
  children: React.ReactNode
}

export function FormDescription({ className, children }: FormDescriptionProps) {
  return (
    <p className={cn('text-sm text-gray-500', className)}>
      {children}
    </p>
  )
}

// Form Actions (submit/cancel buttons container)
interface FormActionsProps {
  className?: string
  children: React.ReactNode
}

export function FormActions({ className, children }: FormActionsProps) {
  return (
    <div className={cn('flex items-center justify-end gap-3 pt-4', className)}>
      {children}
    </div>
  )
}

// Hook to access form from children
export function useFormField<T extends FieldValues>() {
  return useFormContext<T>().form
}
