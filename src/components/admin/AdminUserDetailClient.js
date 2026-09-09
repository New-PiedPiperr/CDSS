'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  User as UserIcon,
  Mail,
  Phone,
  Calendar,
  Clock,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  Activity,
  Stethoscope,
  FileText,
  ChevronDown,
  ChevronUp,
  Shield,
  ShieldCheck,
  Building2,
  ExternalLink,
  ChevronRight,
  ClipboardList,
  Sparkles,
  HeartPulse,
  UserCheck,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { cn } from '@/lib/cn';
import { assignPatientToClinician } from '@/actions/admin';
import { toast } from 'sonner';

export default function AdminUserDetailClient({
  user,
  sessions: initialSessions = [],
  clinicians = [],
  patientProfile = null,
}) {
  const router = useRouter();
  const [sessions, setSessions] = useState(initialSessions);
  const [expandedSessionId, setExpandedSessionId] = useState(
    initialSessions.length > 0 ? initialSessions[0]._id : null
  );
  const [selectedClinicianMap, setSelectedClinicianMap] = useState({});
  const [assigningSessionId, setAssigningSessionId] = useState(null);

  // Derive latest session for biodata snapshot
  const latestSession = sessions[0] || null;
  const snapshotBiodata = latestSession?.biodata || null;

  // Calculate highest risk level
  const hasUrgent = sessions.some(
    (s) => s.aiAnalysis?.riskLevel?.toLowerCase() === 'urgent'
  );
  const hasModerate = sessions.some(
    (s) => s.aiAnalysis?.riskLevel?.toLowerCase() === 'moderate'
  );
  const currentRisk = hasUrgent
    ? 'Urgent'
    : hasModerate
    ? 'Moderate'
    : sessions.length > 0
    ? 'Low'
    : 'None';

  const handleAssign = async (sessionId) => {
    const clinicianId = selectedClinicianMap[sessionId];
    if (!clinicianId) {
      toast.error('Please select a clinician to assign');
      return;
    }

    setAssigningSessionId(sessionId);
    try {
      const res = await assignPatientToClinician(sessionId, clinicianId);
      if (res.success) {
        toast.success('Case assigned successfully');
        const assignedClinician = clinicians.find((c) => c._id === clinicianId);
        setSessions((prev) =>
          prev.map((s) =>
            s._id === sessionId
              ? {
                  ...s,
                  clinicianId: assignedClinician || { _id: clinicianId },
                  status: 'assigned',
                }
              : s
          )
        );
      } else {
        toast.error(res.error || 'Failed to assign case');
      }
    } catch (err) {
      toast.error('Error assigning case');
    } finally {
      setAssigningSessionId(null);
    }
  };

  const getRiskBadge = (risk) => {
    const r = (risk || '').toLowerCase();
    if (r === 'urgent') {
      return (
        <Badge className="border-none bg-rose-500/10 px-3 py-1 font-bold text-rose-600 dark:text-rose-400">
          <AlertCircle className="mr-1.5 h-3.5 w-3.5" /> URGENT
        </Badge>
      );
    }
    if (r === 'moderate') {
      return (
        <Badge className="border-none bg-amber-500/10 px-3 py-1 font-bold text-amber-600 dark:text-amber-400">
          <AlertTriangle className="mr-1.5 h-3.5 w-3.5" /> MODERATE
        </Badge>
      );
    }
    if (r === 'low') {
      return (
        <Badge className="border-none bg-emerald-500/10 px-3 py-1 font-bold text-emerald-600 dark:text-emerald-400">
          <CheckCircle2 className="mr-1.5 h-3.5 w-3.5" /> LOW RISK
        </Badge>
      );
    }
    return (
      <Badge className="border-none bg-slate-500/10 px-3 py-1 font-bold text-slate-600 dark:text-slate-400">
        NO RECORD
      </Badge>
    );
  };

  const getStatusBadge = (status) => {
    const s = (status || '').toLowerCase();
    switch (s) {
      case 'completed':
        return (
          <Badge className="border-none bg-emerald-500/10 px-3 py-1 text-[11px] font-bold tracking-wider text-emerald-600 uppercase">
            Completed
          </Badge>
        );
      case 'assigned':
        return (
          <Badge className="border-none bg-blue-500/10 px-3 py-1 text-[11px] font-bold tracking-wider text-blue-600 uppercase">
            Assigned
          </Badge>
        );
      case 'submitted_to_therapist':
      case 'pending_review':
        return (
          <Badge className="border-none bg-amber-500/10 px-3 py-1 text-[11px] font-bold tracking-wider text-amber-600 uppercase">
            Pending Review
          </Badge>
        );
      default:
        return (
          <Badge className="border-none bg-slate-500/10 px-3 py-1 text-[11px] font-bold tracking-wider text-slate-600 uppercase">
            {status || 'Draft'}
          </Badge>
        );
    }
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Top Breadcrumb & Action bar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Button
          variant="ghost"
          onClick={() => router.push('/admin/users')}
          className="hover:bg-primary/10 hover:text-primary -ml-2 gap-2 font-bold tracking-wide uppercase text-slate-600 dark:text-slate-300"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Users
        </Button>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={() => router.push('/admin/sessions')}
            className="rounded-xl border-slate-200 text-xs font-bold tracking-wider uppercase dark:border-slate-800"
          >
            Case Assignments List
          </Button>
        </div>
      </div>

      {/* Patient / User Profile Header */}
      <Card className="dark:bg-card relative overflow-hidden rounded-[2.5rem] border-none bg-white p-8 shadow-sm">
        <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-6">
            {user.avatar ? (
              <Image
                src={user.avatar}
                alt={`${user.firstName} ${user.lastName}`}
                width={80}
                height={80}
                className="h-20 w-20 rounded-3xl object-cover ring-4 ring-slate-100 dark:ring-slate-800"
              />
            ) : (
              <div className="bg-primary/10 text-primary flex h-20 w-20 items-center justify-center rounded-3xl text-2xl font-extrabold ring-4 ring-slate-100 dark:ring-slate-800">
                {user.firstName?.[0]}
                {user.lastName?.[0]}
              </div>
            )}

            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-foreground text-2xl font-black tracking-tight sm:text-3xl">
                  {user.firstName} {user.lastName}
                </h1>
                <Badge
                  className={cn(
                    'rounded-full border-none px-3.5 py-1 text-[10px] font-bold tracking-widest uppercase',
                    user.role === 'CLINICIAN'
                      ? 'bg-indigo-500 text-white'
                      : 'bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                  )}
                >
                  {user.role}
                </Badge>
                {user.isVerified ? (
                  <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-600">
                    <CheckCircle2 className="h-4 w-4" /> Verified
                  </span>
                ) : (
                  <span className="flex items-center gap-1.5 text-xs font-bold text-amber-600">
                    <Clock className="h-4 w-4" /> Unverified
                  </span>
                )}
                {!user.isActive && (
                  <span className="flex items-center gap-1.5 text-xs font-bold text-rose-600">
                    Suspended
                  </span>
                )}
              </div>

              <div className="text-muted-foreground flex flex-wrap items-center gap-5 text-sm font-medium">
                <span className="flex items-center gap-1.5">
                  <Mail className="h-4 w-4 text-slate-400" />
                  {user.email}
                </span>
                {user.phone && (
                  <span className="flex items-center gap-1.5">
                    <Phone className="h-4 w-4 text-slate-400" />
                    {user.phone}
                  </span>
                )}
                <span className="flex items-center gap-1.5">
                  <Calendar className="h-4 w-4 text-slate-400" />
                  Joined{' '}
                  {user.createdAt
                    ? new Date(user.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })
                    : 'N/A'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="dark:bg-card rounded-[2rem] border-none bg-white p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-600">
              <ClipboardList className="h-6 w-6" />
            </div>
            <div>
              <p className="text-muted-foreground text-[10px] font-bold tracking-widest uppercase">
                Case Files
              </p>
              <h3 className="text-foreground text-2xl font-black tracking-tight">
                {sessions.length}
              </h3>
            </div>
          </div>
        </Card>

        <Card className="dark:bg-card rounded-[2rem] border-none bg-white p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div
              className={cn(
                'flex h-12 w-12 items-center justify-center rounded-2xl',
                hasUrgent
                  ? 'bg-rose-500/10 text-rose-600'
                  : hasModerate
                  ? 'bg-amber-500/10 text-amber-600'
                  : 'bg-emerald-500/10 text-emerald-600'
              )}
            >
              <HeartPulse className="h-6 w-6" />
            </div>
            <div>
              <p className="text-muted-foreground text-[10px] font-bold tracking-widest uppercase">
                Overall Risk
              </p>
              <div className="mt-1">{getRiskBadge(currentRisk)}</div>
            </div>
          </div>
        </Card>

        <Card className="dark:bg-card rounded-[2rem] border-none bg-white p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-600">
              <Stethoscope className="h-6 w-6" />
            </div>
            <div>
              <p className="text-muted-foreground text-[10px] font-bold tracking-widest uppercase">
                Assigned Clinician
              </p>
              <h3 className="text-foreground text-sm font-bold truncate max-w-[140px]">
                {latestSession?.clinicianId
                  ? `Dr. ${latestSession.clinicianId.firstName || ''} ${
                      latestSession.clinicianId.lastName || ''
                    }`
                  : 'Unassigned'}
              </h3>
            </div>
          </div>
        </Card>

        <Card className="dark:bg-card rounded-[2rem] border-none bg-white p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600">
              <Activity className="h-6 w-6" />
            </div>
            <div>
              <p className="text-muted-foreground text-[10px] font-bold tracking-widest uppercase">
                Regions Assessed
              </p>
              <h3 className="text-foreground text-sm font-bold capitalize truncate max-w-[140px]">
                {sessions.length > 0
                  ? Array.from(new Set(sessions.map((s) => s.bodyRegion))).join(', ')
                  : 'None'}
              </h3>
            </div>
          </div>
        </Card>
      </div>

      {/* Clinical Biodata Section */}
      <Card className="dark:bg-card rounded-[2.5rem] border-none bg-white p-8 shadow-sm">
        <div className="mb-6 flex items-center justify-between border-b pb-4 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 text-primary flex h-9 w-9 items-center justify-center rounded-xl">
              <UserCheck className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-foreground text-lg font-bold tracking-tight uppercase">
                Patient Biodata & Health Profile
              </h3>
              <p className="text-muted-foreground text-xs font-medium">
                Confirmed clinical snapshot and intake characteristics
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-6">
          <div className="space-y-1">
            <p className="text-muted-foreground text-[10px] font-bold tracking-widest uppercase">
              Sex
            </p>
            <p className="text-foreground text-sm font-bold">
              {snapshotBiodata?.sex || user.gender || 'Not specified'}
            </p>
          </div>

          <div className="space-y-1">
            <p className="text-muted-foreground text-[10px] font-bold tracking-widest uppercase">
              Age / Range
            </p>
            <p className="text-foreground text-sm font-bold">
              {snapshotBiodata?.age
                ? `${snapshotBiodata.age} yrs`
                : snapshotBiodata?.ageRange ||
                  (user.dateOfBirth
                    ? `${
                        new Date().getFullYear() -
                        new Date(user.dateOfBirth).getFullYear()
                      } yrs`
                    : 'N/A')}
            </p>
          </div>

          <div className="space-y-1">
            <p className="text-muted-foreground text-[10px] font-bold tracking-widest uppercase">
              Occupation
            </p>
            <p className="text-foreground text-sm font-bold truncate">
              {snapshotBiodata?.occupation || patientProfile?.occupation || 'N/A'}
            </p>
          </div>

          <div className="space-y-1">
            <p className="text-muted-foreground text-[10px] font-bold tracking-widest uppercase">
              Education
            </p>
            <p className="text-foreground text-sm font-bold truncate">
              {snapshotBiodata?.education || 'N/A'}
            </p>
          </div>

          <div className="space-y-1">
            <p className="text-muted-foreground text-[10px] font-bold tracking-widest uppercase">
              Height
            </p>
            <p className="text-foreground text-sm font-bold">
              {snapshotBiodata?.height
                ? `${snapshotBiodata.height} cm`
                : patientProfile?.height?.value
                ? `${patientProfile.height.value} ${patientProfile.height.unit}`
                : 'N/A'}
            </p>
          </div>

          <div className="space-y-1">
            <p className="text-muted-foreground text-[10px] font-bold tracking-widest uppercase">
              Weight
            </p>
            <p className="text-foreground text-sm font-bold">
              {snapshotBiodata?.weight
                ? `${snapshotBiodata.weight} kg`
                : patientProfile?.weight?.value
                ? `${patientProfile.weight.value} ${patientProfile.weight.unit}`
                : 'N/A'}
            </p>
          </div>
        </div>

        {snapshotBiodata?.notes && (
          <div className="mt-6 rounded-2xl bg-slate-50 p-4 dark:bg-slate-900/50">
            <p className="text-muted-foreground text-[10px] font-bold tracking-widest uppercase mb-1">
              Assessment Intake Notes
            </p>
            <p className="text-foreground text-xs font-medium">
              {snapshotBiodata.notes}
            </p>
          </div>
        )}
      </Card>

      {/* Case Files & Diagnostic Assessments */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-foreground text-xl font-black tracking-tight uppercase">
              Diagnostic Case Files ({sessions.length})
            </h3>
            <p className="text-muted-foreground text-xs font-medium">
              Chronological MSK assessments, preliminary AI reasoning, and clinical examinations
            </p>
          </div>
        </div>

        {sessions.length === 0 ? (
          <Card className="dark:bg-card rounded-[2.5rem] border-none bg-white p-12 text-center shadow-sm">
            <div className="mx-auto flex max-w-sm flex-col items-center gap-4">
              <div className="bg-primary/10 text-primary flex h-16 w-16 items-center justify-center rounded-3xl">
                <ClipboardList className="h-8 w-8" />
              </div>
              <h4 className="text-foreground text-lg font-bold uppercase tracking-tight">
                No Diagnostic Sessions Yet
              </h4>
              <p className="text-muted-foreground text-xs font-medium">
                This patient has registered on the platform but has not yet conducted any
                musculoskeletal symptom assessments.
              </p>
            </div>
          </Card>
        ) : (
          <div className="space-y-6">
            {sessions.map((session, index) => {
              const isExpanded = expandedSessionId === session._id;
              const clinician = session.clinicianId;
              const ai = session.aiAnalysis || {};
              const symptomCount = session.symptomData?.length || 0;
              const recommendedTests = session.recommendedTests || [];
              const clinicianReview = session.clinicianReview;

              return (
                <Card
                  key={session._id}
                  className="dark:bg-card overflow-hidden rounded-[2.5rem] border-none bg-white shadow-sm transition-all duration-200"
                >
                  {/* Session Header Card Bar */}
                  <div
                    onClick={() =>
                      setExpandedSessionId(isExpanded ? null : session._id)
                    }
                    className="flex cursor-pointer flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between border-b dark:border-slate-800 hover:bg-slate-50/50 dark:hover:bg-slate-900/40"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-600">
                        <Activity className="h-6 w-6" />
                      </div>
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-foreground text-lg font-black tracking-tight capitalize">
                            {session.bodyRegion} Assessment
                          </span>
                          {index === 0 && (
                            <Badge className="border-none bg-primary/10 text-primary text-[10px] font-extrabold uppercase">
                              Latest
                            </Badge>
                          )}
                          {getStatusBadge(session.status)}
                          {getRiskBadge(ai.riskLevel)}
                        </div>
                        <p className="text-muted-foreground mt-0.5 text-xs font-semibold">
                          Session ID: <span className="font-mono">{session._id}</span> •{' '}
                          {new Date(session.createdAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right hidden md:block">
                        <p className="text-muted-foreground text-[10px] font-bold tracking-widest uppercase">
                          Assigned Clinician
                        </p>
                        <p className="text-foreground text-xs font-bold">
                          {clinician
                            ? `Dr. ${clinician.firstName || ''} ${clinician.lastName || ''}`
                            : 'Unassigned'}
                        </p>
                      </div>

                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-9 w-9 rounded-xl text-slate-400"
                      >
                        {isExpanded ? (
                          <ChevronUp className="h-5 w-5" />
                        ) : (
                          <ChevronDown className="h-5 w-5" />
                        )}
                      </Button>
                    </div>
                  </div>

                  {/* Expandable Case Details */}
                  {isExpanded && (
                    <div className="space-y-6 p-6 sm:p-8 animate-in fade-in duration-200">
                      {/* AI Temporal Diagnosis Banner */}
                      <div className="rounded-3xl border border-indigo-100 bg-indigo-50/50 p-6 dark:border-indigo-950/60 dark:bg-indigo-950/20">
                        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <Sparkles className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                              <h4 className="text-xs font-bold tracking-widest uppercase text-indigo-900 dark:text-indigo-300">
                                AI Temporal Preliminary Diagnosis
                              </h4>
                            </div>
                            <p className="text-foreground text-base font-extrabold">
                              {ai.temporalDiagnosis || 'Analysis pending completion'}
                            </p>
                          </div>

                          {ai.confidenceScore !== undefined && (
                            <div className="rounded-2xl bg-white/80 dark:bg-slate-900/80 px-4 py-2 shadow-xs">
                              <p className="text-muted-foreground text-[10px] font-bold tracking-widest uppercase">
                                Confidence Score
                              </p>
                              <p className="text-indigo-600 dark:text-indigo-400 text-lg font-black">
                                {ai.confidenceScore}%
                              </p>
                            </div>
                          )}
                        </div>

                        {/* Reasoning points */}
                        {ai.reasoning && ai.reasoning.length > 0 && (
                          <div className="mt-4 border-t border-indigo-100/80 pt-4 dark:border-indigo-900/40">
                            <p className="text-muted-foreground mb-2 text-[10px] font-bold tracking-widest uppercase text-indigo-800 dark:text-indigo-300">
                              Clinical Reasoning Evidence:
                            </p>
                            <ul className="list-inside list-disc space-y-1 text-xs text-slate-700 dark:text-slate-300 font-medium">
                              {ai.reasoning.map((r, ri) => (
                                <li key={ri}>{r}</li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Differential Diagnoses */}
                        {ai.differentialDiagnoses && ai.differentialDiagnoses.length > 0 && (
                          <div className="mt-4 flex flex-wrap items-center gap-2">
                            <span className="text-[10px] font-bold tracking-widest uppercase text-slate-500">
                              Differentials Considered:
                            </span>
                            {ai.differentialDiagnoses.map((diff, di) => (
                              <Badge
                                key={di}
                                variant="outline"
                                className="rounded-lg text-[10px] font-bold"
                              >
                                {diff}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Quick Clinician Assignment Box */}
                      <div className="rounded-3xl border border-slate-200/80 bg-slate-50/60 p-6 dark:border-slate-800 dark:bg-slate-900/40">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                          <div>
                            <h4 className="text-foreground text-xs font-bold tracking-widest uppercase">
                              Clinician Case Assignment
                            </h4>
                            <p className="text-muted-foreground text-xs font-medium">
                              Currently assigned:{' '}
                              <span className="font-bold text-foreground">
                                {clinician
                                  ? `Dr. ${clinician.firstName || ''} ${
                                      clinician.lastName || ''
                                    } (${clinician.specialization || 'Musculoskeletal Specialist'})`
                                  : 'None'}
                              </span>
                            </p>
                          </div>

                          <div className="flex items-center gap-3">
                            <select
                              className="h-10 rounded-xl border border-slate-300 bg-white px-3 text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                              value={
                                selectedClinicianMap[session._id] ||
                                clinician?._id ||
                                ''
                              }
                              onChange={(e) =>
                                setSelectedClinicianMap({
                                  ...selectedClinicianMap,
                                  [session._id]: e.target.value,
                                })
                              }
                            >
                              <option value="">-- Select Clinician --</option>
                              {clinicians.map((c) => (
                                <option key={c._id} value={c._id}>
                                  Dr. {c.firstName} {c.lastName}{' '}
                                  {c.specialization ? `(${c.specialization})` : ''}
                                </option>
                              ))}
                            </select>

                            <Button
                              size="sm"
                              disabled={assigningSessionId === session._id}
                              onClick={() => handleAssign(session._id)}
                              className="rounded-xl px-4 text-xs font-bold tracking-wider uppercase"
                            >
                              {assigningSessionId === session._id
                                ? 'Saving...'
                                : 'Assign'}
                            </Button>
                          </div>
                        </div>
                      </div>

                      {/* Recommended Clinical Tests (if any) */}
                      {recommendedTests.length > 0 && (
                        <div className="space-y-3">
                          <h4 className="text-foreground text-xs font-bold tracking-widest uppercase flex items-center gap-2">
                            <Stethoscope className="h-4 w-4 text-indigo-600" />
                            Confirmatory Clinical Tests ({recommendedTests.length})
                          </h4>
                          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                            {recommendedTests.map((test, ti) => (
                              <div
                                key={ti}
                                className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900/60"
                              >
                                <div className="flex items-center justify-between">
                                  <span className="text-foreground font-bold text-xs">
                                    {test.name || test.id}
                                  </span>
                                  {test.isObservation && (
                                    <Badge className="border-none bg-slate-100 text-slate-600 text-[9px] uppercase font-bold">
                                      Observation
                                    </Badge>
                                  )}
                                </div>
                                {test.instruction && (
                                  <p className="text-muted-foreground mt-1 text-xs font-medium">
                                    {test.instruction}
                                  </p>
                                )}
                                {test.positiveImplication && (
                                  <p className="mt-2 text-[11px] font-semibold text-rose-600 dark:text-rose-400">
                                    Positive: {test.positiveImplication}
                                  </p>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Clinician Review & Prescriptions (if recorded) */}
                      {clinicianReview &&
                        (clinicianReview.clinicianNotes ||
                          clinicianReview.confirmedDiagnosis) && (
                          <div className="rounded-3xl border border-emerald-100 bg-emerald-50/40 p-6 dark:border-emerald-950/60 dark:bg-emerald-950/20">
                            <h4 className="text-xs font-bold tracking-widest uppercase text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
                              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                              Clinician Evaluation & Notes
                            </h4>
                            {clinicianReview.confirmedDiagnosis && (
                              <p className="mt-2 text-sm font-bold text-foreground">
                                Confirmed Diagnosis:{' '}
                                {clinicianReview.confirmedDiagnosis}
                              </p>
                            )}
                            {clinicianReview.clinicianNotes && (
                              <p className="mt-1 text-xs text-slate-700 dark:text-slate-300 font-medium">
                                {clinicianReview.clinicianNotes}
                              </p>
                            )}
                          </div>
                        )}

                      {/* Symptom Q&A History */}
                      <div className="space-y-3">
                        <h4 className="text-foreground text-xs font-bold tracking-widest uppercase flex items-center gap-2">
                          <FileText className="h-4 w-4 text-slate-500" />
                          Patient Q&A Assessment Log ({symptomCount} Questions Answered)
                        </h4>

                        {symptomCount === 0 ? (
                          <p className="text-muted-foreground text-xs italic">
                            No symptom questionnaire answers recorded.
                          </p>
                        ) : (
                          <div className="overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800">
                            <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
                              {session.symptomData.map((item, qIndex) => (
                                <div
                                  key={qIndex}
                                  className="flex flex-col gap-1 p-4 sm:flex-row sm:items-center sm:justify-between hover:bg-slate-50/50 dark:hover:bg-slate-900/30 text-xs"
                                >
                                  <div className="max-w-xl">
                                    <p className="font-semibold text-foreground">
                                      {item.question}
                                    </p>
                                    <span className="text-[10px] font-bold tracking-wider uppercase text-slate-400">
                                      {item.questionCategory || 'General'}
                                    </span>
                                  </div>

                                  <div className="text-right sm:pl-4">
                                    <Badge className="border-none bg-primary/10 text-primary font-bold text-xs py-1 px-3">
                                      {item.response}
                                    </Badge>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
