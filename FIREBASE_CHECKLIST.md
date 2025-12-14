# Firebase Setup Checklist

## ✅ Completed Steps

- [x] Firebase project created: `starzpizza-96cf1`
- [x] Firebase configuration added to `.env.local`
- [x] Firebase SDK installed
- [x] Firestore helper functions created
- [x] API routes configured

## 🔲 Next Steps (Important!)

### 1. Enable Firestore Database

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **starzpizza-96cf1**
3. Click on **"Firestore Database"** in the left sidebar
4. Click **"Create database"**
5. Select **"Start in test mode"** (for now)
6. Choose a location (e.g., `europe-west2` for UK)
7. Click **"Enable"**

**⚠️ Important:** Without this step, orders won't be saved!

### 2. Set Up Firestore Security Rules

1. In Firebase Console, go to **Firestore Database** > **Rules**
2. Replace the default rules with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Orders collection
    match /orders/{orderId} {
      // Allow anyone to create orders
      allow create: if request.resource.data.keys().hasAll(['items', 'orderType', 'paymentMethod', 'customerInfo', 'subtotal', 'total', 'status', 'createdAt']);
      
      // Allow read for order owner (by phone) or authenticated users
      allow read: if true; // For now, allow all reads (update later for security)
      
      // Allow updates to status (for admin)
      allow update: if request.resource.data.diff(resource.data).affectedKeys().hasOnly(['status', 'updatedAt']);
      
      // No deletes
      allow delete: if false;
    }
  }
}
```

3. Click **"Publish"**

### 3. Restart Development Server

After adding environment variables, restart your dev server:

```bash
# Stop the current server (Ctrl+C)
# Then restart:
npm run dev
```

### 4. Test Order Creation

1. Go to http://localhost:3000
2. Add items to cart
3. Go through checkout
4. Place an order
5. Check Firebase Console > Firestore Database > `orders` collection
6. You should see your order!

## 🔍 Verify Setup

### Check Firebase Connection

You can test if Firebase is connected by:

1. Opening browser console (F12)
2. Going to your website
3. Check for any Firebase errors

### Check Firestore

1. Go to Firebase Console
2. Navigate to Firestore Database
3. You should see an `orders` collection after placing a test order

## 📊 Monitor Orders

- **View Orders:** Firebase Console > Firestore Database > `orders`
- **Order Structure:** Each order document contains:
  - `items` - Array of ordered items
  - `orderType` - "takeaway" | "collection" | "delivery"
  - `paymentMethod` - "card" | "cash"
  - `customerInfo` - Customer details
  - `subtotal`, `deliveryFee`, `total` - Pricing
  - `status` - Order status
  - `createdAt` - Timestamp

## 🚨 Troubleshooting

### Error: "Missing or insufficient permissions"
- **Solution:** Check Firestore security rules are published

### Error: "Firebase: Error (auth/configuration-not-found)"
- **Solution:** 
  - Verify `.env.local` file exists
  - Check all `NEXT_PUBLIC_` variables are set
  - Restart dev server after adding env variables

### Orders not appearing in Firestore
- **Solution:**
  - Verify Firestore Database is enabled
  - Check browser console for errors
  - Verify API route is being called (check Network tab)

### "Firestore is not enabled"
- **Solution:** Follow step 1 above to enable Firestore

## 🎯 Next Features to Add

- [ ] Admin panel to view/manage orders
- [ ] Real-time order status updates
- [ ] Email notifications (Firebase Functions)
- [ ] Order tracking page
- [ ] Firebase Authentication for admin

## 📚 Resources

- [Firebase Console](https://console.firebase.google.com/project/starzpizza-96cf1)
- [Firestore Documentation](https://firebase.google.com/docs/firestore)
- [Firebase Security Rules](https://firebase.google.com/docs/firestore/security/get-started)

