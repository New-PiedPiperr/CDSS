'use client';

import {
  LayoutDashboard,
  Users,
  FolderOpen,
  Compass,
  ClipboardList,
  FileOutput,
  MessageSquare,
  Bell,
} from 'lucide-react';
import { Sidebar, TopNav } from '@/components/layout';

const clinicianLinks = [
  { href: '/clinician/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/clinician/patients', label: 'Patient List', icon: Users },
  { href: '/clinician/cases', label: 'Case View', icon: FolderOpen },
  { href: '/clinician/diagnostic', label: 'Guided Diagnostic Mode', icon: Compass },
  { href: '/clinician/treatment', label: 'Treatment Planner', icon: ClipboardList },
  { href: '/clinician/referral', label: 'Referral or Order', icon: FileOutput },
  { href: '/clinician/messages', label: 'Messages', icon: MessageSquare },
  { href: '/clinician/notifications', label: 'Notifications', icon: Bell },
];

export default function ClinicianLayout({ children }) {
  return (
    <div className="bg-background min-h-screen">
      <Sidebar links={clinicianLinks} />

      <div className="lg:pl-64">
        <TopNav title="Therapist's Dashboard" />

        <main className="p-4 lg:p-6">{children}</main>
      </div>
    </div>
  );
}
