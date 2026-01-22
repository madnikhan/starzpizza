import { NextRequest, NextResponse } from "next/server";
import { getRestaurantStatus, updateRestaurantStatus } from "@/lib/firebase/restaurant-status";

/**
 * GET - Get current restaurant status
 */
export async function GET() {
  try {
    const status = await getRestaurantStatus();
    return NextResponse.json(status);
  } catch (error) {
    console.error("Error getting restaurant status:", error);
    return NextResponse.json(
      { error: "Failed to get restaurant status" },
      { status: 500 }
    );
  }
}

/**
 * POST/PATCH - Update restaurant status
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { isOpen, message, updatedBy } = body;

    if (typeof isOpen !== "boolean") {
      return NextResponse.json(
        { error: "isOpen must be a boolean" },
        { status: 400 }
      );
    }

    await updateRestaurantStatus(isOpen, message, updatedBy);

    return NextResponse.json({
      success: true,
      message: "Restaurant status updated successfully",
    });
  } catch (error) {
    console.error("Error updating restaurant status:", error);
    return NextResponse.json(
      { error: "Failed to update restaurant status" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  return POST(request); // Same handler
}
