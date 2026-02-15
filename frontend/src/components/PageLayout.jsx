import { Link } from "react-router-dom";
import Nav from "./Nav";
import Footer from "./Footer";

/**
 * Wraps section content (About, Programs, News, Gallery) with Nav and Footer.
 * Optional hero with back link for consistency with Training/Meetings pages.
 */
function PageLayout({ children, title, subtitle, backTo = "/", backLabel = "Back to VSA Home" }) {
  return (
    <>
      <Nav />
      <main>
        {(title || subtitle) && (
          <section className="hero hero-auth" id="home">
            <div className="hero-content">
              {title && <h1>{title}</h1>}
              {subtitle && <p style={{ opacity: 0.95 }}>{subtitle}</p>}
              <p style={{ marginTop: "1rem" }}>
                <Link to={backTo} className="cta-button" style={{ background: "var(--dark-gray)" }}>
                  {backLabel}
                </Link>
              </p>
            </div>
          </section>
        )}
        {children}
      </main>
      <Footer />
    </>
  );
}

export default PageLayout;
