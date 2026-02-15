import PDFDocument from "pdfkit";
import { sendMembershipSubmission, sendMembershipCopyToApplicant } from "../services/emailService.js";
import { getMembershipPdfFilename } from "../utils/membership.js";

function formatPhoneForPdf(phone) {
  if (!phone) return "";
  const digits = String(phone).replace(/\D/g, "").slice(0, 10);
  if (digits.length !== 10) return String(phone).trim();
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
}

function row(doc, left, labelWidth, y, label, value, fontSize = 9) {
  doc.fontSize(fontSize).font("Helvetica-Bold").text(label, left, y, { width: labelWidth });
  doc.font("Helvetica").text(String(value || "—").slice(0, 80), left + labelWidth, y);
}

/**
 * Build VSA Membership Application PDF (2 pages) from form data.
 */
export function buildMembershipPdf(data) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 50, size: "LETTER" });
    const chunks = [];
    doc.on("data", (chunk) => chunks.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);

    const left = 50;
    const labelWidth = 100;
    const lineH = 14;
    const smallH = 12;

    doc.fontSize(14).font("Helvetica-Bold").text("VETERANS SPORTSMENS ASSOCIATION", { align: "center" });
    doc.moveDown(0.3);
    doc.fontSize(12).font("Helvetica").text("2026 MEMBERSHIP APPLICATION", { align: "center" });
    doc.moveDown(0.8);

    doc.fontSize(9).font("Helvetica");
    let y = doc.y;

    row(doc, left, 55, y, "LAST NAME:", data.lastName);
    row(doc, left + 180, 55, y, "FIRST NAME:", data.firstName);
    doc.font("Helvetica").text(data.mi || "—", left + 380, y);
    doc.font("Helvetica-Bold").text("MI:", left + 355, y);
    y += lineH;

    row(doc, left, 65, y, "ADDRESS:", data.address);
    doc.font("Helvetica-Bold").text("APT #:", left + 320, y);
    doc.font("Helvetica").text(data.apt || "—", left + 360, y);
    y += lineH;

    row(doc, left, 75, y, "CITY / TOWN:", data.city);
    doc.font("Helvetica-Bold").text("STATE:", left + 220, y);
    doc.font("Helvetica").text(data.state || "—", left + 260, y);
    doc.font("Helvetica-Bold").text("ZIP CODE:", left + 320, y);
    doc.font("Helvetica").text(data.zip || "—", left + 380, y);
    y += lineH;

    row(doc, left, 35, y, "EMAIL:", data.email);
    row(doc, left + 200, 40, y, "PHONE:", formatPhoneForPdf(data.phone));
    doc.font("Helvetica-Bold").text("CELL:", left + 360, y);
    doc.font("Helvetica").text(formatPhoneForPdf(data.cell) || "—", left + 395, y);
    y += lineH;

    doc.font("Helvetica-Bold").text("DOB (MM/DD/YYYY):", left, y);
    doc.font("Helvetica").text(data.dob || "—", left + 110, y);
    doc.font("Helvetica-Bold").text("EMPLOYMENT / JOB TITLE:", left + 260, y);
    doc.font("Helvetica").text((data.employment || "—").slice(0, 35), left + 400, y);
    y += lineH + 4;

    doc.font("Helvetica-Bold").text("1. VETERAN?  YES", left, y);
    doc.font("Helvetica").text(data.isVeteran === "yes" ? "X" : " ", left + 95, y);
    doc.font("Helvetica-Bold").text("NO (IF NO THEN SKIP TO 2)", left + 110, y);
    doc.font("Helvetica").text(data.isVeteran === "no" ? "X" : " ", left + 215, y);
    doc.font("Helvetica-Bold").text("LAST FOUR OF SSN: XXX-XX-", left + 320, y);
    doc.font("Helvetica").text(data.lastFourSSN || "—", left + 440, y);
    y += lineH;

    if (data.isVeteran === "yes") {
      doc.font("Helvetica-Bold").text("BRANCH OF SERVICE:", left, y);
      ["ARMY", "NAVY", "USMC", "AIR FORCE", "COAST GUARD"].forEach((b, i) => {
        doc.font("Helvetica").text(data.branchOfService === b ? "X" : " ", left + 115 + i * 72, y);
        doc.font("Helvetica").text(b, left + 120 + i * 72, y);
      });
      y += lineH;
      doc.font("Helvetica-Bold").text("TYPE OF DUTY:", left, y);
      ["ACTIVE DUTY", "RESERVES", "NATIONAL GUARD", "AUXILIARY"].forEach((d, i) => {
        doc.font("Helvetica").text(data.typeOfDuty === d ? "X" : " ", left + 75 + i * 95, y);
        doc.font("Helvetica").text(d, left + 78 + i * 95, y);
      });
      y += lineH;
      doc.font("Helvetica-Bold").text("ENLISTMENT DATE:", left, y);
      doc.font("Helvetica").text(data.enlistmentDate || "—", left + 95, y);
      doc.font("Helvetica-Bold").text("DISCHARGE DATE:", left + 200, y);
      doc.font("Helvetica").text(data.dischargeDate || "—", left + 280, y);
      doc.font("Helvetica-Bold").text("CURRENTLY ACTIVE:", left + 370, y);
      doc.font("Helvetica").text((data.currentlyActive || "—").slice(0, 12), left + 465, y);
      y += lineH;
      row(doc, left, 110, y, "PRIMARY AFSC/MOS:", data.primaryAfscMos);
      row(doc, left + 220, 115, y, "SECONDARY AFSC/MOS:", data.secondaryAfscMos);
      doc.font("Helvetica-Bold").text("HIGHEST RANK/GRADE:", left + 440, y);
      doc.font("Helvetica").text((data.highestRankGrade || "—").slice(0, 15), left + 535, y);
      y += lineH + 2;
      doc.fontSize(8).font("Helvetica").text("*PLEASE PROVIDE A COPY OF YOUR DD-214, NGB-22 OR US GOVERNMENT ISSUED VETERAN ID WITH YOUR APPLICATION*", left, y, { width: 500 });
      doc.text("PDF, JPG OR BMP FILE OF DOCUMENTATION ACCEPTED IF FILING APPLICATION ONLINE", left, y + 10, { width: 500 });
      y += 24;
    } else {
      y += 4;
    }

    doc.fontSize(9).font("Helvetica-Bold").text("2. FIREARM CLASSES / TACTICAL COURSES TAKEN:", left, y);
    y += lineH;
    doc.font("Helvetica").text((data.firearmCourses || "—").slice(0, 120) || "—", left, y, { width: 500 });
    y += lineH + 4;

    doc.font("Helvetica-Bold").text("MEMBERSHIP REQUESTED:", left, y);
    doc.font("Helvetica").text(data.membershipType === "veteran" ? "VETERAN" : "ASSOCIATE", left + 120, y);
    doc.font("Helvetica").text(data.membershipType === "associate" ? "VETERAN" : "ASSOCIATE", left + 220, y);
    doc.font("Helvetica-Bold").text("T-SHIRT SIZE:", left + 320, y);
    doc.font("Helvetica").text(data.tShirtSize || "—", left + 400, y);
    y += lineH;
    doc.font("Helvetica").text("2026 MEMBERSHIP FEES ARE:  $30.00  $30.00", left, y);
    y += lineH + 4;

    doc.font("Helvetica-Bold").text("PLEASE PROVIDE TWO CURRENT VSA MEMBER REFERRALS: (MUST BE IN GOOD STANDING)", left, y);
    y += lineH;
    doc.font("Helvetica-Bold").text("1.", left, y);
    doc.font("Helvetica").text((data.referral1Name || "—").slice(0, 35), left + 20, y);
    doc.font("Helvetica-Bold").text("SIGNATURE*:", left + 280, y);
    doc.font("Helvetica").text((data.referral1Signature || "—").slice(0, 25), left + 345, y);
    doc.font("Helvetica-Bold").text("DATE:", left + 450, y);
    doc.font("Helvetica").text(data.referral1Date || "—", left + 485, y);
    y += lineH;
    doc.font("Helvetica-Bold").text("2.", left, y);
    doc.font("Helvetica").text((data.referral2Name || "—").slice(0, 35), left + 20, y);
    doc.font("Helvetica-Bold").text("SIGNATURE*:", left + 280, y);
    doc.font("Helvetica").text((data.referral2Signature || "—").slice(0, 25), left + 345, y);
    doc.font("Helvetica-Bold").text("DATE:", left + 450, y);
    doc.font("Helvetica").text(data.referral2Date || "—", left + 485, y);
    y += lineH + 6;

    doc.fontSize(8).font("Helvetica").text(
      "Disclaimer and Signature: The Veterans Sportsmen's Association does not discriminate on the basis of race, creed, color, ethnicity, national origin, religion, sex, sexual orientation, gender expression, age, height, weight, physical or mental ability, veteran status, military obligations, OR marital status.",
      left,
      y,
      { width: 510 }
    );
    y += 24;
    doc.text(
      "We reserve the right to deny any application for membership due to legal or civil reasons specified in the Association's bylaws. I would like to apply for a membership in the Veterans Sportsmen's Association. I understand that false or misleading information in my application may result in my disqualification. I certify that my answers are true and complete to the best of my knowledge.",
      left,
      y,
      { width: 510 }
    );
    y += 32;
    doc.fontSize(9).font("Helvetica-Bold").text("SIGNATURE*:", left, y);
    doc.font("Helvetica").text("(Electronic: Initials + Last 4 SSN) " + (data.signatureInitials || "—") + "  " + (data.signatureLastFourSSN || "—"), left + 75, y);
    doc.font("Helvetica-Bold").text("DATE:", left + 400, y);
    doc.font("Helvetica").text(data.date || "—", left + 435, y);
    y += lineH + 4;
    doc.fontSize(8).font("Helvetica").text("*IF FILING THIS APPLICATION ELECTRONICALLY, PLEASE PROVIDE YOUR INITIALS AND THE LAST FOUR DIGITS OF YOUR SSN IN LIEU OF A SIGNATURE.", left, y, { width: 510 });
    y += 16;
    doc.fontSize(7).font("Helvetica").text("VSA FORM - APPLICATION-2021-V001EF/.JF                                                                                    REVISED 01/01/2024", left, y);

    y += 20;
    doc.y = y;
    doc.moveDown(1);
    doc.fontSize(9).font("Helvetica").text(
      "Applications can be mailed to the VSA or submitted at our next meeting. Veterans Sportsmens Association, 1335 Route 44 - Suite 1, Pleasant Valley NY 12569. (845) 599-1911.",
      left,
      doc.y,
      { width: 510 }
    );

    doc.end();
  });
}

export async function getMembershipPdf(req, res) {
  try {
    const data = req.body;
    const pdf = await buildMembershipPdf(data);
    const filename = getMembershipPdfFilename(data);
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
    res.setHeader("Content-Length", pdf.length);
    res.send(pdf);
  } catch (error) {
    console.error("Membership PDF error:", error);
    res.status(500).json({ message: "Failed to generate PDF" });
  }
}

export async function submitMembership(req, res) {
  try {
    const data = req.body;
    const pdf = await buildMembershipPdf(data);
    await sendMembershipSubmission(data, pdf);
    await sendMembershipCopyToApplicant(data, pdf);
    res.json({
      message: "Your membership application has been submitted to the VSA. A copy has been sent to your email.",
    });
  } catch (error) {
    console.error("Membership submit error:", error);
    res.status(500).json({ message: "Failed to submit application. You can still download the PDF and mail it." });
  }
}
