import { useState } from "react";
import { Link } from "react-router-dom";
import Nav from "../components/Nav";
import Footer from "../components/Footer";
import { requestPasswordReset } from "../api";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("form"); // form | success | error
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);
    setStatus("form");
    try {
      await requestPasswordReset(email.trim());
      setStatus("success");
      setMessage("If an account exists with that email, you will receive a password reset link shortly. Please check your inbox and spam folder.");
    } catch (err) {
      setStatus("error");
      setMessage(err.message || "Something went wrong. Please try again.");
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
            <h1>Forgot Password</h1>
            <p>Reset your VSA account password</p>
          </div>
        </section>

        <section>
          <div className="container">
            <div className="auth-form-container">
              {status === "form" && (
                <form onSubmit={handleSubmit} className="auth-form">
                  <p style={{ color: "var(--text-gray)", marginBottom: "1rem" }}>
                    Enter the email address associated with your account. We&apos;ll send you a link to reset your password.
                  </p>
                  {message && <div className="auth-error">{message}</div>}
                  <div className="auth-field">
                    <label htmlFor="email">Email *</label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="auth-input"
                      placeholder="your@email.com"
                    />
                  </div>
                  <button
                    type="submit"
                    className="cta-button"
                    disabled={loading}
                    style={{ width: "100%", marginTop: "1rem" }}
                  >
                    {loading ? "Sending…" : "Send reset link"}
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
                  <h2 style={{ color: "var(--dark-gray)", marginBottom: "1rem" }}>Check your email</h2>
                  <p style={{ color: "var(--text-gray)", marginBottom: "2rem" }}>{message}</p>
                  <Link to="/login" className="cta-button">
                    Back to login
                  </Link>
                </div>
              )}

              {status === "error" && (
                <div className="auth-form" style={{ textAlign: "center" }}>
                  <div style={{ fontSize: "4rem", color: "var(--primary-red)", marginBottom: "1rem" }}>✗</div>
                  <h2 style={{ color: "var(--dark-gray)", marginBottom: "1rem" }}>Something went wrong</h2>
                  <p style={{ color: "var(--text-gray)", marginBottom: "2rem" }}>{message}</p>
                  <button
                    type="button"
                    className="cta-button"
                    onClick={() => { setStatus("form"); setMessage(""); }}
                    style={{ marginRight: "0.5rem" }}
                  >
                    Try again
                  </button>
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

export default ForgotPassword;
