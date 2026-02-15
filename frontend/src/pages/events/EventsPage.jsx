import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import Nav from "../../components/Nav";
import Footer from "../../components/Footer";
import { fetchEvents, fetchMyRegistrations } from "../../api";
import { formatEventDateDisplay } from "../../utils/date";
import { useAuth } from "../../contexts/AuthContext";

/**
 * Shared events page used by both NY (/events) and PA (/vsa-pa-events).
 * Same structure as Training and Meetings: dedicated page with hero, list, and past-events link.
 */
function EventsPage({ eventType, title, subtitle, backTo, backLabel, pastEventsLink, pastEventsLabel }) {
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

  return (
    <>
      <Nav />
      <main>
        <section className="hero hero-auth" id="home">
          <div className="hero-content">
            <h1>{title}</h1>
            <p style={{ opacity: 0.95 }}>{subtitle}</p>
            <p style={{ marginTop: "1rem" }}>
              <Link to={backTo} className="cta-button" style={{ background: "var(--dark-gray)" }}>
                {backLabel}
              </Link>
            </p>
          </div>
        </section>

        <section id="events">
          <div className="container">
            <h2 className="section-title">Upcoming events</h2>
            {loading ? (
              <p style={{ textAlign: "center", color: "var(--text-gray)" }}>Loading events...</p>
            ) : error ? (
              <p style={{ textAlign: "center", color: "var(--primary-red)" }}>{error}</p>
            ) : events.length === 0 ? (
              <p style={{ textAlign: "center", color: "var(--text-gray)" }}>No upcoming events at the moment. Check back soon.</p>
            ) : (
              <>
                <div className="events-list events-list-grid">
                  {events.map(({ id, date, title: eventTitle, location, address, slug, canceled, dateChanged, locationChanged }) => {
                    const isRegistered = token && registeredEventIds.has(id);
                    return (
                      <Link key={id} to={`/events/${slug || id}`} className="event-card event-card-link">
                        <div className="event-date">
                          {formatEventDateDisplay(date)}
                          {dateChanged && <span className="event-status-badge event-status-changed">Date Changed</span>}
                        </div>
                        <div className="event-title">
                          {eventTitle}
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
                      </Link>
                    );
                  })}
                </div>
                {pastEventsLink && pastEventsLabel && (
                  <p style={{ textAlign: "center", marginTop: "1.5rem" }}>
                    <Link to={pastEventsLink} className="cta-button" style={{ background: "var(--dark-gray)" }}>
                      {pastEventsLabel}
                    </Link>
                  </p>
                )}
              </>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

export default EventsPage;
