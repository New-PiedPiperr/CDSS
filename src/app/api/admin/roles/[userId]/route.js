import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import connectDB from '@/lib/db/connect';
import { User, ROLES } from '@/models';
import { logAudit } from '@/lib/audit';

export async function PATCH(req, { params }) {
  try {
    const session = await auth();
    if (!session || session.user.role !== ROLES.ADMIN) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { userId } = await params;
    const body = await req.json();
    const { role, verified, isActive } = body;

    if (userId === session.user.id) {
      return NextResponse.json(
        { error: 'Admin cannot demote or suspend themselves' },
        { status: 403 }
      );
    }

    await connectDB();
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const metadata = {};

    if (role !== undefined) {
      if (role !== ROLES.PATIENT && role !== ROLES.CLINICIAN) {
        return NextResponse.json({ error: 'Invalid role' }, { status: 400 });
      }
      user.role = role;
      metadata.role = role;
    }

    if (verified !== undefined) {
      if (user.role === ROLES.CLINICIAN) {
        user.professional.verified = verified;
      } else {
        user.isVerified = verified;
      }
      metadata.verified = verified;
    }

    if (isActive !== undefined) {
      user.isActive = isActive;
      metadata.isActive = isActive;
    }

    await user.save();

    await logAudit({
      adminId: session.user.id,
      action: 'UPDATE_USER_ROLE_AND_STATUS',
      targetUserId: userId,
      metadata,
    });

    return NextResponse.json({
      id: user._id,
      role: user.role,
      verified:
        user.role === ROLES.CLINICIAN ? user.professional.verified : user.isVerified,
      isActive: user.isActive,
    });
  } catch (error) {
    console.error('Role update error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
