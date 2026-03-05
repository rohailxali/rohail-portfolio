import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import Hero from '@/components/Hero';

// Mock framer-motion
jest.mock('framer-motion', () => ({
    motion: {
        div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
        h1: ({ children, ...props }: any) => <h1 {...props}>{children}</h1>,
        h2: ({ children, ...props }: any) => <h2 {...props}>{children}</h2>,
        p: ({ children, ...props }: any) => <p {...props}>{children}</p>,
        button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
    },
    useScroll: () => ({ scrollY: { current: 0 } }),
    useTransform: () => 0,
}));

// Mock next/image
jest.mock('next/image', () => ({
    __esModule: true,
    default: (props: any) => <img {...props} />,
}));

describe('Hero Component', () => {
    it('renders hero heading with name', () => {
        render(<Hero />);
        const heading = screen.getByRole('heading', { level: 1 });
        expect(heading).toHaveTextContent('Muhammad Rohail Ali');
    });

    it('renders CTA button', () => {
        render(<Hero />);
        const button = screen.getByRole('button', { name: /get in touch/i });
        expect(button).toBeInTheDocument();
    });

    it('renders tagline', () => {
        render(<Hero />);
        const tagline = screen.getByText(/End-to-end ML systems/i);
        expect(tagline).toBeInTheDocument();
    });
});
