"use client";

import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";

interface SumUpCheckoutProps {
  checkoutId: string;
  checkoutReference: string;
  amount: number;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function SumUpCheckout({
  checkoutId,
  checkoutReference,
  amount,
  onSuccess,
  onCancel,
}: SumUpCheckoutProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Listen for messages from the iframe (SumUp checkout)
    const handleMessage = (event: MessageEvent) => {
      // Verify origin for security
      if (!event.origin.includes('sumup.com')) {
        return;
      }

      // Handle payment success
      if (event.data?.type === 'sumup:checkout:success' || 
          event.data?.status === 'SUCCESS' ||
          event.data?.status === 'PAID') {
        onSuccess();
      }

      // Handle payment cancellation
      if (event.data?.type === 'sumup:checkout:cancel' ||
          event.data?.status === 'CANCELLED') {
        onCancel();
      }
    };

    window.addEventListener('message', handleMessage);

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, [onSuccess, onCancel]);

  // Try different URL patterns for SumUp checkout
  // According to SumUp documentation: https://sumup.me/pay/{checkout_id}
  // Note: Use checkout ID (UUID), not checkout_reference
  const checkoutUrls = [
    `https://sumup.me/pay/${checkoutId}`, // Use ID first (per SumUp docs)
    `https://sumup.me/pay/${checkoutReference}`, // Try reference as fallback
    `https://checkout.sumup.com/pay/${checkoutId}`, // Alternative domain with ID
    `https://checkout.sumup.com/pay/${checkoutReference}`, // Alternative domain with reference
  ];

  const [currentUrlIndex, setCurrentUrlIndex] = useState(0);
  const checkoutUrl = checkoutUrls[currentUrlIndex];

  // Effect to handle URL pattern switching with timeout
  useEffect(() => {
    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // If we're on a URL that might be 404, set a timeout to try next one
    // Cross-origin iframes don't trigger onError for 404s, so we use timeout
    if (!isLoading && currentUrlIndex < checkoutUrls.length - 1) {
      timeoutRef.current = setTimeout(() => {
        // If we're still on the same URL and haven't seen success, try next
        console.log(`Timeout reached for URL pattern ${currentUrlIndex + 1}, trying next...`);
        setCurrentUrlIndex(currentUrlIndex + 1);
        setIsLoading(true);
      }, 5000); // Wait 5 seconds to see if payment form loads
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [currentUrlIndex, isLoading, checkoutUrls.length]);

  const handleIframeLoad = () => {
    setIsLoading(false);
    
    // Check if iframe loaded successfully (not 404)
    if (iframeRef.current?.contentWindow) {
      try {
        // Try to access iframe content to check if it loaded
        const iframeDoc = iframeRef.current.contentDocument || 
                         iframeRef.current.contentWindow?.document;
        if (iframeDoc) {
          // If we can access the document, it loaded
          console.log('SumUp checkout iframe loaded successfully');
          
          // Check if the page shows 404 or error
          const bodyText = iframeDoc.body?.textContent || '';
          if (bodyText.includes('404') || bodyText.includes('Not Found') || bodyText.includes('Page not found')) {
            console.warn('SumUp checkout page shows 404, trying next URL pattern...');
            // Try next URL pattern
            if (currentUrlIndex < checkoutUrls.length - 1) {
              setTimeout(() => {
                setCurrentUrlIndex(currentUrlIndex + 1);
                setIsLoading(true);
              }, 1000);
            }
          }
        }
      } catch (e) {
        // Cross-origin restriction - this is expected and means it loaded
        console.log('SumUp checkout iframe loaded (cross-origin)');
        
        // For cross-origin iframes, we can't check content directly
        // Set a timeout to detect if the page is a 404
        // If we see 404 errors in console, try next URL after a delay
        if (currentUrlIndex < checkoutUrls.length - 1) {
          // Clear any existing timeout
          if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
          }
          
          // Wait 4 seconds - if it's a 404, we'll see it in console
          // and can try the next URL pattern
          timeoutRef.current = setTimeout(() => {
            // Check console for 404 errors (we can't programmatically detect cross-origin 404s)
            // But we can try the next URL if user hasn't interacted
            console.log(`Attempting next URL pattern (${currentUrlIndex + 2}/${checkoutUrls.length})...`);
            setCurrentUrlIndex(currentUrlIndex + 1);
            setIsLoading(true);
          }, 4000);
        }
      }
    }
  };

  const handleIframeError = () => {
    console.error('Failed to load SumUp checkout iframe');
    // Try next URL pattern
    if (currentUrlIndex < checkoutUrls.length - 1) {
      console.log(`Trying next URL pattern (${currentUrlIndex + 2}/${checkoutUrls.length})...`);
      setCurrentUrlIndex(currentUrlIndex + 1);
      setIsLoading(true);
    } else {
      // All URLs failed - show helpful error message
      console.error('All SumUp checkout URL patterns failed. This indicates the URL format needs to be confirmed with SumUp support.');
      alert(
        'Unable to load payment page.\n\n' +
        'The checkout was created successfully, but the payment URL format needs to be verified with SumUp support.\n\n' +
        `Checkout ID: ${checkoutId}\n` +
        `Checkout Reference: ${checkoutReference}\n\n` +
        'Please contact SumUp support with these details to get the correct payment URL format.'
      );
      onCancel();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-4xl h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-2xl font-bold text-gray-800">Complete Payment</h2>
          <button
            onClick={onCancel}
            className="text-gray-500 hover:text-gray-700 transition"
            aria-label="Close"
          >
            <X size={24} />
          </button>
        </div>

        {/* Iframe Container */}
        <div className="flex-1 relative bg-gray-100">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-white z-10">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-gray-600">Loading payment page...</p>
              </div>
            </div>
          )}
          
          <iframe
            ref={iframeRef}
            src={checkoutUrl}
            className="w-full h-full border-0"
            title="SumUp Payment Checkout"
            onLoad={handleIframeLoad}
            onError={handleIframeError}
            sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-top-navigation"
            allow="payment"
          />
        </div>

        {/* Footer Info */}
        <div className="p-4 border-t bg-gray-50">
          <p className="text-sm text-gray-600 text-center">
            Secure payment powered by <strong>SumUp</strong>
          </p>
          <p className="text-xs text-gray-500 text-center mt-1">
            Amount: £{amount.toFixed(2)} | Order: {checkoutReference}
          </p>
          {currentUrlIndex > 0 && (
            <p className="text-xs text-yellow-600 text-center mt-2">
              Trying alternative payment URL ({currentUrlIndex + 1}/{checkoutUrls.length})...
            </p>
          )}
          {currentUrlIndex === checkoutUrls.length - 1 && (
            <p className="text-xs text-red-600 text-center mt-2">
              ⚠️ If payment page doesn't load, the URL format may need to be verified with SumUp support.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

