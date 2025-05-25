/* eslint-disable prettier/prettier */
import { transactionAPI } from '@/services/http'
import { TransactionResponse } from './types'

export const API_BASE_URL = 'https://671f1b7a1dfc42991983f6dc.mockapi.io/api/v1'

export const fetchTransactions = async (): Promise<TransactionResponse[]> => {
  try {
    const response = await transactionAPI.get('/imports')
    return response.data
  } catch (error) {
    console.error('Error fetching transactions:', error)
    throw error
  }
}


export const fetchTransactionById = async (id: string): Promise<TransactionResponse> => {
  try {
    const response = await transactionAPI.get(`/imports/${id}`)
    return response.data
  } catch (error) {
    console.error(`Error fetching transaction with ID ${id}:`, error)
    throw error
  }
}

export const createTransaction = async (data: Partial<TransactionResponse>): Promise<TransactionResponse> => {
  try {
    const response = await transactionAPI.post('/imports', data)
    return response.data
  } catch (error) {
    console.error('Error creating transaction:', error)
    throw error
  }
}


export const updateTransaction = async (id: string, data: Partial<TransactionResponse>): Promise<TransactionResponse> => {
  try {
    const response = await transactionAPI.put(`/imports/${id}`, data)
    return response.data
  } catch (error) {
    console.error(`Error updating transaction with ID ${id}:`, error)
    throw error
  }
}

export const deleteTransaction = async (id: string): Promise<any> => {
  try {
    const response = await transactionAPI.delete(`/imports/${id}`)
    return response.data
  } catch (error) {
    console.error(`Error deleting transaction with ID ${id}:`, error)
    throw error
  }
}
