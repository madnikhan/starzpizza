# Deploy Firestore Security Rules

## Problem
You're getting "Missing or insufficient permissions" when trying to migrate menu items.

This happens because the Firestore security rules in your local file haven't been deployed to Firebase Console.

## Solution: Deploy Rules to Firebase

### Option 1: Manual Deployment (Recommended for now)

1. **Open Firebase Console**
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Select your project

2. **Navigate to Firestore Rules**
   - Click on **"Firestore Database"** in the left sidebar
   - Click on the **"Rules"** tab

3. **Copy Rules from Local File**
   - Open `firestore.rules` in your project
   - Copy all the content

4. **Paste and Publish**
   - Paste the rules into the Firebase Console Rules editor
   - Click **"Publish"** button
   - Wait for confirmation

### Option 2: Using Firebase CLI (If you have it installed)

```bash
# Install Firebase CLI (if not installed)
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize Firebase (if not already done)
firebase init firestore

# Deploy rules
firebase deploy --only firestore:rules
```

## Current Rules (from firestore.rules)

Make sure these rules are in Firebase Console:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Orders collection
    match /orders/{orderId} {
      allow create: if request.resource.data.keys().hasAll(['items', 'orderType', 'paymentMethod', 'customerInfo', 'subtotal', 'total', 'status', 'createdAt']) &&
                       request.resource.data.items is list &&
                       request.resource.data.items.size() > 0 &&
                       request.resource.data.customerInfo.phone is string &&
                       request.resource.data.customerInfo.name is string;
      allow read: if true;
      allow update: if true;
      allow delete: if true;
    }
    
    // Menu items (read-only for public, write for admin)
    match /menu/{itemId} {
      allow read: if true;
      allow create: if true; // Allow creation (admin dashboard)
      allow update: if true; // Allow updates (admin dashboard)
      allow delete: if true; // Allow deletes (admin dashboard)
    }
  }
}
```

## Verify Rules Are Deployed

After deploying:
1. Go back to Firebase Console > Firestore Database > Rules
2. Verify the rules match what's in `firestore.rules`
3. Try the migration again

## Troubleshooting

If you still get permission errors after deploying:

1. **Check Rules Tab**: Make sure you're looking at the correct database (default vs. other)
2. **Wait a few seconds**: Rules can take a moment to propagate
3. **Check Browser Console**: Look for specific error messages
4. **Verify Collection Name**: Make sure you're using `menu` (not `menus` or `menuItems`)
