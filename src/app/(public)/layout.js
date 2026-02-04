import { PublicNavbar } from '@/components/layout';

export default function PublicLayout({ children }) {
  return (
    <div className="bg-background relative min-h-screen">
      {/* Top Navigation for Public Pages */}
      <PublicNavbar />

      {/* Main Content */}
      <main className="flex min-h-[calc(100vh-64px)] flex-col items-center justify-center">
        {children}
      </main>
    </div>
  );
}
