import { getPasswordRequirements } from "../utils/password";

/** Renders the password requirements checklist (used on Register, ResetPassword, Profile). */
function PasswordRequirements({ password }) {
  if (!password) return null;
  const req = getPasswordRequirements(password);
  return (
    <div className="password-requirements">
      <div className={`password-requirement ${req.minLength ? "met" : ""}`}>
        <span className="requirement-icon">{req.minLength ? "✓" : "○"}</span>
        <span>At least 8 characters</span>
      </div>
      <div className={`password-requirement ${req.hasUpperCase ? "met" : ""}`}>
        <span className="requirement-icon">{req.hasUpperCase ? "✓" : "○"}</span>
        <span>At least one uppercase letter</span>
      </div>
      <div className={`password-requirement ${req.hasLowerCase ? "met" : ""}`}>
        <span className="requirement-icon">{req.hasLowerCase ? "✓" : "○"}</span>
        <span>At least one lowercase letter</span>
      </div>
      <div className={`password-requirement ${req.hasNumber ? "met" : ""}`}>
        <span className="requirement-icon">{req.hasNumber ? "✓" : "○"}</span>
        <span>At least one number</span>
      </div>
    </div>
  );
}

export default PasswordRequirements;
