import { useState, useCallback } from 'react';
import { ordersService } from '../services/api';
import type { Order, EnrichedOrder } from '../services/api';

export const useOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [enrichedOrders, setEnrichedOrders] = useState<EnrichedOrder[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await ordersService.getOrders();
      setOrders(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch orders';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchEnrichedOrders = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await ordersService.getEnrichedOrders();
      setEnrichedOrders(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch enriched orders';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    orders,
    enrichedOrders,
    isLoading,
    error,
    fetchOrders,
    fetchEnrichedOrders
  };
};

