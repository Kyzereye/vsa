/**
 * Shared password requirement and validation for Register, ResetPassword, and Profile.
 */

const MIN_LENGTH = 8;

/** Returns requirement flags for the given password (for UI checklist). */
export function getPasswordRequirements(password) {
  const p = password ?? "";
  return {
    minLength: p.length >= MIN_LENGTH,
    hasUpperCase: /[A-Z]/.test(p),
    hasLowerCase: /[a-z]/.test(p),
    hasNumber: /[0-9]/.test(p),
  };
}

/** Returns the first validation error message for the password, or null if valid. */
export function getPasswordError(password) {
  if (!password || !password.trim()) {
    return "Password is required";
  }
  if (password.length < MIN_LENGTH) {
    return "Password must be at least 8 characters";
  }
  if (!/[A-Z]/.test(password)) {
    return "Password must contain at least one uppercase letter";
  }
  if (!/[a-z]/.test(password)) {
    return "Password must contain at least one lowercase letter";
  }
  if (!/[0-9]/.test(password)) {
    return "Password must contain at least one number";
  }
  return null;
}

/**
 * Returns a validation error for password + confirm, or null if valid.
 * When non-null: { field: 'password' | 'confirmPassword', message: string }
 * so callers can set the error on the right field without comparing message text.
 */
export function getPasswordWithConfirmError(password, confirmPassword) {
  const err = getPasswordError(password);
  if (err) return { field: "password", message: err };
  if (password !== confirmPassword) {
    return { field: "confirmPassword", message: "Passwords do not match" };
  }
  return null;
}
