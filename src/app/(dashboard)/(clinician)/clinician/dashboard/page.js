'use client';

import React from 'react';
import {
  Users,
  FileText,
  Calendar,
  Activity,
  ArrowUpRight,
  ClipboardList,
} from 'lucide-react';
import PatientQueue from '@/components/dashboard/PatientQueue';
import ClinicianHero from '@/components/dashboard/clinician/ClinicianHero';
import ClinicianQuickActions from '@/components/dashboard/clinician/ClinicianQuickActions';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  Badge,
  Button,
} from '@/components/ui';

import FloatingIssue from '@/components/dashboard/clinician/FloatingIssue';

export default function ClinicianDashboardPage() {
  // Mock data for stats
  const stats = [
    {
      label: 'Total Patients',
      value: '24',
      icon: Users,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
      borderColor: 'border-l-primary',
    },
    {
      label: 'Pending Review',
      value: '12',
      icon: FileText,
      color: 'text-indigo-500',
      bgColor: 'bg-indigo-500/10',
      borderColor: 'border-l-indigo-500',
    },
    {
      label: 'Urgent Cases',
      value: '03',
      icon: Activity,
      color: 'text-emerald-500',
      bgColor: 'bg-emerald-500/10',
      borderColor: 'border-l-emerald-500',
    },
  ];

  const latestPatient = {
    id: '1',
    name: 'Bola Ahmed Tinubu',
    region: 'Lower Back',
  };

  return (
    <div className="animate-fade-in space-y-6 pb-20">
      {/* Header Info */}
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h2 className="text-2xl font-black tracking-tight">Dashboard Overview</h2>
          <p className="text-muted-foreground text-sm font-medium">
            Monitor patient progress and manage clinical tasks efficiently.
          </p>
        </div>
      </div>

      {/* Stats Cards Row */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {stats.map((stat, i) => (
          <Card key={i} className={`${stat.borderColor} border-l-4`}>
            <CardContent className="flex items-center gap-4 p-6">
              <div className={`${stat.bgColor} rounded-xl p-3`}>
                <stat.icon className={`${stat.color} h-6 w-6`} />
              </div>
              <div>
                <p className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
                  {stat.label}
                </p>
                <h3 className="text-2xl font-black">{stat.value}</h3>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-12">
        {/* Left Section: Main Highlights */}
        <div className="space-y-6 md:col-span-8">
          <ClinicianHero latestPatient={latestPatient} />

          {/* Patient Queue / Recent Activity */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <div>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <ClipboardList className="text-primary h-5 w-5" />
                  Upcoming Patient Appointments
                </CardTitle>
                <CardDescription>
                  Your scheduled sessions for today and upcoming days
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <PatientQueue />
            </CardContent>
          </Card>
        </div>

        {/* Right Section: Actions & Schedule */}
        <div className="space-y-6 md:col-span-4">
          <ClinicianQuickActions />

          {/* Today's Schedule Mini-Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Today's Timeline</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                {
                  time: '09:00 AM',
                  event: 'New Patient Assessment',
                  patient: 'Lekan Salami',
                },
                { time: '11:30 AM', event: 'Follow-up Session', patient: 'Mary Okoro' },
                { time: '02:00 PM', event: 'Case Review', patient: 'Internal' },
              ].map((item, idx) => (
                <div key={idx} className="relative flex items-start gap-4 pb-4 last:pb-0">
                  {idx !== 2 && (
                    <div className="bg-border absolute top-[30px] bottom-0 left-[15px] w-[2px]" />
                  )}
                  <div className="bg-primary/20 z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full">
                    <div className="bg-primary h-2 w-2 rounded-full" />
                  </div>
                  <div>
                    <p className="text-primary text-xs font-bold">{item.time}</p>
                    <p className="text-sm font-bold">{item.event}</p>
                    <p className="text-muted-foreground text-xs">{item.patient}</p>
                  </div>
                </div>
              ))}
              <Button variant="outline" className="mt-2 w-full text-xs font-bold">
                View Full Calendar
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      <FloatingIssue count={1} />
    </div>
  );
}
