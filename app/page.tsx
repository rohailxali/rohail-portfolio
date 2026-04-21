'use client';

import Nav from '@/components/Nav';
import Hero from '@/components/Hero';
import Services from '@/components/Services';
import Portfolio from '@/components/Portfolio';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <main className="min-h-screen relative">
      {/* Main two-column layout */}
      <div className="container mx-auto px-4 py-8 flex flex-col lg:flex-row gap-8">
        {/* Left Column - Main Panel (~62% width) */}
        <div className="w-full lg:w-[62%] relative">
          <div className="glass-panel p-12 relative">
            <Nav />
            <Hero />
            <Services />
          </div>
        </div>

        {/* Right Column - Portfolio Grid (~38% width) */}
        <div className="w-full lg:w-[38%]">
          <Portfolio />
        </div>
      </div>

      <Footer />
    </main>
  );
}
