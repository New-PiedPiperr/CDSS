'use client';

import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { clinicalPreferencesSchema } from '@/lib/validations/clinician-settings';
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
  Switch,
  Select,
} from '@/components/ui';
import { Loader2, Activity } from 'lucide-react';
import { useEffect } from 'react';

const MODULES = [
  { id: 'gad-7', name: 'GAD-7 (Anxiety)' },
  { id: 'phq-9', name: 'PHQ-9 (Depression)' },
  { id: 'pcl-5', name: 'PCL-5 (PTSD)' },
  { id: 'audit', name: 'AUDIT (Alcohol)' },
  { id: 'dast-10', name: 'DAST-10 (Drugs)' },
  { id: 'mmse', name: 'MMSE (Cognitive)' },
];

export default function ClinicalPage() {
  const { settings, isLoading, updateClinical } = useClinicianSettings();

  const form = useForm({
    resolver: zodResolver(clinicalPreferencesSchema),
    defaultValues: {
      defaultModules: [],
      painScale: 'VAS',
      autoSuggestTests: true,
    },
  });

  useEffect(() => {
    if (settings?.clinicalPreferences) {
      form.reset({
        defaultModules: settings.clinicalPreferences.defaultModules || [],
        painScale: settings.clinicalPreferences.painScale || 'VAS',
        autoSuggestTests: settings.clinicalPreferences.autoSuggestTests ?? true,
      });
    }
  }, [settings, form]);

  const onSubmit = (data) => {
    updateClinical.mutate(data);
  };

  const currentModules = form.watch('defaultModules');

  const toggleModule = (moduleId) => {
    const current = form.getValues('defaultModules');
    const index = current.indexOf(moduleId);
    if (index === -1) {
      form.setValue('defaultModules', [...current, moduleId], { shouldDirty: true });
    } else {
      form.setValue(
        'defaultModules',
        current.filter((id) => id !== moduleId),
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

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Clinical Preferences</CardTitle>
          <CardDescription>
            Customize your workflow and default assessment tools.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="space-y-4">
              <div>
                <Label className="text-base">Targeted Assessment Modules</Label>
                <p className="text-muted-foreground text-sm">
                  Select the modules you use most frequently. These will appear first in
                  your library.
                </p>
              </div>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {MODULES.map((module) => {
                  const isSelected = currentModules?.includes(module.id);
                  return (
                    <div
                      key={module.id}
                      onClick={() => toggleModule(module.id)}
                      className={`hover:bg-muted/50 flex cursor-pointer items-center justify-between rounded-lg border p-4 transition-all ${
                        isSelected
                          ? 'border-primary bg-primary/5 ring-primary ring-1'
                          : 'border-input'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`flex h-8 w-8 items-center justify-center rounded-full ${
                            isSelected
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-muted text-muted-foreground'
                          }`}
                        >
                          <Activity className="h-4 w-4" />
                        </div>
                        <span className="text-sm font-medium">{module.name}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
              {form.formState.errors.defaultModules && (
                <p className="text-destructive text-sm">
                  {form.formState.errors.defaultModules.message}
                </p>
              )}
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="painScale">Default Pain Scale</Label>
                <Select id="painScale" {...form.register('painScale')}>
                  <option value="VAS">Visual Analog Scale (VAS 0-10)</option>
                  {/* Only VAS allowed per requirements, but structure allows extension */}
                </Select>
                <p className="text-muted-foreground text-[0.8rem]">
                  The primary scale used for patient self-reporting.
                </p>
              </div>

              <div className="flex flex-col justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <Label className="text-base">Auto-suggest Diagnostics</Label>
                  <p className="text-muted-foreground text-sm">
                    AI will recommend tests based on symptoms.
                  </p>
                </div>
                <div className="mt-4">
                  <Controller
                    control={form.control}
                    name="autoSuggestTests"
                    render={({ field }) => (
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    )}
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <Button type="submit" disabled={updateClinical.isPending}>
                {updateClinical.isPending && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Save Preferences
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
