import { isOSILicense } from '../lib/utils'

interface LicenseBadgeProps {
  spdxId: string | null
}

function LicenseBadge({ spdxId }: LicenseBadgeProps) {
  if (!spdxId || spdxId === 'NOASSERTION') {
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-github-border text-github-muted">
        No License
      </span>
    )
  }

  const isOSI = isOSILicense(spdxId)

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
        isOSI
          ? 'bg-green-900/30 text-green-400'
          : 'bg-github-border text-github-muted'
      }`}
    >
      {isOSI ? 'Open Source' : spdxId}
    </span>
  )
}

export default LicenseBadge
