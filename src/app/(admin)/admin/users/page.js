import connectDB from '@/lib/db/connect';
import User from '@/models/User';
import AdminUserListClient from '@/components/admin/UserListClient';

export default async function AdminUsersPage() {
  await connectDB();

  // Fetch all users except admins with strict field projection to avoid fetching bloated fields
  const usersRaw = await User.find({ role: { $ne: 'ADMIN' } })
    .select('firstName lastName email role isVerified isActive createdAt professional avatar')
    .sort({ createdAt: -1 })
    .lean();

  // Clean and serialize objects, ensuring no massive base64 strings stall RSC serialization
  const users = usersRaw.map((u) => ({
    _id: u._id.toString(),
    firstName: u.firstName || '',
    lastName: u.lastName || '',
    email: u.email || '',
    role: u.role || 'PATIENT',
    isVerified: !!u.isVerified,
    isActive: u.isActive !== false,
    createdAt: u.createdAt ? new Date(u.createdAt).toISOString() : null,
    professional: u.professional ? JSON.parse(JSON.stringify(u.professional)) : null,
    avatar: u.avatar && u.avatar.length > 2000 ? null : (u.avatar || null),
  }));

  return (
    <div className="space-y-8 pb-12">
      <header className="flex flex-col gap-2">
        <h2 className="text-3xl font-bold tracking-tight text-gray-900 uppercase dark:text-white">
          User Management
        </h2>
        <p className="font-medium text-gray-500">
          Monitor and manage all registered patients and clinicians on the CDSS platform.
        </p>
      </header>

      <AdminUserListClient initialUsers={users} />
    </div>
  );
}
