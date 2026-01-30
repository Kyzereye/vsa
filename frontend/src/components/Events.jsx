import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { fetchEvents, fetchMyRegistrations } from "../api";
import { useAuth } from "../contexts/AuthContext";

function Events({ onRegisterClick, eventType = "vsa", sectionTitle = "Upcoming Events" }) {
  const { token } = useAuth();
  const [events, setEvents] = useState([]);
  const [myRegistrations, setMyRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchEvents(eventType)
      .then(setEvents)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [eventType]);

  useEffect(() => {
    if (token) {
      fetchMyRegistrations(token)
        .then(setMyRegistrations)
        .catch(() => setMyRegistrations([]));
    } else {
      setMyRegistrations([]);
    }
  }, [token]);

  const registeredEventIds = useMemo(
    () => new Set(myRegistrations.map((r) => r.eventId)),
    [myRegistrations]
  );

  if (loading) {
    return (
      <section id="events">
        <div className="container">
          <h2 className="section-title">{sectionTitle}</h2>
          <p style={{ textAlign: "center", color: "var(--text-gray)" }}>Loading events...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="events">
        <div className="container">
          <h2 className="section-title">Upcoming Events</h2>
          <p style={{ textAlign: "center", color: "var(--primary-red)" }}>{error}</p>
        </div>
      </section>
    );
  }

  return (
    <section id="events">
      <div className="container">
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", alignItems: "center", gap: "1rem", marginBottom: onRegisterClick ? "2rem" : undefined }}>
          <h2 className="section-title" style={onRegisterClick ? { marginBottom: 0 } : undefined}>{sectionTitle}</h2>
          {onRegisterClick && (
            <button type="button" className="cta-button" onClick={onRegisterClick}>
              Register for an event
            </button>
          )}
        </div>
        <div className="events-list events-list-grid">
          {events.map(({ id, date, title, location, address, slug, canceled, dateChanged, locationChanged }) => {
            const isRegistered = token && registeredEventIds.has(id);
            const content = (
              <>
                <div className="event-date">
                  {date}
                  {dateChanged && <span className="event-status-badge event-status-changed">Date Changed</span>}
                </div>
                <div className="event-title">
                  {title}
                  {canceled && <span className="event-status-badge event-status-canceled">Event Canceled</span>}
                </div>
                <div className="event-location">
                  {location}
                  {address && <div className="event-address">{address}</div>}
                  {locationChanged && <span className="event-status-badge event-status-changed">Location Changed</span>}
                </div>
                {isRegistered && !canceled && (
                  <div className="event-card-registered">
                    <span className="event-status-badge event-status-registered">You&apos;re signed up</span>
                  </div>
                )}
              </>
            );
            return (
              <Link key={id} to={`/events/${slug || id}`} className="event-card event-card-link">
                {content}
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default Events;
