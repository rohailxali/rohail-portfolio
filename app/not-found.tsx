import Link from 'next/link';

export default function NotFound() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-noir-bg px-4">
            <div className="text-center">
                <h1 className="font-heading font-extrabold text-9xl text-accent-orange mb-4">404</h1>
                <h2 className="font-heading font-bold text-3xl text-white mb-4">Page Not Found</h2>
                <p className="text-noir-muted mb-8 max-w-md mx-auto">
                    The page you're looking for doesn't exist or has been moved.
                </p>
                <Link
                    href="/"
                    className="inline-block bg-accent-orange text-black font-semibold rounded-lg px-8 py-4 hover:shadow-glow-orange transition-all duration-300"
                >
                    Back to Home
                </Link>
            </div>
        </div>
    );
}
