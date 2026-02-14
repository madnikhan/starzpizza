import { NextRequest, NextResponse } from "next/server";
import { reorderBanners } from "@/lib/firebase/banners";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { orderedIds } = body as { orderedIds?: string[] };

    if (!Array.isArray(orderedIds) || orderedIds.length === 0) {
      return NextResponse.json(
        { error: "orderedIds must be a non-empty array of banner IDs" },
        { status: 400 }
      );
    }

    await reorderBanners(orderedIds);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error reordering banners:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to reorder banners" },
      { status: 500 }
    );
  }
}
