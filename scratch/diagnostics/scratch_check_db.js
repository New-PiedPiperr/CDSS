import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import connectDB from './src/lib/db/connect.js';
import DiagnosisSession from './src/models/DiagnosisSession.js';

// Manually parse .env.local to load MONGODB_URI
try {
  const envPath = path.resolve('.env.local');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    envContent.split('\\n').forEach(line => {
      const parts = line.split('=');
      if (parts.length >= 2) {
        const key = parts[0].trim();
        const value = parts.slice(1).join('=').trim().replace(/^["']|["']$/g, '');
        process.env[key] = value;
      }
    });
  }
} catch (e) {
  console.error('Failed to load .env.local:', e);
}

async function checkSessions() {
  await connectDB();
  console.log('Connected to DB');

  const latestSession = await DiagnosisSession.findOne().sort({ createdAt: -1 });
  if (!latestSession) {
    console.log('No sessions found');
    process.exit(0);
  }

  console.log('Latest Session ID:', latestSession._id);
  console.log('Status:', latestSession.status);
  console.log('Body Region:', latestSession.bodyRegion);
  console.log('Diagnosis:', JSON.stringify(latestSession.aiAnalysis, null, 2));
  console.log('Assessment Trace Summary:');
  const trace = latestSession.assessmentTrace || {};
  console.log('  isComplete:', trace.isComplete);
  console.log('  completionReason:', trace.completionReason);
  console.log('  primarySuspicion:', JSON.stringify(trace.primarySuspicion, null, 2));
  console.log('  ruledOutConditions:', trace.ruledOutConditions);
  console.log('  questionsAnswered:', trace.questionsAnswered.map(qa => ({ q: qa.questionId, a: qa.answer })));

  process.exit(0);
}

checkSessions().catch(err => {
  console.error(err);
  process.exit(1);
});
