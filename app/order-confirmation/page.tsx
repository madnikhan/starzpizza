"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { CheckCircle, Home, AlertCircle, Loader2 } from "lucide-react";
import Link from "next/link";
import Header from "@/components/Header";

function OrderConfirmationContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderId = searchParams.get("orderId");
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!orderId) {
      setError("Order ID not found");
      setLoading(false);
      return;
    }

    // Fetch order details to verify payment status
    const fetchOrder = async () => {
      try {
        const response = await fetch(`/api/orders/${orderId}`);
        if (!response.ok) {
          throw new Error("Order not found");
        }
        const result = await response.json();
        const orderData = result.order || result; // Handle both response formats
        setOrder(orderData);

        // For card payments, verify payment was actually made
        if (orderData.paymentMethod === "card") {
          // Check if order is confirmed and paid
          if (orderData.status !== "confirmed" || orderData.paymentStatus !== "paid") {
            // Order exists but payment not verified - redirect to payment or show pending message
            setError("Payment not completed. Please complete your payment to confirm your order.");
            setLoading(false);
            return;
          }
        }
        // For cash payments, it's okay to show confirmation even if status is pending
        setLoading(false);
      } catch (err) {
        console.error("Error fetching order:", err);
        setError(err instanceof Error ? err.message : "Failed to load order");
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-8 text-center">
            <Loader2 size={80} className="mx-auto text-primary animate-spin mb-6" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Verifying Order...</h2>
            <p className="text-gray-600">Please wait while we verify your order and payment status.</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-8 text-center">
            <AlertCircle size={80} className="mx-auto text-yellow-500 mb-6" />
            <h1 className="text-3xl font-bold text-gray-800 mb-4">Payment Required</h1>
            <p className="text-lg text-gray-600 mb-2">{error}</p>
            {orderId && (
              <p className="text-sm text-gray-500 mb-6">
                Order ID: <span className="font-semibold">{orderId}</span>
              </p>
            )}
            <div className="space-y-3 mt-6">
              <Link
                href="/checkout"
                className="inline-block bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-dark transition"
              >
                Complete Payment
              </Link>
              <Link
                href="/"
                className="block text-gray-600 hover:text-primary transition mt-4"
              >
                Return to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-8 text-center">
          <CheckCircle size={80} className="mx-auto text-green-500 mb-6" />
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Order Confirmed!</h1>
          <p className="text-lg text-gray-600 mb-2">
            Thank you for your order. We've received it and will start preparing it right away.
          </p>
          {orderId && (
            <p className="text-sm text-gray-500 mb-6">
              Order ID: <span className="font-semibold">{orderId}</span>
            </p>
          )}
          <p className="text-gray-600 mb-8">
            You will receive a confirmation message shortly. If you have any questions, please call us at{" "}
            <a href="tel:01743362362" className="text-primary font-semibold hover:underline">
              01743 362 362
            </a>
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-dark transition"
          >
            <Home size={20} />
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function OrderConfirmationPage() {
  return (
    <>
      <Header />
      <Suspense fallback={
        <div className="min-h-screen bg-gray-50 py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-8 text-center">
              <p className="text-lg text-gray-600">Loading...</p>
            </div>
          </div>
        </div>
      }>
        <OrderConfirmationContent />
      </Suspense>
    </>
  );
}

