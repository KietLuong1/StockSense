/* eslint-disable prettier/prettier */
import { LocationKey } from './key'

export type LocationTypes = {
  [LocationKey.CODE]: number
  [LocationKey.ZONE]: string
  [LocationKey.SHELF]: string
  [LocationKey.RACK]: string
  [LocationKey.CAPACITY]: number
  [LocationKey.STATUS]: string
  [LocationKey.DESCRIPTION]: string
}

export interface LocationPayload {
  location_id?: string
  code: number
  zone: string
  shelf: string
  rack: string
  capacity: number
  status: string
  description: string
}

export interface LocationResponse {
  location_id: string
  code: number
  zone: string
  shelf: string
  rack: string
  capacity: number
  status: string
  description: string
}
