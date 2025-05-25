/* eslint-disable prettier/prettier */
import { UseQueryOptions, useQuery, useQueryClient } from '@tanstack/react-query'
import { LocationResponse } from './types'
import { fetchLocation } from './api'

export function useGetListLocation(options?: UseQueryOptions<LocationResponse[], Error>) {
  const {
    data,
    error,
    isFetching,
    refetch: onGetAllListLocation
  } = useQuery({
    queryKey: ['location'],
    queryFn: fetchLocation,
    ...options
  })
  const queryClient = useQueryClient()

  const handleInvalidateListLocation = () => queryClient.invalidateQueries({ queryKey: ['location'] })
  return { data, error, isFetching, onGetAllListLocation, handleInvalidateListLocation }
}
