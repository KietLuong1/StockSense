import { SupplierKey } from "./key"

export type SupplierTypes = {
  [SupplierKey.ID]: string
  [SupplierKey.NAME]: string
  [SupplierKey.ADDRESS]: string
  [SupplierKey.CONTACT_INFO]: string
}

export interface SupplierPayload {
  id?: string
  name: string
  address: string
  contactInfo: string
}

export interface SupplierResponse {
  id: string
  name: string
  address: string
  contactInfo: string
}
