import { useState, useEffect, useMemo } from "react";
import { Link, useParams, Navigate } from "react-router-dom";
import Nav from "../components/Nav";
import Footer from "../components/Footer";
import RegistrationDialog from "../components/RegistrationDialog";
import { fetchEventBySlug, fetchEventById, fetchMyRegistrations } from "../api";
import { useAuth } from "../contexts/AuthContext";
import { formatEventDateDisplay } from "../utils/date";

function EventDetail() {
  const { token } = useAuth();
  const [registrationOpen, setRegistrationOpen] = useState(false);
  const [event, setEvent] = useState(null);
  const [myRegistrations, setMyRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const { slug: slugOrId } = useParams();

  useEffect(() => {
    if (!slugOrId) {
      setLoading(false);
      return;
    }
    const isNumericId = /^\d+$/.test(slugOrId);
    const fetchFn = isNumericId ? () => fetchEventById(Number(slugOrId)) : () => fetchEventBySlug(slugOrId);
    fetchFn()
      .then(setEvent)
      .catch(() => setEvent(null))
      .finally(() => setLoading(false));
  }, [slugOrId]);

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
  const isAlreadySignedUp = event && token && registeredEventIds.has(event.id);

  if (!slugOrId || (!loading && !event)) {
    return <Navigate to="/" replace />;
  }

  if (loading) {
    return (
      <>
        <Nav />
        <main>
          <section className="hero" id="home">
            <div className="hero-content">
              <p style={{ color: "var(--text-gray)" }}>Loading event...</p>
            </div>
          </section>
        </main>
        <Footer />
      </>
    );
  }

  const { date, title, location, address, subtitle, details } = event;
  const isShredVetsEvent = event.eventType === "shredvets" || subtitle === "ShredVets Trip";
  const isTrainingNYEvent = event.eventType === "trainingNY";
  const isTrainingPAEvent = event.eventType === "trainingPA";
  const isOrgPAEvent = event.eventType === "orgPA";
  const isVsaPAEvent = event.eventType === "vsaPA";
  const backLink =
    isTrainingNYEvent ? "/training" :
    isTrainingPAEvent ? "/vsa-pa-training" :
    isOrgPAEvent ? "/vsa-pa-meetings" :
    isShredVetsEvent ? "/shredvets#events" :
    isVsaPAEvent ? "/vsa-pa#events" :
    "/#events";
  const backLinkText =
    isTrainingNYEvent ? "Back to Training" :
    isTrainingPAEvent ? "Back to VSA-PA Training" :
    isOrgPAEvent ? "Back to VSA-PA Meetings" :
    isShredVetsEvent ? "Back to ShredVets Events" :
    isVsaPAEvent ? "Back to VSA-PA Events" :
    "Back to VSA Events";
  const viewAllText =
    isTrainingNYEvent ? "View All Training" :
    isTrainingPAEvent ? "View All VSA-PA Training" :
    isOrgPAEvent ? "View All VSA-PA Meetings" :
    isShredVetsEvent ? "View All ShredVets Events" :
    isVsaPAEvent ? "View All VSA-PA Events" :
    "View All VSA Events";
  const detailsHeading = (isTrainingNYEvent || isTrainingPAEvent) ? "Course Details" : isShredVetsEvent ? "Trip Details" : "Event Details";
  const registerButtonText = (isTrainingNYEvent || isTrainingPAEvent) ? "Register for this course" : isShredVetsEvent ? "Register for this trip" : "Register for this event";
  const hasDetails = details && details.length > 0;

  return (
    <>
      <Nav />
      <main>
        <section className="hero" id="home">
          <div className="hero-content">
            <h1>{title}</h1>
            {subtitle && <p>{subtitle}</p>}
            <p style={{ opacity: 0.95, fontSize: "1.1rem" }}>
              {formatEventDateDisplay(date)} · {location}
              {address && <> · {address}</>}
            </p>
            {(event.canceled || event.dateChanged || event.locationChanged) && (
              <div style={{ marginTop: "1rem", display: "flex", gap: "0.5rem", justifyContent: "center", flexWrap: "wrap" }}>
                {event.canceled && (
                  <span className="event-status-badge event-status-canceled" style={{ fontSize: "1rem", padding: "0.5rem 1rem" }}>
                    Event Canceled
                  </span>
                )}
                {event.dateChanged && (
                  <span className="event-status-badge event-status-changed" style={{ fontSize: "1rem", padding: "0.5rem 1rem" }}>
                    Date Changed
                  </span>
                )}
                {event.locationChanged && (
                  <span className="event-status-badge event-status-changed" style={{ fontSize: "1rem", padding: "0.5rem 1rem" }}>
                    Location Changed
                  </span>
                )}
              </div>
            )}
            <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
              {isAlreadySignedUp ? (
                <span className="event-detail-already-signed-up">You&apos;re signed up</span>
              ) : (
                <button
                  type="button"
                  className="cta-button"
                  onClick={() => setRegistrationOpen(true)}
                >
                  Register
                </button>
              )}
              <Link to={backLink} className="cta-button">
                {backLinkText}
              </Link>
            </div>
          </div>
        </section>

        <section>
          <div className="container">
            <h2 className="section-title">{detailsHeading}</h2>
            <div className="event-detail-content">
              {hasDetails ? (
                details.map((paragraph, i) => (
                  <p key={i}>{paragraph}</p>
                ))
              ) : (
                <p style={{ color: "var(--text-gray)" }}>No additional details for this event.</p>
              )}
            </div>
            <p className="text-center" style={{ marginTop: "2rem" }}>
              {isAlreadySignedUp ? (
                <span className="event-detail-already-signed-up">You&apos;re signed up</span>
              ) : (
                <button
                  type="button"
                  className="cta-button"
                  onClick={() => setRegistrationOpen(true)}
                >
                  {registerButtonText}
                </button>
              )}
            </p>
            <p className="text-center" style={{ marginTop: "1rem" }}>
              <Link to={backLink} className="cta-button" style={{ background: "var(--dark-gray)" }}>
                {viewAllText}
              </Link>
            </p>
          </div>
        </section>
      </main>
      <Footer />
      <RegistrationDialog
        open={registrationOpen}
        onClose={() => setRegistrationOpen(false)}
        event={event}
      />
    </>
  );
}

export default EventDetail;
