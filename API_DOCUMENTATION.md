# CDSS API Documentation

## 1. Overview
### High-level Purpose
The Clinical Decision Support System (CDSS) is a specialized platform designed for musculoskeletal (MSK) health assessment. It leverages a rule-based heuristic engine and AI-driven preliminary analysis to provide patients with immediate diagnostic insights while facilitating seamless workflows for clinicians.

### Target Audience
- **Frontend Engineers**: Integrating assessment forms, patient dashboards, and clinician review interfaces.
- **Backend Engineers**: Maintaining API routes, ML bridge services, and database schemas.
- **samkiell**: Enhancing the heuristic engine and integrating Python-based ML models.

### Core Design Philosophy
- **Safety First**: All automated diagnoses are labeled as "Provisional" and requires clinician review.
- **Interoperability**: Standardized data contracts for symptoms and clinical findings.
- **Hybrid Intelligence**: Combining rule-based logic (heuristic engine) with Large Language Models (LLM) for reasoning.

---

## 2. Architecture Summary
### Request Flow
1. **Assessment Phase**: Patient selects a body region and answers dynamic MD-driven questions.
2. **Analysis Phase**:
   - Heuristic Engine calculates weighted match scores for MSK conditions.
   - Mistral AI Agent performs qualitative reasoning on the symtpoms.
3. **Persistence Phase**: Session data is stored in MongoDB, and a unique `CaseFileID` is generated.
4. **Review Phase**: Clinicians access the session via the Dashboard to provide final validation.

### Key Modules
- **`src/lib/decision-engine`**: Pure JS heuristic engine for pattern matching.
- **`src/lib/ai-agent`**: Integration with Mistral AI for preliminary analysis.
- **`src/services/otpService`**: Handles verification codes and secure registration.
- **`src/lib/ml-bridge`**: (Planned) Interface for Python ML server.

### Communication
- RESTful JSON APIs via Next.js Route Handlers.
- State management via Zustand (Assessment Store) on the frontend.
- Authentication via NextAuth.js (Session) and custom JWT (External).

---

## 3. Environment & Configuration
### Required Variables
| Variable | Description | Example |
| :--- | :--- | :--- |
| `MONGODB_URI` | Connection string for MongoDB Atlas/Local | `mongodb+srv://...` |
| `AUTH_SECRET` | Secret for NextAuth.js sessions | `generated-uuid-here` |
| `JWT_SECRET` | Secret for custom API tokens | `app-secret-here` |
| `CLOUDINARY_URL` | Integration for medical image storage | `cloudinary://...` |
| `EMAIL` | System email for OTP delivery | `verify@cdss.com` |
| `EMAIL_APP_PWD` | App password for Gmail/SMTP | `xxxx xxxx xxxx xxxx` |
| `MISTRAL_API_KEY` | Key for AI preliminary analysis | `mistral-api-key` |

---

## 4. API Conventions
### Base URL
- Internal: `/api` (Next.js Routes)
- External (Proposed): `/api/v1`

### Format
- **Request**: `Content-Type: application/json`
- **Response**: Standardized JSON wrapper
```json
{
  "success": true,
  "data": { ... }, // Optional for success
  "message": "Reasoning if applicable", 
  "error": "Error description if success=false"
}
```

### Error Handling
- `400 Bad Request`: Validation failure.
- `401 Unauthorized`: Missing or invalid session/token.
- `403 Forbidden`: Insufficient role permissions.
- `429 Too Many Requests`: Rate limit hit (e.g., OTP).
- `500 Internal Server Error`: Server-side crash.

---

## 5. Authentication & Authorization
### Mechanism
- **Web App**: NextAuth.js (Cookies/Session Strategy).
- **Service-to-Service**: Bearer JWT.

### Protected Routes
- `/api/assessment/*`: Requires `PATIENT` or `ADMIN` role.
- `/api/diagnosis (POST)`: Requires `PATIENT` or `ADMIN` role.
- `/api/diagnosis (PATCH/DELETE)`: Requires `CLINICIAN` or `ADMIN` role.

---

## 6. Present / Current API Endpoints

### Authentication & OTP
#### `POST /api/otp/send`
Requests a 4-digit verification code to be sent via email.
- **Body**:
  ```json
  {
    "email": "user@example.com",
    "firstName": "John", // Optional, for registration
    "lastName": "Doe",   // Optional, for registration
    "password": "SecurePassword123" // Optional, for registration
  }
  ```
- **Response**: `{ "success": true, "message": "OTP sent successfully" }`

#### `POST /api/otp/verify`
Verifies the OTP and activates the account (or creates it if registration data was provided in `send`).
- **Body**: `{ "email": "user@example.com", "otp": "1234" }`
- **Response**: `{ "success": true, "message": "OTP verified successfully" }`

#### `POST /api/auth/login`
Direct JWT-based login (Alternative to NextAuth).
- **Body**: `{ "email": "user@example.com", "password": "password" }`
- **Response**: `{ "success": true, "user": { ... }, "token": "JWT_STRING" }`

