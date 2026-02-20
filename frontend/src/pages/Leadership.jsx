import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import Nav from "../components/Nav";
import Footer from "../components/Footer";
import { fetchBoardMembers } from "../api";
import { bylaws } from "../data/bylaws";

const EXEC_LABELS = ["President", "Vice President", "Financial Secretary"];
const BOARD_COUNT = 6;
const ADVISOR_COUNT = 9;

export default function Leadership() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchBoardMembers()
      .then(setMembers)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const { exec, board, advisors } = useMemo(() => {
    const president = members.find((m) => m.boardPosition === "President");
    const vp = members.find((m) => m.boardPosition === "Vice President");
    const finSec = members.find((m) => m.boardPosition === "Financial Secretary");
    const boardList = members
      .filter((m) => m.boardPosition === "Board Member")
      .sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0));
    const advisorList = members
      .filter((m) => m.boardPosition === "Advisor to the Board")
      .sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0));

    return {
      exec: [president, vp, finSec],
      board: Array(BOARD_COUNT)
        .fill(null)
        .map((_, i) => boardList[i] ?? null),
      advisors: Array(ADVISOR_COUNT)
        .fill(null)
        .map((_, i) => advisorList[i] ?? null),
    };
  }, [members]);

  return (
    <>
      <Nav />
      <main>
        <section className="hero hero-auth" id="home">
          <div className="hero-content">
            <h1>Leadership</h1>
            <p style={{ opacity: 0.95 }}>VSA board and advisors.</p>
            <p style={{ marginTop: "1rem" }}>
              <Link to="/" className="cta-button" style={{ background: "var(--dark-gray)" }}>
                Back to VSA Home
              </Link>
            </p>
          </div>
        </section>

        <section id="leadership">
          <div className="container">
            <h2 className="section-title">Board & Advisors</h2>
            {loading ? (
              <p style={{ textAlign: "center", color: "var(--text-gray)" }}>Loading…</p>
            ) : error ? (
              <p style={{ textAlign: "center", color: "var(--primary-red)" }}>{error}</p>
            ) : (
              <div className="leadership-three-columns">
                <div className="leadership-column">
                  <h3 className="leadership-column-title">Executive Committee</h3>
                  <ul className="leadership-slot-list">
                    {EXEC_LABELS.map((label, i) => (
                      <li key={i} className="leadership-slot leadership-slot-exec">
                        <span className="leadership-slot-label">{label}</span>
                        <span className="leadership-slot-name">{exec[i] ? exec[i].name : "Empty"}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="leadership-column">
                  <h3 className="leadership-column-title">Board Members</h3>
                  <ul className="leadership-slot-list">
                    {board.map((member, i) => (
                      <li key={i} className="leadership-slot">
                        {member ? member.name : "Empty"}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="leadership-column">
                  <h3 className="leadership-column-title">Advisors to the Board</h3>
                  <ul className="leadership-slot-list">
                    {advisors.map((member, i) => (
                      <li key={i} className="leadership-slot">
                        {member ? member.name : "Empty"}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        </section>

        <section id="bylaws">
          <div className="container">
            <h2 className="section-title">Bylaws</h2>
            <div className="bylaws-content">
              {bylaws.map(({ article, title, sections }) => (
                <article key={article} className="bylaws-article">
                  <h3 className="bylaws-article-title">Article {article}. {title}</h3>
                  {sections.map((paragraph, i) => (
                    <p key={i} className="bylaws-section">{paragraph}</p>
                  ))}
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
