import { ProductResponse } from "./types"
import { warehouseAPI } from "@/services/http"

export const fetchProducts = async (): Promise<ProductResponse[]> => {
  try {
    console.log(
      "Making get list Products request to:",
      warehouseAPI.defaults.baseURL + "/products/all",
    )
    console.log("Using base URL:", warehouseAPI.defaults.baseURL)
    console.log("Fetching all products...")

    const response = await warehouseAPI.get("/products/all")

    if (response.status !== 200) {
      throw new Error("Failed to fetch products")
    }

    const products = response.data?.products

    if (!products || !Array.isArray(products)) {
      throw new Error("Invalid response data format: `products` not found or not an array")
    }

    if (products.length === 0) {
      console.warn("No products found")
    } else {
      console.log(`Found ${products.length} products`)
    }

    console.log("Products data:", products)
    console.log("Get list Products successful:", response.status)

    return products
  } catch (error) {
    console.error("Error fetching list products:", error)
    throw error
  }
}

export const fetchProductById = async (id: string): Promise<ProductResponse> => {
  try {
    console.log(`Fetching product with ID: ${id}`)
    console.log("Using base URL:", warehouseAPI.defaults.baseURL)

    const response = await warehouseAPI.get(`/products/${id}`)

    if (response.status !== 200) {
      throw new Error(`Failed to fetch product with ID ${id}. Status: ${response.status}`)
    }

    const product = response.data

    if (!product || typeof product !== "object") {
      throw new Error(`Invalid product data received for ID ${id}`)
    }

    if (!product.id || product.id !== id) {
      throw new Error(`Product ID mismatch or missing: expected ${id}, got ${product.id}`)
    }

    console.log(`Product data successfully fetched and validated:`, product)

    return product
  } catch (error) {
    console.error(`Error fetching product with ID ${id}:`, error)
    throw error
  }
}
