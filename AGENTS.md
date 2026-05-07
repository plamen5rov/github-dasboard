# AGENTS.md — GitHub Trending Repos Explorer

## Project Overview

Build a web application that surfaces **trending and popular GitHub repositories** with rich filtering, sorting, and discovery capabilities. The app fetches data from the GitHub public API and presents it in a polished, fast, interactive UI.

---

## Goals

- Display trending/popular GitHub repositories in real time
- Allow users to filter by open source license, language, topic, and more
- Sort by stars, forks, open pull requests, issues, recent activity, and contributors
- Provide a clean, responsive UI suited for developers

---

## Tech Stack

| Layer        | Choice                              |
|--------------|-------------------------------------|
| Framework    | React (Vite) or Next.js (App Router)|
| Styling      | Tailwind CSS + CSS Variables        |
| Data Source  | GitHub REST API v3 / GraphQL API v4 |
| State        | React Query (TanStack Query)        |
| Routing      | React Router v6 or Next.js routing  |
| Auth (opt.)  | GitHub OAuth (for higher rate limits)|
| Testing      | Vitest + React Testing Library      |

---

## Architecture

```
src/
├── components/
│   ├── RepoCard.tsx          # Individual repo display card
│   ├── RepoGrid.tsx          # Grid/list layout for repo cards
│   ├── FilterBar.tsx         # All filter controls
│   ├── SortControls.tsx      # Sort dropdown/tabs
│   ├── LanguageBadge.tsx     # Color-coded language indicator
│   ├── LicenseBadge.tsx      # Open source / proprietary badge
│   └── SearchInput.tsx       # Keyword search
├── hooks/
│   ├── useRepos.ts           # Main data-fetching hook (GitHub API)
│   ├── useFilters.ts         # Filter state management
│   └── useSort.ts            # Sort state management
├── lib/
│   ├── github.ts             # GitHub API client (REST + GraphQL)
│   ├── constants.ts          # Languages, licenses, sort options
│   └── utils.ts              # Formatting helpers (stars: "12.4k")
├── pages/
│   ├── Home.tsx              # Main trending feed
│   ├── RepoDetail.tsx        # Expanded repo view (optional)
│   └── Settings.tsx          # API token input, preferences
├── types/
│   └── github.ts             # TypeScript types for API responses
└── App.tsx
```

---

## Data Source: GitHub API

### Primary Endpoints

**Search repositories** (REST):
```
GET https://api.github.com/search/repositories
  ?q=<query>&sort=<field>&order=desc&per_page=30&page=1
```

**GraphQL** (for PR counts, which REST search does not expose natively):
```graphql
query TrendingRepos($query: String!, $first: Int!) {
  search(query: $query, type: REPOSITORY, first: $first) {
    nodes {
      ... on Repository {
        name
        owner { login avatarUrl }
        description
        stargazerCount
        forkCount
        openGraphImageUrl
        primaryLanguage { name color }
        licenseInfo { spdxId name }
        pullRequests(states: OPEN) { totalCount }
        issues(states: OPEN) { totalCount }
        pushedAt
        url
      }
    }
  }
}
```

> **Note**: The GitHub REST search API does **not** support sorting by open PR count directly.
> Use the GraphQL API for PR counts and perform client-side sorting, or fetch PR counts
> per-repo with a secondary request.

### Rate Limits

| Auth state         | Rate limit           |
|--------------------|----------------------|
| Unauthenticated    | 60 requests/hour     |
| OAuth token        | 5,000 requests/hour  |
| GitHub App token   | 15,000 requests/hour |

- Always display the current rate limit status in the UI (use `X-RateLimit-Remaining` header).
- Persist the OAuth token in `localStorage` and include it in all API requests.
- Cache responses with React Query (`staleTime: 5 * 60 * 1000` — 5 minutes).

---

## Features

### 1. Trending Feed

- Default view: repositories pushed/updated in the **last 7 days**, sorted by stars
- Time range selector: **Today / This Week / This Month**
- Pagination or infinite scroll (prefer infinite scroll for discovery UX)

### 2. Filters

| Filter             | Implementation detail                                              |
|--------------------|--------------------------------------------------------------------|
| **Open Source**    | Check `licenseInfo.spdxId` — any non-null, non-"NOASSERTION" value is open source. Show toggle: All / Open Source Only / No License |
| **Language**       | Multi-select from a curated list + "Other". Use `language:<name>` in query string |
| **Topic / Tag**    | Free-text chip input — maps to `topic:<tag>` in query             |
| **Stars range**    | Slider or `stars:>N` query syntax (e.g., `stars:>1000`)           |
| **License type**   | Dropdown: MIT, Apache-2.0, GPL-3.0, BSD, etc.                     |
| **Archived repos** | Toggle to show/hide `archived:true` repos (default: hide)         |
| **Fork filter**    | Toggle to show/hide forks (default: hide)                         |

### 3. Sort Options

| Sort key             | API sort value / notes                                         |
|----------------------|----------------------------------------------------------------|
| ⭐ Most Starred       | `sort=stars`                                                   |
| 🍴 Most Forked        | `sort=forks`                                                   |
| 🔀 Most Open PRs      | Client-side sort on `pullRequests.totalCount` (GraphQL)        |
| 🐛 Most Open Issues   | `sort=help-wanted-issues` or client-side on `issues.totalCount`|
| 🕐 Recently Updated   | `sort=updated`                                                 |
| ✨ Best Match         | `sort=` (omit — GitHub default relevance)                      |

