import { useState } from 'react'
import { usePersonalization } from '../hooks/usePersonalization'

interface CollectionsPanelProps {
  isOpen: boolean
  onClose: () => void
}

function CollectionsPanel({ isOpen, onClose }: CollectionsPanelProps) {
  const { prefs, addCollection, deleteCollection, addToCollection, removeFromCollection } = usePersonalization()
  const [newName, setNewName] = useState('')
  const [newDescription, setNewDescription] = useState('')
  const [showCreateForm, setShowCreateForm] = useState(false)

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onClose}>
      <div
        className="w-full max-w-2xl max-h-[80vh] bg-github-darker border border-github-border rounded-xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b border-github-border">
          <h2 className="text-lg font-semibold text-github-text">Collections</h2>
          <button
            onClick={onClose}
            className="p-1 text-github-muted hover:text-github-text focus:outline-none focus:ring-2 focus:ring-github-accent rounded"
            aria-label="Close collections panel"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-4 overflow-y-auto max-h-[60vh]">
          {prefs.collections.length === 0 && !showCreateForm && (
            <div className="text-center py-8">
              <svg className="mx-auto w-12 h-12 text-github-muted mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              <p className="text-github-muted mb-3">No collections yet</p>
              <button
                onClick={() => setShowCreateForm(true)}
                className="px-4 py-2 bg-github-accent text-white rounded-lg hover:bg-github-accent/80 focus:outline-none focus:ring-2 focus:ring-github-accent"
              >
                Create your first collection
              </button>
            </div>
          )}

          {showCreateForm && (
            <div className="mb-4 p-4 bg-github-dark border border-github-border rounded-lg">
              <h3 className="text-sm font-medium text-github-text mb-3">New Collection</h3>
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Collection name"
                className="w-full px-3 py-2 bg-github-darker border border-github-border rounded-lg text-sm text-github-text placeholder-github-muted focus:outline-none focus:ring-2 focus:ring-github-accent mb-2"
              />
              <input
                type="text"
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                placeholder="Description (optional)"
                className="w-full px-3 py-2 bg-github-darker border border-github-border rounded-lg text-sm text-github-text placeholder-github-muted focus:outline-none focus:ring-2 focus:ring-github-accent mb-3"
              />
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    if (newName.trim()) {
                      addCollection(newName.trim(), newDescription.trim() || undefined)
                      setNewName('')
                      setNewDescription('')
                      setShowCreateForm(false)
                    }
                  }}
                  className="px-4 py-2 bg-github-accent text-white rounded-lg hover:bg-github-accent/80 text-sm focus:outline-none focus:ring-2 focus:ring-github-accent"
                >
                  Create
                </button>
                <button
                  onClick={() => setShowCreateForm(false)}
                  className="px-4 py-2 bg-github-border text-github-text rounded-lg hover:bg-github-border/80 text-sm focus:outline-none focus:ring-2 focus:ring-github-accent"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          <div className="space-y-3">
            {prefs.collections.map((collection) => (
              <div
                key={collection.id}
                className="p-4 bg-github-dark border border-github-border rounded-lg"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-sm font-semibold text-github-text">{collection.name}</h3>
                    {collection.description && (
                      <p className="text-xs text-github-muted mt-1">{collection.description}</p>
                    )}
                    <p className="text-xs text-github-muted mt-2">
                      {collection.repoFullNames.length} repo{collection.repoFullNames.length !== 1 ? 's' : ''} · Updated {new Date(collection.updatedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <button
                    onClick={() => deleteCollection(collection.id)}
                    className="p-1 text-github-muted hover:text-red-400 focus:outline-none focus:ring-2 focus:ring-red-500 rounded"
                    aria-label={`Delete collection ${collection.name}`}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>

                {collection.repoFullNames.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {collection.repoFullNames.map((fullName) => (
                      <span
                        key={fullName}
                        className="inline-flex items-center gap-1 px-2 py-1 bg-github-darker border border-github-border rounded text-xs text-github-text"
                      >
                        {fullName}
                        <button
                          onClick={() => removeFromCollection(collection.id, fullName)}
                          className="ml-1 text-github-muted hover:text-red-400 focus:outline-none"
                          aria-label={`Remove ${fullName} from collection`}
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="p-4 border-t border-github-border">
          <button
            onClick={() => setShowCreateForm(true)}
            className="w-full px-4 py-2 bg-github-accent/10 text-github-accent rounded-lg hover:bg-github-accent/20 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-github-accent"
          >
            + New Collection
          </button>
        </div>
      </div>
    </div>
  )
}

export default CollectionsPanel
