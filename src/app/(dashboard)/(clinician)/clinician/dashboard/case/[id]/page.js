import { useState } from 'react';

export default function CaseDetailsPage({ params }) {
  const { id } = params;
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [bookingData, setBookingData] = useState({
    date: '',
    time: '',
    type: 'Physiotherapy Session',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleBook = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      // For demo purposes, we'll try to use the actual ID from params.
      // If it's a mock ID (e.g. '1'), we'll fallback to a real user in the DB if needed,
      // but ideally we should be using real patient IDs throughout.
      const res = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patientId: id === '1' ? '69756da7494dd880c45762b4' : id, // Fallback for mock ID '1'
          ...bookingData,
        }),
      });

      if (res.ok) {
        alert('Appointment scheduled successfully!');
        setIsBookingOpen(false);
      } else {
        const err = await res.json();
        alert(`Error: ${err.error}`);
      }
    } catch (err) {
      alert('Failed to schedule appointment.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="animate-fade-in text-foreground mx-auto max-w-5xl space-y-8 pb-20">
      {/* Header */}
<...truncated...>
          <ReportCard
            color="bg-success/90 dark:bg-success/80"
            icon={<ClipboardList />}
            title="Book Appointment"
            desc="Schedule your next physiotherapy session with your patient."
            onClick={() => setIsBookingOpen(true)}
          />
<...truncated...>
      {/* Booking Modal */}
      {isBookingOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
          <Card className="w-full max-w-md border-none p-6 shadow-2xl">
            <h3 className="text-xl font-black">Schedule Appointment</h3>
            <p className="text-muted-foreground mt-2 text-xs font-medium">
              Select a date and time for Bola Ahmed Tinubu
            </p>

            <form onSubmit={handleBook} className="mt-6 space-y-4">
              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                  Date
                </label>
                <input
                  type="date"
                  required
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm font-bold dark:border-slate-800 dark:bg-slate-900"
                  value={bookingData.date}
                  onChange={(e) => setBookingData({ ...bookingData, date: e.target.value })}
                />
              </div>
              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                  Time
                </label>
                <input
                  type="time"
                  required
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm font-bold dark:border-slate-800 dark:bg-slate-900"
                  value={bookingData.time}
                  onChange={(e) => setBookingData({ ...bookingData, time: e.target.value })}
                />
              </div>
              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                  Session Type
                </label>
                <select
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm font-bold dark:border-slate-800 dark:bg-slate-900"
                  value={bookingData.type}
                  onChange={(e) => setBookingData({ ...bookingData, type: e.target.value })}
                >
                  <option>Physiotherapy Session</option>
                  <option>Consultation</option>
                  <option>Check-up</option>
                  <option>Follow-up</option>
                </select>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => setIsBookingOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" className="flex-1" disabled={isSubmitting}>
                  {isSubmitting ? 'Scheduling...' : 'Confirm Booking'}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
}

function ReportCard({ color, icon, title, desc, actionText = 'Book Now', onClick }) {
  return (
    <div
      className={cn(
        'flex min-h-[180px] flex-col justify-between rounded-[2rem] p-7 text-white shadow-md transition-transform hover:-translate-y-1',
        color
      )}
    >
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          {React.cloneElement(icon, { className: 'h-5 w-5' })}
          <span className="text-sm leading-none font-black tracking-tight uppercase">
            {title}
          </span>
        </div>
        <p className="line-clamp-2 text-[11px] leading-relaxed font-bold opacity-90">
          {desc}
        </p>
      </div>
      <button
        onClick={onClick}
        className="mt-4 rounded-xl bg-white py-2.5 text-[10px] font-black text-gray-900 uppercase shadow-sm transition-all hover:bg-gray-100 active:scale-95"
      >
        {actionText}
      </button>
    </div>
  );
}
