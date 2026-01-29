import nodemailer from "nodemailer";
import dotenv from "dotenv";

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
  const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
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
  const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
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
