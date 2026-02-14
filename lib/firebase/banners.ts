import {
  collection,
  doc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  onSnapshot,
  Timestamp,
  writeBatch,
} from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import type { Banner } from "@/types/banner";

const COLLECTION = "banners";

export async function getBanners(): Promise<Banner[]> {
  const q = query(
    collection(db, COLLECTION),
    orderBy("order", "asc")
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => {
    const data = d.data();
    return {
      id: d.id,
      type: (data.type as Banner["type"]) || "image",
      url: data.url || "",
      title: data.title || "",
      subtitle: data.subtitle || "",
      order: data.order ?? 0,
    };
  });
}

export function subscribeToBanners(callback: (banners: Banner[]) => void): () => void {
  const q = query(
    collection(db, COLLECTION),
    orderBy("order", "asc")
  );
  const unsubscribe = onSnapshot(q, (snapshot) => {
    const banners: Banner[] = snapshot.docs.map((d) => {
      const data = d.data();
      return {
        id: d.id,
        type: (data.type as Banner["type"]) || "image",
        url: data.url || "",
        title: data.title || "",
        subtitle: data.subtitle || "",
        order: data.order ?? 0,
      };
    });
    callback(banners);
  });
  return unsubscribe;
}

export async function createBanner(data: Omit<Banner, "id">): Promise<string> {
  const docRef = await addDoc(collection(db, COLLECTION), {
    type: data.type,
    url: data.url,
    title: data.title,
    subtitle: data.subtitle ?? "",
    order: data.order,
  });
  return docRef.id;
}

export async function updateBanner(
  id: string,
  data: Partial<Omit<Banner, "id">>
): Promise<void> {
  const ref = doc(db, COLLECTION, id);
  const updateData: Record<string, unknown> = {};
  if (data.type !== undefined) updateData.type = data.type;
  if (data.url !== undefined) updateData.url = data.url;
  if (data.title !== undefined) updateData.title = data.title;
  if (data.subtitle !== undefined) updateData.subtitle = data.subtitle;
  if (data.order !== undefined) updateData.order = data.order;
  await updateDoc(ref, updateData);
}

export async function deleteBanner(id: string): Promise<void> {
  await deleteDoc(doc(db, COLLECTION, id));
}

export async function reorderBanners(orderedIds: string[]): Promise<void> {
  const batch = writeBatch(db);
  orderedIds.forEach((id, index) => {
    const ref = doc(db, COLLECTION, id);
    batch.update(ref, { order: index });
  });
  await batch.commit();
}
