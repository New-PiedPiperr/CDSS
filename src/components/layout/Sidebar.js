'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Settings, HelpCircle, Shield, LogOut, X } from 'lucide-react';
import { cn } from '@/lib/cn';
import { signOut } from 'next-auth/react';
import { useUIStore } from '@/store';

export default function Sidebar({ links = [], secondaryLinks = [], className, user }) {
  const pathname = usePathname();
  const { isSidebarOpen, setSidebarOpen } = useUIStore();

  const defaultSecondaryLinks = [
    { href: '/clinician/settings', label: 'Settings', icon: Settings },
    { href: '/clinician/help', label: 'Help& Center', icon: HelpCircle },
    { href: '/clinician/privacy', label: 'Privacy', icon: Shield },
    { href: '#', label: 'Logout', icon: LogOut, action: true },
  ];

  const secondaryNavLinks =
    secondaryLinks.length > 0 ? secondaryLinks : defaultSecondaryLinks;

  return (
    <>
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-gray-100 bg-white transition-transform duration-300 ease-in-out lg:translate-x-0',
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full',
          className
        )}
      >
        {/* Logo Section */}
        <div className="flex h-24 shrink-0 items-center px-8">
          <Link href="/" className="flex items-center gap-2">
            <div className="relative h-12 w-12">
              <Image
                src="/logo.png"
                alt="CDSS Logo"
                fill
                priority
                className="object-contain"
              />
            </div>
            <span className="text-primary text-xl font-bold tracking-tight">CDSS</span>
          </Link>

          {/* Close Button (Mobile Only) */}
          <button
            className="text-muted-foreground hover:bg-muted hover:text-foreground ml-auto rounded-lg p-2 transition-colors lg:hidden"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close menu"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Primary Navigation Links */}
        <nav className="flex-1 overflow-y-auto px-6 py-4">
          <ul className="space-y-2">
            {links.map((link) => {
              const isActive =
                pathname === link.href ||
                (link.href !== '/clinician/dashboard' && pathname.startsWith(link.href));
              const Icon = link.icon;

              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={cn(
                      'flex items-center gap-4 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200',
                      isActive
                        ? 'text-foreground border border-gray-50 bg-white shadow-[0_4px_20px_rgba(0,0,0,0.08)]'
                        : 'hover:text-foreground text-gray-400 hover:bg-gray-50/50'
                    )}
                    onClick={() => setSidebarOpen(false)}
                  >
                    {Icon && (
                      <Icon
                        className={cn(
                          'h-5 w-5',
                          isActive ? 'text-primary' : 'text-gray-400'
                        )}
                      />
                    )}
                    <span className={isActive ? 'font-bold' : 'font-medium'}>
                      {link.label}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="my-10 h-[1px] w-full" />

          {/* Secondary Navigation Links */}
          <ul className="space-y-2">
            {secondaryNavLinks.map((link) => {
              const Icon = link.icon;

              return (
                <li key={link.label}>
                  {link.action ? (
                    <button
                      className="hover:text-foreground flex w-full cursor-pointer items-center gap-4 rounded-xl px-4 py-3 text-sm font-medium text-gray-400 transition-all hover:bg-gray-50/50"
                      onClick={async () => {
                        setSidebarOpen(false);
                        await signOut({ redirectTo: '/' });
                      }}
                    >
                      {Icon && <Icon className="h-5 w-5" />}
                      <span>{link.label}</span>
                    </button>
                  ) : (
                    <Link
                      href={link.href}
                      className="hover:text-foreground flex items-center gap-4 rounded-xl px-4 py-3 text-sm font-medium text-gray-400 transition-all hover:bg-gray-50/50"
                      onClick={() => setSidebarOpen(false)}
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
        <div className="border-t border-gray-100 p-6">
          <Link
            href="/clinician/profile"
            className="flex items-center gap-4 rounded-xl px-2 py-2 transition-all hover:bg-gray-50"
          >
            <div className="h-10 w-10 shrink-0 overflow-hidden rounded-full bg-gray-200">
              {/* Default Gray Circle as placeholder */}
            </div>
            <div className="flex flex-col overflow-hidden">
              <span className="text-sm font-medium text-gray-400">Profile</span>
              <span className="text-foreground truncate text-sm font-semibold">
                {user ? `${user?.firstName} ${user?.lastName}` : 'Dr. Ajayi'}
              </span>
            </div>
          </Link>
        </div>
      </aside>
    </>
  );
}
