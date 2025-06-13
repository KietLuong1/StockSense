import { InventoryKey } from "./keys"
import { ProductResponse } from './../Products/types';
import { WarehouseResponse } from './../Warehouse/types';

export type InventoryTypes = {
  [InventoryKey.ID]: string
  [InventoryKey.BATCH_NUMBER]: string
  [InventoryKey.CREATED_AT]: string
  [InventoryKey.EXPIRY_DATE]: string
  [InventoryKey.LAST_COUNTED_DATE]: string
  [InventoryKey.LAST_UPDATED]: string
  [InventoryKey.LOCATION_CODE]: string
  [InventoryKey.MAX_STOCK_LEVEL]: number
  [InventoryKey.QUANTITY_ON_HAND]: number
  [InventoryKey.REORDER_LEVEL]: number
  [InventoryKey.RESERVED_QUANTITY]: number
  [InventoryKey.UNIT_COST]: number
  [InventoryKey.UPDATED_BY]: string
  [InventoryKey.PRODUCT_ID]: string
  [InventoryKey.WAREHOUSE_ID]: string
}

export interface InventoryPayload {
  id?: string
  batchNumber: string
  createdAt: string
  expiryDate: string
  lastCountedDate: string
  lastUpdated: string
  locationCode: string
  maxStockLevel: number
  quantityOnHand: number
  reorderLevel: number
  reservedQuantity: number
  unitCost: number
  updatedBy: string
  productId: string
  warehouseId: string
}

export interface InventoryResponse {
  id: string
  batchNumber: string
  createdAt: string
  expiryDate: string
  lastCountedDate: string
  lastUpdated: string
  locationCode: string
  maxStockLevel: number
  quantityOnHand: number
  reorderLevel: number
  reservedQuantity: number
  unitCost: number
  updatedBy: string
  product: ProductResponse
  warehouse: WarehouseResponse
}
