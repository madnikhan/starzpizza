import { NextRequest, NextResponse } from "next/server";

/**
 * Test Payment Endpoint
 * 
 * This endpoint simulates a successful payment for testing purposes.
 * Use this instead of SumUp when testing the payment flow without real cards.
 * 
 * To use: Set NEXT_PUBLIC_ENABLE_TEST_PAYMENTS=true in .env.local
 */

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    // Check if test mode is enabled
    const testModeEnabled = process.env.NEXT_PUBLIC_ENABLE_TEST_PAYMENTS === 'true';
    
    if (!testModeEnabled) {
      return NextResponse.json(
        { error: "Test payment mode is not enabled" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { orderId, amount, description } = body;

    // Validate required fields
    if (!orderId || !amount) {
      return NextResponse.json(
        { error: "Order ID and amount are required" },
        { status: 400 }
      );
    }

    // Simulate payment processing delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Simulate successful payment
    const testTransactionId = `TEST-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    console.log("🧪 TEST PAYMENT - Simulating successful payment:", {
      orderId,
      amount,
      transactionId: testTransactionId,
    });

    // Update order status to confirmed
    try {
      const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
      await fetch(`${appUrl}/api/orders/${orderId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: "confirmed",
          paymentStatus: "paid",
          transactionId: testTransactionId,
        }),
      });
    } catch (error) {
      console.error("Error updating order status:", error);
    }

    return NextResponse.json({
      success: true,
      testMode: true,
      transactionId: testTransactionId,
      message: "Test payment successful (simulated)",
      orderId,
      amount,
    });
  } catch (error) {
    console.error("Error processing test payment:", error);
    return NextResponse.json(
      { error: "Failed to process test payment" },
      { status: 500 }
    );
  }
}

