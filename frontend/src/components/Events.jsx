import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { fetchEvents } from "../api";

function Events({ onRegisterClick, eventType = "vsa", sectionTitle = "Upcoming Events" }) {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchEvents(eventType)
      .then(setEvents)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [eventType]);

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
          {events.map(({ id, date, title, location, slug, canceled, dateChanged, locationChanged }) => {
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
                  {locationChanged && <span className="event-status-badge event-status-changed">Location Changed</span>}
                </div>
              </>
            );
            if (slug) {
              return (
                <Link key={id} to={`/events/${slug}`} className="event-card event-card-link">
                  {content}
                </Link>
              );
            }
            return (
              <div key={id} className="event-card">
                {content}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default Events;
