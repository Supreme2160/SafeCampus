# SafeCampus Alert System - Quick Setup Guide

## Prerequisites Installed ✓
- nodemailer
- @types/nodemailer
- Prisma client generated

## Next Steps

### 1. Start PostgreSQL Database

Make sure your PostgreSQL database is running:

```bash
# If using Docker:
docker run --name safecampus-postgres -e POSTGRES_PASSWORD=mysecretpassword -e POSTGRES_DB=safe-campus -p 5432:5432 -d postgres

# Or start your local PostgreSQL service
```

### 2. Run Database Migration

Once the database is running:

```bash
npx prisma migrate dev --name add_alert_system
```

### 3. Set Up SMTP Server

#### For Development (Windows):

**Option A: Use smtp4dev (Recommended for Windows)**
```bash
# Download and install smtp4dev from:
# https://github.com/rnwood/smtp4dev/releases

# Or use via Docker:
docker run -p 25:25 -p 3001:80 rnwood/smtp4dev
```

Then update `.env`:
```env
SMTP_HOST=localhost
SMTP_PORT=25
SMTP_SECURE=false
```

**Option B: Use a Cloud SMTP Service**

For Gmail (requires app password):
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=true
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=your-email@gmail.com
```

For SendGrid:
```env
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=apikey
SMTP_PASS=your-sendgrid-api-key
SMTP_FROM=your-verified-sender@example.com
```

### 4. Optional: Configure Weather Alerts

Get a free API key from OpenWeatherMap:
1. Sign up at https://openweathermap.org/api
2. Copy your API key
3. Add to `.env`:
```env
OPENWEATHER_API_KEY=your-api-key-here
```

### 5. Start the Development Server

```bash
npm run dev
```

### 6. Test the Alert System

Open your browser and navigate to:
- View alerts: http://localhost:3000/alerts
- Subscribe to notifications with your email
- Check your email inbox (or smtp4dev web interface at http://localhost:3001)

### 7. Test the Cron Job (Manual)

```bash
# Send a POST request to the cron endpoint
curl -X POST http://localhost:3000/api/alerts/check ^
  -H "Content-Type: application/json" ^
  -H "Authorization: Bearer safecampus-cron-secret-key-2025"
```

Or use PowerShell:
```powershell
$headers = @{
    "Content-Type" = "application/json"
    "Authorization" = "Bearer safecampus-cron-secret-key-2025"
}
Invoke-RestMethod -Uri "http://localhost:3000/api/alerts/check" -Method Post -Headers $headers
```

## File Structure Created

```
app/
├── alerts/
│   ├── page.tsx              ✓ Alert listing and subscription page
│   └── README.md             ✓ Detailed documentation
└── api/
    └── alerts/
        ├── route.ts          ✓ Fetch alerts from API sources
        ├── subscribe/
        │   └── route.ts      ✓ Handle email subscriptions
        └── check/
            └── route.ts      ✓ Background cron job endpoint

lib/
└── emailService.ts           ✓ Email service using nodemailer

prisma/
└── schema.prisma             ✓ Updated with alert models

.env                          ✓ Updated with SMTP configuration
.env.alerts.example           ✓ Example environment variables
vercel.json                   ✓ Vercel cron job configuration
```

## Features Implemented

✅ Real-time alert monitoring
✅ Email notification system with OpenSMTPD/SMTP support
✅ Subscription management (subscribe/unsubscribe)
✅ Beautiful HTML email templates
✅ Severity-based alert filtering
✅ Background cron job for automatic checks
✅ Responsive UI with dark mode support
✅ Integration with NDMA (mock data) and OpenWeatherMap
✅ Database models for subscribers and alerts
✅ Security with CRON_SECRET

## Testing Checklist

- [ ] Database is running and migrated
- [ ] SMTP server is configured and running
- [ ] Environment variables are set correctly
- [ ] Development server is running
- [ ] Can view alerts at /alerts page
- [ ] Can subscribe to email alerts
- [ ] Receive welcome email after subscription
- [ ] Cron job endpoint is accessible
- [ ] Emails are sent for high/critical alerts

## Troubleshooting

### Database connection error
```
Error: P1001: Can't reach database server
```
**Solution**: Start your PostgreSQL database

### Email not sending
**Solution**: 
1. Check SMTP server is running
2. Verify SMTP credentials in `.env`
3. Check spam folder
4. For development, use smtp4dev to see all emails

### Alerts not showing
**Solution**: 
1. Check browser console for errors
2. Verify API is responding: `curl http://localhost:3000/api/alerts`
3. Add OpenWeatherMap API key for real weather alerts

## Production Deployment

1. **Database**: Set up production PostgreSQL database
2. **SMTP**: Use production SMTP service (SendGrid, AWS SES, etc.)
3. **Cron**: Configure Vercel Cron or external cron service
4. **Environment Variables**: Set all env vars in production environment
5. **Domain**: Update NEXTAUTH_URL to your production domain

## Support

For detailed documentation, see `app/alerts/README.md`
