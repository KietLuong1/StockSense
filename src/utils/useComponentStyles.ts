/* eslint-disable prettier/prettier */
import { useAppTheme } from './useAppTheme';
import * as AllStyles from '@/app/styles';

/**
 * Custom hook to access all themed component styles
 * @param component The component name to get styles for (e.g., 'Transaction', 'Inventory')
 * @returns An object containing all themed styles for the specified component
 */
export function useComponentStyles(component: 'Transaction' | 'Inventory' | 'Dashboard') {
  const { themed } = useAppTheme();
  
  switch (component) {
    case 'Transaction':
      return Object.entries(AllStyles.TransactionStyles).reduce((acc, [key, styleObj]) => {
        // @ts-ignore - We know these are theme-compatible styles
        acc[key] = themed(styleObj);
        return acc;
      }, {} as Record<string, any>);
      
    case 'Inventory':
      return Object.entries(AllStyles.InventoryStyles).reduce((acc, [key, styleObj]) => {
        // @ts-ignore - We know these are theme-compatible styles
        acc[key] = themed(styleObj);
        return acc;
      }, {} as Record<string, any>);
      
    case 'Dashboard':
      // Uncomment when DashboardStyles are available
      // return Object.entries(AllStyles.DashboardStyles).reduce((acc, [key, styleObj]) => {
      //   // @ts-ignore - We know these are theme-compatible styles
      //   acc[key] = themed(styleObj);
      //   return acc;
      // }, {} as Record<string, any>);
      return {}; // Return empty object for now
      
    default:
      return {};
  }
}
