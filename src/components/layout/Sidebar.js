'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Menu, X, Settings, HelpCircle, Shield, LogOut, User } from 'lucide-react';
import { cn } from '@/lib/cn';

function Sidebar({ links = [], secondaryLinks = [], className }) {
  const pathname = usePathname();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const defaultSecondaryLinks = [
    { href: '#', label: 'Settings', icon: Settings },
    { href: '#', label: 'Help & Center', icon: HelpCircle },
    { href: '#', label: 'Privacy', icon: Shield },
    { href: '#', label: 'Logout', icon: LogOut, action: true },
  ];

  const secondaryNavLinks =
    secondaryLinks.length > 0 ? secondaryLinks : defaultSecondaryLinks;

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        className="bg-primary text-primary-foreground fixed top-4 left-4 z-50 rounded-lg p-2 shadow-lg lg:hidden"
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        aria-label="Toggle menu"
      >
        {isMobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'bg-card border-border fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r transition-transform duration-300 lg:translate-x-0',
          isMobileOpen ? 'translate-x-0' : '-translate-x-full',
          className
        )}
      >
        {/* Logo */}
        {/* Logo */}
        <div className="border-border flex h-16 shrink-0 items-center gap-3 border-b px-6">
          <Link href="/" className="flex items-center gap-3">
            <div className="relative h-10 w-10 shrink-0">
              <Image
                src="/logo.png"
                alt="CDSS Logo"
                fill
                priority
                className="object-contain"
                sizes="40px"
              />
            </div>
            <span className="text-primary text-xl font-bold tracking-tight">CDSS</span>
          </Link>
        </div>

        {/* Primary Navigation Links */}
        <nav className="flex-1 overflow-y-auto px-4 py-2">
          <ul className="space-y-1">
            {links.map((link) => {
              const isActive =
                pathname === link.href || pathname.startsWith(`${link.href}/`);
              const Icon = link.icon;

              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={cn(
                      'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                    )}
                    onClick={() => setIsMobileOpen(false)}
                  >
                    {Icon && <Icon className="h-5 w-5" />}
                    <span>{link.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Divider */}
          <div className="border-border my-4 border-t" />

          {/* Secondary Navigation Links */}
          <ul className="space-y-1">
            {secondaryNavLinks.map((link) => {
              const Icon = link.icon;

              return (
                <li key={link.label}>
                  {link.action ? (
                    <button
                      className="text-muted-foreground hover:bg-muted hover:text-foreground flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors"
                      onClick={() => {
                        setIsMobileOpen(false);
                        // Handle logout or other actions
                      }}
                    >
                      {Icon && <Icon className="h-5 w-5" />}
                      <span>{link.label}</span>
                    </button>
                  ) : (
                    <Link
                      href={link.href}
                      className="text-muted-foreground hover:bg-muted hover:text-foreground flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors"
                      onClick={() => setIsMobileOpen(false)}
                    >
                      {Icon && <Icon className="h-5 w-5" />}
                      <span>{link.label}</span>
                    </Link>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Profile Section */}
        <div className="border-border border-t p-4">
          <Link
            href="#"
            className="hover:bg-muted flex items-center gap-3 rounded-lg px-3 py-2 transition-colors"
          >
            <div className="bg-muted flex h-10 w-10 items-center justify-center rounded-full">
              <User className="text-muted-foreground h-5 w-5" />
            </div>
            <span className="text-foreground text-sm font-medium">Profile</span>
          </Link>
        </div>
      </aside>
    </>
  );
}

export { Sidebar };
