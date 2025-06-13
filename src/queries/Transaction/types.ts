import { ProductResponse } from './../Products/types';
import { TransactionKey } from "./key"

export type TransactionTypes = {
  [TransactionKey.ID]: string
  [TransactionKey.CREATED_AT]: string
  [TransactionKey.DESCRIPTION]: string
  [TransactionKey.NOTE]: string
  [TransactionKey.STATUS]: string
  [TransactionKey.TOTAL_PRICE]: number
  [TransactionKey.TOTAL_PRODUCTS]: number
  [TransactionKey.TRANSACTION_TYPE]: string
  [TransactionKey.UPDATED_AT]: string
  [TransactionKey.PRODUCT_ID]: string
  [TransactionKey.SUPPLIER_ID]: string
}

export interface TransactionPayload {
  id?: string
  createdAt: string
  description: string
  note: string
  status: string
  totalPrice: number
  totalProducts: number
  transactionType: string
  updateAt: string
  productId: string
  supplierId: string
}

export interface TransactionResponse {
  price: any
  id: string
  createdAt: string
  description: string
  note: string
  status: string
  totalPrice: number
  totalProducts: number
  transactionType: string
  updateAt: string
  product: ProductResponse
  supplierId: string
}
