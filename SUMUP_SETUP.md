# SumUp Payment Gateway Setup Guide

This guide will help you set up SumUp payment gateway for card payments on the STAR'Z online ordering website.

## What is SumUp?

SumUp is a payment service provider that allows businesses to accept card payments online. It's particularly popular in the UK and Europe for its simple setup and competitive rates.

## Prerequisites

- A SumUp business account
- SumUp merchant code
- SumUp API access token

## Setup Steps

### 1. Create a SumUp Account

1. Go to [SumUp.com](https://www.sumup.com)
2. Sign up for a business account
3. Complete the verification process
4. Once approved, you'll receive your merchant code

### 2. Get API Credentials

1. Log in to your [SumUp Dashboard](https://me.sumup.com)
2. Navigate to **Settings** > **API** (or **Developers** > **API**)
3. Create a new API application
4. Copy your **Access Token** (keep this secure!)
5. Note your **Merchant Code** (usually found in your account settings)

### 3. Configure Environment Variables

Add the following environment variables to your `.env.local` file:

```env
# SumUp Payment Gateway
SUMUP_ACCESS_TOKEN=your_sumup_access_token_here
SUMUP_MERCHANT_CODE=your_merchant_code_here

# App URL (for payment callbacks)
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**For Production:**
- Update `NEXT_PUBLIC_APP_URL` to your production domain (e.g., `https://starzpizza.vercel.app`)
- Use your production SumUp credentials

### 4. Test the Integration

#### Test Mode
SumUp provides a test mode for development. Use test credentials during development.

#### Test Card Numbers
SumUp doesn't provide specific test cards like Stripe. Instead, use:
- Real card numbers in test mode (if available)
- Or use SumUp's sandbox environment

#### Testing Flow
1. Add items to cart
2. Go to checkout
3. Select "Card Payment"
4. Fill in customer information
5. Click "Pay with Card"
6. You'll be redirected to SumUp's payment page
7. Complete the payment
8. You'll be redirected back to the confirmation page

## How It Works

### Payment Flow

1. **Customer selects card payment** on checkout page
2. **Order is created** in database with "pending" status
3. **SumUp checkout is created** via API
4. **Customer is redirected** to SumUp payment page
5. **Customer completes payment** on SumUp's secure page
6. **SumUp redirects back** to `/payment-callback`
7. **Payment is verified** via SumUp API
8. **Order status is updated** to "confirmed"
9. **Cart is cleared** and customer sees confirmation

### API Endpoints

#### Create Payment Checkout
```
POST /api/payments/sumup
Body: {
  orderId: string,
  amount: number,
  description: string
}
Response: {
  success: boolean,
  checkoutId: string,
  checkoutUrl: string
}
```

#### Verify Payment
```
GET /api/payments/sumup/verify?orderId=xxx&checkoutId=xxx
Response: {
  success: boolean,
  paid: boolean,
  transaction: {
    id: string,
    status: string,
    amount: number,
    currency: string
  }
}
```

## Security Best Practices

1. **Never commit API keys** to version control
2. **Use environment variables** for all sensitive data
3. **Enable HTTPS** in production
4. **Verify payments server-side** before updating order status
5. **Log all payment transactions** for audit purposes

## Troubleshooting

### Payment Not Processing

- Check that `SUMUP_ACCESS_TOKEN` and `SUMUP_MERCHANT_CODE` are set correctly
- Verify the API credentials are valid and not expired
- Check browser console for errors
- Review server logs for API errors

### Redirect Not Working

- Ensure `NEXT_PUBLIC_APP_URL` is set correctly
- Check that the return URL matches your domain
- Verify SumUp allows your domain in their settings

### Payment Verification Failing

- Check that the order ID matches the checkout reference
- Verify the transaction exists in SumUp dashboard
- Check API response for error messages

## Production Deployment

### Vercel Environment Variables

When deploying to Vercel, add these environment variables:

1. Go to your Vercel project settings
2. Navigate to **Environment Variables**
3. Add:
   - `SUMUP_ACCESS_TOKEN` (production token)
   - `SUMUP_MERCHANT_CODE` (your merchant code)
   - `NEXT_PUBLIC_APP_URL` (your production URL)

### Update Return URLs

1. In SumUp dashboard, update allowed return URLs
2. Add your production domain to allowed domains
3. Test the payment flow in production

## Support

- [SumUp Developer Documentation](https://developer.sumup.com)
- [SumUp API Reference](https://developer.sumup.com/api-reference)
- [SumUp Cloud API](https://developer.sumup.com/terminal-payments/cloud-api) - For in-person payments with card readers
- [SumUp Support](https://help.sumup.com)

## Known Issue: Payment URL Format

**Current Status:** SumUp's Checkout API creates checkouts successfully but doesn't return a payment URL. All constructed URL patterns return 404.

**See:** `SUMUP_PAYMENT_URL_ISSUE.md` for detailed information and next steps.

**Action Required:** Contact SumUp support to get the correct payment URL format for your account.

## Notes

- SumUp charges a transaction fee (typically 1.69% + £0.10 per transaction in the UK)
- Payments are typically settled within 1-3 business days
- SumUp supports multiple currencies
- The integration uses SumUp's Checkout API for secure payment processing

