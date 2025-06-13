import { UseQueryOptions, useQuery, useQueryClient } from "@tanstack/react-query"
import { TransactionResponse } from "./types"
import { fetchTransactions } from "./api"

export function useGetListTransactions(options?: UseQueryOptions<TransactionResponse[], Error>) {
  const {
    data,
    error,
    isFetching,
    refetch: onGetAllListTransaction,
  } = useQuery({
    queryKey: ["transactions"],
    queryFn: fetchTransactions,
    ...options,
  })
  const queryClient = useQueryClient()

  const handleInvalidateListTransactions = () =>
    queryClient.invalidateQueries({ queryKey: ["transactions"] })

  return { data, error, isFetching, onGetAllListTransaction, handleInvalidateListTransaction: handleInvalidateListTransactions }
}
