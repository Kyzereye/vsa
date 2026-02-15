# VSA Project — All Functions

Generated list of functions in the codebase (frontend and backend), by file.

---

## Frontend

### `frontend/src/App.jsx`
- `App()` — Root app component

### `frontend/src/api/index.js`
- `authHeaders(token)` — (internal) Build auth headers
- `fetchUsers(token)`
- `updateUser(id, data, token)`
- `deleteUser(id, token)`
- `requestPasswordReset(email)`
- `resetPassword(token, newPassword)`
- `fetchEvents(eventType, options = {})`
- `fetchEventBySlug(slug)`
- `fetchEventById(id)`
- `createRegistration({ eventId, name, email, phone, message }, token = null)`
- `fetchMyRegistrations(token)`
- `deleteRegistration(id, token)`
- `fetchRegistrations(token)`
- `fetchPrograms()`
- `fetchNews()`
- `createEvent(data, token)`
- `updateEvent(id, data, token)`
- `deleteEvent(id, token)`
- `createProgram(data, token)`
- `updateProgram(id, data, token)`
- `deleteProgram(id, token)`
- `createNews(data, token)`
- `updateNews(id, data, token)`
- `deleteNews(id, token)`
- `galleryImageUrl(url)`
- `fetchGallery()`
- `uploadGalleryImage(formData, token)`
- `deleteGalleryImage(id, token)`
- `getMembershipPdf(data)`
- `submitMembership(data)`

### `frontend/src/components/About.jsx`
- `About()` — About section component

### `frontend/src/components/AdminEvents.jsx`
- `AdminEvents({ events, onUpdate, onAdd, onDelete })` — Admin events table/form

### `frontend/src/components/AdminGallery.jsx`
- `AdminGallery({ gallery, events, onUpload, onDelete })` — Admin gallery management

### `frontend/src/components/AdminNews.jsx`
- `AdminNews({ news, onUpdate, onAdd, onDelete })` — Admin news CRUD

### `frontend/src/components/AdminPrograms.jsx`
- `AdminPrograms({ programs, onUpdate, onAdd, onDelete })` — Admin programs CRUD

### `frontend/src/components/AdminRegistrations.jsx`
- `AdminRegistrations({ registrations, events })` — Admin registrations list

### `frontend/src/components/Contact.jsx`
- `Contact()` — Contact section component

### `frontend/src/components/Events.jsx`
- `Events({ onRegisterClick, eventType, sectionTitle, pastEventsLink, pastEventsLabel })` — Events list (upcoming)

### `frontend/src/components/ExpansionPanel.jsx`
- `ExpansionPanel({ title, summary, defaultExpanded, disabled, className, children })` — Collapsible panel

### `frontend/src/components/Footer.jsx`
- `Footer()` — Site footer

### `frontend/src/components/Gallery.jsx`
- `Gallery()` — Gallery section component

### `frontend/src/components/Hero.jsx`
- `Hero()` — Hero section component

### `frontend/src/components/Nav.jsx`
- `Nav()` — Main navigation (header, menu, dropdowns)

### `frontend/src/components/News.jsx`
- `News()` — News section component

### `frontend/src/components/PasswordRequirements.jsx`
- `PasswordRequirements({ password })` — Password strength/requirements display

### `frontend/src/components/Programs.jsx`
- `Programs()` — Programs section component

### `frontend/src/components/ProtectedRoute.jsx`
- `ProtectedRoute({ children, requireAdmin })` — Auth guard for routes

### `frontend/src/components/RegistrationDialog.jsx`
- `RegistrationDialog({ open, onClose, event })` — Event registration modal

### `frontend/src/components/ScrollToTop.jsx`
- `ScrollToTop()` — Scroll-to-top on route change

### `frontend/src/contexts/AuthContext.jsx`
- `AuthProvider({ children })` — Auth state provider
- `useAuth()` — Auth context hook

### `frontend/src/pages/Admin.jsx`
- `Admin()` — Admin dashboard (tabs: users, events, programs, news, registrations, gallery)

### `frontend/src/pages/EventDetail.jsx`
- `EventDetail()` — Single event/course detail page

### `frontend/src/pages/ForgotPassword.jsx`
- `ForgotPassword()` — Forgot password form

### `frontend/src/pages/Home.jsx`
- `Home()` — Home page (hero, about, programs, events, news, gallery, contact)

### `frontend/src/pages/Login.jsx`
- `Login()` — Login form

### `frontend/src/pages/Meetings.jsx`
- `formatMeetingDate(dateStr)` — (internal) Format meeting date
- `Meetings()` — NY organizational meetings page

### `frontend/src/pages/Membership.jsx`
- `Membership()` — Membership application page

### `frontend/src/pages/PastEvents.jsx`
- `PastEvents({ eventType })` — Past events list (vsa / shredvets / vsaPA)

