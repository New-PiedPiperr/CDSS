'use client';

import useAssessmentStore from '@/store/assessmentStore';
import { MEDICAL_RULES } from '@/constants/medicalRules';

/**
 * PROGRESS BAR COMPONENT
 * =======================
 * Shows the patient's progress through the assessment flow.
 *
 * FLOW ORDER:
 * 1. biodata   → Patient confirms biodata (Step 0 - no bar shown yet)
 * 2. body-map  → Patient selects body region (Step 1)
 * 3. questions → Dynamic symptom questions
 * 4. upload    → Supporting documents
 * 5. summary   → Review and submit
 * 6. complete  → Confirmation
 */
export default function ProgressBar() {
  const { currentStep, history, selectedRegion, biodataConfirmed } = useAssessmentStore();

  // Don't show progress bar during biodata confirmation (it's a pre-step)
  if (currentStep === 'biodata') return null;

  // Don't show on body-map if biodata not confirmed (shouldn't happen due to guardrails)
  if (!biodataConfirmed) return null;

  // Simple heuristic for progress during questioning
  // In a real logic tree, total length is variable, so we estimate based on average path
  let progress = 0;
  let label = '';

  if (currentStep === 'body-map') {
    progress = 10;
    label = 'Select Body Region';
  } else if (currentStep === 'questions') {
    const historyLength = history.length;
    // Assume average assessment is ~15 questions
    // Start from 15% (after body-map) and go up to 85%
    progress = Math.min(15 + (historyLength / 15) * 70, 85);
    label = `Question ${historyLength + 1} of ~15`;
  } else if (currentStep === 'upload') {
    progress = 90;
    label = 'Supporting Documents';
  } else if (currentStep === 'summary') {
    progress = 95;
    label = 'Ready to Submit';
  } else if (currentStep === 'complete') {
    progress = 100;
    label = 'Complete';
  }

  return (
    <div className="mx-auto mb-12 w-full max-w-2xl">
      <div className="mb-2 flex items-end justify-between">
        <span className="text-xs font-bold tracking-widest text-slate-400 uppercase dark:text-slate-500">
          Your Assessment
        </span>
        <span className="text-primary text-sm font-bold">{label}</span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
        <div
          className="bg-primary h-full transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
