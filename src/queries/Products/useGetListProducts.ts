/* eslint-disable prettier/prettier */
import { UseQueryOptions, useQuery, useQueryClient } from '@tanstack/react-query'
import { ProductResponse } from './types'
import { fetchProducts } from './api'


export function useGetListProduct(options?: UseQueryOptions<ProductResponse[], Error>) {
  const {
    data,
    error,
    isFetching,
    refetch: onGetAllListProduct
  } = useQuery({
    queryKey: ['products'],
    queryFn: fetchProducts,
    ...options
  })
  const queryClient = useQueryClient()

  const handleInvalidateListProduct = () => queryClient.invalidateQueries({ queryKey: ['products'] })
  return { data, error, isFetching, onGetAllListProduct, handleInvalidateListProduct }
}
