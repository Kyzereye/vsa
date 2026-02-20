import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Nav from "../components/Nav";
import Footer from "../components/Footer";
import { fetchEvents } from "../api";
import { formatEventDateDisplay } from "../utils/date";
import { SHOW_PAST_EVENTS } from "../config";

function PastEvents({ eventType = "vsa" }) {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const title =
    eventType === "shredvets" ? "Past ShredVets Events" :
    eventType === "vsaPA" ? "Past VSA-PA Events" :
    "Past VSA Events";
  const backLink =
    eventType === "shredvets" ? "/shredvets" :
    eventType === "vsaPA" ? "/vsa-pa-events" :
    "/events";
  const backLinkText =
    eventType === "shredvets" ? "Back to ShredVets" :
    eventType === "vsaPA" ? "Back to VSA-PA Events" :
    "Back to VSA Events";

  useEffect(() => {
    if (!SHOW_PAST_EVENTS) {
      setLoading(false);
      return;
    }
    fetchEvents(eventType, { past: true })
      .then(setEvents)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [eventType]);

  return (
    <>
      <Nav />
      <main>
        <section className="hero" id="home">
          <div className="hero-content">
            <h1>{title}</h1>
            <p style={{ opacity: 0.95 }}>Events that have already taken place</p>
            <p style={{ marginTop: "1rem" }}>
              <Link to={backLink} className="cta-button" style={{ background: "var(--dark-gray)" }}>
                {backLinkText}
              </Link>
            </p>
          </div>
        </section>

        <section id="events">
          <div className="container">
            {!SHOW_PAST_EVENTS ? (
              <p style={{ textAlign: "center", color: "var(--text-gray)" }}>Past events are not currently displayed.</p>
            ) : loading ? (
              <p style={{ textAlign: "center", color: "var(--text-gray)" }}>Loading past events...</p>
            ) : error ? (
              <p style={{ textAlign: "center", color: "var(--primary-red)" }}>{error}</p>
            ) : events.length === 0 ? (
              <p style={{ textAlign: "center", color: "var(--text-gray)" }}>No past events yet.</p>
            ) : (
              <div className="events-list events-list-grid">
                {events.map(({ id, date, title: eventTitle, location, address, slug, canceled, dateChanged, locationChanged }) => (
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
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

export default PastEvents;
