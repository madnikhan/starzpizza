import { NextRequest, NextResponse } from "next/server";
import { collection, addDoc, getDocs, deleteDoc, doc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { menuItems } from "@/lib/menu-data";
import { MenuItem } from "@/types/menu";

// POST - Migrate menu items from static file to Firestore
export async function POST(request: NextRequest) {
  try {
    const { replace } = await request.json().catch(() => ({}));
    const menuRef = collection(db, "menu");
    const existingItems = await getDocs(menuRef);

    let migrated = 0;
    let updated = 0;
    let skipped = 0;
    let deleted = 0;
    let errors = 0;

    // If replace=true, delete all existing items first
    if (replace) {
      for (const docSnapshot of existingItems.docs) {
        try {
          await deleteDoc(doc(db, "menu", docSnapshot.id));
          deleted++;
        } catch (error: any) {
          console.error(`Error deleting item ${docSnapshot.id}:`, error);
        }
      }
    }

    // Get fresh list after deletion (if replace was true)
    const currentItems = replace ? { docs: [] } : await getDocs(menuRef);
    const existingByName = new Map<string, string>();
    currentItems.docs.forEach((doc) => {
      const data = doc.data();
      const key = `${data.name}|${data.category}`;
      existingByName.set(key, doc.id);
    });

    for (const item of menuItems) {
      const key = `${item.name}|${item.category}`;
      const existingDocId = existingByName.get(key);

      try {
        const menuItemData: any = {
          name: item.name,
          description: item.description || "",
          price: item.price,
          category: item.category,
          imageUrl: item.imageUrl || item.image || "",
          options: item.options || [],
          available: item.available !== undefined ? item.available : true,
          updatedAt: new Date(),
        };

        if (existingDocId) {
          // Update existing item
          if (replace) {
            // If replacing, add it as new
            menuItemData.createdAt = new Date();
            await addDoc(menuRef, menuItemData);
            migrated++;
          } else {
            // Otherwise, update existing
            const existingDoc = doc(db, "menu", existingDocId);
            await setDoc(existingDoc, menuItemData, { merge: true });
            updated++;
          }
        } else {
          // Add new item
          menuItemData.createdAt = new Date();
          if (item.id) {
            menuItemData.originalId = item.id;
          }
          await addDoc(menuRef, menuItemData);
          migrated++;
        }
      } catch (error: any) {
        console.error(`Error migrating item ${item.name}:`, error);
        errors++;
      }
    }

    return NextResponse.json({
      success: true,
      message: replace
        ? `Replacement completed: ${deleted} deleted, ${migrated} items added, ${errors} errors`
        : `Migration completed: ${migrated} new items, ${updated} updated, ${skipped} skipped, ${errors} errors`,
      stats: {
        deleted: replace ? deleted : 0,
        migrated,
        updated,
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
