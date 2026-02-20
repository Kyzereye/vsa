import { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { SHOW_PAST_EVENTS } from "../config";

const MAIN_NAV_LINKS = [
  { href: "#home", label: "Home" },
  { href: "#about", label: "About" },
  { href: "#events", label: "Events" },
  { href: "#programs", label: "Programs" },
  { href: "#news", label: "News" },
  { href: "#contact", label: "Contact" },
];

const PUBLIC_NAV_HREFS = new Set(["#home", "#about", "#events", "#programs"]);

const OTHER_SITES = [
  { path: "/", label: "VSA - NY" },
  { path: "/vsa-pa", label: "VSA - PA" },
  { path: "/shredvets", label: "ShredVets" },
  // Add more sites here as needed, e.g. { path: "/other", label: "Other Site" },
];

function Nav() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [otherSitesOpen, setOtherSitesOpen] = useState(false);
  const [memberOpen, setMemberOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, isAuthenticated, isAdmin, loading: authLoading } = useAuth();
  const pathname = location.pathname;
  const isHome = pathname === "/";
  const isVsaPA = pathname.startsWith("/vsa-pa");
  const isShredvets = pathname === "/shredvets";
  const basePath = isVsaPA ? "/vsa-pa" : isShredvets ? "/shredvets" : "/";
  const logoTo = basePath;
  const isOnSectionedPage = isHome || pathname === "/vsa-pa" || isShredvets;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (navRef.current && !navRef.current.contains(e.target)) {
        setMenuOpen(false);
        setOtherSitesOpen(false);
        setMemberOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const closeAll = () => {
    setMenuOpen(false);
    setOtherSitesOpen(false);
    setMemberOpen(false);
  };

  const handleAnchorClick = (e, href) => {
    e.preventDefault();
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    closeAll();
  };

  const anchorHref = (hash) => (hash ? `${basePath}#${hash}` : basePath);
  const isCurrentPage = pathname === basePath;

  const handleLogout = () => {
    logout();
    navigate("/");
    closeAll();
  };

  const toggleOtherSites = (e) => {
    e.stopPropagation();
    setOtherSitesOpen((o) => !o);
    setMemberOpen(false);
    setMenuOpen(false);
  };

  const toggleMember = (e) => {
    e.stopPropagation();
    setMemberOpen((o) => !o);
    setOtherSitesOpen(false);
    setMenuOpen(false);
  };

  const toggleMenu = (e) => {
    e.stopPropagation();
    setMenuOpen((o) => !o);
    setOtherSitesOpen(false);
    setMemberOpen(false);
  };

  return (
    <nav
      ref={navRef}
      className="nav"
      style={{
        boxShadow: scrolled ? "0 2px 20px rgba(0,0,0,0.15)" : "var(--shadow)",
      }}
    >
      <div className="nav-container">
        <Link to={logoTo} className="nav-logo" onClick={closeAll}>
          {isVsaPA ? "VSA - PA" : isShredvets ? "VSA" : "VSA - NY"}
        </Link>

        <div className="nav-right">
          <div className="nav-dropdown">
            <button
              type="button"
              className="nav-dropdown-trigger"
              onClick={toggleMenu}
              aria-expanded={menuOpen}
              aria-haspopup="true"
            >
              Menu
              <span className="nav-dropdown-chevron">▼</span>
            </button>
            {menuOpen && (
              <ul className="nav-dropdown-panel nav-dropdown-panel-menu" role="menu">
                <li role="none">
                  {isOnSectionedPage && isCurrentPage ? (
                    <a href={anchorHref("home")} className="nav-dropdown-item" onClick={(e) => { e.preventDefault(); handleAnchorClick(e, "#home"); }} role="menuitem">Home</a>
                  ) : (
                    <Link to={anchorHref("home")} className="nav-dropdown-item" onClick={closeAll} role="menuitem">Home</Link>
                  )}
                </li>
                {(isAuthenticated() ? MAIN_NAV_LINKS.filter((l) => l.href !== "#home") : MAIN_NAV_LINKS.filter((l) => PUBLIC_NAV_HREFS.has(l.href) && l.href !== "#home")).map(({ href, label }) => {
                  const hash = href.slice(1);
                  const isEventsLink = href === "#events";
                  const eventsOnThisPage = (pathname === "/" || pathname === "/vsa-pa") && isCurrentPage || (isShredvets && isCurrentPage);
                  const eventsTo = isVsaPA ? "/vsa-pa-events" : isShredvets ? { pathname: "/shredvets", hash: "#events" } : "/events";
                  if (isEventsLink) {
                    return (
                      <li key={href} role="none">
                        {eventsOnThisPage ? (
                          <a href={anchorHref(hash)} className="nav-dropdown-item" onClick={(e) => { e.preventDefault(); handleAnchorClick(e, href); }} role="menuitem">{label}</a>
                        ) : (
                          <Link to={eventsTo} className="nav-dropdown-item" onClick={closeAll} role="menuitem">{label}</Link>
                        )}
                      </li>
                    );
                  }
                  const sectionPageRoutes = { "#about": "/about", "#programs": "/programs", "#news": "/news" };
                  const sectionPage = sectionPageRoutes[href];
                  const onHome = pathname === "/" && isCurrentPage;
                  if (sectionPage && !onHome) {
                    return (
                      <li key={href} role="none">
                        <Link to={sectionPage} className="nav-dropdown-item" onClick={closeAll} role="menuitem">{label}</Link>
                      </li>
                    );
                  }
                  return (
                    <li key={href} role="none">
                      {isOnSectionedPage && isCurrentPage ? (
                        <a href={anchorHref(hash)} className="nav-dropdown-item" onClick={(e) => { e.preventDefault(); handleAnchorClick(e, href); }} role="menuitem">{label}</a>
                      ) : (
                        <Link to={{ pathname: basePath, hash: `#${hash}` }} className="nav-dropdown-item" onClick={closeAll} role="menuitem">{label}</Link>
                      )}
                    </li>
                  );
                })}
                {SHOW_PAST_EVENTS && (
                  <li role="none">
                    <Link to={isVsaPA ? "/vsa-pa-past-events" : isShredvets ? "/shredvets-past-events" : "/past-events"} className="nav-dropdown-item" onClick={closeAll} role="menuitem">Past Events</Link>
                  </li>
                )}
                {isAuthenticated() && (
                  <>
                    <li role="none">
                      <Link to={isVsaPA ? "/vsa-pa-training" : "/training"} className="nav-dropdown-item" onClick={closeAll} role="menuitem">Training</Link>
                    </li>
                    <li role="none">
                      <Link to={isVsaPA ? "/vsa-pa-meetings" : "/meetings"} className="nav-dropdown-item" onClick={closeAll} role="menuitem">Organizational Meetings</Link>
                    </li>
                    <li role="none">
                      <Link to="/leadership" className="nav-dropdown-item" onClick={closeAll} role="menuitem">Leadership</Link>
                    </li>
                    <li role="none">
                      <Link to="/gallery" className="nav-dropdown-item" onClick={closeAll} role="menuitem">Media</Link>
                    </li>
                  </>
                )}
                <li role="none">
                  <Link to="/membership" className="nav-dropdown-item" onClick={closeAll} role="menuitem">Membership</Link>
                </li>
              </ul>
            )}
          </div>

          <div className="nav-dropdown">
            <button
              type="button"
              className="nav-dropdown-trigger"
              onClick={toggleOtherSites}
              aria-expanded={otherSitesOpen}
              aria-haspopup="true"
            >
              Our Community
              <span className="nav-dropdown-chevron">▼</span>
            </button>
            {otherSitesOpen && (
              <ul className="nav-dropdown-panel" role="menu">
                {OTHER_SITES.map(({ path, label }) => (
                  <li key={path} role="none">
                    <Link to={path} className="nav-dropdown-item" onClick={closeAll} role="menuitem">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="nav-dropdown">
            <button
              type="button"
              className="nav-dropdown-trigger"
              onClick={toggleMember}
              aria-expanded={memberOpen}
              aria-haspopup="true"
            >
              {!authLoading && isAuthenticated() && user
                ? (user.name || "Member")
                : "Login"}
              <span className="nav-dropdown-chevron">▼</span>
            </button>
            {memberOpen && (
              <ul className="nav-dropdown-panel nav-dropdown-panel-right" role="menu">
                {!authLoading && isAuthenticated() ? (
                  <>
                    <li role="none">
                      <Link to="/profile" className="nav-dropdown-item" onClick={closeAll} role="menuitem">
                        Profile
                      </Link>
                    </li>
                    {isAdmin() && (
                      <li role="none">
                        <Link to="/admin" className="nav-dropdown-item" onClick={closeAll} role="menuitem">
                          Admin
                        </Link>
                      </li>
                    )}
                    <li role="none">
                      <button
                        type="button"
                        className="nav-dropdown-item nav-dropdown-button"
                        onClick={handleLogout}
                        role="menuitem"
                      >
                        Logout
                      </button>
                    </li>
                  </>
                ) : (
                  <>
                    <li role="none">
                      <Link to="/login" className="nav-dropdown-item" onClick={closeAll} role="menuitem">
                        Login
                      </Link>
                    </li>
                    <li role="none">
                      <Link to="/register" className="nav-dropdown-item" onClick={closeAll} role="menuitem">
                        Register
                      </Link>
                    </li>
                  </>
                )}
              </ul>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Nav;
