import { NextRequest, NextResponse } from 'next/server';

const CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME;
const API_KEY = process.env.CLOUDINARY_API_KEY;
const API_SECRET = process.env.CLOUDINARY_API_SECRET;
const ADMIN_SECRET = process.env.ADMIN_SECRET || 'rohail-admin-2024';

const CLOUDINARY_CONFIGURED = !!(CLOUD_NAME && API_KEY && API_SECRET);

export async function POST(req: NextRequest) {
    // Auth check
    const token = req.headers.get('x-admin-secret');
    if (token !== ADMIN_SECRET) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!CLOUDINARY_CONFIGURED) {
        return NextResponse.json(
            {
                error: 'Cloudinary not configured',
                hint: 'Add CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET to .env.local',
            },
            { status: 503 }
        );
    }

    try {
        const formData = await req.formData();
        const file = formData.get('file') as File | null;

        if (!file) {
            return NextResponse.json({ error: 'No file provided' }, { status: 400 });
        }

        // Validate file type
        if (!file.type.startsWith('image/')) {
            return NextResponse.json({ error: 'Only image files are allowed' }, { status: 400 });
        }

        // Validate file size (5MB max)
        const MAX_SIZE = 5 * 1024 * 1024;
        if (file.size > MAX_SIZE) {
            return NextResponse.json({ error: 'File size must be under 5MB' }, { status: 400 });
        }

        // Convert to base64 for Cloudinary upload
        const arrayBuffer = await file.arrayBuffer();
        const base64 = Buffer.from(arrayBuffer).toString('base64');
        const dataUri = `data:${file.type};base64,${base64}`;

        // Generate signature for authenticated upload
        const timestamp = Math.round(Date.now() / 1000);
        const folder = 'portfolio_projects';

        const crypto = await import('crypto');
        const signatureString = `folder=${folder}&timestamp=${timestamp}${API_SECRET}`;
        const signature = crypto.default
            .createHash('sha1')
            .update(signatureString)
            .digest('hex');

        // Upload to Cloudinary
        const uploadFormData = new FormData();
        uploadFormData.append('file', dataUri);
        uploadFormData.append('timestamp', String(timestamp));
        uploadFormData.append('api_key', API_KEY!);
        uploadFormData.append('signature', signature);
        uploadFormData.append('folder', folder);

        const cloudinaryRes = await fetch(
            `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
            { method: 'POST', body: uploadFormData }
        );

        if (!cloudinaryRes.ok) {
            const err = await cloudinaryRes.json();
            console.error('[Upload] Cloudinary error:', err);
            return NextResponse.json({ error: 'Upload to Cloudinary failed' }, { status: 500 });
        }

        const result = await cloudinaryRes.json();

        return NextResponse.json({
            url: result.secure_url,
            public_id: result.public_id,
            width: result.width,
            height: result.height,
        });
    } catch (err) {
        console.error('[Upload] Unexpected error:', err);
        return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
    }
}
