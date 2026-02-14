import { NextRequest, NextResponse } from "next/server";
import { updateBanner, deleteBanner } from "@/lib/firebase/banners";
import type { Banner } from "@/types/banner";

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    if (!id) {
      return NextResponse.json({ error: "Banner ID required" }, { status: 400 });
    }

    const body = await request.json();
    const updates: Partial<Banner> = {};
    if (body.type !== undefined) {
      if (body.type !== "image" && body.type !== "video") {
        return NextResponse.json({ error: "type must be 'image' or 'video'" }, { status: 400 });
      }
      updates.type = body.type;
    }
    if (body.url !== undefined) updates.url = body.url;
    if (body.title !== undefined) updates.title = body.title;
    if (body.subtitle !== undefined) updates.subtitle = body.subtitle;
    if (typeof body.order === "number") updates.order = body.order;

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ error: "No valid fields to update" }, { status: 400 });
    }

    await updateBanner(id, updates);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error updating banner:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to update banner" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    if (!id) {
      return NextResponse.json({ error: "Banner ID required" }, { status: 400 });
    }

    await deleteBanner(id);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error deleting banner:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to delete banner" },
      { status: 500 }
    );
  }
}
