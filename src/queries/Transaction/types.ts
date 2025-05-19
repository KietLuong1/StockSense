/* eslint-disable prettier/prettier */
import { TransactionKey } from "./key"

export type TransactionTypes = {
  [TransactionKey.BATCH_ID]: string
  [TransactionKey.PRODUCT]: string
  [TransactionKey.LOCATION]: string
  [TransactionKey.EXPIRED_DATE]: string
  [TransactionKey.QUANTITY]: number
}

export interface TransactionPayload {
  id?: string
  batchId: string
  product: string
  location: string
  expiredDate: string
  quantity: number
}

export interface TransactionResponse {
  id: string
  batchId: string
  product: string
  location: string
  expiredDate: string
  quantity: number
}
