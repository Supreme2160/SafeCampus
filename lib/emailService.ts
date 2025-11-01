import nodemailer from 'nodemailer';

interface EmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
}

interface AlertData {
  title: string;
  description: string;
  severity: string;
  location: string;
  timestamp: string;
  category: string;
  source: string;
}

// Create reusable transporter using OpenSMTPD or any SMTP server
function createTransporter() {
  const smtpConfig = {
    host: process.env.SMTP_HOST || 'localhost',
    port: parseInt(process.env.SMTP_PORT || '25'),
    secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
    auth: process.env.SMTP_USER ? {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    } : undefined,
    // OpenSMTPD specific settings
    tls: {
      rejectUnauthorized: false, // For local OpenSMTPD
    },
  };

  return nodemailer.createTransport(smtpConfig);
}

// Generate HTML email template for alerts
function generateAlertEmailHTML(alert: AlertData): string {
  const severityColors: Record<string, string> = {
    critical: '#dc2626',
    high: '#ea580c',
    medium: '#ca8a04',
    low: '#2563eb',
  };

  const color = severityColors[alert.severity] || '#6b7280';

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Safety Alert</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f3f4f6;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f3f4f6; padding: 20px;">
        <tr>
          <td align="center">
            <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
              <!-- Header -->
              <tr>
                <td style="background-color: ${color}; padding: 20px; text-align: center;">
                  <h1 style="margin: 0; color: #ffffff; font-size: 24px;">⚠️ Safety Alert</h1>
                </td>
              </tr>
              
              <!-- Severity Badge -->
              <tr>
                <td style="padding: 20px; text-align: center;">
                  <span style="display: inline-block; background-color: ${color}; color: #ffffff; padding: 8px 16px; border-radius: 20px; font-weight: bold; text-transform: uppercase; font-size: 12px;">
                    ${alert.severity} Priority
                  </span>
                </td>
              </tr>
              
              <!-- Alert Content -->
              <tr>
                <td style="padding: 0 30px 20px 30px;">
                  <h2 style="color: #1f2937; margin: 0 0 15px 0; font-size: 20px;">
                    ${alert.title}
                  </h2>
                  <p style="color: #4b5563; line-height: 1.6; margin: 0 0 20px 0; font-size: 16px;">
                    ${alert.description}
                  </p>
                  
                  <!-- Alert Details -->
                  <table width="100%" cellpadding="8" cellspacing="0" style="border-top: 2px solid #e5e7eb; margin-top: 20px;">
                    <tr>
                      <td style="color: #6b7280; font-size: 14px; padding: 10px 0;">
                        <strong style="color: #374151;">📍 Location:</strong> ${alert.location}
                      </td>
                    </tr>
                    <tr>
                      <td style="color: #6b7280; font-size: 14px; padding: 10px 0;">
                        <strong style="color: #374151;">🏷️ Category:</strong> ${alert.category}
                      </td>
                    </tr>
                    <tr>
                      <td style="color: #6b7280; font-size: 14px; padding: 10px 0;">
                        <strong style="color: #374151;">📅 Time:</strong> ${new Date(alert.timestamp).toLocaleString()}
                      </td>
                    </tr>
                    <tr>
                      <td style="color: #6b7280; font-size: 14px; padding: 10px 0;">
                        <strong style="color: #374151;">ℹ️ Source:</strong> ${alert.source}
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
              
              <!-- Action Button -->
              <tr>
                <td style="padding: 0 30px 30px 30px; text-align: center;">
                  <a href="${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/alerts" 
                     style="display: inline-block; background-color: #2563eb; color: #ffffff; text-decoration: none; padding: 12px 30px; border-radius: 6px; font-weight: bold; font-size: 14px;">
                    View All Alerts
                  </a>
                </td>
              </tr>
              
              <!-- Footer -->
              <tr>
                <td style="background-color: #f9fafb; padding: 20px; text-align: center; border-top: 1px solid #e5e7eb;">
                  <p style="margin: 0 0 10px 0; color: #6b7280; font-size: 12px;">
                    You received this email because you subscribed to SafeCampus alerts.
                  </p>
                  <p style="margin: 0; color: #9ca3af; font-size: 11px;">
                    © ${new Date().getFullYear()} SafeCampus. All rights reserved.
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
}

