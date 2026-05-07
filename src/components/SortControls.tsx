import { SORT_OPTIONS } from '../lib/constants'
import type { SortState } from '../hooks/useSort'

interface SortControlsProps {
  sort: SortState
  onSortChange: (field: SortState['field']) => void
  onToggleOrder: () => void
}

function SortControls({ sort, onSortChange, onToggleOrder }: SortControlsProps) {
  return (
    <div className="flex items-center gap-2">
      <label htmlFor="sort-select" className="sr-only">
        Sort by
      </label>
      <select
        id="sort-select"
        value={sort.field}
        onChange={(e) => onSortChange(e.target.value as SortState['field'])}
        className="px-3 py-1.5 bg-github-darker border border-github-border rounded-lg text-sm text-github-text focus:outline-none focus:ring-2 focus:ring-github-accent cursor-pointer"
        aria-label="Sort repositories by"
      >
        {SORT_OPTIONS.map((option) => (
          <option key={option.field} value={option.field}>
            {option.icon} {option.label}
          </option>
        ))}
      </select>
      <button
        onClick={onToggleOrder}
        className="p-1.5 bg-github-darker border border-github-border rounded-lg text-github-muted hover:text-github-text focus:outline-none focus:ring-2 focus:ring-github-accent"
        aria-label={`Switch to ${sort.order === 'asc' ? 'descending' : 'ascending'} order`}
        title={sort.order === 'asc' ? 'Ascending' : 'Descending'}
      >
        {sort.order === 'asc' ? (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
          </svg>
        ) : (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        )}
      </button>
    </div>
  )
}

export default SortControls
