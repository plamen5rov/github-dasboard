import { useState } from 'react'
import { usePersonalization } from '../hooks/usePersonalization'

interface IgnoreListManagerProps {
  isOpen: boolean
  onClose: () => void
}

function IgnoreListManager({ isOpen, onClose }: IgnoreListManagerProps) {
  const { prefs, ignoreTopic, unignoreTopic, ignoreLanguage, unignoreLanguage } = usePersonalization()
  const [newTopic, setNewTopic] = useState('')
  const [newLanguage, setNewLanguage] = useState('')

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onClose}>
      <div
        className="w-full max-w-lg max-h-[80vh] bg-github-darker border border-github-border rounded-xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b border-github-border">
          <h2 className="text-lg font-semibold text-github-text">Ignore List</h2>
          <button
            onClick={onClose}
            className="p-1 text-github-muted hover:text-github-text focus:outline-none focus:ring-2 focus:ring-github-accent rounded"
            aria-label="Close ignore list panel"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
            </svg>
          </button>
        </div>

        <div className="p-4 overflow-y-auto max-h-[60vh] space-y-6">
          <div>
            <h3 className="text-sm font-medium text-github-text mb-3">Ignored Topics</h3>
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={newTopic}
                onChange={(e) => setNewTopic(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && newTopic.trim()) {
                    ignoreTopic(newTopic.trim().toLowerCase())
                    setNewTopic('')
                  }
                }}
                placeholder="Add topic to ignore..."
                className="flex-1 px-3 py-2 bg-github-dark border border-github-border rounded-lg text-sm text-github-text placeholder-github-muted focus:outline-none focus:ring-2 focus:ring-github-accent"
              />
              <button
                onClick={() => {
                  if (newTopic.trim()) {
                    ignoreTopic(newTopic.trim().toLowerCase())
                    setNewTopic('')
                  }
                }}
                className="px-4 py-2 bg-red-600/20 text-red-400 border border-red-600/30 rounded-lg hover:bg-red-600/30 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                Ignore
              </button>
            </div>

            {prefs.ignoredTopics.length === 0 ? (
              <p className="text-xs text-github-muted">No ignored topics</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {prefs.ignoredTopics.map((topic) => (
                  <span
                    key={topic}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-600/10 text-red-400 border border-red-600/20 rounded-full text-sm"
                  >
                    <span className="text-xs">#</span>
                    {topic}
                    <button
                      onClick={() => unignoreTopic(topic)}
                      className="ml-1 text-red-400/60 hover:text-white focus:outline-none"
                      aria-label={`Stop ignoring topic ${topic}`}
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-github-border">
            <h3 className="text-sm font-medium text-github-text mb-3">Ignored Languages</h3>
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={newLanguage}
                onChange={(e) => setNewLanguage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && newLanguage.trim()) {
                    ignoreLanguage(newLanguage.trim())
                    setNewLanguage('')
                  }
                }}
                placeholder="Add language to ignore..."
                className="flex-1 px-3 py-2 bg-github-dark border border-github-border rounded-lg text-sm text-github-text placeholder-github-muted focus:outline-none focus:ring-2 focus:ring-github-accent"
              />
              <button
                onClick={() => {
                  if (newLanguage.trim()) {
                    ignoreLanguage(newLanguage.trim())
                    setNewLanguage('')
                  }
                }}
                className="px-4 py-2 bg-red-600/20 text-red-400 border border-red-600/30 rounded-lg hover:bg-red-600/30 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                Ignore
              </button>
            </div>

            {prefs.ignoredLanguages.length === 0 ? (
              <p className="text-xs text-github-muted">No ignored languages</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {prefs.ignoredLanguages.map((language) => (
                  <span
                    key={language}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-600/10 text-red-400 border border-red-600/20 rounded-full text-sm"
                  >
                    {language}
                    <button
                      onClick={() => unignoreLanguage(language)}
                      className="ml-1 text-red-400/60 hover:text-white focus:outline-none"
                      aria-label={`Stop ignoring language ${language}`}
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default IgnoreListManager
