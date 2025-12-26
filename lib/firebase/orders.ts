import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  updateDoc, 
  query, 
  orderBy,
  where,
  Timestamp,
  getDoc,
  setDoc,
} from "firebase/firestore";
import { db } from "./config";
import { Order } from "@/types/menu";

const ORDERS_COLLECTION = "orders";

/**
 * Generate a short, user-friendly order ID
 * Format: STARZ-XXXX where XXXX is a random alphanumeric string
 */
function generateOrderId(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Exclude confusing chars like 0, O, I, 1
  const length = 6; // 6 characters = 1,073,741,824 possible combinations
  let orderId = 'STARZ-';
  
  for (let i = 0; i < length; i++) {
    orderId += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  
  return orderId;
}

export async function createOrder(orderData: Omit<Order, "id" | "createdAt">): Promise<string> {
  try {
    // Generate a short, user-friendly order ID
    let orderId = generateOrderId();
    
    // Check if order ID already exists (very unlikely but check anyway)
    let attempts = 0;
    while (attempts < 5) {
      const orderDoc = await getDoc(doc(db, ORDERS_COLLECTION, orderId));
      if (!orderDoc.exists()) {
        break; // ID is unique, use it
      }
      orderId = generateOrderId(); // Generate new ID if collision
      attempts++;
    }
    
    // Create document with custom ID
    await setDoc(doc(db, ORDERS_COLLECTION, orderId), {
      ...orderData,
      createdAt: Timestamp.now(),
      status: "pending",
    });
    
    return orderId;
  } catch (error) {
    console.error("Error creating order:", error);
    throw new Error("Failed to create order");
  }
}

export async function getOrder(orderId: string): Promise<Order | null> {
  try {
    const docRef = doc(db, ORDERS_COLLECTION, orderId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        ...data,
        createdAt: data.createdAt?.toDate() || new Date(),
      } as Order;
    }
    return null;
  } catch (error) {
    console.error("Error getting order:", error);
    throw new Error("Failed to get order");
  }
}

export async function getAllOrders(): Promise<Order[]> {
  try {
    const q = query(
      collection(db, ORDERS_COLLECTION),
      orderBy("createdAt", "desc")
    );
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date(),
    })) as Order[];
  } catch (error) {
    console.error("Error getting orders:", error);
    throw new Error("Failed to get orders");
  }
}

export async function getOrdersByStatus(status: Order["status"]): Promise<Order[]> {
  try {
    const q = query(
      collection(db, ORDERS_COLLECTION),
      where("status", "==", status),
      orderBy("createdAt", "desc")
    );
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date(),
    })) as Order[];
  } catch (error) {
    console.error("Error getting orders by status:", error);
    throw new Error("Failed to get orders by status");
  }
}

export async function updateOrderStatus(
  orderId: string,
  status: Order["status"]
): Promise<void> {
  try {
    const orderRef = doc(db, ORDERS_COLLECTION, orderId);
    await updateDoc(orderRef, {
      status,
      updatedAt: Timestamp.now(),
    });
  } catch (error) {
    console.error("Error updating order status:", error);
    throw new Error("Failed to update order status");
  }
}

export async function updateOrderPayment(
  orderId: string,
  paymentData: {
    paymentStatus?: string;
    transactionId?: string;
  }
): Promise<void> {
  try {
    const orderRef = doc(db, ORDERS_COLLECTION, orderId);
    await updateDoc(orderRef, {
      ...paymentData,
      updatedAt: Timestamp.now(),
    });
  } catch (error) {
    console.error("Error updating order payment:", error);
    throw new Error("Failed to update order payment");
  }
}

