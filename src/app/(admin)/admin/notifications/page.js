import React, { useState, useEffect } from 'react';
import { Bell, Send, AlertCircle, Info, Megaphone, Trash2, Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, Button, Badge } from '@/components/ui';
import { toast } from 'sonner';

export default function AdminNotificationsPage() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'SYSTEM',
    targetRole: 'ALL',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);

  // Fetch history on mount
  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const response = await fetch('/api/admin/notifications');
      if (!response.ok) throw new Error('Failed to fetch history');
      const data = await response.json();
      setHistory(data);
    } catch (error) {
      console.error(error);
      toast.error('Could not load announcement history');
    } finally {
      setIsLoadingHistory(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.description) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/admin/notifications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Failed to send notification');

      toast.success('Broadcast notification sent successfully!');
      setFormData({
        title: '',
        description: '',
        type: 'SYSTEM',
        targetRole: 'ALL',
      });
      fetchHistory(); // Refresh history
    } catch (error) {
      console.error(error);
      toast.error('System error: Could not broadcast notification.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (
      !confirm(
        'Are you sure you want to delete this broadcast? This action cannot be undone.'
      )
    ) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/notifications/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete');

      toast.success('Broadcast removed from history');
      setHistory(history.filter((h) => h._id !== id));
    } catch (error) {
      console.error(error);
      toast.error('Could not delete notification');
    }
  };

  return (
    <div className="mx-auto max-w-5xl space-y-10 pb-12">
      <header className="flex flex-col gap-2 px-2">
        <h2 className="text-foreground text-3xl font-bold tracking-tight uppercase">
          Broadcast Engine
        </h2>
        <p className="text-muted-foreground font-medium">
          Deploy system-wide alerts, clinical updates, or patient announcements to the
          entire network.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
        {/* Creation Form */}
        <div className="lg:col-span-2">
          <Card className="bg-card h-full overflow-hidden rounded-[2.5rem] border-none shadow-sm">
            <CardHeader className="p-8 pb-0">
              <CardTitle className="flex items-center gap-3 text-xl font-bold tracking-tight uppercase">
                <Megaphone className="text-primary h-6 w-6" />
                Create New Broadcast
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                  <div className="space-y-3">
                    <label className="text-muted-foreground ml-1 text-[10px] font-bold tracking-widest uppercase">
                      Broadcast Title
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. System Maintenance Update"
                      value={formData.title}
                      onChange={(e) =>
                        setFormData({ ...formData, title: e.target.value })
                      }
                      className="border-border bg-muted/30 focus:ring-primary/20 h-14 w-full rounded-2xl px-6 text-sm font-medium focus:ring-2 focus:outline-none"
                      required
                    />
                  </div>

                  <div className="space-y-3">
                    <label className="text-muted-foreground ml-1 text-[10px] font-bold tracking-widest uppercase">
                      Notification Category
                    </label>
                    <select
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                      className="border-border bg-muted/30 focus:ring-primary/20 h-14 w-full rounded-2xl px-6 text-sm font-medium focus:ring-2 focus:outline-none"
                    >
                      <option value="SYSTEM">System Notice</option>
                      <option value="ALERT">Alert / Urgent</option>
                      <option value="UPDATE">Product Update</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-muted-foreground ml-1 text-[10px] font-bold tracking-widest uppercase">
                    Target Audience
                  </label>
                  <div className="flex gap-4">
                    {[
                      { id: 'ALL', label: 'Global (Everyone)' },
                      { id: 'PATIENT', label: 'Patients Only' },
                      { id: 'CLINICIAN', label: 'Clinicians Only' },
                    ].map((role) => (
                      <button
                        key={role.id}
                        type="button"
                        onClick={() => setFormData({ ...formData, targetRole: role.id })}
                        className={`h-12 flex-1 rounded-xl text-[10px] font-bold tracking-widest uppercase transition-all ${
                          formData.targetRole === role.id
                            ? 'bg-primary shadow-primary/20 text-white shadow-lg'
                            : 'bg-muted/30 text-muted-foreground hover:bg-muted/50'
                        }`}
                      >
                        {role.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-muted-foreground ml-1 text-[10px] font-bold tracking-widest uppercase">
                    Notification Message
                  </label>
                  <textarea
                    placeholder="Type the announcement details here..."
                    rows={5}
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    className="border-border bg-muted/30 focus:ring-primary/20 w-full rounded-[1.5rem] p-6 text-sm font-medium focus:ring-2 focus:outline-none"
                    required
                  />
                </div>

                <div className="pt-4">
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="bg-primary shadow-primary/20 h-14 w-full gap-3 rounded-2xl text-xs font-bold tracking-widest text-white uppercase shadow-lg transition-all hover:scale-[1.01]"
                  >
                    {isLoading ? (
                      <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    ) : (
                      <>
                        <Send className="h-4 w-4" />
                        Deploy Broadcast
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* History Sidebar */}
        <div className="lg:col-span-1">
          <Card className="bg-card flex h-full flex-col overflow-hidden rounded-[2.5rem] border-none shadow-sm">
            <CardHeader className="p-8 pb-0">
              <CardTitle className="flex items-center gap-3 text-lg font-bold tracking-tight uppercase">
                <Bell className="text-primary h-5 w-5" />
                Sent History
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto p-8">
              {isLoadingHistory ? (
                <div className="flex h-32 items-center justify-center">
                  <div className="border-primary/30 border-t-primary h-6 w-6 animate-spin rounded-full border-2" />
                </div>
              ) : history.length === 0 ? (
                <div className="text-muted-foreground py-10 text-center text-xs font-medium italic">
                  No broadcasts deployed yet.
                </div>
              ) : (
                <div className="space-y-6">
                  {history.map((item) => (
                    <div
                      key={item._id}
                      className="group border-border/50 relative space-y-3 rounded-2xl border bg-gray-50/50 p-4 transition-colors hover:bg-white dark:bg-gray-800/50 dark:hover:bg-gray-800"
                    >
                      <div className="flex items-start justify-between">
                        <Badge
                          className={cn(
                            'rounded-full px-2 py-0.5 text-[8px] font-black uppercase',
                            item.type === 'ALERT'
                              ? 'bg-red-500 text-white'
                              : item.type === 'UPDATE'
                                ? 'bg-amber-500 text-white'
                                : 'bg-primary text-white'
                          )}
                        >
                          {item.type}
                        </Badge>
                        <button
                          onClick={() => handleDelete(item._id)}
                          className="text-muted-foreground transition-colors hover:text-red-500"
                          title="Delete broadcast"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <div>
                        <h4 className="text-foreground line-clamp-1 text-xs font-bold">
                          {item.title}
                        </h4>
                        <p className="text-muted-foreground mt-1 line-clamp-2 text-[10px] leading-relaxed">
                          {item.description}
                        </p>
                      </div>
                      <div className="border-border/50 flex items-center justify-between border-t pt-2">
                        <div className="flex items-center gap-1.5 opacity-60">
                          <Users className="h-3 w-3" />
                          <span className="text-[9px] font-bold tracking-wider uppercase">
                            {item.targetRole}
                          </span>
                        </div>
                        <span className="text-muted-foreground text-[9px] font-medium">
                          {new Date(item.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="bg-primary/5 border-primary/10 rounded-[2rem] border p-8">
        <div className="flex items-start gap-4">
          <Info className="text-primary mt-1 h-5 w-5 shrink-0" />
          <div>
            <h4 className="text-primary text-sm font-bold tracking-tight uppercase">
              Pro Tip: Targeted Engagement
            </h4>
            <p className="text-muted-foreground mt-1 text-xs leading-relaxed font-medium">
              When broadcasting to clinicians, focus on clinical practice updates. For
              patients, prioritize informational alerts or schedule changes. Global alerts
              should be reserved for critical system-wide milestones.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
