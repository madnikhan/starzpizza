"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { collection, query, orderBy, onSnapshot, Timestamp, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { Order, CartItem, OrderType, PaymentMethod } from "@/types/menu";
import { isAuthenticated, logout, getCurrentUser } from "@/lib/auth";
import { useRestaurantStatus } from "@/hooks/useRestaurantStatus";
import { 
  CheckCircle2, 
  Clock, 
  UtensilsCrossed, 
  Package, 
  XCircle,
  Bell,
  BellOff,
  Phone,
  MapPin,
  CreditCard,
  Banknote,
  Truck,
  ShoppingBag,
  Home,
  Edit,
  Trash2,
  X,
  Save,
  LogOut,
  User,
  Utensils,
  Building2,
  Lock,
  Image as ImageIcon
} from "lucide-react";
import Link from "next/link";

// Shared AudioContext for notifications (initialized on user interaction)
let sharedAudioContext: AudioContext | null = null;

// Initialize audio context on user interaction (required by browsers)
function initAudioContext() {
  if (!sharedAudioContext) {
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      sharedAudioContext = new AudioContext();
      
      // Resume if suspended
      if (sharedAudioContext.state === "suspended") {
        sharedAudioContext.resume().catch(err => {
          console.error("Failed to resume audio context:", err);
        });
      }
    } catch (error) {
      console.error("Failed to create audio context:", error);
    }
  }
  return sharedAudioContext;
}

// Notification sound using Web Audio API (like Just Eat)
function playNotificationSound() {
  try {
    const audioContext = initAudioContext();
    if (!audioContext) {
      console.warn("Audio context not available");
      return;
    }

    // Resume audio context if suspended (browser autoplay policy)
    if (audioContext.state === "suspended") {
      audioContext.resume().then(() => {
        playBeepSound(audioContext);
      }).catch(err => {
        console.error("Failed to resume audio context:", err);
      });
    } else {
      playBeepSound(audioContext);
    }
  } catch (error) {
    console.error("Error playing notification sound:", error);
  }
}

function playBeepSound(audioContext: AudioContext) {
  try {
    // Create a more noticeable beep sound
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    // Higher frequency for better noticeability
    oscillator.frequency.value = 800;
    oscillator.type = "sine";

    // Louder volume (0.5 instead of 0.3)
    gainNode.gain.setValueAtTime(0.5, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.3);

    // Second beep after a short delay
    setTimeout(() => {
      try {
        const oscillator2 = audioContext.createOscillator();
        const gainNode2 = audioContext.createGain();

        oscillator2.connect(gainNode2);
        gainNode2.connect(audioContext.destination);

        oscillator2.frequency.value = 1000;
        oscillator2.type = "sine";

        gainNode2.gain.setValueAtTime(0.5, audioContext.currentTime);
        gainNode2.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);

        oscillator2.start(audioContext.currentTime);
        oscillator2.stop(audioContext.currentTime + 0.3);
      } catch (e) {
        console.error("Error playing second beep:", e);
      }
    }, 200);
  } catch (error) {
    console.error("Error creating beep sound:", error);
  }
}

// Start looping notification for an order
function startNotificationLoop(orderId: string, intervalRefs: Map<string, NodeJS.Timeout>) {
  // Don't start if already playing
  if (intervalRefs.has(orderId)) {
    return;
  }

  // Play immediately
  playNotificationSound();

  // Then play every 3 seconds
  const intervalId = setInterval(() => {
    playNotificationSound();
  }, 3000);

  intervalRefs.set(orderId, intervalId);
}

// Stop notification loop for an order
function stopNotificationLoop(orderId: string, intervalRefs: Map<string, NodeJS.Timeout>) {
  const intervalId = intervalRefs.get(orderId);
  if (intervalId) {
    clearInterval(intervalId);
    intervalRefs.delete(orderId);
  }
}

// Stop all notification loops
function stopAllNotificationLoops(intervalRefs: Map<string, NodeJS.Timeout>) {
  intervalRefs.forEach((intervalId) => {
    clearInterval(intervalId);
  });
  intervalRefs.clear();
}

