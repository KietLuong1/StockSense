/* eslint-disable prettier/prettier */
import { TransactionKey } from './key';

export const transactionMockData = [
  {
    [TransactionKey.ID]: '1',
    [TransactionKey.BATCH_ID]: 'B001',
    [TransactionKey.PRODUCT]: 'Laptop',
    [TransactionKey.LOCATION]: 'Warehouse A',
    [TransactionKey.EXPIRED_DATE]: new Date('2025-06-30'),
    [TransactionKey.QUANTITY]: 5
  },
  {
    [TransactionKey.ID]: '2',
    [TransactionKey.BATCH_ID]: 'B002',
    [TransactionKey.PRODUCT]: 'Smartphone',
    [TransactionKey.LOCATION]: 'Store B',
    [TransactionKey.EXPIRED_DATE]: new Date('2025-08-15'),
    [TransactionKey.QUANTITY]: 12
  },
  {
    [TransactionKey.ID]: '3',
    [TransactionKey.BATCH_ID]: 'B003',
    [TransactionKey.PRODUCT]: 'Headphones',
    [TransactionKey.LOCATION]: 'Warehouse C',
    [TransactionKey.EXPIRED_DATE]: new Date('2025-07-20'),
    [TransactionKey.QUANTITY]: 30
  },
  {
    [TransactionKey.ID]: '4',
    [TransactionKey.BATCH_ID]: 'B004',
    [TransactionKey.PRODUCT]: 'Monitor',
    [TransactionKey.LOCATION]: 'Store A',
    [TransactionKey.EXPIRED_DATE]: new Date('2025-12-10'),
    [TransactionKey.QUANTITY]: 8
  },
  {
    [TransactionKey.ID]: '5',
    [TransactionKey.BATCH_ID]: 'B005',
    [TransactionKey.PRODUCT]: 'Keyboard',
    [TransactionKey.LOCATION]: 'Warehouse B',
    [TransactionKey.EXPIRED_DATE]: new Date('2026-01-05'),
    [TransactionKey.QUANTITY]: 15
  }
];

// Monthly transaction summary for dashboard charts
export const monthlyTransactions = [
  { month: 'Jan', in: 45, out: 32 },
  { month: 'Feb', in: 38, out: 29 },
  { month: 'Mar', in: 55, out: 40 },
  { month: 'Apr', in: 42, out: 35 },
  { month: 'May', in: 60, out: 45 },
  { month: 'Jun', in: 47, out: 38 }
];

// Inventory by category for dashboard charts
export const inventoryByCategory = [
  { category: 'Electronics', count: 350, color: '#4285F4' },
  { category: 'Furniture', count: 180, color: '#EA4335' },
  { category: 'Clothing', count: 420, color: '#FBBC05' },
  { category: 'Books', count: 250, color: '#34A853' },
  { category: 'Food', count: 150, color: '#8B4513' }
];

// Low stock alerts
export const lowStockAlerts = [
  { id: '1', name: 'Wireless Mouse', quantity: 5, threshold: 10 },
  { id: '2', name: 'USB-C Cables', quantity: 8, threshold: 15 },
  { id: '3', name: 'Desk Lamps', quantity: 3, threshold: 5 },
  { id: '4', name: 'Printer Paper', quantity: 2, threshold: 10 }
];

// Expiring soon alerts
export const expiringAlerts = [
  { id: '1', name: 'Canned Goods', expiryDate: new Date('2025-06-05'), daysLeft: 7 },
  { id: '2', name: 'Batteries', expiryDate: new Date('2025-06-08'), daysLeft: 10 },
  { id: '3', name: 'First Aid Kit', expiryDate: new Date('2025-06-03'), daysLeft: 5 },
  { id: '4', name: 'Energy Drinks', expiryDate: new Date('2025-06-01'), daysLeft: 3 }
];