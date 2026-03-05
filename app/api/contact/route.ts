import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const contactSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    email: z.string().email('Invalid email address'),
    subject: z.string().min(1, 'Subject is required'),
    message: z.string().min(10, 'Message must be at least 10 characters'),
});

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const validatedData = contactSchema.parse(body);

        // NOTE: For production, configure SMTP credentials in .env.local
        // Uncomment and configure the code below with your SMTP service

        /*
        const nodemailer = require('nodemailer');
        
        const transporter = nodemailer.createTransporter({
          host: process.env.SMTP_HOST,
          port: parseInt(process.env.SMTP_PORT || '587'),
          secure: false,
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
          },
        });
    
        await transporter.sendMail({
          from: process.env.SMTP_USER,
          to: process.env.CONTACT_EMAIL_TO,
          subject: `Portfolio Contact: ${validatedData.subject}`,
          text: `
            Name: ${validatedData.name}
            Email: ${validatedData.email}
            Subject: ${validatedData.subject}
            
            Message:
            ${validatedData.message}
          `,
          html: `
            <h2>New Contact Form Submission</h2>
            <p><strong>Name:</strong> ${validatedData.name}</p>
            <p><strong>Email:</strong> ${validatedData.email}</p>
            <p><strong>Subject:</strong> ${validatedData.subject}</p>
            <hr />
            <p><strong>Message:</strong></p>
            <p>${validatedData.message.replace(/\n/g, '<br>')}</p>
          `,
        });
        */

        // For development/testing: Log to console
        console.log('Contact form submission:', validatedData);

        // Simulate success (remove in production)
        return NextResponse.json(
            { message: 'Message sent successfully!' },
            { status: 200 }
        );
    } catch (error) {
        console.error('Contact form error:', error);

        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { error: 'Validation failed', details: error.errors },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { error: 'Failed to send message' },
            { status: 500 }
        );
    }
}
