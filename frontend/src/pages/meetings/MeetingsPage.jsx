import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Nav from "../../components/Nav";
import Footer from "../../components/Footer";
import { fetchEvents } from "../../api";

function formatMeetingDate(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return String(dateStr);
  return d.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/**
 * Shared meetings page used by both NY (/meetings) and PA (/vsa-pa-meetings).
 * Meeting cards link to event detail for consistency with training and other event lists.
 */
function MeetingsPage({ eventType, title, subtitle, backTo, backLabel }) {
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchEvents(eventType)
      .then(setMeetings)
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
            <p style={{ opacity: 0.95 }}>{subtitle}</p>
            <p style={{ marginTop: "1rem" }}>
              <Link to={backTo} className="cta-button" style={{ background: "var(--dark-gray)" }}>
                {backLabel}
              </Link>
            </p>
          </div>
        </section>

        <section id="meetings">
          <div className="container">
            {loading ? (
              <p style={{ textAlign: "center", color: "var(--text-gray)" }}>Loading meetings...</p>
            ) : error ? (
              <p style={{ textAlign: "center", color: "var(--primary-red)" }}>{error}</p>
            ) : meetings.length === 0 ? (
              <p style={{ textAlign: "center", color: "var(--text-gray)" }}>No meetings scheduled.</p>
            ) : (
              <div className="meetings-list">
                {meetings.map(({ id, date, title: meetingTitle, location, slug }) => (
                  <Link key={id} to={`/events/${slug || id}`} className="meeting-card" style={{ display: "block", textDecoration: "none", color: "inherit" }}>
                    <div className="meeting-date">{formatMeetingDate(date)}</div>
                    <div className="meeting-title">{meetingTitle}</div>
                    <div className="meeting-location">
                      <span className="meeting-location-badge">{location}</span>
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

export default MeetingsPage;
