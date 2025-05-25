/* eslint-disable prettier/prettier */
import { UseQueryOptions, useQuery, useQueryClient } from '@tanstack/react-query'
import { InventoryResponse } from './types'
import { fetchInventory } from './api'

export function useGetListInventory(options?: UseQueryOptions<InventoryResponse[], Error>) {
  const {
    data,
    error,
    isFetching,
    refetch: onGetAllListinventory
  } = useQuery({
    queryKey: ['inventory'],
    queryFn: fetchInventory,
    ...options
  })
  const queryClient = useQueryClient()

  const handleInvalidateListInventory = () => queryClient.invalidateQueries({ queryKey: ['inventory'] })
  return { data, error, isFetching, onGetAllListinventory, handleInvalidateListInventory }
}
