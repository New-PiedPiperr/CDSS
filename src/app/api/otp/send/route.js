import { NextResponse } from 'next/server';
import { otpService } from '@/services/otpService';
import encryptPassword from '@/lib/encryptPassword';

const rateLimitMap = new Map();

export async function POST(req) {
  try {
    const { email, firstName, lastName, password } = await req.json();

    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      return NextResponse.json({ error: 'Valid email is required' }, { status: 400 });
    }

    // Rate limiting: 1 request per 60 seconds per email
    const now = Date.now();
    const lastRequest = rateLimitMap.get(email);
    if (lastRequest && now - lastRequest < 60000) {
      return NextResponse.json(
        { error: 'Please wait before requesting another OTP.' },
        { status: 429 }
      );
    }
    rateLimitMap.set(email, now);

    let registrationData = null;
    if (firstName && lastName && password) {
      const passwordHash = await encryptPassword(password);
      registrationData = {
        firstName,
        lastName,
        password_hash: passwordHash,
      };
    }

    await otpService.sendOtp(email, registrationData);

    return NextResponse.json({ success: true, message: 'OTP sent successfully' });
  } catch (error) {
    console.error('OTP Send Error:', error);
    return NextResponse.json({ error: 'Failed to send OTP' }, { status: 500 });
  }
}
