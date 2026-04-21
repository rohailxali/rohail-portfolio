import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { z } from 'zod';

const DATA_FILE = path.join(process.cwd(), 'data', 'projects.json');

const ADMIN_SECRET = process.env.ADMIN_SECRET || 'rohail-admin-2024';

const projectSchema = z.object({
    title: z.string().min(1, 'Title is required').max(100),
    category: z.enum(['WEB', 'APP', 'MOCKUP', 'BRANDING', 'VIDEO', 'LOGO', 'OTHER']),
    description: z.string().min(10, 'Description must be at least 10 characters').max(1000),
    thumbnail: z.string().optional().default('/assets/projects/project-1.jpg'),
    isVideo: z.boolean().optional().default(false),
    tech: z.union([
        z.array(z.string()),
        z.string().transform(s => s.split(',').map(t => t.trim()).filter(Boolean)),
    ]).optional().default([]),
    demoUrl: z.string().url().nullable().optional(),
    githubUrl: z.string().url().nullable().optional(),
    gallery: z.array(z.string()).optional(),
});

function checkAuth(req: NextRequest): boolean {
    const token = req.headers.get('x-admin-secret');
    return token === ADMIN_SECRET;
}

function readProjects() {
    const raw = fs.readFileSync(DATA_FILE, 'utf-8');
    return JSON.parse(raw);
}

function writeProjects(projects: unknown[]) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(projects, null, 4), 'utf-8');
}

export async function GET() {
    try {
        const projects = readProjects();
        return NextResponse.json(projects);
    } catch {
        return NextResponse.json({ error: 'Failed to read projects' }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    if (!checkAuth(req)) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await req.json();
        const parsed = projectSchema.safeParse(body);

        if (!parsed.success) {
            return NextResponse.json(
                { error: 'Validation failed', details: parsed.error.errors },
                { status: 400 }
            );
        }

        const data = parsed.data;
        const projects = readProjects();

        const newProject = {
            id: `proj-${Date.now()}`,
            title: data.title,
            category: data.category,
            description: data.description,
            thumbnail: data.thumbnail,
            isVideo: data.isVideo,
            tech: Array.isArray(data.tech) ? data.tech : [],
            demoUrl: data.demoUrl ?? null,
            githubUrl: data.githubUrl ?? null,
            gallery: data.gallery ?? [data.thumbnail],
        };

        projects.push(newProject);
        writeProjects(projects);

        return NextResponse.json(newProject, { status: 201 });
    } catch (err) {
        console.error('[Projects POST]', err);
        return NextResponse.json({ error: 'Failed to add project' }, { status: 500 });
    }
}

export async function PUT(req: NextRequest) {
    if (!checkAuth(req)) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await req.json();
        if (!body.id) {
            return NextResponse.json({ error: 'id is required' }, { status: 400 });
        }

        const parsed = projectSchema.safeParse(body);
        if (!parsed.success) {
            return NextResponse.json(
                { error: 'Validation failed', details: parsed.error.errors },
                { status: 400 }
            );
        }

        const projects = readProjects();
        const idx = projects.findIndex((p: { id: string }) => p.id === body.id);
        if (idx === -1) {
            return NextResponse.json({ error: 'Project not found' }, { status: 404 });
        }

        const data = parsed.data;
        projects[idx] = {
            ...projects[idx],
            title: data.title,
            category: data.category,
            description: data.description,
            thumbnail: data.thumbnail,
            isVideo: data.isVideo,
            tech: Array.isArray(data.tech) ? data.tech : [],
            demoUrl: data.demoUrl ?? null,
            githubUrl: data.githubUrl ?? null,
            gallery: data.gallery ?? [data.thumbnail],
        };

        writeProjects(projects);
        return NextResponse.json(projects[idx]);
    } catch (err) {
        console.error('[Projects PUT]', err);
        return NextResponse.json({ error: 'Failed to update project' }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest) {
    if (!checkAuth(req)) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'id query param is required' }, { status: 400 });
        }

        const projects = readProjects();
        const filtered = projects.filter((p: { id: string }) => p.id !== id);

        if (filtered.length === projects.length) {
            return NextResponse.json({ error: 'Project not found' }, { status: 404 });
        }

        writeProjects(filtered);
        return NextResponse.json({ success: true });
    } catch (err) {
        console.error('[Projects DELETE]', err);
        return NextResponse.json({ error: 'Failed to delete project' }, { status: 500 });
    }
}
