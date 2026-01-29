'use client';

import React from 'react';
import {
  X,
  ShieldCheck,
  FileText,
  Briefcase,
  Award,
  MapPin,
  Clock,
  AlertTriangle,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { ScrollArea } from '@/components/ui/ScrollArea';

export default function ClinicianDetailsModal({
  isOpen,
  onClose,
  clinician,
  onVerify,
  isVerifying,
}) {
  if (!isOpen || !clinician) return null;

  const isVerified = clinician.professional?.verified;
  const details = clinician.professional || {};

  return (
    <div className="animate-in fade-in fixed inset-0 z-[150] flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-md duration-300">
      <Card className="animate-in zoom-in-95 dark:bg-card relative w-full max-w-2xl overflow-hidden rounded-[2.5rem] border-none bg-white p-0 shadow-2xl duration-300">
        {/* Header */}
        <div className="bg-muted/30 flex items-center justify-between border-b p-6">
          <div className="flex items-center gap-4">
            <h3 className="text-foreground text-xl font-bold tracking-tight uppercase">
              Professional Details
            </h3>
            {isVerified ? (
              <Badge className="border-none bg-emerald-500/10 font-bold text-emerald-600">
                VERIFIED
              </Badge>
            ) : (
              <Badge className="border-none bg-amber-500/10 font-bold text-amber-600">
                UNVERIFIED
              </Badge>
            )}
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-8 w-8 rounded-full text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <ScrollArea className="max-h-[70vh] p-6">
          {!isVerified && (
            <div className="mb-6 rounded-2xl border border-amber-100 bg-amber-50 p-4 dark:border-amber-900/50 dark:bg-amber-950/20">
              <div className="flex items-start gap-3">
                <AlertTriangle className="mt-0.5 h-5 w-5 text-amber-500" />
                <div>
                  <h4 className="text-sm font-bold tracking-wide text-amber-800 uppercase dark:text-amber-200">
                    Verification Required
                  </h4>
                  <p className="mt-1 text-sm text-amber-700 dark:text-amber-300">
                    This clinician cannot be assigned to patients until their credentials
                    have been verified by an administrator.
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="grid gap-6">
            {/* Identity & Bio */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 overflow-hidden rounded-2xl bg-slate-100">
                  {clinician.avatar ? (
                    <img
                      src={clinician.avatar}
                      alt="Avatar"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-xl font-bold text-slate-400">
                      {clinician.firstName?.[0]}
                      {clinician.lastName?.[0]}
                    </div>
                  )}
                </div>
                <div>
                  <h2 className="text-lg font-bold">
                    Dr. {clinician.firstName} {clinician.lastName}
                  </h2>
                  <p className="text-muted-foreground text-sm">{clinician.email}</p>
                  <p className="text-muted-foreground text-sm">
                    {clinician.phone || 'No phone provided'}
                  </p>
                </div>
              </div>
              {details.bio ? (
                <div className="bg-muted/30 text-muted-foreground rounded-2xl p-4 text-sm leading-relaxed">
                  {details.bio}
                </div>
              ) : (
                <p className="text-muted-foreground text-sm italic">No bio provided.</p>
              )}
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {/* License Info */}
              <div className="space-y-3">
                <h4 className="text-muted-foreground flex items-center gap-2 text-xs font-bold tracking-widest uppercase">
                  <FileText className="h-4 w-4" /> Credentials
                </h4>
                <div className="rounded-2xl border p-4">
                  <div className="space-y-4">
                    <div>
                      <span className="text-muted-foreground block text-[10px] font-bold uppercase">
                        License Number
                      </span>
                      <span className="block font-medium">
                        {details.licenseNumber || 'Not provided'}
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground block text-[10px] font-bold uppercase">
                        Issuing Body
                      </span>
                      <span className="block font-medium">
                        {details.licenseBody || 'Not provided'}
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground block text-[10px] font-bold uppercase">
                        Years Experience
                      </span>
                      <span className="block font-medium">
                        {details.experienceYears || 0} Years
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Practice Info */}
              <div className="space-y-3">
                <h4 className="text-muted-foreground flex items-center gap-2 text-xs font-bold tracking-widest uppercase">
                  <Briefcase className="h-4 w-4" /> Practice
                </h4>
                <div className="rounded-2xl border p-4">
                  <div className="space-y-4">
                    <div>
                      <span className="text-muted-foreground block text-[10px] font-bold uppercase">
                        Primary Area
                      </span>
                      <span className="block font-medium">
                        {details.primaryPracticeArea || 'Not set'}
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground block text-[10px] font-bold uppercase">
                        Timezone
                      </span>
                      <span className="block font-medium">
                        {clinician.timezone || 'UTC'}
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground block text-[10px] font-bold uppercase">
                        Status
                      </span>
                      <Badge
                        variant="outline"
                        className={
                          clinician.isActive ? 'text-emerald-500' : 'text-slate-500'
                        }
                      >
                        {clinician.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Specializations */}
            <div className="space-y-3">
              <h4 className="text-muted-foreground flex items-center gap-2 text-xs font-bold tracking-widest uppercase">
                <Award className="h-4 w-4" /> Specializations
              </h4>
              <div className="flex flex-wrap gap-2">
                {details.specializations?.length > 0 ? (
                  details.specializations.map((spec, i) => (
                    <span
                      key={i}
                      className="bg-primary/10 text-primary inline-flex items-center rounded-full px-3 py-1 text-xs font-bold"
                    >
                      {spec}
                    </span>
                  ))
                ) : (
                  <span className="text-muted-foreground text-sm italic">
                    None listed
                  </span>
                )}
              </div>
            </div>
          </div>
        </ScrollArea>

        {/* Footer Actions */}
        <div className="bg-muted/10 flex justify-end gap-3 border-t p-6">
          <Button
            variant="outline"
            onClick={onClose}
            className="rounded-xl px-6 font-bold tracking-wide uppercase"
          >
            Close
          </Button>
          {!isVerified && (
            <Button
              onClick={() => onVerify(clinician._id)}
              disabled={isVerifying}
              className="rounded-xl bg-emerald-600 px-6 font-bold tracking-wide text-white uppercase shadow-lg shadow-emerald-500/20 hover:bg-emerald-700"
            >
              {isVerifying ? (
                <>
                  <Clock className="mr-2 h-4 w-4 animate-spin" /> Verifying...
                </>
              ) : (
                <>
                  <ShieldCheck className="mr-2 h-4 w-4" /> Verify Credentials
                </>
              )}
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
}
