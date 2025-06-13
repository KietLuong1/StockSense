import { UseQueryOptions, useQuery, useQueryClient } from "@tanstack/react-query"
import { SupplierResponse } from "./types"
import { fetchSuppliers } from "./api"

export function useGetListSupplier(options?: UseQueryOptions<SupplierResponse[], Error>) {
  const {
    data,
    error,
    isFetching,
    refetch: onGetAllListSupplier,
  } = useQuery({
    queryKey: ["suppliers"],
    queryFn: fetchSuppliers,
    ...options,
  })
  const queryClient = useQueryClient()

  const handleInvalidateListSupplier = () =>
    queryClient.invalidateQueries({ queryKey: ["suppliers"] })
  return { data, error, isFetching, onGetAllListSupplier, handleInvalidateListSupplier }
}
