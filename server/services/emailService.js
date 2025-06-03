const nodemailer = require('nodemailer');
require('dotenv').config();

// SMTP configuration (using Gmail as example)
const transporter = nodemailer.createTransport({
  service: 'gmail', // or your SMTP host (e.g., 'Outlook', 'Yahoo')
  auth: {
    user: process.env.EMAIL_USER, // Your email (e.g., 'you@gmail.com')
    pass: process.env.EMAIL_PASSWORD, // App password (not regular password)
  },
});

/**
 * Send password reset email
 * @param {string} to - Recipient email
 * @param {string} resetLink - Password reset link
 * @returns {Promise<boolean>} - True if email sent successfully
 */
async function sendResetPasswordEmail({ to, resetLink }) {
  const mailOptions = {
    from: `social register <${process.env.EMAIL_USER}>`,
    to,
    subject: 'Password Reset Request',
    html: `
     <p>Hello,</p> <p>We received a request to reset the password for your account. To proceed, please click the button below:</p> <p style="text-align: center; margin: 25px 0;"> <a href="${resetLink}" style="background-color: #2563eb; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: bold;">Reset Password</a> </p> <p>For security reasons, this link will expire in <strong>15 minutes</strong>. If you didn't request this change, please ignore this email or contact our support team immediately.</p> <p>Need help? Reply to this email or contact us at <a href="mailto:arfanabdourahman@gmail.com">socialregisterdj.com</a>.</p> <p>Best regards,<br>The social register Team</p>
    `,
    text: `Reset your password here: ${resetLink}`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Reset email sent to ${to}`);
    return true;
  } catch (error) {
    console.error('Failed to send email:', error);
    return false;
  }
}

module.exports = { sendResetPasswordEmail };