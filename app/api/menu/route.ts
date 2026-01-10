import { NextRequest, NextResponse } from "next/server";
import { collection, getDocs, addDoc, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { MenuItem } from "@/types/menu";

// GET - Fetch all menu items
export async function GET() {
  try {
    const menuRef = collection(db, "menu");
    const snapshot = await getDocs(menuRef);
    
    const menuItems: MenuItem[] = [];
    snapshot.forEach((doc) => {
      const data = doc.data();
      menuItems.push({
        id: doc.id,
        ...data,
      } as MenuItem);
    });

    // Sort in memory by category, then by name (no index required)
    menuItems.sort((a, b) => {
      if (a.category !== b.category) {
        return a.category.localeCompare(b.category);
      }
      return (a.name || "").localeCompare(b.name || "");
    });

    return NextResponse.json({ success: true, items: menuItems });
  } catch (error: any) {
    console.error("Error fetching menu items:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// POST - Create a new menu item
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, description, price, category, imageUrl, options, available } = body;

    // Validation
    if (!name || !price || !category) {
      return NextResponse.json(
        { success: false, error: "Name, price, and category are required" },
        { status: 400 }
      );
    }

    if (typeof price !== "number" || price < 0) {
      return NextResponse.json(
        { success: false, error: "Price must be a positive number" },
        { status: 400 }
      );
    }

    const menuRef = collection(db, "menu");
    const newItem = {
      name,
      description: description || "",
      price,
      category,
      imageUrl: imageUrl || "",
      options: options || [],
      available: available !== undefined ? available : true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    console.log(`📝 Creating menu item: ${name}`);
    console.log(`🖼️ Image URL: ${imageUrl || "(none)"}`);

    const docRef = await addDoc(menuRef, newItem);
    
    console.log(`✅ Menu item created with ID: ${docRef.id}`);

    return NextResponse.json({
      success: true,
      id: docRef.id,
      item: { id: docRef.id, ...newItem },
    });
  } catch (error: any) {
    console.error("Error creating menu item:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
