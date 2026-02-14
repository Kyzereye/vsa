import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import Nav from "../components/Nav";
import Footer from "../components/Footer";
import { ExpansionPanel, PasswordRequirements } from "../components";
import { useAuth } from "../contexts/AuthContext";
import { fetchMyRegistrations, deleteRegistration } from "../api";
import { formatPhoneDisplay } from "../utils/phone";
import { getPasswordWithConfirmError } from "../utils/password";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3333/api";

function Profile() {
  const { user, token, logout, refreshUser, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [resendingEmail, setResendingEmail] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    emailOptIn: false,
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showDeletePassword, setShowDeletePassword] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deletePassword, setDeletePassword] = useState("");
  const [myRegistrations, setMyRegistrations] = useState([]);
  const [registrationsLoading, setRegistrationsLoading] = useState(false);
  const [cancellingId, setCancellingId] = useState(null);

  useEffect(() => {
    if (token) {
      setRegistrationsLoading(true);
      fetchMyRegistrations(token)
        .then(setMyRegistrations)
        .catch(() => setMyRegistrations([]))
        .finally(() => setRegistrationsLoading(false));
    } else {
      setMyRegistrations([]);
    }
  }, [token]);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        emailOptIn: user.emailOptIn ?? false,
      });
    } else if (token) {
      // If we have a token but no user, try to refresh user data
      const storedUser = JSON.parse(localStorage.getItem("user") || "null");
      if (storedUser?.id) {
        refreshUser();
      }
    }
  }, [user, token, refreshUser]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === "phone") {
      const digits = String(value).replace(/\D/g, "").slice(0, 10);
      setFormData((prev) => ({ ...prev, phone: digits }));
      setError("");
      setSuccess("");
      return;
    }
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    setError("");
    setSuccess("");
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
    setError("");
    setSuccess("");
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/users/${user.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to update profile");
      }

      const data = await response.json();
      
      if (data.emailChangePending) {
        setSuccess(data.message || "Email change requested. Please check your new email for verification instructions.");
      } else {
        setSuccess("Profile updated successfully!");
      }
      
      // Update auth context with new user data
      await refreshUser();
    } catch (err) {
      setError(err.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const passwordError = getPasswordWithConfirmError(
      passwordData.newPassword,
      passwordData.confirmPassword
    );
    if (passwordError) {
      setError(passwordError.message);
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/users/${user.id}/reset-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to reset password");
      }

      setSuccess("Password reset successfully!");
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err) {
      setError(err.message || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!deletePassword) {
      setError("Please enter your password to confirm deletion");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // First verify password by attempting login
      const loginResponse = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: user.email,
          password: deletePassword,
        }),
      });

      if (!loginResponse.ok) {
        throw new Error("Incorrect password");
      }

      // Delete account
      const deleteResponse = await fetch(`${API_BASE_URL}/users/${user.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!deleteResponse.ok) {
        const error = await deleteResponse.json();
        throw new Error(error.message || "Failed to delete account");
      }

      logout();
      navigate("/");
    } catch (err) {
      setError(err.message || "Failed to delete account");
      setLoading(false);
    }
  };

  // Show loading if auth is still loading
  if (authLoading) {
    return (
      <>
        <Nav />
        <main>
          <section className="hero hero-auth" id="home">
            <div className="hero-content">
              <h1>My Profile</h1>
              <p>Loading...</p>
            </div>
          </section>
        </main>
        <Footer />
      </>
    );
  }

  // If no user after loading, try to get from localStorage and refresh
  if (!user && token) {
    const storedUser = JSON.parse(localStorage.getItem("user") || "null");
    if (storedUser?.id) {
      // Try to refresh user data
      refreshUser();
      return (
        <>
          <Nav />
          <main>
            <section className="hero hero-auth" id="home">
              <div className="hero-content">
                <h1>My Profile</h1>
                <p>Loading profile data...</p>
              </div>
            </section>
          </main>
          <Footer />
        </>
      );
    }
    return (
      <>
        <Nav />
        <main>
          <section className="hero hero-auth" id="home">
            <div className="hero-content">
              <h1>My Profile</h1>
              <p>Unable to load profile. Please try logging in again.</p>
            </div>
          </section>
        </main>
        <Footer />
      </>
    );
  }

  if (!user) {
    return null; // ProtectedRoute will redirect
  }

  return (
    <>
      <Nav />
      <main>
        <section className="hero hero-auth" id="home">
          <div className="hero-content">
            <h1>My Profile</h1>
            <p>Manage your account settings</p>
          </div>
        </section>

        <section>
          <div className="container">
            <div className="profile-container">
              {/* My event sign-ups */}
              <ExpansionPanel
                title="My event sign-ups"
                summary={registrationsLoading ? "" : myRegistrations.length > 0 ? `${myRegistrations.length} event${myRegistrations.length !== 1 ? "s" : ""}` : null}
                defaultExpanded
              >
                {registrationsLoading ? (
                  <p style={{ color: "var(--text-gray)" }}>Loading…</p>
                ) : myRegistrations.length === 0 ? (
                  <p style={{ color: "var(--text-gray)" }}>You haven&apos;t signed up for any events yet.</p>
                ) : (
                  <ul className="profile-registrations-list">
                    {myRegistrations.map((r) => {
                      const eventDate = r.eventDate
                        ? new Date(r.eventDate).toLocaleDateString("en-US", {
                            weekday: "short",
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })
                        : "TBD";
                      return (
                        <li key={r.id} className="profile-registration-item">
                          <div className="profile-registration-info">
                            <Link to={`/events/${r.eventSlug}`} className="profile-registration-title">
                              {r.eventTitle}
                            </Link>
                            <span className="profile-registration-date">{eventDate}</span>
                            {(r.eventLocation || r.eventAddress) && (
                              <span className="profile-registration-location">
                                {[r.eventLocation, r.eventAddress].filter(Boolean).join(" · ")}
                              </span>
                            )}
                          </div>
                          <button
                            type="button"
                            className="profile-registration-cancel"
                            disabled={cancellingId === r.id}
                            onClick={async () => {
                              if (!token || !window.confirm("Cancel your RSVP for this event?")) return;
                              setCancellingId(r.id);
                              try {
                                await deleteRegistration(r.id, token);
                                setMyRegistrations((prev) => prev.filter((x) => x.id !== r.id));
                              } catch (err) {
                                setError(err.message || "Failed to cancel");
                              } finally {
                                setCancellingId(null);
                              }
                            }}
                          >
                            {cancellingId === r.id ? "Cancelling…" : "Cancel RSVP"}
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </ExpansionPanel>

              {/* Update Profile Form */}
              <ExpansionPanel title="Update Profile">
                {error && <div className="auth-error">{error}</div>}
                {success && <div className="auth-success">{success}</div>}
                
                {user && !user.emailVerified && (
                  <div className="auth-error" style={{ marginBottom: "1rem" }}>
                    <strong>Email not verified.</strong> Please check your email for a verification link.
                    <button
                      type="button"
                      onClick={async () => {
                        setResendingEmail(true);
                        try {
                          const response = await fetch(`${API_BASE_URL}/email/resend`, {
                            method: "POST",
                            headers: {
                              Authorization: `Bearer ${token}`,
                            },
                          });
                          const data = await response.json();
                          if (response.ok) {
                            setSuccess("Verification email sent! Please check your inbox.");
                          } else {
                            setError(data.message || "Failed to resend verification email");
                          }
                        } catch (err) {
                          setError("Failed to resend verification email");
                        } finally {
                          setResendingEmail(false);
                        }
                      }}
                      disabled={resendingEmail}
                      style={{
                        marginLeft: "0.5rem",
                        padding: "0.25rem 0.75rem",
                        background: "var(--primary-red)",
                        color: "white",
                        border: "none",
                        borderRadius: "3px",
                        cursor: resendingEmail ? "not-allowed" : "pointer",
                        fontSize: "0.85rem",
                      }}
                    >
                      {resendingEmail ? "Sending..." : "Resend"}
                    </button>
                  </div>
                )}

                <form onSubmit={handleUpdateProfile} className="auth-form">
                  <div className="auth-field">
                    <label htmlFor="name">Name *</label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="auth-input"
                    />
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
                      className="auth-input"
                    />
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
                    <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer" }}>
                      <input
                        type="checkbox"
                        name="emailOptIn"
                        checked={formData.emailOptIn}
                        onChange={handleChange}
                      />
                      <span>Opt in for email updates</span>
                    </label>
                  </div>

                  <button
                    type="submit"
                    className="cta-button"
                    disabled={loading}
                    style={{ width: "100%", marginTop: "1rem" }}
                  >
                    {loading ? "Updating..." : "Update Profile"}
                  </button>
                </form>
              </ExpansionPanel>

              {/* Reset Password Form */}
              <ExpansionPanel title="Reset Password">
                {error && <div className="auth-error">{error}</div>}
                {success && <div className="auth-success">{success}</div>}
                <form onSubmit={handleResetPassword} className="auth-form">
                  <div className="auth-field">
                    <label htmlFor="currentPassword">Current Password *</label>
                    <div className="password-input-wrapper">
                      <input
                        id="currentPassword"
                        name="currentPassword"
                        type={showCurrentPassword ? "text" : "password"}
                        required
                        value={passwordData.currentPassword}
                        onChange={handlePasswordChange}
                        className="auth-input"
                      />
                      <button
                        type="button"
                        className="password-toggle"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        aria-label={showCurrentPassword ? "Hide password" : "Show password"}
                      >
                        {showCurrentPassword ? (
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

                  <div className="auth-field">
                    <label htmlFor="newPassword">New Password *</label>
                    <div className="password-input-wrapper">
                      <input
                        id="newPassword"
                        name="newPassword"
                        type={showNewPassword ? "text" : "password"}
                        required
                        value={passwordData.newPassword}
                        onChange={handlePasswordChange}
                        className="auth-input"
                        minLength={8}
                      />
                      <button
                        type="button"
                        className="password-toggle"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        aria-label={showNewPassword ? "Hide password" : "Show password"}
                      >
                        {showNewPassword ? (
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
                    <PasswordRequirements password={passwordData.newPassword} />
                  </div>

                  <div className="auth-field">
                    <label htmlFor="confirmPassword">Confirm New Password *</label>
                    <div className="password-input-wrapper">
                      <input
                        id="confirmPassword"
                        name="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        required
                        value={passwordData.confirmPassword}
                        onChange={handlePasswordChange}
                        className="auth-input"
                        minLength={8}
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
                    {(() => {
                      const err = getPasswordWithConfirmError(passwordData.newPassword, passwordData.confirmPassword);
                      return err?.field === "confirmPassword" ? <div className="auth-field-error">{err.message}</div> : null;
                    })()}
                  </div>

                  <button
                    type="submit"
                    className="cta-button"
                    disabled={loading}
                    style={{ width: "100%", marginTop: "1rem" }}
                  >
                    {loading ? "Resetting..." : "Reset Password"}
                  </button>
                </form>
              </ExpansionPanel>

              {/* Delete Account */}
              <ExpansionPanel title="Delete Membership" className="profile-section-danger">
                <p style={{ color: "var(--text-gray)", marginBottom: "1rem" }}>
                  This action cannot be undone. All your data will be permanently deleted.
                </p>

                {!showDeleteConfirm ? (
                  <button
                    type="button"
                    onClick={() => setShowDeleteConfirm(true)}
                    className="cta-button"
                    style={{
                      width: "100%",
                      background: "var(--primary-red)",
                      marginTop: "1rem",
                    }}
                  >
                    Delete My Account
                  </button>
                ) : (
                    <div>
                      <div className="auth-field">
                        <label htmlFor="deletePassword">Enter your password to confirm *</label>
                        <div className="password-input-wrapper">
                          <input
                            id="deletePassword"
                            name="deletePassword"
                            type={showDeletePassword ? "text" : "password"}
                            required
                            value={deletePassword}
                            onChange={(e) => setDeletePassword(e.target.value)}
                            className="auth-input"
                            placeholder="Your password"
                          />
                          <button
                            type="button"
                            className="password-toggle"
                            onClick={() => setShowDeletePassword(!showDeletePassword)}
                            aria-label={showDeletePassword ? "Hide password" : "Show password"}
                          >
                            {showDeletePassword ? (
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
                    <div style={{ display: "flex", gap: "0.5rem", marginTop: "1rem" }}>
                      <button
                        type="button"
                        onClick={handleDeleteAccount}
                        className="cta-button"
                        disabled={loading}
                        style={{
                          flex: 1,
                          background: "var(--primary-red)",
                        }}
                      >
                        {loading ? "Deleting..." : "Confirm Delete"}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setShowDeleteConfirm(false);
                          setDeletePassword("");
                          setError("");
                        }}
                        className="cta-button"
                        disabled={loading}
                        style={{
                          flex: 1,
                          background: "var(--text-gray)",
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </ExpansionPanel>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

export default Profile;
