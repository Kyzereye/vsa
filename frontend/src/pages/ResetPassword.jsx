import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import Nav from "../components/Nav";
import Footer from "../components/Footer";
import { resetPassword } from "../api";
import { getPasswordWithConfirmError } from "../utils/password";
import { PasswordRequirements } from "../components";

function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [status, setStatus] = useState("form"); // form | success | error
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("Invalid reset link. Please request a new password reset from the login page.");
    }
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    const error = getPasswordWithConfirmError(password, confirmPassword);
    if (error) {
      setMessage(error.message);
      return;
    }
    setLoading(true);
    try {
      await resetPassword(token, password);
      setStatus("success");
    } catch (err) {
      setStatus("error");
      setMessage(err.message || "Failed to reset password. The link may have expired.");
    } finally {
      setLoading(false);
    }
  };

  if (!token && status !== "error") return null;

  return (
    <>
      <Nav />
      <main>
        <section className="hero hero-auth" id="home">
          <div className="hero-content">
            <h1>Reset Password</h1>
            <p>Choose a new password for your account</p>
          </div>
        </section>

        <section>
          <div className="container">
            <div className="auth-form-container">
              {status === "form" && (
                <form onSubmit={handleSubmit} className="auth-form">
                  {message && <div className="auth-error">{message}</div>}
                  <div className="auth-field">
                    <label htmlFor="password">New password *</label>
                    <div className="password-input-wrapper">
                      <input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        required
                        minLength={8}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
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
                    <PasswordRequirements password={password} />
                  </div>
                  <div className="auth-field">
                    <label htmlFor="confirmPassword">Confirm new password *</label>
                    <div className="password-input-wrapper">
                      <input
                        id="confirmPassword"
                        name="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        required
                        minLength={8}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="auth-input"
                        placeholder="Confirm your password"
                      />
                      <button
                        type="button"
                        className="password-toggle"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                      >
                        {showConfirmPassword ? (
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
                    {confirmPassword && (
                      <div className={`password-confirm-hint ${password === confirmPassword ? "match" : "no-match"}`}>
                        <span className="requirement-icon">{password === confirmPassword ? "✓" : "○"}</span>
                        <span>{password === confirmPassword ? "Passwords match" : "Passwords do not match"}</span>
                      </div>
                    )}
                  </div>
                  <button
                    type="submit"
                    className="cta-button"
                    disabled={loading}
                    style={{ width: "100%", marginTop: "1rem" }}
                  >
                    {loading ? "Resetting…" : "Reset password"}
                  </button>
                  <p style={{ textAlign: "center", marginTop: "1.5rem" }}>
                    <Link to="/login" style={{ color: "var(--primary-red)", fontWeight: 600 }}>
                      Back to login
                    </Link>
                  </p>
                </form>
              )}

              {status === "success" && (
                <div className="auth-form" style={{ textAlign: "center" }}>
                  <div style={{ fontSize: "4rem", color: "#4caf50", marginBottom: "1rem" }}>✓</div>
                  <h2 style={{ color: "var(--dark-gray)", marginBottom: "1rem" }}>Password reset</h2>
                  <p style={{ color: "var(--text-gray)", marginBottom: "2rem" }}>
                    Your password has been updated. You can now log in with your new password.
                  </p>
                  <Link to="/login" className="cta-button">
                    Go to login
                  </Link>
                </div>
              )}

              {status === "error" && (
                <div className="auth-form" style={{ textAlign: "center" }}>
                  <div style={{ fontSize: "4rem", color: "var(--primary-red)", marginBottom: "1rem" }}>✗</div>
                  <h2 style={{ color: "var(--dark-gray)", marginBottom: "1rem" }}>Reset failed</h2>
                  <p style={{ color: "var(--text-gray)", marginBottom: "2rem" }}>{message}</p>
                  <Link to="/forgot-password" className="cta-button" style={{ marginRight: "0.5rem" }}>
                    Request new link
                  </Link>
                  <Link to="/login" className="cta-button" style={{ background: "var(--text-gray)" }}>
                    Back to login
                  </Link>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

export default ResetPassword;
