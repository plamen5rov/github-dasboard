import { useState, useEffect, useCallback } from 'react'

interface SearchInputProps {
  value: string
  onChange: (value: string) => void
}

function SearchInput({ value, onChange }: SearchInputProps) {
  const [inputValue, setInputValue] = useState(value)

  const debouncedUpdate = useCallback(
    (val: string) => {
      const timer = setTimeout(() => onChange(val), 400)
      return () => clearTimeout(timer)
    },
    [onChange],
  )

  useEffect(() => {
    if (inputValue !== value) {
      const cleanup = debouncedUpdate(inputValue)
      return cleanup
    }
  }, [inputValue, value, debouncedUpdate])

  useEffect(() => {
    setInputValue(value)
  }, [value])

  return (
    <div className="relative">
      <svg
        className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-github-muted"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="Search repositories..."
        className="w-full pl-10 pr-4 py-2 bg-github-darker border border-github-border rounded-lg text-github-text placeholder-github-muted focus:outline-none focus:ring-2 focus:ring-github-accent focus:border-transparent"
        aria-label="Search repositories"
      />
    </div>
  )
}

export default SearchInput
