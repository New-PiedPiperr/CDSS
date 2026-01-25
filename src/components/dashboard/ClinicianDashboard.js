'use client';

import React, { useState } from 'react';
import SmartQueue from './SmartQueue';
import ConfidenceSurface from './ConfidenceSurface';
import ClinicalVitalWidgets from './ClinicalVitalWidgets';
import DecisionSupportActions from './DecisionSupportActions';
import { cn } from '@/lib/cn';
import { Menu, Layout, X, User } from 'lucide-react';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';

export default function ClinicianDashboard({ patients = [] }) {
  const [selectedPatientId, setSelectedPatientId] = useState(null);
  const [showQueueMobile, setShowQueueMobile] = useState(true);

  const selectedPatient = patients.find((p) => p._id === selectedPatientId);

  const handlePatientSelect = (patient) => {
    setSelectedPatientId(patient._id);
    if (window.innerWidth < 768) {
      setShowQueueMobile(false);
    }
  };

  // Mock logging function
  const handleLogResult = (actionTitle, result) => {
    // In production, this would call an API
    console.log(`Logged ${result} for ${actionTitle}`);
    // Show toast or feedback here
  };

  return (
    <div className="bg-background relative flex h-[calc(100vh-4rem)] overflow-hidden">
      {/* Mobile Queue Toggle */}
      {!showQueueMobile && selectedPatient && (
        <div className="absolute top-4 left-4 z-50 md:hidden">
          <Button variant="outline" size="sm" onClick={() => setShowQueueMobile(true)}>
            <Menu className="mr-2 h-4 w-4" />
            Queue
          </Button>
        </div>
      )}

      {/* Pane 1: Smart Queue (Left) */}
      <div
        className={cn(
          'border-border bg-card/30 absolute z-40 flex h-full w-full flex-shrink-0 flex-col border-r transition-transform duration-300 md:relative md:w-80 lg:w-96',
          showQueueMobile ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        )}
      >
        <SmartQueue
          patients={patients}
          selectedPatientId={selectedPatientId}
          onSelectPatient={handlePatientSelect}
        />

        <div className="absolute top-2 right-2 md:hidden">
          <Button variant="ghost" size="icon" onClick={() => setShowQueueMobile(false)}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Pane 2: Patient Details (Right / Main) */}
      <div className="bg-background/50 relative flex h-full flex-1 flex-col overflow-hidden">
        {selectedPatient ? (
          <div className="scrollbar-thin h-full overflow-y-auto">
            <div className="mx-auto max-w-6xl space-y-6 p-4 md:p-6">
              {/* Patient Header */}
              <header className="border-border/40 flex flex-col items-start justify-between gap-4 border-b pb-4 md:flex-row md:items-center">
                <div>
                  <div className="flex items-center gap-3">
                    <div className="bg-primary/10 text-primary flex h-10 w-10 items-center justify-center rounded-full text-lg font-bold">
                      {selectedPatient.firstName[0]}
                      {selectedPatient.lastName[0]}
                    </div>
                    <div>
                      <h1 className="text-foreground text-2xl leading-none font-bold">
                        {selectedPatient.fullName}
                      </h1>
                      <div className="text-muted-foreground mt-1 flex items-center gap-2 text-sm">
                        <span>
                          Patient ID: {selectedPatient._id.slice(-6).toUpperCase()}
                        </span>
                        <span>•</span>
                        <span>{selectedPatient.gender || 'Male'}</span>
                        <span>•</span>
                        <span>{selectedPatient.age || '45'} yo</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    History
                  </Button>
                  <Button size="sm">Create Care Plan</Button>
                </div>
              </header>

              <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
                {/* Main Column (Vitals & Reasoning) */}
                <div className="space-y-6 lg:col-span-8">
                  {/* Diagnostic Confidence Surface */}
                  <div className="min-h-[300px]">
                    <ConfidenceSurface aiAnalysis={selectedPatient.aiAnalysis} />
                  </div>

                  {/* Clinical Vitals (The "Essence" View) */}
                  <ClinicalVitalWidgets
                    vitals={
                      selectedPatient.vitals || {
                        vasScore: 7,
                        motorGrades: [{ name: 'L4 - Dorsiflexion', grade: 4 }],
                        rom: [
                          {
                            motion: 'Lumbar Flexion',
                            value: 35,
                            normal: 60,
                            isRestricted: true,
                          },
                        ],
                      }
                    }
                    painHistory={selectedPatient.painHistory || mockPainHistory}
                  />
                </div>

                {/* Sidebar Column (Actions & Notes) */}
                <div className="space-y-6 lg:col-span-4">
                  <div className="sticky top-6">
                    {/* Decision Support */}
                    <DecisionSupportActions
                      diagnosis={selectedPatient.aiAnalysis?.temporalDiagnosis}
                      onLogResult={handleLogResult}
                    />

                    {/* Quick Notes or Chat could go here */}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-muted-foreground animate-in fade-in flex h-full flex-col items-center justify-center duration-500">
            <Layout className="mb-4 h-16 w-16 opacity-20" />
            <p className="text-lg font-medium">Select a patient to review</p>
            <p className="text-sm opacity-60">High priority cases are marked in red</p>
          </div>
        )}
      </div>
    </div>
  );
}

// Mock data for pain history if not provided
const mockPainHistory = [
  { date: 'Jan 01', intensity: 4 },
  { date: 'Jan 05', intensity: 6 },
  { date: 'Jan 10', intensity: 5 },
  { date: 'Jan 15', intensity: 8 },
  { date: 'Jan 20', intensity: 7 },
  { date: 'Jan 25', intensity: 7 },
];
