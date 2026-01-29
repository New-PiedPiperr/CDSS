'use client';

import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { professionalSchema } from '@/lib/validations/clinician-settings';
import { useClinicianSettings } from '@/hooks/useClinicianSettings';
import {
  Button,
  Input,
  Label,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  Badge,
  Select,
} from '@/components/ui';
import { Loader2, CheckCircle, AlertTriangle } from 'lucide-react';
import { useEffect } from 'react';

const SPECIALIZATIONS = [
  'General Practice',
  'Cardiology',
  'Neurology',
  'Pediatrics',
  'Psychiatry',
  'Dermatology',
  'Orthopedics',
  'Oncology',
  'Internal Medicine',
  'Family Medicine',
  'Sports Medicine',
  'Geriatrics',
];

export default function ProfessionalPage() {
  const { settings, isLoading, updateProfessional } = useClinicianSettings();

  const form = useForm({
    resolver: zodResolver(professionalSchema),
    defaultValues: {
      licenseNumber: '',
      licenseBody: '',
      experienceYears: 0,
      specializations: [],
      primaryPracticeArea: '',
    },
  });

  useEffect(() => {
    if (settings?.professional) {
      form.reset({
        licenseNumber: settings.professional.licenseNumber || '',
        licenseBody: settings.professional.licenseBody || '',
        experienceYears: settings.professional.experienceYears || 0,
        specializations: settings.professional.specializations || [],
        primaryPracticeArea: settings.professional.primaryPracticeArea || '',
      });
    }
  }, [settings, form]);

  const onSubmit = (data) => {
    updateProfessional.mutate(data);
  };

  const currentSpecializations = form.watch('specializations');

  const toggleSpecialization = (spec) => {
    const current = form.getValues('specializations');
    const index = current.indexOf(spec);
    if (index === -1) {
      form.setValue('specializations', [...current, spec], { shouldDirty: true });
    } else {
      form.setValue(
        'specializations',
        current.filter((s) => s !== spec),
        { shouldDirty: true }
      );
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="text-primary h-8 w-8 animate-spin" />
      </div>
    );
  }

  const isVerified = settings?.professional?.verified;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle>Professional Details</CardTitle>
              <CardDescription>
                Your medical credentials and practice information.
              </CardDescription>
            </div>
            {isVerified ? (
              <Badge
                variant="outline"
                className="flex items-center gap-1 border-green-500 bg-green-50 text-green-600 dark:bg-green-950/20"
              >
                <CheckCircle className="h-3.5 w-3.5" />
                Verified Clinician
              </Badge>
            ) : (
              <Badge
                variant="outline"
                className="flex items-center gap-1 border-amber-500 bg-amber-50 text-amber-600 dark:bg-amber-950/20"
              >
                <AlertTriangle className="h-3.5 w-3.5" />
                Unverified
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {!isVerified && (
            <div className="mb-6 rounded-md border border-amber-200 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-950/20">
              <div className="flex">
                <div className="flex-shrink-0">
                  <AlertTriangle className="h-5 w-5 text-amber-400" aria-hidden="true" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-amber-800 dark:text-amber-200">
                    Pending Verification
                  </h3>
                  <div className="mt-2 text-sm text-amber-700 dark:text-amber-300">
                    <p>
                      Your account is currently limited. Please complete your professional
                      profile. Admin verification is required after submitting your
                      license details.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="licenseNumber">License Number</Label>
                <Input
                  id="licenseNumber"
                  {...form.register('licenseNumber')}
                  error={form.formState.errors.licenseNumber?.message}
                />
                {form.formState.errors.licenseNumber && (
                  <p className="text-destructive text-sm">
                    {form.formState.errors.licenseNumber.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="licenseBody">Issuing Body</Label>
                <Input
                  id="licenseBody"
                  placeholder="e.g. State Medical Board"
                  {...form.register('licenseBody')}
                  error={form.formState.errors.licenseBody?.message}
                />
                {form.formState.errors.licenseBody && (
                  <p className="text-destructive text-sm">
                    {form.formState.errors.licenseBody.message}
                  </p>
                )}
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="experienceYears">Years of Experience</Label>
                <Input
                  id="experienceYears"
                  type="number"
                  min="0"
                  {...form.register('experienceYears')}
                  error={form.formState.errors.experienceYears?.message}
                />
                {form.formState.errors.experienceYears && (
                  <p className="text-destructive text-sm">
                    {form.formState.errors.experienceYears.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="primaryPracticeArea">Primary Practice Area</Label>
                <Select
                  id="primaryPracticeArea"
                  {...form.register('primaryPracticeArea')}
                >
                  <option value="">Select an area</option>
                  {SPECIALIZATIONS.map((spec) => (
                    <option key={spec} value={spec}>
                      {spec}
                    </option>
                  ))}
                </Select>
                {form.formState.errors.primaryPracticeArea && (
                  <p className="text-destructive text-sm">
                    {form.formState.errors.primaryPracticeArea.message}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-3">
              <Label>Specializations</Label>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
                {SPECIALIZATIONS.map((spec) => {
                  const isSelected = currentSpecializations?.includes(spec);
                  return (
                    <div
                      key={spec}
                      onClick={() => toggleSpecialization(spec)}
                      className={`cursor-pointer rounded-md border p-2 text-center text-sm transition-all ${
                        isSelected
                          ? 'border-primary bg-primary/10 text-primary font-medium'
                          : 'border-input hover:border-primary/50'
                      }`}
                    >
                      {spec}
                    </div>
                  );
                })}
              </div>
              {form.formState.errors.specializations && (
                <p className="text-destructive text-sm">
                  {form.formState.errors.specializations.message}
                </p>
              )}
            </div>

            <div className="flex justify-end">
              <Button type="submit" disabled={updateProfessional.isPending}>
                {updateProfessional.isPending && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Save Professional Details
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
