import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import connectDB from '@/lib/db/connect';
import { AuditLog } from '@/models';

export async function GET(req) {
  try {
    const session = await auth();
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 20;
    const action = searchParams.get('action');

    await connectDB();

    const query = {};
    if (action) query.action = action;

    const skip = (page - 1) * limit;

    const logs = await AuditLog.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('adminId', 'firstName lastName email')
      .populate('targetUserId', 'firstName lastName email')
      .lean();

    const total = await AuditLog.countDocuments(query);

    return NextResponse.json({
      logs,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Audit log fetch error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
