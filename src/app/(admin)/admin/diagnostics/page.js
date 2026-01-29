import connectDB from '@/lib/db/connect';
import DiagnosticModule from '@/models/DiagnosticModule';
import DiagnosticsClient from '@/components/admin/DiagnosticsClient';

async function getModules() {
  await connectDB();
  const modules = await DiagnosticModule.find({})
    .populate('createdBy', 'firstName lastName')
    .sort({ createdAt: -1 })
    .lean();

  return modules.map((m) => ({
    ...m,
    _id: m._id.toString(),
    createdBy: m.createdBy
      ? {
          ...m.createdBy,
          _id: m.createdBy._id.toString(),
        }
      : null,
    questionCount: m.questions?.length || 0,
    createdAt: m.createdAt?.toISOString(),
    updatedAt: m.updatedAt?.toISOString(),
  }));
}

export default async function AdminDiagnosticsPage() {
  const modules = await getModules();

  return <DiagnosticsClient initialModules={modules} />;
}
