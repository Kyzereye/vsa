import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const HOME_NAV_LINKS = [
  { href: "#home", label: "Home" },
  { href: "#about", label: "About" },
  { href: "#events", label: "Events" },
  { href: "#programs", label: "Programs" },
  { href: "#news", label: "News" },
  { href: "#contact", label: "Contact" },
  { href: "/login", label: "Login", isRoute: true },
];

function Nav() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, isAuthenticated, isAdmin, loading: authLoading } = useAuth();
  const isShredVetsPage = location.pathname === "/shredvets";
  const isAdminPage = location.pathname === "/admin";
  const isLoginPage = location.pathname === "/login";
  const isRegisterPage = location.pathname === "/register";
  const isProfilePage = location.pathname === "/profile";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const closeMenu = () => setMenuOpen(false);

  const handleAnchorClick = (e, href) => {
    e.preventDefault();
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    closeMenu();
  };

  const handleRouteClick = (e, path) => {
    e.preventDefault();
    navigate(path);
    closeMenu();
  };

  const handleLogout = () => {
    logout();
    navigate("/");
    closeMenu();
  };

  return (
    <nav
      className="nav"
      style={{
        boxShadow: scrolled ? "0 2px 20px rgba(0,0,0,0.15)" : "var(--shadow)",
      }}
    >
      <div className="nav-container">
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <Link to="/" className="nav-logo" onClick={closeMenu}>
            VSA
          </Link>
          {!authLoading && isAuthenticated() && user && (
            <span className="nav-welcome" style={{ marginLeft: "0.5rem" }}>
              Welcome, {user.name || "Member"}
            </span>
          )}
        </div>
        <button
          type="button"
          className="nav-mobile-toggle"
          onClick={() => setMenuOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          ☰
        </button>
        <ul className={`nav-links ${menuOpen ? "active" : ""}`}>
          {isShredVetsPage || isAdminPage || isLoginPage || isRegisterPage || isProfilePage ? (
            <>
              <li>
                <Link to="/" onClick={closeMenu}>
                  Home
                </Link>
              </li>
              {!authLoading && isAuthenticated() ? (
                <>
                  <li>
                    <button
                      type="button"
                      onClick={handleLogout}
                      style={{
                        background: "none",
                        border: "none",
                        color: "var(--dark-gray)",
                        fontWeight: 500,
                        cursor: "pointer",
                        fontFamily: "inherit",
                        fontSize: "inherit",
                      }}
                    >
                      Logout
                    </button>
                  </li>
                </>
              ) : !authLoading ? (
                <>
                  {!isLoginPage && (
                    <li>
                      <Link to="/login" onClick={closeMenu}>
                        Login
                      </Link>
                    </li>
                  )}
                  {!isRegisterPage && isLoginPage && (
                    <li>
                      <Link to="/register" onClick={closeMenu}>
                        Register
                      </Link>
                    </li>
                  )}
                </>
              ) : null}
            </>
          ) : (
            <>
              {HOME_NAV_LINKS.filter((link) => link.href !== "/login").map(({ href, label, isRoute }) => (
                <li key={href}>
                  {isRoute ? (
                    <Link to={href} onClick={closeMenu}>
                      {label}
                    </Link>
                  ) : (
                    <a href={href} onClick={(e) => handleAnchorClick(e, href)}>
                      {label}
                    </a>
                  )}
                </li>
              ))}
              <li>
                <Link to="/shredvets" onClick={closeMenu}>
                  ShredVets
                </Link>
              </li>
              {!authLoading && isAuthenticated() ? (
                <>
                  {!isProfilePage && (
                    <li>
                      <Link to="/profile" onClick={closeMenu}>
                        Profile
                      </Link>
                    </li>
                  )}
                  {isAdmin() && !isAdminPage && (
                    <li>
                      <Link to="/admin" onClick={closeMenu}>
                        Admin
                      </Link>
                    </li>
                  )}
                  <li>
                    <button
                      type="button"
                      onClick={handleLogout}
                      style={{
                        background: "none",
                        border: "none",
                        color: "var(--dark-gray)",
                        fontWeight: 500,
                        cursor: "pointer",
                        fontFamily: "inherit",
                        fontSize: "inherit",
                      }}
                    >
                      Logout
                    </button>
                  </li>
                </>
              ) : !authLoading ? (
                <li>
                  <Link to="/login" onClick={closeMenu}>
                    Login
                  </Link>
                </li>
              ) : null}
            </>
          )}
        </ul>
      </div>
    </nav>
  );
}

export default Nav;
