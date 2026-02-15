import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Nav from "../components/Nav";
import Footer from "../components/Footer";
import { fetchEvents } from "../api";
import { formatEventDateDisplay } from "../utils/date";

function formatPastTrainingDate(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return String(dateStr);
  return d.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}

function Training() {
  const [upcoming, setUpcoming] = useState([]);
  const [past, setPast] = useState([]);
  const [loadingUpcoming, setLoadingUpcoming] = useState(true);
  const [loadingPast, setLoadingPast] = useState(true);
  const [errorUpcoming, setErrorUpcoming] = useState(null);
  const [errorPast, setErrorPast] = useState(null);

  useEffect(() => {
    fetchEvents("trainingNY")
      .then(setUpcoming)
      .catch((err) => setErrorUpcoming(err.message))
      .finally(() => setLoadingUpcoming(false));
  }, []);

  useEffect(() => {
    fetchEvents("trainingNY", { past: true })
      .then(setPast)
      .catch((err) => setErrorPast(err.message))
      .finally(() => setLoadingPast(false));
  }, []);

  return (
    <>
      <Nav />
      <main>
        <section className="hero hero-auth" id="home">
          <div className="hero-content">
            <h1>Training</h1>
            <p style={{ opacity: 0.95 }}>Firearms and safety courses from the VSA</p>
            <p style={{ marginTop: "1rem" }}>
              <Link to="/" className="cta-button" style={{ background: "var(--dark-gray)" }}>
                Back to VSA Home
              </Link>
            </p>
          </div>
        </section>

        <section id="training-upcoming">
          <div className="container">
            <h2 className="section-title">Upcoming training</h2>
            {loadingUpcoming ? (
              <p style={{ textAlign: "center", color: "var(--text-gray)" }}>Loading…</p>
            ) : errorUpcoming ? (
              <p style={{ textAlign: "center", color: "var(--primary-red)" }}>{errorUpcoming}</p>
            ) : upcoming.length === 0 ? (
              <p style={{ textAlign: "center", color: "var(--text-gray)" }}>No upcoming training at the moment. Check back soon.</p>
            ) : (
              <div className="events-list events-list-grid">
                {upcoming.map(({ id, date, title, location, address, slug, canceled, dateChanged, locationChanged }) => (
                  <Link key={id} to={`/events/${slug || id}`} className="event-card event-card-link">
                    <div className="event-date">
                      {formatEventDateDisplay(date)}
                      {dateChanged && <span className="event-status-badge event-status-changed">Date Changed</span>}
                    </div>
                    <div className="event-title">
                      {title}
                      {canceled && <span className="event-status-badge event-status-canceled">Canceled</span>}
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

        <section id="training-past">
          <div className="container">
            <h2 className="section-title">Past training classes</h2>
            {loadingPast ? (
              <p style={{ textAlign: "center", color: "var(--text-gray)" }}>Loading…</p>
            ) : errorPast ? (
              <p style={{ textAlign: "center", color: "var(--primary-red)" }}>{errorPast}</p>
            ) : past.length === 0 ? (
              <p style={{ textAlign: "center", color: "var(--text-gray)" }}>No past training on record.</p>
            ) : (
              <ul className="training-past-list">
                {past.map(({ id, date, title, canceled }) => (
                  <li key={id} className="training-past-item">
                    <span className="training-past-title">{title}</span>
                    {canceled && <span className="event-status-badge event-status-canceled" style={{ marginLeft: "0.5rem" }}>Canceled</span>}
                    <span className="training-past-date"> — {formatPastTrainingDate(date)}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

export default Training;
