# How to Debug Payment Verification Issues

## ⚠️ CRITICAL: Where to Find Logs

### Server Logs (MOST IMPORTANT!)
The **server logs** show what SumUp's API is actually returning. These are in your **terminal where Next.js is running**.

**To view server logs:**
1. Open the terminal where you ran `npm run dev` or `next dev`
2. Look for logs that start with:
   - `🔍 Starting payment verification:`
   - `📡 Full Transactions URL:`
   - `📊 Transactions API Response Status:`
   - `📦 Full transactions response:`
   - `✅ Payment confirmed via...` or `❌ Payment verification failed`

**These logs show:**
- What API calls are being made to SumUp
- What SumUp is returning
- Why verification is failing

### Browser Console Logs
Browser console shows client-side logs but **NOT** the actual SumUp API responses.

**To view browser logs:**
1. Open browser DevTools (F12)
2. Go to Console tab
3. Look for logs starting with `📥`, `🔍`, `✅`, `❌`

## Debug Panel on Payment Callback Page

When payment verification fails, you'll see a **"Show Debug Information"** button.

**This shows:**
- Current verification result
- All verification attempts (last 10)
- Can copy all debug info to clipboard

**To use:**
1. After payment fails, click "Show Debug Information"
2. Click "Copy All Debug Info"
3. Share this with support or check it yourself

## What to Check

### 1. Checkout Creation Logs (Server)
When creating a checkout, look for:
```
🔑 Extracted checkout_id: [id]
✅ Returning checkout data: { checkoutId: [id], ... }
```

### 2. Checkout Storage (Browser)
In browser console, look for:
```
💾 Attempting to store checkout_id: [id] for order: [orderId]
✅ Successfully stored checkout_id in order: [id]
```

### 3. Payment Verification (Server)
In server terminal, look for:
```
🔍 Method 0: Checking order in database for checkout_id
🔍 Method 2: Using checkout_reference (orderId) to find transaction
📡 Full Transactions URL: https://api.sumup.com/v0.1/me/transactions?checkout_reference=...
📊 Transactions API Response Status: 200 OK
📦 Full transactions response: { ... }
```

## Common Issues

### Issue: checkout_id is "none"
**Check:** Server logs when checkout is created
- If checkout_id is missing from SumUp response → API issue
- If checkout_id exists but not stored → Storage issue

### Issue: Transactions query returns 404
**Check:** Server logs for:
- Exact URL being called
- Response status
- Error message from SumUp

### Issue: No transactions found
**Check:** Server logs for:
- `📦 Found X transactions to search through`
- `📋 Sample transaction structure:`
- This shows what SumUp is returning

## Quick Debug Steps

1. **Make a test payment**
2. **Check SERVER TERMINAL immediately** (don't close it!)
3. **Look for verification logs** starting with 🔍
4. **Copy the full transaction response** from server logs
5. **Check if checkout_id was stored** (browser console)
6. **Use debug panel** on callback page to see all attempts

## Sharing Debug Info

When reporting issues, share:
1. **Server terminal logs** (the most important!)
2. **Debug info from callback page** (click "Copy All Debug Info")
3. **Order ID** that failed
4. **Screenshot of SumUp dashboard** showing if payment was successful

## Manual Verification

If automatic verification fails:
1. Go to `/admin` dashboard
2. Find the pending order
3. Click purple "Confirm Payment" button
4. This manually confirms the payment
