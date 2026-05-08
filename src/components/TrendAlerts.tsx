import { usePersonalization } from '../hooks/usePersonalization'
import { formatDistanceToNow, parseISO } from 'date-fns'

interface TrendAlertsProps {
  isOpen: boolean
  onClose: () => void
}

function TrendAlerts({ isOpen, onClose }: TrendAlertsProps) {
  const { prefs, markAlertRead, markAllAlertsRead, clearReadAlerts } = usePersonalization()
  const unreadAlerts = prefs.alerts.filter((a) => !a.read)
  const readAlerts = prefs.alerts.filter((a) => a.read)

  if (!isOpen) return null

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'bookmark_spike': return '🔖'
      case 'collection_trending': return '📁'
      case 'watchlist_match': return '👁️'
      case 'followed_topic_hot': return '#️⃣'
      default: return '🔔'
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onClose}>
      <div
        className="w-full max-w-lg max-h-[80vh] bg-github-darker border border-github-border rounded-xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b border-github-border">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold text-github-text">Trend Alerts</h2>
            {unreadAlerts.length > 0 && (
              <span className="px-2 py-0.5 bg-github-accent/20 text-github-accent rounded-full text-xs font-medium">
                {unreadAlerts.length} new
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-1 text-github-muted hover:text-github-text focus:outline-none focus:ring-2 focus:ring-github-accent rounded"
            aria-label="Close trend alerts"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-4 overflow-y-auto max-h-[60vh]">
          {prefs.alerts.length === 0 ? (
            <div className="text-center py-8">
              <svg className="mx-auto w-12 h-12 text-github-muted mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <p className="text-github-muted">No alerts yet</p>
              <p className="text-xs text-github-muted mt-1">Follow topics and bookmark repos to get started</p>
            </div>
          ) : (
            <div className="space-y-3">
              {unreadAlerts.length > 0 && (
                <div className="flex gap-2 mb-2">
                  <button
                    onClick={markAllAlertsRead}
                    className="text-xs text-github-accent hover:underline focus:outline-none"
                  >
                    Mark all as read
                  </button>
                </div>
              )}

              {prefs.alerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`p-3 rounded-lg border transition-colors ${
                    alert.read
                      ? 'bg-github-dark/50 border-github-border/50'
                      : 'bg-github-dark border-github-accent/30'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <span className="text-lg flex-shrink-0 mt-0.5">{getAlertIcon(alert.type)}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className={`text-sm font-medium ${alert.read ? 'text-github-muted' : 'text-github-text'}`}>
                          {alert.title}
                        </h4>
                        {!alert.read && (
                          <span className="w-2 h-2 bg-github-accent rounded-full flex-shrink-0 mt-1.5" />
                        )}
                      </div>
                      <p className="text-xs text-github-muted mt-1">{alert.message}</p>
                      <p className="text-xs text-github-muted/60 mt-2">
                        {formatDistanceToNow(parseISO(alert.timestamp), { addSuffix: true })}
                      </p>
                    </div>
                  </div>
                  {!alert.read && (
                    <button
                      onClick={() => markAlertRead(alert.id)}
                      className="mt-2 text-xs text-github-accent hover:underline focus:outline-none"
                    >
                      Mark as read
                    </button>
                  )}
                </div>
              ))}

              {readAlerts.length > 0 && (
                <button
                  onClick={clearReadAlerts}
                  className="w-full text-xs text-github-muted hover:text-github-text focus:outline-none py-2"
                >
                  Clear {readAlerts.length} read alert{readAlerts.length !== 1 ? 's' : ''}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default TrendAlerts
