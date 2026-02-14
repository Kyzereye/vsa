import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Nav from "../components/Nav";
import Footer from "../components/Footer";
import { fetchEvents } from "../api";

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

function Meetings() {
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchEvents("org")
      .then(setMeetings)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <Nav />
      <main>
        <section className="hero" id="home">
          <div className="hero-content">
            <h1>Organizational Meetings</h1>
            <p style={{ opacity: 0.95 }}>VSA board and general member meetings — NY, PA, and combined</p>
            <p style={{ marginTop: "1rem" }}>
              <Link to="/" className="cta-button" style={{ background: "var(--dark-gray)" }}>
                Back to VSA Home
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
                {meetings.map(({ id, date, title, location }) => (
                  <div key={id} className="meeting-card">
                    <div className="meeting-date">{formatMeetingDate(date)}</div>
                    <div className="meeting-title">{title}</div>
                    <div className="meeting-location">
                      <span className="meeting-location-badge">{location}</span>
                    </div>
                  </div>
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

export default Meetings;
