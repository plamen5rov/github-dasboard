import { useCallback, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import type { SortField, SortOrder } from '../lib/utils'

export interface SortState {
  field: SortField
  order: SortOrder
}

const DEFAULT_SORT: SortState = {
  field: 'stars',
  order: 'desc',
}

function parseSort(searchParams: URLSearchParams): SortState {
  return {
    field: (searchParams.get('sort') as SortField) || DEFAULT_SORT.field,
    order: (searchParams.get('order') as SortOrder) || DEFAULT_SORT.order,
  }
}

export function useSort() {
  const [searchParams, setSearchParams] = useSearchParams()
  const sort = useMemo(() => parseSort(searchParams), [searchParams])

  const setSort = useCallback(
    (updates: Partial<SortState>) => {
      const newParams = new URLSearchParams(searchParams)
      if (updates.field) {
        newParams.set('sort', updates.field)
      }
      if (updates.order) {
        newParams.set('order', updates.order)
      }
      setSearchParams(newParams)
    },
    [searchParams, setSearchParams],
  )

  const toggleOrder = useCallback(() => {
    const newParams = new URLSearchParams(searchParams)
    const currentOrder = newParams.get('order') || DEFAULT_SORT.order
    newParams.set('order', currentOrder === 'asc' ? 'desc' : 'asc')
    setSearchParams(newParams)
  }, [searchParams, setSearchParams])

  return { sort, setSort, toggleOrder }
}
