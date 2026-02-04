'use client';

import { useState, useEffect } from 'react';
import useAssessmentStore from '@/store/assessmentStore';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Loader2, ChevronRight, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import {
  initializeEngine,
  getCurrentQuestion,
  processAnswer,
  getAssessmentSummary,
} from '@/lib/assessment-engine';

/**
 * QUESTION ENGINE COMPONENT
 * ==========================
 * Implements the dynamic branching question flow using JSON rules.
 *
 * BEHAVIOR:
 * 1. Loads region-specific JSON rules on mount
 * 2. Initializes the assessment engine
 * 3. Presents questions one at a time
 * 4. Updates condition likelihood based on answers
 * 5. Tracks rule-out decisions and red flags
 * 6. Moves to summary when all questions are answered
 *
 * TRACEABILITY:
 * All answers are recorded with timestamps and effect tracking
 * for later review by therapists.
 */
export default function QuestionEngine() {
  const {
    selectedRegion,
    engineState,
    initializeEngine: storeInitEngine,
    updateEngineState,
    completeQuestions,
    biodata,
  } = useAssessmentStore();

  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  /**
   * LOAD REGION RULES
   * ==================
   * Fetches JSON rules for the selected region and initializes the engine.
   */
  useEffect(() => {
    const loadRules = async () => {
      if (!selectedRegion) {
        setLoadError('No region selected');
        setIsLoading(false);
        return;
      }

      try {
        // Construct the path to the region's JSON file
        const regionName =
          selectedRegion.charAt(0).toUpperCase() + selectedRegion.slice(1);
        const response = await fetch(`/rules/${regionName} Region.json`);

        if (!response.ok) {
          throw new Error(`Rules not found for region: ${selectedRegion}`);
        }

        const rulesJson = await response.json();

        // Initialize the engine with loaded rules
        const initialState = initializeEngine(rulesJson);
        storeInitEngine(initialState);

        // Get the first question
        const firstQuestion = getCurrentQuestion(initialState);
        setCurrentQuestion(firstQuestion);

        setIsLoading(false);
      } catch (error) {
        console.error('Error loading region rules:', error);
        setLoadError(error.message);
        setIsLoading(false);
      }
    };

    // Only load if we don't already have engine state
    if (!engineState) {
      loadRules();
    } else {
      // Resume from existing state
      const question = getCurrentQuestion(engineState);
      setCurrentQuestion(question);
      setIsLoading(false);
    }
  }, [selectedRegion, engineState, storeInitEngine]);

  /**
   * HANDLE ANSWER SELECTION
   * ========================
   * Records user's answer selection (before submission).
   */
  const handleSelectAnswer = (answerValue) => {
    setSelectedAnswer(answerValue);
  };

  /**
   * HANDLE SUBMIT ANSWER
   * =====================
   * Processes the selected answer through the engine.
   * Updates condition states and moves to next question.
   */
  const handleSubmitAnswer = () => {
    if (!selectedAnswer || !currentQuestion || !engineState) {
      return;
    }

    setIsProcessing(true);

    try {
      // Process the answer through the engine
      const newState = processAnswer(engineState, currentQuestion.id, selectedAnswer);

      // Update store with new engine state
      updateEngineState(newState);

      // Check for red flags
      if (newState.redFlags.length > engineState.redFlags.length) {
        const newFlag = newState.redFlags[newState.redFlags.length - 1];
        toast.warning('Attention Required', {
          description: newFlag.redFlagText || 'A clinical red flag has been detected.',
        });
      }

      // Get next question
      const nextQuestion = getCurrentQuestion(newState);

      if (nextQuestion) {
        setCurrentQuestion(nextQuestion);
        setSelectedAnswer(null);
      } else {
        // No more questions - move to summary
        toast.success('Assessment Complete', {
          description: 'Please review your answers before submission.',
        });
        completeQuestions();
      }
    } catch (error) {
      console.error('Error processing answer:', error);
      toast.error('Error processing your answer. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <Loader2 className="text-primary mx-auto h-10 w-10 animate-spin" />
          <p className="text-muted-foreground mt-4 text-sm font-medium">
            Loading assessment questions...
          </p>
        </div>
      </div>
    );
  }

  // Error state
  if (loadError) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Card className="border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-900/20">
          <CardContent className="p-6 text-center">
            <AlertTriangle className="mx-auto h-10 w-10 text-red-500" />
            <h3 className="mt-4 font-bold text-red-700 dark:text-red-400">
              Unable to Load Assessment
            </h3>
            <p className="text-muted-foreground mt-2 text-sm">{loadError}</p>
            {/* TODO: Add retry button or fallback to general questions */}
          </CardContent>
        </Card>
      </div>
    );
  }

  // No question available (shouldn't happen in normal flow)
  if (!currentQuestion) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <CheckCircle2 className="text-primary mx-auto h-10 w-10" />
          <p className="text-muted-foreground mt-4 text-sm font-medium">
            Assessment questions complete. Proceeding to review...
          </p>
        </div>
      </div>
    );
  }

  // Calculate progress
  const progress = engineState
    ? Math.round((currentQuestion.answeredCount / currentQuestion.totalQuestions) * 100)
    : 0;

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      {/* Progress Header */}
      <div className="text-center">
        <p className="text-muted-foreground text-sm">
          Question {currentQuestion.answeredCount + 1} of {currentQuestion.totalQuestions}
        </p>
        <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
          <div
            className="bg-primary h-full transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        {currentQuestion.conditionName &&
          currentQuestion.conditionName !== 'General Assessment' && (
            <p className="text-muted-foreground mt-2 text-xs">
              Assessing: {currentQuestion.conditionName}
            </p>
          )}
      </div>

      {/* Question Card */}
      <Card className="border-2 border-slate-100 dark:border-slate-800">
        <CardContent className="p-6">
          {/* Question Text */}
          <h2 className="mb-6 text-lg leading-relaxed font-semibold">
            {currentQuestion.question}
          </h2>

          {/* Answer Options */}
          <div className="space-y-3">
            {currentQuestion.answers.map((answer, index) => (
              <button
                key={index}
                type="button"
                onClick={() => handleSelectAnswer(answer.value)}
                disabled={isProcessing}
                className={`w-full rounded-xl border-2 p-4 text-left transition-all ${
                  selectedAnswer === answer.value
                    ? 'border-primary bg-primary/10'
                    : 'border-slate-200 hover:border-slate-300 dark:border-slate-700 dark:hover:border-slate-600'
                } ${isProcessing ? 'cursor-not-allowed opacity-50' : ''}`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium">{answer.value}</span>
                  {selectedAnswer === answer.value && (
                    <CheckCircle2 className="text-primary h-5 w-5" />
                  )}
                </div>
                {/* Show effect indicators if present */}
                {answer.effects?.rule_out?.length > 0 && (
                  <p className="mt-1 text-xs text-orange-600">
                    Investigates: {answer.effects.rule_out.join(', ')}
                  </p>
                )}
                {answer.effects?.red_flag && (
                  <p className="mt-1 text-xs font-medium text-red-600">
                    ⚠️ Requires attention
                  </p>
                )}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Submit Button */}
      <Button
        size="lg"
        onClick={handleSubmitAnswer}
        disabled={!selectedAnswer || isProcessing}
        className="h-14 w-full text-lg font-bold"
      >
        {isProcessing ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Processing...
          </>
        ) : (
          <>
            Continue
            <ChevronRight className="ml-2 h-5 w-5" />
          </>
        )}
      </Button>

      {/* Red Flags Warning */}
      {engineState?.redFlags?.length > 0 && (
        <Card className="border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-900/20">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 shrink-0 text-red-500" />
              <div>
                <p className="font-medium text-red-700 dark:text-red-400">
                  {engineState.redFlags.length} clinical concern(s) detected
                </p>
                <p className="text-muted-foreground mt-1 text-xs">
                  These will be highlighted for the reviewing therapist.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
