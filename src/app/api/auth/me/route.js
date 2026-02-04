import { auth } from '@/../auth';
import connectDB from '@/lib/db/connect';
import User from '@/models/User';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const session = await auth();

    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const user = await User.findById(session.user.id).select('-password');

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Log cookie size for verification as requested
    // Note: We can only see cookies sent to us
    try {
      const { cookies } = await import('next/headers');
      const cookieStore = await cookies();
      const allCookies = cookieStore.getAll();
      const totalSize = allCookies.reduce(
        (acc, cookie) => acc + cookie.name.length + cookie.value.length,
        0
      );
      console.log(
        `[Auth Verification] User ${user.email} fetched. Total cookie size: ${totalSize} bytes`
      );
    } catch (e) {
      // Ignore errors in logging
    }

    return NextResponse.json({
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        avatar: user.avatar,
        isVerified: user.isVerified,
      },
    });
  } catch (error) {
    console.error('Failed to fetch /auth/me:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
