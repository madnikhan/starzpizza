"use client";

import { useState, useEffect } from "react";
import { subscribeToRestaurantStatus, RestaurantStatus } from "@/lib/firebase/restaurant-status";

/**
 * Hook to get current restaurant status with real-time updates
 */
export function useRestaurantStatus() {
  const [status, setStatus] = useState<RestaurantStatus>({
    isOpen: true,
    updatedAt: new Date(),
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    
    // Subscribe to real-time updates
    const unsubscribe = subscribeToRestaurantStatus((newStatus) => {
      setStatus(newStatus);
      setLoading(false);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return { status, loading };
}

/**
 * Hook to check if restaurant is open (simpler version)
 */
export function useIsRestaurantOpen() {
  const { status, loading } = useRestaurantStatus();
  return { isOpen: status.isOpen, loading, message: status.message };
}
