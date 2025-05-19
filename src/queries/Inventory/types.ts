/* eslint-disable prettier/prettier */
import { InventoryKey } from './keys'

export type InventoryTypes = {
  [InventoryKey.PRODUCT_ID]: string
  [InventoryKey.LOCATION_ID]: string
  [InventoryKey.QUANTITY]: number
  [InventoryKey.BATCH_NUMBER]: string
  [InventoryKey.IMPORT_DATE]: string
  [InventoryKey.EXPIRY_DATE]: string
}

export interface InventoryPayload {
  inventory_id?: string
  product_id: string
  location_id: string
  quantity: number
  batch_number: string
  import_date: string
  expiry_date: string
}

export interface InventoryResponse {
  inventory_id: string
  product_id: string
  location_id: string
  quantity: number
  batch_number: string
  import_date: string
  expiry_date: string
}