### 4. Repo Card

Each card should display:
- **Repo name** + owner avatar
- **Description** (truncated to 2 lines)
- **Primary language** with color dot
- **License badge** — green "Open Source" / gray "No License" / label of license type
- **Star count**, **fork count**, **open PR count**, **open issue count**
- **Last pushed** (relative time: "3 hours ago")
- **Topics/tags** as clickable chips (clicking adds to filter)
- Link to GitHub repo (opens in new tab)

### 5. Search

- Keyword search maps directly to GitHub search query `q=<keyword>`
- Combine with active filters: `q=<keyword> language:TypeScript stars:>500`
- Debounce input by 400ms before firing API call

---

## State Management

```ts
// Filter state shape
interface FilterState {
  timeRange: 'day' | 'week' | 'month';
  language: string[];
  licenseType: 'all' | 'open_source' | 'no_license' | string; // spdxId
  minStars: number;
  topics: string[];
  includeArchived: boolean;
  includeForks: boolean;
  keyword: string;
}

// Sort state shape
interface SortState {
  field: 'stars' | 'forks' | 'updated' | 'pull_requests' | 'issues' | 'best_match';
  order: 'asc' | 'desc';
}
```

- Store filter/sort state in **URL search params** so results are shareable and bookmarkable.
- Sync state with `useSearchParams` (React Router) or `useRouter` / `useSearchParams` (Next.js).

---

## UI/UX Guidelines

- **Dark mode by default** — developers prefer it; offer a toggle.
- **Responsive** — single-column on mobile, 2-col on tablet, 3-col on desktop.
- **Skeleton loading** — show placeholder cards while fetching; never show a blank screen.
- **Empty states** — friendly message + reset-filters CTA when no results match.
- **Error states** — distinguish between rate limit errors (show countdown) and network errors (show retry button).
- **Accessibility** — all interactive elements keyboard-navigable; ARIA labels on icon-only buttons.
- **Performance** — virtualize long lists with `@tanstack/react-virtual` if rendering 100+ cards.

---

## Authentication Flow (Optional but Recommended)

1. User clicks "Connect GitHub" button in the header.
2. Redirect to GitHub OAuth: `https://github.com/login/oauth/authorize?client_id=<ID>&scope=public_repo`
3. Handle callback, exchange code for token via a small backend route (Next.js API route or BFF).
4. Store token in `localStorage`; include as `Authorization: Bearer <token>` header.
5. Show avatar + username in header when authenticated.
6. Display rate limit usage: `Remaining: 4,823 / 5,000`.

> For a purely frontend app (no backend), instruct users to paste a **Personal Access Token (PAT)**
> in a settings drawer. Store it in `localStorage`. Never commit tokens to source control.

---

## Environment Variables

```env
# .env.local
VITE_GITHUB_CLIENT_ID=your_oauth_app_client_id
VITE_GITHUB_TOKEN=optional_pat_for_development
```

---

## Testing Requirements

| Test type        | Coverage target                                    |
|------------------|----------------------------------------------------|
| Unit             | `github.ts` API client, `utils.ts` formatters      |
| Component        | `RepoCard`, `FilterBar`, `SortControls`            |
| Integration      | Filter + sort interaction updates URL params       |
| E2E (optional)   | Playwright: load page → apply filter → see results |

Mock GitHub API responses in tests using `msw` (Mock Service Worker).

---

## Implementation Notes for Agents

1. **Start with the GitHub API client** (`lib/github.ts`) before building UI — confirm the query shape and response types first.
2. **Open PR count requires GraphQL**. Do not try to retrieve it from the REST search endpoint — it is not available there.
3. **"Trending" is approximated**: GitHub has no public trending API. Simulate trending by querying `pushed:>YYYY-MM-DD stars:>50` and sorting by stars. Adjust the date based on the selected time range.
4. **License filtering**: The REST search API supports `license:<spdxId>` as a query qualifier. For the "Open Source Only" toggle, fetch without license filter then client-side filter on `licenseInfo !== null`, or use `license:mit OR license:apache-2.0 ...` compound queries (limited support).
5. **Avoid N+1 requests**: Do not fetch PR counts individually per repo. Use a single GraphQL query that retrieves all data for a page of results in one request.
6. **URL-driven state is a hard requirement** — every filter/sort combination must produce a unique, shareable URL.
7. **No hardcoded language lists** — fetch available languages dynamically or use a well-maintained static list (e.g., `linguist` languages YAML).

---

## Agent Workflow Rules

1. **Auto commit/push**: After each major feature is implemented, suggest commit+push to GitHub. When the user says "ok", commit and push without asking for permissions.
2. **DONE.md changelog**: Log every change in a `DONE.md` file at the project root.

## Definition of Done

- [ ] Trending repos load on first visit with no auth required
- [ ] All filters described above are functional and composable
- [ ] All sort options work correctly, including open PR count
- [ ] Open source filter correctly identifies repos with OSI-approved licenses
- [ ] URL reflects current filter/sort state and is bookmarkable
- [ ] GitHub PAT can be entered in settings to increase rate limits
- [ ] Rate limit status is visible in the UI
- [ ] Dark/light mode toggle works
- [ ] Responsive on mobile, tablet, and desktop
- [ ] Skeleton loading and error states are implemented
- [ ] Unit and component tests pass (`pnpm test`)
- [ ] No TypeScript errors (`pnpm typecheck`)
- [ ] No accessibility violations on core flows (axe-core audit)
