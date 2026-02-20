import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const FOOTER_LINKS = [
  { href: "#home", label: "Home" },
  { href: "#about", label: "About" },
  { href: "#events", label: "Events" },
  { href: "#programs", label: "Programs" },
  { href: "#news", label: "News" },
  { href: "#contact", label: "Contact" },
];

const PUBLIC_FOOTER_HREFS = new Set(["#home", "#about", "#events", "#programs"]);

function Footer() {
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const pathname = location.pathname;
  const isShredVetsPage = pathname === "/shredvets";
  const isVsaPA = pathname.startsWith("/vsa-pa");
  const publicOnly = !isAuthenticated();

  const handleAnchorClick = (e, href) => {
    e.preventDefault();
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const onHome = pathname === "/";
  const eventsOnThisPage = onHome || pathname === "/vsa-pa" || isShredVetsPage;
  const eventsLink = isVsaPA ? "/vsa-pa-events" : isShredVetsPage ? "/shredvets#events" : "/events";
  const sectionPageRoutes = { "#about": "/about", "#programs": "/programs", "#news": "/news", "#gallery": "/gallery" };

  const linksToShow = publicOnly ? FOOTER_LINKS.filter(({ href }) => PUBLIC_FOOTER_HREFS.has(href)) : FOOTER_LINKS;

  return (
    <footer className="footer">
      <div className="footer-content">
        <p>&copy; {new Date().getFullYear()} by the Veterans Sportsmens Association.</p>
        <div className="footer-links">
          {isShredVetsPage && !publicOnly ? (
            <>
              <Link to="/">Home</Link>
              <Link to="/shredvets">ShredVets</Link>
            </>
          ) : (
            <>
              {linksToShow.map(({ href, label }) => {
                if (href === "#events") {
                  return eventsOnThisPage ? (
                    <a key={href} href="#events" onClick={(e) => handleAnchorClick(e, "#events")}>Events</a>
                  ) : (
                    <Link key={href} to={eventsLink}>Events</Link>
                  );
                }
                if (sectionPageRoutes[href] && !onHome) {
                  return <Link key={href} to={sectionPageRoutes[href]}>{label}</Link>;
                }
                return (
                  <a key={href} href={href} onClick={(e) => handleAnchorClick(e, href)}>
                    {label}
                  </a>
                );
              })}
              <Link to="/gallery">Gallery</Link>
              {!publicOnly && (
                <>
                  <Link to="/leadership">Leadership</Link>
                  <Link to="/shredvets">ShredVets</Link>
                </>
              )}
              <Link to="/membership">Membership</Link>
            </>
          )}
        </div>
        <p className="footer-tagline">Veterans Serving Veterans</p>
      </div>
    </footer>
  );
}

export default Footer;