### `frontend/src/pages/Profile.jsx`
- `Profile()` — User profile and registrations

### `frontend/src/pages/Register.jsx`
- `Register()` — User registration form

### `frontend/src/pages/ResetPassword.jsx`
- `ResetPassword()` — Reset password form (with token)

### `frontend/src/pages/ShredVets.jsx`
- `ShredVets()` — ShredVets page

### `frontend/src/pages/Training.jsx`
- `formatPastTrainingDate(dateStr)` — (internal) Format past training date
- `Training()` — NY training page (upcoming + past)

### `frontend/src/pages/VerifyEmail.jsx`
- `VerifyEmail()` — Email verification page

### `frontend/src/pages/VsaPA.jsx`
- `VsaPA()` — VSA Pennsylvania page

### `frontend/src/pages/VsaPAMeetings.jsx`
- `formatMeetingDate(dateStr)` — (internal) Format meeting date
- `VsaPAMeetings()` — VSA-PA organizational meetings page

### `frontend/src/pages/VsaPATraining.jsx`
- `formatPastTrainingDate(dateStr)` — (internal) Format past training date
- `VsaPATraining()` — VSA-PA training page (upcoming + past)

### `frontend/src/utils/date.js`
- `formatDateDDMMMYYYY(date)`
- `formatEventDateDisplay(date)`

### `frontend/src/utils/password.js`
- `getPasswordRequirements(password)`
- `getPasswordError(password)`
- `getPasswordWithConfirmError(password, confirmPassword)`

### `frontend/src/utils/phone.js`
- `formatPhoneDisplay(phone)`
- `normalizePhoneForSubmit(phone)`

---

## Backend

### `backend/src/controllers/authController.js`
- `register` (async) — User registration
- `login` (async) — Login, returns JWT
- `requestPasswordReset` (async) — Request password reset email
- `resetPassword` (async) — Reset password with token

### `backend/src/controllers/eventController.js`
- `parseEventDate(dateStr)` — (internal) Parse event date string
- `slugify(text, suffix)` — (internal) URL-safe slug
- `formatDateValue(val)` — (internal) Format date for API
- `formatEvent(row)` — (internal) Format event row
- `getEvents` (async) — List events (filter by event_type, time)
- `getEventById` (async) — Get event by ID
- `getEventBySlug` (async) — Get event + details by slug
- `createEvent` (async) — Create event
- `updateEvent` (async) — Update event
- `deleteEvent` (async) — Delete event

### `backend/src/controllers/galleryController.js`
- `formatGalleryRow(row)` — (internal) Format gallery row
- `getGallery` (async) — List gallery images
- `uploadImage` (async) — Upload gallery image
- `deleteImage` (async) — Delete gallery image

### `backend/src/controllers/membershipController.js`
- `formatPhoneForPdf(phone)` — (internal)
- `row(doc, left, labelWidth, y, label, value, fontSize)` — (internal) PDF row helper
- `buildMembershipPdf(data)` — Build membership PDF buffer
- `getMembershipPdf` (async) — GET membership PDF (req/res)
- `submitMembership` (async) — Submit membership application

### `backend/src/controllers/newsController.js`
- `formatNews(row)` — (internal) Format news row
- `getNews` (async) — List news
- `getNewsById` (async) — Get news by ID
- `createNews` (async) — Create news
- `updateNews` (async) — Update news
- `deleteNews` (async) — Delete news

### `backend/src/controllers/programController.js`
- `formatProgram(row)` — (internal) Format program row
- `getPrograms` (async) — List programs
- `getProgramById` (async) — Get program by ID
- `createProgram` (async) — Create program
- `updateProgram` (async) — Update program
- `deleteProgram` (async) — Delete program

### `backend/src/controllers/registrationController.js`
- `createRegistration` (async) — Create event registration
- `getMyRegistrations` (async) — Get current user’s registrations
- `deleteRegistration` (async) — Delete/cancel registration
- `getRegistrations` (async) — Get all registrations (admin)

### `backend/src/controllers/userController.js`
- `getUsers` (async) — List users (admin)
- `getUserById` (async) — Get user by ID
- `updateUser` (async) — Update user
- `deleteUser` (async) — Delete user
- `resetPassword` (async) — Admin reset user password

### `backend/src/controllers/emailVerificationController.js`
- `verifyEmail` (async) — Verify email with token
- `resendVerificationEmail` (async) — Resend verification email

### `backend/src/services/emailService.js`
- `sendVerificationEmail(email, name, verificationToken)` (async)
- `sendEmailChangeVerificationEmail(email, name, verificationToken)` (async)
- `sendPasswordResetEmail(email, name, resetToken)` (async)
- `sendRegistrationConfirmationEmail(recipientEmail, recipientName, event)` (async)
- `sendMembershipSubmission(data, pdfBuffer)` (async)
- `sendMembershipCopyToApplicant(data, pdfBuffer)` (async)

