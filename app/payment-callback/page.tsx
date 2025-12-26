"use client";

import { useEffect, useState, Suspense } from "react";
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

  useEffect(() => {
    const orderIdParam = searchParams.get("orderId");
    const checkoutId = searchParams.get("checkout_id");
    const statusParam = searchParams.get("status");

    if (!orderIdParam) {
      setStatus("failed");
      setErrorMessage("Order ID not found");
      return;
    }

    setOrderId(orderIdParam);

    // Check payment status
    if (statusParam === "PAID" || statusParam === "SUCCESS") {
      // Verify payment with backend
      verifyPayment(orderIdParam, checkoutId);
    } else if (statusParam === "FAILED" || statusParam === "CANCELLED") {
      setStatus("failed");
      setErrorMessage("Payment was cancelled or failed");
    } else {
      // Try to verify payment status
      verifyPayment(orderIdParam, checkoutId);
    }
  }, [searchParams]);

  const verifyPayment = async (orderId: string, checkoutId: string | null) => {
    try {
      const response = await fetch(`/api/payments/sumup/verify?orderId=${orderId}&checkoutId=${checkoutId || ""}`);
      const result = await response.json();

      if (result.success && result.paid) {
        setStatus("success");
        // Clear cart after successful payment
        clearCart();
        // Redirect to order confirmation after 3 seconds
        setTimeout(() => {
          router.push(`/order-confirmation?orderId=${orderId}`);
        }, 3000);
      } else {
        setStatus("failed");
        setErrorMessage(result.error || "Payment verification failed");
      }
    } catch (error) {
      console.error("Error verifying payment:", error);
      setStatus("failed");
      setErrorMessage("Failed to verify payment status");
    }
  };

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
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Payment Failed</h2>
                <p className="text-gray-600 mb-4">
                  {errorMessage || "Your payment could not be processed. Please try again."}
                </p>
                <div className="space-y-3">
                  <Link
                    href="/checkout"
                    className="block bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-dark transition"
                  >
                    Try Again
                  </Link>
                  <Link
                    href="/"
                    className="block text-gray-600 hover:text-primary transition"
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

