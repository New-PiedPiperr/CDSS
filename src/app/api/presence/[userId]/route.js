import { NextResponse } from 'next/server';
import connectDB from '@/lib/db/connect';
import User from '@/models/User';
import { formatLastSeen } from '@/lib/utils';
import { auth } from '@/auth';

export async function GET(req, { params }) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { userId } = await params;

    await connectDB();

    const user = await User.findById(userId).select('lastSeenAt');

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const lastSeenAt = user.lastSeenAt;
    const now = new Date();
    // Online if seen within last 2 minutes
    const isOnline = lastSeenAt && now - new Date(lastSeenAt) < 2 * 60 * 1000;

    return NextResponse.json({
      lastSeenAt,
      status: isOnline ? 'ONLINE' : 'OFFLINE',
      lastSeenText: formatLastSeen(lastSeenAt),
    });
  } catch (error) {
    console.error('Presence fetch error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
