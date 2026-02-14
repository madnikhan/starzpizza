import { NextRequest, NextResponse } from "next/server";
import { storage } from "@/lib/firebase/config";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
const ALLOWED_VIDEO_TYPES = ["video/mp4", "video/webm", "video/quicktime"];
const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10MB
const MAX_VIDEO_SIZE = 80 * 1024 * 1024; // 80MB

export async function POST(request: NextRequest) {
  try {
    if (!storage) {
      return NextResponse.json(
        { success: false, error: "Firebase Storage is not configured." },
        { status: 500 }
      );
    }

    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { success: false, error: "No file provided" },
        { status: 400 }
      );
    }

    const isImage = ALLOWED_IMAGE_TYPES.includes(file.type);
    const isVideo = ALLOWED_VIDEO_TYPES.includes(file.type);

    if (!isImage && !isVideo) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Invalid file type. Allowed: images (JPEG, PNG, WebP) or videos (MP4, WebM).",
        },
        { status: 400 }
      );
    }

    const maxSize = isImage ? MAX_IMAGE_SIZE : MAX_VIDEO_SIZE;
    if (file.size > maxSize) {
      return NextResponse.json(
        {
          success: false,
          error: isImage
            ? "Image too large. Maximum size is 10MB."
            : "Video too large. Maximum size is 80MB.",
        },
        { status: 400 }
      );
    }

    const timestamp = Date.now();
    const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
    const folder = isImage ? "banner-images" : "banner-videos";
    const filename = `${folder}/${timestamp}_${sanitizedName}`;

    const bytes = await file.arrayBuffer();
    const blob = new Blob([bytes], { type: file.type });
    const storageRef = ref(storage, filename);

    await uploadBytes(storageRef, blob);
    const downloadURL = await getDownloadURL(storageRef);

    return NextResponse.json({
      success: true,
      url: downloadURL,
      type: isImage ? "image" : "video",
      filename: filename.split("/").pop(),
    });
  } catch (error: any) {
    console.error("Banner upload error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error?.message || "Failed to upload file.",
      },
      { status: 500 }
    );
  }
}
