'use client';

import { useState } from 'react';
import useAssessmentStore from '@/store/assessmentStore';
import BodyMapPicker from './components/BodyMapPicker';
import QuestionCard from './components/QuestionCard';
import ProgressBar from './components/ProgressBar';
import SupportingMediaGrid from './components/SupportingMediaGrid';
import DisclaimerModal from './components/DisclaimerModal';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { CheckCircle2, ChevronRight, FileJson } from 'lucide-react';
import { toast } from 'sonner';

export default function PatientAssessmentPage() {
  const { currentStep, responses, redFlags, files, resetAssessment, setStep } =
    useAssessmentStore();
  const [isDisclaimerOpen, setIsDisclaimerOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmitClick = () => {
    setIsDisclaimerOpen(true);
  };

  const handleFinalSubmit = async () => {
    setIsDisclaimerOpen(false);
    setIsSubmitting(true);

    try {
      const payload = {
        responses,
        redFlags,
        timestamp: new Date().toISOString(),
        assessmentType: 'MSK_HEURISTIC_V1',
        filesCount: files.length,
      };

      // Mock API call to Mistral AI endpoint
      console.log('Sending to Mistral AI Agent:', payload);

      // Simulate delay
      await new Promise((r) => setTimeout(r, 2000));

      toast.success('Assessment submitted successfully! A clinician will review it.');
      setStep('complete');
    } catch (error) {
      toast.error('Failed to submit assessment. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto min-h-screen max-w-5xl px-4 py-8 pb-32">
      <ProgressBar />

      <main className="transform-gpu transition-all duration-300">
        {currentStep === 'body-map' && <BodyMapPicker />}

        {currentStep === 'questions' && <QuestionCard />}

        {currentStep === 'upload' && <SupportingMediaGrid />}

        {currentStep === 'summary' && (
          <div className="animate-in zoom-in mx-auto max-w-2xl space-y-8 duration-300">
            <div className="text-center">
              <h2 className="text-2xl font-bold">Review Your Report</h2>
              <p className="mt-2 text-slate-500">
                Almost done. Review your answers before sending to our AI agent.
              </p>
            </div>

            <Card className="border-2 border-slate-100 dark:border-slate-800">
              <CardContent className="divide-y divide-slate-100 p-6 dark:divide-slate-800">
                <div className="flex justify-between py-4">
                  <span className="text-slate-500">Selected Region</span>
                  <span className="text-primary font-bold tracking-wide uppercase">
                    {useAssessmentStore.getState().selectedRegion}
                  </span>
                </div>
                <div className="flex justify-between py-4">
                  <span className="text-slate-500">Questions Answered</span>
                  <span className="font-bold">{Object.keys(responses).length}</span>
                </div>
                <div className="flex justify-between py-4 text-red-500">
                  <span className="font-medium">Red Flags Tagged</span>
                  <span className="font-bold">{redFlags.length}</span>
                </div>
                <div className="flex justify-between py-4">
                  <span className="text-slate-500">Supporting Files</span>
                  <span className="font-bold">{files.length}</span>
                </div>
              </CardContent>
            </Card>

            <div className="flex flex-col gap-4">
              <Button size="lg" onClick={handleSubmitClick} loading={isSubmitting}>
                Confirm and Send for AI Analysis
                <ChevronRight size={18} />
              </Button>
              <Button variant="ghost" onClick={() => setStep('upload')}>
                Go back to uploads
              </Button>
            </div>
          </div>
        )}

        {currentStep === 'complete' && (
          <div className="animate-in fade-in py-20 text-center duration-1000">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-50">
              <CheckCircle2 size={48} className="text-green-500" />
            </div>
            <h1 className="text-3xl font-bold">Assessment Received</h1>
            <p className="mx-auto mt-4 max-w-md text-slate-500">
              Your preliminary report is being processed by our AI agent and will be
              shared with your assigned clinician shortly.
            </p>
            <Button className="mt-10" variant="secondary" onClick={resetAssessment}>
              Return to Dashboard
            </Button>
          </div>
        )}
      </main>

      <DisclaimerModal
        isOpen={isDisclaimerOpen}
        onConfirm={handleFinalSubmit}
        onCancel={() => setIsDisclaimerOpen(false)}
      />
    </div>
  );
}
