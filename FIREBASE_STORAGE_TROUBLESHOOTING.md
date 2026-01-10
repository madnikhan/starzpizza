# Firebase Storage Upload Troubleshooting

## Quick Checklist

If images are not uploading to Firebase Storage, check these:

### 1. ✅ Is Firebase Storage Enabled?

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Click **"Storage"** in the left sidebar
4. If you see "Get started" button, click it and enable Storage
5. If Storage is already enabled, you should see your storage bucket

### 2. ✅ Check Storage Security Rules

1. In Firebase Console, go to **Storage** > **Rules** tab
2. Make sure you have these rules:

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

3. Click **"Publish"**

### 3. ✅ Verify Environment Variables

Check your `.env.local` file has:

```env
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=starzpizza-96cf1.firebasestorage.app
```

**Important:** The storage bucket format should be:
- ✅ `project-id.firebasestorage.app` (new format)
- ✅ `project-id.appspot.com` (old format, also works)

### 4. ✅ Check Server Logs

When you try to upload an image, check your terminal (where `npm run dev` is running) for:

- `📥 Received file: ...` - File received
- `📤 Preparing to upload to Firebase Storage: ...` - Starting upload
- `⏳ Uploading bytes to Firebase Storage...` - Upload in progress
- `✅ Bytes uploaded successfully` - Upload complete
- `🔗 Getting download URL...` - Getting URL
- `✅ Got download URL: ...` - Success!

If you see errors, they will show:
- `❌ Error during uploadBytes:` - Upload failed
- `❌ Error getting download URL:` - URL retrieval failed

### 5. ✅ Check Browser Console

Open browser DevTools (F12) and check:
- Network tab: Look for `/api/menu/upload` request
- Console tab: Look for error messages
- Check the response from the upload API

## Common Errors and Fixes

### Error: "Storage permission denied" or "storage/unauthorized"

**Fix:** Update Storage security rules in Firebase Console:
```javascript
match /menu-images/{imageId} {
  allow read: if true;
  allow write: if true; // Change this to allow writes
}
```

### Error: "Storage not configured" or "storage/unknown"

**Fix:** 
1. Enable Firebase Storage in Firebase Console
2. Check `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` in `.env.local`
3. Restart your dev server after changing env variables

### Error: "Firebase Storage is not initialized"

**Fix:**
1. Check all Firebase env variables are set
2. Make sure Storage is enabled in Firebase Console
3. Restart dev server

### Error: "Bucket not found"

**Fix:**
1. Go to Firebase Console > Storage
2. Copy the exact bucket name
3. Update `.env.local` with the correct bucket name
4. Restart dev server

## Testing Upload

1. Go to `/admin/menu`
2. Click "Add Menu Item"
3. Select an image file
4. Click "Upload Image" button
5. Check terminal for logs
6. Check browser console for errors
7. If successful, you should see the image preview update

## Verify Upload Success

1. Go to Firebase Console > Storage
2. You should see a `menu-images/` folder
3. Your uploaded images should be inside
4. Click on an image to see its URL

## Still Not Working?

Share these details:
1. Error message from terminal
2. Error message from browser console
3. Response from `/api/menu/upload` (check Network tab)
4. Screenshot of Firebase Console > Storage
