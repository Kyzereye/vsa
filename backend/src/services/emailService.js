import nodemailer from "nodemailer";
import dotenv from "dotenv";
import { getMembershipPdfFilename } from "../utils/membership.js";

dotenv.config();

// Create transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Verify transporter configuration
transporter.verify((error, success) => {
  if (error) {
    console.error("Email service configuration error:", error);
  } else {
    console.log("Email service is ready to send messages");
  }
});

export const sendVerificationEmail = async (email, name, verificationToken) => {
  const frontendUrl = process.env.FRONTEND_URL || "http://localhost:2222";
  const verificationLink = `${frontendUrl}/verify-email?token=${verificationToken}`;

  const mailOptions = {
    from: process.env.SMTP_FROM || process.env.SMTP_USER,
    to: email,
    subject: "Verify Your VSA Email Address",
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .header {
              background: #003366;
              color: white;
              padding: 20px;
              text-align: center;
            }
            .content {
              padding: 20px;
              background: #f9f9f9;
            }
            .button {
              display: inline-block;
              padding: 12px 24px;
              background: #cc0000;
              color: white;
              text-decoration: none;
              border-radius: 5px;
              margin: 20px 0;
            }
            .footer {
              text-align: center;
              padding: 20px;
              font-size: 12px;
              color: #666;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Veterans Sportsmens Association</h1>
            </div>
            <div class="content">
              <h2>Verify Your Email Address</h2>
              <p>Hello ${name},</p>
              <p>Thank you for registering with the Veterans Sportsmens Association. Please verify your email address by clicking the button below:</p>
              <p style="text-align: center;">
                <a href="${verificationLink}" class="button">Verify Email Address</a>
              </p>
              <p>Or copy and paste this link into your browser:</p>
              <p style="word-break: break-all; color: #0066cc;">${verificationLink}</p>
              <p>This link will expire in 24 hours.</p>
              <p>If you did not create an account with VSA, please ignore this email.</p>
            </div>
            <div class="footer">
              <p>Veterans Sportsmens Association</p>
              <p>Veterans Serving Veterans</p>
            </div>
          </div>
        </body>
      </html>
    `,
    text: `
      Verify Your Email Address

      Hello ${name},

      Thank you for registering with the Veterans Sportsmens Association. Please verify your email address by visiting this link:

      ${verificationLink}

      This link will expire in 24 hours.

      If you did not create an account with VSA, please ignore this email.

      Veterans Sportsmens Association
      Veterans Serving Veterans
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Verification email sent:", info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("Error sending verification email:", error);
    throw new Error("Failed to send verification email");
  }
};

export const sendEmailChangeVerificationEmail = async (email, name, verificationToken) => {
  const frontendUrl = process.env.FRONTEND_URL || "http://localhost:2222";
  const verificationLink = `${frontendUrl}/verify-email?token=${verificationToken}`;

  const mailOptions = {
    from: process.env.SMTP_FROM || process.env.SMTP_USER,
    to: email,
    subject: "Verify Your New VSA Email Address",
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .header {
              background: #003366;
              color: white;
              padding: 20px;
              text-align: center;
            }
            .content {
              padding: 20px;
              background: #f9f9f9;
            }
            .button {
              display: inline-block;
              padding: 12px 24px;
              background: #cc0000;
              color: white;
              text-decoration: none;
              border-radius: 5px;
              margin: 20px 0;
            }
            .footer {
              text-align: center;
              padding: 20px;
              font-size: 12px;
              color: #666;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Veterans Sportsmens Association</h1>
            </div>
            <div class="content">
              <h2>Verify Your New Email Address</h2>
              <p>Hello ${name},</p>
              <p>You have requested to change your email address to ${email}. Please verify this new email address by clicking the button below:</p>
              <p style="text-align: center;">
                <a href="${verificationLink}" class="button">Verify Email Address</a>
              </p>
              <p>Or copy and paste this link into your browser:</p>
              <p style="word-break: break-all; color: #0066cc;">${verificationLink}</p>
              <p>This link will expire in 24 hours.</p>
              <p>If you did not request this change, please contact us immediately.</p>
            </div>
            <div class="footer">
              <p>Veterans Sportsmens Association</p>
              <p>Veterans Serving Veterans</p>
            </div>
          </div>
        </body>
      </html>
    `,
    text: `
      Verify Your New Email Address

      Hello ${name},

      You have requested to change your email address to ${email}. Please verify this new email address by visiting this link:

      ${verificationLink}

      This link will expire in 24 hours.

      If you did not request this change, please contact us immediately.

      Veterans Sportsmens Association
      Veterans Serving Veterans
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email change verification email sent:", info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("Error sending email change verification email:", error);
    throw new Error("Failed to send verification email");
  }
};

export const sendPasswordResetEmail = async (email, name, resetToken) => {
  const frontendUrl = process.env.FRONTEND_URL || "http://localhost:2222";
  const resetLink = `${frontendUrl}/reset-password?token=${encodeURIComponent(resetToken)}`;

  const mailOptions = {
    from: process.env.SMTP_FROM || process.env.SMTP_USER,
    to: email,
    subject: "Reset Your VSA Password",
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #003366; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; background: #f9f9f9; }
            .button { display: inline-block; padding: 12px 24px; background: #cc0000; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .footer { text-align: center; padding: 20px; font-size: 12px; color: #666; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header"><h1>Veterans Sportsmens Association</h1></div>
            <div class="content">
              <h2>Reset Your Password</h2>
              <p>Hello ${name},</p>
              <p>We received a request to reset the password for your VSA account. Click the button below to choose a new password:</p>
              <p style="text-align: center;">
                <a href="${resetLink}" class="button">Reset Password</a>
              </p>
              <p>Or copy and paste this link into your browser:</p>
              <p style="word-break: break-all; color: #0066cc;">${resetLink}</p>
              <p>This link will expire in 1 hour.</p>
              <p>If you did not request a password reset, you can safely ignore this email.</p>
            </div>
            <div class="footer">
              <p>Veterans Sportsmens Association</p>
              <p>Veterans Serving Veterans</p>
            </div>
          </div>
        </body>
      </html>
    `,
    text: `
Reset Your VSA Password

Hello ${name},

We received a request to reset the password for your VSA account. Visit this link to choose a new password:

${resetLink}

This link will expire in 1 hour.

If you did not request a password reset, you can safely ignore this email.

Veterans Sportsmens Association
Veterans Serving Veterans
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Password reset email sent:", info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("Error sending password reset email:", error);
    throw new Error("Failed to send password reset email");
  }
};

/** Send event registration confirmation to the registrant. */
export const sendRegistrationConfirmationEmail = async (recipientEmail, recipientName, event) => {
  const { title, date, location, address } = event;
  const dateStr = date ? new Date(date).toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" }) : "TBD";
  const locationLine = [location, address].filter(Boolean).join(address ? " — " : "");

  const mailOptions = {
    from: process.env.SMTP_FROM || process.env.SMTP_USER,
    to: recipientEmail,
    subject: `You're registered: ${title}`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #003366; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; background: #f9f9f9; }
            .event-box { background: #fff; border-left: 4px solid #003366; padding: 12px 16px; margin: 16px 0; }
            .footer { text-align: center; padding: 20px; font-size: 12px; color: #666; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header"><h1>Veterans Sportsmens Association</h1></div>
            <div class="content">
              <h2>You're registered</h2>
              <p>Hello ${recipientName},</p>
              <p>You're signed up for the following event:</p>
              <div class="event-box">
                <strong>${title}</strong><br>
                ${dateStr}<br>
                ${locationLine ? locationLine + "<br>" : ""}
              </div>
              <p>We look forward to seeing you there.</p>
            </div>
            <div class="footer">
              <p>Veterans Sportsmens Association</p>
              <p>Veterans Serving Veterans</p>
            </div>
          </div>
        </body>
      </html>
    `,
    text: `
You're registered

Hello ${recipientName},

You're signed up for the following event:

${title}
${dateStr}
${locationLine ? locationLine + "\n" : ""}

We look forward to seeing you there.

Veterans Sportsmens Association
Veterans Serving Veterans
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Registration confirmation email sent:", info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("Error sending registration confirmation email:", error);
    throw error;
  }
};

/**
 * Send a membership application PDF to the VSA.
 * @param {Object} data - Form data (lastName, firstName, email, etc.)
 * @param {Buffer} pdfBuffer - Generated PDF
 */
export const sendMembershipSubmission = async (data, pdfBuffer) => {
  const toEmail = process.env.VSA_MEMBERSHIP_EMAIL || "veteranssportsmensassociation@gmail.com";
  const from = process.env.SMTP_FROM || process.env.SMTP_USER;
  const name = [data.lastName, data.firstName, data.mi].filter(Boolean).join(" ") || data.fullName || "Unknown";
  const filename = getMembershipPdfFilename(data);

  const mailOptions = {
    from,
    to: toEmail,
    subject: 'VSA Membership Application',
    text: `A new membership application has been submitted from ${name}. The completed application PDF is attached.`,
    attachments: [
      {
        filename,
        content: pdfBuffer,
      },
    ],
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Membership application submitted to VSA:", info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("Error sending membership application:", error);
    throw error;
  }
};

/**
 * Send a copy of the membership application PDF to the applicant.
 * @param {Object} data - Form data (must include email)
 * @param {Buffer} pdfBuffer - Generated PDF
 */
export const sendMembershipCopyToApplicant = async (data, pdfBuffer) => {
  const applicantEmail = (data.email || "").trim();
  if (!applicantEmail) {
    console.warn("No applicant email; skipping copy to applicant.");
    return { success: false, skipped: true };
  }
  const from = process.env.SMTP_FROM || process.env.SMTP_USER;
  const name = [data.lastName, data.firstName, data.mi].filter(Boolean).join(" ") || "Applicant";
  const filename = getMembershipPdfFilename(data);

  const mailOptions = {
    from,
    to: applicantEmail,
    subject: "Your VSA Membership Application – Copy",
    text: `
Hello ${data.firstName || name},

Thank you for submitting your membership application to the Veterans Sportsmen's Association.

A copy of your completed application (PDF) is attached for your records. The VSA has also received your application and will be in touch.

If you have any questions, please contact the VSA.

Veterans Sportsmens Association
1335 Route 44 – Suite 1
Pleasant Valley, NY 12569
(845) 599-1911
    `.trim(),
    attachments: [
      {
        filename,
        content: pdfBuffer,
      },
    ],
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Membership copy sent to applicant:", applicantEmail, info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("Error sending membership copy to applicant:", error);
    throw error;
  }
};
