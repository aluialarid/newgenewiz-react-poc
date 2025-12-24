import { useEffect } from 'react';
import { useOrders } from '../hooks/useOrders';
import type { Order, EnrichedOrder } from '../services/api';
import styles from './OrdersList.module.css';

interface OrdersListProps {
  enriched?: boolean;
}

export const OrdersList = ({ enriched = false }: OrdersListProps) => {
  const { orders, enrichedOrders, isLoading, error, fetchOrders, fetchEnrichedOrders } = useOrders();

  useEffect(() => {
    if (enriched) {
      fetchEnrichedOrders();
    } else {
      fetchOrders();
    }
  }, [enriched, fetchOrders, fetchEnrichedOrders]);

  const displayOrders = enriched ? enrichedOrders : orders;

  if (isLoading) {
    return <div className={styles.loading}>Loading orders...</div>;
  }

  if (error) {
    return <div className={styles.error}>Error: {error}</div>;
  }

  if (displayOrders.length === 0) {
    return <div className={styles.empty}>No orders found</div>;
  }

  return (
    <div className={styles.container}>
      <h3>{enriched ? 'Orders (with Pricing)' : 'Orders'}</h3>
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Order #</th>
              <th>Customer</th>
              <th>Date</th>
              <th>Total Amount</th>
              {enriched && <th>Unit Price</th>}
            </tr>
          </thead>
          <tbody>
            {displayOrders.map((order: Order | EnrichedOrder) => (
              <tr key={order.id}>
                <td>{order.orderNumber}</td>
                <td>{order.customerName}</td>
                <td>{new Date(order.orderDate).toLocaleDateString()}</td>
                <td>${order.totalAmount.toFixed(2)}</td>
                {enriched && <td>${(order as EnrichedOrder).unitPrice?.toFixed(2) || 'N/A'}</td>}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};



