import { NextRequest, NextResponse } from "next/server";
import { getBanners, createBanner } from "@/lib/firebase/banners";
import type { Banner } from "@/types/banner";

export async function GET() {
  try {
    const banners = await getBanners();
    return NextResponse.json(banners);
  } catch (error: any) {
    console.error("Error fetching banners:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to fetch banners" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, url, title, subtitle, order } = body as Partial<Banner>;

    if (!type || !url || title === undefined) {
      return NextResponse.json(
        { error: "type, url, and title are required" },
        { status: 400 }
      );
    }

    if (type !== "image" && type !== "video") {
      return NextResponse.json(
        { error: "type must be 'image' or 'video'" },
        { status: 400 }
      );
    }

    const id = await createBanner({
      type,
      url,
      title: String(title),
      subtitle: subtitle != null ? String(subtitle) : "",
      order: typeof order === "number" ? order : 0,
    });

    return NextResponse.json({ id, success: true });
  } catch (error: any) {
    console.error("Error creating banner:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to create banner" },
      { status: 500 }
    );
  }
}
