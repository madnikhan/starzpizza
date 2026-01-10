# SumUp Sandbox Setup Guide

## ✅ Sandbox Configuration

You've successfully set up and activated SumUp sandbox! This guide will help you test the payment integration.

## Environment Variables

Make sure your `.env.local` file has the following variables configured:

```env
# SumUp Sandbox Credentials
SUMUP_ACCESS_TOKEN=your_sandbox_access_token_here
SUMUP_MERCHANT_CODE=your_sandbox_merchant_code_here

# Optional: Explicitly mark as sandbox (for logging)
SUMUP_SANDBOX=true
# OR
NEXT_PUBLIC_SUMUP_SANDBOX=true

# App URL (for payment callbacks)
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Important Notes

### Same API Endpoint
- SumUp uses the **same API endpoint** (`https://api.sumup.com/v0.1/checkouts`) for both sandbox and production
- The difference is in the **credentials** (access token and merchant code)
- Sandbox credentials are different from production credentials

### Sandbox vs Production
- **Sandbox**: Use sandbox access token and merchant code (no real money)
- **Production**: Use production access token and merchant code (real transactions)

## Testing the Integration

### Step 1: Verify Credentials
1. Make sure your `.env.local` has sandbox credentials
2. Restart your development server:
   ```bash
   npm run dev
   ```

### Step 2: Test Payment Flow
1. **Add items to cart**
   - Browse the menu
   - Add items to your cart
   - Go to checkout

2. **Fill checkout form**
   - Select order type (Takeaway/Collection/Delivery)
   - Fill in customer information
   - Select **"Card Payment"**
   - Click **"Pay with Card"**

3. **Payment redirect**
   - You'll be redirected to SumUp's payment page
   - Use sandbox test cards (if provided by SumUp)
   - Complete the payment

4. **Payment callback**
   - After payment, you'll be redirected back to `/payment-callback`
   - Order status will be updated to "confirmed"
   - You'll see the order confirmation page

### Step 3: Check Server Logs

Watch your terminal for:
- `🧪 SUMUP SANDBOX MODE: Using sandbox credentials` - Confirms sandbox mode
- `Creating SumUp checkout with data:` - Shows request details
- `SumUp API full response:` - Shows complete API response
- `✅ Using hosted_checkout_url from SumUp API:` - Shows payment URL
- `Returning checkout data:` - Shows what's returned to frontend

### Step 4: Check Browser Console

Open browser DevTools (F12) and check:
- `Payment response:` - Shows checkout data received
- Any errors or warnings
- Network tab for API calls

## Expected Behavior

### ✅ Success Indicators
- Checkout is created successfully
- `hosted_checkout_url` is returned in API response
- Redirect to SumUp payment page works
- Payment page loads correctly
- Payment can be completed
- Redirect back to confirmation page works
- Order status is updated to "confirmed"

### ⚠️ Common Issues

#### 1. "Payment gateway not configured"
- **Fix**: Check that `SUMUP_ACCESS_TOKEN` and `SUMUP_MERCHANT_CODE` are set in `.env.local`
- Restart the server after adding variables

#### 2. "Failed to create payment checkout"
- **Fix**: Verify your sandbox credentials are correct
- Check SumUp dashboard to ensure sandbox account is active
- Review server logs for detailed error messages

#### 3. No `hosted_checkout_url` in response
- **Fix**: The code will fall back to constructing `https://sumup.me/pay/{checkout_reference}`
- Check server logs to see which URL is being used
- Verify the checkout was created successfully

#### 4. Payment page shows wrong amount
- **Fix**: Amount is sent in pounds (major units), not pence
- If amount is still wrong, check SumUp dashboard settings

## Test Cards (Sandbox)

SumUp sandbox may provide test cards. Check your SumUp dashboard or contact SumUp support for:
- Test card numbers
- Test card expiry dates
- Test CVV codes

## Switching to Production

When ready to go live:

1. **Update credentials** in `.env.local`:
   ```env
   SUMUP_ACCESS_TOKEN=your_production_access_token
   SUMUP_MERCHANT_CODE=your_production_merchant_code
   SUMUP_SANDBOX=false  # or remove this line
   ```

2. **Update app URL** for production:
   ```env
   NEXT_PUBLIC_APP_URL=https://your-production-domain.com
   ```

3. **Restart server** and test with small amounts first

## Payment URL Format

The correct SumUp checkout URL format is:

1. **Primary (if available)**: `hosted_checkout_url` from API response
   - Format: `https://checkout.sumup.com/pay/{checkout_id}`
   - This is returned when `hosted_checkout: { enabled: true }` is set

2. **Fallback**: Constructed URL using `checkout_reference`
   - Format: `https://sumup.me/pay/{checkout_reference}`
   - Uses your order ID (e.g., `STARZ-XXXXXX`)

## Next Steps

1. ✅ Sandbox is set up and activated
2. ✅ Code is configured to use sandbox credentials
3. 🧪 **Test the payment flow** with sandbox credentials
4. 📝 **Review server logs** to verify everything works
5. 🚀 **Switch to production** when ready

## Support

If you encounter issues:
1. Check server logs for detailed error messages
2. Check browser console for frontend errors
3. Verify sandbox credentials in SumUp dashboard
4. Contact SumUp support if credentials are incorrect

## Security Reminder

⚠️ **Never commit `.env.local` to Git!**
- Sandbox credentials are still sensitive
- Keep them secure
- Use environment variables in production (Vercel, etc.)
