import { NextRequest, NextResponse } from "next/server";

/**
 * Verify SumUp payment status
 * 
 * This endpoint verifies if a payment was successful by checking
 * the SumUp transaction status.
 */

// Mark route as dynamic
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get("orderId");
    const checkoutId = searchParams.get("checkoutId");

    if (!orderId) {
      return NextResponse.json(
        { error: "Order ID is required" },
        { status: 400 }
      );
    }

    const sumupAccessToken = process.env.SUMUP_ACCESS_TOKEN;
    const sumupMerchantCode = process.env.SUMUP_MERCHANT_CODE;

    if (!sumupAccessToken || !sumupMerchantCode) {
      return NextResponse.json(
        { error: "Payment gateway not configured" },
        { status: 500 }
      );
    }

    // Try to get transaction by checkout reference (orderId)
    // SumUp allows querying transactions by merchant code and checkout reference
    const response = await fetch(
      `https://api.sumup.com/v0.1/me/transactions?checkout_reference=${orderId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${sumupAccessToken}`,
        },
      }
    );

    if (!response.ok) {
      // If transaction not found, payment might not be completed
      if (response.status === 404) {
        return NextResponse.json({
          success: true,
          paid: false,
          message: "Payment not found or not completed",
        });
      }

      const errorData = await response.text();
      console.error("SumUp API error:", errorData);
      return NextResponse.json(
        { error: "Failed to verify payment" },
        { status: response.status }
      );
    }

    const transactions = await response.json();

    // Check if we have a successful transaction
    if (transactions && Array.isArray(transactions) && transactions.length > 0) {
      const transaction = transactions[0];
      
      // Check transaction status
      const isPaid = transaction.status === "SUCCESSFUL" || transaction.status === "PAID";

      if (isPaid) {
        // Update order status in database
        try {
          const updateResponse = await fetch(
            `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/orders/${orderId}`,
            {
              method: "PATCH",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                status: "confirmed",
                paymentStatus: "paid",
                transactionId: transaction.id,
              }),
            }
          );

          if (!updateResponse.ok) {
            console.error("Failed to update order status");
          }
        } catch (error) {
          console.error("Error updating order:", error);
        }
      }

      return NextResponse.json({
        success: true,
        paid: isPaid,
        transaction: {
          id: transaction.id,
          status: transaction.status,
          amount: transaction.amount,
          currency: transaction.currency,
        },
      });
    }

    return NextResponse.json({
      success: true,
      paid: false,
      message: "No transaction found",
    });
  } catch (error) {
    console.error("Error verifying payment:", error);
    return NextResponse.json(
      { error: "Failed to verify payment status" },
      { status: 500 }
    );
  }
}

