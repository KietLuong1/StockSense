/* eslint-disable prettier/prettier */
import { inventoryAPI } from '@/services/http'
import { InventoryResponse } from './types'

export const API_INVENTORY_URL = 'https://67becd5cb2320ee050116828.mockapi.io/api/v1'

export const fetchInventory = async (): Promise<InventoryResponse[]> => {
  try {
    const response = await inventoryAPI.get('/inventory')
    return response.data
  } catch (error) {
    console.error('Error fetching inventory:', error)
    throw error
  }
}


export const fetchInventoryById = async (id: string): Promise<InventoryResponse> => {
  try {
    const response = await inventoryAPI.get(`/inventory/${id}`)
    return response.data
  } catch (error) {
    console.error(`Error fetching inventory with ID ${id}:`, error)
    throw error
  }
}

// export const createTransaction = async (data: Partial<InventoryResponse>): Promise<InventoryResponse> => {
//   try {
//     const response = await inventoryAPI.post('/imports', data)
//     return response.data
//   } catch (error) {
//     console.error('Error creating transaction:', error)
//     throw error
//   }
// }


// export const updateTransaction = async (id: string, data: Partial<InventoryResponse>): Promise<TransactionResponse> => {
//   try {
//     const response = await inventoryAPI.put(`/imports/${id}`, data)
//     return response.data
//   } catch (error) {
//     console.error(`Error updating transaction with ID ${id}:`, error)
//     throw error
//   }
// }

// export const deleteTransaction = async (id: string): Promise<any> => {
//   try {
//     const response = await inventoryAPI.delete(`/imports/${id}`)
//     return response.data
//   } catch (error) {
//     console.error(`Error deleting transaction with ID ${id}:`, error)
//     throw error
//   }
// }
