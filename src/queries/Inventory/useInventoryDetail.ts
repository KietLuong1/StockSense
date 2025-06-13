import { UseMutationOptions, useQuery, useQueryClient } from "@tanstack/react-query"
import { InventoryResponse } from "./types"
import { fetchInventoryById } from "./api"

export function useProductDetail(options: UseMutationOptions<InventoryResponse> & { id: string }) {
  const {
    data,
    isPending: isLoadingDetail,
    isSuccess,
    error,
    refetch: getProductDetail,
  } = useQuery<InventoryResponse>({
    queryKey: ["inventories", { ...options }],
    queryFn: () => fetchInventoryById(options.id),
    ...options,
  })
  const queryClient = useQueryClient()

  const handleInvalidateDetail = () =>
    queryClient.invalidateQueries({ queryKey: ["inventories", { id: options.id }] })

  return {
    data,
    isLoadingDetail,
    isSuccess,
    error,
    getProductDetail,
    handleInvalidateDetail,
  }
}
