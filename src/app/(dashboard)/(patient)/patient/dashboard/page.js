import { auth } from '@/auth';
import dbConnect from '@/lib/db/connect';
import { User, DiagnosisSession, Appointment, TreatmentPlan } from '@/models';
import { redirect } from 'next/navigation';
import {
  Calendar,
  User as UserIcon,
  Activity,
  ChevronRight,
  Play,
  PlusCircle,
  Video,
  Clipboard,
  Upload,
  Clock,
} from 'lucide-react';
import PainChart from '@/components/dashboard/PainChart';
import Link from 'next/link';
import Image from 'next/image';

export default async function PatientDashboardPage() {
  const session = await auth();

  if (!session || !session.user) {
    redirect('/login');
  }

  await dbConnect();

  const [patient, latestSession, appointments, treatmentPlan, pastSessions] =
    await Promise.all([
      User.findById(session.user.id).select('firstName lastName avatar'),
      DiagnosisSession.findOne({ patientId: session.user.id }).sort({ createdAt: -1 }),
      Appointment.find({ patient: session.user.id, date: { $gte: new Date() } }).sort({
        date: 1,
      }),
      TreatmentPlan.findOne({ patient: session.user.id, status: 'active' }),
      DiagnosisSession.find({ patientId: session.user.id })
        .sort({ createdAt: -1 })
        .limit(7),
    ]);

  // Aggregate pain history for the chart
  const painHistory = pastSessions
    .map((sess) => {
      // Look for pain intensity in symptoms or default to 0
      const intensityScore = sess.symptoms?.find(
        (s) => s.questionCategory === 'pain_intensity'
      )?.response;
      return {
        date: new Date(sess.createdAt).toLocaleDateString('en-US', { weekday: 'short' }),
        intensity: typeof intensityScore === 'number' ? intensityScore : 0,
      };
    })
    .reverse();

  const nextAppointment = appointments[0];

  return (
    <div className="space-y-8">
      {/* Header / Welcome Section */}
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="border-none text-2xl font-bold text-slate-900">
            Welcome Back, {patient?.firstName || session.user.firstName}!
          </h1>
          <p className="mt-1 text-slate-500">
            Here's a summary of your health progress and upcoming sessions.
          </p>
        </div>
        <div className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-white p-2 pr-4 shadow-sm">
          <div className="relative h-10 w-10 overflow-hidden rounded-full border border-blue-200 bg-blue-100">
            {patient?.avatar ? (
              <Image src={patient.avatar} alt="Profile" fill className="object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-lg font-bold text-blue-600">
                {patient?.firstName?.[0] || 'U'}
              </div>
            )}
          </div>
          <div>
            <p className="text-sm leading-none font-semibold text-slate-900">
              {patient?.firstName} {patient?.lastName}
            </p>
            <p className="mt-1 text-[10px] font-medium tracking-wider text-slate-500 uppercase">
              Patient Account
            </p>
          </div>
        </div>
      </div>

      {/* Top Stats Row */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="flex items-start gap-4 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
          <div className="rounded-xl bg-blue-50 p-3">
            <Calendar className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <p className="text-xs font-semibold tracking-tight text-slate-400 uppercase">
              Next Appointment
            </p>
            <p className="mt-1 text-lg font-bold text-slate-900">
              {nextAppointment
                ? new Date(nextAppointment.date).toLocaleDateString(undefined, {
                    month: 'short',
                    day: 'numeric',
                  })
                : 'None scheduled'}
            </p>
            {nextAppointment && (
              <p className="text-sm font-medium text-slate-500">
                {new Date(nextAppointment.date).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-start gap-4 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
          <div className="rounded-xl bg-indigo-50 p-3">
            <UserIcon className="h-6 w-6 text-indigo-600" />
          </div>
          <div>
            <p className="text-xs font-semibold tracking-tight text-slate-400 uppercase">
              Assigned Therapist
            </p>
            <p className="mt-1 text-lg font-bold text-slate-900">
              {treatmentPlan?.therapistName ||
                nextAppointment?.therapistName ||
                'Pending'}
            </p>
            <p className="text-sm font-medium text-slate-500">Physiotherapy Care</p>
          </div>
        </div>

        <div className="flex items-start gap-4 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
          <div className="rounded-xl bg-emerald-50 p-3">
            <Activity className="h-6 w-6 text-emerald-600" />
          </div>
          <div>
            <p className="text-xs font-semibold tracking-tight text-slate-400 uppercase">
              Current Condition
            </p>
            <p className="mt-1 max-w-[180px] truncate text-lg font-bold text-slate-900">
              {latestSession?.temporalDiagnosis?.primaryDiagnosis?.conditionName ||
                'Lower back pain'}
            </p>
            <p className="text-sm font-medium text-slate-500 capitalize">
              Status: {latestSession?.sessionStatus?.replace('_', ' ') || 'Evaluation'}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-12">
        {/* Main Content Area */}
        <div className="space-y-6 md:col-span-8">
          {/* Hero Assessment Card */}
          <div className="relative overflow-hidden rounded-3xl bg-blue-600 p-8 text-white shadow-lg shadow-blue-100">
            <div className="relative z-10 flex flex-col justify-between gap-8 md:flex-row md:items-center">
              <div className="max-w-md">
                <div className="mb-6 flex items-center gap-3">
                  <span className="rounded-full bg-yellow-400 px-3 py-1 text-[10px] font-black tracking-widest text-blue-900 uppercase">
                    {latestSession?.sessionStatus === 'in_progress'
                      ? 'In Progress'
                      : 'Recovery Active'}
                  </span>
                  <div className="h-1 w-1 rounded-full bg-blue-300"></div>
                  <span className="text-xs font-medium text-blue-100">
                    Last active{' '}
                    {latestSession
                      ? new Date(latestSession.updatedAt).toLocaleDateString()
                      : 'Today'}
                  </span>
                </div>
                <h2 className="mb-3 text-3xl font-bold tracking-tight">
                  {latestSession?.temporalDiagnosis?.primaryDiagnosis?.conditionName ||
                    'Ongoing Assessment'}
                </h2>
                <p className="mb-8 text-sm leading-relaxed text-blue-100 opacity-90">
                  Your recovery is our priority. Complete your current assessment or
                  follow your personalized exercise plan to speed up your healing process.
                </p>
                <div className="flex flex-col gap-4">
                  <div className="mb-2 flex items-center justify-between text-xs font-bold">
                    <span className="text-blue-100">Current Progress</span>
                    <span>
                      {latestSession?.sessionStatus === 'in_progress' ? '65%' : '100%'}
                    </span>
                  </div>
                  <div className="h-2.5 w-full rounded-full bg-blue-500/30">
                    <div
                      className="h-full rounded-full bg-white transition-all duration-1000 ease-out"
                      style={{
                        width: `${latestSession?.sessionStatus === 'in_progress' ? 65 : 100}%`,
                      }}
                    ></div>
                  </div>
                </div>
                <div className="mt-8">
                  <Link
                    href="/patient/assessment"
                    className="inline-flex items-center gap-2 rounded-2xl bg-white px-8 py-3.5 font-bold text-blue-600 shadow-sm transition-all hover:bg-blue-50 active:scale-95"
                  >
                    {latestSession?.sessionStatus === 'in_progress'
                      ? 'Continue Assessment'
                      : 'View Full Report'}
                    <ChevronRight className="h-5 w-5" />
                  </Link>
                </div>
              </div>
              <div className="hidden lg:block">
                <div className="rounded-full border border-white/10 bg-white/10 p-10 backdrop-blur-sm">
                  <Activity className="h-20 w-20 text-white opacity-80" />
                </div>
              </div>
            </div>
            {/* Abstract Background Shapes */}
            <div className="absolute top-0 right-0 -mt-20 -mr-20 h-80 w-80 rounded-full bg-gradient-to-br from-blue-400/20 to-transparent blur-3xl"></div>
            <div className="absolute bottom-0 left-0 -mb-10 -ml-10 h-40 w-40 rounded-full bg-blue-400/10 blur-2xl"></div>
          </div>

          {/* Progress Chart Section */}
          <div className="rounded-3xl border border-slate-100 bg-white p-8 shadow-sm">
            <div className="mb-8 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold tracking-tight text-slate-900">
                  Pain Recovery Journey
                </h3>
                <p className="mt-1 text-sm font-medium text-slate-500">
                  Tracking your pain intensity levels over time
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-xs font-bold tracking-wider text-slate-400 uppercase">
                  <div className="h-2 w-2 rounded-full bg-blue-600"></div>
                  Intensity Score
                </div>
              </div>
            </div>
            <PainChart history={painHistory} />
          </div>

          {/* Weekly Treatment Plan Table */}
          <div className="overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 p-8">
              <div>
                <h3 className="text-xl font-bold tracking-tight text-slate-900">
                  Active Treatment Plan
                </h3>
                <p className="mt-1 text-sm font-medium text-slate-500">
                  Personalized activities for your recovery
                </p>
              </div>
              <Link
                href="/patient/progress"
                className="rounded-xl px-4 py-2 text-sm font-bold text-blue-600 transition-colors hover:bg-blue-50"
              >
                View Full Plan
              </Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="border-b border-slate-100 bg-slate-50/50">
                  <tr>
                    <th className="px-8 py-5 text-[10px] font-black tracking-widest text-slate-400 uppercase">
                      Target Date
                    </th>
                    <th className="px-8 py-5 text-[10px] font-black tracking-widest text-slate-400 uppercase">
                      Main Goal
                    </th>
                    <th className="px-8 py-5 text-[10px] font-black tracking-widest text-slate-400 uppercase">
                      Clinical Treatment
                    </th>
                    <th className="px-8 py-5 text-[10px] font-black tracking-widest text-slate-400 uppercase">
                      Home Exercise
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {treatmentPlan?.activities?.length > 0 ? (
                    treatmentPlan.activities.map((activity, idx) => (
                      <tr key={idx} className="transition-colors hover:bg-slate-50/30">
                        <td className="px-8 py-6 text-sm font-bold whitespace-nowrap text-slate-900">
                          {new Date(activity.date).toLocaleDateString(undefined, {
                            month: 'short',
                            day: 'numeric',
                          })}
                        </td>
                        <td className="px-8 py-6 text-sm font-medium text-slate-600">
                          {activity.goal}
                        </td>
                        <td className="px-8 py-6 text-sm font-medium text-slate-600">
                          {activity.activeTreatment}
                        </td>
                        <td className="px-8 py-6 text-sm">
                          <span className="inline-flex items-center gap-2 rounded-xl bg-blue-50 px-4 py-1.5 text-xs font-bold text-blue-700">
                            <Play className="h-3 w-3 fill-current" />
                            {activity.homeExercise}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="px-8 py-20 text-center">
                        <div className="flex flex-col items-center justify-center">
                          <Clipboard className="mb-4 h-10 w-10 text-slate-200" />
                          <p className="font-medium text-slate-400 italic">
                            No specific activities scheduled for this period.
                          </p>
                          <button className="mt-4 text-xs font-bold text-blue-600 hover:underline">
                            Request Plan Update
                          </button>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Sidebar / Secondary Content */}
        <div className="space-y-6 md:col-span-4">
          {/* Quick Actions Grid */}
          <div className="grid grid-cols-2 gap-4">
            <Link
              href="/patient/assessment"
              className="group rounded-3xl border border-orange-100 bg-orange-50 p-5 transition-all hover:shadow-md"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-500 text-white shadow-lg shadow-orange-200 transition-transform group-hover:rotate-6">
                <PlusCircle className="h-6 w-6" />
              </div>
              <p className="text-sm leading-tight font-bold text-slate-900">
                Start New Assessment
              </p>
            </Link>
            <Link
              href="/patient/assessment"
              className="group rounded-3xl border border-yellow-100 bg-yellow-50 p-5 transition-all hover:shadow-md"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-yellow-500 text-white shadow-lg shadow-yellow-200 transition-transform group-hover:-rotate-6">
                <Clock className="h-6 w-6" />
              </div>
              <p className="text-sm leading-tight font-bold text-slate-900">
                Continue Case
              </p>
            </Link>
            <Link
              href="/patient/appointments"
              className="group rounded-3xl border border-emerald-100 bg-emerald-50 p-5 transition-all hover:shadow-md"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500 text-white shadow-lg shadow-emerald-200 transition-transform group-hover:scale-110">
                <Calendar className="h-6 w-6" />
              </div>
              <p className="text-sm leading-tight font-bold text-slate-900">
                Book Appointment
              </p>
            </Link>
            <Link
              href="/patient/self-test"
              className="group rounded-3xl border border-blue-100 bg-blue-50 p-5 transition-all hover:shadow-md"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500 text-white shadow-lg shadow-blue-200 transition-transform group-hover:translate-y-[-4px]">
                <Video className="h-6 w-6" />
              </div>
              <p className="text-sm leading-tight font-bold text-slate-900">
                Do Self-Test
              </p>
            </Link>
            <Link
              href="/patient/documents"
              className="group col-span-2 flex items-center justify-center rounded-3xl border-2 border-dashed border-slate-200 p-4 py-6 transition-all hover:border-blue-300 hover:bg-blue-50/30"
            >
              <div className="flex items-center gap-3">
                <Upload className="h-5 w-5 text-slate-400 group-hover:animate-bounce group-hover:text-blue-500" />
                <span className="font-bold text-slate-500 group-hover:text-slate-900">
                  Upload Medical Docs
                </span>
              </div>
            </Link>
          </div>

          {/* Appointments Card */}
          <div className="rounded-3xl border border-slate-100 bg-white p-8 shadow-sm">
            <h3 className="mb-6 text-lg font-bold tracking-tight text-slate-900">
              Upcoming Schedule
            </h3>
            <div className="space-y-4">
              {appointments.length > 0 ? (
                appointments.map((appt, idx) => (
                  <div
                    key={idx}
                    className="rounded-2xl border border-slate-100 bg-slate-50/80 p-5 transition-all hover:bg-white hover:shadow-md"
                  >
                    <div className="mb-4 flex items-start justify-between">
                      <div>
                        <p className="leading-tight font-bold text-slate-900">
                          {appt.type}
                        </p>
                        <p className="mt-2 flex items-center gap-1.5 text-xs font-medium text-slate-500">
                          <span className="inline-block h-1.5 w-1.5 rounded-full bg-blue-400"></span>
                          Dr. {appt.therapistName}
                        </p>
                      </div>
                      <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-[10px] font-black tracking-wider text-emerald-700 uppercase">
                        {appt.status}
                      </span>
                    </div>
                    <div className="flex items-center justify-between border-t border-slate-100 pt-4 text-[11px] font-bold text-slate-400">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-3.5 w-3.5" />
                        {new Date(appt.date).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric',
                        })}
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-3.5 w-3.5" />
                        {new Date(appt.date).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </div>
                    </div>
                    <div className="mt-5 flex gap-2">
                      <button className="flex-1 rounded-xl bg-blue-600 py-3 text-xs font-black text-white shadow-md shadow-blue-100 transition-colors hover:bg-blue-700 active:scale-95">
                        JOIN SESSION
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-10 text-center">
                  <Calendar className="mx-auto mb-3 h-8 w-8 text-slate-200" />
                  <p className="text-sm font-medium text-slate-400">
                    No sessions booked.
                  </p>
                  <Link
                    href="/patient/appointments"
                    className="mt-2 inline-block text-xs font-bold text-blue-600 hover:underline"
                  >
                    Schedule Now
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Clinical Tests Mini List */}
          <div className="rounded-3xl border border-slate-100 bg-white p-8 shadow-sm">
            <h3 className="mb-6 text-lg font-bold tracking-tight text-slate-900">
              Clinical Tests
            </h3>
            <div className="space-y-3">
              {[
                {
                  type: 'X-Ray: Lumbar Spine',
                  status: 'Scheduled',
                  color: 'bg-purple-100 text-purple-700',
                },
                {
                  type: 'MRI: Request Sent',
                  status: 'Pending',
                  color: 'bg-yellow-100 text-yellow-700',
                },
              ].map((test, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between rounded-2xl border border-transparent p-4 transition-colors hover:border-slate-100 hover:bg-slate-50"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-50">
                      <Clipboard className="h-4 w-4 text-slate-400" />
                    </div>
                    <span className="text-sm font-bold text-slate-700">{test.type}</span>
                  </div>
                  <span
                    className={`rounded-md px-2 py-0.5 text-[9px] font-black uppercase ${test.color} tracking-tighter`}
                  >
                    {test.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
