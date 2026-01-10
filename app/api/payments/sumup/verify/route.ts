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

    console.log("🔍 Starting payment verification:", {
      orderId,
      checkoutId,
      timestamp: new Date().toISOString(),
    });

    // Try multiple methods to verify payment
    // 1. First, try to get the checkout status directly
    // 2. Then try to get transactions by checkout_reference
    // 3. If checkoutId provided, try to get checkout by ID
    
    let isPaid = false;
    let transaction = null;
    let checkoutStatus = null;

    // Method 1: Try to get checkout status directly (if checkoutId is provided)
    if (checkoutId) {
      try {
        console.log("🔍 Method 1: Checking checkout status by ID:", checkoutId);
        const checkoutResponse = await fetch(
          `https://api.sumup.com/v0.1/checkouts/${checkoutId}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${sumupAccessToken}`,
            },
          }
        );

        if (checkoutResponse.ok) {
          const checkoutData = await checkoutResponse.json();
          console.log("✅ Checkout data retrieved:", {
            id: checkoutData.id,
            status: checkoutData.status,
            checkout_reference: checkoutData.checkout_reference,
          });
          
          checkoutStatus = checkoutData.status;
          // Check if checkout is PAID
          if (checkoutData.status === "PAID") {
            isPaid = true;
            console.log("✅ Payment confirmed via checkout status: PAID");
          }
        }
      } catch (error) {
        console.error("Error fetching checkout:", error);
      }
    }

    // Method 2: Try to get transactions by checkout_reference (orderId)
    // Retry up to 3 times with delays (transactions might not be immediately available)
    if (!isPaid) {
      const maxRetries = 3;
      const retryDelay = 1000; // 1 second

      for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
          console.log(`🔍 Method 2 (Attempt ${attempt}/${maxRetries}): Checking transactions by checkout_reference:`, orderId);
          
          const transactionsResponse = await fetch(
            `https://api.sumup.com/v0.1/me/transactions?checkout_reference=${orderId}`,
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${sumupAccessToken}`,
              },
            }
          );

          if (transactionsResponse.ok) {
            const transactions = await transactionsResponse.json();
            console.log("✅ Transactions retrieved:", {
              count: Array.isArray(transactions) ? transactions.length : 0,
              transactions: transactions,
            });

            // Check if we have a successful transaction
            if (transactions && Array.isArray(transactions) && transactions.length > 0) {
              // Find the most recent successful transaction
              const successfulTransaction = transactions.find(
                (t: any) => t.status === "SUCCESSFUL" || t.status === "PAID"
              );
              
              if (successfulTransaction) {
                transaction = successfulTransaction;
                isPaid = true;
                console.log("✅ Payment confirmed via transaction:", {
                  id: transaction.id,
                  status: transaction.status,
                });
                break; // Exit retry loop
              } else {
                // Check the first transaction anyway
                transaction = transactions[0];
                console.log("⚠️ Transaction found but status is:", transaction.status);
                // If status is PENDING, might need to wait
                if (transaction.status === "PENDING" && attempt < maxRetries) {
                  console.log(`⏳ Transaction is PENDING, waiting ${retryDelay}ms before retry...`);
                  await new Promise(resolve => setTimeout(resolve, retryDelay));
                  continue;
                }
              }
            } else if (attempt < maxRetries) {
              // No transactions yet, wait and retry
              console.log(`⏳ No transactions found yet, waiting ${retryDelay}ms before retry...`);
              await new Promise(resolve => setTimeout(resolve, retryDelay));
              continue;
            }
          } else {
            const errorText = await transactionsResponse.text();
            console.log("⚠️ Transactions query returned:", {
              status: transactionsResponse.status,
              statusText: transactionsResponse.statusText,
              error: errorText,
            });
            
            // If 404 and not last attempt, wait and retry
            if (transactionsResponse.status === 404 && attempt < maxRetries) {
              console.log(`⏳ Transaction not found (404), waiting ${retryDelay}ms before retry...`);
              await new Promise(resolve => setTimeout(resolve, retryDelay));
              continue;
            }
          }
        } catch (error) {
          console.error(`Error fetching transactions (attempt ${attempt}):`, error);
          if (attempt < maxRetries) {
            await new Promise(resolve => setTimeout(resolve, retryDelay));
          }
        }
      }
    }

    // Method 3: If we have checkoutId but no status yet, try getting checkout by reference
    if (!isPaid && !checkoutStatus) {
      try {
        console.log("🔍 Method 3: Trying to get checkout by reference:", orderId);
        // Note: SumUp API might not support this directly, but worth trying
        // We'll use the transactions endpoint with a different approach
      } catch (error) {
        console.error("Error in method 3:", error);
      }
    }

    // If payment is confirmed, update order status
    if (isPaid) {
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
              transactionId: transaction?.id || checkoutId || "verified",
            }),
          }
        );

        if (!updateResponse.ok) {
          console.error("Failed to update order status");
        } else {
          console.log("✅ Order status updated to confirmed");
        }
      } catch (error) {
        console.error("Error updating order:", error);
      }

      return NextResponse.json({
        success: true,
        paid: true,
        transaction: transaction ? {
          id: transaction.id,
          status: transaction.status,
          amount: transaction.amount,
          currency: transaction.currency,
        } : null,
        checkoutStatus: checkoutStatus,
      });
    }

    // Payment not found or not paid
    console.log("❌ Payment verification failed:", {
      checkoutStatus,
      hasTransaction: !!transaction,
      transactionStatus: transaction?.status,
    });

    return NextResponse.json({
      success: true,
      paid: false,
      message: "Payment not found or not completed. Please check your SumUp dashboard or contact support.",
      debug: {
        checkoutStatus,
        transactionStatus: transaction?.status,
      },
    });
  } catch (error) {
    console.error("Error verifying payment:", error);
    return NextResponse.json(
      { error: "Failed to verify payment status" },
      { status: 500 }
    );
  }
}

