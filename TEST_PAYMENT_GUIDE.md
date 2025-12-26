# Testing Payments Without Real Cards

## 🧪 Test Payment Mode

You can test the entire payment flow without using real cards by enabling **Test Payment Mode**.

## How to Enable Test Mode

### Step 1: Add Environment Variable

Add this to your `.env.local` file:

```env
# Enable test payment mode (simulates payments without real cards)
NEXT_PUBLIC_ENABLE_TEST_PAYMENTS=true
```

### Step 2: Restart Development Server

```bash
# Stop the server (Ctrl+C)
# Then restart:
npm run dev
```

### Step 3: Test the Payment Flow

1. Add items to cart
2. Go to checkout
3. Select **"Card Payment"**
4. Fill in customer information
5. Click **"Pay with Card"**

**What happens:**
- ✅ Order is created in database
- ✅ Payment is **simulated** (no real card needed)
- ✅ Order status is automatically set to "confirmed"
- ✅ You're redirected to order confirmation page
- ✅ Cart is cleared

## How It Works

When test mode is enabled:
- The checkout uses `/api/payments/test` instead of `/api/payments/sumup`
- Payment is simulated (no real SumUp API call)
- Order is automatically marked as "paid" and "confirmed"
- You skip the SumUp payment page entirely

## Test Mode vs Real Payments

| Feature | Test Mode | Real SumUp |
|---------|-----------|------------|
| Requires Card | ❌ No | ✅ Yes |
| Creates Order | ✅ Yes | ✅ Yes |
| Processes Payment | ✅ Simulated | ✅ Real |
| Updates Order Status | ✅ Yes | ✅ Yes |
| Redirects to Confirmation | ✅ Yes | ✅ Yes |

## Disable Test Mode

To use real SumUp payments:

1. Remove or set to `false` in `.env.local`:
```env
NEXT_PUBLIC_ENABLE_TEST_PAYMENTS=false
```

2. Restart the server

## Testing Real SumUp Payments

If you want to test with SumUp's actual payment system:

### Option 1: Use SumUp Test Mode (If Available)
- Check if your SumUp account has test/sandbox mode
- Use test credentials if provided
- Contact SumUp support to enable test mode

### Option 2: Use Real Card (Small Amount)
- Use a real card with a small amount (e.g., £0.01 or £1.00)
- Test the full payment flow
- Verify payment appears in SumUp dashboard

### Option 3: Use Cash Payment Option
- Select "Cash on Delivery" instead of "Card Payment"
- This bypasses SumUp entirely
- Order is created but payment is handled offline

## What Gets Tested in Test Mode

✅ **Order Creation**
- Order is saved to Firestore
- Order ID is generated correctly
- All order data is stored

✅ **Payment Flow**
- Payment endpoint is called
- Order status is updated
- Cart is cleared
- Redirect to confirmation works

✅ **Order Confirmation**
- Order details are displayed
- Order ID is shown correctly

## What Doesn't Get Tested in Test Mode

❌ **SumUp Integration**
- No actual SumUp API calls
- No payment page redirect
- No payment verification from SumUp

❌ **Payment Callbacks**
- No callback from SumUp
- No payment status verification

## Recommended Testing Strategy

1. **Development/Testing**: Use Test Mode
   - Fast and easy
   - No real money involved
   - Test the full flow

2. **Staging/Pre-Production**: Use Real SumUp (Small Amounts)
   - Test actual SumUp integration
   - Verify payment processing
   - Test payment callbacks

3. **Production**: Use Real SumUp
   - Full payment processing
   - Real transactions
   - Customer payments

## Troubleshooting

### Test Mode Not Working
- Check `.env.local` has `NEXT_PUBLIC_ENABLE_TEST_PAYMENTS=true`
- Restart the dev server after adding the variable
- Check browser console for errors

### Want to Test SumUp Integration
- Set `NEXT_PUBLIC_ENABLE_TEST_PAYMENTS=false`
- Use real SumUp credentials
- Test with small amounts

## Security Note

⚠️ **Important**: Test mode should **NEVER** be enabled in production!

Make sure to:
- Only enable test mode in development
- Remove or disable in production environment variables
- Use real SumUp payments in production

