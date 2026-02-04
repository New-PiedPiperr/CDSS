'use client';

import Link from 'next/link';
import {
  Home,
  ArrowLeft,
  Search,
  Activity,
  Heart,
  Shield,
  AlertCircle,
  FileSearch,
  Stethoscope,
} from 'lucide-react';
import { Button } from '@/components/ui';
import { motion } from 'motion/react';

/**
 * PREMIUM 404 PAGE - REDESIGNED
 * =============================
 * Part of the CDSS Visual Excellence Initiative.
 * Features:
 * - Immersive background with animated clinical orbs
 * - Huge tracking-tighter 404 with glassmorphic overlay
 * - Scanner/Discovery micro-animation
 * - Semantic navigation for easy recovery
 */
export function NotFoundClient() {
  return (
    <div className="selection:bg-primary relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-slate-950 px-6 text-center selection:text-white">
      {/* Immersive Background Elements */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {/* Animated Orbs with Modern HSL Colors */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            x: [0, 50, 0],
            y: [0, 30, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute top-[-20%] left-[-10%] h-[70%] w-[70%] rounded-full bg-blue-600/10 blur-[150px]"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            x: [0, -60, 0],
            y: [0, -50, 0],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute right-[-10%] bottom-[-20%] h-[80%] w-[80%] rounded-full bg-indigo-600/10 blur-[180px]"
        />

        {/* Dynamic Grid Overlay */}
        <div
          className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)`,
            backgroundSize: '48px 48px',
          }}
        />

        {/* Floating Medical Icons Background */}
        <div className="absolute inset-0 opacity-[0.03]">
          <Stethoscope className="absolute top-[15%] left-[10%] h-32 w-32 -rotate-12" />
          <Activity className="absolute right-[15%] bottom-[20%] h-40 w-40 rotate-12" />
          <Heart className="absolute top-[60%] left-[5%] h-24 w-24 rotate-45" />
        </div>
      </div>

      <div className="relative z-10 flex max-w-4xl flex-col items-center">
        {/* Huge Stylized 404 Area */}
        <div className="relative mb-12 flex flex-col items-center justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            className="flex items-center justify-center"
          >
            <h1 className="text-[12rem] leading-none font-black tracking-[-0.08em] text-white/5 sm:text-[22rem]">
              404
            </h1>
          </motion.div>

          {/* Central Diagnostic Hub */}
          <div className="absolute flex flex-col items-center justify-center">
            <motion.div
              initial={{ scale: 0, rotate: -45 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.4, type: 'spring', stiffness: 120 }}
              className="group relative"
            >
              <div className="bg-primary/20 absolute inset-[-40px] animate-pulse rounded-full blur-3xl" />
              <div className="relative flex h-32 w-32 items-center justify-center rounded-[2.5rem] border border-white/20 bg-white/5 shadow-2xl backdrop-blur-2xl transition-all duration-500 hover:rotate-6 sm:h-40 sm:w-40">
                <div className="absolute inset-0 rounded-[2.5rem] bg-gradient-to-br from-white/10 to-transparent" />
                <FileSearch
                  className="relative h-16 w-16 text-white sm:h-20 sm:w-20"
                  strokeWidth={1.2}
                />

                {/* Cyber Scanner Line */}
                <motion.div
                  animate={{ top: ['5%', '95%', '5%'] }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                  className="absolute left-[10%] h-[1px] w-[80%] bg-white/40 shadow-[0_0_15px_rgba(255,255,255,0.8)]"
                />
              </div>

              {/* Spinning Ring */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                className="absolute inset-[-20px] rounded-full border border-dashed border-white/10"
              />
            </motion.div>
          </div>
        </div>

        {/* Content Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="space-y-6"
        >
          <div className="mx-auto flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1 backdrop-blur-md">
            <AlertCircle className="text-primary h-4 w-4" />
            <span className="text-[10px] font-black tracking-[0.2em] text-white/70 uppercase">
              Error: Page Not Found
            </span>
          </div>

          <h2 className="text-5xl font-black tracking-tight text-white sm:text-7xl">
            Observation Room{' '}
            <span className="from-primary bg-gradient-to-r to-blue-400 bg-clip-text text-transparent">
              Expired.
            </span>
          </h2>

          <p className="mx-auto max-w-xl text-lg leading-relaxed font-medium text-slate-400 sm:text-xl">
            The path you followed is no longer on the clinical charts. It's possible the
            data has been archived or the corridor has move.
          </p>
        </motion.div>

        {/* Premium Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="mt-16 flex w-full flex-col items-center gap-6 sm:w-auto sm:flex-row"
        >
          <Link href="/" className="group w-full sm:w-auto">
            <Button
              size="lg"
              className="relative h-16 w-full gap-3 overflow-hidden rounded-[2rem] bg-white px-10 text-base font-black text-slate-950 transition-all hover:scale-105 active:scale-95 sm:w-auto"
            >
              <Home className="h-5 w-5" />
              Return To Base
              <div className="absolute inset-0 -translate-x-full skew-x-12 bg-slate-900/5 transition-transform duration-500 group-hover:translate-x-full" />
            </Button>
          </Link>

          <Link href="/help" className="group w-full sm:w-auto">
            <Button
              variant="outline"
              size="lg"
              className="h-16 w-full gap-3 rounded-[2rem] border-white/20 bg-white/5 px-10 text-base font-black text-white backdrop-blur-xl transition-all hover:scale-105 hover:border-white/40 hover:bg-white/10 active:scale-95 sm:w-auto"
            >
              <ArrowLeft className="h-5 w-5" />
              Help Center
            </Button>
          </Link>
        </motion.div>

        {/* Navigation Map for fast recovery */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 1 }}
          className="mt-24 grid w-full grid-cols-2 gap-16 border-t border-white/10 pt-12 text-left sm:grid-cols-3"
        >
          <div className="space-y-4">
            <h4 className="flex items-center gap-2 text-[10px] font-black tracking-[0.25em] text-white/30 uppercase">
              <Activity className="h-3 w-3" /> Core Navigation
            </h4>
            <div className="flex flex-col gap-3">
              <Link
                href="/patient/dashboard"
                className="hover:text-primary text-sm font-bold text-white/60 transition-colors"
              >
                Patient Dashboard
              </Link>
              <Link
                href="/clinician/dashboard"
                className="hover:text-primary text-sm font-bold text-white/60 transition-colors"
              >
                Clinician Hub
              </Link>
              <Link
                href="/search"
                className="hover:text-primary text-sm font-bold text-white/60 transition-colors"
              >
                Medical Search
              </Link>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="flex items-center gap-2 text-[10px] font-black tracking-[0.25em] text-white/30 uppercase">
              <Shield className="h-3 w-3" /> System Support
            </h4>
            <div className="flex flex-col gap-3">
              <Link
                href="/contact"
                className="hover:text-primary text-sm font-bold text-white/60 transition-colors"
              >
                Support Desk
              </Link>
              <Link
                href="/docs"
                className="hover:text-primary text-sm font-bold text-white/60 transition-colors"
              >
                Documentation
              </Link>
              <Link
                href="/report-bug"
                className="hover:text-primary text-sm font-bold text-white/60 transition-colors"
              >
                Report Link Error
              </Link>
            </div>
          </div>

          <div className="hidden space-y-4 sm:block">
            <h4 className="flex items-center gap-2 text-[10px] font-black tracking-[0.25em] text-white/30 uppercase">
              <Heart className="h-3 w-3" /> Legal & Ethics
            </h4>
            <div className="flex flex-col gap-3">
              <Link
                href="/privacy"
                className="hover:text-primary text-sm font-bold text-white/60 transition-colors"
              >
                Privacy Protocol
              </Link>
              <Link
                href="/terms"
                className="hover:text-primary text-sm font-bold text-white/60 transition-colors"
              >
                Terms of Admission
              </Link>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Footer Branding */}
      <div className="absolute right-0 bottom-10 left-0 flex items-center justify-between px-10">
        <p className="text-[10px] font-black tracking-[0.3em] text-white/20 uppercase">
          CDSS Advanced Clinical Support &copy; 2026
        </p>

        <div className="flex items-center gap-6 opacity-20 saturate-0 transition-all hover:opacity-100 hover:saturate-100">
          <div className="h-6 w-px bg-white/20" />
          <div className="bg-primary flex h-8 w-8 items-center justify-center rounded-lg shadow-xl">
            <span className="text-xs font-black text-white">N</span>
          </div>
        </div>
      </div>
    </div>
  );
}
