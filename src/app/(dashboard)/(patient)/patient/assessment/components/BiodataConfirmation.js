'use client';

import { useState, useEffect } from 'react';
import useAssessmentStore from '@/store/assessmentStore';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Loader2, User, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

/**
 * SEX OPTIONS
 * ===========
 * Biological sex options for clinical assessment purposes.
 */
const SEX_OPTIONS = [
  { value: 'Male', label: 'Male' },
  { value: 'Female', label: 'Female' },
  { value: 'Other', label: 'Other' },
];

/**
 * OCCUPATION / WORKING CLASS OPTIONS
 * ===================================
 * Activity-based occupation categories relevant to MSK assessment.
 */
const OCCUPATION_OPTIONS = [
  { value: 'Student', label: 'Student' },
  { value: 'Civil servant', label: 'Civil servant' },
  { value: 'Trader', label: 'Trader' },
  { value: 'Artisan', label: 'Artisan' },
  { value: 'Bricklayer', label: 'Bricklayer' },
  { value: 'Athlete', label: 'Athlete' },
  { value: 'Retiree', label: 'Retiree' },
];

/**
 * EDUCATION OPTIONS
 * =================
 * Educational background options (select or free text).
 */
const EDUCATION_OPTIONS = [
  { value: 'Primary', label: 'Primary School' },
  { value: 'Secondary', label: 'Secondary School' },
  { value: 'Undergraduate', label: 'Undergraduate Degree' },
  { value: 'Postgraduate', label: 'Postgraduate Degree' },
  { value: 'Other', label: 'Other' },
];

/**
 * BiodataConfirmation Component
 * ==============================
 *
 * PRE-ASSESSMENT BIODATA CONFIRMATION STEP
 * This step is MANDATORY and cannot be skipped.
 *
 * BEHAVIOR:
 * 1. Loads existing patient profile data from API
 * 2. Prefills form with available data
 * 3. Patient can edit values (changes apply ONLY to this assessment)
 * 4. Patient must explicitly click "Confirm & Continue" to proceed
 *
 * IMPORTANT:
 * - Edits here do NOT update the patient's main profile/settings
 * - Biodata is snapshotted per assessment for historical accuracy
 * - This data is stored with the assessment record, not the user profile
 */
