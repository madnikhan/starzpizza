import { doc, getDoc, setDoc, onSnapshot, Timestamp } from "firebase/firestore";
import { db } from "./config";

const RESTAURANT_STATUS_DOC = "restaurant_status";

export interface RestaurantStatus {
  isOpen: boolean;
  message?: string; // Optional custom message when closed
  updatedAt: Date;
  updatedBy?: string; // Admin email who updated it
}

/**
 * Get current restaurant status
 */
export async function getRestaurantStatus(): Promise<RestaurantStatus> {
  try {
    const statusDoc = await getDoc(doc(db, RESTAURANT_STATUS_DOC, "current"));
    
    if (statusDoc.exists()) {
      const data = statusDoc.data();
      return {
        isOpen: data.isOpen ?? true,
        message: data.message,
        updatedAt: data.updatedAt?.toDate() || new Date(),
        updatedBy: data.updatedBy,
      };
    }
    
    // Default: restaurant is open
    return {
      isOpen: true,
      updatedAt: new Date(),
    };
  } catch (error) {
    console.error("Error getting restaurant status:", error);
    // Default to open if error
    return {
      isOpen: true,
      updatedAt: new Date(),
    };
  }
}

/**
 * Update restaurant status
 */
export async function updateRestaurantStatus(
  isOpen: boolean,
  message?: string,
  updatedBy?: string
): Promise<void> {
  try {
    await setDoc(
      doc(db, RESTAURANT_STATUS_DOC, "current"),
      {
        isOpen,
        message: message || null,
        updatedAt: Timestamp.now(),
        updatedBy: updatedBy || null,
      },
      { merge: true }
    );
  } catch (error) {
    console.error("Error updating restaurant status:", error);
    throw new Error("Failed to update restaurant status");
  }
}

/**
 * Subscribe to restaurant status changes
 */
export function subscribeToRestaurantStatus(
  callback: (status: RestaurantStatus) => void
): () => void {
  const statusRef = doc(db, RESTAURANT_STATUS_DOC, "current");
  
  const unsubscribe = onSnapshot(statusRef, (snapshot) => {
    if (snapshot.exists()) {
      const data = snapshot.data();
      callback({
        isOpen: data.isOpen ?? true,
        message: data.message,
        updatedAt: data.updatedAt?.toDate() || new Date(),
        updatedBy: data.updatedBy,
      });
    } else {
      // Default to open
      callback({
        isOpen: true,
        updatedAt: new Date(),
      });
    }
  });
  
  return unsubscribe;
}
