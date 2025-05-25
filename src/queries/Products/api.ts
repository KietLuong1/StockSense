/* eslint-disable prettier/prettier */
import { productAPI } from '@/services/http'
import { ProductResponse } from './types'

export const API_PRODUCT_URL = 'https://6832cf31c3f2222a8cb39f34.mockapi.io/'

export const fetchProducts = async (): Promise<ProductResponse[]> => {
  try {
    const response = await productAPI.get('/products')
    return response.data
  } catch (error) {
    console.error('Error fetching inventory:', error)
    throw error
  }
}


export const fetchProductsById = async (id: string): Promise<ProductResponse> => {
  try {
    const response = await productAPI.get(`/products/${id}`)
    return response.data
  } catch (error) {
    console.error(`Error fetching inventory with ID ${id}:`, error)
    throw error
  }
}