### Assessment & Diagnosis
#### `POST /api/assessment/submit`
Submits a complete patient assessment for clinician review.
- **Body**:
  ```json
  {
    "bodyRegion": "Lumbar Spine",
    "symptomData": [
      { "question": "Where is the pain?", "answer": "Lower Back" }
    ],
    "mediaUrls": ["https://cloudinary.com/..."]
  }
  ```
- **Response**: 
  ```json
  {
    "success": true,
    "sessionId": "mongo_id",
    "aiAnalysis": { "temporalDiagnosis": "...", "confidenceScore": 85, "riskLevel": "Low" },
    "caseFileId": "firstname_lastname-suffix"
  }
  ```

#### `GET /api/diagnosis`
Retrieves a list of diagnosis sessions.
- **Query Params**: `patientId`, `status`, `page`, `limit`.
- **Response**: `{ "success": true, "data": [...], "pagination": { ... } }`

#### `PATCH /api/diagnosis/[id]`
Updates a session (primarily used for Clinician Review).
- **Body**:
  ```json
  {
    "sessionStatus": "reviewed",
    "clinicianReview": {
      "confirmedDiagnosis": "Lumbar Disc Herniation",
      "notes": "Patient shows classic signs..."
    }
  }
  ```

### File Upload
#### `POST /api/upload`
Uploads a file directly to the server which then proxies to Cloudinary.
- **Body**: `FormData` containing `file`, `preset`, `sessionId`.

#### `GET /api/upload`
Generates a signed upload signature for direct client-to-Cloudinary uploads.
- **Query Params**: `preset`.

---

## 7. Internal Services & Utilities
- **`Decision Engine`**: Uses a weighted similarity algorithm to match symptoms against defined `CONDITION_PATTERNS`.
- **`Mistral AI Integration`**: Used for generating "Clinical Reasoning" bullet points by processing symptom vectors with an LLM.
- **`Cloudinary Helper`**: Encapsulates signature generation and context-aware uploading.

---

## 8. Data Models & Contracts
### User
- `email`: String (Unique, Indexed)
- `role`: Enum [`PATIENT`, `CLINICIAN`, `ADMIN`]
- `isVerified`: Boolean (OTP flag)

### DiagnosisSession
- `patientId`: ObjectId (Ref User)
- `bodyRegion`: String
- `symptomData`: Array of `{ question: String, answer: Mixed }`
- `aiAnalysis`: Object containing `temporalDiagnosis`, `confidenceScore`, `riskLevel`, `reasoning`.
- `status`: Enum [`pending_review`, `assigned`, `completed`]

---

## 9. Future / Planned APIs (FUTURE)
*Labeled as future based on stubs in `src/lib/ml-bridge/index.js` and architectural placeholders.*

#### `POST /api/ml/diagnosis`
**Intended Purpose**: High-precision diagnosis using Bayesian or Neural networks.
- **Proposed Route**: `/api/ml/diagnosis`
- **Expected Shape**: Input `symptoms[]`, Output `posteriorProbabilities[]`.

#### `GET /api/ml/explain/[sessionId]`
**Intended Purpose**: Provide SHAP/LIME based interpretability for AI decisions.
- **Proposed Route**: `/api/ml/explain`

#### `POST /api/ml/train`
**Intended Purpose**: Retrain models using verified clinician-reviewed sessions.

#### `GET/POST /api/appointments` (INFERRED)
**Intended Purpose**: Manage patient-clinician consultations.
- **Why**: `Appointment.js` model exists but routes are pending.

#### `GET/PATCH /api/treatment-plans` (INFERRED)
**Intended Purpose**: Track recovery progress and assigned exercises.
- **Why**: `TreatmentPlan.js` model exists with progress tracking logic.

---

## 10. Frontend Integration Guide
### Multi-step Assessment Flow
1. Fetch latest assessment state from `useAssessmentStore`.
2. Step 1: `BodyMapPicker` -> updates `selectedRegion`.
3. Step 2: `QuestionCard` -> dynamic questions based on `MEDICAL_RULES` for that region.
4. Step 3: `SupportingMediaGrid` -> uses `POST /api/upload`.
5. Step 4: `Summary` -> calls `POST /api/diagnosis/ai-analysis` for a preview.
6. Step 5: `Final Submit` -> calls `POST /api/assessment/submit`.

---

## 11. Backend Development Guidelines
- **Route Creation**: All new routes must use `NextResponse`.
- **Database**: Always use `await connectDB()` at the start of the handler.
- **Models**: Place new schemas in `src/models` and export using the "recompiled prevention" pattern.
- **Validation**: Use regex or Joi/Zod (proposed) for input validation before DB calls.

---

## 12. Appendix
### Glossary
- **Temporal Diagnosis**: An immediate, automated assessment based on current symptoms.
- **Differential Diagnosis**: Alternative conditions that should be considered.
- **Red Flags**: Symptoms indicating serious or life-threatening conditions requiring urgent care.

### Known Limitations
- Heuristic engine results are currently static and do not account for patient history (past injuries).
- File uploads are limited by Cloudinary's free/standard tier limits.
