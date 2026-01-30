'use client';

import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { securitySettingsSchema } from '@/lib/validations/admin-settings';
import { useAdminSettings } from '@/hooks/useAdminSettings';
import { Lock, Save, RefreshCw, ShieldAlert } from 'lucide-react';
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

export default function SecuritySettingsPage() {
  const { settings, isLoading, updateSecurity } = useAdminSettings();

  const form = useForm({
    resolver: zodResolver(securitySettingsSchema),
    defaultValues: {
      enforceAdmin2FA: false,
      sessionTimeoutMinutes: 60,
      passwordPolicy: {
        minLength: 8,
        requireSpecialChar: true,
      },
    },
  });

  useEffect(() => {
    if (settings?.security) {
      form.reset(settings.security);
    }
  }, [settings, form]);

  const onSubmit = (data) => {
    updateSecurity.mutate(data);
  };

  return (
    <div className="space-y-10 pb-12">
      <header className="flex flex-col gap-2 px-2">
        <h2 className="text-foreground text-3xl font-bold tracking-tight uppercase">
          Security & Privacy
        </h2>
        <p className="text-muted-foreground font-medium">
          Configure platform-wide security policies and access enforcement.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <SettingsNavigation />

        <div className="space-y-8 lg:col-span-2">
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <Card className="bg-card rounded-[2.5rem] border-none shadow-sm">
              <CardHeader className="p-8 pb-0">
                <CardTitle className="flex items-center gap-3 text-xl font-bold tracking-tight uppercase">
                  <Lock className="text-primary h-6 w-6" />
                  Access Enforcement
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-8 p-8">
                <div className="bg-muted/20 border-border/50 flex items-center justify-between rounded-2xl border p-6">
                  <div>
                    <p className="text-foreground text-sm font-bold">Enforce Admin 2FA</p>
                    <p className="text-muted-foreground text-xs">
                      Mandatory Two-Factor Authentication for all administrative accounts.
                    </p>
                  </div>
                  <Switch
                    checked={form.watch('enforceAdmin2FA')}
                    onCheckedChange={(val) => form.setValue('enforceAdmin2FA', val)}
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="sessionTimeoutMinutes"
                    className="text-xs font-bold tracking-widest uppercase"
                  >
                    Session Timeout (Minutes)
                  </Label>
                  <Input
                    id="sessionTimeoutMinutes"
                    type="number"
                    {...form.register('sessionTimeoutMinutes', { valueAsNumber: true })}
                    className="bg-muted/50 h-12 rounded-xl border-none"
                  />
                  <p className="text-muted-foreground text-[10px] font-medium">
                    Automatic logout after period of inactivity.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card rounded-[2.5rem] border-none shadow-sm">
              <CardHeader className="p-8 pb-0">
                <CardTitle className="flex items-center gap-3 text-xl font-bold tracking-tight uppercase">
                  <ShieldAlert className="text-primary h-6 w-6" />
                  Password Policy
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-8 p-8">
                <div className="space-y-2">
                  <Label
                    htmlFor="minLength"
                    className="text-xs font-bold tracking-widest uppercase"
                  >
                    Minimum Password Length
                  </Label>
                  <Input
                    id="minLength"
                    type="number"
                    {...form.register('passwordPolicy.minLength', {
                      valueAsNumber: true,
                    })}
                    className="bg-muted/50 h-12 rounded-xl border-none"
                  />
                </div>

                <div className="bg-muted/20 border-border/50 flex items-center justify-between rounded-2xl border p-6">
                  <div>
                    <p className="text-foreground text-sm font-bold">
                      Require Special Characters
                    </p>
                    <p className="text-muted-foreground text-xs">
                      Enforce complexity by requiring at least one special character.
                    </p>
                  </div>
                  <Switch
                    checked={form.watch('passwordPolicy.requireSpecialChar')}
                    onCheckedChange={(val) =>
                      form.setValue('passwordPolicy.requireSpecialChar', val)
                    }
                  />
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end gap-4">
              <Button
                type="submit"
                disabled={updateSecurity.isPending}
                className="bg-primary h-14 gap-2 rounded-2xl px-10 text-xs font-bold tracking-widest text-white uppercase shadow-sm"
              >
                {updateSecurity.isPending ? (
                  <RefreshCw className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                Apply Security Policies
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
