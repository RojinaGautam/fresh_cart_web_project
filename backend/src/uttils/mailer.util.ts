import nodemailer from "nodemailer";
import { FRONTEND_URL, GOOGLE_SMTP_EMAIL, GOOGLE_SMTP_PASSWORD } from "../configs/constant";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: GOOGLE_SMTP_EMAIL,
    pass: GOOGLE_SMTP_PASSWORD,
  },
});

const sendMail = async (to: string, subject: string, html: string) => {
  const info = await transporter.sendMail({
    from: `"FreshCart" <${GOOGLE_SMTP_EMAIL}>`,
    to,
    subject,
    html,
  });
  console.log(`Mail sent to ${to}: ${info.messageId}`);
};

const wrapEmail = (title: string, bodyHtml: string, ctaHref?: string, ctaLabel?: string) => `
  <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 24px; color: #15251b;">
    <h2 style="color: #173822;">${title}</h2>
    ${bodyHtml}
    ${
      ctaHref && ctaLabel
        ? `<p style="margin: 24px 0;">
            <a href="${ctaHref}" style="background-color: #173822; color: #ffffff; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold;">
              ${ctaLabel}
            </a>
          </p>`
        : ""
    }
  </div>
`;

const wrapOtpEmail = (title: string, bodyHtml: string, otp: string, expiryText: string) => `
  <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 24px; color: #15251b;">
    <h2 style="color: #173822;">${title}</h2>
    ${bodyHtml}
    <p style="margin: 24px 0; text-align: center;">
      <span style="display: inline-block; background-color: #173822; color: #ffffff; padding: 16px 32px; border-radius: 12px; font-size: 32px; font-weight: bold; letter-spacing: 8px;">
        ${otp}
      </span>
    </p>
    <p style="font-size: 12px; color: #6b7280;">This code expires in ${expiryText}. Do not share it with anyone.</p>
  </div>
`;

export const sendVerificationEmail = async (to: string, fullName: string, otp: string) => {
  await sendMail(
    to,
    "Your FreshCart verification code",
    wrapOtpEmail(
      `Welcome to FreshCart, ${fullName}!`,
      "<p>Enter this code to verify your email address and activate your account.</p>",
      otp,
      "10 minutes",
    ),
  );
};

export const sendPasswordResetEmail = async (to: string, fullName: string, otp: string) => {
  await sendMail(
    to,
    "Your FreshCart password reset code",
    wrapOtpEmail(
      `Hi ${fullName},`,
      "<p>Enter this code to reset your password. If you didn't request this, you can safely ignore this email.</p>",
      otp,
      "10 minutes",
    ),
  );
};

export const sendWelcomeEmail = async (to: string, fullName: string) => {
  await sendMail(
    to,
    "Welcome to FreshCart!",
    wrapEmail(
      `You're all set, ${fullName}!`,
      "<p>Your email is verified and your FreshCart account is ready to go. Browse fresh produce, daily deals, and get groceries delivered to your door.</p>",
      `${FRONTEND_URL}/`,
      "Start Shopping",
    ),
  );
};

export const sendOrderConfirmationEmail = async (
  to: string,
  fullName: string,
  orderNumber: string,
  total: number,
) => {
  await sendMail(
    to,
    `Order Confirmed - ${orderNumber}`,
    wrapEmail(
      `Thanks for your order, ${fullName}!`,
      `<p>Your order <strong>${orderNumber}</strong> has been placed successfully. Total charged: <strong>$${total.toFixed(2)}</strong>.</p><p>We'll email you again once it's out for delivery.</p>`,
      `${FRONTEND_URL}/dashboard/profile`,
      "View Order",
    ),
  );
};

const ORDER_STATUS_COPY: Record<string, { subject: string; heading: string; body: string }> = {
  out_for_delivery: {
    subject: "Your order is out for delivery",
    heading: "Your order is on its way!",
    body: "is out for delivery and should arrive soon. Have your delivery address ready.",
  },
  delivered: {
    subject: "Your order has been delivered",
    heading: "Delivered!",
    body: "has been delivered. We hope you enjoy your fresh groceries!",
  },
};

export const sendOrderStatusEmail = async (
  to: string,
  fullName: string,
  orderNumber: string,
  status: "out_for_delivery" | "delivered",
) => {
  const copy = ORDER_STATUS_COPY[status];

  await sendMail(
    to,
    `${copy.subject} - ${orderNumber}`,
    wrapEmail(
      `Hi ${fullName}, ${copy.heading}`,
      `<p>Your order <strong>${orderNumber}</strong> ${copy.body}</p>`,
      `${FRONTEND_URL}/dashboard/profile`,
      "View Order",
    ),
  );
};
