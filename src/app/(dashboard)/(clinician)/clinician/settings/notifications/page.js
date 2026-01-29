'use client';

import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { notificationsSchema } from '@/lib/validations/clinician-settings';
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
} from '@/components/ui';
import { Loader2, Mail, Bell, MessageSquare, UserPlus, FileText } from 'lucide-react';
import { useEffect } from 'react';

const EVENT_TYPES = [
  {
    id: 'new_patient',
    label: 'New Patient Assigned',
    description: 'When an admin assigns a new patient to you',
    icon: UserPlus,
  },
  {
    id: 'assessment_completed',
    label: 'Assessment Completed',
    description: 'When a patient completes a self-assessment or module',
    icon: FileText,
  },
  {
    id: 'admin_message',
    label: 'Admin Messages',
    description: 'Direct messages or announcements from administrators',
    icon: MessageSquare,
  },
];

export default function NotificationsPage() {
  const { settings, isLoading, updateNotifications } = useClinicianSettings();

  const form = useForm({
    resolver: zodResolver(notificationsSchema),
    defaultValues: {
      email: true,
      inApp: true,
      events: [],
    },
  });

  useEffect(() => {
    if (settings?.notifications) {
      form.reset({
        email: settings.notifications.email ?? true,
        inApp: settings.notifications.inApp ?? true,
        events: settings.notifications.events || [],
      });
    }
  }, [settings, form]);

  const onSubmit = (data) => {
    updateNotifications.mutate(data);
  };

  const currentEvents = form.watch('events');

  const toggleEvent = (eventId, checked) => {
    const current = form.getValues('events');
    if (checked) {
      if (!current.includes(eventId)) {
        form.setValue('events', [...current, eventId], { shouldDirty: true });
      }
    } else {
      form.setValue(
        'events',
        current.filter((id) => id !== eventId),
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
          <CardTitle>Notifications</CardTitle>
          <CardDescription>Manage how and when you want to be notified.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="space-y-4">
              <h3 className="text-muted-foreground text-sm font-medium tracking-wider uppercase">
                Channels
              </h3>
              <div className="divide-y rounded-lg border">
                <div className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-3">
                    <Mail className="text-muted-foreground h-5 w-5" />
                    <div className="space-y-0.5">
                      <Label className="text-foreground text-base">
                        Email Notifications
                      </Label>
                      <p className="text-muted-foreground text-sm">
                        Receive updates via email.
                      </p>
                    </div>
                  </div>
                  <Controller
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    )}
                  />
                </div>
                <div className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-3">
                    <Bell className="text-muted-foreground h-5 w-5" />
                    <div className="space-y-0.5">
                      <Label className="text-foreground text-base">
                        In-App Notifications
                      </Label>
                      <p className="text-muted-foreground text-sm">
                        Receive alerts within the application.
                      </p>
                    </div>
                  </div>
                  <Controller
                    control={form.control}
                    name="inApp"
                    render={({ field }) => (
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    )}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-muted-foreground text-sm font-medium tracking-wider uppercase">
                Events
              </h3>
              <div className="divide-y rounded-lg border">
                {EVENT_TYPES.map((event) => {
                  const Icon = event.icon;
                  const isChecked = currentEvents?.includes(event.id);

                  return (
                    <div key={event.id} className="flex items-center justify-between p-4">
                      <div className="flex items-center gap-3">
                        <Icon className="text-muted-foreground h-5 w-5" />
                        <div className="space-y-0.5">
                          <Label className="text-foreground text-base">
                            {event.label}
                          </Label>
                          <p className="text-muted-foreground text-sm">
                            {event.description}
                          </p>
                        </div>
                      </div>
                      <Switch
                        checked={isChecked}
                        onCheckedChange={(checked) => toggleEvent(event.id, checked)}
                      />
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex justify-end">
              <Button type="submit" disabled={updateNotifications.isPending}>
                {updateNotifications.isPending && (
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
