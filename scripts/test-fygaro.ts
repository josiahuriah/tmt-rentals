// scripts/test-fygaro.ts
/**
 * Fygaro Payment Button Test Script
 * 
 * Tests the payment button integration by generating a test payment URL
 * 
 * Usage:
 *   npm run test:fygaro
 */

import { config } from 'dotenv'
import { resolve } from 'path'

// Load environment variables from .env.local
config({ path: resolve(process.cwd(), '.env.local') })

import { createFygaroPaymentLink, generateWebhookSecret, getFygaroWebhookUrl } from '../src/lib/fygaro'

async function testFygaroButton() {
  console.log('\n🔍 Testing Fygaro Payment Button Integration...\n')

  // Check if credentials are configured
  console.log('📋 Environment Check:')
  console.log('  FYGARO_BUTTON_ID:', process.env.FYGARO_BUTTON_ID ? '✅ Set' : '❌ Missing')
  console.log('  FYGARO_WEBHOOK_SECRET:', process.env.FYGARO_WEBHOOK_SECRET ? '✅ Set' : '⚠️  Not set (will generate)')
  console.log('  NEXT_PUBLIC_BASE_URL:', process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000 (default)')
  console.log('')

  // Verify button URL is set
  if (!process.env.FYGARO_BUTTON_ID) {
    console.error('❌ ERROR: FYGARO_BUTTON_ID not configured\n')
    console.log('📝 Setup Steps:\n')
    console.log('1. Log in to your Fygaro dashboard')
    console.log('2. Go to Payment Buttons section')
    console.log('3. Find your payment button')
    console.log('4. Copy the FULL button URL (e.g., https://www.fygaro.com/en/pb/xxx/)')
    console.log('5. Add to .env.local:\n')
    console.log('   FYGARO_BUTTON_ID="https://www.fygaro.com/en/pb/your-id-here/"\n')
    console.log('⚠️  Note: You need the complete URL, not just an ID!\n')
    process.exit(1)
  }

  // Validate button URL format
  try {
    new URL(process.env.FYGARO_BUTTON_ID)
  } catch (error) {
    console.error('❌ ERROR: FYGARO_BUTTON_ID must be a valid URL\n')
    console.log('Current value:', process.env.FYGARO_BUTTON_ID)
    console.log('\nExpected format: https://www.fygaro.com/en/pb/xxx/')
    console.log('or similar full URL from Fygaro dashboard\n')
    process.exit(1)
  }

  // Generate webhook secret if not set
  if (!process.env.FYGARO_WEBHOOK_SECRET) {
    console.log('⚠️  No FYGARO_WEBHOOK_SECRET found. Generating one for you:\n')
    const secret = generateWebhookSecret()
    console.log('  Add this to your .env.local file:')
    console.log(`  FYGARO_WEBHOOK_SECRET="${secret}"`)
    console.log('')
    console.log('  ⚠️  IMPORTANT: Also add this SAME secret to your Fygaro button webhook settings!\n')
  }

  // Show webhook URL
  console.log('🔗 Webhook Configuration:')
  console.log('  URL:', getFygaroWebhookUrl())
  console.log('  Make sure this URL is set in your Fygaro button webhook settings')
  console.log('  Note: Fygaro may not have separate webhook event selection - that\'s OK!\n')

  // Create test payment link
  console.log('🚀 Creating test payment URL...\n')

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
  
  const result = await createFygaroPaymentLink({
    amount: 1.00, // $1.00 test payment
    currency: 'BSD',
    description: 'Test Payment - TMT Car Rental',
    customerEmail: 'test@tmtsbahamas.com',
    customerName: 'Test Customer',
    reference: `TEST-${Date.now()}`,
    returnUrl: `${baseUrl}/rental/payment/callback?bookingId=TEST123`,
    cancelUrl: `${baseUrl}/rental/payment/cancelled?bookingId=TEST123`
  })

  if (result.success) {
    console.log('✅ SUCCESS! Payment URL generated!\n')
    console.log('📄 Payment Details:')
    console.log('  Base Button URL:', process.env.FYGARO_BUTTON_ID)
    console.log('  Reference:', result.paymentId)
    console.log('  Amount: $1.00 BSD\n')
    console.log('🔗 Complete Payment URL:')
    console.log('  ' + result.paymentUrl)
    console.log('')
    console.log('🧪 To test the payment flow:')
    console.log('  1. Copy the payment URL above')
    console.log('  2. Open it in your browser')
    console.log('  3. You should see Fygaro\'s payment page with $1.00')
    console.log('  4. Use test card: 4242 4242 4242 4242')
    console.log('  5. Any future expiry date (e.g., 12/25)')
    console.log('  6. Any 3-digit CVV (e.g., 123)')
    console.log('  7. Complete the payment')
    console.log('  8. You should be redirected back to your site\n')
    console.log('✅ If the payment page loads correctly, your integration is working!\n')
  } else {
    console.log('❌ FAILED: Could not generate payment URL')
    console.log('Error:', result.error)
    console.log('')
    console.log('🔧 Troubleshooting:')
    console.log('  1. Verify FYGARO_BUTTON_ID is the COMPLETE URL from Fygaro')
    console.log('  2. Check the URL format matches: https://www.fygaro.com/en/pb/xxx/')
    console.log('  3. Make sure button exists and is active in Fygaro dashboard')
    console.log('  4. Contact Fygaro support if issues persist\n')
    process.exit(1)
  }

  console.log('📚 Next Steps:')
  console.log('  1. Test the payment URL in your browser')
  console.log('  2. Complete a test payment')
  console.log('  3. Test full booking flow:')
  console.log('     - Go to', baseUrl + '/rental')
  console.log('     - Create a test booking')
  console.log('     - Complete payment')
  console.log('  4. Verify webhook is received (check server logs)')
  console.log('  5. Check booking status updates to CONFIRMED')
  console.log('  6. Verify confirmation email is sent\n')
  console.log('📖 For webhook troubleshooting, see PAYMENT_BUTTON_SETUP.md\n')
}

// Run the test
testFygaroButton().catch(error => {
  console.error('\n❌ Unexpected error:', error)
  process.exit(1)
})