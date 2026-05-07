import { useCallback, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import type { TimeRange } from '../lib/constants'

export interface FilterState {
  timeRange: TimeRange
  language: string[]
  licenseType: 'all' | 'open_source' | 'no_license' | string
  minStars: number
  topics: string[]
  includeArchived: boolean
  includeForks: boolean
  keyword: string
}

const DEFAULT_FILTERS: FilterState = {
  timeRange: 'week',
  language: [],
  licenseType: 'all',
  minStars: 0,
  topics: [],
  includeArchived: false,
  includeForks: false,
  keyword: '',
}

function parseFilters(searchParams: URLSearchParams): FilterState {
  return {
    timeRange: (searchParams.get('timeRange') as TimeRange) || DEFAULT_FILTERS.timeRange,
    language: searchParams.getAll('language'),
    licenseType: searchParams.get('licenseType') || DEFAULT_FILTERS.licenseType,
    minStars: parseInt(searchParams.get('minStars') || '0', 10),
    topics: searchParams.getAll('topics'),
    includeArchived: searchParams.get('includeArchived') === 'true',
    includeForks: searchParams.get('includeForks') === 'true',
    keyword: searchParams.get('keyword') || '',
  }
}

export function useFilters() {
  const [searchParams, setSearchParams] = useSearchParams()
  const filters = useMemo(() => parseFilters(searchParams), [searchParams])

  const updateFilters = useCallback(
    (updates: Partial<FilterState>) => {
      const newParams = new URLSearchParams(searchParams)
      Object.entries(updates).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          newParams.delete(key)
          value.forEach((v) => newParams.append(key, v))
        } else if (value === '' || value === false || value === 0) {
          newParams.delete(key)
        } else {
          newParams.set(key, String(value))
        }
      })
      setSearchParams(newParams)
    },
    [searchParams, setSearchParams],
  )

  const resetFilters = useCallback(() => {
    setSearchParams(new URLSearchParams())
  }, [setSearchParams])

  const activeFilterCount = useMemo(() => {
    let count = 0
    if (filters.language.length > 0) count++
    if (filters.licenseType !== 'all') count++
    if (filters.minStars > 0) count++
    if (filters.topics.length > 0) count++
    if (filters.includeArchived) count++
    if (filters.includeForks) count++
    if (filters.keyword) count++
    return count
  }, [filters])

  return { filters, updateFilters, resetFilters, activeFilterCount }
}
