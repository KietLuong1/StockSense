/* eslint-disable prettier/prettier */

import { ProductKey } from "./key"

export type ProductTypes = {
  [ProductKey.NAME]: string
  [ProductKey.CATEGORY]: string
  [ProductKey.DESCRIPTION]: string
  [ProductKey.PRICE]: number
  [ProductKey.STATUS]: string
  [ProductKey.CREATE_DATE]: string
  [ProductKey.EXPIRED_DATE]: string
  [ProductKey.MINIMUM_QUANTITY]: number
  [ProductKey.LIMIT_QUANTITY]: number
}

export interface ProductPayload {
  productId?: string
  name: string
  category: string
  description: string
  price: number
  status: string
  create_date: string
  expired_date: string
  minimum_quantity: number
  limit_quantity: number
}

export interface ProductResponse {
  productId: string
  name: string
  category: string
  description: string
  price: number
  status: string
  create_date: string
  expired_date: string
  minimum_quantity: number
  limit_quantity: number
}
