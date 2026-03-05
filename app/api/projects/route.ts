import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const DATA_FILE = path.join(process.cwd(), 'data', 'projects.json');

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
    try {
        const body = await req.json();

        // Basic validation
        if (!body.title || !body.category || !body.description) {
            return NextResponse.json({ error: 'title, category, and description are required' }, { status: 400 });
        }

        const projects = readProjects();

        const newProject = {
            id: `proj-${Date.now()}`,
            title: body.title,
            category: body.category,
            description: body.description,
            thumbnail: body.thumbnail || '/assets/projects/project-1.jpg',
            isVideo: body.isVideo ?? false,
            tech: Array.isArray(body.tech) ? body.tech : (body.tech ? body.tech.split(',').map((t: string) => t.trim()).filter(Boolean) : []),
            demoUrl: body.demoUrl || '#',
            githubUrl: body.githubUrl || null,
            gallery: body.gallery ?? [body.thumbnail || '/assets/projects/project-1.jpg'],
        };

        projects.push(newProject);
        writeProjects(projects);

        return NextResponse.json(newProject, { status: 201 });
    } catch {
        return NextResponse.json({ error: 'Failed to add project' }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest) {
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
    } catch {
        return NextResponse.json({ error: 'Failed to delete project' }, { status: 500 });
    }
}
