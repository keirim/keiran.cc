'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, useAnimation, useInView } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Upload, Shield, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TextGenerateEffect } from '@/components/ui/text-generate-effect';
import { cn } from '@/lib/utils';

export default function LandingPage() {
  const controls = useAnimation();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });
  const featuresRef = useRef(null);
  const isFeaturesInView = useInView(featuresRef, {
    once: true,
    margin: '-100px',
  });
  const footerRef = useRef(null);
  const isFooterInView = useInView(footerRef, { once: true, margin: '-100px' });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('mousemove', handleMouseMove);
      return () => window.removeEventListener('mousemove', handleMouseMove);
    }
  }, []);

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
      },
    },
  };

  const buttonVariants = {
    hover: {
      scale: 1.05,
      boxShadow: '0 20px 40px rgba(0, 0, 0, 0.2)',
      transition: { duration: 0.3 },
    },
    tap: {
      scale: 0.95,
      transition: { duration: 0.2 },
    },
  };

  const cardVariants = {
    hover: {
      y: -10,
      scale: 1.02,
      boxShadow: '0 20px 40px rgba(0, 0, 0, 0.2)',
      transition: { duration: 0.3 },
    },
  };

  const titleVariants = {
    animate: {
      y: [0, -10, 0],
      transition: {
        duration: 5,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    },
  };

  return (
    <div className="relative z-0 overflow-hidden min-h-screen">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--primary-rgb)_0%,_transparent_65%)] opacity-10" />
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 rounded-full bg-primary/20"
            initial={{ x: Math.random() * (windowSize.width || 1000), y: -20 }}
            animate={{
              y: (windowSize.height || 800) + 20,
              x: Math.random() * (windowSize.width || 1000),
            }}
            transition={{
              duration: Math.random() * 5 + 5,
              repeat: Infinity,
              ease: 'linear',
              delay: Math.random() * 5,
            }}
          />
        ))}
      </div>

      <div className="min-h-screen relative">
        <motion.div
          className="container mx-auto px-4 py-16 md:py-24 relative z-10"
          initial="hidden"
          animate="visible"
        >
          <motion.h1
            className="text-5xl md:text-7xl font-extrabold text-center mb-8 bg-clip-text text-transparent bg-gradient-to-r from-primary via-primary/80 to-secondary"
            variants={itemVariants}
            animate="animate"
          >
            <motion.span variants={titleVariants}>Welcome to </motion.span>
            <motion.span
              variants={titleVariants}
              className="text-primary relative"
            >
              AnonHost
              <span className="absolute -inset-1 bg-primary/10 blur-xl" />
            </motion.span>
          </motion.h1>

          <motion.div
            className="text-xl md:text-3xl text-center text-muted-foreground mb-12"
            variants={itemVariants}
          >
            <TextGenerateEffect
              words="Upload and share files anonymously. For free, forever."
              duration={1}
            />
          </motion.div>

          <motion.div
            className="flex justify-center mb-24"
            variants={itemVariants}
          >
            <Link href="/upload">
              <motion.div
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
                className="relative group"
              >
                <div className="absolute -inset-1 bg-gradient-to-r from-primary to-secondary rounded-full blur-lg opacity-50 group-hover:opacity-100 transition duration-500" />
                <Button
                  size="lg"
                  className="relative text-lg bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-12 py-6"
                >
                  Start Uploading{' '}
                  <motion.span
                    className="ml-2 inline-block"
                    animate={{ x: [0, 4, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <ArrowRight className="w-6 h-6" />
                  </motion.span>
                </Button>
              </motion.div>
            </Link>
          </motion.div>

          <div className="h-[45vh]" />

          <motion.div
            ref={featuresRef}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            style={{
              transform: isFeaturesInView ? 'none' : 'translateY(100px)',
              opacity: isFeaturesInView ? 1 : 0,
              transition: 'all 0.9s cubic-bezier(0.17, 0.55, 0.55, 1) 0.5s',
            }}
          >
            {[
              {
                icon: Upload,
                title: 'Easy Uploads',
                description:
                  'Drag and drop or click to upload files up to 1GB.',
              },
              {
                icon: Shield,
                title: 'Anonymous Sharing',
                description:
                  'No account required. Your privacy is our priority.',
              },
              {
                icon: Zap,
                title: 'Lightning Fast',
                description:
                  'Optimized for speed, your files are ready in seconds.',
              },
            ].map(({ icon: Icon, title, description }, index) => (
              <motion.div
                key={index}
                className={cn(
                  'rounded-xl p-8 shadow-lg border border-primary/10',
                  'backdrop-blur-sm hover:shadow-xl transition-all duration-300',
                  'bg-gradient-to-br from-background/80 to-background/40',
                  'relative group',
                )}
                variants={cardVariants}
                whileHover="hover"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 opacity-0 group-hover:opacity-100 transition duration-500 rounded-xl blur-lg" />
                <div className="relative">
                  <Icon className="w-16 h-16 text-primary mb-6 transition-transform duration-500 group-hover:rotate-12 group-hover:scale-110" />
                </div>
                <h2 className="text-2xl font-bold mb-4 relative transition-transform duration-500 group-hover:translate-y-1">
                  {title}
                </h2>
                <p className="text-muted-foreground text-lg relative transition-opacity duration-500 group-hover:opacity-80">
                  {description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        <motion.div
          ref={footerRef}
          className="text-center py-8 bg-gradient-to-t from-background/80 to-transparent backdrop-blur-sm"
          style={{
            transform: isFooterInView ? 'none' : 'translateY(20px)',
            opacity: isFooterInView ? 1 : 0,
            transition: 'all 0.6s cubic-bezier(0.17, 0.55, 0.55, 1) 0.3s',
          }}
        >
          <p className="text-sm text-muted-foreground">
            Proudly open source on{' '}
            <a
              href="https://github.com/KeiranScript/keiran.cc"
              target="_blank"
              className="text-primary hover:text-primary/80 underline underline-offset-4"
            >
              GitHub
            </a>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
