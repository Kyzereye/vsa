import { useState, useEffect } from "react";
import { fetchNews } from "../api";

function News() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchNews()
      .then(setNews)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <section id="news" style={{ background: "var(--light-gray)" }}>
        <div className="container">
          <h2 className="section-title">Latest News</h2>
          <p style={{ textAlign: "center", color: "var(--text-gray)" }}>Loading news...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="news" style={{ background: "var(--light-gray)" }}>
        <div className="container">
          <h2 className="section-title">Latest News</h2>
          <p style={{ textAlign: "center", color: "var(--primary-red)" }}>{error}</p>
        </div>
      </section>
    );
  }

  return (
    <section id="news" style={{ background: "var(--light-gray)" }}>
      <div className="container">
        <h2 className="section-title">Latest News</h2>
        <div className="card-grid">
          {news.map(({ id, title, description }) => (
            <div key={id} className="card">
              <h3>{title}</h3>
              <p>{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default News;
