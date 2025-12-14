import { NextRequest, NextResponse } from "next/server";
import { createOrder } from "@/lib/firebase/orders";

export async function POST(request: NextRequest) {
  try {
    const orderData = await request.json();

    // Validate required fields
    if (!orderData.items || orderData.items.length === 0) {
      return NextResponse.json(
        { error: "Order must contain at least one item" },
        { status: 400 }
      );
    }

    if (!orderData.customerInfo?.name || !orderData.customerInfo?.phone) {
      return NextResponse.json(
        { error: "Customer name and phone are required" },
        { status: 400 }
      );
    }

    if (orderData.orderType === "delivery" && !orderData.customerInfo?.address) {
      return NextResponse.json(
        { error: "Delivery address is required for delivery orders" },
        { status: 400 }
      );
    }

    // Create order in Firestore
    const orderId = await createOrder({
      items: orderData.items,
      orderType: orderData.orderType,
      paymentMethod: orderData.paymentMethod,
      customerInfo: orderData.customerInfo,
      subtotal: orderData.subtotal,
      deliveryFee: orderData.deliveryFee || 0,
      total: orderData.total,
      status: "pending",
    });

    return NextResponse.json(
      { 
        success: true, 
        orderId,
        message: "Order created successfully" 
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { getAllOrders } = await import("@/lib/firebase/orders");
    const orders = await getAllOrders();
    
    return NextResponse.json({ orders }, { status: 200 });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}

