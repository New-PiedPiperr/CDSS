import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import connectDB from '@/lib/db/connect';
import { User } from '@/models';
import { logAudit } from '@/lib/audit';

export async function PATCH(req) {
  try {
    const session = await auth();
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { firstName, lastName, phone } = body;

    // Email and Role are read-only
    if (body.email || body.role) {
      return NextResponse.json(
        { error: 'Email and Role are read-only' },
        { status: 400 }
      );
    }

    await connectDB();
    const user = await User.findById(session.user.id);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Update profile
    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (phone) user.phone = phone;

    await user.save();

    await logAudit({
      adminId: session.user.id,
      action: 'UPDATE_ADMIN_PROFILE',
      metadata: { firstName, lastName, phone },
    });

    return NextResponse.json({
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
      role: user.role,
    });
  } catch (error) {
    console.error('Admin profile update error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
