import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prismaSingleton';
import { sendWelcomeEmail } from '@/lib/emailService';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Valid email address is required' },
        { status: 400 }
      );
    }

    // Check if email already exists
    const existingSubscriber = await prisma.alertSubscriber.findUnique({
      where: { email },
    });

    if (existingSubscriber) {
      if (existingSubscriber.isActive) {
        return NextResponse.json(
          { error: 'This email is already subscribed to alerts' },
          { status: 400 }
        );
      } else {
        // Reactivate subscription
        await prisma.alertSubscriber.update({
          where: { email },
          data: { isActive: true },
        });
        
        // Send welcome email
        try {
          await sendWelcomeEmail(email);
        } catch (emailError) {
          console.error('Failed to send welcome email:', emailError);
          // Don't fail the subscription if email fails
        }
        
        return NextResponse.json({
          success: true,
          message: 'Subscription reactivated successfully',
        });
      }
    }

    // Create new subscriber
    await prisma.alertSubscriber.create({
      data: {
        email,
        isActive: true,
      },
    });

    // Send welcome email
    try {
      await sendWelcomeEmail(email);
    } catch (emailError) {
      console.error('Failed to send welcome email:', emailError);
      // Don't fail the subscription if email fails
    }

    return NextResponse.json({
      success: true,
      message: 'Successfully subscribed to alert notifications',
    });
  } catch (error) {
    console.error('Error subscribing to alerts:', error);
    return NextResponse.json(
      { error: 'Failed to subscribe to alerts' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { error: 'Email address is required' },
        { status: 400 }
      );
    }

    // Soft delete - deactivate subscription
    await prisma.alertSubscriber.update({
      where: { email },
      data: { isActive: false },
    });

    return NextResponse.json({
      success: true,
      message: 'Successfully unsubscribed from alert notifications',
    });
  } catch (error) {
    console.error('Error unsubscribing from alerts:', error);
    return NextResponse.json(
      { error: 'Failed to unsubscribe from alerts' },
      { status: 500 }
    );
  }
}
