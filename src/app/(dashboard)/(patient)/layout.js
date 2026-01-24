'use client';

import {
  LayoutDashboard,
  ClipboardPlus,
  FlaskConical,
  TrendingUp,
  MessageSquare,
  Bell,
} from 'lucide-react';
import { Sidebar, TopNav } from '@/components/layout';

const patientLinks = [
  { href: '/patient/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/patient/assessment', label: 'New assessment', icon: ClipboardPlus },
  { href: '/patient/self-test', label: 'Guided Self Test', icon: FlaskConical },
  { href: '/patient/progress', label: 'Progress', icon: TrendingUp },
  { href: '/patient/messages', label: 'Messages', icon: MessageSquare },
  { href: '/patient/notifications', label: 'Notifications', icon: Bell },
];

export default function PatientLayout({ children }) {
  return (
    <>
      <Sidebar links={patientLinks} />
      <div className="lg:pl-64">
        <TopNav title="User's Dashboard" />
        <main className="p-4 lg:p-6">{children}</main>
      </div>
    </>
  );
}
