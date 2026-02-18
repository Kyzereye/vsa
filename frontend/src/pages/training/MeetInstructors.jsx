import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Nav from "../../components/Nav";
import Footer from "../../components/Footer";
import { fetchInstructors } from "../../api";

export default function MeetInstructors() {
  const [instructors, setInstructors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedIds, setExpandedIds] = useState(new Set());

  useEffect(() => {
    fetchInstructors()
      .then(setInstructors)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const toggleExpanded = (id) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <>
      <Nav />
      <main>
        <section className="hero hero-auth" id="home">
          <div className="hero-content">
            <h1>Meet the Instructors</h1>
            <p style={{ opacity: 0.95 }}>VSA instructors and their backgrounds.</p>
            <p style={{ marginTop: "1rem" }}>
              <Link to="/training" className="cta-button" style={{ background: "var(--dark-gray)" }}>
                Back to Training
              </Link>
            </p>
          </div>
        </section>

        <section id="instructors">
          <div className="container">
            <h2 className="section-title">Instructors</h2>
            {loading ? (
              <p style={{ textAlign: "center", color: "var(--text-gray)" }}>Loading…</p>
            ) : error ? (
              <p style={{ textAlign: "center", color: "var(--primary-red)" }}>{error}</p>
            ) : instructors.length === 0 ? (
              <p style={{ textAlign: "center", color: "var(--text-gray)" }}>No instructors listed.</p>
            ) : (
              <div className="instructor-list">
                {instructors.map(({ id, name, bio, imageUrl }) => {
                  const expanded = expandedIds.has(id);
                  return (
                    <article key={id} className={`instructor-card ${expanded ? "instructor-card-expanded" : "instructor-card-collapsed"}`}>
                      {expanded && imageUrl && (
                        <div className="instructor-card-image">
                          <img src={imageUrl} alt={name} />
                        </div>
                      )}
                      <div className="instructor-card-body">
                        <h3 className="instructor-card-name">{name}</h3>
                        {bio && (
                          <div className={`instructor-card-bio ${expanded ? "" : "instructor-card-bio-preview"}`}>
                            {bio}
                          </div>
                        )}
                        <button
                          type="button"
                          className="instructor-card-toggle"
                          onClick={() => toggleExpanded(id)}
                          aria-expanded={expanded}
                        >
                          {expanded ? "Show less" : "Show more"}
                        </button>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
