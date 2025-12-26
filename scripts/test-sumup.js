/**
 * Test script to verify SumUp API credentials and endpoint
 * Run with: node scripts/test-sumup.js
 */

const fs = require('fs');
const path = require('path');

// Read .env.local file manually
function loadEnv() {
  const envPath = path.join(__dirname, '..', '.env.local');
  if (!fs.existsSync(envPath)) {
    console.error('❌ .env.local file not found!');
    process.exit(1);
  }
  
  const envContent = fs.readFileSync(envPath, 'utf8');
  const env = {};
  
  envContent.split('\n').forEach(line => {
    const match = line.match(/^([^#=]+)=(.*)$/);
    if (match) {
      const key = match[1].trim();
      const value = match[2].trim().replace(/^["']|["']$/g, '');
      env[key] = value;
    }
  });
  
  return env;
}

const env = loadEnv();
const SUMUP_ACCESS_TOKEN = env.SUMUP_ACCESS_TOKEN;
const SUMUP_MERCHANT_CODE = env.SUMUP_MERCHANT_CODE;

console.log('Testing SumUp API Configuration...\n');
console.log('Access Token:', SUMUP_ACCESS_TOKEN ? `${SUMUP_ACCESS_TOKEN.substring(0, 10)}...` : 'MISSING');
console.log('Merchant Code:', SUMUP_MERCHANT_CODE || 'MISSING');
console.log('');

if (!SUMUP_ACCESS_TOKEN || !SUMUP_MERCHANT_CODE) {
  console.error('❌ SumUp credentials are missing!');
  process.exit(1);
}

// Test checkout creation
const testCheckout = {
  checkout_reference: `test-${Date.now()}`,
  amount: 100, // £1.00 in pence
  currency: "GBP",
  merchant_code: SUMUP_MERCHANT_CODE,
  return_url: "http://localhost:3000/payment-callback?orderId=test",
  description: "Test checkout",
};

console.log('Creating test checkout with data:');
console.log(JSON.stringify(testCheckout, null, 2));
console.log('');

fetch("https://api.sumup.com/v0.1/checkouts", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${SUMUP_ACCESS_TOKEN}`,
  },
  body: JSON.stringify(testCheckout),
})
  .then(async (response) => {
    console.log('Response Status:', response.status, response.statusText);
    const data = await response.json().catch(() => response.text());
    console.log('Response Data:', JSON.stringify(data, null, 2));
    
    if (response.ok) {
      console.log('\n✅ Checkout created successfully!');
      console.log('Checkout URL:', data.redirect_url || data.checkout_url || data.url);
    } else {
      console.log('\n❌ Failed to create checkout');
      console.log('Error details:', data);
    }
  })
  .catch((error) => {
    console.error('\n❌ Network error:', error.message);
  });

