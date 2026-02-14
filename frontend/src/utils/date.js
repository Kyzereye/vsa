/** Format a date (timestamp or YYYY-MM-DD) as "DD MMM YYYY" for display (e.g. 28 Jan 2025). */
export function formatDateDDMMMYYYY(date) {
  if (!date) return "";
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return String(date);
  const day = String(d.getDate()).padStart(2, "0");
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const month = months[d.getMonth()];
  const year = d.getFullYear();
  return `${day} ${month} ${year}`;
}

/** Format event date (YYYY-MM-DD or legacy string) for display. Omit year if event is in current year. */
export function formatEventDateDisplay(date) {
  if (!date) return "";
  const s = String(date).trim();
  const iso = s.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (iso) {
    const year = parseInt(iso[1], 10);
    const d = new Date(year, parseInt(iso[2], 10) - 1, parseInt(iso[3], 10));
    const currentYear = new Date().getFullYear();
    const options =
      year === currentYear
        ? { weekday: "short", month: "short", day: "numeric" }
        : { weekday: "short", month: "short", day: "numeric", year: "numeric" };
    return d.toLocaleDateString("en-US", options);
  }
  return s;
}
