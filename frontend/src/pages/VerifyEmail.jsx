import { useState, useEffect } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import Nav from "../components/Nav";
import Footer from "../components/Footer";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3333/api";

function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("verifying"); // verifying, success, error
  const [message, setMessage] = useState("Verifying your email...");

  useEffect(() => {
    const token = searchParams.get("token");

    if (!token) {
      setStatus("error");
      setMessage("No verification token provided.");
      return;
    }

    // Verify email (encode token for URL safety)
    fetch(`${API_BASE_URL}/email/verify?token=${encodeURIComponent(token)}`)
      .then((response) => response.json().then((data) => ({ ok: response.ok, data })))
      .then(({ ok, data }) => {
        // Success: backend updated DB and returned { verified: true }
        if (ok && data.verified) {
          setStatus("success");
          setMessage("Your email has been verified successfully!");
          return;
        }
        // Error response (e.g. token already used by a duplicate request) – only show error if we haven't already shown success
        setStatus((prev) => (prev === "success" ? "success" : "error"));
        setMessage(data.message || "Verification failed. The link may have expired.");
      })
      .catch((error) => {
        setStatus((prev) => (prev === "success" ? "success" : "error"));
        setMessage("An error occurred while verifying your email. Please try again.");
        console.error("Verification error:", error);
      });
  }, [searchParams]);

  return (
    <>
      <Nav />
      <main>
        <section className="hero hero-auth" id="home">
          <div className="hero-content">
            <h1>Email Verification</h1>
            <p>{status === "verifying" ? "Please wait..." : status === "success" ? "Success!" : "Error"}</p>
          </div>
        </section>

        <section>
          <div className="container">
            <div className="auth-form-container">
              <div className="auth-form" style={{ textAlign: "center" }}>
                {status === "verifying" && (
                  <div>
                    <p>{message}</p>
                    <div style={{ marginTop: "2rem" }}>
                      <div className="spinner" style={{ margin: "0 auto" }}></div>
                    </div>
                  </div>
                )}

                {status === "success" && (
                  <div>
                    <div style={{ fontSize: "4rem", color: "#4caf50", marginBottom: "1rem" }}>✓</div>
                    <h2 style={{ color: "var(--dark-gray)", marginBottom: "1rem" }}>Email Verified!</h2>
                    <p style={{ color: "var(--text-gray)", marginBottom: "2rem" }}>{message}</p>
                    <Link to="/login" className="cta-button">
                      Go to Login
                    </Link>
                  </div>
                )}

                {status === "error" && (
                  <div>
                    <div style={{ fontSize: "4rem", color: "var(--primary-red)", marginBottom: "1rem" }}>✗</div>
                    <h2 style={{ color: "var(--dark-gray)", marginBottom: "1rem" }}>Verification Failed</h2>
                    <p style={{ color: "var(--text-gray)", marginBottom: "2rem" }}>{message}</p>
                    <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
                      <Link to="/login" className="cta-button">
                        Go to Login
                      </Link>
                      <Link to="/register" className="cta-button" style={{ background: "var(--text-gray)" }}>
                        Register Again
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

export default VerifyEmail;
