import { NextRequest, NextResponse } from "next/server";
import { doc, getDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { MenuItem } from "@/types/menu";

// GET - Fetch a single menu item
export async function GET(
  request: NextRequest,
  { params }: { params: { itemId: string } }
) {
  try {
    const { itemId } = params;
    const menuRef = doc(db, "menu", itemId);
    const snapshot = await getDoc(menuRef);

    if (!snapshot.exists()) {
      return NextResponse.json(
        { success: false, error: "Menu item not found" },
        { status: 404 }
      );
    }

    const data = snapshot.data();
    return NextResponse.json({
      success: true,
      item: { id: snapshot.id, ...data } as MenuItem,
    });
  } catch (error: any) {
    console.error("Error fetching menu item:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// PATCH - Update a menu item
export async function PATCH(
  request: NextRequest,
  { params }: { params: { itemId: string } }
) {
  try {
    const { itemId } = params;
    const body = await request.json();
    const { name, description, price, category, imageUrl, options, available } = body;

    const menuRef = doc(db, "menu", itemId);
    const snapshot = await getDoc(menuRef);

    if (!snapshot.exists()) {
      return NextResponse.json(
        { success: false, error: "Menu item not found" },
        { status: 404 }
      );
    }

    const updateData: any = {
      updatedAt: new Date(),
    };

    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (price !== undefined) {
      if (typeof price !== "number" || price < 0) {
        return NextResponse.json(
          { success: false, error: "Price must be a positive number" },
          { status: 400 }
        );
      }
      updateData.price = price;
    }
    if (category !== undefined) updateData.category = category;
    if (imageUrl !== undefined) {
      updateData.imageUrl = imageUrl;
      console.log(`🖼️ Updating imageUrl for item ${itemId}: ${imageUrl}`);
    }
    if (options !== undefined) updateData.options = options;
    if (available !== undefined) updateData.available = available;

    await updateDoc(menuRef, updateData);

    const updatedSnapshot = await getDoc(menuRef);
    const data = updatedSnapshot.data();

    return NextResponse.json({
      success: true,
      item: { id: updatedSnapshot.id, ...data } as MenuItem,
    });
  } catch (error: any) {
    console.error("Error updating menu item:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// DELETE - Delete a menu item
export async function DELETE(
  request: NextRequest,
  { params }: { params: { itemId: string } }
) {
  try {
    const { itemId } = params;
    const menuRef = doc(db, "menu", itemId);
    const snapshot = await getDoc(menuRef);

    if (!snapshot.exists()) {
      return NextResponse.json(
        { success: false, error: "Menu item not found" },
        { status: 404 }
      );
    }

    await deleteDoc(menuRef);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error deleting menu item:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
