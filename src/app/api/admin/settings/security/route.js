import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import connectDB from '@/lib/db/connect';
import { AdminSettings } from '@/models';
import { logAudit } from '@/lib/audit';

export async function PATCH(req) {
  try {
    const session = await auth();
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { enforceAdmin2FA, sessionTimeoutMinutes, passwordPolicy } = body;

    await connectDB();
    const settings = await AdminSettings.getSettings();

    // Update security settings
    if (enforceAdmin2FA !== undefined)
      settings.security.enforceAdmin2FA = enforceAdmin2FA;
    if (sessionTimeoutMinutes !== undefined)
      settings.security.sessionTimeoutMinutes = sessionTimeoutMinutes;
    if (passwordPolicy) {
      if (passwordPolicy.minLength !== undefined)
        settings.security.passwordPolicy.minLength = passwordPolicy.minLength;
      if (passwordPolicy.requireSpecialChar !== undefined)
        settings.security.passwordPolicy.requireSpecialChar =
          passwordPolicy.requireSpecialChar;
    }

    await settings.save();

    await logAudit({
      adminId: session.user.id,
      action: 'UPDATE_SECURITY_SETTINGS',
      metadata: body,
    });

    return NextResponse.json(settings.security);
  } catch (error) {
    console.error('Security settings update error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
