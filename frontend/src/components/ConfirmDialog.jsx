/**
 * Reusable "Are you sure?" confirmation dialog.
 * @param {boolean} open - Whether the dialog is visible
 * @param {function} onClose - Called when user cancels or closes
 * @param {function} onConfirm - Called when user confirms
 * @param {string} [title="Are you sure?"] - Dialog title
 * @param {string|React.ReactNode} [message] - Body text or content
 * @param {string} [confirmLabel="Confirm"] - Confirm button text
 * @param {string} [cancelLabel="Cancel"] - Cancel button text
 * @param {string} [variant] - "danger" for destructive actions (red confirm button)
 */
function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title = "Are you sure?",
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  variant,
}) {
  if (!open) return null;

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  const confirmClass = variant === "danger"
    ? "registration-dialog-btn confirm-dialog-btn-danger"
    : "registration-dialog-btn primary";

  return (
    <div
      className="registration-dialog-overlay"
      onClick={(e) => e.target === e.currentTarget && onClose()}
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-dialog-title"
    >
      <div className="registration-dialog" style={{ maxWidth: "90vw", width: "360px" }} onClick={(e) => e.stopPropagation()}>
        <button type="button" className="registration-dialog-close" onClick={onClose} aria-label="Close">
          ×
        </button>
        <h2 id="confirm-dialog-title" className="registration-dialog-title" style={{ paddingRight: "2rem" }}>
          {title}
        </h2>
        {message && (
          <p className="registration-dialog-subtitle" style={{ marginBottom: "1.25rem" }}>
            {message}
          </p>
        )}
        <div className="registration-dialog-actions" style={{ justifyContent: "flex-end", gap: "0.75rem" }}>
          <button type="button" className="registration-dialog-btn secondary" onClick={onClose}>
            {cancelLabel}
          </button>
          <button type="button" className={confirmClass} onClick={handleConfirm}>
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmDialog;
