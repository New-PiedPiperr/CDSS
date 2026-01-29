'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { User, Shield, Stethoscope, Clock, Bell, Lock } from 'lucide-react';

const sidebarNavItems = [
  {
    title: 'Profile',
    href: '/clinician/settings/profile',
    icon: User,
  },
  {
    title: 'Professional',
    href: '/clinician/settings/professional',
    icon: Shield,
  },
  {
    title: 'Clinical',
    href: '/clinician/settings/clinical',
    icon: Stethoscope,
  },
  {
    title: 'Availability',
    href: '/clinician/settings/availability',
    icon: Clock,
  },
  {
    title: 'Notifications',
    href: '/clinician/settings/notifications',
    icon: Bell,
  },
  {
    title: 'Security',
    href: '/clinician/settings/security',
    icon: Lock,
  },
];

function SidebarNav({ className, items, ...props }) {
  const pathname = usePathname();

  return (
    <nav
      className={cn('flex space-x-2 lg:flex-col lg:space-y-1 lg:space-x-0', className)}
      {...props}
    >
      {items.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href;

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'hover:text-primary flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-all',
              isActive
                ? 'bg-primary/10 text-primary hover:bg-primary/20'
                : 'text-muted-foreground hover:bg-muted'
            )}
          >
            <Icon className="h-4 w-4" />
            {item.title}
          </Link>
        );
      })}
    </nav>
  );
}

export default function SettingsLayout({ children }) {
  return (
    <div className="space-y-6 p-10 pb-16 md:block">
      <div className="space-y-0.5">
        <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
        <p className="text-muted-foreground">
          Manage your account settings and preferences.
        </p>
      </div>
      <div className="my-6 border-b" />
      <div className="flex flex-col space-y-8 lg:flex-row lg:space-y-0 lg:space-x-12">
        <aside className="-mx-4 lg:w-1/5">
          <SidebarNav items={sidebarNavItems} />
        </aside>
        <div className="flex-1 lg:max-w-3xl">{children}</div>
      </div>
    </div>
  );
}
