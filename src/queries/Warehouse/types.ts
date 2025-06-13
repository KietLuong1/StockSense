import { WarehouseKey } from "./key"

export type WarehouseTypes = {
  [WarehouseKey.ID]: string
  [WarehouseKey.NAME]: string
  [WarehouseKey.LOCATION]: string
  [WarehouseKey.CAPACITY]: number
  [WarehouseKey.ACTIVE]: boolean
  [WarehouseKey.CREATED_AT]: string
  [WarehouseKey.UPDATED_AT]: string
}

export interface WarehousePayload {
  id?: string
  name: string
  location: string
  capacity: number
  active: boolean
  createdAt: string
  updatedAt: string
}

export interface WarehouseResponse {
  id: string
  name: string
  location: string
  capacity: number
  active: boolean
  createdAt: string
  updatedAt: string
}