function getStatusIcon(status: Order["status"]) {
  switch (status) {
    case "pending":
      return <Clock className="w-5 h-5 text-yellow-500" />;
    case "confirmed":
      return <CheckCircle2 className="w-5 h-5 text-blue-500" />;
    case "preparing":
      return <UtensilsCrossed className="w-5 h-5 text-orange-500" />;
    case "ready":
      return <Package className="w-5 h-5 text-green-500" />;
    case "completed":
      return <CheckCircle2 className="w-5 h-5 text-green-600" />;
    case "cancelled":
      return <XCircle className="w-5 h-5 text-red-500" />;
    default:
      return <Clock className="w-5 h-5 text-gray-500" />;
  }
}

function getStatusColor(status: Order["status"]) {
  switch (status) {
    case "pending":
      return "bg-yellow-100 text-yellow-800 border-yellow-300";
    case "confirmed":
      return "bg-blue-100 text-blue-800 border-blue-300";
    case "preparing":
      return "bg-orange-100 text-orange-800 border-orange-300";
    case "ready":
      return "bg-green-100 text-green-800 border-green-300";
    case "completed":
      return "bg-gray-100 text-gray-800 border-gray-300";
    case "cancelled":
      return "bg-red-100 text-red-800 border-red-300";
    default:
      return "bg-gray-100 text-gray-800 border-gray-300";
  }
}

function formatTime(date: Date) {
  return new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    day: "2-digit",
    month: "short",
  }).format(date);
}

function isToday(date: Date) {
  const now = new Date();
  return (
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear()
  );
}

type TabType = "all" | "pending" | "confirmed" | "preparing" | "ready" | "completed" | "history";

