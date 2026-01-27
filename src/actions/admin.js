'use server';

import connectDB from '@/lib/db/connect';
import User, { ROLES } from '@/models/User';
import DiagnosisSession from '@/models/DiagnosisSession';
import bcrypt from 'bcrypt';
import { revalidatePath } from 'next/cache';

/**
 * Initializes the Admin user if it doesn't exist.
 */
export async function seedAdminUser() {
  await connectDB();

  const adminEmail = 'cdssoau@gmail.com';
  const adminPassword = 'CDSSADMIN2026';

  const existingAdmin = await User.findOne({ email: adminEmail });

  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash(adminPassword, 10);
    await User.create({
      email: adminEmail,
      password: hashedPassword,
      firstName: 'CDSS',
      lastName: 'Admin',
      role: ROLES.ADMIN,
      isVerified: true,
      isActive: true,
    });
    return { success: true, message: 'Admin user created successfully.' };
  }

  return { success: true, message: 'Admin user already exists.' };
}

/**
 * Upgrades a user role from PATIENT to CLINICIAN.
 */
export async function upgradeUserRole(userId) {
  try {
    await connectDB();
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    user.role = ROLES.CLINICIAN;
    await user.save();

    revalidatePath('/admin/dashboard');
    return { success: true };
  } catch (error) {
    console.error('Error upgrading user role:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Assigns a case (DiagnosisSession) to a clinician.
 */
export async function assignCase(sessionId, clinicianId) {
  try {
    await connectDB();
    const session = await DiagnosisSession.findById(sessionId);
    if (!session) {
      throw new Error('Session not found');
    }

    session.clinicianId = clinicianId;
    session.status = 'assigned';
    await session.save();

    revalidatePath('/admin/sessions');
    revalidatePath('/admin/dashboard');
    return { success: true };
  } catch (error) {
    console.error('Error assigning case:', error);
    return { success: false, error: error.message };
  }
}
