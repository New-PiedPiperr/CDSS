'use client';
import { ArrowLeft, Calendar, FileText, TestTube } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function CaseViewPage() {
  const router = useRouter();

  const caseData = {
    patientName: "David's Case File",
    additionalInfo: "Patient's Additional Info",
    name: 'Bola Ahmed Tinubu',
    dateOfBirth: '05-05-1988',
    sex: 'Male',
    assessmentDate: '11 November, 2025',
    diagnosis: 'Lumbar Disc Herniation',
    confidenceRate: '84%',
    vasScore: '7/10',
    oxfordScore: '4/5',
  };

  return (
    <div className="mx-auto max-w-4xl pb-8">
      {/* Header */}
      <div className="mb-6 flex items-center gap-3">
        <button
          onClick={() => router.back()}
          className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
        >
          <ArrowLeft size={24} />
        </button>
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200 dark:bg-gray-700">
          <svg className="h-6 w-6 text-gray-500 dark:text-gray-400" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
          </svg>
        </div>
        <div className="flex-1">
          <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            {caseData.patientName}
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400">{caseData.additionalInfo}</p>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="h-2.5 w-2.5 rounded-full bg-green-500"></div>
          <span className="text-xs text-gray-600 dark:text-gray-400">Currently Diagnosed</span>
        </div>
      </div>

      {/* Patient Info Card */}
      <div className="mb-6 grid grid-cols-2 gap-3 rounded-lg border border-gray-200 bg-white p-4 sm:grid-cols-4 dark:border-gray-700 dark:bg-gray-800">
        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400">Name:</p>
          <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{caseData.name}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400">Date Of Birth:</p>
          <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{caseData.dateOfBirth}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400">Sex:</p>
          <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{caseData.sex}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400">Assessment Date:</p>
          <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{caseData.assessmentDate}</p>
        </div>
      </div>

      {/* Assessment Summary */}
      <div className="mb-6 rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
        <h2 className="mb-3 text-base font-semibold text-gray-900 dark:text-gray-100">Assessment Summary</h2>
        <p className="mb-3 text-xs leading-relaxed text-gray-700 sm:text-sm dark:text-gray-300">
          Based on the completed lumbar assessment task, the patient exhibits moderate signs of lumbar disc herniation. Symptoms include lower back pain, radiating pain down the left leg (sciatica), and restricted range of motion, particularly with forward bending and flexion. The patient reported mild-to-moderate functional limitation from one typical daily
          activities such as prolonged sitting or standing.
        </p>
        
        <h3 className="mb-2 text-sm font-semibold text-gray-900 dark:text-gray-100">Key Findings</h3>
        <ul className="mb-3 space-y-1 text-xs leading-relaxed text-gray-700 sm:text-sm dark:text-gray-300">
          <li className="flex gap-2">
            <span className="text-gray-500 dark:text-gray-400">•</span>
            <span>Pain triggered by forward bending, prolonged sitting, and twisting.</span>
          </li>
          <li className="flex gap-2">
            <span className="text-gray-500 dark:text-gray-400">•</span>
            <span>Positive straight leg raise (SLR) test on the left side at 45 degrees.</span>
          </li>
          <li className="flex gap-2">
            <span className="text-gray-500 dark:text-gray-400">•</span>
            <span>Strength: Observations: Slight weakness in core stabilizers and lower back muscles.</span>
          </li>
          <li className="flex gap-2">
            <span className="text-gray-500 dark:text-gray-400">•</span>
            <span>Neurological: Mild tingling only identifies sciatica bending sitting for long periods.</span>
          </li>
        </ul>

        <h3 className="mb-2 text-sm font-semibold text-gray-900 dark:text-gray-100">Overall Assessment:</h3>
        <p className="text-xs leading-relaxed text-gray-700 sm:text-sm dark:text-gray-300">
          The findings suggest a non-specific lumbar disc-related dysfunction, likely due to posture and movement patterns rather than acute injury. Conservative treatment including strengthening exercises, posture correction, and manual therapy is recommended to improve musculoskeletal with guided physiotherapy interventions.
        </p>
      </div>

      {/* Temporary Diagnosis */}
      <div className="mb-6 rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
        <h2 className="mb-4 text-base font-semibold text-gray-900 dark:text-gray-100">Temporary Diagnosis</h2>
        
        <div className="mb-4 flex items-center justify-between rounded-lg bg-gray-50 p-6 dark:bg-gray-900">
          <h3 className="text-xl font-bold text-gray-900 sm:text-2xl dark:text-gray-100">{caseData.diagnosis}</h3>
          <div className="text-right">
            <div className="mb-1 text-3xl font-bold text-gray-900 sm:text-4xl dark:text-gray-100">{caseData.confidenceRate}</div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Confidence Rate</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-lg border border-cyan-200 bg-cyan-50 p-4 text-center dark:border-cyan-800 dark:bg-cyan-900/20">
            <div className="mb-2 text-3xl font-bold text-cyan-600 dark:text-cyan-400">{caseData.vasScore}</div>
            <p className="text-xs text-gray-600 dark:text-gray-400">VAS Scale</p>
          </div>
          <div className="rounded-lg border border-green-200 bg-green-50 p-4 text-center dark:border-green-800 dark:bg-green-900/20">
            <div className="mb-2 text-3xl font-bold text-green-600 dark:text-green-400">{caseData.oxfordScore}</div>
            <p className="text-xs text-gray-600 dark:text-gray-400">Oxford Minor Scale</p>
          </div>
        </div>
      </div>

      {/* Uploaded Documents */}
      <div className="mb-6 rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
        <h2 className="mb-4 text-base font-semibold text-gray-900 dark:text-gray-100">Uploaded Documents</h2>
        
        {/* MRI */}
        <div className="mb-4">
          <h3 className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">MRI</h3>
          <div className="grid grid-cols-3 gap-3">
            <div className="aspect-square overflow-hidden rounded-lg border border-gray-200 bg-gray-100 dark:border-gray-600 dark:bg-gray-700">
              <div className="flex h-full items-center justify-center text-xs text-gray-400">Image</div>
            </div>
            <div className="aspect-square overflow-hidden rounded-lg border border-gray-200 bg-gray-50 dark:border-gray-600 dark:bg-gray-800">
              <div className="flex h-full items-center justify-center text-xs text-gray-400 dark:text-gray-500">None</div>
            </div>
            <div className="aspect-square overflow-hidden rounded-lg border border-gray-200 bg-gray-50 dark:border-gray-600 dark:bg-gray-800">
              <div className="flex h-full items-center justify-center text-xs text-gray-400 dark:text-gray-500">None</div>
            </div>
          </div>
        </div>

        {/* X-Ray */}
        <div className="mb-4">
          <h3 className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">X-Ray</h3>
          <div className="grid grid-cols-3 gap-3">
            <div className="aspect-square overflow-hidden rounded-lg border border-gray-200 bg-gray-100 dark:border-gray-600 dark:bg-gray-700">
              <div className="flex h-full items-center justify-center text-xs text-gray-400">Image</div>
            </div>
            <div className="aspect-square overflow-hidden rounded-lg border border-gray-200 bg-gray-50 dark:border-gray-600 dark:bg-gray-800">
              <div className="flex h-full items-center justify-center text-xs text-gray-400 dark:text-gray-500">None</div>
            </div>
            <div className="aspect-square overflow-hidden rounded-lg border border-gray-200 bg-gray-50 dark:border-gray-600 dark:bg-gray-800">
              <div className="flex h-full items-center justify-center text-xs text-gray-400 dark:text-gray-500">None</div>
            </div>
          </div>
        </div>

        {/* Other Clinical Files */}
        <div className="mb-4">
          <h3 className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">Other Clinical Files</h3>
          <div className="grid grid-cols-3 gap-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="aspect-square overflow-hidden rounded-lg border border-gray-200 bg-gray-50 dark:border-gray-600 dark:bg-gray-800">
                <div className="flex h-full items-center justify-center text-xs text-gray-400 dark:text-gray-500">None</div>
              </div>
            ))}
          </div>
        </div>

        {/* Other Pictures Or Videos */}
        <div>
          <h3 className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">Other Pictures Or Videos</h3>
          <div className="grid grid-cols-3 gap-3">
            <div className="aspect-square overflow-hidden rounded-lg border border-gray-200 bg-gray-100 dark:border-gray-600 dark:bg-gray-700">
              <div className="flex h-full items-center justify-center text-xs text-gray-400">Image</div>
            </div>
            <div className="aspect-square overflow-hidden rounded-lg border border-gray-200 bg-gray-50 dark:border-gray-600 dark:bg-gray-800">
              <div className="flex h-full items-center justify-center text-xs text-gray-400 dark:text-gray-500">None</div>
            </div>
            <div className="aspect-square overflow-hidden rounded-lg border border-gray-200 bg-gray-50 dark:border-gray-600 dark:bg-gray-800">
              <div className="flex h-full items-center justify-center text-xs text-gray-400 dark:text-gray-500">None</div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
        <h2 className="mb-4 text-base font-semibold text-gray-900 dark:text-gray-100">Quick Actions</h2>
        <div className="space-y-3">
          <button className="flex w-full items-center justify-between rounded-lg bg-green-500 p-4 text-left text-white transition-colors hover:bg-green-600">
            <div>
              <div className="font-semibold">Book Appointment</div>
              <div className="text-xs opacity-90">Schedule next consultation</div>
            </div>
            <Calendar size={24} />
          </button>
          <button className="flex w-full items-center justify-between rounded-lg bg-blue-500 p-4 text-left text-white transition-colors hover:bg-blue-600">
            <div>
              <div className="font-semibold">Check Related Test</div>
              <div className="text-xs opacity-90">View test results</div>
            </div>
            <TestTube size={24} />
          </button>
          <button className="flex w-full items-center justify-between rounded-lg bg-purple-500 p-4 text-left text-white transition-colors hover:bg-purple-600">
            <div>
              <div className="font-semibold">Treatment Plan</div>
              <div className="text-xs opacity-90">Create treatment plan</div>
            </div>
            <FileText size={24} />
          </button>
        </div>
      </div>
    </div>
  );
}
