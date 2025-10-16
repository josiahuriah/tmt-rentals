// scripts/diagnose-fygaro.ts
/**
 * Fygaro API Diagnostic Tool
 * 
 * This script tests different API endpoints and formats to discover
 * how Fygaro's API actually works.
 */

import { config } from 'dotenv'
import { resolve } from 'path'

config({ path: resolve(process.cwd(), '.env.local') })

const API_KEY = process.env.FYGARO_API_KEY
const API_SECRET = process.env.FYGARO_API_SECRET

if (!API_KEY || !API_SECRET) {
  console.error('❌ Missing API credentials')
  process.exit(1)
}

// Possible API endpoints to try
const ENDPOINTS_TO_TRY = [
  'https://api.fygaro.com/v1/payment_links',
  'https://api.fygaro.com/v1/payments',
  'https://api.fygaro.com/v1/links',
  'https://api.fygaro.com/v1/checkout',
  'https://api.fygaro.com/payment_links',
  'https://fygaro.com/api/v1/payment_links',
  'https://pay.fygaro.com/api/v1/payment_links',
]

const authString = Buffer.from(`${API_KEY}:${API_SECRET}`).toString('base64')

const testPayload = {
  amount: 100, // $1.00 in cents
  currency: 'BSD',
  description: 'Test Payment',
  reference: `TEST-${Date.now()}`
}

async function testEndpoint(url: string) {
  console.log(`\n🔍 Testing: ${url}`)
  
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${authString}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'User-Agent': 'TMT-Rentals/1.0'
      },
      body: JSON.stringify(testPayload)
    })

    const contentType = response.headers.get('content-type')
    const responseText = await response.text()

    console.log(`  Status: ${response.status} ${response.statusText}`)
    console.log(`  Content-Type: ${contentType}`)
    
    if (response.status === 200 || response.status === 201) {
      console.log('  ✅ SUCCESS!')
      console.log('  Response:', responseText.substring(0, 200))
      return true
    } else if (response.status === 401) {
      console.log('  🔐 Authentication issue (401)')
      console.log('  Response:', responseText.substring(0, 200))
    } else if (response.status === 403) {
      console.log('  🚫 Forbidden (403)')
      if (contentType?.includes('html')) {
        console.log('  Note: Got HTML response - likely wrong endpoint')
      } else {
        console.log('  Response:', responseText.substring(0, 200))
      }
    } else if (response.status === 404) {
      console.log('  ❌ Not Found (404) - wrong endpoint')
    } else {
      console.log(`  Response:`, responseText.substring(0, 200))
    }
    
    return false
  } catch (error) {
    console.log(`  ❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`)
    return false
  }
}

async function diagnose() {
  console.log('🔬 Fygaro API Diagnostic Tool\n')
  console.log('Testing different API endpoints to find the correct one...\n')
  console.log('Credentials loaded:')
  console.log(`  API Key: ${API_KEY.substring(0, 8)}...`)
  console.log(`  API Secret: ${API_SECRET.substring(0, 8)}...`)

  for (const endpoint of ENDPOINTS_TO_TRY) {
    const success = await testEndpoint(endpoint)
    if (success) {
      console.log('\n✅ Found working endpoint!')
      console.log(`\nUpdate your src/lib/fygaro.ts to use this endpoint:`)
      console.log(`  const response = await fetch('${endpoint}', {`)
      break
    }
    // Small delay between requests
    await new Promise(resolve => setTimeout(resolve, 500))
  }

  console.log('\n\n📚 Additional Steps to Try:\n')
  console.log('1. Check Fygaro Dashboard for API Documentation:')
  console.log('   - Look for "API Docs" or "Developer" section')
  console.log('   - Check for API endpoint URLs')
  console.log('   - Look for example requests\n')
  
  console.log('2. Contact Fygaro Support:')
  console.log('   - Email: support@fygaro.com')
  console.log('   - Ask for: "API endpoint URL for creating payment links"')
  console.log('   - Mention you have API key and secret but getting 403 errors\n')
  
  console.log('3. Check if API access is enabled:')
  console.log('   - Some payment processors require API access to be manually enabled')
  console.log('   - Check your account settings or contact support\n')

  console.log('4. Try the Payment Button approach instead:')
  console.log('   - Create a Payment Button in Fygaro dashboard')
  console.log('   - Use the button\'s hosted page URL directly')
  console.log('   - This might be simpler than API integration\n')
}

diagnose().catch(console.error)