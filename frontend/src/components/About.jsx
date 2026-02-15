import { Link } from "react-router-dom";

const ABOUT_PARAGRAPHS = [
  "The Veterans Sportsmens Association (VSA) is composed of Veterans and Civilians alike who take pride in honoring All Veterans for their service and sacrifices.",
  "The Veterans Sportsmens Association (VSA) is a Federally recognized 501c3 Non-profit Organization, and we are located in Poughkeepsie, New York.",
  "VSA members are 100% nonpaid Volunteers. Absolutely all of the funds generated through fundraising and donations assist local Veterans, Guard, Reserve and Active duty military and their families. We provide Veteran sponsored shooting events, firearms training, and other outdoor activities within the Hudson Valley Region.",
  "The VSA is a proud member of the National Shooting Sports Foundation (NSSF)",
];

function About({ teaser = false }) {
  const paragraphs = teaser ? ABOUT_PARAGRAPHS.slice(0, 2) : ABOUT_PARAGRAPHS;
  return (
    <section id="about">
      <div className="container">
        <h2 className="section-title">About Us</h2>
        <div className="about-content">
          {paragraphs.map((text, i) => (
            <p key={i}>{text}</p>
          ))}
          {teaser && (
            <p style={{ marginTop: "1rem" }}>
              <Link to="/about" className="cta-button" style={{ background: "var(--dark-gray)" }}>
                Read full story
              </Link>
            </p>
          )}
        </div>
      </div>
    </section>
  );
}

export default About;
