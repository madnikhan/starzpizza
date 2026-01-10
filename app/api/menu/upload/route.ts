import { NextRequest, NextResponse } from "next/server";
import { storage } from "@/lib/firebase/config";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export async function POST(request: NextRequest) {
  console.log("📥 Upload endpoint called");
  
  try {
    // Check if storage is initialized
    if (!storage) {
      console.error("❌ Firebase Storage is not initialized");
      return NextResponse.json(
        { success: false, error: "Firebase Storage is not configured. Please check your environment variables and enable Storage in Firebase Console." },
        { status: 500 }
      );
    }

    console.log("✅ Storage is initialized");
    console.log("📦 Storage bucket:", process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET);

    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { success: false, error: "No file provided" },
        { status: 400 }
      );
    }

    console.log(`📥 Received file: ${file.name}, size: ${file.size} bytes, type: ${file.type}`);

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { success: false, error: "Invalid file type. Only JPEG, PNG, and WebP are allowed." },
        { status: 400 }
      );
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { success: false, error: "File size too large. Maximum size is 5MB." },
        { status: 400 }
      );
    }

    // Generate unique filename
    const timestamp = Date.now();
    const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
    const filename = `menu-images/${timestamp}_${sanitizedName}`;

    console.log(`📤 Preparing to upload to Firebase Storage: ${filename}`);
    console.log(`📦 Storage bucket: ${storage.app.options.storageBucket}`);

    // Convert File to Blob
    const bytes = await file.arrayBuffer();
    const blob = new Blob([bytes], { type: file.type });

    // Upload to Firebase Storage
    const storageRef = ref(storage, filename);
    
    try {
      console.log(`⏳ Uploading bytes to Firebase Storage...`);
      await uploadBytes(storageRef, blob);
      console.log(`✅ Bytes uploaded successfully`);
    } catch (uploadError: any) {
      console.error("❌ Error during uploadBytes:", uploadError);
      console.error("Error code:", uploadError.code);
      console.error("Error message:", uploadError.message);
      
      // Provide helpful error messages
      if (uploadError.code === "storage/unauthorized") {
        return NextResponse.json(
          { success: false, error: "Storage permission denied. Please check Firebase Storage security rules." },
          { status: 403 }
        );
      } else if (uploadError.code === "storage/unknown") {
        return NextResponse.json(
          { success: false, error: "Storage not configured. Please enable Firebase Storage in Firebase Console." },
          { status: 500 }
        );
      }
      throw uploadError;
    }

    // Get public download URL
    let downloadURL: string;
    try {
      console.log(`🔗 Getting download URL...`);
      downloadURL = await getDownloadURL(storageRef);
      console.log(`✅ Got download URL: ${downloadURL}`);
    } catch (urlError: any) {
      console.error("❌ Error getting download URL:", urlError);
      throw urlError;
    }

    return NextResponse.json({
      success: true,
      imageUrl: downloadURL,
      filename: filename.split("/").pop(),
    });
  } catch (error: any) {
    console.error("❌ Error uploading image to Firebase Storage:", error);
    console.error("Error details:", {
      code: error.code,
      message: error.message,
      stack: error.stack,
    });
    
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || "Failed to upload image. Please check Firebase Storage is enabled and configured correctly.",
        details: error.code || "unknown_error"
      },
      { status: 500 }
    );
  }
}
