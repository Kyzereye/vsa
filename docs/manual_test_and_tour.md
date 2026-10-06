# VSA Site: Manual Test Checklist & Page Tour

One document with (1) a checklist for manually testing all parts of the site and (2) a page tour describing how the site is structured and how to move through it.

---

## Part 1: Manual Test Checklist

Use this checklist when doing a full manual pass. Test as **not logged in**, as **logged-in member**, and as **admin** where it applies.

### Global (every page)

- [ ] **Nav bar** – Logo, Menu dropdown, Our Community dropdown (when logged in), Login/Member dropdown work and close on outside click.
- [ ] **Menu dropdown** – Opens; shows correct links for guest vs member (e.g. no News, Training, Meetings, Leadership, Media when guest); all links go to the right place.
- [ ] **Our Community** – Only visible when logged in; VSA-NY, VSA-PA, ShredVets links work.
- [ ] **Login/Member dropdown** – Shows Login/Register when guest; shows Profile, Admin (if admin), Logout when member.
- [ ] **Footer** – Correct links for guest vs member; no broken links.
- [ ] **Scroll / hash links** – From nav/footer, anchor links (e.g. #events, #about) scroll to the right section on home.

### Public pages (no login)

- [ ] **Home (/)**  
  - [ ] Hero, Upcoming Events, About Us, Our Programs, Photo Gallery, Contact render.  
  - [ ] News section does **not** appear when not logged in.  
  - [ ] Section backgrounds: Events white, About gray, Programs white, News (when shown) gray.  
  - [ ] “View past VSA events” appears only if past-events feature is on.
- [ ] **About (/about)** – Full about content and privacy/terms section.
- [ ] **Programs (/programs)** – Programs list and links.
- [ ] **Gallery (/gallery)** – Media library (all types or filtered) loads; images/docs open or download as expected.
- [ ] **Events (/events)** – Upcoming events list; event cards link to event detail; “View past events” only if feature on.
- [ ] **Event detail (/events/:slug)** – Event info, register button if applicable; back/list links work.
- [ ] **Past events** (/past-events, /shredvets-past-events, /vsa-pa-past-events) – Only if feature on; list and links work; when off, page shows “not currently displayed” or equivalent.
- [ ] **Membership (/membership)** – Form loads; validation and submit behave as designed.
- [ ] **Login (/login)** – Form works; success redirects; “Forgot password” and “Register” links work.
- [ ] **Register (/register)** – Form and validation; success and verify-email flow.
- [ ] **Forgot password (/forgot-password)** – Request flow and email (or stub).
- [ ] **Reset password (/reset-password)** – Token flow and password update.
- [ ] **Verify email (/verify-email)** – Token link and success/error handling.

### When not logged in (access control)

- [ ] **News (/news)** – Redirects to login (or shows login prompt).
- [ ] **ShredVets (/shredvets)** – Redirects to login.
- [ ] **VSA-PA** (/vsa-pa, /vsa-pa-events, /vsa-pa-training, /vsa-pa-meetings) – Redirect to login.
- [ ] **Training (/training)**, **Training instructors (/training/instructors)** – Redirect to login.
- [ ] **Leadership (/leadership)** – Redirect to login.
- [ ] **Meetings (/meetings)** – Redirect to login.
- [ ] **Profile (/profile)** – Redirect to login.
- [ ] **Admin (/admin)** – Redirect to login (or to home if not admin).

### When logged in as member (not admin)

- [ ] **Home** – News section **does** appear.
- [ ] **Menu** – Includes News, Training, Organizational Meetings, Leadership, Media, Membership.
- [ ] **News (/news)** – Page loads; list and links work.
- [ ] **ShredVets (/shredvets)** – Page loads.
- [ ] **VSA-PA** – All four routes load (landing, events, training, meetings).
- [ ] **Training (/training)** – Upcoming (and past if feature on) training list; links to event detail and instructors.
- [ ] **Training instructors (/training/instructors)** – Instructors list/cards.
- [ ] **Leadership (/leadership)** – Board & advisors and bylaws section.
- [ ] **Meetings (/meetings)** – Meetings list/content.
- [ ] **Gallery (/gallery)** – Media library view (no upload/delete).
- [ ] **Profile (/profile)** – Profile view/edit; password change; account delete (if applicable); event RSVPs/cancel.
- [ ] **Admin (/admin)** – Either not visible or redirect (e.g. to home); no admin access.

### When logged in as admin

- [ ] **Admin (/admin)** – Accessible; all tabs load without error.
- [ ] **Admin → Users** – List loads; edit user (name, email, phone, role, status, instructor #, join date with date picker); save/cancel; delete with confirmation (or equivalent).
- [ ] **Admin → Events** – List; add/edit/delete event; date picker and form validation.
- [ ] **Admin → Programs** – List; add/edit/delete program.
- [ ] **Admin → News** – List; add/edit/delete news.
- [ ] **Admin → Registered** – Registrations list and filters (if any).
- [ ] **Admin → Media** – Media list; upload (type, file); delete with confirmation dialog.
- [ ] **Admin → Board** – Leadership slots; assign/edit/remove; confirm dialog on remove; save/cancel; Enter key saves in assign/edit.

### Forms and validation

- [ ] **Membership** – Required fields, validation messages, submit and success/error handling.
- [ ] **Login/Register** – Validation and error messages; success paths.
- [ ] **Profile** – Name/email/phone/role (if editable); password change; confirm password match.
- [ ] **Admin forms** – Required fields and validation where applicable (e.g. event date, instructor number format).

### Bylaws and leadership

- [ ] **Leadership page** – Bylaws section below board & advisors; content from data file; readable layout.
- [ ] **Admin Board** – Assign name to slot; edit name; remove with confirmation; no duplicate “Remove” behavior.

### Dates and feature flags

- [ ] **Join date (admin user edit)** – Date picker shows; save stores correct date; display does not shift by timezone (e.g. Feb 2 stays Feb 2).
- [ ] **Past events** – When flag off: nav link and past-event pages show “not displayed” or similar; when on: lists and links work.
- [ ] **Past training** – When flag off: section hidden on training page; when on: section and list work.

---

## Part 2: Page Tour

A short tour of the site: what each area is and how the pieces connect.

### 1. Entry points (public)

- **Home (/)** – Landing: hero, upcoming events, about, programs, photo gallery, contact. News block only when logged in. Menu and footer drive the rest of the tour.
- **Login (/login)** and **Register (/register)** – Auth entry; Forgot password and Verify email support the flow.

### 2. Public content (no login)

- **About (/about)** – Full “About Us” and privacy/terms.
- **Programs (/programs)** – List of programs and links.
- **Gallery (/gallery)** – Media library (view only for public/members; upload/delete in Admin).
- **Events (/events)** – Upcoming VSA events; cards link to **Event detail (/events/:slug)** for one event and registration.
- **Past events** – Separate routes for VSA, ShredVets, VSA-PA; only active when feature flag is on.
- **Membership (/membership)** – Join/renew form.

### 3. Member-only areas (login required)

- **News (/news)** – Latest news list; also shown on home when logged in.
- **ShredVets (/shredvets)** – ShredVets landing/content.
- **VSA-PA** – Four routes: landing (/vsa-pa), events (/vsa-pa-events), training (/vsa-pa-training), meetings (/vsa-pa-meetings).
- **Training (/training)** – Upcoming (and past, if on) training; link to **Meet instructors (/training/instructors)**.
- **Organizational Meetings (/meetings)** – Meetings list/content.
- **Leadership (/leadership)** – Board & advisors plus bylaws (data file).
- **Media** – Same **Gallery (/gallery)** URL; “Media” in nav only when logged in; home gallery block is always visible.
- **Profile (/profile)** – View/edit profile, change password, manage RSVPs, delete account.

### 4. Admin (admin only)

- **Admin (/admin)** – Tabs: **Users** (CRUD, roles, join date), **Events**, **Programs**, **News**, **Registered**, **Media** (upload/delete), **Board** (assign/edit/remove leadership). All management is from here.

### 5. Nav and footer

- **Menu** – One dropdown with all main links; varies by guest vs member (e.g. no News/Training/Meetings/Leadership/Media for guest).
- **Our Community** – Only when logged in; switch between VSA-NY, VSA-PA, ShredVets.
- **Login/Member** – Guest: Login, Register. Member: Profile, Admin (if admin), Logout.
- **Footer** – Same idea: public links for guest; extra links (e.g. Leadership, ShredVets) when logged in.

### 6. Flow summary

- **Guest:** Home → Events, Programs, Gallery, About, Membership; Login/Register to become member.
- **Member:** Same as guest plus News, Training, Meetings, Leadership, Media in nav; ShredVets and VSA-PA; Profile.
- **Admin:** Same as member plus Admin panel for users, events, programs, news, registrations, media, and board.

Use **Part 1** for systematic testing; use **Part 2** to walk through the site and explain it to someone else.
