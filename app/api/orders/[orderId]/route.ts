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
    const { status, paymentStatus, transactionId } = body;
    
    if (!status && !paymentStatus) {
      return NextResponse.json(
        { error: "Status or paymentStatus is required" },
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
    if (paymentStatus || transactionId) {
      const { updateOrderPayment } = await import("@/lib/firebase/orders");
      await updateOrderPayment(params.orderId, {
        paymentStatus,
        transactionId,
      });
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

