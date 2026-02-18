# Redundant and Unnecessary Code Report

**Generated:** Review of the full VSA codebase (frontend, backend, SQL, config).  
**Scope:** All of `/frontend`, `/backend`, `/migrations`, `/sql_queries.sql`, and project config.  
**No code was changed;** this is analysis only.

---

## 1. Dead / unused code

### 1.1 Unused data files (frontend)

| File | Issue |
|------|--------|
| `frontend/src/data/users.js` | Exports `MOCK_USERS`. Never imported anywhere. File comment says "will be replaced with backend API calls" — API is in use; this is leftover mock data. |
| `frontend/src/data/gallery.js` | Exports `GALLERY_IMAGES`. Never imported. Gallery uses `fetchMedia` from the API instead. |

**Recommendation:** Remove both files or move to a `/legacy` or `/mocks` folder if you want to keep for reference.

### 1.2 Unused backend module

| File | Issue |
|------|--------|
| `backend/src/models/userModel.js` | Exports in-memory `users` array (bcrypt-hashed test users). Not imported anywhere. App uses MySQL and `user_details`; auth uses DB, not this module. |

**Recommendation:** Delete `userModel.js` or keep only if you have a separate script/tool that still uses it.

### 1.3 Unused backend function

| Location | Issue |
|----------|--------|
| `backend/src/models/emailVerificationModel.js` | `cleanupExpiredTokens()` is exported but never called (no cron, no route, no server startup call). Expired email verification tokens are never purged. |

**Recommendation:** Either call `cleanupExpiredTokens()` on a schedule or at server startup, or remove the function if you do not need cleanup.

---

## 2. Redundant / duplicated logic

### 2.1 API base URL (frontend)

The same base URL is defined in four places:

| File | Variable | Usage |
|------|----------|--------|
| `frontend/src/api/index.js` | `API_BASE` | All API helpers (fetchEvents, updateUser, etc.) |
| `frontend/src/pages/Profile.jsx` | `API_BASE_URL` | Direct `fetch()` for profile update, reset password, delete, email resend |
| `frontend/src/contexts/AuthContext.jsx` | `API_BASE_URL` | Direct `fetch()` for login, register, refreshUser |
| `frontend/src/pages/VerifyEmail.jsx` | `API_BASE_URL` | Direct `fetch()` for email verify |

All use: `import.meta.env.VITE_API_URL || "http://localhost:3333/api"`.

**Recommendation:** Export a single base (e.g. from `api/index.js`) and import it in Profile, AuthContext, and VerifyEmail so the URL and env behavior live in one place.

### 2.2 Profile update vs API helper

- `frontend/src/api/index.js` exports `updateUser(id, data, token)` and uses it in Admin.
- `frontend/src/pages/Profile.jsx` does not use it; it builds its own `fetch(\`${API_BASE_URL}/users/${user.id}\`, { method: "PUT", ... })`.

**Recommendation:** Have Profile call `updateUser(user.id, formData, token)` from the API module so user-update logic is not duplicated.

### 2.3 JWT secret (backend)

The same fallback is defined in two files:

| File | Line (approx.) |
|------|-----------------|
| `backend/src/controllers/authController.js` | `const JWT_SECRET = process.env.JWT_SECRET \|\| "your-secret-key-change-in-production";` |
| `backend/src/middleware/auth.js` | Same `JWT_SECRET` constant |

**Recommendation:** Define `JWT_SECRET` once (e.g. in a small `config` or `env` module) and import it in both authController and middleware.

### 2.4 Event SELECT column list (backend)

`backend/src/controllers/eventController.js` uses the same long SELECT list in three places:

- `getEvents`: `const eventCols = "events.id, events.date, ... instructor_id, team_profiles.name AS instructor_name"` then used in a template string.
- `getEventById`: full SELECT string in `connection.execute(...)`.
- `getEventBySlug`: same full SELECT string again.

**Recommendation:** Define one module-level constant (e.g. `EVENT_SELECT_COLS` or reuse `eventCols`) and reuse it in all three so column changes happen in one place.

### 2.5 UPLOADS_ROOT and __dirname (backend)

- `backend/src/routes/media.js`: `const UPLOADS_ROOT = path.join(path.dirname(__dirname), "..", "uploads");`
- `backend/src/controllers/mediaController.js`: same `UPLOADS_ROOT` and same `__dirname`/path pattern.

