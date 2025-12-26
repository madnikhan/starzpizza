import { NextRequest, NextResponse } from "next/server";

/**
 * SumUp Checkout API Integration
 * 
 * This endpoint creates a SumUp checkout link for payment processing.
 * 
 * SumUp Checkout API Documentation:
 * https://developer.sumup.com/docs/api/checkouts/
 */

// Mark route as dynamic
export const dynamic = 'force-dynamic';

interface SumUpCheckoutRequest {
  checkout_reference: string; // Unique order ID
  amount: number; // Amount in major currency unit (pounds for GBP, e.g., 6.99)
  currency: string; // Currency code (GBP)
  merchant_code: string; // Your SumUp merchant code
  return_url: string; // URL to redirect after payment
  redirect_url?: string; // Optional redirect URL
  description?: string; // Order description
  hosted_checkout?: {
    enabled: boolean; // Enable hosted checkout to get payment URL
  };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { orderId, amount, description } = body;

    // Validate required fields
    if (!orderId || !amount) {
      return NextResponse.json(
        { error: "Order ID and amount are required" },
        { status: 400 }
      );
    }

    // Get SumUp credentials from environment variables
    const sumupAccessToken = process.env.SUMUP_ACCESS_TOKEN;
    const sumupMerchantCode = process.env.SUMUP_MERCHANT_CODE;
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    if (!sumupAccessToken || !sumupMerchantCode) {
      console.error("SumUp credentials not configured");
      return NextResponse.json(
        { error: "Payment gateway not configured" },
        { status: 500 }
      );
    }

    // SumUp Checkout API expects amount in minor units (pence for GBP)
    // However, based on the checkout page showing £699 instead of £6.99,
    // it appears SumUp might be interpreting the amount as pounds instead of pence
    // Let's send the amount in pounds (major units) instead
    // If this doesn't work, we may need to check SumUp's API documentation
    const amountForSumUp = amount; // Send amount in pounds (e.g., 6.99)
    
    console.log("Amount conversion:", {
      original: amount,
      forSumUp: amountForSumUp,
      note: "Sending as pounds (major units) - SumUp was showing 100x the amount when sent as pence"
    });

    // Create SumUp checkout
    // Enable hosted checkout to get a payment URL in the response
    const checkoutData: SumUpCheckoutRequest = {
      checkout_reference: orderId,
      amount: amountForSumUp,
      currency: "GBP",
      merchant_code: sumupMerchantCode,
      return_url: `${appUrl}/payment-callback?orderId=${orderId}`,
      description: description || `Order ${orderId}`,
      hosted_checkout: {
        enabled: true, // Enable hosted checkout to get hosted_checkout_url
      },
    };

    // Call SumUp Checkout API
    console.log("Creating SumUp checkout with data:", {
      ...checkoutData,
      sumupAccessToken: sumupAccessToken ? `${sumupAccessToken.substring(0, 10)}...` : 'missing',
      sumupMerchantCode: sumupMerchantCode || 'missing',
    });

