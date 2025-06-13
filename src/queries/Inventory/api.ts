import { InventoryResponse } from './types'
import { warehouseAPI } from "@/services/http"

export const fetchInventory = async (): Promise<InventoryResponse[]> => {
  try {
    console.log(
      "Making get list Inventories request to:",
      warehouseAPI.defaults.baseURL + "/inventory/all",
    )
    console.log("Using base URL:", warehouseAPI.defaults.baseURL)
    console.log("Fetching all inventory...")

    const response = await warehouseAPI.get("/inventory/all")

    if (response.status !== 200) {
      throw new Error("Failed to fetch inventory")
    }

    const inventories = response.data?.data?.inventories

    if (!inventories || !Array.isArray(inventories)) {
      throw new Error("Invalid response data format: `inventories` not found or not an array")
    }

    if (inventories.length === 0) {
      console.warn("No inventory found")
    } else {
      console.log(`Found ${inventories.length} items in inventory`)
    }

    console.log("Inventory data:", inventories)
    console.log("Get list Inventory successful:", response.status)

    return inventories
  } catch (error) {
    console.error("Error fetching list inventory:", error)
    throw error
  }
}


export const fetchInventoryById = async (id: string): Promise<InventoryResponse> => {
  try {
    console.log(`Fetching inventory item with ID: ${id}`)
    console.log("Using base URL:", warehouseAPI.defaults.baseURL)

    const response = await warehouseAPI.get(`/inventory/${id}`)

    if (response.status !== 200) {
      throw new Error(`Failed to fetch inventory item with ID ${id}. Status: ${response.status}`)
    }

    const inventory = response.data?.data?.inventory

    if (!inventory || typeof inventory !== "object") {
      throw new Error(`Invalid inventory item data received for ID ${id}`)
    }

    if (!inventory.id || inventory.id !== id) {
      throw new Error(`Inventory item ID mismatch or missing: expected ${id}, got ${inventory.id}`)
    }

    console.log(`Inventory item data successfully fetched and validated:`, inventory)

    return inventory
  } catch (error) {
    console.error(`Error fetching inventory item with ID ${id}:`, error)
    throw error
  }
}