# Image Upload Guide for Menu Items

## How Images Work

### Storage Location
- **Images are NOT stored in Firestore** - they're stored as files on the server
- Images are saved to: `/public/menu-images/` folder
- The **imageUrl** (path like `/menu-images/filename.jpg`) is stored in Firestore

### Image Upload Flow

1. **Upload Image:**
   - Select an image file in the "Add/Edit Menu Item" form
   - Click "Upload Image" button
   - Image is saved to `/public/menu-images/` folder
   - Returns `imageUrl` like `/menu-images/1234567890_image.jpg`

2. **Save to Firestore:**
   - The `imageUrl` is stored in the `imageUrl` field in Firestore
   - When you save the menu item, the `imageUrl` is included in the data

3. **Display Image:**
   - Images are accessible at: `http://localhost:3000/menu-images/filename.jpg`
   - The frontend displays images using the `imageUrl` from Firestore

## Troubleshooting

### Images Not Showing?

1. **Check if image was uploaded:**
   - Look in `public/menu-images/` folder
   - Check browser console for upload errors

2. **Check if imageUrl is in Firestore:**
   - Go to Firebase Console > Firestore Database > `menu` collection
   - Open a menu item document
   - Check if `imageUrl` field exists and has a value

3. **Check image path:**
   - ImageUrl should start with `/menu-images/`
   - Try accessing the image directly: `http://localhost:3000/menu-images/filename.jpg`

4. **Check server logs:**
   - Look for `✅ Image uploaded successfully` messages
   - Look for `🖼️ Image URL` messages when saving items

### Common Issues

**Issue: "Image uploaded successfully" but not showing**
- ✅ Image file is saved correctly
- ✅ Check if `imageUrl` was saved to Firestore
- ✅ Refresh the page after saving

**Issue: Image upload fails**
- Check file size (max 5MB)
- Check file type (JPEG, PNG, WebP only)
- Check server logs for errors

**Issue: Images from migration don't have imageUrl**
- Existing menu items from `lib/menu-data.ts` might not have `imageUrl`
- You can edit them and upload images manually
- Or the migration tries to use `item.imageUrl || item.image` from the static file

## Verifying Images in Firestore

1. Go to Firebase Console
2. Navigate to Firestore Database
3. Open the `menu` collection
4. Click on any menu item document
5. Look for the `imageUrl` field
6. It should contain a path like `/menu-images/1234567890_image.jpg`

## Notes

- Images are stored on the file system, not in Firestore
- Only the image path/URL is stored in Firestore
- For production, consider using Firebase Storage or a CDN instead of local file storage
- The `public/menu-images/` folder needs to exist (created automatically on first upload)
