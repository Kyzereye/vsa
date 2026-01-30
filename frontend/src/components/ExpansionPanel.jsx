import { useState } from "react";

/**
 * Accordion-style expansion panel (similar to Angular Material mat-expansion-panel).
 * @param {string} title - Header label
 * @param {React.ReactNode} [summary] - Optional summary/badge shown in header (e.g. count)
 * @param {boolean} [defaultExpanded] - Whether panel is open initially
 * @param {boolean} [disabled] - If true, header is not clickable
 * @param {string} [className] - Extra class for the panel container (e.g. profile-section-danger)
 * @param {React.ReactNode} children - Panel content
 */
function ExpansionPanel({ title, summary, defaultExpanded = false, disabled = false, className = "", children }) {
  const [expanded, setExpanded] = useState(defaultExpanded);

  return (
    <div className={`expansion-panel ${expanded ? "expansion-panel-expanded" : ""} ${className}`.trim()}>
      <button
        type="button"
        className="expansion-panel-header"
        onClick={() => !disabled && setExpanded((e) => !e)}
        disabled={disabled}
        aria-expanded={expanded}
        aria-controls="expansion-panel-content"
      >
        <span className="expansion-panel-title">{title}</span>
        {summary != null && <span className="expansion-panel-summary">{summary}</span>}
        <span className="expansion-panel-indicator" aria-hidden>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </span>
      </button>
      <div className="expansion-panel-content" role="region">
        <div className="expansion-panel-body">{children}</div>
      </div>
    </div>
  );
}

export default ExpansionPanel;
