import { useState } from "react";
import Nav from "../components/Nav";
import Footer from "../components/Footer";
import { getMembershipPdf, submitMembership } from "../api";
import { formatPhoneDisplay } from "../utils/phone";

const US_STATE_CODES = [
  "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA",
  "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD",
  "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ",
  "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC",
  "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY", "DC",
];

const BRANCHES = ["ARMY", "NAVY", "USMC", "AIR FORCE", "COAST GUARD"];
const TYPES_OF_DUTY = ["ACTIVE DUTY", "RESERVES", "NATIONAL GUARD", "AUXILIARY"];
const T_SHIRT_SIZES = ["XS", "S", "M", "L", "XL", "XXL"];

const DISCLAIMER_TEXT = `The Veterans Sportsmen's Association does not discriminate on the basis of race, creed, color, ethnicity, national origin, religion, sex, sexual orientation, gender expression, age, height, weight, physical or mental ability, veteran status, military obligations, OR marital status.

We reserve the right to deny any application for membership due to legal or civil reasons specified in the Association's bylaws.

I would like to apply for a membership in the Veterans Sportsmen's Association. I understand that false or misleading information in my application may result in my disqualification. I certify that my answers are true and complete to the best of my knowledge.`;

function Membership() {
  const today = new Date().toISOString().slice(0, 10);
  const [formData, setFormData] = useState({
    lastName: "",
    firstName: "",
    mi: "",
    address: "",
    apt: "",
    city: "",
    state: "",
    zip: "",
    email: "",
    phone: "",
    cell: "",
    dob: "",
    employment: "",
    isVeteran: "",
    lastFourSSN: "",
    branchOfService: "",
    typeOfDuty: "",
    enlistmentDate: "",
    dischargeDate: "",
    currentlyActive: "",
    primaryAfscMos: "",
    secondaryAfscMos: "",
    highestRankGrade: "",
    firearmCourses: "",
    membershipType: "veteran",
    tShirtSize: "",
    referral1Name: "",
    referral1Signature: "",
    referral1Date: "",
    referral2Name: "",
    referral2Signature: "",
    referral2Date: "",
    signatureInitials: "",
    signatureLastFourSSN: "",
    date: today,
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(null);
  const [success, setSuccess] = useState(null);
  const [showTshirtDialog, setShowTshirtDialog] = useState(false);
  const [showSubmitConfirmDialog, setShowSubmitConfirmDialog] = useState(false);

  const handleZipKeyDown = (e) => {
    const key = e.key;
    const allowed = ["Backspace", "Tab", "Delete", "ArrowLeft", "ArrowRight", "Home", "End"];
    if (allowed.includes(key)) return;
    if (/^\d$/.test(key)) return;
    e.preventDefault();
  };

  const handleNumericKeyDown = (maxLen) => (e) => {
    const key = e.key;
    const allowed = ["Backspace", "Tab", "Delete", "ArrowLeft", "ArrowRight", "Home", "End"];
    if (allowed.includes(key)) return;
    if (/^\d$/.test(key)) return;
    e.preventDefault();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "phone" || name === "cell") {
      const digits = String(value).replace(/\D/g, "").slice(0, 10);
      setFormData((prev) => ({ ...prev, [name]: digits }));
    } else if (name === "zip") {
      const digits = String(value).replace(/\D/g, "").slice(0, 5);
      setFormData((prev) => ({ ...prev, zip: digits }));
    } else if (name === "lastFourSSN" || name === "signatureLastFourSSN") {
      const digits = String(value).replace(/\D/g, "").slice(0, 4);
      setFormData((prev) => ({ ...prev, [name]: digits }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
    setSuccess(null);
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.lastName?.trim()) newErrors.lastName = "Last name is required";
    if (!formData.firstName?.trim()) newErrors.firstName = "First name is required";
    if (!formData.address?.trim()) newErrors.address = "Address is required";
    if (!formData.city?.trim()) newErrors.city = "City is required";
    if (!formData.state?.trim()) newErrors.state = "State is required";
    if (!formData.zip?.trim()) newErrors.zip = "ZIP is required";
    else if (!/^\d{5}$/.test(formData.zip)) newErrors.zip = "ZIP must be exactly 5 digits";
    if (!formData.email?.trim()) newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = "Invalid email format";
    if (!formData.phone?.trim()) newErrors.phone = "Phone is required";
    if (!formData.dob?.trim()) newErrors.dob = "Date of birth is required";
    if (!formData.isVeteran) newErrors.isVeteran = "Please select Yes or No for Veteran";
    if (!formData.membershipType) newErrors.membershipType = "Membership type is required";
    if (!formData.tShirtSize?.trim()) newErrors.tShirtSize = "T-shirt size is required";
    if (!formData.referral1Name?.trim()) newErrors.referral1Name = "Referral 1 name is required";
    if (!formData.referral2Name?.trim()) newErrors.referral2Name = "Referral 2 name is required";
    if (!formData.signatureInitials?.trim()) newErrors.signatureInitials = "Initials required for electronic signature";
    if (!formData.signatureLastFourSSN?.trim()) newErrors.signatureLastFourSSN = "Last 4 of SSN required for electronic signature";
    else if (!/^\d{4}$/.test(formData.signatureLastFourSSN)) newErrors.signatureLastFourSSN = "Must be 4 digits";
    if (formData.isVeteran === "yes") {
      if (!formData.lastFourSSN?.trim()) newErrors.lastFourSSN = "Last 4 of SSN required for veterans";
      else if (!/^\d{4}$/.test(formData.lastFourSSN)) newErrors.lastFourSSN = "Must be 4 digits";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleDownloadPdf = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading("download");
    setErrors({});
    try {
      const blob = await getMembershipPdf(formData);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      const last = (formData.lastName || "").replace(/[^a-zA-Z0-9-]/g, "");
      const first = (formData.firstName || "").replace(/[^a-zA-Z0-9-]/g, "");
      const namePart = [last, first].filter(Boolean);
      a.download = namePart.length ? `VSA-Membership-Application-${namePart.join("-")}.pdf` : "VSA-Membership-Application.pdf";
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      setErrors({ submit: err.message || "Failed to generate PDF" });
    } finally {
      setLoading(null);
    }
  };

  const openSubmitConfirmDialog = (e) => {
    e.preventDefault();
    if (!validate()) return;
    setErrors({});
    setShowSubmitConfirmDialog(true);
  };

  const handleConfirmSubmit = async () => {
    setLoading("submit");
    setErrors({});
    setSuccess(null);
    try {
      await submitMembership(formData);
      setSuccess("Your application has been submitted to the VSA. A copy has been sent to your email.");
      setShowSubmitConfirmDialog(false);
    } catch (err) {
      setErrors({ submit: err.message || "Failed to submit" });
    } finally {
      setLoading(null);
    }
  };

  const isVeteran = formData.isVeteran === "yes";

  return (
    <>
      <Nav />
      <main>
        <section className="hero hero-auth" id="home">
          <div className="hero-content">
            <h1>VSA Membership Application</h1>
            <p>2026 Membership Application — Veteran or Associate</p>
          </div>
        </section>

        <section>
          <div className="container">
            <div className="auth-form-container" style={{ maxWidth: "640px" }}>
              <p style={{ color: "var(--text-gray)", marginBottom: "1rem" }}>
                Fill out the form below. You can <strong>download the completed application as a PDF</strong> or{" "}
                <strong>submit it online</strong>. *If filing electronically, provide your initials and last 4 of SSN in lieu of signature.
              </p>

              {success && <div className="auth-success">{success}</div>}
              {errors.submit && <div className="auth-error">{errors.submit}</div>}

              <form onSubmit={(e) => e.preventDefault()} className="auth-form">
                <h3 className="membership-section-title">Personal Information</h3>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 60px", gap: "0.75rem" }}>
                  <div className="auth-field">
                    <label htmlFor="lastName">Last Name *</label>
                    <input id="lastName" name="lastName" type="text" value={formData.lastName} onChange={handleChange} className={`auth-input ${errors.lastName ? "auth-input-error" : ""}`} placeholder="" />
                    {errors.lastName && <div className="auth-field-error">{errors.lastName}</div>}
                  </div>
                  <div className="auth-field">
                    <label htmlFor="firstName">First Name *</label>
                    <input id="firstName" name="firstName" type="text" value={formData.firstName} onChange={handleChange} className={`auth-input ${errors.firstName ? "auth-input-error" : ""}`} placeholder="" />
                    {errors.firstName && <div className="auth-field-error">{errors.firstName}</div>}
                  </div>
                  <div className="auth-field">
                    <label htmlFor="mi">MI</label>
                    <input id="mi" name="mi" type="text" value={formData.mi} onChange={handleChange} className="auth-input" maxLength={2} />
                  </div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 100px", gap: "0.75rem" }}>
                  <div className="auth-field">
                    <label htmlFor="address">Address *</label>
                    <input id="address" name="address" type="text" value={formData.address} onChange={handleChange} className={`auth-input ${errors.address ? "auth-input-error" : ""}`} placeholder="" />
                    {errors.address && <div className="auth-field-error">{errors.address}</div>}
                  </div>
                  <div className="auth-field">
                    <label htmlFor="apt">Apt #</label>
                    <input id="apt" name="apt" type="text" value={formData.apt} onChange={handleChange} className="auth-input"/>
                  </div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 80px", gap: "0.75rem" }}>
                  <div className="auth-field">
                    <label htmlFor="city">City / Town *</label>
                    <input id="city" name="city" type="text" value={formData.city} onChange={handleChange} className={`auth-input ${errors.city ? "auth-input-error" : ""}`} placeholder="" />
                    {errors.city && <div className="auth-field-error">{errors.city}</div>}
                  </div>
                  <div className="auth-field">
                    <label htmlFor="state">State *</label>
                    <select id="state" name="state" value={formData.state} onChange={handleChange} className={`auth-input ${errors.state ? "auth-input-error" : ""}`}>
                      <option value="">Select</option>
                      {US_STATE_CODES.map((code) => <option key={code} value={code}>{code}</option>)}
                    </select>
                    {errors.state && <div className="auth-field-error">{errors.state}</div>}
                  </div>
                  <div className="auth-field">
                    <label htmlFor="zip">ZIP *</label>
                    <input id="zip" name="zip" type="text" inputMode="numeric" maxLength={5} value={formData.zip} onKeyDown={handleZipKeyDown} onChange={handleChange} className={`auth-input ${errors.zip ? "auth-input-error" : ""}`} />
                    {errors.zip && <div className="auth-field-error">{errors.zip}</div>}
                  </div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0.75rem" }}>
                  <div className="auth-field">
                    <label htmlFor="email">Email *</label>
                    <input id="email" name="email" type="email" value={formData.email} onChange={handleChange} className={`auth-input ${errors.email ? "auth-input-error" : ""}`} />
                    {errors.email && <div className="auth-field-error">{errors.email}</div>}
                  </div>
                  <div className="auth-field">
                    <label htmlFor="phone">Phone *</label>
                    <input id="phone" name="phone" type="tel" value={(formData.phone || "").length === 10 ? formatPhoneDisplay(formData.phone) : (formData.phone || "")} onChange={handleChange} className={`auth-input ${errors.phone ? "auth-input-error" : ""}`} placeholder="(555) 555-5555" />
                    {errors.phone && <div className="auth-field-error">{errors.phone}</div>}
                  </div>
                  <div className="auth-field">
                    <label htmlFor="cell">Cell</label>
                    <input id="cell" name="cell" type="tel" value={(formData.cell || "").length === 10 ? formatPhoneDisplay(formData.cell) : (formData.cell || "")} onChange={handleChange} className="auth-input" placeholder="" />
                  </div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
                  <div className="auth-field">
                    <label htmlFor="dob">DOB (MM/DD/YYYY) *</label>
                    <input id="dob" name="dob" type="date" value={formData.dob} onChange={handleChange} className={`auth-input ${errors.dob ? "auth-input-error" : ""}`} />
                    {errors.dob && <div className="auth-field-error">{errors.dob}</div>}
                  </div>
                  <div className="auth-field">
                    <label htmlFor="employment">Employment / Job Title</label>
                    <input id="employment" name="employment" type="text" value={formData.employment} onChange={handleChange} className="auth-input" />
                  </div>
                </div>

                <h3 className="membership-section-title">1. Veteran?</h3>
                <div className="auth-field">
                  <label style={{ display: "flex", gap: "1rem", alignItems: "center", flexWrap: "wrap" }}>
                    <span>Veteran? *</span>
                    {errors.isVeteran && <span className="auth-field-error" style={{ marginLeft: "0.5rem" }}>{errors.isVeteran}</span>}
                    <label style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}><input type="radio" name="isVeteran" value="yes" checked={formData.isVeteran === "yes"} onChange={handleChange} /> YES</label>
                    <label style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}><input type="radio" name="isVeteran" value="no" checked={formData.isVeteran === "no"} onChange={handleChange} /> NO</label>
                  </label>
                </div>
                {isVeteran && (
                  <>
                    <div className="auth-field">
                      <label htmlFor="lastFourSSN">Last Four of SSN (XXX-XX-____) *</label>
                      <input id="lastFourSSN" name="lastFourSSN" type="text" inputMode="numeric" maxLength={4} value={formData.lastFourSSN} onKeyDown={handleNumericKeyDown(4)} onChange={handleChange} className={`auth-input ${errors.lastFourSSN ? "auth-input-error" : ""}`} placeholder="1234" />
                      {errors.lastFourSSN && <div className="auth-field-error">{errors.lastFourSSN}</div>}
                    </div>
                    <div className="auth-field">
                      <label>Branch of Service</label>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                        {BRANCHES.map((b) => (
                          <label key={b} style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
                            <input type="radio" name="branchOfService" value={b} checked={formData.branchOfService === b} onChange={handleChange} /> {b}
                          </label>
                        ))}
                      </div>
                    </div>
                    <div className="auth-field">
                      <label>Type of Duty</label>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                        {TYPES_OF_DUTY.map((d) => (
                          <label key={d} style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
                            <input type="radio" name="typeOfDuty" value={d} checked={formData.typeOfDuty === d} onChange={handleChange} /> {d}
                          </label>
                        ))}
                      </div>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0.75rem" }}>
                      <div className="auth-field">
                        <label htmlFor="enlistmentDate">Enlistment Date</label>
                        <input id="enlistmentDate" name="enlistmentDate" type="date" value={formData.enlistmentDate} onChange={handleChange} className="auth-input" />
                      </div>
                      <div className="auth-field">
                        <label htmlFor="dischargeDate">Discharge Date</label>
                        <input id="dischargeDate" name="dischargeDate" type="date" value={formData.dischargeDate} onChange={handleChange} className="auth-input" />
                      </div>
                      <div className="auth-field">
                        <label htmlFor="currentlyActive">Currently Active</label>
                        <input id="currentlyActive" name="currentlyActive" type="text" value={formData.currentlyActive} onChange={handleChange} className="auth-input" placeholder="" />
                      </div>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0.75rem" }}>
                      <div className="auth-field">
                        <label htmlFor="primaryAfscMos">Primary AFSC/MOS</label>
                        <input id="primaryAfscMos" name="primaryAfscMos" type="text" value={formData.primaryAfscMos} onChange={handleChange} className="auth-input" />
                      </div>
                      <div className="auth-field">
                        <label htmlFor="secondaryAfscMos">Secondary AFSC/MOS</label>
                        <input id="secondaryAfscMos" name="secondaryAfscMos" type="text" value={formData.secondaryAfscMos} onChange={handleChange} className="auth-input" />
                      </div>
                      <div className="auth-field">
                        <label htmlFor="highestRankGrade">Highest Rank/Grade</label>
                        <input id="highestRankGrade" name="highestRankGrade" type="text" value={formData.highestRankGrade} onChange={handleChange} className="auth-input" />
                      </div>
                    </div>
                    <p style={{ fontSize: "0.85rem", color: "var(--text-gray)", marginTop: "0.5rem" }}>
                      *Please provide a copy of your DD-214, NGB-22 or US Government issued Veteran ID. PDF, JPG or BMP accepted if filing online.
                    </p>
                  </>
                )}

                <h3 className="membership-section-title">2. Firearm Classes / Tactical Courses Taken</h3>
                <div className="auth-field">
                  <textarea id="firearmCourses" name="firearmCourses" value={formData.firearmCourses} onChange={handleChange} className="auth-input" rows={3} placeholder="" />
                </div>

                <h3 className="membership-section-title">Membership</h3>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
                  <div className="auth-field">
                    <label htmlFor="membershipType">Membership Requested *</label>
                    <select id="membershipType" name="membershipType" value={formData.membershipType} onChange={handleChange} className={`auth-input ${errors.membershipType ? "auth-input-error" : ""}`}>
                      <option value="veteran">Veteran</option>
                      <option value="associate">Associate</option>
                    </select>
                  </div>
                  <div className="auth-field">
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.35rem" }}>
                      <label htmlFor="tShirtSize">T-Shirt Size *</label>
                      <button type="button" className="membership-tshirt-link" onClick={() => setShowTshirtDialog(true)}>
                        View T-Shirt
                      </button>
                    </div>
                    <select id="tShirtSize" name="tShirtSize" value={formData.tShirtSize} onChange={handleChange} className={`auth-input ${errors.tShirtSize ? "auth-input-error" : ""}`}>
                      <option value="">Select size</option>
                      {T_SHIRT_SIZES.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                    {errors.tShirtSize && <div className="auth-field-error">{errors.tShirtSize}</div>}
                  </div>
                </div>
                <p style={{ fontSize: "0.9rem", color: "var(--text-gray)" }}>2026 Membership fees: $30.00 (Veteran) / $30.00 (Associate)</p>

                {showTshirtDialog && (
                  <div
                    className="registration-dialog-overlay"
                    onClick={(e) => e.target === e.currentTarget && setShowTshirtDialog(false)}
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="tshirt-dialog-title"
                  >
                    <div className="registration-dialog" style={{ maxWidth: "90vw", width: "400px" }} onClick={(e) => e.stopPropagation()}>
                      <button type="button" className="registration-dialog-close" onClick={() => setShowTshirtDialog(false)} aria-label="Close">×</button>
                      <h2 id="tshirt-dialog-title" className="registration-dialog-title" style={{ paddingRight: "2rem" }}>2026 TRR VSA Membership T-Shirt</h2>
                      <p className="registration-dialog-subtitle">All new and renewing members receive this free T-shirt.</p>
                      <img src="/membership-tshirt-2026.jpg" alt="2026 TRR VSA Membership T-Shirt" style={{ width: "100%", height: "auto", display: "block", borderRadius: 8 }} />
                      <div style={{ marginTop: "1rem", textAlign: "center" }}>
                        <button type="button" className="cta-button" onClick={() => setShowTshirtDialog(false)}>Close</button>
                      </div>
                    </div>
                  </div>
                )}

                {showSubmitConfirmDialog && (
                  <div
                    className="registration-dialog-overlay"
                    onClick={(e) => e.target === e.currentTarget && setShowSubmitConfirmDialog(false)}
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="submit-confirm-dialog-title"
                  >
                    <div className="registration-dialog" style={{ maxWidth: "90vw", width: "420px" }} onClick={(e) => e.stopPropagation()}>
                      <button type="button" className="registration-dialog-close" onClick={() => setShowSubmitConfirmDialog(false)} aria-label="Close">×</button>
                      <h2 id="submit-confirm-dialog-title" className="registration-dialog-title" style={{ paddingRight: "2rem" }}>Confirm submission</h2>
                      <p className="registration-dialog-subtitle" style={{ marginBottom: "0.75rem" }}>
                        Are you sure you want to submit your application? A copy of your application will be sent to the email address you provided. Please verify it is correct.
                      </p>
                      <p className="registration-dialog-subtitle" style={{ marginBottom: "0.25rem", fontWeight: 600, color: "var(--dark-gray)" }}>Email address:</p>
                      <p style={{ fontSize: "1rem", fontWeight: 600, color: "var(--primary-blue)", wordBreak: "break-all", marginBottom: "1.25rem" }}>{formData.email || "—"}</p>
                      {errors.submit && <div className="auth-field-error" style={{ marginBottom: "1rem" }}>{errors.submit}</div>}
                      <div className="registration-dialog-actions" style={{ justifyContent: "flex-end", gap: "0.75rem" }}>
                        <button type="button" className="registration-dialog-btn secondary" onClick={() => setShowSubmitConfirmDialog(false)}>Cancel</button>
                        <button type="button" className="registration-dialog-btn primary" onClick={handleConfirmSubmit} disabled={loading === "submit"}>
                          {loading === "submit" ? "Submitting…" : "Yes, submit"}
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                <h3 className="membership-section-title">Two VSA Member Referrals (must be in good standing)</h3>
                <div className="auth-field">
                  <label htmlFor="referral1Name">Referral 1 Name *</label>
                  <input id="referral1Name" name="referral1Name" type="text" value={formData.referral1Name} onChange={handleChange} className={`auth-input ${errors.referral1Name ? "auth-input-error" : ""}`} placeholder="" />
                  {errors.referral1Name && <div className="auth-field-error">{errors.referral1Name}</div>}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem", marginTop: "0.5rem" }}>
                    <input name="referral1Signature" type="text" value={formData.referral1Signature} onChange={handleChange} className="auth-input" placeholder="Signature" />
                    <input name="referral1Date" type="date" value={formData.referral1Date} onChange={handleChange} className="auth-input" placeholder="" />
                  </div>
                </div>
                <div className="auth-field">
                  <label htmlFor="referral2Name">Referral 2 Name *</label>
                  <input id="referral2Name" name="referral2Name" type="text" value={formData.referral2Name} onChange={handleChange} className={`auth-input ${errors.referral2Name ? "auth-input-error" : ""}`} placeholder="" />
                  {errors.referral2Name && <div className="auth-field-error">{errors.referral2Name}</div>}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem", marginTop: "0.5rem" }}>
                    <input name="referral2Signature" type="text" value={formData.referral2Signature} onChange={handleChange} className="auth-input" placeholder="Signature" />
                    <input name="referral2Date" type="date" value={formData.referral2Date} onChange={handleChange} className="auth-input" placeholder="" />
                  </div>
                </div>

                <h3 className="membership-section-title">Disclaimer and Signature</h3>
                <div style={{ fontSize: "0.85rem", color: "var(--text-gray)", whiteSpace: "pre-line", marginBottom: "1rem", lineHeight: 1.5 }}>{DISCLAIMER_TEXT}</div>
                <p style={{ fontSize: "0.85rem", color: "var(--text-gray)", marginBottom: "0.75rem" }}>*If filing electronically, provide your initials and the last four digits of your SSN in lieu of a signature.</p>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0.75rem" }}>
                  <div className="auth-field">
                    <label htmlFor="signatureInitials">Initials *</label>
                    <input id="signatureInitials" name="signatureInitials" type="text" value={formData.signatureInitials} onChange={handleChange} className={`auth-input ${errors.signatureInitials ? "auth-input-error" : ""}`} placeholder="e.g. J.D." />
                    {errors.signatureInitials && <div className="auth-field-error">{errors.signatureInitials}</div>}
                  </div>
                  <div className="auth-field">
                    <label htmlFor="signatureLastFourSSN">Last 4 of SSN *</label>
                    <input id="signatureLastFourSSN" name="signatureLastFourSSN" type="text" inputMode="numeric" maxLength={4} value={formData.signatureLastFourSSN} onKeyDown={handleNumericKeyDown(4)} onChange={handleChange} className={`auth-input ${errors.signatureLastFourSSN ? "auth-input-error" : ""}`} placeholder="1234" />
                    {errors.signatureLastFourSSN && <div className="auth-field-error">{errors.signatureLastFourSSN}</div>}
                  </div>
                  <div className="auth-field">
                    <label htmlFor="date">Date *</label>
                    <input id="date" name="date" type="date" value={formData.date} onChange={handleChange} className="auth-input" />
                  </div>
                </div>

                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem", marginTop: "1.25rem" }}>
                  <button type="button" className="cta-button" onClick={handleDownloadPdf} disabled={loading !== null} style={{ flex: "1 1 auto" }}>
                    {loading === "download" ? "Generating…" : "Download PDF"}
                  </button>
                  <button type="button" className="cta-button" onClick={openSubmitConfirmDialog} disabled={loading !== null} style={{ flex: "1 1 auto", background: "var(--dark-gray)" }}>
                    {loading === "submit" ? "Submitting…" : "Submit to VSA"}
                  </button>
                </div>
              </form>

              <p style={{ marginTop: "1.5rem", fontSize: "0.9rem", color: "var(--text-gray)" }}>You can also mail your completed application to:</p>
              <p style={{ marginTop: "0.5rem", fontSize: "0.9rem", color: "var(--text-gray)", lineHeight: 1.5 }}>
                Veterans Sportsmens Association<br />
                1335 Route 44 – Suite 1<br />
                Pleasant Valley, NY 12569
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

export default Membership;
