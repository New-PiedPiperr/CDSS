import { auth } from '@/auth';
import connectDB from '@/lib/db/connect';
import User, { ROLES } from '@/models/User';
import { uploadFile } from '@/lib/cloudinary';
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const session = await auth();
    if (!session || session.user.role !== ROLES.CLINICIAN) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get('file');

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Retrieve user current avatar to possibly delete it?
    // Cloudinary upload handles replacement if public_id is same, but here we usually generate new.
    // We will just upload.

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const uploadResult = await uploadFile(buffer, {
      preset: 'avatar',
      customOptions: {
        folder: `cdss/avatars/${session.user.id}`, // Organize by user
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

    return NextResponse.json({ avatarUrl: user.avatar });
  } catch (error) {
    console.error('Error uploading avatar:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
