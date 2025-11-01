# Windows SMTP Setup Guide for SafeCampus

This guide will help you set up SMTP email functionality on Windows for testing the SafeCampus alert system.

## Option 1: smtp4dev (Recommended for Development)

smtp4dev is a dummy SMTP server with a web interface - perfect for testing!

### Installation via Docker:
```powershell
docker run -d -p 25:25 -p 3001:80 --name smtp4dev rnwood/smtp4dev
```

### Installation via Download:
1. Download from: https://github.com/rnwood/smtp4dev/releases
2. Extract and run `Rnwood.Smtp4dev.exe`
3. Access web interface at: http://localhost:3001

### Configuration in `.env`:
```env
SMTP_HOST=localhost
SMTP_PORT=25
SMTP_SECURE=false
SMTP_FROM=alerts@safecampus.com
```

### Testing:
1. Start smtp4dev
2. Start your Next.js app: `npm run dev`
3. Subscribe to alerts at http://localhost:3000/alerts
4. Check emails at http://localhost:3001

---

## Option 2: Papercut SMTP

Another great option for Windows developers.

### Installation:
1. Download from: https://github.com/ChangemakerStudios/Papercut-SMTP/releases
2. Run the installer
3. Launch Papercut SMTP

### Configuration:
```env
SMTP_HOST=localhost
SMTP_PORT=25
SMTP_SECURE=false
SMTP_FROM=alerts@safecampus.com
```

---

## Option 3: Gmail (For Real Email Testing)

### Prerequisites:
1. Gmail account
2. 2-Factor Authentication enabled
3. App Password generated

### Get Gmail App Password:
1. Go to: https://myaccount.google.com/security
2. Enable 2-Step Verification
3. Search for "App passwords"
4. Generate new app password for "Mail"
5. Copy the 16-character password

### Configuration in `.env`:
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=true
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-16-char-app-password
SMTP_FROM=your-email@gmail.com
```

---

## Option 4: SendGrid (Cloud Service)

### Setup:
1. Sign up at: https://sendgrid.com/
2. Verify your sender email
3. Create API key

### Configuration in `.env`:
```env
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=apikey
SMTP_PASS=your-sendgrid-api-key
SMTP_FROM=your-verified-email@example.com
```

---

## Option 5: Mailtrap (Development/Staging)

Perfect for testing without sending real emails.

### Setup:
1. Sign up at: https://mailtrap.io/
2. Get SMTP credentials from inbox settings

### Configuration in `.env`:
```env
SMTP_HOST=smtp.mailtrap.io
SMTP_PORT=2525
SMTP_SECURE=false
SMTP_USER=your-mailtrap-username
SMTP_PASS=your-mailtrap-password
SMTP_FROM=alerts@safecampus.com
```

---

## Testing Your SMTP Setup

### PowerShell Test Script:

Save as `test-smtp.ps1`:

```powershell
# Test SMTP Connection
$smtpServer = "localhost"
$smtpPort = 25
$from = "test@safecampus.com"
$to = "you@example.com"
$subject = "SafeCampus SMTP Test"
$body = "This is a test email from SafeCampus Alert System"

try {
    $smtp = New-Object Net.Mail.SmtpClient($smtpServer, $smtpPort)
    $smtp.Send($from, $to, $subject, $body)
    Write-Host "✅ Email sent successfully!" -ForegroundColor Green
} catch {
    Write-Host "❌ Failed to send email: $($_.Exception.Message)" -ForegroundColor Red
}
```

Run it:
```powershell
powershell -ExecutionPolicy Bypass -File test-smtp.ps1
```

### Test via Node.js Script:

Create `test-email.js`:

```javascript
require('dotenv').config();
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'localhost',
  port: parseInt(process.env.SMTP_PORT || '25'),
  secure: process.env.SMTP_SECURE === 'true',
  auth: process.env.SMTP_USER ? {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  } : undefined,
});

async function testEmail() {
  try {
    const info = await transporter.sendMail({
      from: process.env.SMTP_FROM || 'alerts@safecampus.com',
      to: 'your-email@example.com',
      subject: 'SafeCampus SMTP Test',
      text: 'This is a test email from SafeCampus Alert System',
      html: '<b>This is a test email from SafeCampus Alert System</b>',
    });
    
    console.log('✅ Email sent successfully!');
    console.log('Message ID:', info.messageId);
  } catch (error) {
    console.error('❌ Failed to send email:', error.message);
  }
}

testEmail();
```

Run it:
```bash
node test-email.js
```

---

## Troubleshooting

### Port 25 Already in Use

```powershell
# Check what's using port 25
netstat -ano | findstr :25

# Kill the process (replace PID with actual process ID)
taskkill /F /PID <PID>
```

### Firewall Issues

```powershell
# Add firewall rule for port 25 (Run as Administrator)
New-NetFirewallRule -DisplayName "SMTP" -Direction Inbound -Protocol TCP -LocalPort 25 -Action Allow
```

### Permission Denied

Run PowerShell or Command Prompt as Administrator.

### Gmail "Less Secure App" Error

Gmail no longer supports "less secure apps". You MUST use an App Password with 2FA enabled.

---

## Quick Start Checklist

- [ ] Choose an SMTP option (smtp4dev recommended for dev)
- [ ] Install/configure SMTP server
- [ ] Update `.env` with SMTP settings
- [ ] Test SMTP connection with test script
- [ ] Start PostgreSQL database
- [ ] Run `npx prisma migrate dev --name add_alert_system`
- [ ] Run `npx prisma generate`
- [ ] Start Next.js: `npm run dev`
- [ ] Subscribe to alerts at http://localhost:3000/alerts
- [ ] Check email (smtp4dev at http://localhost:3001 or your inbox)

---

## Recommended Setup for Development

1. **SMTP**: smtp4dev (via Docker or standalone)
2. **Advantages**:
   - No registration required
   - Web interface to view all emails
   - No email sending limits
   - Works offline
   - Easy to debug

---

## Production Recommendations

For production, use a reliable cloud service:
- **SendGrid**: Free tier includes 100 emails/day
- **AWS SES**: Pay per email, very affordable
- **Mailgun**: Free tier includes 5,000 emails/month
- **Postmark**: Excellent deliverability

---

## Need Help?

- smtp4dev Documentation: https://github.com/rnwood/smtp4dev
- Nodemailer Documentation: https://nodemailer.com/
- SafeCampus Alert Setup: See `ALERT_SETUP.md`
