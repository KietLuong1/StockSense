import { SupplierResponse } from "./types"
import { warehouseAPI } from "@/services/http"

export const fetchSuppliers = async (): Promise<SupplierResponse[]> => {
  try {
    console.log(
      "Making get list Products request to:",
      warehouseAPI.defaults.baseURL + "/suppliers/all",
    )
    console.log("Using base URL:", warehouseAPI.defaults.baseURL)
    console.log("Fetching all suppliers...")

    const response = await warehouseAPI.get("/suppliers/all")

    if (response.status !== 200) {
      throw new Error("Failed to fetch suppliers")
    }

    const suppliers = response.data?.suppliers

    if (!suppliers || !Array.isArray(suppliers)) {
      throw new Error("Invalid response data format: `suppliers` not found or not an array")
    }

    if (suppliers.length === 0) {
      console.warn("No suppliers found")
    } else {
      console.log(`Found ${suppliers.length} suppliers`)
    }

    console.log("Suppliers data:", suppliers)
    console.log("Get list Suppliers successful:", response.status)

    return suppliers
  } catch (error) {
    console.error("Error fetching list suppliers:", error)
    throw error
  }
}

export const fetchSupplierById = async (id: string): Promise<SupplierResponse> => {
  try {
    console.log(`Fetching supplier with ID: ${id}`)
    console.log("Using base URL:", warehouseAPI.defaults.baseURL)

    const response = await warehouseAPI.get(`/suppliers/${id}`)

    if (response.status !== 200) {
      throw new Error(`Failed to fetch supplier with ID ${id}. Status: ${response.status}`)
    }

    const supplier = response.data

    if (!supplier || typeof supplier !== "object") {
      throw new Error(`Invalid supplier data received for ID ${id}`)
    }

    if (!supplier.id || supplier.id !== id) {
      throw new Error(`Supplier ID mismatch or missing: expected ${id}, got ${supplier.id}`)
    }

    console.log(`Supplier data successfully fetched and validated:`, supplier)

    return supplier
  } catch (error) {
    console.error(`Error fetching supplier with ID ${id}:`, error)
    throw error
  }
}
