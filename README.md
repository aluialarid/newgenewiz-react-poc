# Auth flow (session cookie + per-app JWT)

- Login: `POST /api/session/login` with email/password. ApiService creates a server session and sets HttpOnly cookie `sid` (shared across subdomains when `Auth:CookieDomain` is set, e.g., `.example.com`).
- Session restore: `GET /api/session/me` reads `sid` cookie; used on page refresh to restore user.
- Access token per UI: `POST /api/session/token?aud=<app>` returns a short-lived JWT (default 15 min). Use `aud=new-ui` for the new React UI, `aud=legacy-ui` for the legacy UI. No re-login needed because both UIs share the same `sid` cookie on the parent domain.
- API calls: Frontend keeps the JWT in memory only. Attach `Authorization: Bearer <token>` when calling protected APIs (e.g., `/api/orders`). Always send `credentials: 'include'` so the cookie flows.
- Logout: `POST /api/session/logout` clears server session and deletes the cookie with matching domain/path.

## Cookie and CORS settings
- Cookie domain: set `Auth:CookieDomain` (e.g., `.example.com`) to share across subdomains. In dev you can omit it to stay host-only.
- SameSite/Secure: default `SameSite=Lax`, `Secure=false`; for cross-site dev use `Auth:CookieSameSite=None` and `Auth:CookieSecure=true` (required by browsers).
- CORS: configure `AllowedOrigins` with exact origins of the React dev server and legacy UI (e.g., `http://localhost:5173`, `http://localhost:4173`, `https://legacy.example.com`). Policy uses `AllowCredentials`.

## JWT settings
- Configure `JwtSettings:SecretKey`, `JwtSettings:Issuer`, `JwtSettings:DefaultAudience`, and `JwtSettings:ValidAudiences` (array). Issuer/audience validation is enabled when provided.

## Frontend notes
- Tokens are cached in-memory with a 5-minute early refresh window; they are not stored in localStorage/sessionStorage.
- Session endpoints (`login`, `me`, `logout`, `token`) always use `credentials: 'include'`.

