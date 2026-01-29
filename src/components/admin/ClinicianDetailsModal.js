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
  Stethoscope,
  Calendar,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { ScrollArea } from '@/components/ui/ScrollArea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs';

export default function ClinicianDetailsModal({
  isOpen,
  onClose,
  clinician,
  onVerify,
  isVerifying,
}) {
  if (!isOpen || !clinician) return null;

  const isVerified = clinician.professional?.verified;
  const professional = clinician.professional || {};
  const clinical = clinician.clinical || {};
  const availability = clinician.availability || {};

  return (
    <div className="animate-in fade-in fixed inset-0 z-[150] flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-md duration-300">
      <Card className="dark:bg-card animate-in zoom-in-95 relative w-full max-w-2xl overflow-hidden rounded-[2.5rem] border-none bg-white p-0 shadow-2xl duration-300">
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

        <ScrollArea className="max-h-[70vh]">
          <div className="p-6">
            {!isVerified && (
              <div className="mb-6 rounded-2xl border border-amber-100 bg-amber-50 p-4 dark:border-amber-900/50 dark:bg-amber-950/20">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="mt-0.5 h-5 w-5 text-amber-500" />
                  <div>
                    <h4 className="text-sm font-bold tracking-wide text-amber-800 uppercase dark:text-amber-200">
                      Verification Required
                    </h4>
                    <p className="mt-1 text-sm text-amber-700 dark:text-amber-300">
                      This clinician cannot be assigned to patients until their
                      credentials have been verified by an administrator.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Identity Header */}
            <div className="mb-6 flex items-center gap-4">
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

            <Tabs defaultValue="professional" className="w-full">
              <TabsList className="mb-4">
                <TabsTrigger value="professional" className="gap-2">
                  <Briefcase className="h-4 w-4" /> Professional
                </TabsTrigger>
                <TabsTrigger value="clinical" className="gap-2">
                  <Stethoscope className="h-4 w-4" /> Clinical
                </TabsTrigger>
                <TabsTrigger value="availability" className="gap-2">
                  <Calendar className="h-4 w-4" /> Availability
                </TabsTrigger>
              </TabsList>

              <TabsContent value="professional" className="space-y-6">
                {professional.bio && (
                  <div className="bg-muted/30 text-muted-foreground rounded-2xl p-4 text-sm leading-relaxed">
                    {professional.bio}
                  </div>
                )}

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  {/* License Info */}
                  <div className="space-y-3">
                    <h4 className="text-muted-foreground flex items-center gap-2 text-xs font-bold tracking-widest uppercase">
                      <FileText className="h-4 w-4" /> Credentials
                    </h4>
                    <div className="h-full rounded-2xl border p-4">
                      <div className="space-y-4">
                        <div>
                          <span className="text-muted-foreground block text-[10px] font-bold uppercase">
                            License Number
                          </span>
                          <span className="block font-medium">
                            {professional.licenseNumber || 'Not provided'}
                          </span>
                        </div>
                        <div>
                          <span className="text-muted-foreground block text-[10px] font-bold uppercase">
                            Issuing Body
                          </span>
                          <span className="block font-medium">
                            {professional.licenseBody || 'Not provided'}
                          </span>
                        </div>
                        <div>
                          <span className="text-muted-foreground block text-[10px] font-bold uppercase">
                            Years Experience
                          </span>
                          <span className="block font-medium">
                            {professional.experienceYears || 0} Years
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
                    <div className="h-full rounded-2xl border p-4">
                      <div className="space-y-4">
                        <div>
                          <span className="text-muted-foreground block text-[10px] font-bold uppercase">
                            Primary Area
                          </span>
                          <span className="block font-medium">
                            {professional.primaryPracticeArea || 'Not set'}
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
                    {professional.specializations?.length > 0 ? (
                      professional.specializations.map((spec, i) => (
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
              </TabsContent>

              <TabsContent value="clinical" className="space-y-6">
                <div className="rounded-2xl border p-6">
                  <h4 className="mb-4 text-sm font-bold tracking-wide uppercase">
                    Preferences
                  </h4>
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <span className="text-muted-foreground block text-[10px] font-bold uppercase">
                        Default Pain Scale
                      </span>
                      <span className="block font-medium">
                        {clinical.painScale || 'VAS'}
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground block text-[10px] font-bold uppercase">
                        Auto-Suggest Tests
                      </span>
                      <Badge
                        variant="outline"
                        className={
                          clinical.autoSuggestTests
                            ? 'text-emerald-600'
                            : 'text-slate-500'
                        }
                      >
                        {clinical.autoSuggestTests ? 'Enabled' : 'Disabled'}
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <h4 className="text-muted-foreground text-xs font-bold tracking-widest uppercase">
                    Preferred Modules
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {clinical.defaultModules?.length > 0 ? (
                      clinical.defaultModules.map((mod, i) => (
                        <div
                          key={i}
                          className="rounded-lg border bg-slate-50 px-3 py-2 text-sm font-medium"
                        >
                          {mod}
                        </div>
                      ))
                    ) : (
                      <p className="text-muted-foreground text-sm italic">
                        No default modules selected
                      </p>
                    )}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="availability" className="space-y-6">
                <div className="bg-muted/30 flex items-center justify-between rounded-2xl p-4">
                  <div className="flex items-center gap-3">
                    <Clock className="text-muted-foreground h-5 w-5" />
                    <div>
                      <p className="text-sm font-bold">Session Buffer</p>
                      <p className="text-muted-foreground text-xs">
                        {availability.sessionBuffer || 0} minutes between appointments
                      </p>
                    </div>
                  </div>
                  <Badge
                    variant={availability.acceptNewPatients ? 'default' : 'secondary'}
                  >
                    {availability.acceptNewPatients
                      ? 'Accepting Patients'
                      : 'Not Accepting'}
                  </Badge>
                </div>

                <div className="space-y-3">
                  <h4 className="text-muted-foreground text-xs font-bold tracking-widest uppercase">
                    Weekly Schedule
                  </h4>
                  <div className="grid gap-2">
                    {availability.schedule &&
                      Object.entries(availability.schedule).map(([day, schedule]) => (
                        <div
                          key={day}
                          className="bg-card flex items-center justify-between rounded-xl border p-3"
                        >
                          <span className="w-24 font-medium capitalize">{day}</span>
                          <div className="flex flex-1 justify-end">
                            {schedule.enabled && schedule.timeSlots?.length > 0 ? (
                              <div className="flex flex-wrap justify-end gap-2">
                                {schedule.timeSlots.map((slot, i) => (
                                  <Badge
                                    key={i}
                                    variant="outline"
                                    className="font-mono text-xs"
                                  >
                                    {slot.start} - {slot.end}
                                  </Badge>
                                ))}
                              </div>
                            ) : (
                              <span className="text-muted-foreground text-xs italic">
                                Unavailable
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    {!availability.schedule && (
                      <p className="text-muted-foreground py-4 text-center text-sm">
                        No schedule set
                      </p>
                    )}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
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
