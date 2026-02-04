'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import {
  ArrowLeft,
  CheckCircle2,
  XCircle,
  Loader2,
  AlertTriangle,
  Stethoscope,
  Activity,
  ChevronRight,
  ClipboardList,
  Target,
} from 'lucide-react';
import { cn } from '@/lib/cn';
import { Button, Card, Badge } from '@/components/ui';
import { toast } from 'sonner';

export default function GuidedTestPage() {
  const { id } = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [isLoading, setIsLoading] = useState(true);
  const [currentTest, setCurrentTest] = useState(null);
  const [completedCount, setCompletedCount] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [testNotes, setTestNotes] = useState('');
  const [isComplete, setIsComplete] = useState(false);
  const [refinedDiagnosis, setRefinedDiagnosis] = useState(null);
  const [region, setRegion] = useState('');

  useEffect(() => {
    if (id) {
      fetchCurrentState();
    }
  }, [id]);

  const fetchCurrentState = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/diagnosis/${id}/guided-test`);
      const data = await res.json();

      if (!data.success) {
        toast.error(data.error || 'Failed to load test state');
        return;
      }

      if (data.isLocked) {
        setIsComplete(true);
        setRefinedDiagnosis(data.guidedTestResults?.refinedDiagnosis);
        setRegion(data.guidedTestResults?.region || '');
        return;
      }

      setCurrentTest(data.currentTest);
      setCompletedCount(data.completedTestsCount);
      setRegion(data.region);

      if (!data.currentTest && !data.isLocked) {
        toast.warning('No test flow available for this region.');
        router.push(`/clinician/cases/${id}`);
      }
    } catch (err) {
      console.error('Fetch error:', err);
      toast.error('Connection failed');
    } finally {
      setIsLoading(false);
    }
  };

  const recordResult = async (result) => {
    if (isRecording || !currentTest) return;

    setIsRecording(true);
    try {
      const res = await fetch(`/api/diagnosis/${id}/guided-test`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          testId: currentTest.id,
          result,
          notes: testNotes,
        }),
      });

      const data = await res.json();
      if (!data.success) throw new Error(data.error);

      setTestNotes('');

      if (data.nextState?.isComplete) {
        toast.success('Clinical flowchart completed!');
        await fetchCurrentState(); // Refresh for refined diagnosis view
      } else {
        toast.success(`Recorded: ${currentTest.name}`);
        await fetchCurrentState();
      }
    } catch (err) {
      toast.error(err.message || 'Error saving result');
    } finally {
      setIsRecording(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center">
        <Loader2 className="text-primary h-12 w-12 animate-spin" />
        <p className="text-muted-foreground mt-4 font-medium">
          Loading diagnostic sequence...
        </p>
      </div>
    );
  }

  if (isComplete) {
    return (
      <div className="animate-in fade-in slide-in-from-bottom-4 mx-auto max-w-4xl duration-500">
        <div className="mb-8 flex items-center justify-between">
          <Button variant="ghost" onClick={() => router.push(`/clinician/cases/${id}`)}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Case File
          </Button>
          <Badge className="bg-success/10 text-success border-success/20 px-4 py-1.5 text-sm font-semibold">
            <CheckCircle2 className="mr-2 h-4 w-4" />
            Clinical Testing Locked
          </Badge>
        </div>

        <Card className="overflow-hidden border-2">
          <div className="from-primary/10 bg-gradient-to-b to-transparent p-8 pb-12 text-center">
            <div className="bg-primary/20 mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full">
              <ClipboardList className="text-primary h-10 w-10" />
            </div>
            <h1 className="mb-2 text-3xl font-extrabold tracking-tight">
              Clinical Assessment Complete
            </h1>
            <p className="text-muted-foreground mx-auto max-w-lg text-lg">
              The clinical flowchart has been fully executed. A refined diagnosis has been
              generated based on the provocative test sequence.
            </p>
          </div>

          <div className="-mt-6 space-y-6 px-8 pb-8">
            {refinedDiagnosis && (
              <Card className="border-primary/20 bg-primary/5 p-6 shadow-sm">
                <div className="mb-4 flex items-center gap-3">
                  <div className="bg-primary shadow-primary/20 flex h-10 w-10 items-center justify-center rounded-xl text-white shadow-lg">
                    <Target className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-primary text-xs font-bold tracking-wider uppercase opacity-80">
                      Refined Outcome
                    </p>
                    <h2 className="text-xl font-bold">
                      {refinedDiagnosis.finalSuspectedCondition}
                    </h2>
                  </div>
                </div>

                <div className="border-primary/10 mt-4 border-t pt-4">
                  <p className="text-muted-foreground leading-relaxed italic">
                    "This diagnosis was arrived at following a strictly controlled
                    clinical Provocative Test sequence, ensuring precision and compliance
                    with established medical protocols."
                  </p>
                </div>
              </Card>
            )}

            <Button
              className="h-14 w-full text-lg font-bold"
              onClick={() => router.push(`/clinician/cases/${id}`)}
            >
              Return to Case File
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl pb-12">
      <div className="mb-8 flex items-center justify-between">
        <Button variant="ghost" onClick={() => router.push(`/clinician/cases/${id}`)}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Case
        </Button>
        <div className="flex items-center gap-4">
          <Badge variant="outline" className="px-3 py-1">
            <Stethoscope className="mr-2 h-4 w-4" />
            {region} Region
          </Badge>
          <Badge className="bg-primary text-white">Path Step: {completedCount + 1}</Badge>
        </div>
      </div>

      <div className="mb-10 text-center">
        <h1 className="mb-2 text-4xl font-black tracking-tight">
          Guided Provocative Testing
        </h1>
        <p className="text-muted-foreground text-lg">
          Strict clinical flowchart execution for diagnostic refinement.
        </p>
      </div>

      {currentTest && (
        <div className="animate-in fade-in zoom-in-95 space-y-6 duration-300">
          <Card className="relative overflow-hidden border-2 p-8 shadow-xl">
            <div className="bg-primary/5 group-hover:bg-primary/10 absolute top-0 right-0 -mt-8 -mr-8 flex h-40 w-40 items-center justify-center rounded-full opacity-50 blur-2xl transition-all" />

            <div className="relative">
              <div className="mb-6 flex items-center gap-3">
                <div className="bg-primary/10 text-primary flex h-12 w-12 items-center justify-center rounded-2xl">
                  <Activity className="h-6 w-6" />
                </div>
                <div>
                  <span className="text-primary text-sm font-black tracking-widest uppercase">
                    Current Procedure
                  </span>
                  <h2 className="text-3xl font-extrabold">{currentTest.name}</h2>
                </div>
              </div>

              <div className="bg-muted/50 border-border mb-8 rounded-2xl border p-6">
                <h3 className="text-muted-foreground mb-3 flex items-center text-sm font-bold tracking-tight uppercase">
                  Clinical Instructions
                </h3>
                <p className="text-xl leading-relaxed font-medium">
                  {currentTest.instruction}
                </p>
              </div>

              <div className="mb-8">
                <label className="text-muted-foreground mb-2 block text-sm font-bold tracking-tight uppercase">
                  Procedure Notes (Optional)
                </label>
                <textarea
                  className="border-border bg-background focus:border-primary focus:ring-primary w-full rounded-xl border-2 p-4 text-lg transition-all outline-none focus:ring-1"
                  rows={3}
                  placeholder="Record any specific observations during this test..."
                  value={testNotes}
                  onChange={(e) => setTestNotes(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <Button
                  size="lg"
                  className="h-20 bg-emerald-600 text-xl font-black tracking-wider text-white uppercase shadow-lg shadow-emerald-900/10 transition-all hover:scale-[1.02] hover:bg-emerald-700"
                  onClick={() => recordResult('positive')}
                  disabled={isRecording}
                >
                  <CheckCircle2 className="mr-3 h-7 w-7" />
                  Positive Result
                </Button>
                <Button
                  size="lg"
                  className="h-20 bg-rose-600 text-xl font-black tracking-wider text-white uppercase shadow-lg shadow-rose-900/10 transition-all hover:scale-[1.02] hover:bg-rose-700"
                  onClick={() => recordResult('negative')}
                  disabled={isRecording}
                >
                  <XCircle className="mr-3 h-7 w-7" />
                  Negative Result
                </Button>
              </div>

              <div className="text-muted-foreground mt-8 flex items-center justify-center gap-2">
                <AlertTriangle className="h-4 w-4" />
                <p className="text-xs font-bold tracking-widest uppercase">
                  Caution: Results are immutable once recorded for clinical integrity.
                </p>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
