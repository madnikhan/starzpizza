"use client";

import { useEffect, useState, Suspense, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Header from "@/components/Header";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import Link from "next/link";
import { useCartStore } from "@/lib/store/cart-store";

function PaymentCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { clearCart } = useCartStore();
  const [status, setStatus] = useState<"loading" | "success" | "failed">("loading");
  const [orderId, setOrderId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [debugInfo, setDebugInfo] = useState<any>(null);
  const [showDebug, setShowDebug] = useState(false);
  const [allLogs, setAllLogs] = useState<any[]>([]);

  const verifyPayment = useCallback(async (orderId: string, checkoutId: string | null, retryCount: number = 0) => {
    try {
      console.log(`🔍 Verifying payment for order (attempt ${retryCount + 1}):`, orderId);
      const verifyUrl = `/api/payments/sumup/verify?orderId=${encodeURIComponent(orderId)}${checkoutId ? `&checkoutId=${encodeURIComponent(checkoutId)}` : ""}`;
      console.log("Verification URL:", verifyUrl);
      
      const response = await fetch(verifyUrl);
      const result = await response.json();

      console.log("Payment verification result:", result);
      console.log("Full verification response:", JSON.stringify(result, null, 2));
      
      // Store debug info for display and persistence
      const debugData = {
        verificationUrl: verifyUrl,
        responseStatus: response.status,
        result: result,
        timestamp: new Date().toISOString(),
        attempt: retryCount + 1,
        orderId: orderId,
        checkoutId: checkoutId,
      };
      
      setDebugInfo(debugData);
      
      // Save to localStorage for persistence across redirects
      try {
        const existingLogs = JSON.parse(localStorage.getItem('paymentDebugLogs') || '[]');
        existingLogs.push(debugData);
        // Keep only last 10 logs
        const recentLogs = existingLogs.slice(-10);
        localStorage.setItem('paymentDebugLogs', JSON.stringify(recentLogs));
        setAllLogs(recentLogs);
      } catch (e) {
        console.error("Failed to save debug logs:", e);
      }

      // Only confirm if payment is actually verified as paid
      // Check multiple success conditions:
      // 1. result.paid === true (explicit paid flag)
      // 2. result.source === "database" (payment already confirmed in database)
      // 3. result.success && no paid=false (successful verification)
      const isPaid = result.success && (
        result.paid === true || 
        result.source === "database" ||
        (result.paid !== false && result.success === true && !result.message?.includes("not found"))
      );
      
      if (isPaid) {
        console.log("✅ Payment verified successfully:", result);
        setStatus("success");
        // Clear cart after successful payment
        clearCart();
        // Redirect to order confirmation immediately (or after 2 seconds for user feedback)
        setTimeout(() => {
          console.log("🔄 Redirecting to order confirmation...");
          router.push(`/order-confirmation?orderId=${orderId}`);
        }, 2000);
      } else {
        console.log("❌ Payment not verified or not paid:", result);
        
        // If URL indicates success but verification failed, it might be a timing issue
        const urlStatus = searchParams.get("status");
        if ((urlStatus === "PAID" || urlStatus === "SUCCESS" || urlStatus === "SUCCESSFUL") && retryCount < 2) {
          // Retry verification after a delay if URL indicates success
          console.log(`⏳ Payment appears successful but verification pending. Retrying in 3 seconds... (${retryCount + 1}/3)`);
          setTimeout(() => {
            verifyPayment(orderId, checkoutId, retryCount + 1);
          }, 3000);
          return; // Don't set status to failed yet
        } else if (urlStatus === "PAID" || urlStatus === "SUCCESS" || urlStatus === "SUCCESSFUL") {
          // After retries, show a message that payment appears successful
          setErrorMessage(
            "Payment appears successful on SumUp, but verification is still pending. " +
            "Your payment may still be processing. Please wait a few minutes and check your order status, " +
            "or contact support with your order ID: " + orderId
          );
        } else {
          setErrorMessage(
            result.message || 
            result.error || 
            "Payment verification failed. Please contact support if you completed the payment. Order ID: " + orderId
          );
        }
        
        setStatus("failed");
      }
    } catch (error) {
      console.error("Error verifying payment:", error);
      if (retryCount < 2) {
        console.log(`⏳ Error occurred, retrying in 3 seconds... (${retryCount + 1}/3)`);
        setTimeout(() => {
          verifyPayment(orderId, checkoutId, retryCount + 1);
        }, 3000);
      } else {
        setStatus("failed");
        setErrorMessage("Failed to verify payment status. Please contact support.");
      }
    }
  }, [searchParams, clearCart, router]);

  useEffect(() => {
    // Load persisted logs and checkout info
    try {
      const savedLogs = JSON.parse(localStorage.getItem('paymentDebugLogs') || '[]');
      setAllLogs(savedLogs);
      
      // Also load checkout info from before redirect
      const checkoutInfo = localStorage.getItem('lastCheckoutInfo');
      if (checkoutInfo) {
        console.log("📋 Checkout info from before redirect:", JSON.parse(checkoutInfo));
      }
    } catch (e) {
      console.error("Failed to load debug logs:", e);
    }
    
    const orderIdParam = searchParams.get("orderId");
    const checkoutId = searchParams.get("checkout_id") || searchParams.get("checkoutId");
    const statusParam = searchParams.get("status");
    const transactionId = searchParams.get("transaction_id") || searchParams.get("transactionId");

    const callbackData = {
      orderId: orderIdParam,
      checkoutId,
      status: statusParam,
      transactionId,
      allParams: Object.fromEntries(searchParams.entries()),
      timestamp: new Date().toISOString(),
    };
    
    console.log("📥 Payment callback received:", callbackData);
    
    // Save callback data to logs
    try {
      const existingLogs = JSON.parse(localStorage.getItem('paymentDebugLogs') || '[]');
      existingLogs.push({ type: 'callback', data: callbackData });
      const recentLogs = existingLogs.slice(-10);
      localStorage.setItem('paymentDebugLogs', JSON.stringify(recentLogs));
      setAllLogs(recentLogs);
    } catch (e) {
      console.error("Failed to save callback logs:", e);
    }

    if (!orderIdParam) {
      setStatus("failed");
      setErrorMessage("Order ID not found in callback URL");
      return;
    }

    setOrderId(orderIdParam);

    // If status is explicitly PAID/SUCCESS, we can be more confident
    // But still verify with backend for security
    if (statusParam === "PAID" || statusParam === "SUCCESS") {
      console.log("✅ Payment status from URL indicates success:", statusParam);
    }

    // Always verify payment with backend (don't trust URL parameters alone)
    // SumUp may redirect here even if payment wasn't completed
    verifyPayment(orderIdParam, checkoutId, 0);
  }, [searchParams, verifyPayment]);

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-8 text-center">
            {status === "loading" && (
              <>
                <Loader2 className="w-16 h-16 text-primary animate-spin mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Processing Payment...</h2>
                <p className="text-gray-600">Please wait while we verify your payment</p>
              </>
            )}

            {status === "success" && (
              <>
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Payment Successful!</h2>
                <p className="text-gray-600 mb-4">
                  Your order has been confirmed and payment has been processed.
                </p>
                {orderId && (
                  <p className="text-sm text-gray-500 mb-6">Order ID: {orderId}</p>
                )}
                <p className="text-sm text-gray-500 mb-6">
                  Redirecting to order confirmation...
                </p>
                <Link
                  href={`/order-confirmation?orderId=${orderId}`}
                  className="inline-block bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-dark transition"
                >
                  View Order Details
                </Link>
              </>
            )}

            {status === "failed" && (
              <>
                <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Payment Verification Failed</h2>
                <p className="text-gray-600 mb-4">
                  {errorMessage || "Your payment could not be verified. Please try again."}
                </p>
                {orderId && (
                  <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-sm text-yellow-800 font-semibold mb-1">Order ID:</p>
                    <p className="text-sm text-yellow-900 font-mono">{orderId}</p>
                    <p className="text-xs text-yellow-700 mt-2">
                      Please save this order ID and contact support if you completed the payment.
                    </p>
                  </div>
                )}
                
                {/* Debug Panel */}
                <div className="mb-4">
                  <button
                    onClick={() => setShowDebug(!showDebug)}
                    className="w-full bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-300 transition mb-2"
                  >
                    {showDebug ? "Hide" : "Show"} Debug Information
                  </button>
                  {showDebug && (
                    <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-xs overflow-auto max-h-96">
                      <div className="mb-2 text-yellow-400">=== CURRENT VERIFICATION RESULT ===</div>
                      {debugInfo && (
                        <div className="whitespace-pre-wrap mb-4">
                          {JSON.stringify(debugInfo, null, 2)}
                        </div>
                      )}
                      
                      {allLogs.length > 0 && (
                        <>
                          <div className="mb-2 text-yellow-400 border-t border-gray-700 pt-2 mt-2">
                            === ALL DEBUG LOGS (Last 10) ===
                          </div>
                          {allLogs.map((log, idx) => (
                            <div key={idx} className="mb-2 pb-2 border-b border-gray-700">
                              <div className="text-blue-400 text-xs mb-1">
                                [{log.timestamp || log.data?.timestamp}] {log.type || 'verification'}
                              </div>
                              <div className="whitespace-pre-wrap text-xs">
                                {JSON.stringify(log, null, 2)}
                              </div>
                            </div>
                          ))}
                        </>
                      )}
                      
                      <div className="mt-4 pt-4 border-t border-gray-700">
                        <div className="text-yellow-400 mb-2">=== ACTIONS ===</div>
                        <div className="flex gap-2 flex-wrap">
                          <button
                            onClick={() => {
                              const allData = { current: debugInfo, logs: allLogs };
                              navigator.clipboard.writeText(JSON.stringify(allData, null, 2));
                              alert("All debug info copied to clipboard!");
                            }}
                            className="bg-blue-600 text-white px-3 py-1 rounded text-xs hover:bg-blue-700"
                          >
                            Copy All Debug Info
                          </button>
                          <button
                            onClick={() => {
                              localStorage.removeItem('paymentDebugLogs');
                              setAllLogs([]);
                              alert("Debug logs cleared!");
                            }}
                            className="bg-red-600 text-white px-3 py-1 rounded text-xs hover:bg-red-700"
                          >
                            Clear Logs
                          </button>
                        </div>
                        <div className="mt-2 text-xs text-gray-500 space-y-1">
                          <div>💡 <strong>IMPORTANT:</strong> Check your <strong>SERVER TERMINAL</strong> (where Next.js is running) for detailed SumUp API logs.</div>
                          <div>The server logs show the actual API calls and responses from SumUp.</div>
                          <div className="mt-2 p-2 bg-gray-800 rounded">
                            <strong>Look for these in server logs:</strong>
                            <ul className="list-disc list-inside mt-1 space-y-1">
                              <li>🔍 Starting payment verification</li>
                              <li>📡 Full Transactions URL</li>
                              <li>📊 Transactions API Response Status</li>
                              <li>📦 Full transactions response</li>
                              <li>✅ Payment confirmed via...</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="space-y-3">
                  <button
                    onClick={() => {
                      const checkoutId = searchParams.get("checkout_id") || searchParams.get("checkoutId");
                      setStatus("loading");
                      verifyPayment(orderId || "", checkoutId, 0);
                    }}
                    className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
                  >
                    Retry Verification
                  </button>
                  <Link
                    href={`/order-confirmation?orderId=${orderId}`}
                    className="block text-center bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-300 transition"
                  >
                    Check Order Status
                  </Link>
                  <Link
                    href="/checkout"
                    className="block text-center bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-dark transition"
                  >
                    Try Payment Again
                  </Link>
                  <Link
                    href="/"
                    className="block text-center text-gray-600 hover:text-primary transition"
                  >
                    Return to Home
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default function PaymentCallbackPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-16 h-16 text-primary animate-spin" />
      </div>
    }>
      <PaymentCallbackContent />
    </Suspense>
  );
}

