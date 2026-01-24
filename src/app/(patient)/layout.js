/**
 * Patient Portal Layout
 * Shared layout for all patient-facing routes
 */

export const metadata = {
  title: 'CDSS - Patient Portal',
  description: 'Clinical Decision Support System - Patient Interface',
};

export default function PatientLayout({ children }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      {/* Patient-specific header could go here */}
      <main>{children}</main>
    </div>
  );
}
