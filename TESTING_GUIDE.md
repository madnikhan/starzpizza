# SumUp Payment Integration - Testing Guide

## Current Implementation Status

✅ **Completed:**
- SumUp API integration (checkout creation)
- Embedded checkout modal component
- Payment callback handling
- Order creation and management
- Error handling and logging

⚠️ **Known Issue:**
- SumUp checkout URLs return 404 (URL format needs verification from SumUp)
- The embedded checkout component tries multiple URL patterns automatically

## Testing Steps

### 1. Start Development Server

```bash
npm run dev
```

Visit: `http://localhost:3000`

### 2. Test Payment Flow

#### Step 1: Add Items to Cart
1. Browse the menu
2. Add items to cart
3. Go to cart page
4. Click "Proceed to Checkout"

#### Step 2: Fill Checkout Form
1. Select order type (Takeaway/Collection/Delivery)
2. Fill in customer information:
   - Name (required)
   - Phone (required)
   - Email (optional)
   - Address (required for delivery)
3. Select "Card Payment"
4. Click "Pay with Card"

#### Step 3: Payment Modal
1. The embedded checkout modal should open
2. You'll see a loading spinner
3. The iframe will try to load SumUp's payment page

#### Step 4: Expected Behavior

**If SumUp URL works:**
- Payment form loads in the iframe
- Customer can enter card details
- Payment processes
- Redirects to confirmation page

**If SumUp URL returns 404 (current issue):**
- Modal shows 404 error in iframe
- Component automatically tries next URL pattern
- If all patterns fail, shows error message

### 3. Check Server Logs

When testing, watch your terminal for:
- `"Creating SumUp checkout with data:"` - Shows request being sent
- `"SumUp API full response:"` - Shows complete API response
- `"Returning checkout data:"` - Shows what's being returned to frontend

### 4. Check Browser Console

Open browser DevTools (F12) and check:
- `"Payment response:"` - Shows checkout data received
- Any errors or warnings
- Network tab for API calls

## What to Look For

### ✅ Success Indicators
- Checkout modal opens after clicking "Pay with Card"
- Order is created in database (check server logs)
- SumUp checkout is created (check server logs for checkout ID)
- Modal displays correctly

### ⚠️ Current Limitations
- Payment iframe may show 404 (expected until URL format is confirmed)
- Need to verify correct SumUp payment URL format
- May need to contact SumUp support for correct integration method

## Debugging

### If Modal Doesn't Open
1. Check browser console for errors
2. Verify `checkoutId` is in the payment response
3. Check server logs for API errors

### If Payment URL Returns 404
1. This is expected - SumUp doesn't provide payment URL in API response
2. Check server logs for the checkout ID
3. Note the checkout ID for SumUp support
4. The component tries multiple URL patterns automatically

### If Order Creation Fails
1. Check Firebase configuration
2. Verify environment variables are set
3. Check server logs for specific errors

## Next Steps After Testing

1. **If payment URL works:** Great! Integration is complete
2. **If payment URL returns 404:** Contact SumUp support with:
   - Your merchant code: `M78F972R`
   - Checkout ID from server logs
   - Request the correct payment URL format

## Test Data

Use these for testing:
- **Order Type:** Any (Takeaway/Collection/Delivery)
- **Customer Name:** Test Customer
- **Phone:** 07123456789
- **Email:** test@example.com
- **Address:** 123 Test Street (for delivery)

## Support

If you encounter issues:
1. Check server logs for detailed error messages
2. Check browser console for frontend errors
3. Review `SUMUP_SETUP.md` for configuration details
4. Contact SumUp support if payment URL format is needed

