import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import type { MenuItem } from "@/types/menu";

/**
 * Load all menu items from Firestore (for public menu pages).
 * Admin dashboard updates this collection; customer site must read it to show imageUrl etc.
 */
export async function getMenuItemsFromFirestore(): Promise<MenuItem[]> {
  const snapshot = await getDocs(collection(db, "menu"));
  const menuItems: MenuItem[] = [];
  snapshot.forEach((docSnap) => {
    const data = docSnap.data();
    menuItems.push({
      id: docSnap.id,
      name: data.name ?? "",
      description: data.description,
      price: typeof data.price === "number" ? data.price : Number(data.price) || 0,
      category: data.category ?? "",
      image: data.image,
      imageUrl: data.imageUrl ?? "",
      options: Array.isArray(data.options) ? data.options : [],
      available: data.available !== false,
    });
  });

  menuItems.sort((a, b) => {
    if (a.category !== b.category) {
      return a.category.localeCompare(b.category);
    }
    return (a.name || "").localeCompare(b.name || "");
  });

  return menuItems;
}
