import { useState } from "react";
import { createRegistration } from "../api";

/**
 * Reusable registration dialog for ShredVets and VSA events.
 * @param {boolean} open - Whether the dialog is visible
 * @param {function} onClose - Called when dialog should close
 * @param {object} [event] - Optional event context { id, title, date, location } (id required to submit to backend)
 */
function RegistrationDialog({ open, onClose, event }) {
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", message: "" });

  if (!open) return null;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    if (event?.id) {
      try {
        await createRegistration({
          eventId: event.id,
          name: formData.name,
          email: formData.email,
          phone: formData.phone || undefined,
          message: formData.message || undefined,
        });
        setSubmitted(true);
        setFormData({ name: "", email: "", phone: "", message: "" });
        setTimeout(() => {
          setSubmitted(false);
          onClose();
        }, 1500);
      } catch (err) {
        setError(err.message || "Failed to submit registration");
      }
    } else {
      setSubmitted(true);
      setFormData({ name: "", email: "", phone: "", message: "" });
      setTimeout(() => {
        setSubmitted(false);
        onClose();
      }, 1500);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const heading = event
    ? `Register for ${event.title}`
    : "Register for an event";

  const subheading = event && event.date && event.location
    ? `${event.date} · ${event.location}${event.address ? ` · ${event.address}` : ""}`
    : null;

  return (
    <div
      className="registration-dialog-overlay"
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="registration-dialog-title"
    >
      <div className="registration-dialog">
        <button
          type="button"
          className="registration-dialog-close"
          onClick={onClose}
          aria-label="Close"
        >
          ×
        </button>
        <h2 id="registration-dialog-title" className="registration-dialog-title">
          {heading}
        </h2>
        {subheading && (
          <p className="registration-dialog-subtitle">{subheading}</p>
        )}

        {error && (
          <p className="auth-error" style={{ marginBottom: "1rem" }}>
            {error}
          </p>
        )}
        {submitted ? (
          <p className="registration-dialog-success">Thanks! We&apos;ll be in touch.</p>
        ) : (
          <form onSubmit={handleSubmit} className="registration-dialog-form">
            <div className="registration-dialog-field">
              <label htmlFor="reg-name">Name *</label>
              <input
                id="reg-name"
                name="name"
                type="text"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="Your name"
              />
            </div>
            <div className="registration-dialog-field">
              <label htmlFor="reg-email">Email *</label>
              <input
                id="reg-email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="your@email.com"
              />
            </div>
            <div className="registration-dialog-field">
              <label htmlFor="reg-phone">Phone</label>
              <input
                id="reg-phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                placeholder="(555) 555-5555"
              />
            </div>
            <div className="registration-dialog-field">
              <label htmlFor="reg-message">Message (optional)</label>
              <textarea
                id="reg-message"
                name="message"
                rows={3}
                value={formData.message}
                onChange={handleChange}
                placeholder="Questions or notes..."
              />
            </div>
            <div className="registration-dialog-actions">
              <button type="button" className="registration-dialog-btn secondary" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="registration-dialog-btn primary cta-button">
                Submit
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default RegistrationDialog;
