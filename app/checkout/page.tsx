"use client";

import { useState } from "react";
import { useCartStore } from "@/lib/store/cart-store";
import { OrderType, PaymentMethod } from "@/types/menu";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getTotal, clearCart } = useCartStore();
  const [orderType, setOrderType] = useState<OrderType>("takeaway");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("card");
  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const subtotal = getTotal();
  const deliveryFee = orderType === "delivery" ? 2.5 : 0;
  const total = subtotal + deliveryFee;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const orderData = {
        items,
        orderType,
        paymentMethod,
        customerInfo,
        subtotal,
        deliveryFee,
        total,
      };

      // Send order to API
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to place order");
      }

      // If card payment, create SumUp checkout
      if (paymentMethod === "card") {
        try {
          // Check if test mode is enabled (for testing without real cards)
          const testModeEnabled = process.env.NEXT_PUBLIC_ENABLE_TEST_PAYMENTS === 'true';
          const paymentEndpoint = testModeEnabled ? "/api/payments/test" : "/api/payments/sumup";
          
          if (testModeEnabled) {
            console.log("🧪 TEST MODE: Using simulated payment endpoint");
          }
          
          const paymentResponse = await fetch(paymentEndpoint, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              orderId: result.orderId,
              amount: total,
              description: `Order ${result.orderId} - ${orderType}`,
            }),
          });

          const paymentResult = await paymentResponse.json();

          if (!paymentResponse.ok) {
            const errorMessage = paymentResult.error || 
                                paymentResult.details?.message || 
                                (typeof paymentResult.details === 'string' ? paymentResult.details : JSON.stringify(paymentResult.details)) ||
                                "Failed to create payment checkout";
            console.error("Payment error details:", paymentResult);
            throw new Error(errorMessage);
          }

          // Log the full response for debugging
          console.log("Payment response:", paymentResult);

          // Check if this is a test payment (simulated)
          if (paymentResult.testMode) {
            console.log("🧪 TEST MODE: Payment simulated successfully");
            // For test mode, directly redirect to confirmation
            clearCart();
            router.push(`/order-confirmation?orderId=${result.orderId}`);
            return;
          }

          // Validate checkout URL (for real SumUp payments)
          if (!paymentResult.checkoutUrl) {
            console.error("No checkout URL in response. Full response:", paymentResult);
            throw new Error("Payment gateway did not provide a checkout URL. Please check server logs for details.");
          }

          // Validate URL format
          if (!paymentResult.checkoutUrl.startsWith('http://') && !paymentResult.checkoutUrl.startsWith('https://')) {
            console.error("Invalid checkout URL format:", paymentResult.checkoutUrl);
            throw new Error("Invalid payment URL format received");
          }

          console.log("Redirecting to SumUp payment page:", paymentResult.checkoutUrl);
          
          // Redirect directly to SumUp payment page
          // SumUp doesn't allow iframe embedding (X-Frame-Options), so we redirect directly
          window.location.href = paymentResult.checkoutUrl;
          return; // Don't clear cart yet, wait for payment confirmation via callback
        } catch (paymentError) {
          console.error("Error creating payment:", paymentError);
          alert(
            paymentError instanceof Error
              ? paymentError.message
              : "Failed to process payment. Please try again."
          );
          setIsSubmitting(false);
          return;
        }
      }

      // For cash payments, clear cart and redirect immediately
      clearCart();
      router.push(`/order-confirmation?orderId=${result.orderId}`);
    } catch (error) {
      console.error("Error placing order:", error);
      alert(error instanceof Error ? error.message : "There was an error placing your order. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-800 mb-8">Checkout</h1>

          <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-8">
            {/* Left Column - Order Details */}
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold mb-4">Order Type</h2>
                <div className="space-y-3">
                  <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="orderType"
                      value="takeaway"
                      checked={orderType === "takeaway"}
                      onChange={(e) => setOrderType(e.target.value as OrderType)}
                      className="mr-3"
                    />
                    <div>
                      <div className="font-semibold">Takeaway</div>
                      <div className="text-sm text-gray-600">Pick up from restaurant</div>
                    </div>
                  </label>
                  <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="orderType"
                      value="collection"
                      checked={orderType === "collection"}
                      onChange={(e) => setOrderType(e.target.value as OrderType)}
                      className="mr-3"
                    />
                    <div>
                      <div className="font-semibold">Collection</div>
                      <div className="text-sm text-gray-600">Ready for pickup</div>
                    </div>
                  </label>
                  <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="orderType"
                      value="delivery"
                      checked={orderType === "delivery"}
                      onChange={(e) => setOrderType(e.target.value as OrderType)}
                      className="mr-3"
                    />
                    <div>
                      <div className="font-semibold">Delivery</div>
                      <div className="text-sm text-gray-600">Delivered to your address (+£2.50)</div>
                    </div>
                  </label>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold mb-4">Customer Information</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2">Name *</label>
                    <input
                      type="text"
                      required
                      value={customerInfo.name}
                      onChange={(e) => setCustomerInfo({ ...customerInfo, name: e.target.value })}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">Phone *</label>
                    <input
                      type="tel"
                      required
                      value={customerInfo.phone}
                      onChange={(e) => setCustomerInfo({ ...customerInfo, phone: e.target.value })}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">Email</label>
                    <input
                      type="email"
                      value={customerInfo.email}
                      onChange={(e) => setCustomerInfo({ ...customerInfo, email: e.target.value })}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                  {orderType === "delivery" && (
                    <div>
                      <label className="block text-sm font-semibold mb-2">Delivery Address *</label>
                      <textarea
                        required={orderType === "delivery"}
                        value={customerInfo.address}
                        onChange={(e) => setCustomerInfo({ ...customerInfo, address: e.target.value })}
                        rows={3}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold mb-4">Payment Method</h2>
                <div className="space-y-3">
                  <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="card"
                      checked={paymentMethod === "card"}
                      onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                      className="mr-3"
                    />
                    <div>
                      <div className="font-semibold">Card Payment</div>
                      <div className="text-sm text-gray-600">Pay securely with card</div>
                    </div>
                  </label>
                  <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cash"
                      checked={paymentMethod === "cash"}
                      onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                      className="mr-3"
                    />
                    <div>
                      <div className="font-semibold">Cash on Delivery</div>
                      <div className="text-sm text-gray-600">Pay when you receive your order</div>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            {/* Right Column - Order Summary */}
            <div>
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
                <h2 className="text-xl font-bold mb-4">Order Summary</h2>
                <div className="space-y-3 mb-6">
                  {items.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span>
                        {item.name} x{item.quantity}
                      </span>
                      <span>£{(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                <div className="border-t pt-3 space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>£{subtotal.toFixed(2)}</span>
                  </div>
                  {deliveryFee > 0 && (
                    <div className="flex justify-between">
                      <span>Delivery Fee</span>
                      <span>£{deliveryFee.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-xl font-bold pt-2 border-t">
                    <span>Total</span>
                    <span className="text-primary">£{total.toFixed(2)}</span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting || items.length === 0}
                  className="w-full mt-6 bg-primary text-white py-4 rounded-lg font-bold text-lg hover:bg-primary-dark transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Placing Order..." : paymentMethod === "card" ? "Pay with Card" : "Place Order"}
                </button>
              </div>
            </div>
          </form>
          </div>
        </div>
      </div>

    </>
  );
}

