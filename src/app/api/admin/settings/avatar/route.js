import { auth } from '@/auth';
import connectDB from '@/lib/db/connect';
import { User, ROLES } from '@/models';
import { uploadFile } from '@/lib/cloudinary';
import { NextResponse } from 'next/server';
import { logAudit } from '@/lib/audit';

export async function POST(req) {
  try {
    const session = await auth();
    if (!session || session.user.role !== ROLES.ADMIN) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get('file');

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const uploadResult = await uploadFile(buffer, {
      preset: 'avatar',
      customOptions: {
        folder: `cdss/admin/avatars/${session.user.id}`,
      },
    });

    if (!uploadResult.success) {
      return NextResponse.json(
        { error: 'Image upload failed', details: uploadResult.error },
        { status: 500 }
      );
    }

    await connectDB();

    const user = await User.findByIdAndUpdate(
      session.user.id,
      { $set: { avatar: uploadResult.url } },
      { new: true }
    );

    await logAudit({
      adminId: session.user.id,
      action: 'UPDATE_ADMIN_AVATAR',
      metadata: { avatarUrl: user.avatar },
    });

    return NextResponse.json({ avatarUrl: user.avatar });
  } catch (error) {
    console.error('Error uploading admin avatar:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
