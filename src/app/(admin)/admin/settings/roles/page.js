import React from 'react';
import connectDB from '@/lib/db/connect';
import { User } from '@/models';
import AdminUserListClient from '@/components/admin/UserListClient';
import SettingsNavigation from '@/components/admin/SettingsNavigation';

export default async function RoleSettingsPage() {
  await connectDB();

  // Fetch all users except admins
  const usersRaw = await User.find({ role: { $ne: 'ADMIN' } })
    .sort({ createdAt: -1 })
    .lean();

  const users = JSON.parse(JSON.stringify(usersRaw));

  return (
    <div className="space-y-10 pb-12">
      <header className="flex flex-col gap-2 px-2">
        <h2 className="text-foreground text-3xl font-bold tracking-tight uppercase">
          Role & Access Control
        </h2>
        <p className="text-muted-foreground font-medium">
          Manage user permissions, verify clinicians, and control platform access.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
        <div className="lg:col-span-1">
          <SettingsNavigation />
        </div>

        <div className="space-y-8 lg:col-span-3">
          <AdminUserListClient initialUsers={users} />
        </div>
      </div>
    </div>
  );
}
