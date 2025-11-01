import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prismaSingleton';
import { sendAlertEmail } from '@/lib/emailService';

interface Alert {
  id: string;
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  location: string;
  timestamp: string;
  category: string;
  source: string;
}

// This endpoint should be called by a cron job (e.g., every 5 minutes)
// You can use services like Vercel Cron, GitHub Actions, or a separate cron service
export async function POST(request: NextRequest) {
  try {
    // Verify authorization (optional but recommended)
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET || 'your-secret-key';
    
    if (authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Fetch latest alerts from the alerts API
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
    const alertsResponse = await fetch(`${baseUrl}/api/alerts`);
    const alertsData = await alertsResponse.json();
    const currentAlerts: Alert[] = alertsData.alerts || [];

    if (currentAlerts.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'No alerts to process',
      });
    }

    // Get all active subscribers
    const subscribers = await prisma.alertSubscriber.findMany({
      where: { isActive: true },
      select: { email: true },
    });

    if (subscribers.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'No active subscribers',
      });
    }

    const recipientEmails = subscribers.map((sub: { email: string }) => sub.email);

    // Get the timestamp of the last check
    let lastCheckTime = new Date(Date.now() - 10 * 60 * 1000); // Default: 10 minutes ago
    
    try {
      const lastCheck = await prisma.alertCheck.findFirst({
        orderBy: { checkedAt: 'desc' },
      });
      if (lastCheck) {
        lastCheckTime = lastCheck.checkedAt;
      }
    } catch (error) {
      // Table might not exist yet, use default
      console.log('Alert check table not found, using default time');
    }

    // Filter new alerts (those created after the last check)
    const newAlerts = currentAlerts.filter(alert => {
      const alertTime = new Date(alert.timestamp);
      return alertTime > lastCheckTime;
    });

    // Send emails for new critical and high severity alerts only
    const alertsToEmail = newAlerts.filter(
      alert => alert.severity === 'critical' || alert.severity === 'high'
    );

    let emailsSent = 0;
    for (const alert of alertsToEmail) {
      try {
        await sendAlertEmail(alert, recipientEmails);
        emailsSent += recipientEmails.length;
        
        // Log the sent alert
        await prisma.sentAlert.create({
          data: {
            alertId: alert.id,
            title: alert.title,
            severity: alert.severity,
            recipientCount: recipientEmails.length,
          },
        });
      } catch (error) {
        console.error(`Error sending alert ${alert.id}:`, error);
      }
    }

    // Update the last check timestamp
    try {
      await prisma.alertCheck.create({
        data: {
          checkedAt: new Date(),
          alertsFound: newAlerts.length,
          emailsSent: emailsSent,
        },
      });
    } catch (error) {
      console.log('Could not save alert check:', error);
    }

    return NextResponse.json({
      success: true,
      newAlerts: newAlerts.length,
      emailsSent,
      message: `Processed ${newAlerts.length} new alerts, sent ${emailsSent} emails`,
    });
  } catch (error) {
    console.error('Error in alert check cron:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to process alerts' 
      },
      { status: 500 }
    );
  }
}
