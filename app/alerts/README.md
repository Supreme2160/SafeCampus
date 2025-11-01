# SafeCampus Alert System

A comprehensive alert system for SafeCampus that fetches disaster and safety alerts from various sources and sends email notifications to subscribed users using OpenSMTPD.

## Features

- 🚨 **Real-time Alert Monitoring**: Fetches alerts from multiple sources including NDMA and weather APIs
- 📧 **Email Notifications**: Sends beautifully formatted HTML emails using OpenSMTPD
- 🎯 **Severity-based Filtering**: Prioritizes critical and high-severity alerts
- 👥 **Subscription Management**: Users can subscribe/unsubscribe to alert notifications
- 🔄 **Automated Checks**: Background cron job to periodically check for new alerts
- 📱 **Responsive UI**: Modern, mobile-friendly interface to view alerts

## Directory Structure

```
app/
├── alerts/
│   └── page.tsx              # Alert listing and subscription page
└── api/
    └── alerts/
        ├── route.ts          # Fetch alerts from API sources
        ├── subscribe/
        │   └── route.ts      # Handle email subscriptions
        └── check/
            └── route.ts      # Background cron job endpoint

lib/
└── emailService.ts           # Email service using nodemailer + OpenSMTPD

prisma/
└── schema.prisma             # Database models for subscribers and alerts
```

## Setup Instructions

### 1. Install Dependencies

```bash
npm install nodemailer
npm install --save-dev @types/nodemailer
```

### 2. Configure Environment Variables

Copy the example environment file and update with your settings:

```bash
cp .env.alerts.example .env.local
```

Update the following variables in `.env.local`:

```env
# SMTP Configuration (OpenSMTPD)
SMTP_HOST=localhost
SMTP_PORT=25
SMTP_SECURE=false
SMTP_FROM=alerts@safecampus.com

# Optional: For authenticated SMTP
SMTP_USER=your-username
SMTP_PASS=your-password

# Optional: OpenWeatherMap API
OPENWEATHER_API_KEY=your-api-key-here

# Cron Job Security
CRON_SECRET=generate-a-secure-random-string

# Application URL
NEXTAUTH_URL=http://localhost:3000
```

### 3. Set Up OpenSMTPD

#### On Linux (Ubuntu/Debian):

```bash
# Install OpenSMTPD
sudo apt-get update
sudo apt-get install opensmtpd

# Configure OpenSMTPD (edit /etc/smtpd.conf)
sudo nano /etc/smtpd.conf
```

Basic configuration example:

```
listen on localhost
table aliases file:/etc/aliases
accept for local alias <aliases> deliver to mbox
accept for any relay
```

Start the service:

```bash
sudo systemctl start opensmtpd
sudo systemctl enable opensmtpd
```

#### On macOS:

macOS comes with postfix by default. You can use it instead:

```bash
sudo postfix start
```

#### On Windows:

