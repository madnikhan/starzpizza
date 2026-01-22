"use client";

import { useIsRestaurantOpen } from "@/hooks/useRestaurantStatus";
import { AlertCircle } from "lucide-react";

export default function RestaurantStatusBanner() {
  const { isOpen, loading, message } = useIsRestaurantOpen();

  if (loading || isOpen) {
    return null; // Don't show banner when open or loading
  }

  return (
    <div className="bg-red-600 text-white py-3 px-4 shadow-lg">
      <div className="container mx-auto flex items-center justify-center gap-3">
        <AlertCircle className="w-5 h-5 flex-shrink-0" />
        <div className="text-center">
          <p className="font-bold text-lg">Restaurant Currently Closed</p>
          {message && (
            <p className="text-sm text-red-100 mt-1">{message}</p>
          )}
          {!message && (
            <p className="text-sm text-red-100 mt-1">
              We are not accepting orders at this time. Please check back later.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
