import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import dbConnect from '@/lib/db/connect';
import { SelfTest } from '@/models';

export async function GET() {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    const tests = await SelfTest.find({ patientId: session.user.id }).sort({
      createdAt: -1,
    });
    return NextResponse.json(tests);
  } catch (error) {
    console.error('Error fetching self-tests:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { testId, testTitle, category } = await req.json();

    if (!testId || !testTitle || !category) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    await dbConnect();

    // Check if experiment already exists (optional: user might want multiple completions over time)
    // For now, let's just create a new record for each completion
    const newTest = await SelfTest.create({
      patientId: session.user.id,
      testId,
      testTitle,
      category,
    });

    return NextResponse.json(newTest, { status: 201 });
  } catch (error) {
    console.error('Error saving self-test:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
## Error Type
Build Error

## Error Message
Parsing ecmascript source code failed

## Build Output
./src/app/(dashboard)/(patient)/patient/messages/page.js:142:1
Parsing ecmascript source code failed
  140 |   if (days === 1) return 'Yesterday';
  141 |   return `${days}d ago`;
> 142 | }
      | ^
  143 |

Expression expected

Next.js version: 16.1.4 (Turbopack)
