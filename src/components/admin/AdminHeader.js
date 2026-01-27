'use client';

import { Search, Bell, User } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { ThemeToggle } from '@/components/ui';
import Image from 'next/image';

export default function AdminHeader() {
  const { data: session } = useSession();

  return (
    <header className="fixed right-0 top-0 z-40 flex h-20 left-64 items-center justify-between border-b border-gray-100 bg-white/80 px-8 backdrop-blur-md dark:border-gray-800 dark:bg-gray-900/80">
      <div className="flex flex-1 items-center gap-8">
        <h1 className="whitespace-nowrap text-xl font-bold tracking-tight text-gray-900 dark:text-white">
          Welcome Back, Admin!
        </h1>

        {/* Search Bar */}
        <div className="relative w-full max-w-2xl">
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search Therapists/Patients Name..."
            className="h-12 w-full rounded-2xl border border-gray-100 bg-gray-50 pl-12 pr-4 text-sm outline-none transition-all focus:border-primary/50 focus:ring-4 focus:ring-primary/5 dark:border-gray-800 dark:bg-gray-800/50"
          />
        </div>
      </div>

      <div className="ml-8 flex items-center gap-6">
        <ThemeToggle />
        
        <button className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gray-50 text-gray-500 transition-colors hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-400">
          <Bell className="h-5 w-5" />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500 border-2 border-white dark:border-gray-900"></span>
        </button>

        {/* Profile Avatar */}
        <div className="flex items-center gap-3">
          <div className="hidden text-right lg:block">
            <p className="text-sm font-bold text-gray-900 dark:text-white">
              {session?.user?.firstName} {session?.user?.lastName}
            </p>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Super Admin
            </p>
          </div>
          <button className="h-12 w-12 overflow-hidden rounded-2xl border-2 border-primary/10 shadow-sm transition-transform hover:scale-105">
            {session?.user?.avatar ? (
              <Image
                src={session.user.avatar}
                alt="Admin Avatar"
                width={48}
                height={48}
                className="object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-primary text-lg font-black text-white">
                {session?.user?.firstName?.[0] || 'A'}
              </div>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