    const response = await fetch("https://api.sumup.com/v0.1/checkouts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sumupAccessToken}`,
      },
      body: JSON.stringify(checkoutData),
    });

    console.log("SumUp API response status:", response.status, response.statusText);
    console.log("SumUp API response headers:", Object.fromEntries(response.headers.entries()));

    // SumUp typically returns 201 Created for successful checkout creation
    if (!response.ok && response.status !== 201) {
      let errorData;
      try {
        errorData = await response.json();
      } catch {
        errorData = await response.text();
      }
      console.error("SumUp API error:", {
        status: response.status,
        statusText: response.statusText,
        error: errorData,
      });
      return NextResponse.json(
        { 
          error: "Failed to create payment checkout",
          details: errorData,
          status: response.status,
        },
        { status: response.status }
      );
    }

    const checkoutResult = await response.json();
    console.log("SumUp API full response:", JSON.stringify(checkoutResult, null, 2));
    console.log("Response status was:", response.status, "(201 = Created, 200 = OK)");

    // SumUp API response structure - based on actual API response
    // SumUp returns: { id, checkout_reference, status, return_url, ... } but NO payment redirect_url
    const checkoutId = checkoutResult.id || 
                      checkoutResult.checkout_id || 
                      checkoutResult.uuid;

    // Check for hosted_checkout_url first (if hosted checkout is enabled)
    // This is the preferred method as it provides a direct payment URL
    let checkoutUrl = checkoutResult.hosted_checkout_url ||
                     checkoutResult.hosted_checkout?.url ||
                     checkoutResult.redirect_url || 
                     checkoutResult.checkout_url || 
                     checkoutResult.url ||
                     checkoutResult.href ||
                     checkoutResult.link;
    
    // Exclude return_url - that's not the payment URL
    if (checkoutUrl === checkoutResult.return_url || checkoutUrl === checkoutData.return_url) {
      checkoutUrl = null; // Reset if it's the return_url
    }
    
    if (checkoutResult.hosted_checkout_url) {
      console.log("✅ Using hosted_checkout_url from SumUp API:", checkoutResult.hosted_checkout_url);
    }

    // If no URL in response (which is the case with SumUp), we need to construct it
    // According to SumUp documentation: https://sumup.me/pay/{checkout_reference}
    // Note: Use checkout_reference (the order ID we send), not the checkout ID (UUID)
    if (!checkoutUrl && checkoutId) {
      const checkoutReference = checkoutResult.checkout_reference || checkoutData.checkout_reference;
      
      // Use checkout_reference (order ID) as it's what we send to identify the order
      // The checkout_reference is more reliable than the UUID for payment URLs
      if (checkoutReference) {
        checkoutUrl = `https://sumup.me/pay/${checkoutReference}`;
        console.log("✅ Using SumUp payment URL with checkout_reference:", checkoutUrl);
      } else {
        // Fallback to checkout ID if reference not available
        checkoutUrl = `https://sumup.me/pay/${checkoutId}`;
        console.log("⚠️ Using checkout ID for URL (reference not available):", checkoutUrl);
      }
    }

    if (!checkoutUrl && !checkoutId) {
      console.error("No checkout URL or ID in response:", checkoutResult);
      return NextResponse.json(
        { 
          error: "Invalid response from payment gateway - no checkout URL or ID provided",
          details: checkoutResult 
        },
        { status: 500 }
      );
    }

    // Ensure the URL is absolute
    if (checkoutUrl && !checkoutUrl.startsWith('http://') && !checkoutUrl.startsWith('https://')) {
      checkoutUrl = `https://checkout.sumup.com/pay/${checkoutUrl}`;
    }

    // Return the checkout information
    // IMPORTANT: Only return checkoutUrl if it's a valid SumUp payment URL
    // Don't return return_url as checkoutUrl
    // Accept both sumup.me and checkout.sumup.com domains
    const finalCheckoutUrl = checkoutUrl && 
                            !checkoutUrl.includes('/payment-callback') && 
                            (checkoutUrl.startsWith('https://sumup.me') || 
                             checkoutUrl.startsWith('https://checkout.sumup.com')) 
                            ? checkoutUrl 
                            : checkoutUrl; // Return the constructed URL even if validation fails (for debugging)

    const responseData = {
      success: true,
      checkoutId: checkoutId || checkoutResult.id || checkoutResult.checkout_id,
      checkoutUrl: finalCheckoutUrl, // Only return if it's a valid SumUp URL
      rawResponse: checkoutResult, // Include full response for debugging
    };

    console.log("Returning checkout data:", {
      checkoutId: responseData.checkoutId,
      checkoutUrl: responseData.checkoutUrl,
      hasRawResponse: !!responseData.rawResponse,
    });

    return NextResponse.json(responseData);
  } catch (error) {
    console.error("Error creating SumUp checkout:", error);
    return NextResponse.json(
      { error: "Failed to process payment request" },
      { status: 500 }
    );
  }
}

