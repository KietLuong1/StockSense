/* eslint-disable prettier/prettier */
import { InventoryResponse } from "./types";

export const sampleInventoryData: InventoryResponse[] = [
    { 
      inventory_id: "1", 
      product_id: "P001", 
      location_id: "L001", 
      quantity: 150, 
      batch_number: "BN2023001", 
      import_date: "2023-05-10", 
      expiry_date: "2024-05-10"
    },
    { 
      inventory_id: "2", 
      product_id: "P002", 
      location_id: "L001", 
      quantity: 75, 
      batch_number: "BN2023002", 
      import_date: "2023-05-09", 
      expiry_date: "2025-05-15"
    },
    { 
      inventory_id: "3", 
      product_id: "P003", 
      location_id: "L002", 
      quantity: 25, 
      batch_number: "BN2023003", 
      import_date: "2023-05-08", 
      expiry_date: "2023-11-20"
    },
    { 
      inventory_id: "4", 
      product_id: "P004", 
      location_id: "L003", 
      quantity: 10, 
      batch_number: "BN2023004", 
      import_date: "2023-05-07", 
      expiry_date: "2023-08-31"
    },
    { 
      inventory_id: "5", 
      product_id: "P005", 
      location_id: "L002", 
      quantity: 0, 
      batch_number: "BN2023005", 
      import_date: "2023-05-06", 
      expiry_date: "2024-05-06"
    },
    { 
      inventory_id: "6", 
      product_id: "P006", 
      location_id: "L004", 
      quantity: 45, 
      batch_number: "BN2023006", 
      import_date: "2023-05-05", 
      expiry_date: "2024-02-15"
    },
    { 
      inventory_id: "7", 
      product_id: "P007", 
      location_id: "L001", 
      quantity: 30, 
      batch_number: "BN2023007", 
      import_date: "2023-05-04", 
      expiry_date: "2023-12-20"
    },
    { 
      inventory_id: "8", 
      product_id: "P008", 
      location_id: "L003", 
      quantity: 5, 
      batch_number: "BN2023008", 
      import_date: "2023-05-03", 
      expiry_date: "2023-09-15"
    },
    { 
      inventory_id: "9", 
      product_id: "P009", 
      location_id: "L002", 
      quantity: 0, 
      batch_number: "BN2023009", 
      import_date: "2023-05-02", 
      expiry_date: "2024-03-01"
    },
    { 
      inventory_id: "10", 
      product_id: "P010", 
      location_id: "L004", 
      quantity: 60, 
      batch_number: "BN2023010", 
      import_date: "2023-05-01", 
      expiry_date: "2023-11-30"
    },
  ];
  
  export const productNames: Record<string, string> = {
    "P001": "Apple Phone",
    "P002": "Microsoft Laptop",
    "P003": "Amazon Echo",
    "P004": "Tesla Charger",
    "P005": "Meta VR Headset",
    "P006": "Google Tablet",
    "P007": "Netflix Gift Card",
    "P008": "Walmart Kitchenware",
    "P009": "Exxon Oil Filter",
    "P010": "Johnson's First Aid Kit",
  };
  
  export const locationNames: Record<string, string> = {
    "L001": "Main Warehouse",
    "L002": "North Distribution Center",
    "L003": "South Retail Store",
    "L004": "East Fulfillment Center",
  };