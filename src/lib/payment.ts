/**
 * Kapital Bank Payment Integration
 * API Documentation: https://developer.kapitalbank.az
 * 
 * Bu modul Kapital Bank ödəmə sistemi üçün hazırlanıb.
 * Production-da istifadə üçün KAPITAL_BANK_MERCHANT_ID və KAPITAL_BANK_SECRET
 * environment variables-ları tənzimlənməlidir.
 */

export interface PaymentConfig {
  merchantId: string
  secretKey: string
  apiUrl: string
  currency: string
  language: string
}

export interface PaymentRequest {
  orderId: string
  amount: number // AZN
  description: string
  returnUrl: string
  failUrl?: string
  customerEmail?: string
  customerPhone?: string
}

export interface PaymentResponse {
  success: boolean
  transactionId?: string
  redirectUrl?: string
  error?: string
  errorCode?: string
}

export interface PaymentStatus {
  transactionId: string
  orderId: string
  status: 'pending' | 'success' | 'failed' | 'cancelled'
  amount: number
  paidAt?: string
  errorMessage?: string
}

// Payment status codes
export const PAYMENT_STATUS_CODES = {
  SUCCESS: '000',
  PENDING: '001',
  DECLINED: '002',
  INSUFFICIENT_FUNDS: '003',
  EXPIRED: '004',
  SYSTEM_ERROR: '005',
  CANCELLED: '006',
}

// Kapital Bank API service
export class KapitalBankService {
  private config: PaymentConfig

  constructor() {
    this.config = {
      merchantId: process.env.KAPITAL_BANK_MERCHANT_ID || 'DEMO_MERCHANT',
      secretKey: process.env.KAPITAL_BANK_SECRET || 'DEMO_SECRET',
      apiUrl: process.env.KAPITAL_BANK_API_URL || 'https://api.kapitalbank.az/v1',
      currency: 'AZN',
      language: 'az',
    }
  }

  // Check if in demo mode
  private isDemoMode(): boolean {
    return !process.env.KAPITAL_BANK_MERCHANT_ID || 
           process.env.KAPITAL_BANK_MERCHANT_ID === 'DEMO_MERCHANT'
  }

  // Generate payment signature
  private generateSignature(data: string): string {
    // In production, use actual crypto hashing with secret key
    // This is a placeholder
    const crypto = require('crypto')
    return crypto
      .createHmac('sha256', this.config.secretKey)
      .update(data)
      .digest('hex')
  }

