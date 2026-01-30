'use client';

import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { systemSettingsSchema } from '@/lib/validations/admin-settings';
import { useAdminSettings } from '@/hooks/useAdminSettings';
import { Cpu, Save, RefreshCw } from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
  Switch,
  Input,
  Label,
} from '@/components/ui';
import SettingsNavigation from '@/components/admin/SettingsNavigation';

export default function SystemSettingsPage() {
  const { settings, isLoading, updateSystem } = useAdminSettings();

  const form = useForm({
    resolver: zodResolver(systemSettingsSchema),
    defaultValues: {
      platformName: '',
      allowClinicianSignup: true,
      allowPatientSignup: true,
      maintenanceMode: false,
    },
  });

  useEffect(() => {
    if (settings?.system) {
      form.reset(settings.system);
    }
  }, [settings, form]);

  const onSubmit = (data) => {
    updateSystem.mutate(data);
  };

  return (
    <div className="space-y-10 pb-12">
      <header className="flex flex-col gap-2 px-2">
        <h2 className="text-foreground text-3xl font-bold tracking-tight uppercase">
          System Configuration
        </h2>
        <p className="text-muted-foreground font-medium">
          Control global platform parameters and access registration modes.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <SettingsNavigation />

        <div className="space-y-8 lg:col-span-2">
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <Card className="bg-card rounded-[2.5rem] border-none shadow-sm">
              <CardHeader className="p-8 pb-0">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-3 text-xl font-bold tracking-tight uppercase">
                    <Cpu className="text-primary h-6 w-6" />
                    Platform Parameters
                  </CardTitle>
                  {isLoading && (
                    <RefreshCw className="text-muted-foreground h-4 w-4 animate-spin" />
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-8 p-8">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label
                      htmlFor="platformName"
                      className="text-xs font-bold tracking-widest uppercase"
                    >
                      Platform Name
                    </Label>
                    <Input
                      id="platformName"
                      {...form.register('platformName')}
                      placeholder="e.g. CDSS Health"
                      className="bg-muted/50 h-12 rounded-xl border-none"
                    />
                    {form.formState.errors.platformName && (
                      <p className="text-destructive text-xs">
                        {form.formState.errors.platformName.message}
                      </p>
                    )}
                  </div>

                  <div className="bg-muted/20 border-border/50 flex items-center justify-between rounded-2xl border p-6">
                    <div>
                      <p className="text-foreground text-sm font-bold">
                        Allow Clinician Registration
                      </p>
                      <p className="text-muted-foreground text-xs">
                        Enable new healthcare providers to sign up on the platform.
                      </p>
                    </div>
                    <Switch
                      checked={form.watch('allowClinicianSignup')}
                      onCheckedChange={(val) =>
                        form.setValue('allowClinicianSignup', val)
                      }
                    />
                  </div>

                  <div className="bg-muted/20 border-border/50 flex items-center justify-between rounded-2xl border p-6">
                    <div>
                      <p className="text-foreground text-sm font-bold">
                        Allow Patient Registration
                      </p>
                      <p className="text-muted-foreground text-xs">
                        Enable self-service registration for new patients.
                      </p>
                    </div>
                    <Switch
                      checked={form.watch('allowPatientSignup')}
                      onCheckedChange={(val) => form.setValue('allowPatientSignup', val)}
                    />
                  </div>

                  <div className="bg-muted/20 border-border/50 flex items-center justify-between rounded-2xl border p-6">
                    <div>
                      <p className="text-foreground text-sm font-bold text-orange-600">
                        Maintenance Mode
                      </p>
                      <p className="text-muted-foreground text-xs">
                        Restrict access to all non-admin users immediately.
                      </p>
                    </div>
                    <Switch
                      checked={form.watch('maintenanceMode')}
                      onCheckedChange={(val) => form.setValue('maintenanceMode', val)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => form.reset()}
                className="h-14 rounded-2xl px-10 text-xs font-bold tracking-widest uppercase"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={updateSystem.isPending}
                className="bg-primary h-14 gap-2 rounded-2xl px-10 text-xs font-bold tracking-widest text-white uppercase shadow-sm"
              >
                {updateSystem.isPending ? (
                  <RefreshCw className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                Apply Changes
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
