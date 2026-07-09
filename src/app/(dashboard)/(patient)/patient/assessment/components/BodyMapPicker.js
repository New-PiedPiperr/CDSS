'use client';

import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/Card';
import { MEDICAL_RULES, BODY_REGIONS } from '@/constants/medicalRules';
import useAssessmentStore from '@/store/assessmentStore';

export default function BodyMapPicker() {
  const router = useRouter();
  const selectRegion = useAssessmentStore((state) => state.selectRegion);

  const handleSelect = (region) => {
    selectRegion(region.id, MEDICAL_RULES[region.id]?.startQuestionId);
    router.push(`/patient/assessment?region=${region.id}`);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          Where is your pain located?
        </h1>
        <p className="mt-2 text-slate-500 dark:text-slate-400">
          Select the primary region of discomfort to begin your assessment.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {BODY_REGIONS.map((region) => (
          <Card
            key={region.id}
            className="hover:border-primary group cursor-pointer transition-all"
            onClick={() => handleSelect(region)}
          >
            <CardContent className="flex flex-col items-center justify-center space-y-4 py-10">
              <img
                src={`/images/${region.id}.png`}
                alt={region.name}
                className="h-20 w-20 object-contain transition-transform duration-200 group-hover:scale-110"
              />
              <span className="text-lg font-semibold">{region.name}</span>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
