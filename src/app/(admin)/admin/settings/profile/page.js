'use client';

import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { adminProfileSchema } from '@/lib/validations/admin-settings';
import { useAdminSettings } from '@/hooks/useAdminSettings';
import { useSession } from 'next-auth/react';
import { User as UserIcon, Save, RefreshCw, Lock } from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
  Input,
  Label,
  Avatar,
  AvatarImage,
  AvatarFallback,
} from '@/components/ui';
import SettingsNavigation from '@/components/admin/SettingsNavigation';

export default function AdminProfilePage() {
  const { data: session, update: updateSession } = useSession();
  const { updateProfile, uploadAvatar } = useAdminSettings();

  const form = useForm({
    resolver: zodResolver(adminProfileSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      phone: '',
    },
  });

  useEffect(() => {
    if (session?.user) {
      form.reset({
        firstName: session.user.firstName || '',
        lastName: session.user.lastName || '',
        phone: session.user.phone || '',
      });
    }
  }, [session, form]);

  const onSubmit = (data) => {
    updateProfile.mutate(data);
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      uploadAvatar.mutate(file, {
        onSuccess: async (data) => {
          await updateSession({ image: data.avatarUrl });
        },
      });
    }
  };

  return (
    <div className="space-y-10 pb-12">
      <header className="flex flex-col gap-2 px-2">
        <h2 className="text-foreground text-3xl font-bold tracking-tight uppercase">
          Profile Settings
        </h2>
        <p className="text-muted-foreground font-medium">
          Manage your administrative identity and contact information.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <SettingsNavigation />

        <div className="space-y-8 lg:col-span-2">
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <Card className="bg-card rounded-[2.5rem] border-none shadow-sm">
              <CardHeader className="p-8 pb-0">
                <CardTitle className="flex items-center gap-3 text-xl font-bold tracking-tight uppercase">
                  <UserIcon className="text-primary h-6 w-6" />
                  Personal Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-8 p-8">
                <div className="flex flex-col items-center gap-6 sm:flex-row">
                  <div className="group relative cursor-pointer">
                    <Avatar className="border-border h-24 w-24 overflow-hidden rounded-2xl border-2">
                      <AvatarImage src={session?.user?.avatar || session?.user?.image} />
                      <AvatarFallback className="bg-primary/10 text-primary text-xl font-bold">
                        {session?.user?.firstName?.[0]}
                        {session?.user?.lastName?.[0]}
                      </AvatarFallback>
                    </Avatar>
                    <label
                      htmlFor="avatar-upload"
                      className="absolute inset-0 flex cursor-pointer items-center justify-center rounded-2xl bg-black/60 opacity-0 transition-opacity group-hover:opacity-100"
                    >
                      {uploadAvatar.isPending ? (
                        <RefreshCw className="h-8 w-8 animate-spin text-white" />
                      ) : (
                        <UserIcon className="h-8 w-8 text-white" />
                      )}
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
                  <div>
                    <h3 className="text-lg font-bold">
                      {session?.user?.firstName} {session?.user?.lastName}
                    </h3>
                    <p className="text-muted-foreground text-sm font-bold tracking-widest uppercase">
                      System Administrator
                    </p>
                    <p className="text-muted-foreground mt-1 text-[10px]">
                      Click image to upload new portrait.
                    </p>
                  </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label
                      htmlFor="firstName"
                      className="text-xs font-bold tracking-widest uppercase"
                    >
                      First Name
                    </Label>
                    <Input
                      id="firstName"
                      {...form.register('firstName')}
                      className="bg-muted/50 h-12 rounded-xl border-none"
                    />
                    {form.formState.errors.firstName && (
                      <p className="text-destructive text-xs">
                        {form.formState.errors.firstName.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="lastName"
                      className="text-xs font-bold tracking-widest uppercase"
                    >
                      Last Name
                    </Label>
                    <Input
                      id="lastName"
                      {...form.register('lastName')}
                      className="bg-muted/50 h-12 rounded-xl border-none"
                    />
                    {form.formState.errors.lastName && (
                      <p className="text-destructive text-xs">
                        {form.formState.errors.lastName.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label
                      htmlFor="email"
                      className="text-xs font-bold tracking-widest uppercase"
                    >
                      Email Address
                    </Label>
                    <div className="relative">
                      <Input
                        id="email"
                        value={session?.user?.email || ''}
                        readOnly
                        className="bg-muted h-12 cursor-not-allowed rounded-xl border-none pr-10"
                      />
                      <Lock className="text-muted-foreground absolute top-1/2 right-4 h-4 w-4 -translate-y-1/2" />
                    </div>
                    <p className="text-muted-foreground text-[10px] font-medium">
                      Contact system owner to change primary email.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="phone"
                      className="text-xs font-bold tracking-widest uppercase"
                    >
                      Phone Number
                    </Label>
                    <Input
                      id="phone"
                      {...form.register('phone')}
                      className="bg-muted/50 h-12 rounded-xl border-none"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs font-bold tracking-widest uppercase">
                    Administrative Role
                  </Label>
                  <div className="relative">
                    <Input
                      value="ADMIN"
                      readOnly
                      className="bg-muted h-12 cursor-not-allowed rounded-xl border-none pr-10"
                    />
                    <Lock className="text-muted-foreground absolute top-1/2 right-4 h-4 w-4 -translate-y-1/2" />
                  </div>
                  <p className="text-muted-foreground text-[10px] font-medium">
                    Administrator roles are immutable from this interface.
                  </p>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                className="h-14 rounded-2xl px-10 text-xs font-bold tracking-widest uppercase"
              >
                Reset
              </Button>
              <Button
                type="submit"
                disabled={updateProfile.isPending}
                className="bg-primary h-14 gap-2 rounded-2xl px-10 text-xs font-bold tracking-widest text-white uppercase shadow-sm"
              >
                {updateProfile.isPending ? (
                  <RefreshCw className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                Save Profile
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
