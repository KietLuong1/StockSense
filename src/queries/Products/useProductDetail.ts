import { UseMutationOptions, useQuery, useQueryClient } from "@tanstack/react-query"
import { ProductResponse } from "./types"
import { fetchProductById } from "./api"

export function useProductDetail(options: UseMutationOptions<ProductResponse> & { id: string }) {
  const {
    data,
    isPending: isLoadingDetail,
    isSuccess,
    error,
    refetch: getProductDetail,
  } = useQuery<ProductResponse>({
    queryKey: ["products", { ...options }],
    queryFn: () => fetchProductById(options.id),
    ...options,
  })
  const queryClient = useQueryClient()

  const handleInvalidateDetail = () =>
    queryClient.invalidateQueries({ queryKey: ["products", { id: options.id }] })

  return {
    data,
    isLoadingDetail,
    isSuccess,
    error,
    getProductDetail,
    handleInvalidateDetail,
  }
}
