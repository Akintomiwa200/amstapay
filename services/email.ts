import { apiClient } from '@/lib/api';
import { API_BASE_URL } from '@/lib/constants';

type EmailTemplate =
  | 'welcome-verify'
  | 'login-confirm'
  | 'login-2fa'
  | 'forgot-password'
  | 'password-changed'
  | 'pin-changed';

type TemplateVars = Record<string, string | number>;

const SUBJECTS: Record<EmailTemplate, string> = {
  'welcome-verify': 'Welcome to AmstaPay - Verify Your Email',
  'login-confirm': 'New Login to Your AmstaPay Account',
  'login-2fa': 'Confirm Your AmstaPay Login',
  'forgot-password': 'Reset Your AmstaPay Password',
  'password-changed': 'Your AmstaPay Password Has Been Changed',
  'pin-changed': 'Your AmstaPay PIN Has Been Changed',
};

function replaceVars(template: string, vars: TemplateVars): string {
  let result = template;
  for (const [key, value] of Object.entries(vars)) {
    result = result.replace(new RegExp(`{{${key}}}`, 'g'), String(value));
  }
  return result;
}

function buildBaseHtml(bodyContent: string, subject: string): string {
  const year = new Date().getFullYear();
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
  <title>${subject}</title>
</head>
<body style="margin:0;padding:0;background-color:#f4f6f9;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f6f9;min-height:100vh">
    <tr>
      <td align="center" style="padding:40px 16px">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background-color:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 12px rgba(0,0,0,0.05)">
          <tr>
            <td style="background:linear-gradient(135deg,#6C5CE7,#A855F7);padding:40px 32px;text-align:center">
              <h1 style="margin:0;color:#ffffff;font-size:28px;font-weight:800;letter-spacing:-0.5px">AmstaPay</h1>
              <p style="margin:8px 0 0;color:rgba(255,255,255,0.85);font-size:14px">Secure &bull; Fast &bull; Reliable</p>
            </td>
          </tr>
          <tr>
            <td style="padding:32px">
              {{BODY}}
            </td>
          </tr>
          <tr>
            <td style="padding:0 32px">
              <hr style="border:none;border-top:1px solid #e5e7eb;margin:0" />
            </td>
          </tr>
          <tr>
            <td style="padding:24px 32px 32px;text-align:center">
              <p style="margin:0 0 8px;font-size:12px;color:#9ca3af">This is an automated message from AmstaPay. Please do not reply.</p>
              <p style="margin:0;font-size:12px;color:#9ca3af">&copy; ${year} AmstaPay. All rights reserved.</p>
              <p style="margin:12px 0 0;font-size:12px;color:#9ca3af">Need help? <a href="mailto:support@amstapay.com" style="color:#6C5CE7;text-decoration:none;font-weight:500">Contact Support</a></p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

const TEMPLATES: Record<EmailTemplate, (vars: TemplateVars) => string> = {
  'welcome-verify': (v) => `
<h2 style="margin:0 0 16px;font-size:22px;color:#1f2937;font-weight:700">Welcome to AmstaPay!</h2>
<p style="margin:0 0 16px;font-size:15px;color:#4b5563;line-height:1.6">Hi <strong>${v.name}</strong>,</p>
<p style="margin:0 0 16px;font-size:15px;color:#4b5563;line-height:1.6">Your account has been created successfully. To start using AmstaPay, please verify your email address by entering the 6-digit code below:</p>

<div style="background:#f3f0ff;border-radius:12px;padding:20px;text-align:center;margin:0 0 20px">
  <p style="margin:0 0 8px;font-size:13px;color:#6b7280;font-weight:500">Verification Code</p>
  <p style="margin:0;font-size:36px;font-weight:800;color:#6C5CE7;letter-spacing:8px;font-family:monospace">${v.code}</p>
  <p style="margin:12px 0 0;font-size:12px;color:#9ca3af">This code expires in 15 minutes</p>
</div>

<p style="margin:0 0 8px;font-size:14px;color:#6b7280;line-height:1.5">If you did not create an account with AmstaPay, please ignore this email.</p>
<p style="margin:0 0 24px;font-size:14px;color:#6b7280;line-height:1.5">Thank you for choosing AmstaPay!</p>

<table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 auto">
  <tr>
    <td align="center" style="background:linear-gradient(135deg,#6C5CE7,#A855F7);border-radius:8px;padding:0">
      <a href="${v.verifyLink}" style="display:inline-block;padding:12px 32px;color:#ffffff;font-size:15px;font-weight:600;text-decoration:none">Verify Email</a>
    </td>
  </tr>
</table>`,

  'login-confirm': (v) => `
<h2 style="margin:0 0 16px;font-size:22px;color:#1f2937;font-weight:700">New Login to Your Account</h2>
<p style="margin:0 0 16px;font-size:15px;color:#4b5563;line-height:1.6">Hi <strong>${v.name}</strong>,</p>
<p style="margin:0 0 20px;font-size:15px;color:#4b5563;line-height:1.6">A new login was detected on your AmstaPay account. If this was you, no action is needed.</p>

<div style="background:#f9fafb;border-radius:12px;padding:20px;margin:0 0 20px;border:1px solid #e5e7eb">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
    <tr>
      <td style="padding:4px 0;font-size:14px;color:#6b7280;width:100px">Date &amp; Time</td>
      <td style="padding:4px 0;font-size:14px;color:#1f2937;font-weight:600">${v.time}</td>
    </tr>
    <tr>
      <td style="padding:4px 0;font-size:14px;color:#6b7280">Device</td>
      <td style="padding:4px 0;font-size:14px;color:#1f2937;font-weight:600">${v.device}</td>
    </tr>
    <tr>
      <td style="padding:4px 0;font-size:14px;color:#6b7280">Location</td>
      <td style="padding:4px 0;font-size:14px;color:#1f2937;font-weight:600">${v.location}</td>
    </tr>
    <tr>
      <td style="padding:4px 0;font-size:14px;color:#6b7280">IP Address</td>
      <td style="padding:4px 0;font-size:14px;color:#1f2937;font-weight:600">${v.ipAddress}</td>
    </tr>
  </table>
</div>

<p style="margin:0 0 8px;font-size:14px;color:#6b7280;line-height:1.5">Not you? Secure your account:</p>
<p style="margin:0 0 24px;font-size:14px;color:#6b7280;line-height:1.5">
  <a href="{{resetPasswordLink}}" style="color:#6C5CE7;text-decoration:none;font-weight:500">Reset Password</a>
  &nbsp;&bull;&nbsp;
  <a href="{{contactSupportLink}}" style="color:#6C5CE7;text-decoration:none;font-weight:500">Contact Support</a>
</p>`,

  'login-2fa': (v) => `
<h2 style="margin:0 0 16px;font-size:22px;color:#1f2937;font-weight:700">Confirm Your Login</h2>
<p style="margin:0 0 16px;font-size:15px;color:#4b5563;line-height:1.6">Hi <strong>${v.name}</strong>,</p>
<p style="margin:0 0 16px;font-size:15px;color:#4b5563;line-height:1.6">We detected a login attempt on your AmstaPay account. Use the code below to confirm it's you:</p>

<div style="background:#fef2f2;border-radius:12px;padding:20px;text-align:center;margin:0 0 20px;border:1px solid #fecaca">
  <p style="margin:0 0 8px;font-size:13px;color:#dc2626;font-weight:500">One-Time Login Code</p>
  <p style="margin:0;font-size:36px;font-weight:800;color:#dc2626;letter-spacing:8px;font-family:monospace">${v.code}</p>
  <p style="margin:12px 0 0;font-size:12px;color:#9ca3af">This code expires in 10 minutes</p>
</div>

<div style="background:#f9fafb;border-radius:12px;padding:16px;margin:0 0 20px;border:1px solid #e5e7eb">
  <p style="margin:0 0 4px;font-size:13px;color:#6b7280">Device: <strong style="color:#1f2937">${v.device}</strong></p>
  <p style="margin:0;font-size:13px;color:#6b7280">Location: <strong style="color:#1f2937">${v.location}</strong></p>
</div>

<p style="margin:0 0 24px;font-size:14px;color:#6b7280;line-height:1.5">If you did not attempt to log in, please secure your account immediately.</p>`,

  'forgot-password': (v) => `
<h2 style="margin:0 0 16px;font-size:22px;color:#1f2937;font-weight:700">Reset Your Password</h2>
<p style="margin:0 0 16px;font-size:15px;color:#4b5563;line-height:1.6">Hi <strong>${v.name}</strong>,</p>
<p style="margin:0 0 16px;font-size:15px;color:#4b5563;line-height:1.6">We received a request to reset the password for your AmstaPay account. Enter the code below to set a new password:</p>

<div style="background:#f3f0ff;border-radius:12px;padding:20px;text-align:center;margin:0 0 20px">
  <p style="margin:0 0 8px;font-size:13px;color:#6b7280;font-weight:500">Password Reset Code</p>
  <p style="margin:0;font-size:36px;font-weight:800;color:#6C5CE7;letter-spacing:8px;font-family:monospace">${v.code}</p>
  <p style="margin:12px 0 0;font-size:12px;color:#9ca3af">This code expires in 15 minutes</p>
</div>

<p style="margin:0 0 24px;font-size:14px;color:#6b7280;line-height:1.5">If you did not request a password reset, please ignore this email.</p>`,

  'password-changed': (v) => `
<h2 style="margin:0 0 16px;font-size:22px;color:#1f2937;font-weight:700">Password Changed Successfully</h2>
<p style="margin:0 0 16px;font-size:15px;color:#4b5563;line-height:1.6">Hi <strong>${v.name}</strong>,</p>
<p style="margin:0 0 16px;font-size:15px;color:#4b5563;line-height:1.6">Your AmstaPay account password was changed successfully on <strong>${v.time}</strong>.</p>

<div style="background:#ecfdf5;border-radius:12px;padding:20px;margin:0 0 20px;border:1px solid #a7f3d0">
  <p style="margin:0;font-size:15px;color:#059669;font-weight:500;text-align:center">&#10003; Password updated successfully</p>
</div>

<p style="margin:0 0 24px;font-size:14px;color:#6b7280;line-height:1.5">If you did not make this change, please secure your account immediately.</p>`,

  'pin-changed': (v) => `
<h2 style="margin:0 0 16px;font-size:22px;color:#1f2937;font-weight:700">Transaction PIN Changed</h2>
<p style="margin:0 0 16px;font-size:15px;color:#4b5563;line-height:1.6">Hi <strong>${v.name}</strong>,</p>
<p style="margin:0 0 16px;font-size:15px;color:#4b5563;line-height:1.6">Your AmstaPay transaction PIN was changed successfully on <strong>${v.time}</strong>.</p>

<div style="background:#ecfdf5;border-radius:12px;padding:20px;margin:0 0 20px;border:1px solid #a7f3d0">
  <p style="margin:0;font-size:15px;color:#059669;font-weight:500;text-align:center">&#10003; Transaction PIN updated successfully</p>
</div>

<p style="margin:0 0 24px;font-size:14px;color:#6b7280;line-height:1.5">If you did not make this change, please contact support immediately.</p>`,
};

const SEND_ENDPOINT = `${API_BASE_URL}/notifications/send-email`;

export const emailService = {
  buildHtml(template: EmailTemplate, vars: TemplateVars): string {
    const body = TEMPLATES[template](vars);
    const subject = replaceVars(SUBJECTS[template], vars);
    return buildBaseHtml(body, subject).replace('{{BODY}}', body);
  },

  async send(
    to: string,
    template: EmailTemplate,
    vars: TemplateVars,
  ): Promise<void> {
    const html = this.buildHtml(template, vars);
    const subject = replaceVars(SUBJECTS[template], vars);
    try {
      const response = await fetch(SEND_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ to, subject, html, template, vars }),
      });
      if (!response.ok) {
        console.warn(`Email send failed (${template}): ${response.status}`);
      }
    } catch (error) {
      console.warn(`Email send error (${template}):`, error);
    }
  },
};
