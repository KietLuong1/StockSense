/* eslint-disable prettier/prettier */
import { UseQueryOptions, useQuery, useQueryClient } from '@tanstack/react-query'
import { fetchTransactions } from './api'
import { TransactionResponse } from './types'

export function useGetListTransactions(options?: UseQueryOptions<TransactionResponse[], Error>) {
  const {
    data,
    error,
    isFetching,
    refetch: onGetAllListTransactions
  } = useQuery({
    queryKey: ['imports'],
    queryFn: fetchTransactions,
    ...options
  })
  const queryClient = useQueryClient()

  const handleInvalidateListTransactions = () => queryClient.invalidateQueries({ queryKey: ['imports'] })
  return { data, error, isFetching, onGetAllListTransactions, handleInvalidateListTransactions }
}
