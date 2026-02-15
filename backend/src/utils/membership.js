/**
 * Generate a safe PDF filename including the applicant's name.
 * @param {Object} data - Form data with lastName, firstName
 * @returns {string} e.g. "VSA-Membership-Application-Smith-John.pdf"
 */
export function getMembershipPdfFilename(data) {
  const last = (data?.lastName || "").replace(/[^a-zA-Z0-9-]/g, "");
  const first = (data?.firstName || "").replace(/[^a-zA-Z0-9-]/g, "");
  const parts = [last, first].filter(Boolean);
  if (parts.length === 0) return "VSA-Membership-Application.pdf";
  return `VSA-Membership-Application-${parts.join("-")}.pdf`;
}
