import { NextRequest, NextResponse } from "next/server";
import { getOrder, updateOrderStatus } from "@/lib/firebase/orders";

export async function GET(
  request: NextRequest,
  { params }: { params: { orderId: string } }
) {
  try {
    const order = await getOrder(params.orderId);
    
    if (!order) {
      return NextResponse.json(
        { error: "Order not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ order }, { status: 200 });
  } catch (error) {
    console.error("Error fetching order:", error);
    return NextResponse.json(
      { error: "Failed to fetch order" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { orderId: string } }
) {
  try {
    const body = await request.json();
    const { status, paymentStatus, transactionId, checkoutId } = body;
    
    if (!status && !paymentStatus && !checkoutId) {
      return NextResponse.json(
        { error: "Status, paymentStatus, or checkoutId is required" },
        { status: 400 }
      );
    }

    if (status) {
      const validStatuses = ["pending", "confirmed", "preparing", "ready", "completed", "cancelled"];
      if (!validStatuses.includes(status)) {
        return NextResponse.json(
          { error: "Invalid status" },
          { status: 400 }
        );
      }

      await updateOrderStatus(params.orderId, status);
    }

    // Update payment status if provided
    // Only include fields that are actually provided (not undefined)
    if (paymentStatus !== undefined || transactionId !== undefined || checkoutId !== undefined) {
      const { updateOrderPayment } = await import("@/lib/firebase/orders");
      const paymentUpdate: any = {};
      
      if (paymentStatus !== undefined) {
        paymentUpdate.paymentStatus = paymentStatus;
      }
      if (transactionId !== undefined) {
        paymentUpdate.transactionId = transactionId;
      }
      if (checkoutId !== undefined) {
        paymentUpdate.checkoutId = checkoutId;
      }
      
      console.log("📝 Updating order with payment data:", paymentUpdate);
      await updateOrderPayment(params.orderId, paymentUpdate);
    }
    
    return NextResponse.json(
      { success: true, message: "Order updated" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating order:", error);
    return NextResponse.json(
      { error: "Failed to update order" },
      { status: 500 }
    );
  }
}