// Generate plain text version of the alert email
function generateAlertEmailText(alert: AlertData): string {
  return `
SAFETY ALERT - ${alert.severity.toUpperCase()} PRIORITY

${alert.title}

${alert.description}

Details:
- Location: ${alert.location}
- Category: ${alert.category}
- Time: ${new Date(alert.timestamp).toLocaleString()}
- Source: ${alert.source}

View all alerts at: ${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/alerts

---
You received this email because you subscribed to SafeCampus alerts.
© ${new Date().getFullYear()} SafeCampus. All rights reserved.
  `.trim();
}

// Send a single email
export async function sendEmail(options: EmailOptions): Promise<boolean> {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: process.env.SMTP_FROM || 'alerts@safecampus.com',
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text || '',
    };

    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully to:', options.to);
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
}

// Send alert email to a list of subscribers
export async function sendAlertEmail(alert: AlertData, recipients: string[]): Promise<void> {
  const html = generateAlertEmailHTML(alert);
  const text = generateAlertEmailText(alert);
  const subject = `[${alert.severity.toUpperCase()}] Safety Alert: ${alert.title}`;

  // Send emails in batches to avoid overwhelming the SMTP server
  const batchSize = 50;
  for (let i = 0; i < recipients.length; i += batchSize) {
    const batch = recipients.slice(i, i + batchSize);
    
    for (const recipient of batch) {
      await sendEmail({
        to: recipient,
        subject,
        html,
        text,
      });
      
      // Small delay to prevent rate limiting
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }
}

// Send welcome email to new subscriber
export async function sendWelcomeEmail(email: string): Promise<boolean> {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f3f4f6;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f3f4f6; padding: 20px;">
        <tr>
          <td align="center">
            <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden;">
              <tr>
                <td style="background-color: #2563eb; padding: 30px; text-align: center;">
                  <h1 style="margin: 0; color: #ffffff; font-size: 28px;">Welcome to SafeCampus Alerts</h1>
                </td>
              </tr>
              <tr>
                <td style="padding: 40px 30px;">
                  <p style="font-size: 16px; color: #374151; margin: 0 0 20px 0;">
                    Thank you for subscribing to SafeCampus safety alerts!
                  </p>
                  <p style="font-size: 16px; color: #4b5563; line-height: 1.6; margin: 0 0 20px 0;">
                    You will now receive real-time notifications about:
                  </p>
                  <ul style="color: #4b5563; font-size: 15px; line-height: 1.8;">
                    <li>Emergency alerts and warnings</li>
                    <li>Weather-related safety information</li>
                    <li>Campus security updates</li>
                    <li>Disaster preparedness notifications</li>
                  </ul>
                  <p style="font-size: 16px; color: #4b5563; line-height: 1.6; margin: 20px 0;">
                    Stay safe and stay informed!
                  </p>
                </td>
              </tr>
              <tr>
                <td style="background-color: #f9fafb; padding: 20px; text-align: center;">
                  <p style="margin: 0; color: #6b7280; font-size: 12px;">
                    © ${new Date().getFullYear()} SafeCampus. All rights reserved.
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;

  const text = `
Welcome to SafeCampus Alerts!

Thank you for subscribing to SafeCampus safety alerts.

You will now receive real-time notifications about:
- Emergency alerts and warnings
- Weather-related safety information
- Campus security updates
- Disaster preparedness notifications

Stay safe and stay informed!

© ${new Date().getFullYear()} SafeCampus. All rights reserved.
  `.trim();

  return await sendEmail({
    to: email,
    subject: 'Welcome to SafeCampus Alerts',
    html,
    text,
  });
}

export default {
  sendEmail,
  sendAlertEmail,
  sendWelcomeEmail,
};
