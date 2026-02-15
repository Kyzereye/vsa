import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { fetchNews } from "../api";

function News({ limit }) {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchNews()
      .then(setNews)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const displayNews = limit ? news.slice(0, limit) : news;
  const hasMore = limit != null && news.length > limit;

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
          {displayNews.map(({ id, title, description }) => (
            <div key={id} className="card">
              <h3>{title}</h3>
              <p>{description}</p>
            </div>
          ))}
        </div>
        {hasMore && (
          <p style={{ textAlign: "center", marginTop: "1.5rem" }}>
            <Link to="/news" className="cta-button" style={{ background: "var(--dark-gray)" }}>
              View all news
            </Link>
          </p>
        )}
      </div>
    </section>
  );
}

export default News;
