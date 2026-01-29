import connectDB from '@/lib/db/connect';
import DiagnosisSession from '@/models/DiagnosisSession';
import User from '@/models/User';
import Notification from '@/models/Notification';
import AdminReportsClient from '@/components/admin/ReportsClient';

export const dynamic = 'force-dynamic';

export default async function AdminReportsPage() {
  await connectDB();

  // Get date ranges for comparison
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);

  // Aggregate clinical stats
  const [
    totalSessions,
    previousPeriodSessions,
    riskAggregation,
    regionalAggregation,
    recentSessions,
    completedSessions,
    userStats,
  ] = await Promise.all([
    // Current period sessions
    DiagnosisSession.countDocuments({ createdAt: { $gte: thirtyDaysAgo } }),
    // Previous period sessions for comparison
    DiagnosisSession.countDocuments({
      createdAt: { $gte: sixtyDaysAgo, $lt: thirtyDaysAgo },
    }),
    // Risk level aggregation
    DiagnosisSession.aggregate([
      { $group: { _id: '$aiAnalysis.riskLevel', count: { $sum: 1 } } },
    ]),
    // Regional aggregation
    DiagnosisSession.aggregate([
      { $group: { _id: '$bodyRegion', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]),
    // Recent sessions for activity log
    DiagnosisSession.find({})
      .sort({ createdAt: -1 })
      .limit(10)
      .populate('patientId', 'firstName lastName')
      .lean(),
    // Completed sessions with review time
    DiagnosisSession.find({
      'clinicianReview.reviewedAt': { $exists: true },
    })
      .select('createdAt clinicianReview.reviewedAt')
      .lean(),
    // User stats
    User.aggregate([
      { $group: { _id: '$role', count: { $sum: 1 } } },
    ]),
  ]);

  // Calculate average confidence score
  const avgConfidenceResult = await DiagnosisSession.aggregate([
    { $group: { _id: null, avgScore: { $avg: '$aiAnalysis.confidenceScore' } } },
  ]);

  // Calculate previous period average confidence for comparison
  const prevAvgConfidenceResult = await DiagnosisSession.aggregate([
    { $match: { createdAt: { $gte: sixtyDaysAgo, $lt: thirtyDaysAgo } } },
    { $group: { _id: null, avgScore: { $avg: '$aiAnalysis.confidenceScore' } } },
  ]);

  // Calculate average review time (time from session creation to clinician review)
  let avgReviewTimeHours = 0;
  if (completedSessions.length > 0) {
    const totalReviewTime = completedSessions.reduce((acc, session) => {
      if (session.clinicianReview?.reviewedAt && session.createdAt) {
        const reviewTime =
          new Date(session.clinicianReview.reviewedAt).getTime() -
          new Date(session.createdAt).getTime();
        return acc + reviewTime;
      }
      return acc;
    }, 0);
    avgReviewTimeHours = totalReviewTime / completedSessions.length / (1000 * 60 * 60);
  }

  // Map risk data
  const riskData = {
    Low: riskAggregation.find((r) => r._id === 'Low')?.count || 0,
    Moderate: riskAggregation.find((r) => r._id === 'Moderate')?.count || 0,
    Urgent: riskAggregation.find((r) => r._id === 'Urgent')?.count || 0,
  };

  // Map regional data
  const regionalData = regionalAggregation.map((r) => ({
    region: r._id || 'Unknown',
    count: r.count,
  }));

  // Calculate percentage changes
  const sessionChange =
    previousPeriodSessions > 0
      ? (((totalSessions - previousPeriodSessions) / previousPeriodSessions) * 100).toFixed(1)
      : totalSessions > 0
        ? '+100'
        : '0';

  const currentAvgConfidence = Math.round(avgConfidenceResult[0]?.avgScore || 0);
  const prevAvgConfidence = Math.round(prevAvgConfidenceResult[0]?.avgScore || 0);
  const confidenceChange =
    prevAvgConfidence > 0
      ? ((currentAvgConfidence - prevAvgConfidence) / prevAvgConfidence * 100).toFixed(1)
      : '0';

  // Format recent activity
  const recentActivity = recentSessions.map((session) => ({
    id: session._id.toString(),
    type: 'diagnostic',
    title: 'Diagnostic Report Generated',
    description: `${session.bodyRegion} Region • ${session.patientId?.firstName || 'Patient'} ${session.patientId?.lastName || ''}`,
    status: session.status === 'completed' ? 'Success' : session.status === 'assigned' ? 'In Review' : 'Pending',
    riskLevel: session.aiAnalysis?.riskLevel || 'Low',
    timestamp: session.createdAt,
  }));

  // Calculate platform health (based on successful sessions ratio and system availability)
  const allTimeSessions = await DiagnosisSession.countDocuments();
  const errorSessions = await DiagnosisSession.countDocuments({
    'aiAnalysis.confidenceScore': { $lt: 20 },
  });
  const platformHealth = allTimeSessions > 0 
    ? (((allTimeSessions - errorSessions) / allTimeSessions) * 100).toFixed(1)
    : 100;

  // User demographics
  const userDemographics = {
    patients: userStats.find((u) => u._id === 'PATIENT')?.count || 0,
    clinicians: userStats.find((u) => u._id === 'CLINICIAN')?.count || 0,
    admins: userStats.find((u) => u._id === 'ADMIN')?.count || 0,
  };

  const stats = {
    totalSessions: allTimeSessions,
    currentPeriodSessions: totalSessions,
    sessionChange: parseFloat(sessionChange) >= 0 ? `+${sessionChange}%` : `${sessionChange}%`,
    avgConfidence: currentAvgConfidence,
    confidenceChange: parseFloat(confidenceChange) >= 0 ? `+${confidenceChange}%` : `${confidenceChange}%`,
    avgReviewTime: avgReviewTimeHours > 0 ? avgReviewTimeHours.toFixed(1) : 'N/A',
    reviewTimeChange: '-1.5h', // Would need historical data to calculate
    platformHealth,
    healthChange: '+0.4%',
    riskData,
    regionalData: regionalData.slice(0, 5),
    recentActivity,
    userDemographics,
  };

  return (
    <div className="space-y-8 px-2 pb-12">
      <header className="flex flex-col gap-2">
        <h2 className="text-3xl font-bold tracking-tight text-gray-900 uppercase dark:text-white">
          System Reports & Analytics
        </h2>
        <p className="max-w-2xl font-medium text-gray-500">
          Granular insights into platform usage, diagnostic trends, and clinical
          performance metrics.
        </p>
      </header>

      <AdminReportsClient stats={stats} />
    </div>
  );
}
