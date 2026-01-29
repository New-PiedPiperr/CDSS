import { auth } from '@/auth';
import connectDB from '@/lib/db/connect';
import User, { ROLES } from '@/models/User';
import { profileSchema } from '@/lib/validations/clinician-settings';
import { NextResponse } from 'next/server';

export async function PATCH(req) {
  try {
    const session = await auth();
    if (!session || session.user.role !== ROLES.CLINICIAN) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const validation = profileSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validation.error.flatten() },
        { status: 400 }
      );
    }

    const { firstName, lastName, phone, timezone, bio, avatarUrl } = validation.data;

    await connectDB();

    const user = await User.findByIdAndUpdate(
      session.user.id,
      {
        $set: {
          firstName,
          lastName,
          phone,
          timezone,
          bio,
          avatar: avatarUrl,
        },
      },
      { new: true, runValidators: true }
    );

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone || '',
      avatarUrl: user.avatar,
      timezone: user.timezone,
      bio: user.bio,
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
