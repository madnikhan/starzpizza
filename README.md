# STAR'Z Burger/Pizza & Shakes - Online Ordering Website

A modern, full-stack online ordering system for STAR'Z takeaway restaurant.

## Technology Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Database:** Firestore (Firebase)
- **Payment:** Stripe
- **State Management:** Zustand
- **Form Handling:** React Hook Form
- **Hosting:** Vercel

## Features

- ✅ Menu display (Burgers, Pizzas, Shakes, Sides, Desserts)
- ✅ Shopping cart functionality
- ✅ Order types: Takeaway, Collection, Delivery
- ✅ Payment options: Card (Stripe) and Cash on Delivery
- ✅ Order management system
- ✅ Responsive design (mobile-first)
- ✅ Real-time order tracking

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- MongoDB Atlas account (or Supabase for PostgreSQL)

### Installation

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your API keys

# Run development server
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## Environment Variables

```
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Stripe Payment
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_SECRET_KEY=your_stripe_secret_key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

See [FIRESTORE_SETUP.md](./FIRESTORE_SETUP.md) for detailed Firebase setup instructions.

## Project Structure

```
├── app/                    # Next.js App Router
│   ├── (pages)/           # Route pages
│   ├── api/               # API routes
│   └── layout.tsx         # Root layout
├── components/            # React components
├── lib/                   # Utilities and configurations
├── types/                 # TypeScript types
└── public/                # Static assets
```

## Deployment

Deploy to Vercel:

```bash
npm install -g vercel
vercel
```

