# Fix: Firestore Security Rules for Order Creation

## Problem
You're getting "Failed to create order" with error: `Missing or insufficient permissions`

This happens because Firestore security rules are blocking order creation.

## Solution: Update Firestore Security Rules

### Step 1: Go to Firebase Console

1. Open [Firebase Console](https://console.firebase.google.com/)
2. Select your project (e.g., `starzpizza-96cf1`)
3. Click on **"Firestore Database"** in the left sidebar
4. Click on the **"Rules"** tab

### Step 2: Copy and Paste These Rules

Replace the existing rules with the following:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Orders collection
    match /orders/{orderId} {
      // Allow anyone to create orders (for public checkout)
      // Check that required fields are present
      allow create: if request.resource.data.keys().hasAll(['items', 'orderType', 'paymentMethod', 'customerInfo', 'subtotal', 'total', 'status', 'createdAt']) &&
                       request.resource.data.items is list &&
                       request.resource.data.items.size() > 0 &&
                       request.resource.data.customerInfo.phone is string &&
                       request.resource.data.customerInfo.name is string;
      
      // Allow read for anyone (for order confirmation pages)
      // In production, you might want to restrict this to order owners
      allow read: if true;
      
      // Allow updates to status and payment info (for admin and payment callbacks)
      allow update: if request.resource.data.diff(resource.data).affectedKeys().hasOnly(['status', 'updatedAt', 'paymentStatus', 'transactionId']);
      
      // No deletes for now
      allow delete: if false;
    }
    
    // Menu items (read-only for public)
    match /menu/{itemId} {
      allow read: if true;
      allow write: if false; // Only admins can write (add auth later)
    }
  }
}
```

### Step 3: Publish the Rules

1. Click the **"Publish"** button at the top
2. Wait for confirmation that rules are published

### Step 4: Test Again

1. Go back to your website
2. Try placing an order again
3. The order should now be created successfully!

## What These Rules Do

- **`allow create`**: Allows anyone to create orders, but validates that all required fields are present
- **`allow read`**: Allows anyone to read orders (for order confirmation pages)
- **`allow update`**: Allows updating order status and payment info (for payment callbacks and admin)
- **`allow delete`**: Blocks all deletions (for data integrity)

## Important Notes

⚠️ **For Production**: These rules allow public access. For better security:
- Add Firebase Authentication
- Restrict reads to order owners (by phone number or email)
- Add admin authentication for updates

## Troubleshooting

If you still get permission errors after updating rules:

1. **Check Rules Are Published**: Make sure you clicked "Publish"
2. **Wait a Few Seconds**: Rules can take a few seconds to propagate
3. **Check Browser Console**: Look for specific error messages
4. **Verify Firestore is Enabled**: Make sure Firestore Database is enabled in Firebase Console

## Quick Test Mode (Temporary)

If you need to test quickly, you can temporarily use test mode rules (⚠️ **NOT for production**):

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.time < timestamp.date(2025, 12, 31);
    }
  }
}
```

**⚠️ WARNING**: This allows anyone to read/write all data. Only use for testing and remove immediately after!

