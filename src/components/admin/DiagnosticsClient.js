'use client';

import React, { useState, useMemo } from 'react';
import {
  ClipboardList,
  Settings2,
  Plus,
  Search,
  ChevronRight,
  Activity,
  FileText,
  Stethoscope,
  X,
  Loader2,
  Trash2,
  Edit,
  MoreVertical,
} from 'lucide-react';
import {
  Card,
  CardContent,
  Button,
  Badge,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui';
import { cn } from '@/lib/cn';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

const REGIONS = [
  'Lumbar',
  'Cervical',
  'Shoulder',
  'Ankle',
  'Knee',
  'Elbow',
  'Hip',
  'Wrist',
  'General',
];
const STATUSES = ['Draft', 'Review', 'Active', 'Archived'];

export default function DiagnosticsClient({ initialModules = [] }) {
  const router = useRouter();
  const [modules, setModules] = useState(initialModules);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [globalSettings, setGlobalSettings] = useState({
    defaultStatus: 'Draft',
    defaultRegion: 'Lumbar',
    requireApprovalForActive: true,
    maxQuestionsPerModule: 50,
    enableAIAssist: true,
  });
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    region: 'Lumbar',
    status: 'Draft',
  });

  const filteredModules = useMemo(() => {
    return modules.filter((module) => {
      const matchesSearch =
        module.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        module.region.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = statusFilter === 'ALL' || module.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [modules, searchQuery, statusFilter]);

  const handleCreateModule = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      toast.error('Title is required');
      return;
    }

    setIsCreating(true);
    try {
      const response = await fetch('/api/admin/diagnostic-modules', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create module');
      }

      setModules((prev) => [{ ...data.module, questionCount: 0 }, ...prev]);
      toast.success('Module created successfully!');
      setIsCreateModalOpen(false);
      setFormData({
        title: '',
        description: '',
        region: 'Lumbar',
        status: 'Draft',
      });
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeleteModule = async (moduleId) => {
    if (!confirm('Are you sure you want to delete this module?')) return;

    try {
      const response = await fetch(`/api/admin/diagnostic-modules/${moduleId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to delete module');
      }

      setModules((prev) => prev.filter((m) => m._id !== moduleId));
      toast.success('Module deleted successfully');
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="space-y-10 pb-12">
      <header className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-3xl font-black tracking-tighter text-gray-900 uppercase dark:text-white">
            Guided Diagnostics
          </h2>
          <p className="font-medium text-gray-500">
            Configure AI diagnostic heuristics and assessment flows for clinicians.
          </p>
        </div>
        <Button
          onClick={() => setIsCreateModalOpen(true)}
          className="bg-primary shadow-primary/20 h-12 gap-2 rounded-2xl px-6 font-black tracking-widest text-white uppercase shadow-lg transition-all"
        >
          <Plus className="h-5 w-5" />
          Create Module
        </Button>
      </header>

      {/* Control Bar */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        <div className="relative flex-1">
          <Search className="absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search diagnostic modules..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border-border bg-card focus:ring-primary/20 h-14 w-full rounded-2xl pr-4 pl-12 text-sm font-medium focus:ring-2 focus:outline-none"
          />
        </div>
        <div className="flex items-center gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border-border bg-card h-14 rounded-2xl px-4 text-sm font-medium"
          >
            <option value="ALL">All Statuses</option>
            {STATUSES.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
          <Button variant="outline" className="h-14 gap-2 rounded-2xl px-6 font-bold">
            <Settings2 className="h-4 w-4" />
            Global Settings
          </Button>
        </div>
      </div>

      {/* Modules Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredModules.map((module) => (
          <Card
            key={module._id}
            className="group bg-card overflow-hidden rounded-[2rem] border-none shadow-sm transition-all hover:shadow-md"
          >
            <CardContent className="p-0">
              <div className="flex flex-col">
                <div className="p-8">
                  <div className="mb-6 flex items-center justify-between">
                    <div className="bg-primary/10 text-primary rounded-xl p-3">
                      <Activity className="h-6 w-6" />
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="outline"
                        className={cn(
                          'rounded-full px-3 py-1 text-[10px] font-black tracking-widest uppercase',
                          module.status === 'Active'
                            ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-600'
                            : module.status === 'Draft'
                              ? 'border-slate-500/20 bg-slate-500/10 text-slate-600'
                              : module.status === 'Review'
                                ? 'border-amber-500/20 bg-amber-500/10 text-amber-600'
                                : 'border-red-500/20 bg-red-500/10 text-red-600'
                        )}
                      >
                        {module.status}
                      </Badge>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() =>
                              router.push(`/admin/diagnostics/${module._id}/edit`)
                            }
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Module
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDeleteModule(module._id)}
                            className="text-red-600"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>

                  <h3 className="text-foreground group-hover:text-primary mb-2 text-lg font-black transition-colors">
                    {module.title}
                  </h3>

                  <div className="text-muted-foreground flex items-center gap-4 text-xs font-bold tracking-widest uppercase">
                    <span className="flex items-center gap-1.5">
                      <Stethoscope className="h-3.5 w-3.5" />
                      {module.region}
                    </span>
                    <span className="bg-border h-1 w-1 rounded-full" />
                    <span>
                      {module.questionCount || module.questions?.length || 0} Questions
                    </span>
                  </div>
                </div>

                <div className="bg-muted/30 border-border mt-auto flex items-center justify-between border-t p-6">
                  <button
                    onClick={() => router.push(`/admin/diagnostics/${module._id}/edit`)}
                    className="text-primary text-[10px] font-black tracking-widest uppercase hover:underline"
                  >
                    Edit Flow
                  </button>
                  <ChevronRight className="text-muted-foreground h-4 w-4 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {filteredModules.length === 0 && (
          <div className="col-span-full py-12 text-center">
            <Activity className="mx-auto h-12 w-12 text-gray-300" />
            <p className="mt-4 text-lg font-semibold text-gray-500">No modules found</p>
            <p className="text-sm text-gray-400">
              {searchQuery || statusFilter !== 'ALL'
                ? 'Try adjusting your search or filters'
                : 'Create your first diagnostic module to get started'}
            </p>
          </div>
        )}
      </div>

      {/* Technical Configuration Section */}
      <section className="pt-8">
        <div className="mb-6">
          <h3 className="text-xl font-black tracking-tight text-gray-900 uppercase dark:text-white">
            Heuristic Engine Configuration
          </h3>
          <p className="text-sm font-medium text-gray-500">
            Manage the clinical confirmatory tests and weighted matching patterns.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          <Card className="group relative overflow-hidden rounded-[2.5rem] border-none bg-[#111827] p-10 text-white">
            <div className="absolute top-0 right-0 p-8 opacity-10 transition-opacity group-hover:opacity-20">
              <ClipboardList className="h-32 w-32" />
            </div>
            <div className="relative z-10">
              <h4 className="mb-4 text-2xl font-black tracking-tighter uppercase">
                Clinical Rulebook
              </h4>
              <p className="mb-8 max-w-sm text-sm font-medium text-gray-400">
                Define the clinical validation levels for regions like Lumbar, Cervical,
                and Shoulder.
              </p>
              <Button className="h-12 rounded-xl bg-white px-10 text-[10px] font-black tracking-widest text-gray-900 uppercase hover:bg-gray-100">
                Open Engine
              </Button>
            </div>
          </Card>

          <Card className="bg-primary group relative overflow-hidden rounded-[2.5rem] border-none p-10 text-white">
            <div className="absolute top-0 right-0 p-8 opacity-10 transition-opacity group-hover:opacity-20">
              <FileText className="h-32 w-32" />
            </div>
            <div className="relative z-10">
              <h4 className="mb-4 text-2xl font-black tracking-tighter uppercase">
                Diagnostic Whitepapers
              </h4>
              <p className="mb-8 max-w-sm text-sm font-medium text-white/80">
                Review and update the technical documentation powering the AI matching
                engine.
              </p>
              <Button className="text-primary h-12 rounded-xl bg-white px-10 text-[10px] font-black tracking-widest uppercase hover:bg-gray-100">
                Manage Whitepapers
              </Button>
            </div>
          </Card>
        </div>
      </section>

      {/* Create Module Modal */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-black tracking-tight uppercase">
              Create Diagnostic Module
            </DialogTitle>
            <DialogDescription>
              Create a new diagnostic assessment module for clinicians.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateModule} className="space-y-6 pt-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold">Module Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, title: e.target.value }))
                }
                placeholder="e.g., Lumbar Pain Screener"
                className="border-border bg-background focus:ring-primary/20 h-12 w-full rounded-xl border px-4 text-sm focus:ring-2 focus:outline-none"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold">Description (Optional)</label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, description: e.target.value }))
                }
                placeholder="Brief description of this diagnostic module..."
                rows={3}
                className="border-border bg-background focus:ring-primary/20 w-full resize-none rounded-xl border p-4 text-sm focus:ring-2 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold">Body Region</label>
                <select
                  value={formData.region}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, region: e.target.value }))
                  }
                  className="border-border bg-background focus:ring-primary/20 h-12 w-full rounded-xl border px-4 text-sm focus:ring-2 focus:outline-none"
                >
                  {REGIONS.map((region) => (
                    <option key={region} value={region}>
                      {region}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, status: e.target.value }))
                  }
                  className="border-border bg-background focus:ring-primary/20 h-12 w-full rounded-xl border px-4 text-sm focus:ring-2 focus:outline-none"
                >
                  {STATUSES.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <DialogFooter className="gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsCreateModalOpen(false)}
                className="h-12 rounded-xl px-6"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isCreating}
                className="h-12 gap-2 rounded-xl px-6"
              >
                {isCreating && <Loader2 className="h-4 w-4 animate-spin" />}
                Create Module
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
