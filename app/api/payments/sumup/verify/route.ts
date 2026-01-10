import { NextRequest, NextResponse } from "next/server";
import { getOrder } from "@/lib/firebase/orders";

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
    console.log("📋 Full request URL:", request.url);
    console.log("📋 All search params:", Object.fromEntries(new URL(request.url).searchParams.entries()));

    // Try multiple methods to verify payment
    // 1. First, try to get the checkout status directly
    // 2. Then try to get transactions by checkout_reference
    // 3. If checkoutId provided, try to get checkout by ID
    
    let isPaid = false;
    let transaction = null;
    let checkoutStatus = null;

    // Method 0: Try to get checkout_id from order in database first
    let storedCheckoutId = checkoutId;
    if (!storedCheckoutId) {
      try {
        console.log("🔍 Method 0: Checking order in database for checkout_id");
        const order = await getOrder(orderId);
        if (order) {
          // Check all possible fields where checkout_id might be stored
          const orderAny = order as any;
          storedCheckoutId = orderAny.checkoutId || 
                            orderAny.sumupCheckoutId || 
                            orderAny.checkout_id ||
                            orderAny.sumup_checkout_id;
          
          if (storedCheckoutId) {
            console.log("✅ Found checkout_id in order:", storedCheckoutId);
          } else {
            console.log("⚠️ No checkout_id found in order database");
            console.log("📋 Order data keys:", Object.keys(orderAny));
            console.log("📋 Full order data (for debugging):", JSON.stringify(orderAny, null, 2));
          }
          
          // Also check if payment was already confirmed
          if (orderAny.paymentStatus === "paid" || order.status === "confirmed") {
            console.log("✅ Payment already confirmed in order database");
            isPaid = true;
            return NextResponse.json({
              success: true,
              paid: true,
              message: "Payment already confirmed",
              source: "database",
            });
          }
        } else {
          console.log("⚠️ Order not found in database:", orderId);
        }
      } catch (error) {
        console.error("Error fetching order from database:", error);
      }
    }

    // Method 1: Try to get checkout status directly (if checkoutId is provided)
    const checkoutIdToUse = storedCheckoutId || checkoutId;
    if (checkoutIdToUse && !isPaid) {
      try {
        console.log("🔍 Method 1: Checking checkout status by ID:", checkoutIdToUse);
        const checkoutResponse = await fetch(
          `https://api.sumup.com/v0.1/checkouts/${checkoutIdToUse}`,
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
          if (checkoutData.status === "PAID" || checkoutData.status === "SUCCESSFUL") {
            isPaid = true;
            console.log("✅ Payment confirmed via checkout status:", checkoutData.status);
          }
        } else {
          const errorText = await checkoutResponse.text();
          console.log("⚠️ Checkout query returned:", {
            status: checkoutResponse.status,
            error: errorText,
          });
        }
      } catch (error) {
        console.error("Error fetching checkout:", error);
      }
    }

    // Method 2: Try to get transactions by checkout_reference (orderId)
    // This is the PRIMARY method since SumUp uses checkout_reference (orderId) to link transactions
    // Retry up to 5 times with increasing delays (transactions might not be immediately available)
    if (!isPaid) {
      const maxRetries = 5;
      const baseRetryDelay = 2000; // Start with 2 seconds
      
      console.log("🔍 Method 2: Using checkout_reference (orderId) to find transaction:", orderId);
      console.log("📝 Note: SumUp links transactions to checkout_reference, not checkout_id");
      console.log("📝 Merchant Code:", sumupMerchantCode);

      for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
          const retryDelay = baseRetryDelay * attempt; // Increasing delay: 2s, 4s, 6s, 8s, 10s
          console.log(`🔍 Method 2 (Attempt ${attempt}/${maxRetries}): Checking transactions by checkout_reference:`, orderId);
          console.log(`📡 Query URL: https://api.sumup.com/v0.1/me/transactions?checkout_reference=${encodeURIComponent(orderId)}`);
          
          // Try multiple query formats as SumUp API might accept different parameters
          const queryParams = new URLSearchParams({
            checkout_reference: orderId,
          });
          
          // Some SumUp implementations might need merchant_code
          if (sumupMerchantCode) {
            queryParams.append('merchant_code', sumupMerchantCode);
          }
          
          const transactionsUrl = `https://api.sumup.com/v0.1/me/transactions?${queryParams.toString()}`;
          console.log(`📡 Full Transactions URL: ${transactionsUrl}`);
          
          const transactionsResponse = await fetch(transactionsUrl, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${sumupAccessToken}`,
              "Content-Type": "application/json",
            },
          });
          
          console.log(`📊 Transactions API Response Status: ${transactionsResponse.status} ${transactionsResponse.statusText}`);
          
          // Log response headers for debugging
          const responseHeaders = Object.fromEntries(transactionsResponse.headers.entries());
          console.log(`📋 Response Headers:`, responseHeaders);

          if (transactionsResponse.ok) {
            const transactions = await transactionsResponse.json();
            console.log("✅ Transactions API Response OK");
            console.log("📦 Transactions data type:", typeof transactions);
            console.log("📦 Is array?", Array.isArray(transactions));
            console.log("📦 Transactions count:", Array.isArray(transactions) ? transactions.length : "N/A");
            console.log("📦 Full transactions response:", JSON.stringify(transactions, null, 2));

            // Handle different response formats from SumUp API
            let transactionsArray: any[] = [];
            
            if (Array.isArray(transactions)) {
              transactionsArray = transactions;
            } else if (transactions && typeof transactions === 'object') {
              // Check if transactions are wrapped in a data/items/transactions field
              transactionsArray = transactions.data || 
                                  transactions.items || 
                                  transactions.transactions || 
                                  (transactions.results ? transactions.results : []);
              
              // If still not an array, try to extract from object values
              if (!Array.isArray(transactionsArray)) {
                console.log("⚠️ Transactions not in expected format, attempting to extract...");
                transactionsArray = Object.values(transactions).filter((item: any) => 
                  item && typeof item === 'object' && (item.id || item.transaction_id)
                ) as any[];
              }
            }
            
            console.log("📋 Processed transactions array length:", transactionsArray.length);
            
            // Check if we have a successful transaction
            if (transactionsArray && transactionsArray.length > 0) {
              // Find the most recent successful transaction
              const successfulTransaction = transactionsArray.find(
                (t: any) => t.status === "SUCCESSFUL" || t.status === "PAID" || t.status === "SUCCEEDED" || t.status === "COMPLETED"
              );
              
              if (successfulTransaction) {
                transaction = successfulTransaction;
                isPaid = true;
                console.log("✅ Payment confirmed via transaction:", {
                  id: transaction.id,
                  status: transaction.status,
                  amount: transaction.amount,
                  currency: transaction.currency,
                  checkout_reference: transaction.checkout_reference,
                });
                break; // Exit retry loop
              } else {
                // Check the first transaction anyway
                transaction = transactionsArray[0];
                console.log("⚠️ Transaction found but status is:", transaction.status);
                console.log("📋 Transaction details:", JSON.stringify(transaction, null, 2));
                // If status is PENDING, might need to wait longer
                if ((transaction.status === "PENDING" || transaction.status === "PROCESSING") && attempt < maxRetries) {
                  console.log(`⏳ Transaction is ${transaction.status}, waiting ${retryDelay}ms before retry...`);
                  await new Promise(resolve => setTimeout(resolve, retryDelay));
                  continue;
                }
              }
            } else if (attempt < maxRetries) {
              // No transactions yet, wait and retry with longer delay
              console.log(`⏳ No transactions found yet (attempt ${attempt}/${maxRetries}), waiting ${retryDelay}ms before retry...`);
              await new Promise(resolve => setTimeout(resolve, retryDelay));
              continue;
            }
          } else {
            let errorText;
            try {
              errorText = await transactionsResponse.json();
            } catch {
              errorText = await transactionsResponse.text();
            }
            
            console.log("⚠️ Transactions query returned error:", {
              status: transactionsResponse.status,
              statusText: transactionsResponse.statusText,
              error: errorText,
            });
            
            // If 404/400 and not last attempt, wait and retry (transaction might not be available yet)
            if ((transactionsResponse.status === 404 || transactionsResponse.status === 400) && attempt < maxRetries) {
              console.log(`⏳ Transaction not found (${transactionsResponse.status}), waiting ${retryDelay}ms before retry...`);
              await new Promise(resolve => setTimeout(resolve, retryDelay));
              continue;
            }
            
            // If 401, credentials might be wrong
            if (transactionsResponse.status === 401) {
              console.error("❌ AUTHENTICATION ERROR: Check SumUp credentials");
              break; // Don't retry auth errors
            }
          }
        } catch (error) {
          console.error(`Error fetching transactions (attempt ${attempt}):`, error);
          if (attempt < maxRetries) {
            const retryDelay = baseRetryDelay * attempt;
            await new Promise(resolve => setTimeout(resolve, retryDelay));
          }
        }
      }
    }

    // Method 2b: Try to get all recent transactions and search for our order
    // This is a fallback if query by checkout_reference doesn't work
    if (!isPaid) {
      try {
        console.log("🔍 Method 2b: Checking all recent transactions for order:", orderId);
        const allTransactionsUrl = `https://api.sumup.com/v0.1/me/transactions?limit=100&statuses=SUCCESSFUL,PAID,SUCCEEDED`;
        console.log(`📡 All Transactions URL: ${allTransactionsUrl}`);
        
        const allTransactionsResponse = await fetch(allTransactionsUrl, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${sumupAccessToken}`,
            "Content-Type": "application/json",
          },
        });
        
        console.log(`📊 All Transactions API Response Status: ${allTransactionsResponse.status}`);

        if (allTransactionsResponse.ok) {
          const allTransactions = await allTransactionsResponse.json();
          console.log("✅ All transactions API response received");
          console.log("📦 Response type:", typeof allTransactions);
          console.log("📦 Is array?", Array.isArray(allTransactions));
          
          // Handle different response formats
          let transactionsArray: any[] = [];
          if (Array.isArray(allTransactions)) {
            transactionsArray = allTransactions;
          } else if (allTransactions && typeof allTransactions === 'object') {
            transactionsArray = allTransactions.data || 
                                allTransactions.items || 
                                allTransactions.transactions || 
                                allTransactions.results || [];
          }
          
          console.log(`📦 Found ${transactionsArray.length} transactions to search through`);
          
          if (transactionsArray.length > 0) {
            // Log first transaction structure for debugging
            console.log("📋 Sample transaction structure:", JSON.stringify(transactionsArray[0], null, 2));
            
            // Search for transaction with matching checkout_reference
            // Check multiple possible field names
            const matchingTransaction = transactionsArray.find(
              (t: any) => {
                const refMatch = t.checkout_reference === orderId || 
                               t.reference === orderId ||
                               t.checkoutReference === orderId ||
                               (t.checkout && t.checkout.reference === orderId);
                const statusMatch = t.status === "SUCCESSFUL" || 
                                  t.status === "PAID" || 
                                  t.status === "SUCCEEDED" ||
                                  t.status === "COMPLETED";
                return refMatch && statusMatch;
              }
            );

            if (matchingTransaction) {
              transaction = matchingTransaction;
              isPaid = true;
              console.log("✅ Payment confirmed via all transactions search:", {
                id: transaction.id,
                status: transaction.status,
                checkout_reference: transaction.checkout_reference || transaction.reference,
                amount: transaction.amount,
              });
            } else {
              console.log("⚠️ No matching transaction found in recent transactions");
              // Log all checkout_references found for debugging
              const allRefs = transactionsArray.map((t: any) => t.checkout_reference || t.reference || t.checkoutReference).filter(Boolean);
              console.log("📋 All checkout_references found:", allRefs.slice(0, 10));
            }
          } else {
            console.log("⚠️ No transactions in response");
            console.log("📋 Full response:", JSON.stringify(allTransactions, null, 2));
          }
        } else {
          const errorText = await allTransactionsResponse.text();
          console.log("⚠️ All transactions query failed:", {
            status: allTransactionsResponse.status,
            error: errorText,
          });
        }
      } catch (error) {
        console.error("Error fetching all transactions:", error);
      }
    }

    // Method 3: Try to get checkout by ID if we have it (with longer delay)
    const finalCheckoutId = storedCheckoutId || checkoutId;
    if (!isPaid && finalCheckoutId) {
      try {
        console.log("🔍 Method 3: Retrying checkout status by ID with longer delay:", finalCheckoutId);
        // Wait longer and try again (transactions might take time to process)
        await new Promise(resolve => setTimeout(resolve, 5000));
        
        const checkoutResponse2 = await fetch(
          `https://api.sumup.com/v0.1/checkouts/${finalCheckoutId}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${sumupAccessToken}`,
            },
          }
        );

        if (checkoutResponse2.ok) {
          const checkoutData2 = await checkoutResponse2.json();
          console.log("✅ Checkout data retrieved (retry with delay):", {
            id: checkoutData2.id,
            status: checkoutData2.status,
            checkout_reference: checkoutData2.checkout_reference,
          });
          
          if (checkoutData2.status === "PAID" || checkoutData2.status === "SUCCESSFUL") {
            isPaid = true;
            checkoutStatus = checkoutData2.status;
            console.log("✅ Payment confirmed via checkout status (retry):", checkoutData2.status);
          }
        } else {
          const errorText = await checkoutResponse2.text();
          console.log("⚠️ Checkout retry returned:", {
            status: checkoutResponse2.status,
            error: errorText,
          });
        }
      } catch (error) {
        console.error("Error in method 3 (retry):", error);
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
    console.log("❌ Payment verification failed - Summary:", {
      orderId,
      checkoutIdUsed: storedCheckoutId || checkoutId,
      checkoutStatus,
      hasTransaction: !!transaction,
      transactionStatus: transaction?.status,
      methodsTried: [
        storedCheckoutId ? "Database lookup" : "No stored checkout_id",
        checkoutIdToUse ? "Checkout status by ID" : "No checkout ID available",
        "Transactions by checkout_reference (5 retries)",
        "All transactions search",
        "Checkout status retry with delay",
      ],
    });

    return NextResponse.json({
      success: true,
      paid: false,
      message: "Payment not found or not completed. Please check your SumUp dashboard or contact support.",
      debug: {
        orderId,
        checkoutIdUsed: storedCheckoutId || checkoutId || "none",
        checkoutStatus,
        transactionStatus: transaction?.status,
        note: "If payment was successful on SumUp, it may still be processing. Please wait a few minutes and check your order status.",
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