export default function BiodataConfirmation() {
  const { confirmBiodata, biodata: existingBiodata } = useAssessmentStore();

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state - will be prefilled from patient profile
  const [formData, setFormData] = useState({
    fullName: '',
    sex: '',
    age: '', // Numeric age entered by the patient
    occupation: '',
    education: '',
    height: '',
    weight: '',
    notes: '', // Optional free-text notes
  });

  // Track validation errors
  const [errors, setErrors] = useState({});

  /**
   * LOAD PATIENT PROFILE DATA
   * ==========================
   * Fetches existing patient data to prefill the form.
   * If data exists from a previous (incomplete) assessment, use that instead.
   */
  useEffect(() => {
    const loadPatientData = async () => {
      // If we already have biodata from an incomplete assessment, use it
      if (existingBiodata) {
        setFormData({
          fullName: existingBiodata.fullName || '',
          sex: existingBiodata.sex || '',
          age: existingBiodata.age != null ? String(existingBiodata.age) : '',
          occupation: existingBiodata.occupation || '',
          education: existingBiodata.education || '',
          height: existingBiodata.height != null ? String(existingBiodata.height) : '',
          weight: existingBiodata.weight != null ? String(existingBiodata.weight) : '',
          notes: existingBiodata.notes || '',
        });
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch('/api/patients/profile');
        if (response.ok) {
          const result = await response.json();
          if (result.success && result.data) {
            const { firstName, lastName, gender, dateOfBirth } = result.data;

            // Calculate age from dateOfBirth if available
            let age = '';
            if (dateOfBirth) {
              const birthDate = new Date(dateOfBirth);
              const today = new Date();
              const computedAge = today.getFullYear() - birthDate.getFullYear();
              age = String(computedAge);
            }

            // Map gender to sex option
            let sex = '';
            if (gender === 'male') sex = 'Male';
            else if (gender === 'female') sex = 'Female';
            else if (gender === 'other') sex = 'Other';

            setFormData((prev) => ({
              ...prev,
              fullName: `${firstName || ''} ${lastName || ''}`.trim(),
              sex,
              age,
            }));
          }
        }
      } catch (error) {
        console.error('Error loading patient profile:', error);
        // Non-fatal - form will just not be prefilled
      } finally {
        setIsLoading(false);
      }
    };

    loadPatientData();
  }, [existingBiodata]);

  /**
   * HANDLE INPUT CHANGE
   * ====================
   * Updates form state and clears any validation errors for the field.
   */
  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  /**
   * VALIDATE FORM
   * =============
   * Ensures all required fields are filled before proceeding.
   */
  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }
    if (!formData.sex) {
      newErrors.sex = 'Please select your sex';
    }
    const parsedAge = Number(formData.age);
    if (
      !formData.age ||
      !Number.isFinite(parsedAge) ||
      parsedAge <= 0 ||
      parsedAge > 120
    ) {
      newErrors.age = 'Please enter a valid age';
    }
    if (!formData.occupation) {
      newErrors.occupation = 'Please select your occupation type';
    }
    if (!formData.education) {
      newErrors.education = 'Please select your education level';
    }
    const parsedHeight = Number(formData.height);
    if (
      formData.height &&
      (!Number.isFinite(parsedHeight) || parsedHeight <= 0 || parsedHeight > 300)
    ) {
      newErrors.height = 'Please enter a valid height in metres';
    }
    const parsedWeight = Number(formData.weight);
    if (
      formData.weight &&
      (!Number.isFinite(parsedWeight) || parsedWeight <= 0 || parsedWeight > 500)
    ) {
      newErrors.weight = 'Please enter a valid weight in kilograms';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * HANDLE CONFIRM AND CONTINUE
   * ============================
   * Validates the form and creates a biodata snapshot for this assessment.
   *
   * IMPORTANT: This does NOT update the patient's main profile.
   * The biodata is stored ONLY with this specific assessment.
   */
  const handleConfirm = () => {
    if (!validateForm()) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);

    /**
     * BIODATA SNAPSHOT
     * =================
     * This snapshot will be stored with the assessment record.
     * It preserves the patient's information at the time of assessment.
     *
     * Why snapshot instead of reference?
     * - Patient profile may change over time
     * - Historical assessments need accurate point-in-time data
     * - Legal/audit requirements for medical records
     * - Each assessment is self-contained
     */
      const biodataSnapshot = {
        fullName: formData.fullName.trim(),
        sex: formData.sex,
        age: Number(formData.age),
        occupation: formData.occupation,
        education: formData.education,
        height: formData.height ? Number(formData.height) : null,
        weight: formData.weight ? Number(formData.weight) : null,
        notes: formData.notes.trim() || null,
      };

    // Store in assessment state and proceed to body-map
    confirmBiodata(biodataSnapshot);

    toast.success('Biodata confirmed', {
      description: 'You can now proceed with your assessment.',
    });

    setIsSubmitting(false);
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <Loader2 className="text-primary mx-auto h-10 w-10 animate-spin" />
          <p className="text-muted-foreground mt-4 text-sm font-medium">
            Loading your profile...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="bg-primary/10 mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl">
          <User className="text-primary h-8 w-8" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight">Confirm Your Information</h1>
        <p className="text-muted-foreground mt-2 text-sm">
          Please review and confirm your details before starting the assessment.
          <br />
          <span className="text-xs italic">
            This information helps us provide accurate clinical recommendations.
          </span>
        </p>
      </div>

      {/* Biodata Form Card */}
      <Card className="border-2 border-slate-100 dark:border-slate-800">
        <CardHeader>
          <CardTitle className="text-lg">Assessment Biodata</CardTitle>
          <CardDescription>
            Fields marked with * are required. Your main profile will not be updated.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Full Name */}
          <div className="space-y-2">
            <Label htmlFor="fullName" className="font-medium">
              Full Name *
            </Label>
            <Input
              id="fullName"
              type="text"
              placeholder="Enter your full name"
              value={formData.fullName}
              onChange={(e) => handleChange('fullName', e.target.value)}
              className={errors.fullName ? 'border-red-500' : ''}
            />
            {errors.fullName && (
              <p className="text-xs font-medium text-red-500">{errors.fullName}</p>
            )}
          </div>

          {/* Sex Selection */}
          <div className="space-y-2">
            <Label className="font-medium">Sex *</Label>
            <div className="grid grid-cols-3 gap-2">
              {SEX_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleChange('sex', option.value)}
                  className={`rounded-lg border-2 px-4 py-3 text-sm font-medium transition-all ${
                    formData.sex === option.value
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-slate-200 hover:border-slate-300 dark:border-slate-700 dark:hover:border-slate-600'
                  } ${errors.sex ? 'border-red-300' : ''}`}
                >
                  {option.label}
                </button>
              ))}
            </div>
            {errors.sex && (
              <p className="text-xs font-medium text-red-500">{errors.sex}</p>
            )}
          </div>

          {/* Age (numeric) — used for demographic gating of conditions */}
          <div className="space-y-2">
            <Label htmlFor="age" className="font-medium">
              Age (years) *
            </Label>
            <Input
              id="age"
              type="number"
              min="0"
              max="120"
              placeholder="e.g. 10"
              value={formData.age}
              onChange={(e) => handleChange('age', e.target.value)}
              className={errors.age ? 'border-red-500' : ''}
            />
            {errors.age && (
              <p className="text-xs font-medium text-red-500">{errors.age}</p>
            )}
          </div>

          {/* Height and Weight */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="height" className="font-medium">
                Height (m)
              </Label>
              <Input
                id="height"
                type="number"
                step="0.01"
                min="0"
                max="3"
                placeholder="e.g. 1.75"
                value={formData.height}
                onChange={(e) => handleChange('height', e.target.value)}
                className={errors.height ? 'border-red-500' : ''}
              />
              {errors.height && (
                <p className="text-xs font-medium text-red-500">{errors.height}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="weight" className="font-medium">
                Weight (kg)
              </Label>
              <Input
                id="weight"
                type="number"
                step="0.1"
                min="0"
                max="500"
                placeholder="e.g. 70"
                value={formData.weight}
                onChange={(e) => handleChange('weight', e.target.value)}
                className={errors.weight ? 'border-red-500' : ''}
              />
              {errors.weight && (
                <p className="text-xs font-medium text-red-500">{errors.weight}</p>
              )}
            </div>
          </div>

          {/* Occupation Selection */}
          <div className="space-y-2">
            <Label className="font-medium">Occupation / Working Class *</Label>
            <div className="grid grid-cols-2 gap-2">
              {OCCUPATION_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleChange('occupation', option.value)}
                  className={`rounded-lg border-2 px-4 py-3 text-left text-sm font-medium transition-all ${
                    formData.occupation === option.value
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-slate-200 hover:border-slate-300 dark:border-slate-700 dark:hover:border-slate-600'
                  } ${errors.occupation ? 'border-red-300' : ''}`}
                >
                  {option.label}
                </button>
              ))}
            </div>

            {errors.occupation && (
              <p className="text-xs font-medium text-red-500">{errors.occupation}</p>
            )}
          </div>

          {/* Education Selection */}
          <div className="space-y-2">
            <Label className="font-medium">Educational Background *</Label>
            <div className="grid grid-cols-3 gap-2">
              {EDUCATION_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleChange('education', option.value)}
                  className={`rounded-lg border-2 px-3 py-2 text-xs font-medium transition-all ${
                    formData.education === option.value
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-slate-200 hover:border-slate-300 dark:border-slate-700 dark:hover:border-slate-600'
                  } ${errors.education ? 'border-red-300' : ''}`}
                >
                  {option.label}
                </button>
              ))}
            </div>
            {errors.education && (
              <p className="text-xs font-medium text-red-500">{errors.education}</p>
            )}
           </div>

           {/* Optional Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes" className="font-medium">
              Additional Notes <span className="text-muted-foreground">(Optional)</span>
            </Label>
            <textarea
              id="notes"
              placeholder="Any relevant information you'd like to share..."
              value={formData.notes}
              onChange={(e) => handleChange('notes', e.target.value)}
              rows={3}
              className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex w-full resize-none rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
            />
            <p className="text-muted-foreground text-xs">
              E.g., recent surgeries, ongoing treatments, relevant lifestyle factors
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Confirm Button */}
      <Button
        size="lg"
        onClick={handleConfirm}
        disabled={isSubmitting}
        className="h-14 w-full text-lg font-bold"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Confirming...
          </>
        ) : (
          <>
            <CheckCircle2 className="mr-2 h-5 w-5" />
            Confirm & Continue
          </>
        )}
      </Button>

      {/* Privacy Note */}
      <p className="text-muted-foreground text-center text-xs">
        This information is used only for this assessment and will not update your main
        profile.
        <br />
        Your data is handled in accordance with our privacy policy.
      </p>
    </div>
  );
}
