import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const contactSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    subject: z.string().min(3, 'Subject is required'),
    message: z.string().min(20, 'Message must be at least 20 characters'),
});

const SMTP_CONFIGURED =
    !!process.env.SMTP_HOST &&
    !!process.env.SMTP_USER &&
    !!process.env.SMTP_PASS &&
    !!process.env.CONTACT_EMAIL_TO;

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const validatedData = contactSchema.parse(body);

        if (SMTP_CONFIGURED) {
            // Production: send via nodemailer
            const nodemailer = await import('nodemailer');
            const transporter = nodemailer.default.createTransport({
                host: process.env.SMTP_HOST,
                port: parseInt(process.env.SMTP_PORT || '587'),
                secure: process.env.SMTP_PORT === '465',
                auth: {
                    user: process.env.SMTP_USER,
                    pass: process.env.SMTP_PASS,
                },
            });

            await transporter.sendMail({
                from: `"Portfolio Contact" <${process.env.SMTP_USER}>`,
                to: process.env.CONTACT_EMAIL_TO,
                replyTo: validatedData.email,
                subject: `Portfolio Contact: ${validatedData.subject}`,
                text: `Name: ${validatedData.name}\nEmail: ${validatedData.email}\nSubject: ${validatedData.subject}\n\nMessage:\n${validatedData.message}`,
                html: `
                    <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px;background:#0b0b0b;color:#fff;border-radius:12px;">
                        <h2 style="color:#FF5A2A;margin-bottom:16px;">New Portfolio Contact</h2>
                        <table style="width:100%;border-collapse:collapse;">
                            <tr><td style="padding:8px 0;color:#999;width:90px;">Name</td><td style="padding:8px 0;color:#fff;">${validatedData.name}</td></tr>
                            <tr><td style="padding:8px 0;color:#999;">Email</td><td style="padding:8px 0;color:#fff;"><a href="mailto:${validatedData.email}" style="color:#FF5A2A;">${validatedData.email}</a></td></tr>
                            <tr><td style="padding:8px 0;color:#999;">Subject</td><td style="padding:8px 0;color:#fff;">${validatedData.subject}</td></tr>
                        </table>
                        <hr style="border:none;border-top:1px solid #222;margin:16px 0;" />
                        <p style="color:#ccc;line-height:1.6;">${validatedData.message.replace(/\n/g, '<br>')}</p>
                    </div>
                `,
            });

            console.log(`[Contact] Email sent from ${validatedData.email}`);
        } else {
            // Dev/no-SMTP fallback: log to console and return success
            console.log('[Contact] SMTP not configured — logging submission:');
            console.log(JSON.stringify(validatedData, null, 2));
            console.log('[Contact] To enable email, add SMTP_HOST, SMTP_USER, SMTP_PASS, CONTACT_EMAIL_TO to .env.local');
        }

        return NextResponse.json(
            { message: 'Message sent successfully!' },
            { status: 200 }
        );
    } catch (error) {
        console.error('[Contact] Error:', error);

        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { error: 'Validation failed', details: error.errors },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { error: 'Failed to send message. Please try again later.' },
            { status: 500 }
        );
    }
}
