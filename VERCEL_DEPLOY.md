# Vercel Deployment Guide

## ✅ Pre-Deployment Checklist

- [x] Next.js 14 project configured
- [x] TypeScript setup complete
- [x] Build script working
- [x] Environment variables documented
- [x] `.gitignore` configured
- [x] All dependencies in `package.json`

## 🚀 Deploy to Vercel

### Option 1: Deploy via Vercel Dashboard (Recommended)

1. **Push code to GitHub** (if not already done):
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Go to Vercel Dashboard**:
   - Visit [vercel.com](https://vercel.com)
   - Sign in with GitHub
   - Click "Add New Project"

3. **Import Repository**:
   - Select `madnikhan/starzpizza` repository
   - Click "Import"

4. **Configure Project**:
   - **Framework Preset**: Next.js (auto-detected)
   - **Root Directory**: `./` (default)
   - **Build Command**: `npm run build` (default)
   - **Output Directory**: `.next` (default)
   - **Install Command**: `npm install` (default)

5. **Add Environment Variables**:
   Click "Environment Variables" and add:
   
   ```
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=starzpizza-96cf1.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=starzpizza-96cf1
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=starzpizza-96cf1.firebasestorage.app
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=75169350946
   NEXT_PUBLIC_FIREBASE_APP_ID=1:75169350946:web:dd870544c89cf0eee6d17b
   NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-LPT7NPTHR4
   
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_key (when ready)
   STRIPE_SECRET_KEY=your_stripe_secret (when ready)
   
   NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
   ```

6. **Deploy**:
   - Click "Deploy"
   - Wait for build to complete
   - Your site will be live at `https://starzpizza.vercel.app` (or custom domain)

### Option 2: Deploy via Vercel CLI

1. **Install Vercel CLI**:
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Deploy**:
   ```bash
   vercel
   ```

4. **Follow prompts**:
   - Link to existing project or create new
   - Add environment variables when prompted

5. **Production Deployment**:
   ```bash
   vercel --prod
   ```

## 📋 Required Environment Variables

Make sure to add these in Vercel Dashboard > Settings > Environment Variables:

### Firebase (Required)
- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`
- `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID` (optional)

### Stripe (Optional - for payments)
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`

### App Configuration
- `NEXT_PUBLIC_APP_URL` - Your Vercel deployment URL

## 🔧 Post-Deployment

1. **Update Firebase Allowed Domains**:
   - Go to Firebase Console > Authentication > Settings
   - Add your Vercel domain to authorized domains

2. **Update Firestore Security Rules** (if needed):
   - Allow your Vercel domain in CORS settings

3. **Test the Deployment**:
   - Visit your Vercel URL
   - Test menu browsing
   - Test cart functionality
   - Test order placement

## 🐛 Troubleshooting

### Build Fails
- Check build logs in Vercel dashboard
- Ensure all environment variables are set
- Verify `package.json` has all dependencies

### Images Not Loading
- Check `next.config.js` image domains
- Verify Unsplash URLs are accessible

### Firebase Connection Issues
- Verify environment variables are set correctly
- Check Firebase project settings
- Ensure Firestore is enabled

## 📚 Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js on Vercel](https://vercel.com/docs/frameworks/nextjs)
- [Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)

