import { useState } from "react";
import { formatPhoneDisplay } from "../utils/phone";

function AdminRegistrations({ registrations = [], events = [] }) {
  const [eventFilter, setEventFilter] = useState(""); // "" = all events

  const filtered =
    eventFilter === ""
      ? registrations
      : registrations.filter((r) => String(r.eventId) === String(eventFilter));

  const hasRegistrations = registrations.length > 0;
  const hasFilteredResults = filtered.length > 0;

  return (
    <>
      {hasRegistrations && (
        <div style={{ marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap" }}>
          <label htmlFor="admin-reg-event-filter" style={{ fontWeight: 600, color: "var(--dark-gray)" }}>
            Show:
          </label>
          <select
            id="admin-reg-event-filter"
            value={eventFilter}
            onChange={(e) => setEventFilter(e.target.value)}
            className="admin-select"
            style={{ maxWidth: "400px", minWidth: "200px" }}
          >
            <option value="">All events</option>
            {events
              .slice()
              .sort((a, b) => (a.date || "").localeCompare(b.date || ""))
              .map((ev) => (
                <option key={ev.id} value={ev.id}>
                  {ev.title} — {ev.date}
                </option>
              ))}
          </select>
          {eventFilter !== "" && (
            <span style={{ color: "var(--text-gray)", fontSize: "0.9rem" }}>
              {filtered.length} sign-up{filtered.length !== 1 ? "s" : ""} for this event
            </span>
          )}
        </div>
      )}

      {!hasRegistrations && (
        <p style={{ color: "var(--text-gray)", marginTop: "1rem" }}>
          No event registrations yet.
        </p>
      )}

      {hasRegistrations && !hasFilteredResults && (
        <p style={{ color: "var(--text-gray)", marginTop: "1rem" }}>
          No sign-ups for this event.
        </p>
      )}

      {hasFilteredResults && (
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Event</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Message</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => (
                <tr key={r.id}>
                  <td>{r.eventTitle}</td>
                  <td>{r.name}</td>
                  <td>
                    <a href={`mailto:${r.email}`}>{r.email}</a>
                  </td>
                  <td>{r.phone ? formatPhoneDisplay(r.phone) : "—"}</td>
                  <td style={{ maxWidth: "200px", overflow: "hidden", textOverflow: "ellipsis" }} title={r.message || ""}>
                    {r.message || "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}

export default AdminRegistrations;
