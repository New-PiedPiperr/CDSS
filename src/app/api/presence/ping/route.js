import { auth } from '@/auth';
import { NextResponse } from 'next/server';
import connectDB from '@/lib/db/connect';
import User from '@/models/User';

export async function POST(req) {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    // Update lastSeenAt
    await User.findByIdAndUpdate(session.user.id, {
      lastSeenAt: new Date(),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Presence ping error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
