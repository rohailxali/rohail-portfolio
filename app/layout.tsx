import type { Metadata } from 'next';
import { Poppins, Inter } from 'next/font/google';
import './globals.css';

const poppins = Poppins({
  weight: ['700', '800', '900'],
  subsets: ['latin'],
  variable: '--font-poppins',
  display: 'swap',
});

const inter = Inter({
  weight: ['400', '500', '600'],
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Muhammad Rohail Ali | Data Scientist & Full-Stack Developer',
  description:
    'End-to-end ML systems, production web apps, and generative AI solutions by Muhammad Rohail Ali. Portfolio showcasing data science, full-stack development, and Gen-AI projects.',
  keywords: [
    'Data Scientist',
    'Full-Stack Developer',
    'Machine Learning',
    'Gen-AI',
    'React',
    'Next.js',
    'Python',
  ],
  authors: [{ name: 'Muhammad Rohail Ali' }],
  openGraph: {
    title: 'Muhammad Rohail Ali | Data Scientist & Full-Stack Developer',
    description: 'End-to-end ML systems, production web apps, and generative AI solutions.',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Muhammad Rohail Ali | Data Scientist & Full-Stack Developer',
    description: 'End-to-end ML systems, production web apps, and generative AI solutions.',
  },
  robots: 'index, follow',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${poppins.variable} ${inter.variable}`}>
      <body>{children}</body>
    </html>
  );
}
