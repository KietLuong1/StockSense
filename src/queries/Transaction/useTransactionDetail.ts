import { UseMutationOptions, useQuery, useQueryClient } from "@tanstack/react-query"
import { TransactionResponse } from "./types"
import { fetchTransactionById } from "./api"

export function useTransactionDetail(options: UseMutationOptions<TransactionResponse> & { id: string }) {
  const {
    data,
    isPending: isLoadingDetail,
    isSuccess,
    error,
    refetch: getTransactionDetail
  } = useQuery<TransactionResponse>({
    queryKey: ["transactions", { id: options.id }],
    queryFn: () => fetchTransactionById(options.id),
    ...options
  })
  const queryClient = useQueryClient()

  const handleInvalidateDetail = () => queryClient.invalidateQueries({ queryKey: ["transactions", { id: options.id }] })

  return {
    data,
    isLoadingDetail,
    isSuccess,
    error,
    getTransactionDetail,
    handleInvalidateDetail
  }
}
