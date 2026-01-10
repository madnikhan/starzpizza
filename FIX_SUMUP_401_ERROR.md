# Fix SumUp 401 Authentication Error

## Error
```
POST /api/payments/sumup 401 (Unauthorized)
Payment Error: Authentication failed. Please check your SumUp credentials
```

## What This Means
A **401 Unauthorized** error means SumUp rejected your authentication credentials. This could be due to:

1. ❌ Missing credentials in `.env.local`
2. ❌ Invalid or expired access token
3. ❌ Wrong merchant code
4. ❌ Using sandbox credentials with wrong configuration
5. ❌ Credentials not loaded (server needs restart)

## How to Fix

### Step 1: Check Your `.env.local` File

Make sure your `.env.local` file has these variables:

```env
# SumUp Credentials (REQUIRED)
SUMUP_ACCESS_TOKEN=your_access_token_here
SUMUP_MERCHANT_CODE=your_merchant_code_here

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Optional: Mark as sandbox if using sandbox credentials
SUMUP_SANDBOX=true
# OR
NEXT_PUBLIC_SUMUP_SANDBOX=true

# IMPORTANT: Disable test mode for real SumUp payments
NEXT_PUBLIC_ENABLE_TEST_PAYMENTS=false
```

### Step 2: Verify Your Credentials

#### For Sandbox:
1. Log in to your **SumUp Sandbox Dashboard**
2. Go to **Settings** → **API** (or **Developers** → **API**)
3. Copy your **Sandbox Access Token**
4. Copy your **Sandbox Merchant Code**
5. Make sure `SUMUP_SANDBOX=true` is set in `.env.local`

#### For Production:
1. Log in to your **SumUp Production Dashboard**
2. Go to **Settings** → **API** (or **Developers** → **API**)
3. Copy your **Production Access Token**
4. Copy your **Production Merchant Code**
5. Make sure `SUMUP_SANDBOX=false` or remove it from `.env.local`

### Step 3: Check Credential Format

**Access Token:**
- Should be a long string (usually starts with `su_` or similar)
- No spaces or line breaks
- Example: `su_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

**Merchant Code:**
- Usually 8-10 characters (alphanumeric)
- Example: `M78F972R`

### Step 4: Restart Your Server

**IMPORTANT:** After changing `.env.local`, you **must** restart your development server:

```bash
# Stop the server (Ctrl+C or Cmd+C)
# Then restart:
npm run dev
```

Environment variables are only loaded when the server starts!

### Step 5: Check Server Logs

After restarting, try the payment again and check your terminal for:

**Good signs:**
```
✅ SUMUP SANDBOX MODE: Using sandbox credentials
Creating SumUp checkout with data: { ... }
```

**Bad signs:**
```
SumUp credentials not configured
❌ SumUp API error: { status: 401, ... }
🔐 AUTHENTICATION ERROR: Check your SUMUP_ACCESS_TOKEN and SUMUP_MERCHANT_CODE
```

### Step 6: Verify Credentials Are Loaded

Check your server logs when the server starts. You should see:
- The mode (SANDBOX or PRODUCTION)
- A masked version of your access token (first 10 characters)

If you see "missing" instead, the credentials aren't loaded.

## Common Issues

### Issue 1: Credentials Not Set
**Symptom:** Server log shows "SumUp credentials not configured"
**Fix:** Add `SUMUP_ACCESS_TOKEN` and `SUMUP_MERCHANT_CODE` to `.env.local`

### Issue 2: Server Not Restarted
**Symptom:** Changed `.env.local` but still getting 401
**Fix:** Restart the server (`npm run dev`)

### Issue 3: Wrong Credentials
**Symptom:** 401 error even with credentials set
**Fix:** 
- Double-check credentials in SumUp dashboard
- Make sure you're using sandbox credentials if `SUMUP_SANDBOX=true`
- Verify access token hasn't expired (regenerate if needed)

### Issue 4: Token Expired
**Symptom:** Worked before, now getting 401
**Fix:** 
- Access tokens can expire
- Generate a new access token in SumUp dashboard
- Update `.env.local` and restart server

### Issue 5: Wrong Environment
**Symptom:** Using sandbox credentials but getting 401
**Fix:**
- Make sure `SUMUP_SANDBOX=true` is set
- Or use production credentials with `SUMUP_SANDBOX=false`

## Testing Your Credentials

You can test your credentials manually using curl:

```bash
curl -X POST https://api.sumup.com/v0.1/checkouts \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{
    "checkout_reference": "TEST-123",
    "amount": 10.99,
    "currency": "GBP",
    "merchant_code": "YOUR_MERCHANT_CODE",
    "return_url": "http://localhost:3000/payment-callback",
    "hosted_checkout": {
      "enabled": true
    }
  }'
```

Replace `YOUR_ACCESS_TOKEN` and `YOUR_MERCHANT_CODE` with your actual credentials.

**Expected response:**
- `201 Created` with checkout data = ✅ Credentials work
- `401 Unauthorized` = ❌ Credentials are wrong

## Still Not Working?

1. **Check SumUp Dashboard:**
   - Verify your account is active
   - Check if API access is enabled
   - Verify you have permission to create checkouts

2. **Contact SumUp Support:**
   - Ask them to verify your credentials
   - Check if your account has API access enabled
   - Verify if there are any account restrictions

3. **Check Server Logs:**
   - Look for the full error response from SumUp
   - The `details` field in the error will show what SumUp said

4. **Try Regenerating Credentials:**
   - Generate a new access token in SumUp dashboard
   - Update `.env.local` with the new token
   - Restart server

## Quick Checklist

- [ ] `.env.local` has `SUMUP_ACCESS_TOKEN`
- [ ] `.env.local` has `SUMUP_MERCHANT_CODE`
- [ ] Credentials are correct (no typos, no extra spaces)
- [ ] Using sandbox credentials? Set `SUMUP_SANDBOX=true`
- [ ] Server was restarted after changing `.env.local`
- [ ] Access token is not expired
- [ ] Merchant code matches your SumUp account
- [ ] API access is enabled in SumUp dashboard
