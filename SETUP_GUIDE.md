# Setup Guide - STAR'Z Online Ordering Website

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Environment Variables

Create a `.env.local` file in the root directory:

```bash
cp .env.example .env.local
```

Then edit `.env.local` with your actual values:

```env
# Database (Choose one)
# Option 1: MongoDB Atlas
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/starz?retryWrites=true&w=majority

# Option 2: Supabase (PostgreSQL)
# DATABASE_URL=postgresql://user:password@host:5432/starz

# Stripe Payment (Get from https://dashboard.stripe.com/test/apikeys)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_key_here
STRIPE_SECRET_KEY=sk_test_your_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Restaurant Details
RESTAURANT_NAME=STAR'Z Burger/Pizza & Shakes
RESTAURANT_ADDRESS=27 Castle Foregate, Shrewsbury SY1 2EE
RESTAURANT_PHONE=01743 362 362

# Delivery Settings
DELIVERY_FEE=2.50
MIN_ORDER_AMOUNT=10.00
DELIVERY_RADIUS=5
```

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Setting Up Database (Firestore)

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project (or use existing)
3. Enable Firestore Database
4. Get your Firebase configuration from Project Settings
5. Add all Firebase config values to `.env.local`

**Detailed instructions:** See [FIRESTORE_SETUP.md](./FIRESTORE_SETUP.md) for step-by-step Firebase setup.

## Setting Up Stripe Payments

1. Go to [Stripe Dashboard](https://dashboard.stripe.com)
2. Create an account (or sign in)
3. Go to Developers > API keys
4. Copy your **Test** keys:
   - Publishable key → `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
   - Secret key → `STRIPE_SECRET_KEY`
5. For webhooks (later):
   - Go to Developers > Webhooks
   - Add endpoint: `https://yourdomain.com/api/webhooks/stripe`
   - Copy webhook secret → `STRIPE_WEBHOOK_SECRET`

**Note:** Use test keys during development. Switch to live keys when going to production.

## Project Structure

```
starzburgerpizza&shakes/
├── app/                          # Next.js pages
│   ├── page.tsx                  # Home page
│   ├── menu/                     # Menu pages
│   │   ├── page.tsx              # Menu categories
│   │   └── [category]/page.tsx   # Category items
│   ├── cart/                     # Shopping cart
│   ├── checkout/                 # Checkout page
│   └── order-confirmation/       # Order confirmation
├── components/                   # React components
│   ├── Header.tsx                # Site header
│   ├── MenuItemCard.tsx          # Menu item card
│   └── Cart.tsx                  # Cart component
├── lib/                          # Utilities
│   ├── menu-data.ts              # Menu items data
│   └── store/                    # State management
│       └── cart-store.ts         # Cart state
├── types/                        # TypeScript types
│   └── menu.ts                   # Menu types
└── public/                       # Static files
```

## Features Implemented

✅ **Home Page** - Welcome page with menu categories
✅ **Menu Display** - All items organized by category
✅ **Shopping Cart** - Add/remove items, manage quantities
✅ **Checkout** - Order type (Takeaway/Collection/Delivery)
✅ **Payment Options** - Card (Stripe) and Cash on Delivery
✅ **Order Confirmation** - Confirmation page after order
✅ **Responsive Design** - Works on all devices

## Next Steps (To Complete)

### 1. Order API Endpoint

✅ **Already implemented!** The order API endpoint is at `app/api/orders/route.ts` and uses Firestore to save orders.

It's ready to use once you:
- Set up Firebase project
- Add Firebase config to `.env.local`
- Enable Firestore Database

See [FIRESTORE_SETUP.md](./FIRESTORE_SETUP.md) for setup instructions.

### 2. Integrate Stripe Payment

Update `app/checkout/page.tsx` to create Stripe payment intent when user selects card payment.

### 3. Add Order Management (Admin Panel)

Create admin pages to:
- View all orders
- Update order status
- Manage menu items

### 4. Add Email Notifications

Send confirmation emails when orders are placed.

### 5. Add Order Tracking

Allow customers to track their order status.

## Deployment

### Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Go to [Vercel](https://vercel.com)
3. Import your GitHub repository
4. Add environment variables
5. Deploy!

### Manual Deployment

```bash
npm run build
npm start
```

## Testing

- Test menu browsing
- Test adding items to cart
- Test checkout flow
- Test with Stripe test cards:
  - Success: `4242 4242 4242 4242`
  - Decline: `4000 0000 0000 0002`

## Support

For issues or questions:
- Check the [README.md](./README.md)
- Review [TECHNOLOGY_STACK.md](./TECHNOLOGY_STACK.md)
- Check Next.js documentation: https://nextjs.org/docs

