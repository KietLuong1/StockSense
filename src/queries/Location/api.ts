/* eslint-disable prettier/prettier */
import { locationAPI } from "@/services/http"
import { LocationResponse } from "./types"



export const API_LOCATION_URL = 'https://671f1b7a1dfc42991983f6dc.mockapi.io/api/v1'

export const fetchLocation = async (): Promise<LocationResponse[]> => {
  try {
    const response = await locationAPI.get('/location')
    return response.data
  } catch (error) {
    console.error('Error fetching location:', error)
    throw error
  }
}


export const fetchLocationById = async (id: string): Promise<LocationResponse> => {
  try {
    const response = await locationAPI.get(`/location/${id}`)
    return response.data
  } catch (error) {
    console.error(`Error fetching location with ID ${id}:`, error)
    throw error
  }
}
