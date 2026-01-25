'use client';

import React from 'react';
import { LayoutDashboard, FileText, ClipboardList } from 'lucide-react';
import Sidebar from '@/components/layout/Sidebar';
import { TopNav } from '@/components/layout/TopNav';
import { useSession } from 'next-auth/react';

export default function ClinicianLayout({ children }) {
  const { data: session } = useSession();

  const clinicianLinks = [
    {
      href: '/dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
    },
    {
      href: '#', // Placeholder
      label: 'My Cases',
      icon: ClipboardList,
    },
    {
      href: '#', // Placeholder
      label: 'Reports',
      icon: FileText,
    },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <Sidebar
        links={clinicianLinks}
        user={
          session?.user || { firstName: 'Dr.', lastName: 'Clinician', role: 'CLINICIAN' }
        }
      />

      <div className="flex flex-1 flex-col transition-all duration-300 ease-in-out lg:pl-64">
        <TopNav title="" className="lg:hidden" />{' '}
        {/* Sidebar is visible on desktop, TopNav mainly for mobile trigger or extra actions */}
        {/* On desktop, we might want a TopNav or just header. 
            The Sidebar pushes content. 
            The existing Sidebar component has 'fixed inset-y-0' and logic for mobile.
            It also has 'lg:translate-x-0' so it's always visible on desktop.
            We need to add margin-left to the content to avoid overlap.
            Wait, I added 'lg:pl-64' to the wrapper div.
            Let's check Sidebar css again.
            Sidebar has 'fixed ... w-64'. Yes, so we need padding on content.
        */}
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
