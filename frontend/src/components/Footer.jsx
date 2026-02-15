import { Link, useLocation } from "react-router-dom";

const FOOTER_LINKS = [
  { href: "#home", label: "Home" },
  { href: "#about", label: "About" },
  { href: "#events", label: "Events" },
  { href: "#programs", label: "Programs" },
  { href: "#news", label: "News" },
  { href: "#contact", label: "Contact" },
];

function Footer() {
  const location = useLocation();
  const pathname = location.pathname;
  const isShredVetsPage = pathname === "/shredvets";
  const isVsaPA = pathname.startsWith("/vsa-pa");

  const handleAnchorClick = (e, href) => {
    e.preventDefault();
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const eventsOnThisPage = pathname === "/" || pathname === "/vsa-pa" || isShredVetsPage;
  const eventsLink = isVsaPA ? "/vsa-pa-events" : isShredVetsPage ? "/shredvets#events" : "/events";

  return (
    <footer className="footer">
      <div className="footer-content">
        <p>&copy; {new Date().getFullYear()} by the Veterans Sportsmens Association.</p>
        <div className="footer-links">
          {isShredVetsPage ? (
            <>
              <Link to="/">Home</Link>
              <Link to="/shredvets">ShredVets</Link>
            </>
          ) : (
            <>
              {FOOTER_LINKS.map(({ href, label }) => (
                href === "#events" && eventsOnThisPage ? (
                  <a key={href} href="#events" onClick={(e) => handleAnchorClick(e, "#events")}>Events</a>
                ) : href === "#events" ? (
                  <Link key={href} to={eventsLink}>Events</Link>
                ) : (
                  <a key={href} href={href} onClick={(e) => handleAnchorClick(e, href)}>
                    {label}
                  </a>
                )
              ))}
              <Link to="/shredvets">ShredVets</Link>
            </>
          )}
        </div>
        <p className="footer-tagline">Veterans Serving Veterans</p>
      </div>
    </footer>
  );
}

export default Footer;
