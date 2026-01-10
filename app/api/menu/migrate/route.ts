import { NextRequest, NextResponse } from "next/server";
import { collection, addDoc, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { menuItems } from "@/lib/menu-data";
import { MenuItem } from "@/types/menu";

// POST - Migrate menu items from static file to Firestore
export async function POST() {
  try {
    const menuRef = collection(db, "menu");
    const existingItems = await getDocs(menuRef);
    const existingIds = new Set(existingItems.docs.map((doc) => doc.id));

    let migrated = 0;
    let skipped = 0;
    let errors = 0;

    for (const item of menuItems) {
      // Skip if item already exists (check by id or name)
      const existingByName = existingItems.docs.find(
        (doc) => doc.data().name === item.name && doc.data().category === item.category
      );

      if (existingByName) {
        skipped++;
        continue;
      }

      try {
        const menuItemData: any = {
          name: item.name,
          description: item.description || "",
          price: item.price,
          category: item.category,
          imageUrl: item.imageUrl || item.image || "",
          options: item.options || [],
          available: item.available !== undefined ? item.available : true,
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        // If item has a custom ID, try to use it (but Firestore will generate if it conflicts)
        if (item.id && !existingIds.has(item.id)) {
          // We can't set custom IDs with addDoc, so we'll let Firestore generate
          // But we'll store the original ID in a field for reference
          menuItemData.originalId = item.id;
        }

        await addDoc(menuRef, menuItemData);
        migrated++;
      } catch (error: any) {
        console.error(`Error migrating item ${item.name}:`, error);
        errors++;
      }
    }

    return NextResponse.json({
      success: true,
      message: `Migration completed: ${migrated} items migrated, ${skipped} skipped, ${errors} errors`,
      stats: {
        migrated,
        skipped,
        errors,
        total: menuItems.length,
      },
    });
  } catch (error: any) {
    console.error("Error migrating menu items:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
