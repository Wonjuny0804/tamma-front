'use client';

import { FC, useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { ArrowRight } from 'lucide-react';
import Image from 'next/image';

const CARDS = [
  {
    image_url: '/images/sample_1.avif',
    color: '#266678',
  },
  {
    image_url: '/images/sample_2.avif',
    color: '#cb7c7a',
  },
  {
    image_url: '/images/sample_3.avif',
    color: '#36a18b',
  },
];

const Hero: FC = () => {
  const transition = { duration: 10, ease: 'easeInOut', repeat: Infinity };
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % CARDS.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative h-screen w-full overflow-hidden">
      {/* Blob 1 */}
      <motion.div
        style={{
          position: 'absolute',
          top: '30%',
          left: '20%',
          width: 500,
          height: 500,
          backgroundColor: 'rgba(161, 228, 178, 0.5)',
          borderRadius: '42% 58% 70% 30% / 55% 40% 60% 45%',
        }}
        initial={{ opacity: 0.5, x: -800, y: -300, rotate: 0 }}
        animate={{
          opacity: [0.5, 0.8, 0.5],
          x: [-800, -300, -800],
          y: [-300, 50, -300],
          rotate: [0, 304.5, 0],
        }}
        transition={transition}
      />

      {/* Blob 2 */}
      <motion.div
        style={{
          position: 'absolute',
          bottom: '-15%',
          right: '-10%',
          width: 700,
          height: 700,
          backgroundColor: 'rgba(59, 130, 246, 0.5)',
          borderRadius: '60% 40% 35% 65% / 50% 60% 40% 50%',
        }}
        initial={{ opacity: 0.4, x: 0, y: 0, rotate: 0 }}
        animate={{
          opacity: [0.4, 0.7, 0.4],
          x: [0, -30, 0],
          y: [0, 30, 0],
          rotate: [0, 45, 0],
        }}
        transition={{ ...transition, duration: 12 }}
      />

      {/* Blob 3 */}
      <motion.div
        style={{
          position: 'absolute',
          top: '-10%',
          right: '40%',
          width: 600,
          height: 600,
          backgroundColor: 'rgba(236, 72, 153, 0.5)',
          borderRadius: '55% 45% 50% 50% / 60% 40% 60% 40%',
        }}
        initial={{ opacity: 0.6, x: 300, y: -200, rotate: 0 }}
        animate={{
          opacity: [0.6, 0.9, 0.6],
          x: [300, 50, 300],
          y: [-200, 100, -200],
          rotate: [0, 360, 0],
        }}
        transition={{ ...transition, duration: 8 }}
      />

      <motion.div
        style={{
          position: 'absolute',
          top: '40%',
          right: '-5%',
          width: 450,
          height: 450,
          backgroundColor: 'rgba(249, 115, 22, 0.3)',
          borderRadius: '55% 45% 60% 40% / 50% 60% 40% 50%',
        }}
        initial={{ opacity: 0.5, x: 500, y: 0, rotate: 0 }}
        animate={{
          opacity: [0.5, 0.8, 0.5],
          x: [500, 250, 500],
          y: [0, -50, 0],
          rotate: [0, 360, 0],
        }}
        transition={{ ...transition, duration: 9 }}
      />

      <div className="absolute inset-0 flex flex-col bg-white/60 px-6 backdrop-blur-lg">
        <div className="my-5 flex flex-col items-center">
          <h1 className="mt-40 text-center text-[32px] leading-tight font-medium text-gray-800">
            Footage Refined,
            <br /> Stories Amplified
          </h1>
          <p className="mt-4 max-w-xl text-center font-medium text-black">
            Upload your footage, let AI refine it, and get six social-ready clips instantly.
          </p>
          <Button
            size="lg"
            className="mt-4 flex items-center gap-2 font-thin"
            onClick={() => router.push('/signin')}
          >
            Get Started
            <ArrowRight />
          </Button>
        </div>

        {/* 
        Cards with Feature images, carousel
         */}

        <div className="relative mx-auto mt-12 h-[400px] w-full max-w-[800px] overflow-hidden rounded-xl">
          {CARDS.map((card, index) => (
            <motion.div
              key={index}
              className="absolute inset-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: index === currentIndex ? 1 : 0 }}
              transition={{ duration: 0.5 }}
            >
              <Image
                src={card.image_url}
                alt={`Slide ${index + 1}`}
                fill
                className="object-cover"
                priority={index === 0}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Hero;
