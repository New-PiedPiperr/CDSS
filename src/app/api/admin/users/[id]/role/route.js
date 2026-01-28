import { auth } from '@/auth';
import connectDB from '@/lib/db/connect';
import User, { ROLES } from '@/models/User';
import { NextResponse } from 'next/server';

export async function PATCH(request, context) {
  try {
    const session = await auth();
    if (!session || session.user.role !== ROLES.ADMIN) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const { params } = context;
    const { role } = await request.json();

    if (!Object.values(ROLES).includes(role)) {
      return NextResponse.json({ error: 'Invalid role' }, { status: 400 });
    }

    const updatedUser = await User.findByIdAndUpdate(params.id, { role }, { new: true });

    if (!updatedUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error('Update Role Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
