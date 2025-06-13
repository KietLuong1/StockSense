import { TransactionResponse } from "./types"
import { warehouseAPI } from "@/services/http"

export const fetchTransactions = async (): Promise<TransactionResponse[]> => {
  try {
    console.log(
      "Making get list Transactions request to:",
      warehouseAPI.defaults.baseURL + "/transactions/all",
    )
    console.log("Using base URL:", warehouseAPI.defaults.baseURL)
    console.log("Fetching all transactions...")

    const response = await warehouseAPI.get("/transactions/all")

    if (response.status !== 200) {
      throw new Error("Failed to fetch transactions")
    }

    const transactions = response.data?.transactions

    if (!transactions || !Array.isArray(transactions)) {
      throw new Error("Invalid response data format: `transactions` not found or not an array")
    }

    if (transactions.length === 0) {
      console.warn("No transactions found")
    } else {
      console.log(`Found ${transactions.length} transactions`)
    }

    console.log("Transactions data:", transactions)
    console.log("Get list Transactions successful:", response.status)

    return transactions
  } catch (error) {
    console.error("Error fetching list transactions:", error)
    throw error
  }
}

export const fetchTransactionById = async (id: string): Promise<TransactionResponse> => {
  try {
    console.log(`Fetching transaction with ID: ${id}`)
    console.log("Using base URL:", warehouseAPI.defaults.baseURL)

    const response = await warehouseAPI.get(`/transactions/${id}`)

    if (response.status !== 200) {
      throw new Error(`Failed to fetch transaction with ID ${id}. Status: ${response.status}`)
    }

    const transaction = response.data

    if (!transaction || typeof transaction !== "object") {
      throw new Error(`Invalid transaction data received for ID ${id}`)
    }

    if (!transaction.id || transaction.id !== id) {
      throw new Error(`Transaction ID mismatch or missing: expected ${id}, got ${transaction.id}`)
    }

    console.log(`Transaction data successfully fetched and validated:`, transaction)

    return transaction
  } catch (error) {
    console.error(`Error fetching transaction with ID ${id}:`, error)
    throw error
  }
}
