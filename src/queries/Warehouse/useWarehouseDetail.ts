import { UseMutationOptions, useQuery, useQueryClient } from "@tanstack/react-query"
import { WarehouseResponse } from "./types"
import { fetchWarehouseById } from "./api"

export function useWarehouseDetail(options: UseMutationOptions<WarehouseResponse> & { id: string }) {
  const {
    data,
    isPending: isLoadingDetail,
    isSuccess,
    error,
    refetch: getWarehouseDetail
  } = useQuery<WarehouseResponse>({
    queryKey: ["warehouses", { id: options.id }],
    queryFn: () => fetchWarehouseById(options.id),
    ...options
  })
  const queryClient = useQueryClient()

  const handleInvalidateDetail = () => queryClient.invalidateQueries({ queryKey: ["warehouses", { id: options.id }] })

  return {
    data,
    isLoadingDetail,
    isSuccess,
    error,
    getWarehouseDetail,
    handleInvalidateDetail
  }
}
