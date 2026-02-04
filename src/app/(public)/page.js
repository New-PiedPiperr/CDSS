'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowRight,
  CheckCircle,
  Stethoscope,
  Users,
  BookOpen,
  Shield,
  ChevronRight,
  Activity,
  Target,
  Microscope,
  GraduationCap,
  Moon,
  Sun,
} from 'lucide-react';

/**
 * CDSS Landing Page
 * ==================
 * A world-class landing page for the Clinical Decision Support System
 * for Musculoskeletal Diagnosis, designed for African healthcare.
 *
 * Design Principles:
 * - Credible, modern, human, and African
 * - Uses the site's existing color system (primary blue)
 * - Supports both light and dark themes
 * - Clean typography, plenty of white space
 * - Confident but humble tone
 */

export default function LandingPage() {
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(false);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    // Check for dark mode preference
    const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setIsDark(
      darkModeQuery.matches || document.documentElement.classList.contains('dark')
    );

    const handleChange = (e) => setIsDark(e.matches);
    darkModeQuery.addEventListener('change', handleChange);
    return () => darkModeQuery.removeEventListener('change', handleChange);
  }, []);

  const toggleTheme = () => {
    document.documentElement.classList.toggle('dark');
    setIsDark(!isDark);
  };

  // Redirect authenticated users to their dashboard
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
    <div className="bg-background text-foreground min-h-screen">
      {/* ============================================
          NAVIGATION
          ============================================ */}
      <nav className="border-border bg-background/95 fixed top-0 right-0 left-0 z-50 border-b backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="bg-primary flex h-9 w-9 items-center justify-center rounded-xl">
                <Activity className="h-5 w-5 text-white" />
              </div>
              <span className="text-lg font-bold">CDSS</span>
            </div>
            <div className="hidden items-center gap-8 md:flex">
              <a
                href="#problem"
                className="text-muted-foreground hover:text-foreground text-sm font-medium transition-colors"
              >
                The Challenge
              </a>
              <a
                href="#solution"
                className="text-muted-foreground hover:text-foreground text-sm font-medium transition-colors"
              >
                Our Approach
              </a>
              <a
                href="#how-it-works"
                className="text-muted-foreground hover:text-foreground text-sm font-medium transition-colors"
              >
                How It Works
              </a>
              <a
                href="#africa"
                className="text-muted-foreground hover:text-foreground text-sm font-medium transition-colors"
              >
                Why Africa
              </a>
            </div>
            <div className="flex items-center gap-4">
              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="text-muted-foreground hover:text-foreground flex h-9 w-9 items-center justify-center rounded-lg transition-colors"
                aria-label="Toggle theme"
              >
                {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </button>
              <Link
                href="/login"
                className="text-muted-foreground hover:text-foreground text-sm font-medium transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                className="bg-primary hover:bg-primary/90 rounded-full px-5 py-2.5 text-sm font-semibold text-white transition-all"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* ============================================
          HERO SECTION
          A powerful introduction that explains what 
          the system does in plain language.
          ============================================ */}
      <section className="relative overflow-hidden pt-16">
        {/* Subtle gradient background */}
        <div className="bg-muted/30 absolute inset-0" />

        <div className="relative mx-auto max-w-7xl px-6 py-24 lg:px-8 lg:py-32">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            {/* Hero Content */}
            <div
              className={`transition-all duration-1000 ${
                isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
              }`}
            >
              <div className="bg-primary/10 text-primary mb-6 inline-flex items-center gap-2 rounded-full px-4 py-2">
                <span className="bg-primary h-2 w-2 rounded-full" />
                <span className="text-sm font-medium">
                  Clinical Decision Support for Africa
                </span>
              </div>

              <h1 className="text-4xl leading-tight font-bold tracking-tight sm:text-5xl lg:text-6xl">
                Better diagnosis starts with{' '}
                <span className="text-primary">better questions</span>
              </h1>

              <p className="text-muted-foreground mt-6 text-lg leading-relaxed sm:text-xl">
                A clinical decision support system that guides musculoskeletal diagnosis
                through structured clinical reasoning. Built by African clinicians, for
                African healthcare realities.
              </p>

              <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
                <Link
                  href="/register"
                  className="bg-primary hover:bg-primary/90 group inline-flex items-center justify-center gap-2 rounded-full px-8 py-4 text-base font-semibold text-white transition-all"
                >
                  Start Your Assessment
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
                <a
                  href="#how-it-works"
                  className="text-muted-foreground hover:text-foreground inline-flex items-center justify-center gap-2 px-4 py-4 text-base font-medium transition-colors"
                >
                  See how it works
                  <ChevronRight className="h-4 w-4" />
                </a>
              </div>

              {/* Trust indicators */}
              <div className="border-border mt-12 flex items-center gap-6 border-t pt-8">
                <div className="text-center">
                  <p className="text-2xl font-bold">39+</p>
                  <p className="text-muted-foreground text-sm">Conditions covered</p>
                </div>
                <div className="bg-border h-8 w-px" />
                <div className="text-center">
                  <p className="text-2xl font-bold">150+</p>
                  <p className="text-muted-foreground text-sm">
                    Clinical tests referenced
                  </p>
                </div>
                <div className="bg-border h-8 w-px" />
                <div className="text-center">
                  <p className="text-2xl font-bold">5</p>
                  <p className="text-muted-foreground text-sm">Body regions</p>
                </div>
              </div>
            </div>

            {/* Hero Image */}
            <div
              className={`transition-all delay-300 duration-1000 ${
                isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
              }`}
            >
              <div className="relative">
                <div className="bg-primary/10 absolute -inset-4 rounded-3xl blur-2xl" />
                <div className="relative overflow-hidden rounded-3xl shadow-2xl">
                  <Image
                    src="/images/hero-clinician.png"
                    alt="African physiotherapist conducting a shoulder examination in a modern clinic with warm earth-toned walls and traditional African artwork"
                    width={600}
                    height={600}
                    className="aspect-square object-cover"
                    priority
                  />
                </div>
                {/* Floating card */}
                <div className="bg-card border-border absolute -bottom-6 -left-6 rounded-2xl border p-4 shadow-xl">
                  <div className="flex items-center gap-3">
                    <div className="bg-primary/10 flex h-12 w-12 items-center justify-center rounded-xl">
                      <Stethoscope className="text-primary h-6 w-6" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold">Evidence-based</p>
                      <p className="text-muted-foreground text-xs">Clinical guidance</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================
          THE PROBLEM
          Diagnostic challenges clinicians face today.
          ============================================ */}
      <section id="problem" className="bg-card py-24 lg:py-32 dark:bg-gray-900">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              The diagnostic challenge
            </h2>
            <p className="text-muted-foreground mt-6 text-lg leading-relaxed">
              Musculoskeletal conditions are among the most common reasons patients seek
              care. Yet getting the diagnosis right remains difficult, especially in
              resource-constrained settings.
            </p>
          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-3">
            {/* Challenge 1 */}
            <div className="bg-background border-border rounded-2xl border p-8 dark:bg-gray-800/50">
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-500/10">
                <Target className="h-7 w-7 text-red-500 dark:text-red-400" />
              </div>
              <h3 className="text-xl font-semibold">Misdiagnosis is common</h3>
              <p className="text-muted-foreground mt-4">
                Without structured assessment tools, conditions are often misidentified. A
                shoulder impingement becomes a rotator cuff tear. Sciatica becomes
                non-specific back pain. Patients receive generic treatment instead of
                targeted care.
              </p>
            </div>

            {/* Challenge 2 */}
            <div className="bg-background border-border rounded-2xl border p-8 dark:bg-gray-800/50">
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-500/10">
                <BookOpen className="h-7 w-7 text-amber-500 dark:text-amber-400" />
              </div>
              <h3 className="text-xl font-semibold">Clinical knowledge is uneven</h3>
              <p className="text-muted-foreground mt-4">
                Not every clinician has the same training or access to continuing
                education. A physiotherapist in Lagos may have different resources than
                one in a rural clinic. Decision support can bridge this gap.
              </p>
            </div>

            {/* Challenge 3 */}
            <div className="bg-background border-border rounded-2xl border p-8 dark:bg-gray-800/50">
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-500/10">
                <Microscope className="h-7 w-7 text-blue-500 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold">Imaging is not always available</h3>
              <p className="text-muted-foreground mt-4">
                MRI and advanced imaging are expensive and often inaccessible. Clinicians
                need better tools to reach accurate provisional diagnoses through thorough
                clinical examination, not just technology.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================
          THE SOLUTION
          Clear explanation of what we offer.
          ============================================ */}
      <section id="solution" className="bg-background py-24 lg:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid items-center gap-16 lg:grid-cols-2">
            {/* Image */}
            <div className="order-2 lg:order-1">
              <div className="relative">
                <div className="bg-primary/5 absolute -inset-4 rounded-3xl blur-xl" />
                <div className="relative overflow-hidden rounded-3xl shadow-xl">
                  <Image
                    src="/images/medical-education.png"
                    alt="African medical students collaborating around a digital learning tool in a training facility"
                    width={600}
                    height={600}
                    className="aspect-square object-cover"
                  />
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="order-1 lg:order-2">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                A structured path to diagnosis
              </h2>
              <p className="text-muted-foreground mt-6 text-lg leading-relaxed">
                Our Clinical Decision Support System guides you through musculoskeletal
                assessment step by step. It asks the right questions, suggests relevant
                clinical tests, and helps you reach a well-reasoned provisional diagnosis.
              </p>

              <div className="mt-10 space-y-6">
                <div className="flex gap-4">
                  <div className="bg-primary/10 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl">
                    <CheckCircle className="text-primary h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Systematic questioning</h3>
                    <p className="text-muted-foreground mt-1">
                      Guided questions based on presenting symptoms, history, and clinical
                      patterns.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="bg-primary/10 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl">
                    <CheckCircle className="text-primary h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Clinical test recommendations</h3>
                    <p className="text-muted-foreground mt-1">
                      Relevant physical examination tests with clear procedures and
                      interpretation guidance.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="bg-primary/10 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl">
                    <CheckCircle className="text-primary h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Differential diagnosis support</h3>
                    <p className="text-muted-foreground mt-1">
                      Condition likelihood analysis based on clinical findings, not
                      guesswork.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="bg-primary/10 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl">
                    <CheckCircle className="text-primary h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Red flag detection</h3>
                    <p className="text-muted-foreground mt-1">
                      Automatic identification of warning signs that require urgent
                      attention or referral.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================
          HOW IT WORKS
          Simple flow explanation.
          ============================================ */}
      <section id="how-it-works" className="bg-muted/50 py-24 lg:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              How it works
            </h2>
            <p className="text-muted-foreground mt-6 text-lg">
              From first symptom to clinical assessment in four steps.
            </p>
          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-4">
            {/* Step 1 */}
            <div className="relative">
              <div className="bg-primary/10 flex h-16 w-16 items-center justify-center rounded-2xl">
                <span className="text-primary text-2xl font-bold">1</span>
              </div>
              <h3 className="mt-6 text-lg font-semibold">Select body region</h3>
              <p className="text-muted-foreground mt-2">
                Choose the affected area: cervical, lumbar, shoulder, elbow, or ankle.
              </p>
              <div className="from-primary/20 absolute top-8 left-20 hidden h-px w-full bg-gradient-to-r to-transparent md:block" />
            </div>

            {/* Step 2 */}
            <div className="relative">
              <div className="bg-primary/10 flex h-16 w-16 items-center justify-center rounded-2xl">
                <span className="text-primary text-2xl font-bold">2</span>
              </div>
              <h3 className="mt-6 text-lg font-semibold">Answer guided questions</h3>
              <p className="text-muted-foreground mt-2">
                Respond to clinically relevant questions about symptoms, history, and
                aggravating factors.
              </p>
              <div className="from-primary/20 absolute top-8 left-20 hidden h-px w-full bg-gradient-to-r to-transparent md:block" />
            </div>

            {/* Step 3 */}
            <div className="relative">
              <div className="bg-primary/10 flex h-16 w-16 items-center justify-center rounded-2xl">
                <span className="text-primary text-2xl font-bold">3</span>
              </div>
              <h3 className="mt-6 text-lg font-semibold">Review clinical tests</h3>
              <p className="text-muted-foreground mt-2">
                Get recommendations for physical examination tests with step-by-step
                procedures.
              </p>
              <div className="from-primary/20 absolute top-8 left-20 hidden h-px w-full bg-gradient-to-r to-transparent md:block" />
            </div>

            {/* Step 4 */}
            <div>
              <div className="bg-primary flex h-16 w-16 items-center justify-center rounded-2xl">
                <span className="text-2xl font-bold text-white">4</span>
              </div>
              <h3 className="mt-6 text-lg font-semibold">Receive clinical guidance</h3>
              <p className="text-muted-foreground mt-2">
                Get a provisional assessment with differential diagnoses and next-step
                recommendations.
              </p>
            </div>
          </div>

          {/* Important note */}
          <div className="border-warning/30 bg-warning/10 mx-auto mt-16 max-w-2xl rounded-2xl border p-6">
            <div className="flex gap-4">
              <div className="bg-warning/20 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl">
                <Shield className="text-warning h-5 w-5" />
              </div>
              <div>
                <h4 className="font-semibold">Clinical oversight required</h4>
                <p className="text-muted-foreground mt-1 text-sm">
                  This system supports clinical decision-making. It does not replace
                  professional judgment. All assessments should be reviewed by a qualified
                  healthcare provider.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================
          WHY AFRICA
          Local context and relevance.
          ============================================ */}
      <section id="africa" className="bg-background py-24 lg:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Designed for African healthcare
            </h2>
            <p className="text-muted-foreground mt-6 text-lg">
              This is not a system built elsewhere and adapted later. It was designed from
              the ground up with the realities of African clinical practice in mind.
            </p>
          </div>

          <div className="mt-16 grid gap-12 lg:grid-cols-3">
            {/* Context 1 */}
            <div className="text-center">
              <div className="bg-primary/10 mx-auto flex h-16 w-16 items-center justify-center rounded-2xl">
                <GraduationCap className="text-primary h-8 w-8" />
              </div>
              <h3 className="mt-6 text-xl font-semibold">Training support</h3>
              <p className="text-muted-foreground mt-4">
                For students and early-career clinicians who need structured guidance
                while building their diagnostic confidence.
              </p>
            </div>

            {/* Context 2 */}
            <div className="text-center">
              <div className="bg-primary/10 mx-auto flex h-16 w-16 items-center justify-center rounded-2xl">
                <Users className="text-primary h-8 w-8" />
              </div>
              <h3 className="mt-6 text-xl font-semibold">High patient volumes</h3>
              <p className="text-muted-foreground mt-4">
                Clinicians often see many patients with limited time. Structured decision
                support helps maintain diagnostic quality under pressure.
              </p>
            </div>

            {/* Context 3 */}
            <div className="text-center">
              <div className="bg-primary/10 mx-auto flex h-16 w-16 items-center justify-center rounded-2xl">
                <Stethoscope className="text-primary h-8 w-8" />
              </div>
              <h3 className="mt-6 text-xl font-semibold">Clinical examination focus</h3>
              <p className="text-muted-foreground mt-4">
                When imaging is not available, thorough clinical examination becomes
                essential. This system emphasizes hands-on assessment.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================
          TRUST & CREDIBILITY
          Evidence-based approach.
          ============================================ */}
      <section className="bg-muted/50 py-24 lg:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid items-center gap-16 lg:grid-cols-2">
            <div>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Built on clinical evidence
              </h2>
              <p className="text-muted-foreground mt-6 text-lg leading-relaxed">
                Every question, every test recommendation, and every diagnostic pathway in
                this system is grounded in established clinical literature and best
                practices.
              </p>

              <div className="mt-10 space-y-6">
                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full">
                    <CheckCircle className="text-primary h-4 w-4" />
                  </div>
                  <p className="text-muted-foreground">
                    <span className="text-foreground font-semibold">
                      Peer-reviewed sources.
                    </span>{' '}
                    Clinical guidelines and research inform our decision logic.
                  </p>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full">
                    <CheckCircle className="text-primary h-4 w-4" />
                  </div>
                  <p className="text-muted-foreground">
                    <span className="text-foreground font-semibold">
                      Developed with clinicians.
                    </span>{' '}
                    African physiotherapists and healthcare educators contributed to the
                    content.
                  </p>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full">
                    <CheckCircle className="text-primary h-4 w-4" />
                  </div>
                  <p className="text-muted-foreground">
                    <span className="text-foreground font-semibold">
                      Continuous improvement.
                    </span>{' '}
                    The system is regularly reviewed and updated based on clinical
                    feedback.
                  </p>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full">
                    <CheckCircle className="text-primary h-4 w-4" />
                  </div>
                  <p className="text-muted-foreground">
                    <span className="text-foreground font-semibold">
                      Transparent reasoning.
                    </span>{' '}
                    Every suggestion includes the clinical rationale behind it.
                  </p>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="bg-card border-border rounded-3xl border p-8 shadow-xl lg:p-12">
              <h3 className="text-lg font-semibold">System coverage</h3>
              <div className="mt-8 space-y-6">
                <div>
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">Cervical Region</span>
                    <span className="text-muted-foreground">2 conditions</span>
                  </div>
                  <div className="bg-muted mt-2 h-2 overflow-hidden rounded-full">
                    <div className="bg-primary h-full w-1/5 rounded-full" />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">Lumbar Region</span>
                    <span className="text-muted-foreground">6 conditions</span>
                  </div>
                  <div className="bg-muted mt-2 h-2 overflow-hidden rounded-full">
                    <div className="bg-primary h-full w-2/5 rounded-full" />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">Shoulder Region</span>
                    <span className="text-muted-foreground">9 conditions</span>
                  </div>
                  <div className="bg-muted mt-2 h-2 overflow-hidden rounded-full">
                    <div className="bg-primary h-full w-3/5 rounded-full" />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">Elbow Region</span>
                    <span className="text-muted-foreground">5 conditions</span>
                  </div>
                  <div className="bg-muted mt-2 h-2 overflow-hidden rounded-full">
                    <div className="bg-primary h-full w-1/3 rounded-full" />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">Ankle Region</span>
                    <span className="text-muted-foreground">17 conditions</span>
                  </div>
                  <div className="bg-muted mt-2 h-2 overflow-hidden rounded-full">
                    <div className="bg-primary h-full w-full rounded-full" />
                  </div>
                </div>
              </div>
              <p className="text-muted-foreground mt-8 text-sm">
                Additional body regions and conditions are in development.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================
          CALL TO ACTION
          Clear next step.
          ============================================ */}
      <section className="bg-primary py-24 lg:py-32">
        <div className="mx-auto max-w-7xl px-6 text-center lg:px-8">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Ready to improve your diagnostic process?
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-white/80">
            Create an account to access the clinical decision support system. Whether you
            are a patient seeking assessment or a clinician looking for decision support,
            we are here to help.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/register"
              className="text-primary hover:bg-primary-foreground/90 group inline-flex items-center justify-center gap-2 rounded-full bg-white px-8 py-4 text-base font-semibold transition-all"
            >
              Create an Account
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-white/30 px-8 py-4 text-base font-semibold text-white transition-all hover:bg-white/10"
            >
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* ============================================
          FOOTER
          Simple, professional footer.
          ============================================ */}
      <footer className="border-border bg-card border-t py-12">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
            <div className="flex items-center gap-2">
              <div className="bg-primary flex h-8 w-8 items-center justify-center rounded-lg">
                <Activity className="h-4 w-4 text-white" />
              </div>
              <span className="font-bold">CDSS</span>
              <span className="text-muted-foreground text-sm">
                Clinical Decision Support System
              </span>
            </div>
            <div className="text-muted-foreground flex items-center gap-8 text-sm">
              <Link href="/login" className="hover:text-foreground">
                Sign In
              </Link>
              <Link href="/register" className="hover:text-foreground">
                Register
              </Link>
            </div>
          </div>
          <div className="border-border text-muted-foreground mt-8 border-t pt-8 text-center text-sm">
            <p>
              © {new Date().getFullYear()} Clinical Decision Support System. Designed for
              African healthcare professionals.
            </p>
            <p className="mt-2 text-xs opacity-60">
              This system provides decision support only and does not replace professional
              medical judgment.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
