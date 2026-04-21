import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Admin — Noir Portfolio',
    description: 'Admin panel for managing portfolio projects',
    robots: 'noindex, nofollow',
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen bg-noir-bg">
            {children}
        </div>
    );
}
