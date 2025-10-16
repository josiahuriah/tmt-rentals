/**
 * Fygaro Payment Integration Service - Payment Button Method
 * 
 * This integration uses Fygaro's Payment Buttons for PCI-compliant checkout.
 * 
 * Setup:
 * 1. Create a Payment Button in your Fygaro dashboard
 * 2. Copy the FULL button URL (e.g., https://www.fygaro.com/en/pb/xxx/)
 * 3. Add it to FYGARO_BUTTON_ID in your environment variables
 */

type FygaroPaymentLinkParams = {
  amount: number // Amount in dollars
  currency?: string
  description: string
  customerEmail: string
  customerName: string
  reference: string // Your booking number
  returnUrl: string
  cancelUrl: string
}

type FygaroPaymentLinkResponse = {
  success: boolean
  paymentUrl?: string
  paymentId?: string
  error?: string
}

/**
 * Creates a Fygaro payment link using Payment Button
 * 
 * @param params Payment parameters
 * @returns Payment URL to redirect customer to
 */
export async function createFygaroPaymentLink(
  params: FygaroPaymentLinkParams
): Promise<FygaroPaymentLinkResponse> {
  try {
    const buttonUrl = process.env.FYGARO_BUTTON_ID

    if (!buttonUrl) {
      throw new Error(
        'FYGARO_BUTTON_ID not configured. Please add your Fygaro payment button URL to .env.local'
      )
    }

    // FIXED: Format amount as dollars with 2 decimal places
    // Fygaro expects dollar amounts like "100.00", NOT cents
    const amountFormatted = params.amount.toFixed(2)

    // The button URL is the complete payment URL
    // We just need to append query parameters to it
    let paymentUrl: URL
    
    try {
      // Remove trailing slash if present for consistency
      const cleanUrl = buttonUrl.endsWith('/') ? buttonUrl.slice(0, -1) : buttonUrl
      paymentUrl = new URL(cleanUrl)
    } catch (error) {
      throw new Error(
        `Invalid FYGARO_BUTTON_ID URL format. Expected full URL like: https://www.fygaro.com/en/pb/xxx/\nGot: ${buttonUrl}`
      )
    }
    
    // Add payment parameters as query parameters
    // Fygaro expects amount in dollar format with decimals (e.g., "100.00")
    paymentUrl.searchParams.set('amount', amountFormatted)
    paymentUrl.searchParams.set('currency', params.currency || 'BSD')
    paymentUrl.searchParams.set('description', params.description)
    paymentUrl.searchParams.set('reference', params.reference)
    paymentUrl.searchParams.set('customer_email', params.customerEmail)
    paymentUrl.searchParams.set('customer_name', params.customerName)
    
    // Return URLs - override the defaults set in the button
    paymentUrl.searchParams.set('return_url', params.returnUrl)
    paymentUrl.searchParams.set('cancel_url', params.cancelUrl)

    console.log('Created Fygaro payment URL:', {
      buttonUrl,
      amount: amountFormatted, // Log the formatted amount
      reference: params.reference,
      urlLength: paymentUrl.toString().length
    })

    return {
      success: true,
      paymentUrl: paymentUrl.toString(),
      paymentId: params.reference // Use booking number as payment ID
    }
  } catch (error) {
    console.error('Error creating Fygaro payment link:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    }
  }
}

/**
 * Verifies a payment by checking booking status
 * (Since we're using buttons, verification happens via webhook)
 * 
 * @param reference Booking reference number
 * @returns Payment verification result
 */
export async function verifyFygaroPayment(reference: string) {
  try {
    // With payment buttons, we rely on webhooks for verification
    // This function is mainly for manual verification if needed
    
    console.log('Manual verification requested for:', reference)
    
    // You would check your database for the booking status
    // that was updated by the webhook
    
    return {
      success: true,
      message: 'Please check booking status in database (updated by webhook)'
    }
  } catch (error) {
    console.error('Error verifying payment:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

/**
 * Generates the webhook endpoint URL for this application
 */
export function getFygaroWebhookUrl(): string {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
  return `${baseUrl}/api/webhooks/fygaro`
}

/**
 * Generate a random webhook secret (run this once and save to .env)
 */
export function generateWebhookSecret(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let secret = ''
  for (let i = 0; i < 32; i++) {
    secret += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return secret
}