import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Nav from "../components/Nav";
import Footer from "../components/Footer";
import { useAuth } from "../contexts/AuthContext";
import { formatPhoneDisplay } from "../utils/phone";

function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showVerificationDialog, setShowVerificationDialog] = useState(false);
  const navigate = useNavigate();
  const { register } = useAuth();

  // Password requirements validation
  const passwordRequirements = {
    minLength: formData.password.length >= 8,
    hasUpperCase: /[A-Z]/.test(formData.password),
    hasLowerCase: /[a-z]/.test(formData.password),
    hasNumber: /[0-9]/.test(formData.password),
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "phone") {
      const digits = String(value).replace(/\D/g, "").slice(0, 10);
      setFormData((prev) => ({ ...prev, phone: digits }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.name || !formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    } else if (!/[A-Z]/.test(formData.password)) {
      newErrors.password = "Password must contain at least one uppercase letter";
    } else if (!/[a-z]/.test(formData.password)) {
      newErrors.password = "Password must contain at least one lowercase letter";
    } else if (!/[0-9]/.test(formData.password)) {
      newErrors.password = "Password must contain at least one number";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    setLoading(true);

    try {
      const result = await register(formData.name.trim(), formData.email.trim(), formData.phone || "", formData.password);
      
      // Show verification dialog
      if (result && result.requiresVerification) {
        setShowVerificationDialog(true);
        // Clear form
        setFormData({
          name: "",
          email: "",
          phone: "",
          password: "",
          confirmPassword: "",
        });
        setErrors({});
      }
    } catch (err) {
      setErrors({ submit: err.message || "Registration failed. Please try again." });
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
            <h1>Register</h1>
            <p>Create your VSA account</p>
          </div>
        </section>

        <section>
          <div className="container">
            <div className="auth-form-container">
              <form onSubmit={handleSubmit} className="auth-form">
                {errors.submit && (
                  <div className={errors.submit.includes("successful") ? "auth-success" : "auth-error"}>
                    {errors.submit}
                  </div>
                )}

                <div className="auth-field">
                  <label htmlFor="name">Name *</label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className={`auth-input ${errors.name ? "auth-input-error" : ""}`}
                    placeholder="Your full name"
                  />
                  {errors.name && <div className="auth-field-error">{errors.name}</div>}
                </div>

                <div className="auth-field">
                  <label htmlFor="email">Email *</label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className={`auth-input ${errors.email ? "auth-input-error" : ""}`}
                    placeholder="your@email.com"
                  />
                  {errors.email && <div className="auth-field-error">{errors.email}</div>}
                </div>

                <div className="auth-field">
                  <label htmlFor="phone">Phone</label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone.length === 10 ? formatPhoneDisplay(formData.phone) : formData.phone}
                    onChange={handleChange}
                    className="auth-input"
                    placeholder="(555) 555-5555"
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
                      className={`auth-input ${errors.password ? "auth-input-error" : ""}`}
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
                  {errors.password && <div className="auth-field-error">{errors.password}</div>}
                  
                  {formData.password && (
                    <div className="password-requirements">
                      <div className={`password-requirement ${passwordRequirements.minLength ? "met" : ""}`}>
                        <span className="requirement-icon">{passwordRequirements.minLength ? "✓" : "○"}</span>
                        <span>At least 8 characters</span>
                      </div>
                      <div className={`password-requirement ${passwordRequirements.hasUpperCase ? "met" : ""}`}>
                        <span className="requirement-icon">{passwordRequirements.hasUpperCase ? "✓" : "○"}</span>
                        <span>At least one uppercase letter</span>
                      </div>
                      <div className={`password-requirement ${passwordRequirements.hasLowerCase ? "met" : ""}`}>
                        <span className="requirement-icon">{passwordRequirements.hasLowerCase ? "✓" : "○"}</span>
                        <span>At least one lowercase letter</span>
                      </div>
                      <div className={`password-requirement ${passwordRequirements.hasNumber ? "met" : ""}`}>
                        <span className="requirement-icon">{passwordRequirements.hasNumber ? "✓" : "○"}</span>
                        <span>At least one number</span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="auth-field">
                  <label htmlFor="confirmPassword">Confirm Password *</label>
                  <div className="password-input-wrapper">
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      required
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className={`auth-input ${errors.confirmPassword ? "auth-input-error" : ""}`}
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
                  {errors.confirmPassword && <div className="auth-field-error">{errors.confirmPassword}</div>}
                </div>

                <button
                  type="submit"
                  className="cta-button"
                  disabled={loading}
                  style={{ width: "100%", marginTop: "1rem" }}
                >
                  {loading ? "Registering..." : "Register"}
                </button>

                <p style={{ textAlign: "center", marginTop: "1.5rem" }}>
                  Already have an account?{" "}
                  <Link to="/login" style={{ color: "var(--primary-red)", fontWeight: 600 }}>
                    Login here
                  </Link>
                </p>
              </form>
            </div>
          </div>
        </section>
      </main>
      <Footer />

      {/* Email Verification Dialog */}
      {showVerificationDialog && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.7)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
          onClick={() => {
            setShowVerificationDialog(false);
            navigate("/login");
          }}
        >
          <div
            style={{
              backgroundColor: "white",
              padding: "2rem",
              borderRadius: "8px",
              maxWidth: "500px",
              width: "90%",
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
              position: "relative",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => {
                setShowVerificationDialog(false);
              }}
              style={{
                position: "absolute",
                top: "1rem",
                right: "1rem",
                background: "none",
                border: "none",
                fontSize: "1.5rem",
                cursor: "pointer",
                color: "var(--text-gray)",
                padding: "0.25rem 0.5rem",
                lineHeight: "1",
              }}
              aria-label="Close dialog"
            >
              ×
            </button>
            <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
              <div
                style={{
                  fontSize: "4rem",
                  color: "#4caf50",
                  marginBottom: "1rem",
                }}
              >
                ✓
              </div>
              <h2 style={{ color: "var(--dark-gray)", marginBottom: "1rem" }}>
                Registration Successful!
              </h2>
            </div>
            <div style={{ color: "var(--text-gray)", marginBottom: "1.5rem", lineHeight: "1.6" }}>
              <p style={{ marginBottom: "1rem" }}>
                Thank you for registering with the Veterans Sportsmens Association!
              </p>
              <p style={{ marginBottom: "1rem", fontWeight: 600 }}>
                Please check your email inbox (and spam folder) for a verification link.
              </p>
              <p>
                You must verify your email address before you can log in to your account.
              </p>
            </div>
            <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
              <button
                onClick={() => {
                  setShowVerificationDialog(false);
                  navigate("/login");
                }}
                className="cta-button"
                style={{ width: "auto", padding: "0.75rem 2rem" }}
              >
                Go to Login
              </button>
              <button
                onClick={() => {
                  setShowVerificationDialog(false);
                }}
                className="cta-button"
                style={{ 
                  width: "auto", 
                  padding: "0.75rem 2rem",
                  background: "var(--text-gray)",
                  color: "white"
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Register;
