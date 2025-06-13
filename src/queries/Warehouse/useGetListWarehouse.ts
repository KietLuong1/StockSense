import { UseQueryOptions, useQuery, useQueryClient } from "@tanstack/react-query"
import { WarehouseResponse } from "./types"
import { fetchWarehouses } from "./api"

export function useGetListWarehouse(options?: UseQueryOptions<WarehouseResponse[], Error>) {
  const {
    data,
    error,
    isFetching,
    refetch: onGetAllListWarehouse,
  } = useQuery({
    queryKey: ["warehouses"],
    queryFn: fetchWarehouses,
    ...options,
  })
  const queryClient = useQueryClient()

  const handleInvalidateListWarehouse = () =>
    queryClient.invalidateQueries({ queryKey: ["warehouses"] })

  return { data, error, isFetching, onGetAllListWarehouse, handleInvalidateListWarehouse }
}
