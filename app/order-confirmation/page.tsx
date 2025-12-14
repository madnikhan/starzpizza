"use client";

import { useSearchParams } from "next/navigation";
import { CheckCircle, Home } from "lucide-react";
import Link from "next/link";
import Header from "@/components/Header";

export default function OrderConfirmationPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");

  return (
    <>
      <Header />
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
    </>
  );
}

