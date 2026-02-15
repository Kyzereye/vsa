import { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const MAIN_NAV_LINKS = [
  { href: "#home", label: "Home" },
  { href: "#about", label: "About" },
  { href: "#events", label: "Events" },
  { href: "#programs", label: "Programs" },
  { href: "#news", label: "News" },
  { href: "#contact", label: "Contact" },
];

const OTHER_SITES = [
  { path: "/", label: "VSA - NY" },
  { path: "/vsa-pa", label: "VSA-PA" },
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
  const isVsaPA = pathname === "/vsa-pa" || pathname === "/vsa-pa-training" || pathname === "/vsa-pa-meetings";
  const isShredvets = pathname === "/shredvets";
  const basePath = isVsaPA ? "/vsa-pa" : isShredvets ? "/shredvets" : "/";
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
  };

  const toggleMember = (e) => {
    e.stopPropagation();
    setMemberOpen((o) => !o);
    setOtherSitesOpen(false);
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
        <Link to="/" className="nav-logo" onClick={closeAll}>
          VSA
        </Link>

        <div className="nav-right">
          <button
            type="button"
            className="nav-menu-toggle"
            onClick={(e) => {
              e.stopPropagation();
              setMenuOpen((o) => !o);
              setOtherSitesOpen(false);
              setMemberOpen(false);
            }}
            aria-expanded={menuOpen}
            aria-label="Toggle menu"
          >
            <span className="nav-menu-icon">☰</span>
            <span className="nav-menu-label">Menu</span>
          </button>

          <div className="nav-dropdown">
            <button
              type="button"
              className="nav-dropdown-trigger"
              onClick={toggleOtherSites}
              aria-expanded={otherSitesOpen}
              aria-haspopup="true"
            >
              Other sites
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

      {/* Hamburger menu panel */}
      <div className={`nav-menu-panel ${menuOpen ? "active" : ""}`}>
        <ul className="nav-menu-links">
          <li>
            {isOnSectionedPage && isCurrentPage ? (
              <a
                href={anchorHref("home")}
                onClick={(e) => {
                  e.preventDefault();
                  handleAnchorClick(e, "#home");
                }}
              >
                Home
              </a>
            ) : (
              <Link to={anchorHref("home")} onClick={closeAll}>
                Home
              </Link>
            )}
          </li>
          {MAIN_NAV_LINKS.filter((l) => l.href !== "#home").map(({ href, label }) => {
            const hash = href.slice(1);
            return (
              <li key={href}>
                {isOnSectionedPage && isCurrentPage ? (
                  <a
                    href={anchorHref(hash)}
                    onClick={(e) => {
                      e.preventDefault();
                      handleAnchorClick(e, href);
                    }}
                  >
                    {label}
                  </a>
                ) : (
                  <Link to={{ pathname: basePath, hash: `#${hash}` }} onClick={closeAll}>
                    {label}
                  </Link>
                )}
              </li>
            );
          })}
          <li>
            <Link
              to={isVsaPA ? "/vsa-pa-past-events" : isShredvets ? "/shredvets-past-events" : "/past-events"}
              onClick={closeAll}
            >
              Past Events
            </Link>
          </li>
          <li>
            <Link to={isVsaPA ? "/vsa-pa-training" : "/training"} onClick={closeAll}>
              Training
            </Link>
          </li>
          <li>
            <Link to={isVsaPA ? "/vsa-pa-meetings" : "/meetings"} onClick={closeAll}>
              Organizational Meetings
            </Link>
          </li>
          <li>
            <Link to="/membership" onClick={closeAll}>
              Membership
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Nav;