For development, you can use a test SMTP server like:
- [Papercut SMTP](https://github.com/ChangemakerStudios/Papercut-SMTP)
- [smtp4dev](https://github.com/rnwood/smtp4dev)

Or configure with a cloud SMTP service like SendGrid, Mailgun, or AWS SES.

### 4. Update Database Schema

Run the Prisma migration to create the alert tables:

```bash
npx prisma migrate dev --name add_alert_system
npx prisma generate
```

### 5. Testing Email Service

You can test the email service by creating a simple test endpoint or using the subscription feature:

1. Start your Next.js development server:
   ```bash
   npm run dev
   ```

2. Navigate to `http://localhost:3000/alerts`

3. Subscribe with your email address

4. The system will send a welcome email

### 6. Set Up Cron Job

The alert checking system needs to run periodically. You have several options:

#### Option A: Vercel Cron (for production on Vercel)

Create a `vercel.json` file:

```json
{
  "crons": [
    {
      "path": "/api/alerts/check",
      "schedule": "*/5 * * * *"
    }
  ]
}
```

#### Option B: External Cron Service

Use a service like:
- [Cron-job.org](https://cron-job.org)
- [EasyCron](https://www.easycron.com)
- GitHub Actions

Configure to send POST request to:
```
https://your-domain.com/api/alerts/check
Headers: Authorization: Bearer YOUR_CRON_SECRET
```

#### Option C: Local Cron (Linux/macOS)

```bash
crontab -e
```

Add this line:
```
*/5 * * * * curl -X POST -H "Authorization: Bearer YOUR_CRON_SECRET" http://localhost:3000/api/alerts/check
```

## API Endpoints

### GET /api/alerts
Fetches current alerts from configured sources.

**Response:**
```json
{
  "success": true,
  "alerts": [
    {
      "id": "1",
      "title": "Heavy Rainfall Alert",
      "description": "Heavy rainfall expected...",
      "severity": "high",
      "location": "Delhi NCR",
      "timestamp": "2025-11-01T10:00:00Z",
      "category": "Weather",
      "source": "IMD"
    }
  ],
  "count": 1
}
```

### POST /api/alerts/subscribe
Subscribe to email alerts.

**Request:**
```json
{
  "email": "user@example.com"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Successfully subscribed to alert notifications"
}
```

### DELETE /api/alerts/subscribe
Unsubscribe from email alerts.

**Request:**
```json
{
  "email": "user@example.com"
}
```

### POST /api/alerts/check
Background cron job to check for new alerts and send emails.

**Headers:**
```
Authorization: Bearer YOUR_CRON_SECRET
```

**Response:**
```json
{
  "success": true,
  "newAlerts": 2,
  "emailsSent": 10,
  "message": "Processed 2 new alerts, sent 10 emails"
}
```

## Alert Data Sources

### Current Implementation

The system currently uses mock data for demonstration. To integrate real data sources:

### 1. NDMA (National Disaster Management Authority)

NDMA doesn't provide a public REST API, but you can:
- Parse their RSS feeds
- Web scrape their official website
- Use their official mobile app API (requires approval)

### 2. OpenWeatherMap API

For weather-related alerts:

```typescript
// Already implemented in route.ts
// Just add your API key to .env.local
OPENWEATHER_API_KEY=your-key-here
```

Get a free API key: https://openweathermap.org/api

### 3. Other Sources

You can integrate additional sources:

- **India Meteorological Department (IMD)**: Weather alerts
- **Earthquake alerts**: USGS, seismic monitoring APIs
- **State Disaster Management Authorities**: Regional alerts
- **Government emergency services**: SMS gateway APIs

## Email Templates

The system includes professional HTML email templates with:

- Responsive design
- Color-coded severity levels
- Alert metadata (location, category, timestamp)
- Call-to-action buttons
- Unsubscribe options

## Customization

### Adding New Alert Sources

Edit `app/api/alerts/route.ts`:

```typescript
async function fetchFromNewSource(): Promise<NDMAAlert[]> {
  const response = await fetch('https://api.newsource.com/alerts');
  const data = await response.json();
  // Transform data to match NDMAAlert interface
  return transformedData;
}
```

### Customizing Email Templates

Edit `lib/emailService.ts`:

```typescript
function generateAlertEmailHTML(alert: AlertData): string {
  // Customize HTML template here
}
```

### Changing Alert Frequency

Modify the cron schedule or interval in your cron job configuration.

## Security Considerations

1. **CRON_SECRET**: Use a strong, random string to protect the cron endpoint
2. **Email Rate Limiting**: Implemented batch processing with delays
3. **SMTP Authentication**: Configure SMTP_USER and SMTP_PASS if required
4. **Subscriber Privacy**: Emails are stored securely in database
5. **Unsubscribe**: Users can unsubscribe at any time

## Troubleshooting

### Emails Not Sending

1. Check SMTP configuration:
   ```bash
   # Test SMTP connection
   telnet localhost 25
   ```

2. Check OpenSMTPD logs:
   ```bash
   sudo tail -f /var/log/maillog  # Linux
   sudo tail -f /var/log/mail.log  # macOS
   ```

3. Verify environment variables are loaded correctly

### Alerts Not Appearing

1. Check API endpoint response:
   ```bash
   curl http://localhost:3000/api/alerts
   ```

2. Verify API keys if using external sources
3. Check browser console for errors

### Cron Job Not Running

1. Verify CRON_SECRET matches in both .env and cron configuration
2. Check cron job logs
3. Test endpoint manually with curl

## Production Deployment

### Vercel

1. Set environment variables in Vercel dashboard
2. Add `vercel.json` for cron configuration
3. Deploy: `vercel --prod`

### Docker

Example `Dockerfile`:

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npx prisma generate
RUN npm run build
CMD ["npm", "start"]
```

### Traditional Server

1. Set up reverse proxy (nginx)
2. Configure PM2 or systemd service
3. Set up cron jobs
4. Configure firewall rules

## License

Part of the SafeCampus project.

## Support

For issues or questions, please open an issue on the repository.
