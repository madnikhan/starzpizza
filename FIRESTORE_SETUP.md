# Firestore Database Setup Guide

## Why Firestore?

Firestore is an excellent choice for this project because:
- ✅ **Real-time updates** - Orders can be updated in real-time
- ✅ **Easy setup** - No server management needed
- ✅ **Free tier** - Generous free tier (50K reads, 20K writes/day)
- ✅ **Scalable** - Automatically scales with your business
- ✅ **Built-in security** - Security rules for data protection
- ✅ **Offline support** - Works offline (great for mobile apps)

## Setup Steps

### 1. Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **"Add project"** or **"Create a project"**
3. Enter project name: `starz-burger-pizza-shakes` (or your preferred name)
4. Click **Continue**
5. Disable Google Analytics (optional, you can enable later)
6. Click **Create project**
7. Wait for project to be created, then click **Continue**

### 2. Enable Firestore Database

1. In Firebase Console, click on **Firestore Database** in the left sidebar
2. Click **"Create database"**
3. Select **"Start in test mode"** (we'll add security rules later)
4. Choose a location closest to your users (e.g., `europe-west2` for UK)
5. Click **Enable**

### 3. Get Firebase Configuration

1. In Firebase Console, click the **gear icon** ⚙️ next to "Project Overview"
2. Select **"Project settings"**
3. Scroll down to **"Your apps"** section
4. Click the **Web icon** `</>` to add a web app
5. Register app with nickname: `starz-web-app`
6. Copy the `firebaseConfig` object values

### 4. Add Environment Variables

Create a `.env.local` file in your project root:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSy...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123
```

**Important:** All Firebase config variables must start with `NEXT_PUBLIC_` to be accessible in the browser.

### 5. Install Firebase SDK

The Firebase SDK is already added to `package.json`. Just run:

```bash
npm install
```

### 6. Set Up Firestore Security Rules

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
      
      // Allow read only for the order owner (by phone number) or admin
      allow read: if request.auth != null || 
                     resource.data.customerInfo.phone == request.resource.data.customerInfo.phone;
      
      // Only allow updates to status (for admin)
      allow update: if request.auth != null && 
                       request.resource.data.diff(resource.data).affectedKeys().hasOnly(['status', 'updatedAt']);
      
      // No deletes for now
      allow delete: if false;
    }
    
    // Menu items (read-only for public)
    match /menu/{itemId} {
      allow read: if true;
      allow write: if request.auth != null; // Only authenticated admins
    }
  }
}
```

**Note:** For production, you should implement proper authentication. The above rules are basic and should be enhanced.

### 7. Test the Connection

After setting up, restart your dev server:

```bash
npm run dev
```

Try placing an order through the checkout page. Check Firebase Console > Firestore Database to see if the order appears.

## Firestore Data Structure

### Orders Collection

```
orders/
  {orderId}/
    items: Array<CartItem>
    orderType: "takeaway" | "collection" | "delivery"
    paymentMethod: "card" | "cash"
    customerInfo: {
      name: string
      phone: string
      email?: string
      address?: string
    }
    subtotal: number
    deliveryFee?: number
    total: number
    status: "pending" | "confirmed" | "preparing" | "ready" | "completed" | "cancelled"
    createdAt: Timestamp
    updatedAt?: Timestamp
```

## Firestore Functions Available

The project includes these helper functions in `lib/firebase/orders.ts`:

- `createOrder()` - Create a new order
- `getOrder(orderId)` - Get a single order by ID
- `getAllOrders()` - Get all orders (for admin)
- `getOrdersByStatus(status)` - Get orders filtered by status
- `updateOrderStatus(orderId, status)` - Update order status

## Real-time Updates (Optional)

To listen for real-time order updates, you can use:

```typescript
import { onSnapshot, doc } from "firebase/firestore";
import { db } from "@/lib/firebase/config";

const unsubscribe = onSnapshot(doc(db, "orders", orderId), (doc) => {
  const order = { id: doc.id, ...doc.data() };
  // Update UI with new order data
});
```

## Firebase Console Features

- **View Orders:** Firestore Database > orders collection
- **Monitor Usage:** Usage and billing dashboard
- **Set Alerts:** Get notified when orders are created
- **Export Data:** Export orders as JSON/CSV

## Cost Estimate

**Free Tier (Spark Plan):**
- 50,000 reads/day
- 20,000 writes/day
- 20,000 deletes/day
- 1 GB storage

**Paid Tier (Blaze Plan - Pay as you go):**
- $0.06 per 100,000 reads
- $0.18 per 100,000 writes
- $0.02 per 100,000 deletes
- $0.18 per GB storage

For a small takeaway, the free tier should be sufficient initially.

## Next Steps

1. ✅ Set up Firebase project
2. ✅ Add environment variables
3. ✅ Test order creation
4. ⬜ Set up Firebase Authentication (for admin panel)
5. ⬜ Create admin panel to view/manage orders
6. ⬜ Set up email notifications (Firebase Functions)
7. ⬜ Add real-time order tracking

## Troubleshooting

**Error: "Firebase: Error (auth/configuration-not-found)"**
- Check that all environment variables are set correctly
- Make sure they start with `NEXT_PUBLIC_`
- Restart your dev server after adding env variables

**Error: "Missing or insufficient permissions"**
- Check Firestore security rules
- Make sure rules allow the operation you're trying to perform

**Orders not appearing in Firestore**
- Check browser console for errors
- Verify API route is being called
- Check Firebase Console > Firestore Database

## Resources

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firestore Documentation](https://firebase.google.com/docs/firestore)
- [Firebase Console](https://console.firebase.google.com/)

