import User, { ROLES } from '@/models/User';
import connectDB from '@/lib/db/connect';
import { Card, CardContent } from '@/components/ui';
import { Search, Info, User as UserIcon } from 'lucide-react';
import { Badge, Button } from '@/components/ui';
import Link from 'next/link';
import Image from 'next/image';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';

export default async function ClinicianSearchPage({ searchParams }) {
  const session = await auth();
  if (!session || !session.user || session.user.role !== 'CLINICIAN') {
    redirect('/login');
  }

  await connectDB();
  const { q } = await searchParams;
  const query = q || '';

  let results = [];
  if (query) {
    const searchRegex = { $regex: query, $options: 'i' };
    results = await User.find({
      role: 'PATIENT',
      $or: [
        { firstName: searchRegex },
        { lastName: searchRegex },
        { email: searchRegex },
      ],
    }).lean();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="bg-primary/10 text-primary flex h-12 w-12 items-center justify-center rounded-xl">
          <Search className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Global Patient Search</h1>
          <p className="text-muted-foreground font-medium">
            {query ? (
              <>
                Showing results for <span className="text-primary">"{query}"</span>
              </>
            ) : (
              'Enter a name or email to search for patients'
            )}
          </p>
        </div>
      </div>

      <div className="mb-8">
        <form action="/clinician/search" method="GET" className="relative">
          <Search className="absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            name="q"
            defaultValue={query}
            placeholder="Search patients by name or email..."
            className="border-border bg-card focus:border-primary focus:ring-primary w-full rounded-2xl border py-4 pr-4 pl-12 text-sm focus:ring-1 focus:outline-none"
          />
        </form>
      </div>

      {query && results.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {results.map((user) => (
            <Card
              key={user._id}
              className="overflow-hidden rounded-2xl border-none shadow-sm transition-all hover:shadow-md"
            >
              <CardContent className="p-0">
                <div className="flex items-start gap-4 p-6">
                  <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full border-2 border-white shadow-sm">
                    {user.avatar ? (
                      <Image
                        src={user.avatar}
                        alt={user.firstName}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="bg-primary/10 text-primary flex h-full w-full items-center justify-center font-bold">
                        {user.firstName[0]}
                      </div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="truncate font-bold text-gray-900 dark:text-gray-100">
                        {user.firstName} {user.lastName}
                      </h3>
                      <Badge variant="secondary" className="text-[10px] uppercase">
                        Patient
                      </Badge>
                    </div>
                    <p className="truncate text-sm text-gray-500">{user.email}</p>

                    <div className="mt-4 flex gap-2">
                      {/* Assuming we want to view their profile/cases */}
                      <Button
                        asChild
                        size="sm"
                        variant="outline"
                        className="h-8 w-full text-xs"
                      >
                        <Link href={`/clinician/patients?id=${user._id}`}>
                          View Profile
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : query ? (
        <Card className="bg-card rounded-[2rem] border-none shadow-sm">
          <CardContent className="flex flex-col items-center justify-center py-20 text-center">
            <div className="bg-muted mb-4 flex h-16 w-16 items-center justify-center rounded-full">
              <Info className="text-muted-foreground h-8 w-8" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              No matches found
            </h3>
            <p className="text-muted-foreground mt-2 max-w-sm">
              We couldn't find any patients matching "{query}". Try checking for typos or
              use a different keyword.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 opacity-50">
          <UserIcon className="text-muted-foreground mb-4 h-16 w-16" />
          <p className="text-xl font-medium">Search for a patient to begin</p>
        </div>
      )}
    </div>
  );
}
