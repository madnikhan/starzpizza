# 🔴 URGENT: Fix Firestore Permission Error

## The Problem
You're getting "Failed to create order" because Firestore security rules are blocking access.

## Quick Fix (Copy This Exactly)

### Step 1: Open Firebase Console
1. Go to: https://console.firebase.google.com/
2. Select your project
3. Click **"Firestore Database"** (left sidebar)
4. Click **"Rules"** tab

### Step 2: Replace ALL Rules With This

**Copy this EXACT code:**

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /orders/{orderId} {
      allow read, write: if true;
    }
  }
}
```

### Step 3: Publish
1. Click **"Publish"** button (top right)
2. Wait for "Rules published successfully" message

### Step 4: Test
1. Go back to your website
2. Try placing an order
3. It should work now! ✅

---

## Why This Works

This rule allows:
- ✅ **Read**: Needed to check if order ID exists
- ✅ **Write**: Needed to create the order

Both are required because the code checks for existing order IDs before creating.

---

## ⚠️ Security Note

This allows anyone to read/write orders. For production, you'll want stricter rules, but this will get you working for now.

