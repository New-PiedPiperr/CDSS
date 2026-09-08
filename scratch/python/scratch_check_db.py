import os
from pymongo import MongoClient

# Parse .env.local manually
env_vars = {}
try:
    with open('.env.local', 'r', encoding='utf-8') as f:
        for line in f:
            line = line.strip()
            if not line or line.startswith('#'):
                continue
            if '=' in line:
                key, val = line.split('=', 1)
                env_vars[key.strip()] = val.strip().strip('"').strip("'")
except Exception as e:
    print("Failed to read .env.local:", e)

mongodb_uri = env_vars.get('MONGODB_URI') or os.environ.get('MONGODB_URI')
if not mongodb_uri:
    print("MONGODB_URI not found in env.")
    exit(1)

client = MongoClient(mongodb_uri)

# Find the database name
db_names = client.list_database_names()
print("Available databases:", db_names)
db_name = None
for name in db_names:
    if name not in ['admin', 'config', 'local']:
        db_name = name
        break
if not db_name:
    db_name = 'test' # fallback

db = client[db_name]
print("Using database:", db.name)

# Get the latest diagnosis session
session = db.diagnosissessions.find_one(sort=[('createdAt', -1)])
if not session:
    print("No sessions found in database.")
    exit(0)

print("\n--- LATEST DIAGNOSIS SESSION ---")
print("Session ID:", session.get('_id'))
print("Created At:", session.get('createdAt'))
print("Body Region:", session.get('bodyRegion'))
print("Status:", session.get('status'))
print("AI Analysis:")
ai_analysis = session.get('aiAnalysis', {})
print("  Temporal Diagnosis:", ai_analysis.get('temporalDiagnosis'))
print("  Confidence Score:", ai_analysis.get('confidenceScore'))
print("  Risk Level:", ai_analysis.get('riskLevel'))
print("  Reasoning:", ai_analysis.get('reasoning'))

print("\nAssessment Trace:")
trace = session.get('assessmentTrace', {})
print("  isComplete:", trace.get('isComplete'))
print("  completionReason:", trace.get('completionReason'))
print("  primarySuspicion:", trace.get('primarySuspicion'))
print("  ruledOutConditions:")
for cond in trace.get('conditionAnalysis', []):
    if cond.get('likelihood', 0) == 0 or cond.get('ruledOut', False):
        print(f"    {cond.get('name')}: Ruled Out")
print("  Questions Answered:")
for idx, q in enumerate(session.get('symptomData', [])):
    print(f"    {idx+1}. {q.get('question')} -> {q.get('response')}")
