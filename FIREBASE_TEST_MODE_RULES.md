# Quick Fix: Firestore Test Mode Rules

## ⚠️ TEMPORARY TEST MODE RULES (For Development Only)

If you're still getting permission errors, use these **temporary test mode rules** to get orders working immediately:

### Step 1: Go to Firebase Console

1. Open [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Click **"Firestore Database"** > **"Rules"** tab

### Step 2: Use Test Mode Rules (Temporary)

Copy and paste these rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

### Step 3: Publish

1. Click **"Publish"**
2. Wait for confirmation

### Step 4: Test

Try placing an order - it should work now!

---

## ⚠️ IMPORTANT: Security Warning

**These rules allow anyone to read/write all data!** 

**Only use for development/testing!**

For production, you MUST use the proper security rules from `firestore.rules` or `FIREBASE_SECURITY_RULES_FIX.md`.

---

## After Testing Works

Once orders are working, update to proper security rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /orders/{orderId} {
      allow create: if true; // Allow creating orders
      allow read: if true;   // Allow reading orders
      allow update: if true; // Allow updating orders
      allow delete: if false; // No deletes
    }
  }
}
```

This is still permissive but at least restricts to the orders collection only.