### `backend/src/middleware/auth.js`
- `authenticateToken` — JWT auth middleware
- `optionalAuth` — Optional JWT (attach user if present)
- `requireAdmin` — Require admin role

### `backend/src/models/emailVerificationModel.js`
- `generateVerificationToken()`
- `storeVerificationToken(userId, email, token, isEmailChange)` (async)
- `verifyToken(token)` (async)
- `deleteVerificationToken(token)` (async)
- `cleanupExpiredTokens()` (async)

### `backend/src/models/passwordResetModel.js`
- `generateResetToken()`
- `storeResetToken(userId, token)` (async)
- `verifyResetToken(token)` (async)
- `deleteResetToken(token)` (async)

### `backend/src/utils/membership.js`
- `getMembershipPdfFilename(data)`

### `backend/src/utils/phone.js`
- `normalizePhoneToDigits(phone)`

### `backend/src/routes/gallery.js`
- `uploadErrorHandler(err, req, res, next)` — Multer/upload error handler

---

## Redundant / Duplicate Functions

Functions that do the same (or nearly the same) thing in more than one place. Consolidating them would reduce duplication and keep behavior consistent.

### 1. **formatMeetingDate(dateStr)** — duplicate

| Location | Purpose |
|----------|---------|
| `frontend/src/pages/Meetings.jsx` | Format meeting date as "weekday, month day, year" |
| `frontend/src/pages/VsaPAMeetings.jsx` | Same implementation (identical code) |

**Recommendation:** Move a single `formatMeetingDate` into `frontend/src/utils/date.js` and import it in both `Meetings.jsx` and `VsaPAMeetings.jsx`.

---

### 2. **formatPastTrainingDate(dateStr)** — duplicate

| Location | Purpose |
|----------|---------|
| `frontend/src/pages/Training.jsx` | Format past training date as "month day, year" |
| `frontend/src/pages/VsaPATraining.jsx` | Same implementation (identical code) |

**Recommendation:** Move a single `formatPastTrainingDate` into `frontend/src/utils/date.js` and import it in both `Training.jsx` and `VsaPATraining.jsx`. Optionally, add a small helper in `date.js` that accepts format options so one function can cover both “meeting” (with weekday) and “past training” (month, day, year) styles.

---

### 3. **Phone normalization (digits only)** — same logic, two names

| Location | Function | Purpose |
|----------|----------|---------|
| `frontend/src/utils/phone.js` | `normalizePhoneForSubmit(phone)` | Strip non-digits, return up to 10 digits or null |
| `backend/src/utils/phone.js` | `normalizePhoneToDigits(phone)` | Same logic |

**Recommendation:** Keep both if frontend and backend must stay independent; otherwise share one implementation (e.g. a small shared package or copy one implementation and use the same name in both codebases) so phone handling stays identical.

---

### 4. **Phone display formatting (XXX) XXX-XXXX** — duplicate

| Location | Function | Purpose |
|----------|----------|---------|
| `frontend/src/utils/phone.js` | `formatPhoneDisplay(phone)` | Format 10 digits as `(XXX) XXX-XXXX` |
| `backend/src/controllers/membershipController.js` | `formatPhoneForPdf(phone)` | Same output format for PDF |

**Recommendation:** Logic is the same; only the use (UI vs PDF) differs. Backend could call a shared formatter in `backend/src/utils/phone.js` (e.g. `formatPhoneDisplay`) used by the membership controller so display rules live in one place.

---

### 5. **Backend row formatters** — same pattern, different entities

| Location | Function | Purpose |
|----------|----------|---------|
| `backend/src/controllers/eventController.js` | `formatEvent(row)` | Map DB row → API shape |
| `backend/src/controllers/newsController.js` | `formatNews(row)` | Map DB row → API shape |
| `backend/src/controllers/programController.js` | `formatProgram(row)` | Map DB row → API shape |
| `backend/src/controllers/galleryController.js` | `formatGalleryRow(row)` | Map DB row → API shape |

**Recommendation:** These are not redundant; each maps different columns and field names. They follow the same pattern (row → camelCase API object) but should stay separate unless you introduce a generic mapper (e.g. by config per entity). No change required unless you refactor for a shared pattern.

---

### Summary

| Category | Redundant? | Action |
|----------|------------|--------|
| `formatMeetingDate` (Meetings vs VsaPAMeetings) | Yes | Move to `utils/date.js`, import in both pages |
| `formatPastTrainingDate` (Training vs VsaPATraining) | Yes | Move to `utils/date.js`, import in both pages |
| Phone normalization (frontend vs backend) | Same logic | Optional: share or align naming |
| Phone display (frontend vs membershipController) | Same logic | Optional: backend uses shared formatter |
| Backend formatNews/formatProgram/formatEvent/formatGalleryRow | Same pattern, different data | Keep as-is |
