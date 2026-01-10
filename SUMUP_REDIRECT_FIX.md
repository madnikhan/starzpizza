# Fix SumUp Payment Redirect After Success

## Issue
Payment is successful on SumUp's page, but customers aren't being automatically redirected back to the order confirmation page.

## What I've Fixed

### 1. Added `redirect_url` Parameter
- SumUp now receives both `return_url` and `redirect_url`
- Some SumUp implementations use `redirect_url` for automatic redirects

### 2. Improved Callback Handling
- Better logging to see what parameters SumUp sends
- Faster redirect (2 seconds instead of 3)
- Handles multiple parameter names (`checkout_id`, `checkoutId`, etc.)

### 3. Enhanced Logging
- Logs all callback parameters for debugging
- Shows payment status from URL parameters

## How It Works Now

1. **Customer completes payment** on SumUp's page
2. **SumUp redirects** to `/payment-callback?orderId=STARZ-XXXXXX`
3. **Payment is verified** with SumUp API
4. **Customer sees** "Payment Successful!" message
5. **Auto-redirects** to order confirmation after 2 seconds
6. **Manual button** available to go immediately

## If SumUp Still Shows Success Page

If SumUp shows their success page with a "Back to merchant" button instead of auto-redirecting:

### Option 1: Check SumUp Dashboard Settings
1. Log in to your SumUp dashboard
2. Go to **Settings** → **Checkout** or **API Settings**
3. Look for **"Automatic Redirect"** or **"Redirect After Payment"** option
4. Enable it if available

### Option 2: Manual Redirect Button
The callback page has a "View Order Details" button that customers can click if auto-redirect doesn't work.

### Option 3: Check Return URL Format
Make sure your `NEXT_PUBLIC_APP_URL` is set correctly:
```env
NEXT_PUBLIC_APP_URL=http://localhost:3000  # For development
# OR
NEXT_PUBLIC_APP_URL=https://yourdomain.com  # For production
```

## Testing

1. **Complete a test payment**
2. **Check browser console** for callback parameters:
   ```
   📥 Payment callback received: { orderId: '...', checkoutId: '...', ... }
   ```
3. **Verify redirect** happens automatically or via button

## Debugging

If redirect still doesn't work:

1. **Check browser console** - Look for callback parameters
2. **Check server logs** - See if payment verification succeeds
3. **Check SumUp dashboard** - Verify return URL is configured
4. **Test return URL manually** - Visit `/payment-callback?orderId=TEST-123` to see if page loads

## Expected Flow

```
Customer → SumUp Payment Page → Payment Success → 
SumUp Redirects → /payment-callback?orderId=... → 
Payment Verified → Order Confirmation Page
```

## Common Issues

### Issue: SumUp shows success but doesn't redirect
**Solution:** Check SumUp dashboard settings for automatic redirect option

### Issue: Redirect goes to wrong URL
**Solution:** Verify `NEXT_PUBLIC_APP_URL` is correct in `.env.local`

### Issue: Callback page shows error
**Solution:** Check server logs for payment verification errors

### Issue: Order not confirmed after payment
**Solution:** Check payment verification endpoint is working correctly
