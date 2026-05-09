# Contributing

## Setup

```bash
npm install
npm run dev
```

## Making changes

1. Fork the repo and create a branch from `master`.
2. Run `npm run dev` and verify the app works.
3. Make your changes.
4. Run `npm run typecheck` and `npm test` — all tests must pass.
5. Update or add tests if changing functionality.
6. Update `README.md` if adding/removing features.

## Code style

- TypeScript strict mode — no `any` or implicit `any`.
- Tailwind CSS for styling — no inline styles or CSS modules.
- Components in `src/components/`, hooks in `src/hooks/`, lib in `src/lib/`.
- Tests co-located in `src/__tests__/` with `.test.ts` or `.test.tsx` suffix.

## Commit style

```
<type>: <short description>

Types: feat, fix, refactor, docs, test, chore
```

## Pull requests

- One feature/fix per PR.
- Keep PRs small and focused.
- Reference any related issues.

## Questions?

Open a discussion or issue.
