import { WarehouseResponse } from "./types"
import { warehouseAPI } from "@/services/http"

export const fetchWarehouses = async (): Promise<WarehouseResponse[]> => {
  try {
    console.log(
      "Making get list Warehouses request to:",
      warehouseAPI.defaults.baseURL + "/warehouses",
    )
    console.log("Using base URL:", warehouseAPI.defaults.baseURL)
    console.log("Fetching all warehouses...")

    const response = await warehouseAPI.get("/warehouses")

    if (response.status !== 200) {
      throw new Error("Failed to fetch warehouses")
    }

    const warehouses = response.data?.data?.warehouses

    if (!warehouses || !Array.isArray(warehouses)) {
      throw new Error("Invalid response data format: `warehouses` not found or not an array")
    }

    if (warehouses.length === 0) {
      console.warn("No warehouses found")
    } else {
      console.log(`Found ${warehouses.length} warehouses`)
    }

    console.log("Warehouses data:", warehouses)
    console.log("Get list Warehouses successful:", response.status)

    return warehouses
  } catch (error) {
    console.error("Error fetching list warehouses:", error)
    throw error
  }
}

export const fetchWarehouseById = async (id: string): Promise<WarehouseResponse> => {
  try {
    console.log(`Fetching warehouse with ID: ${id}`)
    console.log("Using base URL:", warehouseAPI.defaults.baseURL)

    const response = await warehouseAPI.get(`/warehouses/${id}`)

    if (response.status !== 200) {
      throw new Error(`Failed to fetch warehouse with ID ${id}. Status: ${response.status}`)
    }

    const warehouse = response.data?.data?.warehouse

    if (!warehouse || typeof warehouse !== "object") {
      throw new Error(`Invalid warehouse data received for ID ${id}`)
    }

    if (!warehouse.id || warehouse.id !== id) {
      throw new Error(`Warehouse ID mismatch or missing: expected ${id}, got ${warehouse.id}`)
    }

    console.log(`Warehouse data successfully fetched and validated:`, warehouse)

    return warehouse
  } catch (error) {
    console.error(`Error fetching warehouse with ID ${id}:`, error)
    throw error
  }
}
