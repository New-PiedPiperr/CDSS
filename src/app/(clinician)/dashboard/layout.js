'use client';

import { TopNav } from '@/components/layout/TopNav';
import Sidebar from '@/components/layout/Sidebar';
import { useUIStore } from '@/store';
import { cn } from '@/lib/cn';

export default function DashboardLayout({ children }) {
  const { isSidebarOpen } = useUIStore();

  return (
    <div className="bg-background text-foreground flex h-screen overflow-hidden">
      {/* App Sidebar (Navigation) */}
      <Sidebar />

      {/* Main Content Area */}
      <div
        className={cn(
          'flex h-full flex-1 flex-col overflow-hidden transition-all duration-300 ease-in-out',
          isSidebarOpen ? 'lg:ml-64' : 'lg:ml-20' // Adjust based on Sidebar collapsed state width
        )}
      >
        <TopNav title="Clinician Overview" showSidebarTrigger={true} />

        <main className="relative flex-1 overflow-hidden">{children}</main>
      </div>
    </div>
  );
}
