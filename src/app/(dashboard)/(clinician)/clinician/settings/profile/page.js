'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { profileSchema } from '@/lib/validations/clinician-settings';
import { useClinicianSettings } from '@/hooks/useClinicianSettings';
import {
  Button,
  Input,
  Label,
  Textarea,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  Avatar,
  AvatarImage,
  AvatarFallback,
  Badge,
} from '@/components/ui';
import { Loader2, Upload, Camera } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function ProfilePage() {
  const { settings, isLoading, updateProfile, uploadAvatar } = useClinicianSettings();
  const [avatarPreview, setAvatarPreview] = useState(null);

  const form = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      phone: '',
      timezone: '',
      bio: '',
      avatarUrl: '',
    },
  });

  useEffect(() => {
    if (settings?.profile) {
      form.reset({
        firstName: settings.profile.firstName || '',
        lastName: settings.profile.lastName || '',
        phone: settings.profile.phone || '',
        timezone: settings.profile.timezone || 'UTC',
        bio: settings.profile.bio || '',
        avatarUrl: settings.profile.avatarUrl || '',
      });
      setAvatarPreview(settings.profile.avatarUrl);
    }
  }, [settings, form]);

  const onSubmit = (data) => {
    updateProfile.mutate(data);
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      // Local preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);

      // Upload
      uploadAvatar.mutate(file);
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
          <CardTitle>Public Profile</CardTitle>
          <CardDescription>
            Manage your public profile and how you appear to patients.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-8 flex flex-col items-center gap-6 sm:flex-row">
            <div className="group relative cursor-pointer">
              <Avatar className="border-border h-24 w-24 border-2">
                <AvatarImage
                  src={avatarPreview || settings?.profile?.avatarUrl}
                  alt="Profile"
                />
                <AvatarFallback className="text-xl">
                  {settings?.profile?.firstName?.[0]}
                  {settings?.profile?.lastName?.[0]}
                </AvatarFallback>
              </Avatar>
              <label
                htmlFor="avatar-upload"
                className="absolute inset-0 flex cursor-pointer items-center justify-center rounded-full bg-black/60 opacity-0 transition-opacity group-hover:opacity-100"
              >
                <Camera className="h-8 w-8 text-white" />
              </label>
              <input
                type="file"
                id="avatar-upload"
                className="hidden"
                accept="image/*"
                onChange={handleAvatarChange}
                disabled={uploadAvatar.isPending}
              />
            </div>
            <div className="flex-1 space-y-2 text-center sm:text-left">
              <div className="flex items-center justify-center gap-2 sm:justify-start">
                <h3 className="text-lg font-medium">
                  {settings?.profile?.firstName} {settings?.profile?.lastName}
                </h3>
                <Badge variant="secondary" className="text-xs uppercase">
                  {settings?.profile?.role}
                </Badge>
              </div>
              <p className="text-muted-foreground text-sm">
                Click the image to update your profile photo. JPG, PNG or GIF.
              </p>
            </div>
          </div>

          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  {...form.register('firstName')}
                  error={form.formState.errors.firstName?.message}
                />
                {form.formState.errors.firstName && (
                  <p className="text-destructive text-sm">
                    {form.formState.errors.firstName.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  {...form.register('lastName')}
                  error={form.formState.errors.lastName?.message}
                />
                {form.formState.errors.lastName && (
                  <p className="text-destructive text-sm">
                    {form.formState.errors.lastName.message}
                  </p>
                )}
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  value={settings?.profile?.email || ''}
                  disabled
                  className="bg-muted"
                />
                <p className="text-muted-foreground text-[0.8rem]">
                  Email address cannot be changed.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  {...form.register('phone')}
                  error={form.formState.errors.phone?.message}
                />
                {form.formState.errors.phone && (
                  <p className="text-destructive text-sm">
                    {form.formState.errors.phone.message}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="timezone">Timezone</Label>
              <div className="relative">
                <select
                  id="timezone"
                  {...form.register('timezone')}
                  className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm focus:ring-2 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="UTC">UTC</option>
                  <option value="America/New_York">Eastern Time (US & Canada)</option>
                  <option value="America/Chicago">Central Time (US & Canada)</option>
                  <option value="America/Denver">Mountain Time (US & Canada)</option>
                  <option value="America/Los_Angeles">Pacific Time (US & Canada)</option>
                  <option value="Europe/London">London</option>
                  <option value="Europe/Paris">Paris</option>
                  <option value="Asia/Tokyo">Tokyo</option>
                  {/* Add more timezones as needed */}
                </select>
              </div>
              {form.formState.errors.timezone && (
                <p className="text-destructive text-sm">
                  {form.formState.errors.timezone.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                placeholder="Tell us a little bit about yourself"
                className="resize-none"
                {...form.register('bio')}
                error={form.formState.errors.bio?.message}
              />
              <p className="text-muted-foreground text-[0.8rem]">
                Brief description for your profile. URLs are hyperlinked.
              </p>
              {form.formState.errors.bio && (
                <p className="text-destructive text-sm">
                  {form.formState.errors.bio.message}
                </p>
              )}
            </div>

            <div className="flex justify-end">
              <Button type="submit" disabled={updateProfile.isPending}>
                {updateProfile.isPending && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Save Changes
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
