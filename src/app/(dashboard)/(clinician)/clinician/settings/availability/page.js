'use client';

import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { availabilitySchema } from '@/lib/validations/clinician-settings';
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
import { Loader2, Plus, Trash2 } from 'lucide-react';
import { useEffect } from 'react';

const DAYS = [
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday',
];

export default function AvailabilityPage() {
  const { settings, isLoading, updateAvailability } = useClinicianSettings();

  const form = useForm({
    resolver: zodResolver(availabilitySchema),
    defaultValues: {
      timezone: 'UTC',
      sessionBuffer: 15,
      acceptNewPatients: true,
      weeklySchedule: {
        monday: { enabled: true, timeSlots: [{ start: '09:00', end: '17:00' }] },
        tuesday: { enabled: true, timeSlots: [{ start: '09:00', end: '17:00' }] },
        wednesday: { enabled: true, timeSlots: [{ start: '09:00', end: '17:00' }] },
        thursday: { enabled: true, timeSlots: [{ start: '09:00', end: '17:00' }] },
        friday: { enabled: true, timeSlots: [{ start: '09:00', end: '17:00' }] },
        saturday: { enabled: false, timeSlots: [] },
        sunday: { enabled: false, timeSlots: [] },
      },
    },
  });

  useEffect(() => {
    if (settings?.availability) {
      // Ensure schedule structure is complete
      const mergedSchedule = { ...settings.availability.schedule };
      DAYS.forEach((day) => {
        if (!mergedSchedule[day]) {
          mergedSchedule[day] = { enabled: false, timeSlots: [] };
        }
      });

      form.reset({
        timezone: settings.profile?.timezone || settings.availability.timezone || 'UTC',
        sessionBuffer: settings.availability.sessionBuffer || 15,
        acceptNewPatients: settings.availability.acceptNewPatients ?? true,
        weeklySchedule: mergedSchedule,
      });
    }
  }, [settings, form]);

  const onSubmit = (data) => {
    updateAvailability.mutate(data);
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
          <CardTitle>Availability & Schedule</CardTitle>
          <CardDescription>
            Set your weekly working hours and session preferences.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Timezone</Label>
                <div className="border-input bg-muted text-muted-foreground flex h-10 w-full items-center rounded-md border px-3 py-2 text-sm">
                  {form.getValues('timezone')}
                </div>
                <p className="text-muted-foreground text-[0.8rem]">
                  Timezone is managed in your Profile settings.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="sessionBuffer">Session Buffer (Minutes)</Label>
                <Select id="sessionBuffer" {...form.register('sessionBuffer')}>
                  <option value="0">None</option>
                  <option value="5">5 minutes</option>
                  <option value="10">10 minutes</option>
                  <option value="15">15 minutes</option>
                  <option value="30">30 minutes</option>
                </Select>
                <p className="text-muted-foreground text-[0.8rem]">
                  Gap between consecutive appointments.
                </p>
              </div>
            </div>

            <div className="rounded-lg border p-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Accept New Patients</Label>
                  <p className="text-muted-foreground text-sm">
                    Allow new patients to book appointments with you.
                  </p>
                </div>
                <Controller
                  control={form.control}
                  name="acceptNewPatients"
                  render={({ field }) => (
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  )}
                />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Weekly Schedule</h3>
              <div className="space-y-4">
                {DAYS.map((day) => (
                  <DayRow
                    key={day}
                    day={day}
                    control={form.control}
                    register={form.register}
                    setValue={form.setValue}
                    watch={form.watch}
                  />
                ))}
              </div>
            </div>

            <div className="flex justify-end">
              <Button type="submit" disabled={updateAvailability.isPending}>
                {updateAvailability.isPending && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Save Schedule
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

function DayRow({ day, control, register, setValue, watch }) {
  const enabled = watch(`weeklySchedule.${day}.enabled`);
  const timeSlots = watch(`weeklySchedule.${day}.timeSlots`) || [];

  const handleToggle = (checked) => {
    setValue(`weeklySchedule.${day}.enabled`, checked, { shouldDirty: true });
    if (checked && timeSlots.length === 0) {
      setValue(`weeklySchedule.${day}.timeSlots`, [{ start: '09:00', end: '17:00' }], {
        shouldDirty: true,
      });
    }
  };

  const addSlot = () => {
    setValue(
      `weeklySchedule.${day}.timeSlots`,
      [...timeSlots, { start: '09:00', end: '17:00' }],
      { shouldDirty: true }
    );
  };

  const removeSlot = (index) => {
    const newSlots = [...timeSlots];
    newSlots.splice(index, 1);
    setValue(`weeklySchedule.${day}.timeSlots`, newSlots, { shouldDirty: true });
  };

  return (
    <div className="flex flex-col gap-4 rounded-md border p-4 sm:flex-row sm:items-start">
      <div className="flex min-w-[120px] items-center gap-2 pt-2">
        <Switch checked={enabled} onCheckedChange={handleToggle} id={`switch-${day}`} />
        <Label htmlFor={`switch-${day}`} className="cursor-pointer capitalize">
          {day}
        </Label>
      </div>

      <div className="flex-1 space-y-2">
        {enabled && (
          <>
            {timeSlots.map((slot, index) => (
              <div key={index} className="flex items-center gap-2">
                <Input
                  type="time"
                  className="w-32"
                  {...register(`weeklySchedule.${day}.timeSlots.${index}.start`)}
                />
                <span className="text-muted-foreground">-</span>
                <Input
                  type="time"
                  className="w-32"
                  {...register(`weeklySchedule.${day}.timeSlots.${index}.end`)}
                />
                {timeSlots.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="text-muted-foreground hover:text-destructive h-9 w-9"
                    onClick={() => removeSlot(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
            <Button
              type="button"
              variant="link"
              size="sm"
              className="text-primary h-auto px-0"
              onClick={addSlot}
            >
              <Plus className="mr-1 h-3 w-3" />
              Add time slot
            </Button>
          </>
        )}
        {!enabled && (
          <div className="text-muted-foreground pt-2 text-sm">Unavailable</div>
        )}
      </div>
    </div>
  );
}
