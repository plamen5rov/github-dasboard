# Security Policy

## Reporting a Vulnerability

This is a client-side application — no backend, no server, no database.
All data is stored in your browser's `localStorage` and never transmitted
anywhere except to GitHub's official API endpoints.

If you discover a security concern, please open an issue
or contact the maintainers directly.

## Best Practices

- **Your PAT is stored in `localStorage`** — it never leaves your browser
  and is sent only to `api.github.com`. No third party has access.
- **Never commit your PAT** to source control.
- Use a **fine-grained PAT** with minimal scopes (public repo read-only).
- Review your GitHub PATs periodically and revoke unused ones.