**Recommendation:** Put `UPLOADS_ROOT` (and optionally `__dirname`) in one shared module (e.g. a small `paths.js` or inside an existing config) and import in both files.

### 2.6 dotenv.config() (backend)

Called in three places:

- `backend/src/server.js`
- `backend/src/config/database.js`
- `backend/src/services/emailService.js`

**Recommendation:** Rely on `server.js` (and optionally `config/database.js` if scripts run DB without server). Remove from `emailService.js` unless you have a use case that loads only the email service without the server.

### 2.7 Media type lists (frontend)

Two similar lists of media types:

| File | Constant | Content |
|------|----------|--------|
| `frontend/src/components/AdminMedia.jsx` | `TYPES` | gallery, event, page, team, document (labels: Gallery, Event, Page, Team, Document) |
| `frontend/src/components/MediaLibrary.jsx` | `TYPES` | Same plus `{ value: "", label: "All" }` and labels "Events", "Documents" |

**Recommendation:** Share one source of truth (e.g. `constants/mediaTypes.js`) and derive the "All" option and any label variants in the components.

### 2.8 Date formatting (frontend)

- `frontend/src/utils/date.js`: `formatEventDateDisplay`, `formatDateDDMMMYYYY` (used by Admin and others).
- `frontend/src/pages/training/TrainingPage.jsx`: local `formatPastTrainingDate(dateStr)` — formats as "month long, day numeric, year numeric".
- `frontend/src/pages/meetings/MeetingsPage.jsx`: local `formatMeetingDate(dateStr)` — similar, with weekday.

Both local functions duplicate the same pattern: parse date, check NaN, then `toLocaleDateString`. They could be replaced by a shared helper in `utils/date.js` (e.g. `formatLongDate` with options) so date logic stays in one place.

**Recommendation:** Add one or two helpers in `utils/date.js` and use them in TrainingPage and MeetingsPage; remove the local formatters.

---

## 3. Event type label map (frontend)

In `frontend/src/components/AdminEvents.jsx`, the same event-type-to-label map appears twice:

- Add form: multiple `<option value="vsaNY">VSA NY (home page)</option>` etc.
- Table cell (inline): `{({ vsaNY: "VSA NY", vsaPA: "VSA PA", ... }[event.eventType \|\| event.status] \|\| "VSA NY")}`

**Recommendation:** Define a single constant (e.g. `EVENT_TYPE_LABELS`) and use it for both the dropdown options and the table display so labels stay consistent and editable in one place.

---

## 4. Optional / low-priority notes

- **fetchEventById:** Used only in `EventDetail.jsx` when the route param looks like a numeric id. Kept is correct; no redundancy.
- **getProgramById / getNewsById:** Used by backend routes; no issue.
- **Two resetPassword implementations:** One in authController (public reset with token), one in userController (admin reset for a user). Different routes and purposes; not redundant.
- **components/index.js:** Does not export `MediaLibrary` or `PageLayout`; they are imported directly where needed. Acceptable; no change required unless you want every component re-exported from the barrel.

---

## 5. Summary table

| Category | Item | Location(s) | Severity |
|----------|------|-------------|----------|
| Dead code | Mock / unused data | `frontend/src/data/users.js`, `frontend/src/data/gallery.js` | Medium |
| Dead code | Unused user model | `backend/src/models/userModel.js` | Medium |
| Dead code | Unused cleanup | `cleanupExpiredTokens` in emailVerificationModel.js | Low |
| Redundant | API base URL | Profile, AuthContext, VerifyEmail, api/index.js | Medium |
| Redundant | Profile update | Profile.jsx vs api updateUser | Medium |
| Redundant | JWT_SECRET | authController.js, middleware/auth.js | Low |
| Redundant | Event SELECT columns | eventController.js (3 places) | Low |
| Redundant | UPLOADS_ROOT / paths | media.js, mediaController.js | Low |
| Redundant | dotenv.config | server.js, database.js, emailService.js | Low |
| Redundant | Media TYPES | AdminMedia.jsx, MediaLibrary.jsx | Low |
| Redundant | Date formatters | TrainingPage, MeetingsPage vs utils/date.js | Low |
| Duplicate map | Event type labels | AdminEvents.jsx (options + table) | Low |

---

*End of report. No code was modified.*