export default function AdminDashboard() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [pendingOrders, setPendingOrders] = useState<Order[]>([]);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [processingOrder, setProcessingOrder] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>("all");
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [isAuthChecked, setIsAuthChecked] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const processedOrdersRef = useRef<Set<string>>(new Set());
  const notificationIntervalsRef = useRef<Map<string, NodeJS.Timeout>>(new Map());
  const hasRunHistoryCleanupRef = useRef(false);
  
  // Get restaurant status
  const { status: restaurantStatus } = useRestaurantStatus();

  // Check authentication on mount
  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/admin/login");
    } else {
      setIsAuthChecked(true);
      // Initialize audio context on page load (after user has interacted with login)
      initAudioContext();
    }
  }, [router]);

  // Initialize audio on any user interaction (click, keypress, etc.)
  useEffect(() => {
    const handleUserInteraction = () => {
      initAudioContext();
    };

    // Listen for user interactions to initialize audio
    window.addEventListener("click", handleUserInteraction, { once: true });
    window.addEventListener("keydown", handleUserInteraction, { once: true });
    window.addEventListener("touchstart", handleUserInteraction, { once: true });

    return () => {
      window.removeEventListener("click", handleUserInteraction);
      window.removeEventListener("keydown", handleUserInteraction);
      window.removeEventListener("touchstart", handleUserInteraction);
    };
  }, []);

  useEffect(() => {
    const ordersQuery = query(
      collection(db, "orders"),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(ordersQuery, (snapshot) => {
      const ordersList: Order[] = [];
      const pendingList: Order[] = [];
      const currentNotifyingOrderIds = new Set<string>(); // Track orders that should have notifications

      snapshot.forEach((doc) => {
        const data = doc.data();
        const order: Order = {
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate() || new Date(),
        } as Order;

        ordersList.push(order);

        // Track orders that need notifications: pending and confirmed (but not preparing or beyond)
        if (order.status === "pending" || order.status === "confirmed") {
          currentNotifyingOrderIds.add(order.id);
          
          if (order.status === "pending") {
            pendingList.push(order);
          }

          // Start notification loop for orders that need notifications
          if (soundEnabled && !notificationIntervalsRef.current.has(order.id)) {
            startNotificationLoop(order.id, notificationIntervalsRef.current);
          }
        } else {
          // Stop notification if order status is preparing or beyond
          if (notificationIntervalsRef.current.has(order.id)) {
            stopNotificationLoop(order.id, notificationIntervalsRef.current);
          }
        }

        // Track processed orders for initial notification
        if (order.status === "pending" && !processedOrdersRef.current.has(order.id)) {
          processedOrdersRef.current.add(order.id);
        }
      });

      // Stop notifications for orders that are no longer pending/confirmed (deleted or status changed)
      notificationIntervalsRef.current.forEach((intervalId, orderId) => {
        if (!currentNotifyingOrderIds.has(orderId)) {
          stopNotificationLoop(orderId, notificationIntervalsRef.current);
        }
      });

      setOrders(ordersList);
      setPendingOrders(ordersList.filter((o) => o.status === "pending"));
    });

    return () => {
      unsubscribe();
      // Clean up all intervals on unmount
      stopAllNotificationLoops(notificationIntervalsRef.current);
    };
  }, [soundEnabled]);

  const updateOrderStatus = async (orderId: string, newStatus: Order["status"]) => {
    // Stop notification immediately when "Start Preparing" is clicked (status becomes "preparing")
    if (newStatus === "preparing") {
      stopNotificationLoop(orderId, notificationIntervalsRef.current);
    }
    
    try {
      setProcessingOrder(orderId);
      const orderRef = doc(db, "orders", orderId);
      await updateDoc(orderRef, {
        status: newStatus,
        updatedAt: Timestamp.now(),
      });

      // Also stop notification for other status changes (ready, completed, cancelled)
      if (newStatus === "ready" || newStatus === "completed" || newStatus === "cancelled") {
        stopNotificationLoop(orderId, notificationIntervalsRef.current);
      }
      // Note: Notifications continue for "pending" and "confirmed" statuses
    } catch (error) {
      console.error("Error updating order status:", error);
      alert("Failed to update order status. Please try again.");
    } finally {
      setProcessingOrder(null);
    }
  };

  const deleteOrder = async (orderId: string) => {
    try {
      setProcessingOrder(orderId);
      const orderRef = doc(db, "orders", orderId);
      await deleteDoc(orderRef);
      setShowDeleteConfirm(null);
    } catch (error) {
      console.error("Error deleting order:", error);
      alert("Failed to delete order. Please try again.");
    } finally {
      setProcessingOrder(null);
    }
  };

  const updateOrder = async (orderData: Order) => {
    try {
      setProcessingOrder(orderData.id);
      const orderRef = doc(db, "orders", orderData.id);
      
      // Recalculate totals
      const subtotal = orderData.items.reduce((sum, item) => {
        return sum + (item.price * item.quantity);
      }, 0);
      
      const total = subtotal + (orderData.deliveryFee || 0);

      await updateDoc(orderRef, {
        items: orderData.items,
        customerInfo: orderData.customerInfo,
        orderType: orderData.orderType,
        paymentMethod: orderData.paymentMethod,
        subtotal,
        total,
        deliveryFee: orderData.deliveryFee || 0,
        updatedAt: Timestamp.now(),
      });

      setEditingOrder(null);
    } catch (error) {
      console.error("Error updating order:", error);
      alert("Failed to update order. Please try again.");
    } finally {
      setProcessingOrder(null);
    }
  };

  const manuallyConfirmPayment = async (orderId: string) => {
    if (!confirm("Are you sure the payment was successful on SumUp? This will confirm the order and mark payment as paid.")) {
      return;
    }

    try {
      setProcessingOrder(orderId);
      const orderRef = doc(db, "orders", orderId);
      await updateDoc(orderRef, {
        status: "confirmed",
        paymentStatus: "paid",
        updatedAt: Timestamp.now(),
      });
      
      // Don't stop notification - it should continue until "Start Preparing" is clicked
      // The notification will continue because status is "confirmed"
      
      alert("Payment confirmed successfully! Order status updated.");
    } catch (error) {
      console.error("Error confirming payment:", error);
      alert("Failed to confirm payment. Please try again.");
    } finally {
      setProcessingOrder(null);
    }
  };

  const getNextStatus = (currentStatus: Order["status"]): Order["status"] | null => {
    switch (currentStatus) {
      case "pending":
        return "confirmed";
      case "confirmed":
        return "preparing";
      case "preparing":
        return "ready";
      case "ready":
        return "completed";
      default:
        return null;
    }
  };

  const getStatusButtonText = (status: Order["status"]) => {
    switch (status) {
      case "pending":
        return "Accept Order";
      case "confirmed":
        return "Start Preparing";
      case "preparing":
        return "Mark as Ready";
      case "ready":
        return "Complete Order";
      default:
        return "Update Status";
    }
  };

  const todayOrders = orders.filter((order) => isToday(order.createdAt));
  const orderHistory = orders.filter((order) => !isToday(order.createdAt));

  const getFilteredOrders = () => {
    if (activeTab === "history") {
      return orderHistory;
    }
    if (activeTab === "all") {
      return todayOrders;
    }
    return todayOrders.filter((o) => o.status === activeTab);
  };

  const filteredOrders = getFilteredOrders();

  const toggleRestaurantStatus = async () => {
    if (updatingStatus) return;
    
    setUpdatingStatus(true);
    try {
      const newStatus = !restaurantStatus.isOpen;
      const response = await fetch("/api/restaurant-status", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          isOpen: newStatus,
          updatedBy: getCurrentUser()?.email || "admin",
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update restaurant status");
      }

      alert(`Restaurant is now ${newStatus ? "OPEN" : "CLOSED"}`);
    } catch (error) {
      console.error("Error updating restaurant status:", error);
      alert("Failed to update restaurant status. Please try again.");
    } finally {
      setUpdatingStatus(false);
    }
  };

  const tabs: { id: TabType; label: string; count: number }[] = [
    { id: "all", label: "All Orders", count: todayOrders.length },
    { id: "pending", label: "Pending", count: todayOrders.filter((o) => o.status === "pending").length },
    { id: "confirmed", label: "Confirmed", count: todayOrders.filter((o) => o.status === "confirmed").length },
    { id: "preparing", label: "Preparing", count: todayOrders.filter((o) => o.status === "preparing").length },
    { id: "ready", label: "Ready", count: todayOrders.filter((o) => o.status === "ready").length },
    { id: "completed", label: "Completed", count: todayOrders.filter((o) => o.status === "completed").length },
    { id: "history", label: "Order History", count: orderHistory.length },
  ];

  // Auto-delete order history older than 30 days (runs once per dashboard load)
  useEffect(() => {
    if (!orders.length || hasRunHistoryCleanupRef.current) return;
    hasRunHistoryCleanupRef.current = true;

    const cleanupOldHistory = async () => {
      try {
        const cutoff = new Date();
        cutoff.setDate(cutoff.getDate() - 30);

        const oldHistory = orders.filter((order) => order.createdAt < cutoff);
        if (oldHistory.length === 0) return;

        await Promise.all(
          oldHistory.map((order) => deleteDoc(doc(db, "orders", order.id)))
        );
        console.log(`Deleted ${oldHistory.length} order history records older than 30 days.`);
      } catch (error) {
        console.error("Failed to delete old order history:", error);
      }
    };

    cleanupOldHistory();
  }, [orders]);

  // Show loading while checking auth
  if (!isAuthChecked) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Checking authentication...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-primary text-white shadow-lg sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Admin Dashboard</h1>
              <p className="text-sm text-yellow-200">Order Management</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-yellow-200 text-sm">
                <User className="w-4 h-4" />
                {getCurrentUser()?.email || "Admin"}
              </div>
              <button
                onClick={toggleRestaurantStatus}
                disabled={updatingStatus}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition disabled:opacity-50 ${
                  restaurantStatus.isOpen
                    ? "bg-green-600 text-white hover:bg-green-700"
                    : "bg-red-600 text-white hover:bg-red-700"
                }`}
                title={restaurantStatus.isOpen ? "Click to close restaurant" : "Click to open restaurant"}
              >
                {restaurantStatus.isOpen ? (
                  <>
                    <Building2 className="w-5 h-5" />
                    Restaurant Open
                  </>
                ) : (
                  <>
                    <Lock className="w-5 h-5" />
                    Restaurant Closed
                  </>
                )}
              </button>
              <button
                onClick={() => {
                  // Initialize audio on click (user interaction)
                  initAudioContext();
                  
                  // Test sound when toggling
                  if (soundEnabled) {
                    playNotificationSound();
                  }
                  
                  const newSoundEnabled = !soundEnabled;
                  setSoundEnabled(newSoundEnabled);
                  
                  if (!newSoundEnabled) {
                    // Stop all notifications when sound is disabled
                    stopAllNotificationLoops(notificationIntervalsRef.current);
                  } else {
                    // Restart notifications for pending and confirmed orders when sound is enabled
                    const notifyingOrders = orders.filter((o) => o.status === "pending" || o.status === "confirmed");
                    notifyingOrders.forEach((order) => {
                      if (!notificationIntervalsRef.current.has(order.id)) {
                        startNotificationLoop(order.id, notificationIntervalsRef.current);
                      }
                    });
                  }
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition ${
                  soundEnabled
                    ? "bg-yellow-500 text-primary hover:bg-yellow-400"
                    : "bg-gray-600 hover:bg-gray-500"
                }`}
              >
                {soundEnabled ? (
                  <>
                    <Bell className="w-5 h-5" />
                    Sound On
                  </>
                ) : (
                  <>
                    <BellOff className="w-5 h-5" />
                    Sound Off
                  </>
                )}
              </button>
              <button
                onClick={() => {
                  initAudioContext();
                  playNotificationSound();
                }}
                className="flex items-center gap-2 px-4 py-2 rounded-lg font-semibold bg-green-600 text-white hover:bg-green-700 transition"
                title="Test notification sound"
              >
                <Bell className="w-5 h-5" />
                Test Sound
              </button>
              <button
                onClick={() => {
                  logout();
                  router.push("/admin/login");
                }}
                className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-700 transition"
              >
                <LogOut className="w-5 h-5" />
                Logout
              </button>
              <Link
                href="/admin/menu"
                className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-purple-700 transition"
              >
                <Utensils className="w-5 h-5" />
                Manage Menu
              </Link>
              <Link
                href="/admin/banners"
                className="flex items-center gap-2 bg-amber-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-amber-700 transition"
              >
                <ImageIcon className="w-5 h-5" />
                Manage Banners
              </Link>
              <Link
                href="/"
                className="flex items-center gap-2 bg-white text-primary px-4 py-2 rounded-lg font-semibold hover:bg-gray-100 transition"
              >
                <Home className="w-5 h-5" />
                Back to Site
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-5 h-5 text-yellow-600" />
                <span className="font-semibold text-yellow-800">Pending</span>
              </div>
              <p className="text-3xl font-bold text-yellow-900">{pendingOrders.length}</p>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle2 className="w-5 h-5 text-blue-600" />
                <span className="font-semibold text-blue-800">Confirmed</span>
              </div>
              <p className="text-3xl font-bold text-blue-900">
                {orders.filter((o) => o.status === "confirmed").length}
              </p>
            </div>
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <UtensilsCrossed className="w-5 h-5 text-orange-600" />
                <span className="font-semibold text-orange-800">Preparing</span>
              </div>
              <p className="text-3xl font-bold text-orange-900">
                {orders.filter((o) => o.status === "preparing").length}
              </p>
            </div>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Package className="w-5 h-5 text-green-600" />
                <span className="font-semibold text-green-800">Ready</span>
              </div>
              <p className="text-3xl font-bold text-green-900">
                {orders.filter((o) => o.status === "ready").length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b sticky top-[140px] z-40">
        <div className="container mx-auto px-4">
          <div className="flex gap-2 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-3 font-semibold transition whitespace-nowrap border-b-2 ${
                  activeTab === tab.id
                    ? "border-primary text-primary"
                    : "border-transparent text-gray-600 hover:text-gray-800"
                }`}
              >
                {tab.label}
                {tab.count > 0 && (
                  <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                    activeTab === tab.id
                      ? "bg-primary text-white"
                      : "bg-gray-200 text-gray-700"
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Orders List */}
      <div className="container mx-auto px-4 py-8">
        {filteredOrders.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 text-lg">
              {activeTab === "history" ? "No order history found" : "No orders found"}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                onStatusUpdate={updateOrderStatus}
                onDelete={deleteOrder}
                onEdit={setEditingOrder}
                onManualPaymentConfirm={manuallyConfirmPayment}
                processingOrder={processingOrder}
                getNextStatus={getNextStatus}
                getStatusButtonText={getStatusButtonText}
                showDeleteConfirm={showDeleteConfirm}
                setShowDeleteConfirm={setShowDeleteConfirm}
              />
            ))}
          </div>
        )}
      </div>

      {/* Edit Order Modal */}
      {editingOrder && (
        <EditOrderModal
          order={editingOrder}
          onClose={() => setEditingOrder(null)}
          onSave={updateOrder}
          isProcessing={processingOrder === editingOrder.id}
        />
      )}
    </div>
  );
}

interface OrderCardProps {
  order: Order;
  onStatusUpdate: (orderId: string, status: Order["status"]) => Promise<void>;
  onDelete: (orderId: string) => Promise<void>;
  onEdit: (order: Order) => void;
  onManualPaymentConfirm: (orderId: string) => Promise<void>;
  processingOrder: string | null;
  getNextStatus: (status: Order["status"]) => Order["status"] | null;
  getStatusButtonText: (status: Order["status"]) => string;
  showDeleteConfirm: string | null;
  setShowDeleteConfirm: (orderId: string | null) => void;
}

function OrderCard({
  order,
  onStatusUpdate,
  onDelete,
  onEdit,
  onManualPaymentConfirm,
  processingOrder,
  getNextStatus,
  getStatusButtonText,
  showDeleteConfirm,
  setShowDeleteConfirm,
}: OrderCardProps) {
  const nextStatus = getNextStatus(order.status);
  const isProcessing = processingOrder === order.id;

  return (
    <div
      className={`bg-white rounded-lg shadow-md border-2 ${
        order.status === "pending"
          ? "border-yellow-400 animate-pulse"
          : "border-gray-200"
      } transition-all hover:shadow-lg`}
    >
      <div className="p-6">
        {/* Order Header */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h3 className="text-xl font-bold text-gray-800">Order #{order.id}</h3>
              <span
                className={`px-3 py-1 rounded-full text-sm font-semibold border flex items-center gap-2 ${getStatusColor(
                  order.status
                )}`}
              >
                {getStatusIcon(order.status)}
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </span>
            </div>
            <p className="text-sm text-gray-500 flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {formatTime(order.createdAt)}
            </p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-primary">£{order.total.toFixed(2)}</p>
            <p className="text-sm text-gray-500">
              {order.paymentMethod === "card" ? (
                <span className="flex items-center gap-1 justify-end">
                  <CreditCard className="w-4 h-4" />
                  Card Payment
                </span>
              ) : (
                <span className="flex items-center gap-1 justify-end">
                  <Banknote className="w-4 h-4" />
                  Cash Payment
                </span>
              )}
            </p>
          </div>
        </div>

        {/* Customer Info */}
        <div className="bg-gray-50 rounded-lg p-4 mb-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-gray-500" />
              <span className="font-semibold">{order.customerInfo.name}</span>
              <span className="text-gray-600">{order.customerInfo.phone}</span>
            </div>
            <div className="flex items-center gap-2">
              {order.orderType === "delivery" ? (
                <>
                  <Truck className="w-4 h-4 text-gray-500" />
                  <span className="font-semibold">Delivery</span>
                  {order.customerInfo.address && (
                    <span className="text-gray-600 flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {order.customerInfo.address}
                    </span>
                  )}
                </>
              ) : order.orderType === "collection" ? (
                <>
                  <ShoppingBag className="w-4 h-4 text-gray-500" />
                  <span className="font-semibold">Collection</span>
                </>
              ) : (
                <>
                  <Home className="w-4 h-4 text-gray-500" />
                  <span className="font-semibold">Takeaway</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Order Items */}
        <div className="mb-4">
          <h4 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <Package className="w-5 h-5" />
            Order Items ({order.items.length})
          </h4>
          <div className="space-y-2">
            {order.items.map((item, index) => (
              <div
                key={index}
                className="bg-white border border-gray-200 rounded-lg p-3 hover:shadow-md transition"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="bg-primary text-white text-xs font-bold px-2 py-1 rounded">
                        {item.quantity}x
                      </span>
                      <p className="font-semibold text-gray-800">{item.name}</p>
                    </div>
                    {item.selectedOptions && Object.keys(item.selectedOptions).length > 0 && (
                      <div className="ml-6 mt-2 space-y-1">
                        {Object.entries(item.selectedOptions).map(([key, value]) => (
                          <div key={key} className="flex items-center gap-2">
                            <span className="text-xs text-gray-500 font-medium">{key}:</span>
                            <span className="text-sm text-gray-700 bg-gray-50 px-2 py-0.5 rounded">
                              {value}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                    <div className="ml-6 mt-1">
                      <p className="text-xs text-gray-500">
                        £{item.price.toFixed(2)} each
                      </p>
                    </div>
                  </div>
                  <div className="text-right ml-4">
                    <p className="font-bold text-lg text-primary">
                      £{(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order Summary */}
        <div className="border-t pt-4 mb-4">
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-600">Subtotal:</span>
            <span className="font-semibold">£{order.subtotal.toFixed(2)}</span>
          </div>
          {order.deliveryFee && order.deliveryFee > 0 && (
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-600">Delivery Fee:</span>
              <span className="font-semibold">£{order.deliveryFee.toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between text-lg font-bold border-t pt-2 mt-2">
            <span>Total:</span>
            <span className="text-primary">£{order.total.toFixed(2)}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 flex-wrap">
          {nextStatus && (
            <button
              onClick={() => onStatusUpdate(order.id, nextStatus)}
              disabled={isProcessing}
              className={`flex-1 px-4 py-2 rounded-lg font-semibold transition ${
                order.status === "pending"
                  ? "bg-green-600 text-white hover:bg-green-700"
                  : order.status === "confirmed"
                  ? "bg-orange-600 text-white hover:bg-orange-700"
                  : order.status === "preparing"
                  ? "bg-blue-600 text-white hover:bg-blue-700"
                  : "bg-gray-600 text-white hover:bg-gray-700"
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {isProcessing ? "Processing..." : getStatusButtonText(order.status)}
            </button>
          )}
          <button
            onClick={() => onEdit(order)}
            disabled={isProcessing}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <Edit className="w-4 h-4" />
            Edit
          </button>
          {showDeleteConfirm === order.id ? (
            <div className="flex gap-2">
              <button
                onClick={() => onDelete(order.id)}
                disabled={isProcessing}
                className="px-4 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Confirm Delete
              </button>
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-400 transition"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowDeleteConfirm(order.id)}
              disabled={isProcessing}
              className="px-4 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              Delete
            </button>
          )}
          {order.status === "pending" && nextStatus && (
            <button
              onClick={() => onStatusUpdate(order.id, "cancelled")}
              disabled={isProcessing}
              className="px-4 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel Order
            </button>
          )}
          {order.status === "pending" && order.paymentMethod === "card" && (
            <button
              onClick={() => onManualPaymentConfirm(order.id)}
              disabled={isProcessing}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              title="Manually confirm payment if SumUp shows payment was successful but verification failed"
            >
              <CheckCircle2 className="w-4 h-4" />
              Confirm Payment
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

interface EditOrderModalProps {
  order: Order;
  onClose: () => void;
  onSave: (order: Order) => Promise<void>;
  isProcessing: boolean;
}

function EditOrderModal({ order, onSave, onClose, isProcessing }: EditOrderModalProps) {
  const [editedOrder, setEditedOrder] = useState<Order>({ ...order });

  const updateItemQuantity = (index: number, quantity: number) => {
    if (quantity < 1) return;
    const newItems = [...editedOrder.items];
    newItems[index].quantity = quantity;
    setEditedOrder({ ...editedOrder, items: newItems });
  };

  const removeItem = (index: number) => {
    const newItems = editedOrder.items.filter((_, i) => i !== index);
    if (newItems.length === 0) {
      alert("Order must have at least one item");
      return;
    }
    setEditedOrder({ ...editedOrder, items: newItems });
  };

  const updateCustomerInfo = (field: string, value: string) => {
    setEditedOrder({
      ...editedOrder,
      customerInfo: {
        ...editedOrder.customerInfo,
        [field]: value,
      },
    });
  };

  const updateOrderType = (type: OrderType) => {
    setEditedOrder({ ...editedOrder, orderType: type });
  };

  const updatePaymentMethod = (method: PaymentMethod) => {
    setEditedOrder({ ...editedOrder, paymentMethod: method });
  };

  const updateDeliveryFee = (fee: number) => {
    setEditedOrder({ ...editedOrder, deliveryFee: fee });
  };

  const calculateTotals = () => {
    const subtotal = editedOrder.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const total = subtotal + (editedOrder.deliveryFee || 0);
    return { subtotal, total };
  };

  const { subtotal, total } = calculateTotals();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b p-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-800">Edit Order #{order.id}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Customer Information */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Customer Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  value={editedOrder.customerInfo.name}
                  onChange={(e) => updateCustomerInfo("name", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input
                  type="tel"
                  value={editedOrder.customerInfo.phone}
                  onChange={(e) => updateCustomerInfo("phone", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email (Optional)</label>
                <input
                  type="email"
                  value={editedOrder.customerInfo.email || ""}
                  onChange={(e) => updateCustomerInfo("email", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
              {editedOrder.orderType === "delivery" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                  <input
                    type="text"
                    value={editedOrder.customerInfo.address || ""}
                    onChange={(e) => updateCustomerInfo("address", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Order Type & Payment */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Order Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Order Type</label>
                <div className="flex gap-2">
                  {(["takeaway", "collection", "delivery"] as OrderType[]).map((type) => (
                    <button
                      key={type}
                      onClick={() => updateOrderType(type)}
                      className={`px-4 py-2 rounded-lg font-semibold transition ${
                        editedOrder.orderType === type
                          ? "bg-primary text-white"
                          : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                      }`}
                    >
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Payment Method</label>
                <div className="flex gap-2">
                  {(["card", "cash"] as PaymentMethod[]).map((method) => (
                    <button
                      key={method}
                      onClick={() => updatePaymentMethod(method)}
                      className={`px-4 py-2 rounded-lg font-semibold transition ${
                        editedOrder.paymentMethod === method
                          ? "bg-primary text-white"
                          : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                      }`}
                    >
                      {method.charAt(0).toUpperCase() + method.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
              {editedOrder.orderType === "delivery" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Fee (£)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={editedOrder.deliveryFee || 0}
                    onChange={(e) => updateDeliveryFee(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Order Items */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Order Items</h3>
            <div className="space-y-3">
              {editedOrder.items.map((item, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <p className="font-semibold text-gray-800">{item.name}</p>
                      {item.selectedOptions && Object.keys(item.selectedOptions).length > 0 && (
                        <p className="text-sm text-gray-600 mt-1">
                          {Object.entries(item.selectedOptions).map(([key, value]) => (
                            <span key={key} className="mr-2">
                              {key}: {value}
                            </span>
                          ))}
                        </p>
                      )}
                    </div>
                    <button
                      onClick={() => removeItem(index)}
                      className="text-red-600 hover:text-red-700 transition"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <label className="text-sm font-medium text-gray-700">Quantity:</label>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateItemQuantity(index, item.quantity - 1)}
                          className="w-8 h-8 rounded border border-gray-300 hover:bg-gray-100 transition"
                        >
                          -
                        </button>
                        <span className="w-12 text-center font-semibold">{item.quantity}</span>
                        <button
                          onClick={() => updateItemQuantity(index, item.quantity + 1)}
                          className="w-8 h-8 rounded border border-gray-300 hover:bg-gray-100 transition"
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-800">
                        £{(item.price * item.quantity).toFixed(2)}
                      </p>
                      <p className="text-sm text-gray-500">£{item.price.toFixed(2)} each</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="border-t pt-4">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-600">Subtotal:</span>
              <span className="font-semibold">£{subtotal.toFixed(2)}</span>
            </div>
            {editedOrder.deliveryFee && editedOrder.deliveryFee > 0 && (
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Delivery Fee:</span>
                <span className="font-semibold">£{editedOrder.deliveryFee.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between text-lg font-bold border-t pt-2 mt-2">
              <span>Total:</span>
              <span className="text-primary">£{total.toFixed(2)}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-400 transition"
            >
              Cancel
            </button>
            <button
              onClick={() => onSave({ ...editedOrder, subtotal, total })}
              disabled={isProcessing}
              className="flex-1 px-4 py-2 bg-primary text-white rounded-lg font-semibold hover:bg-primary-dark transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <Save className="w-5 h-5" />
              {isProcessing ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