  // Initialize payment
  async initializePayment(request: PaymentRequest): Promise<PaymentResponse> {
    // Demo mode handling
    if (this.isDemoMode()) {
      const demoTransactionId = `DEMO_${Date.now()}`
      console.log('[DEMO] Kapital Bank payment initialized:', request)
      
      return {
        success: true,
        transactionId: demoTransactionId,
        redirectUrl: `${request.returnUrl}?transaction_id=${demoTransactionId}&demo=true`,
      }
    }

    try {
      const payload = {
        merchant_id: this.config.merchantId,
        order_id: request.orderId,
        amount: Math.round(request.amount * 100), // Convert to qəpik
        currency: this.config.currency,
        description: request.description,
        return_url: request.returnUrl,
        fail_url: request.failUrl || request.returnUrl,
        customer_email: request.customerEmail,
        customer_phone: request.customerPhone,
        language: this.config.language,
      }

      const signature = this.generateSignature(JSON.stringify(payload))

      const response = await fetch(`${this.config.apiUrl}/payment/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Signature': signature,
          'X-Merchant-ID': this.config.merchantId,
        },
        body: JSON.stringify(payload),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        return {
          success: true,
          transactionId: data.transaction_id,
          redirectUrl: data.payment_url,
        }
      }

      return {
        success: false,
        error: data.error_message || 'Ödəniş başlana bilmədi',
        errorCode: data.error_code,
      }
    } catch (error) {
      console.error('Kapital Bank payment error:', error)
      return {
        success: false,
        error: 'Ödəniş sistemi ilə əlaqə qurula bilmədi',
      }
    }
  }

  // Check payment status
  async checkPaymentStatus(transactionId: string): Promise<PaymentStatus> {
    if (this.isDemoMode()) {
      console.log('[DEMO] Checking payment status:', transactionId)
      
      // Simulate successful payment in demo mode
      return {
        transactionId,
        orderId: transactionId.replace('DEMO_', 'ORDER_'),
        status: 'success',
        amount: 0,
        paidAt: new Date().toISOString(),
      }
    }

    try {
      const signature = this.generateSignature(transactionId)

      const response = await fetch(
        `${this.config.apiUrl}/payment/status/${transactionId}`,
        {
          headers: {
            'X-Signature': signature,
            'X-Merchant-ID': this.config.merchantId,
          },
        }
      )

      const data = await response.json()

      return {
        transactionId,
        orderId: data.order_id,
        status: this.mapStatus(data.status),
        amount: data.amount / 100, // Convert from qəpik
        paidAt: data.paid_at,
        errorMessage: data.error_message,
      }
    } catch (error) {
      console.error('Kapital Bank status check error:', error)
      return {
        transactionId,
        orderId: '',
        status: 'failed',
        amount: 0,
        errorMessage: 'Status yoxlanıla bilmədi',
      }
    }
  }

  // Map Kapital Bank status to internal status
  private mapStatus(
    bankStatus: string
  ): 'pending' | 'success' | 'failed' | 'cancelled' {
    switch (bankStatus) {
      case PAYMENT_STATUS_CODES.SUCCESS:
        return 'success'
      case PAYMENT_STATUS_CODES.PENDING:
        return 'pending'
      case PAYMENT_STATUS_CODES.CANCELLED:
        return 'cancelled'
      default:
        return 'failed'
    }
  }

  // Process refund
  async refundPayment(
    transactionId: string,
    amount?: number
  ): Promise<{ success: boolean; error?: string }> {
    if (this.isDemoMode()) {
      console.log('[DEMO] Refund requested:', transactionId, amount)
      return { success: true }
    }

    try {
      const payload = {
        transaction_id: transactionId,
        amount: amount ? Math.round(amount * 100) : undefined, // Partial or full refund
      }

      const signature = this.generateSignature(JSON.stringify(payload))

      const response = await fetch(`${this.config.apiUrl}/payment/refund`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Signature': signature,
          'X-Merchant-ID': this.config.merchantId,
        },
        body: JSON.stringify(payload),
      })

      const data = await response.json()

      return {
        success: response.ok && data.success,
        error: data.error_message,
      }
    } catch (error) {
      console.error('Kapital Bank refund error:', error)
      return {
        success: false,
        error: 'Geri ödəmə tamamlana bilmədi',
      }
    }
  }
}

// Singleton instance
let kapitalBankInstance: KapitalBankService | null = null

export function getKapitalBankService(): KapitalBankService {
  if (!kapitalBankInstance) {
    kapitalBankInstance = new KapitalBankService()
  }
  return kapitalBankInstance
}

// Helper to format price
export function formatPrice(amount: number): string {
  return `${amount.toFixed(2)} ₼`
}

// Calculate platform fees
export function calculateFees(
  subtotal: number,
  urgency: 'PLANNED' | 'TODAY' | 'URGENT' = 'PLANNED'
): {
  subtotal: number
  urgencyFee: number
  platformFee: number
  total: number
} {
  const urgencyMultipliers = {
    PLANNED: 0,
    TODAY: 0.15, // 15% extra
    URGENT: 0.3, // 30% extra
  }

  const urgencyFee = subtotal * urgencyMultipliers[urgency]
  const platformFee = subtotal * 0.1 // 10% platform fee
  const total = subtotal + urgencyFee + platformFee

  return {
    subtotal,
    urgencyFee,
    platformFee,
    total: Math.round(total * 100) / 100,
  }
}
