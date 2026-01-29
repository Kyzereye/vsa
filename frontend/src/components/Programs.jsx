import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { fetchPrograms } from "../api";

function Programs() {
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPrograms()
      .then(setPrograms)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <section id="programs" style={{ background: "var(--light-gray)" }}>
        <div className="container">
          <h2 className="section-title">Our Programs</h2>
          <p style={{ textAlign: "center", color: "var(--text-gray)" }}>Loading programs...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="programs" style={{ background: "var(--light-gray)" }}>
        <div className="container">
          <h2 className="section-title">Our Programs</h2>
          <p style={{ textAlign: "center", color: "var(--primary-red)" }}>{error}</p>
        </div>
      </section>
    );
  }

  return (
    <section id="programs" style={{ background: "var(--light-gray)" }}>
      <div className="container">
        <h2 className="section-title">Our Programs</h2>
        <div className="card-grid">
          {programs.map(({ id, title, description, link, url }) => {
            const CardContent = (
              <>
                <h3>{title}</h3>
                <p>{description}</p>
              </>
            );

            if (link) {
              return (
                <Link key={id} to={link} className="card card-link">
                  {CardContent}
                </Link>
              );
            }

            if (url) {
              return (
                <a
                  key={id}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="card card-link"
                >
                  {CardContent}
                </a>
              );
            }

            return (
              <div key={id} className="card">
                {CardContent}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default Programs;
