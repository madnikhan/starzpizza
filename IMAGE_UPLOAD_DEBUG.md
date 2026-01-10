# Image Upload Debugging Guide

## The Problem

Images are not uploading to Firebase Storage. The terminal shows:
```
🖼️ Updating imageUrl for item g8P8EOHrPv12vl35uPfq: 
```
(Empty imageUrl means upload never happened)

## Step-by-Step Debugging

### Step 1: Check if Upload Button is Clicked

1. Open `/admin/menu` in your browser
2. Click "Add Menu Item" or "Edit" on an existing item
3. **Select an image file** using the file input
4. **Click "Upload Image" button** (NOT "Add Item" or "Update Item")
5. Check your browser console (F12 → Console tab)

**Expected console logs:**
```
📤 Starting image upload...
📄 File details: {name: "...", size: ..., type: "..."}
📡 Sending request to /api/menu/upload...
📥 Response status: 200 OK
📥 Upload response data: {success: true, imageUrl: "https://..."}
✅ Upload successful! Image URL: https://...
```

**If you DON'T see these logs:**
- The "Upload Image" button might not be working
- Check for JavaScript errors in the console
- Make sure you selected a file first

### Step 2: Check Server Terminal

When you click "Upload Image", you should see in your terminal (where `npm run dev` is running):

```
📥 Upload endpoint called
✅ Storage is initialized
📦 Storage bucket: starzpizza-96cf1.firebasestorage.app
📥 Received file: image.jpg, size: 123456 bytes, type: image/jpeg
📤 Preparing to upload to Firebase Storage: menu-images/1234567890_image.jpg
⏳ Uploading bytes to Firebase Storage...
✅ Bytes uploaded successfully
🔗 Getting download URL...
✅ Got download URL: https://firebasestorage.googleapis.com/...
```

**If you DON'T see these logs:**
- The upload endpoint is not being called
- Check browser console for network errors
- Check if the file is too large (>5MB) or wrong type

### Step 3: Check Firebase Storage Rules

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Go to **Storage** → **Rules** tab
4. Make sure you have:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /menu-images/{imageId} {
      allow read: if true;
      allow write: if true;
    }
  }
}
```

5. Click **"Publish"**

### Step 4: Check Environment Variables

Check your `.env.local` file has:

```env
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=starzpizza-96cf1.firebasestorage.app
```

**Important:** Restart your dev server after changing `.env.local`:
```bash
# Stop the server (Ctrl+C)
npm run dev
```

### Step 5: Verify Storage is Enabled

1. Go to Firebase Console → **Storage**
2. If you see "Get started", click it and enable Storage
3. Choose "Start in test mode"
4. Select a location (same as Firestore)

### Step 6: Test Upload Manually

Try this in your browser console (F12 → Console):

```javascript
const formData = new FormData();
// Create a test file
const blob = new Blob(['test'], { type: 'image/jpeg' });
formData.append('file', blob, 'test.jpg');

fetch('/api/menu/upload', {
  method: 'POST',
  body: formData
})
.then(r => r.json())
.then(console.log)
.catch(console.error);
```

**Expected response:**
```json
{
  "success": true,
  "imageUrl": "https://firebasestorage.googleapis.com/...",
  "filename": "test.jpg"
}
```

## Common Issues

### Issue 1: "Upload Image" button doesn't appear

**Cause:** No file selected
**Fix:** Select an image file first, then the button will appear

### Issue 2: Upload button clicked but nothing happens

**Check:**
1. Browser console for errors
2. Network tab (F12 → Network) for failed requests
3. Server terminal for errors

### Issue 3: Upload succeeds but imageUrl is empty when saving

**Cause:** You're saving the menu item before uploading the image
**Fix:** 
1. Select image → Click "Upload Image" → Wait for success message
2. THEN click "Add Item" or "Update Item"

### Issue 4: "Storage permission denied"

**Fix:** Update Storage security rules (see Step 3)

### Issue 5: "Storage bucket not found"

**Fix:** 
1. Check `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` in `.env.local`
2. Restart dev server
3. Verify Storage is enabled in Firebase Console

## Quick Test Checklist

- [ ] Firebase Storage is enabled
- [ ] Storage security rules are published
- [ ] `.env.local` has `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- [ ] Dev server restarted after env changes
- [ ] File selected in the form
- [ ] "Upload Image" button clicked (not just "Save")
- [ ] Browser console shows upload logs
- [ ] Server terminal shows upload logs
- [ ] Success message appears after upload

## Still Not Working?

Share these details:
1. Browser console errors (F12 → Console)
2. Network tab errors (F12 → Network → `/api/menu/upload`)
3. Server terminal output when clicking "Upload Image"
4. Firebase Console → Storage → Rules (screenshot)
