/* eslint-disable prettier/prettier */

import { supplierAPI } from "@/services/http"
import { SupplierResponse } from "./types"


export const API_SUPPLIER_URL = 'https://674a78858680202966349258.mockapi.io'

export const fetchSuppliers = async (): Promise<SupplierResponse[]> => {
  try {
    const response = await supplierAPI.get('/suppliers')
    return response.data
  } catch (error) {
    console.error('Error fetching suppliers:', error)
    throw error
  }
}


export const fetchSuppliersById = async (id: string): Promise<SupplierResponse> => {
  try {
    const response = await supplierAPI.get(`/suppliers/${id}`)
    return response.data
  } catch (error) {
    console.error(`Error fetching suppliers with ID ${id}:`, error)
    throw error
  }
}
