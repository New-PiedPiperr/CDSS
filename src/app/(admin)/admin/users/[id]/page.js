import React from 'react';
import Link from 'next/link';
import mongoose from 'mongoose';
import connectDB from '@/lib/db/connect';
import User, { ROLES } from '@/models/User';
import DiagnosisSession from '@/models/DiagnosisSession';
import PatientProfile from '@/models/PatientProfile';
import AdminUserDetailClient from '@/components/admin/AdminUserDetailClient';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ArrowLeft, UserX } from 'lucide-react';

export const metadata = {
  title: 'User Profile & Case Files | CDSS Admin',
  description: 'View patient case files, diagnostic history, and profile management',
};

export default async function AdminUserDetailPage({ params }) {
  const { id } = await params;

  // Validate ObjectId
  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    return <UserNotFound id={id} />;
  }

  await connectDB();

  // Fetch the user
  const userRaw = await User.findById(id).select('-password').lean();
  if (!userRaw) {
    return <UserNotFound id={id} />;
  }

  // Fetch sessions for this user (either as patient or clinician)
  const isClinician = userRaw.role === ROLES.CLINICIAN;
  const sessionsQuery = isClinician ? { clinicianId: id } : { patientId: id };

  const sessionsRaw = await DiagnosisSession.find(sessionsQuery)
    .populate('clinicianId', 'firstName lastName email avatar specialization professional')
    .populate('patientId', 'firstName lastName email avatar phone gender')
    .sort({ createdAt: -1 })
    .lean();

  // Fetch all active clinicians for assignment actions
  const cliniciansRaw = await User.find({ role: ROLES.CLINICIAN, isActive: true })
    .select('firstName lastName avatar specialization')
    .lean();

  // Fetch patient profile if patient
  let patientProfileRaw = null;
  if (!isClinician) {
    patientProfileRaw = await PatientProfile.findOne({ userId: id }).lean();
  }

  // Safe RSC serialization
  const user = JSON.parse(JSON.stringify(userRaw));
  const sessions = JSON.parse(JSON.stringify(sessionsRaw));
  const clinicians = JSON.parse(JSON.stringify(cliniciansRaw));
  const patientProfile = patientProfileRaw
    ? JSON.parse(JSON.stringify(patientProfileRaw))
    : null;

  return (
    <AdminUserDetailClient
      user={user}
      sessions={sessions}
      clinicians={clinicians}
      patientProfile={patientProfile}
    />
  );
}

function UserNotFound({ id }) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
      <Card className="dark:bg-card max-w-md rounded-[2.5rem] border-none bg-white p-10 shadow-sm">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-rose-500/10 text-rose-500 mb-6">
          <UserX className="h-8 w-8" />
        </div>
        <h2 className="text-foreground text-2xl font-black tracking-tight uppercase mb-2">
          User Not Found
        </h2>
        <p className="text-muted-foreground text-xs font-medium mb-6">
          No registered user account matches the ID <span className="font-mono">{id || 'unknown'}</span>.
          The user may have been deleted or the link is invalid.
        </p>
        <Link href="/admin/users">
          <Button className="w-full rounded-2xl gap-2 font-bold tracking-wider uppercase text-xs">
            <ArrowLeft className="h-4 w-4" />
            Return to User Management
          </Button>
        </Link>
      </Card>
    </div>
  );
}
