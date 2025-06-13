import { UseMutationOptions, useQuery, useQueryClient } from "@tanstack/react-query"
import { SupplierResponse } from "./types"
import { fetchSupplierById } from "./api"

export function useSupplierDetail(options: UseMutationOptions<SupplierResponse> & { id: string }) {
  const {
    data,
    isPending: isLoadingDetail,
    isSuccess,
    error,
    refetch: getSupplierDetail,
  } = useQuery<SupplierResponse>({
    queryKey: ["suppliers", { id: options.id }],
    queryFn: () => fetchSupplierById(options.id),
    ...options,
  })
  const queryClient = useQueryClient()

  const handleInvalidateDetail = () =>
    queryClient.invalidateQueries({ queryKey: ["suppliers", { id: options.id }] })

  return {
    data,
    isLoadingDetail,
    isSuccess,
    error,
    getSupplierDetail,
    handleInvalidateDetail,
  }
}
