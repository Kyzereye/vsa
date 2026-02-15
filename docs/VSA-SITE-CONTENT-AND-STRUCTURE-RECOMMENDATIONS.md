# VSA Website Content & Structure Recommendations

**Source:** [veteranssportsmensassociation.org](https://www.veteranssportsmensassociation.org/)  
**Purpose:** What to keep vs. retire, and how to organize content in the new VSA app.  
**No code changes** — planning only.

---

## 1. What’s on the Current Site (Menu / “More” and Related)

From the live site, the main and “More” areas include:

| Category | Items |
|----------|--------|
| **Core nav** | Home, About the VSA, ShredVets, Yearly Schedule, Membership & Raffle Tickets |
| **Training** | Law Enforcement Training, Civilian Firearms Training, NRA courses, NYS Pistol Permit Safety, CRASE, RSO, Precision Rifle, etc. |
| **Recurring events / programs** | Let Freedom Ring, Whiskey Bourbon & BBQ, Team River Runner Hudson Valley, Wappingers Creek Water Derby, Veterans Day Dinner & Turkey Shoot |
| **Places / partners** | Memorial FOP Lodge #596, Korean War Veterans Memorial Park, Local Area Ranges, Tommy Gun Warehouse / Kahr Arms |
| **Chapters / org** | VSA - Pennsylvania |
| **Programs / initiatives** | Veterans Safe Project, Brothers in Arms, Team Instructors |
| **Annual recaps** | Past Whiskey Events, 2024 At A Glance, 2023 At A Glance, 2022 At A Glance, 2021 At A Glance |
| **Member / utility** | Website Members, VSA Forum, Shop, Book Online, Donate, Privacy Page |

There is also a lot of **news-style content**: press, event recaps, donations (Honor Flight, Toys for Tots, Hurricane relief, etc.), and one-off event pages (e.g. Water Derby years, Let Freedom Ring, Whiskey events).

---

## 2. What to Keep vs. Let Go

### 2.1 Keep (core to the new site)

- **About the VSA** — Who you are, mission, 501(c)(3), “Veterans Serving Veterans.” (Already on Home; can be the single source of truth.)
- **Membership & applications** — Join / renew; already in the app as `/membership`.
- **ShredVets** — Already a first-class section (`/shredvets` + past events). Keep as-is.
- **Upcoming events** — Central to the site; drive signups and awareness. Keep and power from your **Events** data (same as current app).
- **Past events (general)** — One “Past Events” list (e.g. `/past-events`) is enough; no need to keep every old event as its own page.
- **Meetings** — Org/board and general member meetings. Already in app as `/meetings`.
- **Contact** — Address, phone, email, hours. Keep one Contact section (e.g. on Home and/or footer).
- **Donate** — Important for a 501(c)(3). Keep one clear path (link or page).
- **Training (as a concept)** — Keep “we do training” and **upcoming** training events (NRA, pistol permit, LE, civilian, etc.) as **events** in your Events system, not as dozens of separate nav items.
- **Recurring flagship events** — Treat as recurring event types, not permanent nav items:
  - Whiskey Bourbon & BBQ  
  - Wappingers Creek Water Derby  
  - Let Freedom Ring  
  - Veterans Day Dinner & Turkey Shoot  
  Each **year** can be one event (with date, description, signup) instead of a whole page per year.
- **Team River Runner (HV TRR)** — Keep as a program; one page or a program block on Home is enough unless it grows to ShredVets-level.
- **VSA - Pennsylvania** — Keep as a destination; plan for a dedicated section (e.g. `/vsa-pa` or “Other sites”) like ShredVets when ready.

### 2.2 Simplify or merge (don’t drop, but don’t mirror the old structure)

- **Yearly Schedule** — Fold into **Events** (upcoming + past). No separate “Yearly Schedule” nav; the event list is the schedule.
- **Law Enforcement Training / Civilian Firearms Training** — Don’t keep as separate top-level items. Represent as **event types** or filters (e.g. “Training” tag) and one “Training” or “Programs” blurb on Home or Programs.
- **Raffle tickets** — Can live under Membership or as an event type (e.g. “2025 Raffle” event with ticket link).
- **Local Area Ranges, Memorial FOP Lodge, Korean War Veterans Memorial Park** — Either:
  - One “Partners & places” or “Locations” page, or  
  - Short mentions in Events / Programs / Contact.  
  No need for each as its own nav item.
- **Brothers in Arms, Team Instructors, Veterans Safe Project** — One “Programs” or “What we do” section that lists these (and TRR, training, etc.) with short descriptions and links to events where relevant.

### 2.3 Archive or retire (no dedicated pages in the new app)

- **“At A Glance” year pages (2021–2024)** — Useful as history, but heavy to maintain. **Recommendation:** Export to PDFs or a single “Past years” archive page (one page, optional links to PDFs or a simple list by year). Do not replicate as four separate routes.
- **Past Whiskey Events** — Becomes **past events** in your Events list (e.g. filter by “Whiskey Bourbon & BBQ”). No standalone “Past Whiskey Events” page.
- **Dedicated past-year event pages** (e.g. “Wappingers Creek 2024”, “Let Freedom Ring 2023”) — Replace with:
  - One **event detail** per instance (e.g. “Wappingers Creek Water Derby 2025”) in your Events system, and  
  - A **program** or **event type** description (e.g. “Wappingers Creek Water Derby” and “Let Freedom Ring”) that can be reused each year.
- **Website Members / VSA Forum** — If the new app has **member accounts and maybe a profile**, “Website Members” is redundant. Forum: only keep if you will actually host/maintain a forum; otherwise drop or link out to a third-party forum.
- **Shop** — Keep only if you will run a real shop in the new app; otherwise remove or link to an external shop.
- **Book Online** — Merge into Events (e.g. “Book” / “Register” on the event detail). No separate “Book Online” nav item.
- **Privacy Page** — One `/privacy` (or footer link) is enough; not part of “More” content planning.

---

## 3. How to Organize in the New Page Structure

### 3.1 Current new-app structure (for reference)

- **Home** — Hero, About, Events, Programs, News, Contact (sections)
- **ShredVets** — `/shredvets` (+ ShredVets past events)
- **Past Events** — `/past-events` (VSA)
- **Meetings** — `/meetings`
- **Membership** — `/membership`
- **Event detail** — `/events/:slug`
- Auth: Login, Register, Profile; Admin

### 3.2 Recommended top-level navigation

Keep the main nav small and predictable:

| Nav item | Purpose |
|----------|--------|
| **Home** | One-page: Hero, About, Events (upcoming), Programs, News, Gallery, Contact. |
| **Events** | Upcoming (and optionally “Past” link to `/past-events`). |
| **Programs** | ShredVets, TRR, Training (summary), other programs — or fold into Home “Programs” section. |
| **Meetings** | Org meetings (existing `/meetings`). |
| **Membership** | Join, apply, raffle info (existing `/membership`). |
| **Past Events** | Single list; filter by type/year if needed (existing `/past-events`). |
| **Other sites / More** | Dropdown: **ShredVets** (if not in main nav), **VSA - Pennsylvania** (when ready), and optionally **Donate**, **Contact**, **Privacy**. |

So: **don’t** replicate the old “More” with 20+ items. **Do** group by: Events, Programs, Membership, Meetings, and a short “Other” dropdown.

### 3.3 Where specific content lives

- **Training (all types)**  
  - **Upcoming:** Events with type/tag like “Training” (NRA, pistol permit, LE, civilian, etc.).  
  - **About training:** One “Training” or “Programs” block on Home (or one “Training” subpage) describing what you offer; link to Events.

- **Whiskey Bourbon & BBQ, Water Derby, Let Freedom Ring, Veterans Day Dinner, etc.**  
  - Each **instance** = one event in the CMS (e.g. “Whiskey Bourbon & BBQ 2026”).  
  - No “Whiskey Bourbon & BBQ” permanent page; the event detail page is the page.  
  - Optional: “Recurring events” or “Signature events” list on Home or Programs that links to event type or next occurrence.

- **Team River Runner HV**  
  - One **Program** entry: name, short description, link to events tagged “TRR” or “Kayaking.”  
  - When you have a dedicated TRR calendar, you could add `/team-river-runner` (similar to ShredVets) later.

- **VSA - Pennsylvania**  
  - **Now:** Link in “Other sites” (or “More”) to current VSA-PA page/site.  
  - **Later:** Dedicated section like ShredVets: e.g. `/vsa-pa` with its own intro, events, and maybe “VSA-PA past events.”

- **Raffles**  
  - Under Membership (text + link) or as an event (e.g. “2026 Raffle – Tickets”).

- **Partners / locations (Kahr Arms, FOP Lodge, ranges, etc.)**  
  - One “Partners” or “Locations” section on Home or one `/partners` page; no separate nav item per partner.

- **News / press**  
  - Keep as **News** on Home; optionally “News” or “Updates” in nav if you want a dedicated list page.

- **Donate**  
  - Prominent link (header/footer/Home) to your donation flow or external donation page.

### 3.4 What not to build as separate pages

- No “2021 At A Glance”, “2022 At A Glance”, etc. — use one archive or PDFs.
- No “Past Whiskey Events” — use Past Events filtered by type.
- No separate “Law Enforcement Training” and “Civilian Firearms Training” pages — use Events + one Training description.
- No standalone page per partner/location — use one Partners/Locations section or page.
- No “Book Online” as its own nav — booking/registration lives on Event detail.

---

## 4. VSA - Pennsylvania

- **Short term:** In “Other sites” (or “More”) dropdown: one link, e.g. “VSA - Pennsylvania,” pointing to the current VSA-PA presence (existing page or external site).
- **When it’s ready to be its own section:** Add a route and section similar to ShredVets:
  - `/vsa-pa` — Intro, mission, upcoming VSA-PA events, contact.
  - Optional: “VSA-PA past events” (e.g. `/vsa-pa-past-events` or filter on `/past-events` by chapter).
- Content: events and news for the PA chapter; avoid duplicating the full “More” menu there.

---

## 5. Summary Table

| Old site item | Keep? | Where it lives in new app |
|---------------|--------|----------------------------|
| About the VSA | Yes | Home #about |
| ShredVets | Yes | /shredvets (+ past) |
| Yearly Schedule | Merge | Events (upcoming + past) |
| Membership | Yes | /membership (membership only) |
| Raffle | Yes | Separate from membership (e.g. /raffle or its own nav item) |
| LE / Civilian Training | Yes, separate area | Dedicated Training page/section (see checklist) |
| Let Freedom Ring, WBB, Water Derby, etc. | Yes, as events | Events (one per instance); optional “signature events” list |
| Team River Runner | Yes | Programs (or future /team-river-runner) |
| VSA - Pennsylvania | Defer | Not a priority now; revisit later. |
| Past Whiskey, “At A Glance” years | Archive | Past events list + one archive page or PDFs |
| Partners / ranges / FOP / Kahr | Yes, simplified | One Partners or Locations section/page |
| Donate, Contact, Privacy | Yes | Footer + key links |
| Forum, Shop, Book Online | Only if you’ll use them | Omit or link out; Book = event registration |

---

## 6. Next Steps (when you’re ready to implement)

1. **Content:** List all “must have” copy (About, Programs, Training description, Partners).  
2. **Events:** Decide event types/tags (e.g. Training, ShredVets, Whiskey, Water Derby, TRR, VSA-PA).  
3. **Nav:** Implement the simplified main nav + “Other sites” (ShredVets, VSA-PA, Donate, etc.).  
4. **Archive:** If you keep “At A Glance,” create one archive page or PDF set; no per-year routes.  
5. **VSA-PA:** When ready, add `/vsa-pa` (and optional past events) using the same pattern as ShredVets.

This keeps the new site manageable while preserving the important content and fitting it into a clear, event-driven structure.

---

## 7. Refinements (agreed)

- **Past content:** Keep it, but in a condensed form. Nice to have, but most traffic will be for current/upcoming; don’t over-invest in deep past.
- **Membership vs. Raffle:** Treat as different things. Membership = join/renew (e.g. `/membership`). Raffle = its own place (e.g. `/raffle` or separate nav item).
- **Training:** Separate from the main events page. Training is a type of event but more focused; it deserves its own Training page/section (upcoming training events + description), not mixed into the general events list.
- **VSA - Pennsylvania:** Leave for later. No work on it for now.

---

## 8. Checklist (what to work on)

Use this as a working order. First priority: **Training events**.

- [ ] **1. Training events** — Dedicated Training area: page or section for upcoming (and optionally past) training events (NRA, pistol permit, LE, civilian, etc.). Separate from main Events page; can still use the same event data with a “training” type or tag.
- [ ] **2. Training content** — Short “about training” copy (what you offer, who it’s for, how to sign up). Lives on the Training page or a clear link from it.
- [ ] **3. Raffle** — Raffle as its own thing: page or nav item (e.g. `/raffle`), separate from Membership. Current raffle info + link to tickets or event if applicable.
- [ ] **4. Membership** — Confirm `/membership` is membership-only (no raffle mixed in). Adjust copy/links if needed.
- [ ] **5. Past events (condensed)** — Single past-events list; keep it manageable. Optional: one simple “archive” or condensed view for older years (e.g. by year), not many separate pages.
- [ ] **6. Main Events page** — Upcoming general events (non-training, or “all” with training linked from Training). Clear separation from Training in nav/structure.
- [ ] **7. Programs** — One Programs section or page: TRR, other programs, partners. Link to relevant events (e.g. TRR events) where it makes sense.
- [ ] **8. Nav** — Update nav to reflect: Home, Events, Training (separate), Meetings, Membership, Raffle (separate), Past Events, Other/Donate/Contact as needed. No VSA-PA for now.
- [ ] **9. Donate / Contact / Privacy** — Ensure visible in footer and/or key spots; no structural change unless missing.
- [ ] **10. VSA - Pennsylvania** — Deferred. Revisit when you’re ready to give it a dedicated section.

---

## 9. Plan: Training Events Page

Plan only (no code). Training page is a dedicated area for training classes/events, with **past training shown in a condensed way: class name + date only**.

### 9.1 Purpose

- One place for **upcoming** training (NRA, pistol permit, LE, civilian, etc.) with full details and signup.
- **Past training** listed in a minimal, scannable format: **name of class + date** only (no location, no description, no link to detail).
- Keeps training focused and separate from the main Events page.

### 9.2 Page structure

1. **Hero / intro**  
   - Title (e.g. “Training”) and short line (e.g. “Firearms and safety courses from the VSA”).  
   - Optional: 1–2 sentences about training (what you offer, who it’s for). Full “about training” copy can live here or in a small “About” block below.

2. **Upcoming training**  
   - List of **upcoming** training events (same idea as Events: cards or list with title, date, location, “More info” / “Register” linking to event detail).  
   - Only events that are marked as **training** (see Data below).  
   - If none: simple “No upcoming training at the moment. Check back soon.” (or similar).

3. **Past training (condensed)**  
   - Section title, e.g. “Past training classes.”  
   - List format: **class name** and **date** only.  
   - One line per past class (e.g. “NRA CCW Course — March 21, 2025” or “NRA Basic Rifle Course — May 30, 2025”).  
   - No cards, no location, no link to event detail (condensed as requested).  
   - Optional: group by year (e.g. “2025”, “2024”) if the list gets long; still name + date only per row.

4. **Back / nav**  
   - Link back to Home (or main Events) so the page fits the rest of the site.

### 9.3 Data: how to identify “training” events

The app currently has `event_type`: `vsa`, `shredvets`, `org`. Two options:

- **Option A — New event type `training`**  
  - Add `training` to the events `event_type` enum.  
  - Training page: fetch events where `event_type = 'training'` (upcoming and past).  
  - Main Events page: exclude `training` (only show `vsa` / `shredvets`), so training lives only on the Training page.  
  - Admin: when creating/editing an event, allow choosing “Training” so it gets `event_type = 'training'`.

- **Option B — Category / tag**  
  - Add a field like `category` or `is_training` (or a tag).  
  - Training page: fetch events where that flag/tag is set.  
  - Main Events: optionally filter out training if you don’t want them there.  
  - More flexible if you later want “training” and “vsa” on the same event; a bit more to implement.

**Recommendation:** Option A (`event_type = 'training'`) is simple and matches “training is separate from main events.” Use Option B only if you need events to appear in both “general” and “training.”

### 9.4 Route and nav

- **Route:** e.g. `/training` (one page for both upcoming and past).  
- **Nav:** Add “Training” as its own item (as in checklist item 8).  
- No separate “Past training” route; past is a section on the same `/training` page.

### 9.5 Past training: display rules

- **Show:** Only events that are training (per 9.3).  
- **Sort:** Newest first (most recent date at top), or by year then date.  
- **Per row:** **Name of class** (title) + **date** (formatted, e.g. “March 21, 2025”).  
- **No:** location, address, description, “More info” link, or card layout.  
- Optional: limit to last N years (e.g. 3–4) to keep the list manageable; older years can be dropped or collapsed.

### 9.6 Implementation order (when you write code later)

1. **Backend:** Add `training` to `event_type` (schema + API filter), or add category/tag and filter.  
2. **API:** Reuse existing events API with a “training” filter (or new endpoint that returns training-only events; past = `date < today`).  
3. **Frontend:** New page component for `/training` (e.g. `Training.jsx`): hero, upcoming list (full cards/links), past section (name + date only).  
4. **App + nav:** Add route `/training` and “Training” in the nav.  
5. **Admin:** When creating/editing events, allow setting type to “Training” (or setting the training flag).  
6. **Content:** Add short intro/“about training” copy on the page.

This gives you a single Training page with upcoming training and a condensed past list (name + date only), and a clear path for data and nav without changing any code yet.

### 9.7 How admin will handle creating and updating training events

Admin uses the **same event create/edit flow** as for VSA, ShredVets, and org meetings. The only change is one extra choice in the **Event type** dropdown.

**Creating a new training event**

1. Admin goes to Admin → Events (or wherever events are managed).  
2. Clicks “Add event” (or equivalent).  
3. Fills in the same fields as any other event: **Date**, **Title**, **Location**, **Address**, **Slug** (if used), optional “Date changed” / “Location changed” / “Canceled” checkboxes.  
4. In **Event type**, selects **Training** (new option alongside “VSA only”, “ShredVets”, “Organizational meeting”).  
5. Saves.  
6. The event is stored with `event_type = 'training'`. It appears on the **Training** page (upcoming if date is in the future, past if date has passed) and is **not** shown on the main VSA Events list.

**Updating an existing training event**

1. Admin finds the event in the events list (the table can show type, so “Training” events are visible).  
2. Clicks Edit.  
3. Changes any fields (date, title, location, type, canceled, etc.).  
4. Can change **Event type** from Training to something else (e.g. VSA only) if the event was misclassified, or from another type to Training if it should now be a training class.  
5. Saves.  
6. The Training page and main Events page both reflect the new data according to the selected type.

**Summary**

- **No separate “Training events” admin screen.** Training events are just events with type = Training.  
- **Same form, same fields.** Only the Event type dropdown gains a “Training” option.  
- **List/filter (optional):** In the admin events table, the “Type” column will show “Training” for those rows. Optionally, add a filter (e.g. “Show: All | VSA | ShredVets | Org | Training”) so admins can quickly see only training events when needed.
