import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Nav from "../components/Nav";
import Footer from "../components/Footer";
import { useAuth } from "../contexts/AuthContext";

function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { login, isAdmin } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(formData.email, formData.password);
      // Redirect based on user role
      if (isAdmin()) {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } catch (err) {
      setError(err.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Nav />
      <main>
        <section className="hero hero-auth" id="home">
          <div className="hero-content">
            <h1>Login</h1>
            <p>Access your VSA account</p>
          </div>
        </section>

        <section>
          <div className="container">
            <div className="auth-form-container">
              <form onSubmit={handleSubmit} className="auth-form">
                {error && <div className="auth-error">{error}</div>}
                
                <div className="auth-field">
                  <label htmlFor="email">Email *</label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="auth-input"
                    placeholder="your@email.com"
                  />
                </div>

                <div className="auth-field">
                  <label htmlFor="password">Password *</label>
                  <div className="password-input-wrapper">
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      required
                      value={formData.password}
                      onChange={handleChange}
                      className="auth-input"
                      placeholder="Enter your password"
                    />
                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                          <line x1="1" y1="1" x2="23" y2="23"></line>
                        </svg>
                      ) : (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                          <circle cx="12" cy="12" r="3"></circle>
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                <p style={{ textAlign: "right", marginTop: "0.5rem" }}>
                  <Link to="/forgot-password" style={{ color: "var(--primary-red)", fontSize: "0.95rem" }}>
                    Forgot password?
                  </Link>
                </p>

                <button
                  type="submit"
                  className="cta-button"
                  disabled={loading}
                  style={{ width: "100%", marginTop: "1rem" }}
                >
                  {loading ? "Logging in..." : "Login"}
                </button>

                <p style={{ textAlign: "center", marginTop: "1.5rem" }}>
                  Don&apos;t have an account?{" "}
                  <Link to="/register" style={{ color: "var(--primary-red)", fontWeight: 600 }}>
                    Register here
                  </Link>
                </p>
              </form>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

export default Login;
