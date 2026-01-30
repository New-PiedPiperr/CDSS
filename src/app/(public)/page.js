'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui';
import { Activity } from 'lucide-react';
import Image from 'next/image';

export default function LandingPage() {
  const router = useRouter();
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    setTimeout(() => setIsAnimating(true), 100);
  }, []);

  // Redirect if session exists
  const { data: session, status } = useSession();
  useEffect(() => {
    if (status === 'authenticated') {
      const role = session.user.role;
      if (role === 'ADMIN') router.push('/admin/dashboard');
      else if (role === 'CLINICIAN') router.push('/clinician/dashboard');
      else router.push('/patient/dashboard');
    }
  }, [status, session, router]);

  return (
    <div className="bg-slate-600 px-4 py-12 sm:px-6 lg:px-8 dark:bg-slate-800">
      <div className="container mx-auto">
        <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-10">
          <div
            className={`transition-all duration-700 ${isAnimating ? 'translate-x-0 opacity-100' : '-translate-x-10 opacity-0'}`}
          >
            <h1 className="text-4xl leading-tight font-bold text-white sm:text-5xl lg:text-6xl">
              AI Powered
              <br />
              Physiotherapy-
              <br />
              Made Simple
            </h1>
            <p className="mt-6 text-base text-slate-200 sm:text-lg lg:text-xl">
              An intelligent digital system that assesses your symptoms, guides your
              tests, and helps your physiotherapists diagnose and treat you faster
            </p>
            <Button
              size="lg"
              className="mt-8 bg-sky-400 px-8 py-6 text-base font-semibold text-white hover:bg-sky-500 sm:px-12 sm:text-lg"
              onClick={() => router.push('/register')}
            >
              Start Your Assessment
            </Button>
          </div>

          {/* Right Image */}
          <div
            className={`transition-all delay-200 duration-700 ${isAnimating ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'}`}
          >
            <div className="relative">
              <div className="bg-primary/20 absolute inset-0 rounded-3xl blur-3xl"></div>
              <div className="relative overflow-hidden rounded-3xl bg-slate-300 shadow-2xl">
                <div className="flex h-full items-center justify-center">
                  <img src="/lpd.jpg" alt="Landing Page Display" className="" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
