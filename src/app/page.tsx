'use client';

import { FC } from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/landing/Hero';
import Footer from '@/components/landing/Footer';
import Pricing from '@/components/landing/Pricing';
import Features from '@/components/landing/Features';

const Home: FC = () => {
  return (
    <div>
      <Navbar />
      <main className="overflow-y-scroll bg-[#f4f4fa]">
        <Hero />
        <Features />
        <Pricing />
        <Footer />
      </main>
    </div>
  );
};

export default Home;
