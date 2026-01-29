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
  const isShredVetsPage = location.pathname === "/shredvets";

  const handleAnchorClick = (e, href) => {
    e.preventDefault();
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

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
                <a key={href} href={href} onClick={(e) => handleAnchorClick(e, href)}>
                  {label}
                </a>
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
