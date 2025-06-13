import { ProductKey } from "./key"

export type ProductTypes = {
  [ProductKey.ID]: string
  [ProductKey.NAME]: string
  [ProductKey.SKU]: string
  [ProductKey.PRICE]: number
  [ProductKey.STOCK_QUANTITY]: number
  [ProductKey.DESCRIPTION]: string
  [ProductKey.EXPIRY_DATE]: string
  [ProductKey.CREATED_AT]: string
  [ProductKey.IMAGE_URL]: string
  [ProductKey.CATEGORY_ID]: string
  [ProductKey.WAREHOUSE_ID]: string
}

export interface ProductPayload {
  id?: string
  name: string
  sku: string
  price: number
  stockQuantity: number
  description: string
  expiryDate: string
  createdAt: string
  imageUrl: string
  categoryId: string
  warehouseId: string
}

export interface ProductResponse {
  id?: string
  name: string
  sku: string
  price: number
  stockQuantity: number
  description: string
  expiryDate: string
  createdAt: string
  imageUrl: string
  categoryId: string
  warehouseId: string
}

// export type ProductTypes = {
//   [ProductKey.NAME]: string
//   [ProductKey.CATEGORY]: string
//   [ProductKey.DESCRIPTION]: string
//   [ProductKey.PRICE]: number
//   [ProductKey.STATUS]: string
//   [ProductKey.CREATE_DATE]: string
//   [ProductKey.EXPIRED_DATE]: string
//   [ProductKey.MINIMUM_QUANTITY]: number
//   [ProductKey.LIMIT_QUANTITY]: number
// }

// export interface ProductPayload {
//   productId?: string
//   name: string
//   category: string
//   description: string
//   price: number
//   status: string
//   create_date: string
//   expired_date: string
//   minimum_quantity: number
//   limit_quantity: number
// }

// export interface ProductResponse {
//   productId: string
//   name: string
//   category: string
//   description: string
//   price: number
//   status: string
//   create_date: string
//   expired_date: string
//   minimum_quantity: number
//   limit_quantity: number
// }
