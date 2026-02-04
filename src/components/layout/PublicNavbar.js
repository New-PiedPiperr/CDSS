'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';
import { Menu, X, Sun, Moon, LogIn } from 'lucide-react';
import { cn } from '@/lib/cn';
import { ThemeToggle, Button } from '@/components/ui';

export function PublicNavbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setIsDark(
      darkModeQuery.matches || document.documentElement.classList.contains('dark')
    );
  }, []);

  const toggleTheme = () => {
    document.documentElement.classList.toggle('dark');
    setIsDark(!isDark);
  };

  const navLinks = [
    { name: 'The Challenge', href: '/#problem', id: 'problem' },
    { name: 'Our Approach', href: '/#solution', id: 'solution' },
    { name: 'How It Works', href: '/#how-it-works', id: 'how-it-works' },
    { name: 'Why Africa', href: '/#africa', id: 'africa' },
  ];

  const handleLinkClick = (e, href, id) => {
    if (pathname === '/' && id) {
      e.preventDefault();
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
    setIsMenuOpen(false);
  };

  return (
    <nav className="border-border/50 bg-background/80 fixed top-0 right-0 left-0 z-50 border-b backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <div className="relative h-8 w-24 sm:h-10 sm:w-32">
              <Image
                src="/logo.png"
                alt="CDSS - Clinical Decision Support System"
                fill
                className="object-contain object-left"
                priority
              />
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden items-center gap-6 md:flex lg:gap-8">
            <Link
              href="/"
              className="text-muted-foreground hover:text-primary text-sm font-medium transition-colors"
            >
              Home
            </Link>
            {navLinks.map((link) => (
              <a
                key={link.id}
                href={link.href}
                onClick={(e) => handleLinkClick(e, link.href, link.id)}
                className="text-muted-foreground hover:text-primary text-sm font-medium transition-colors"
              >
                {link.name}
              </a>
            ))}
          </div>

          {/* Right side actions */}
          <div className="hidden items-center gap-4 md:flex">
            <ThemeToggle />
            <Link
              href="/login"
              className="text-muted-foreground hover:text-foreground text-sm font-medium transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/register"
              className="from-primary hover:from-primary/90 shadow-primary/25 hover:shadow-primary/30 rounded-full bg-gradient-to-r to-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg transition-all hover:to-blue-600/90 hover:shadow-xl"
            >
              Get Started
            </Link>
          </div>

          {/* Mobile Hamburger Button */}
          <div className="flex items-center gap-3 md:hidden">
            <ThemeToggle />
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-muted-foreground hover:text-primary flex h-9 w-9 items-center justify-center rounded-lg transition-all"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <div
        className={cn(
          'bg-background/95 fixed inset-x-0 top-16 bottom-0 z-40 block border-t backdrop-blur-xl transition-all duration-300 md:hidden',
          isMenuOpen
            ? 'translate-y-0 opacity-100'
            : 'pointer-events-none -translate-y-full opacity-0'
        )}
      >
        <div className="flex max-h-[calc(100vh-64px)] flex-col space-y-4 overflow-y-auto p-6">
          <Link
            href="/"
            onClick={() => setIsMenuOpen(false)}
            className="text-foreground hover:text-primary border-border/50 border-b pb-2 text-lg font-semibold transition-colors"
          >
            Home
          </Link>
          {navLinks.map((link) => (
            <a
              key={link.id}
              href={link.href}
              onClick={(e) => handleLinkClick(e, link.href, link.id)}
              className="text-foreground hover:text-primary border-border/50 border-b pb-2 text-lg font-semibold transition-colors"
            >
              {link.name}
            </a>
          ))}
          <div className="flex flex-col gap-4 pt-4">
            <Link
              href="/login"
              onClick={() => setIsMenuOpen(false)}
              className="text-muted-foreground hover:text-foreground text-center text-lg font-medium transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/register"
              onClick={() => setIsMenuOpen(false)}
              className="from-primary hover:from-primary/90 shadow-primary/25 hover:shadow-primary/30 rounded-xl bg-gradient-to-r to-blue-600 px-6 py-4 text-center text-lg font-bold text-white shadow-lg transition-all hover:to-blue-600/90"
            >
              Get Started
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
