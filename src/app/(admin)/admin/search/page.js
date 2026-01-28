import React from 'react';
import { Card, CardContent } from '@/components/ui';
import { Search } from 'lucide-react';

export default async function SearchPage({ searchParams }) {
  const { q } = await searchParams;
  const query = q || '';

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="bg-primary/10 text-primary flex h-12 w-12 items-center justify-center rounded-xl">
          <Search className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Search Results</h1>
          <p className="text-muted-foreground font-medium">
            Showing results for <span className="text-primary">"{query}"</span>
          </p>
        </div>
      </div>

      <Card className="bg-card rounded-[2rem] border-none shadow-sm">
        <CardContent className="flex flex-col items-center justify-center py-20 text-center">
          <div className="border-primary/20 border-t-primary h-10 w-10 animate-spin rounded-full border-4" />
          <p className="text-muted-foreground mt-4 font-medium">Searching database...</p>
        </CardContent>
      </Card>
    </div>
  );
}
