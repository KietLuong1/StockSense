/* eslint-disable prettier/prettier */
import { SupplierKey } from "./key"

export type SupplierTypes = {
  [SupplierKey.NAME]: string
  [SupplierKey.PHONE]: number
  [SupplierKey.EMAIL]: string
  [SupplierKey.ADDRESS]: string
  [SupplierKey.CREATE_AT]: string
}

export interface SupplierPayload {
  supplierId?: string
  name: string
  phone: number
  email: string
  address: string
  create_at: string
}

export interface SupplierResponse {
  supplierId: string
  name: string
  phone: number
  email: string
  address: string
  create_at: string
}
