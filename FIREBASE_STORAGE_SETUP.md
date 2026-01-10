# Firebase Storage Setup Guide

## Overview

Images are now stored in **Firebase Storage** (free online storage) instead of local files. This provides:
- ✅ **Free tier**: 5GB storage, 1GB/day downloads
- ✅ **Online access**: Images accessible from anywhere
- ✅ **CDN delivery**: Fast image loading worldwide
- ✅ **Automatic backups**: Google's infrastructure
- ✅ **Works on Vercel**: No file system issues

## Setup Steps

### 1. Enable Firebase Storage

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Click on **"Storage"** in the left sidebar
4. Click **"Get started"** or **"Create bucket"**
5. Choose **"Start in test mode"** (we'll add security rules)
6. Select a location (same as Firestore, e.g., `europe-west2`)
7. Click **"Done"**

### 2. Set Up Storage Security Rules

1. In Firebase Console, go to **Storage** > **Rules** tab
2. Replace the rules with:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Menu images - allow read for everyone, write for admin
    match /menu-images/{imageId} {
      allow read: if true; // Anyone can view images
      allow write: if true; // Allow uploads (admin dashboard)
    }
  }
}
```

3. Click **"Publish"**

### 3. Verify Storage Bucket

1. In Firebase Console, go to **Storage**
2. You should see your storage bucket
3. The bucket name should match `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` in your `.env.local`

### 4. Test Image Upload

1. Go to `/admin/menu`
2. Click "Add Menu Item"
3. Select an image
4. Click "Upload Image"
5. Check Firebase Console > Storage to see the uploaded image

## How It Works

### Image Upload Flow

1. **User selects image** → File is validated (type, size)
2. **Upload to Firebase Storage** → Image saved to `menu-images/` folder in Storage
3. **Get download URL** → Firebase returns a public URL (like `https://firebasestorage.googleapis.com/...`)
4. **Save URL to Firestore** → The `imageUrl` is stored in the menu item document
5. **Display image** → Frontend uses the URL to display the image

### Image URLs

Images are stored with URLs like:
```
https://firebasestorage.googleapis.com/v0/b/your-project.appspot.com/o/menu-images%2F1234567890_image.jpg?alt=media&token=...
```

These URLs are:
- ✅ Publicly accessible
- ✅ CDN-delivered (fast loading)
- ✅ Permanent (won't change)
- ✅ Secure (token-based access)

## Free Tier Limits

- **Storage**: 5GB free
- **Downloads**: 1GB/day free
- **Uploads**: Unlimited
- **Operations**: 50K/day free

For a restaurant menu, this is usually more than enough!

## Troubleshooting

### "Storage bucket not found"
- Make sure Storage is enabled in Firebase Console
- Check `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` in `.env.local`
- Restart your dev server after adding env variables

### "Permission denied"
- Check Storage security rules in Firebase Console
- Make sure rules allow `write` for `menu-images/`

### Images not showing
- Check if `imageUrl` is saved in Firestore
- Verify the URL is accessible (try opening in browser)
- Check browser console for CORS errors

### Upload fails
- Check file size (max 5MB)
- Check file type (JPEG, PNG, WebP only)
- Check server logs for specific errors

## Migration from Local Storage

If you have images in `/public/menu-images/`, you can:
1. Manually upload them through the admin dashboard
2. Or keep using local images (they'll still work)
3. New uploads will go to Firebase Storage

## Security Notes

**Current rules allow anyone to upload** - this is fine for development, but for production you should:
- Add authentication checks
- Restrict uploads to admin users only
- Add file validation on the server side

Example production rule:
```javascript
match /menu-images/{imageId} {
  allow read: if true;
  allow write: if request.auth != null; // Only authenticated users
}
```
