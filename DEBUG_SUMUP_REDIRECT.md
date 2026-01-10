# Debugging SumUp Payment Redirect Issue

## Problem
Payment is not redirecting to SumUp payment page.

## Debugging Steps

### 1. Check Browser Console
Open browser DevTools (F12) and check the Console tab. Look for:

**Expected logs:**
- `💳 Payment method: Card`
- `🔧 Test mode enabled: false` (should be false for SumUp)
- `📡 Using payment endpoint: /api/payments/sumup`
- `✅ PRODUCTION MODE: Using SumUp payment endpoint`
- `🔍 Payment API Response:` (shows full response)
- `✅ Valid checkout URL received: https://...`
- `🔄 Redirecting to SumUp payment page...`

**If you see:**
- `🧪 TEST MODE: Using simulated payment endpoint` → Test mode is enabled (disables SumUp)
- `❌ No checkout URL in response` → API didn't return a URL
- `❌ Invalid checkout URL format` → URL format is wrong
- `❌ Error during redirect` → Browser blocked the redirect

### 2. Check Server Logs
Look at your terminal where `npm run dev` is running. Check for:

**Expected logs:**
- `✅ SUMUP PRODUCTION MODE: Using production credentials` (or SANDBOX MODE)
- `Creating SumUp checkout with data:`
- `SumUp API response status: 201` (or 200)
- `SumUp API full response:` (shows complete response)
- `✅ Using hosted_checkout_url from SumUp API:` (if available)
- `✅ Using SumUp payment URL with checkout_reference:`
- `✅ Returning checkout data:` (shows the checkoutUrl)

**Error indicators:**
- `SumUp credentials not configured` → Missing environment variables
- `SumUp API error:` → API call failed
- `❌ CRITICAL: No checkout URL available` → Couldn't generate URL

### 3. Check Environment Variables

Make sure `.env.local` has:
```env
# For SumUp (REQUIRED)
SUMUP_ACCESS_TOKEN=your_token_here
SUMUP_MERCHANT_CODE=your_merchant_code_here

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000

# IMPORTANT: Make sure test mode is DISABLED for SumUp
NEXT_PUBLIC_ENABLE_TEST_PAYMENTS=false
```

**Common issues:**
- `NEXT_PUBLIC_ENABLE_TEST_PAYMENTS=true` → This bypasses SumUp!
- Missing `SUMUP_ACCESS_TOKEN` or `SUMUP_MERCHANT_CODE`
- Wrong credentials (sandbox vs production)

### 4. Check Network Tab
In browser DevTools → Network tab:
1. Look for request to `/api/payments/sumup`
2. Check the response:
   - Status should be `200` or `201`
   - Response should have `checkoutUrl` field
   - Check if `checkoutUrl` is `null` or missing

### 5. Common Issues and Fixes

#### Issue: Test Mode Enabled
**Symptom:** Logs show "🧪 TEST MODE"
**Fix:** Set `NEXT_PUBLIC_ENABLE_TEST_PAYMENTS=false` in `.env.local` and restart server

#### Issue: No Checkout URL in Response
**Symptom:** `❌ No checkout URL in response`
**Possible causes:**
- SumUp API didn't return `hosted_checkout_url`
- Checkout creation failed
- Invalid credentials

**Check:**
- Server logs for SumUp API response
- Verify credentials are correct
- Check if `hosted_checkout` is enabled in request

#### Issue: Invalid URL Format
**Symptom:** `❌ Invalid checkout URL format`
**Fix:** Check server logs to see what URL was generated

#### Issue: Redirect Blocked
**Symptom:** `❌ Error during redirect`
**Possible causes:**
- Browser popup blocker
- CORS issue
- Invalid URL format

**Fix:** 
- Check browser console for CORS errors
- Try disabling popup blockers
- Verify URL starts with `https://`

### 6. Manual Test

Try this in browser console after clicking "Pay with Card":
```javascript
// Check if test mode is enabled
console.log("Test mode:", process.env.NEXT_PUBLIC_ENABLE_TEST_PAYMENTS);

// Check payment response (if available)
// Look for paymentResult in console logs
```

### 7. Verify SumUp Response

The SumUp API should return something like:
```json
{
  "success": true,
  "checkoutId": "uuid-here",
  "checkoutUrl": "https://sumup.me/pay/STARZ-XXXXXX",
  "rawResponse": { ... }
}
```

If `checkoutUrl` is missing or null, check:
- Server logs for the full `rawResponse`
- Whether `hosted_checkout_url` is in the response
- Whether fallback URL construction is working

## Quick Fix Checklist

- [ ] Test mode is disabled (`NEXT_PUBLIC_ENABLE_TEST_PAYMENTS=false`)
- [ ] SumUp credentials are set (`SUMUP_ACCESS_TOKEN`, `SUMUP_MERCHANT_CODE`)
- [ ] Server was restarted after changing `.env.local`
- [ ] Browser console shows no errors
- [ ] Server logs show successful checkout creation
- [ ] `checkoutUrl` is present in API response
- [ ] URL starts with `https://sumup.me` or `https://checkout.sumup.com`

## Still Not Working?

1. **Share the logs:**
   - Browser console output
   - Server terminal output
   - Network tab response from `/api/payments/sumup`

2. **Check SumUp Dashboard:**
   - Verify your account is active
   - Check if checkouts are being created
   - Verify API credentials are correct

3. **Test with curl:**
   ```bash
   curl -X POST http://localhost:3000/api/payments/sumup \
     -H "Content-Type: application/json" \
     -d '{"orderId":"TEST-123","amount":10.99,"description":"Test"}'
   ```
