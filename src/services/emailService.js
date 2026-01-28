import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_APP_PWD,
  },
});

// App Base URL for links
const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';

/**
 * Sends a case assignment email to a clinician
 */
export const sendClinicianAssignmentEmail = async (
  clinicianEmail,
  clinicianName,
  patientName,
  sessionId
) => {
  const mailOptions = {
    from: `"CDSS Notifications" <${process.env.EMAIL}>`,
    to: clinicianEmail,
    subject: 'New Case Assigned - CDSS',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
        <h2 style="color: #007bff; text-align: center;">New Patient Case</h2>
        <p style="font-size: 16px; color: #333;">Hello Dr. ${clinicianName},</p>
        <p style="font-size: 16px; color: #555;">A new patient case has been assigned to you for review.</p>
        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 0; font-weight: bold; color: #333;">Patient Name: ${patientName}</p>
          <p style="margin: 5px 0 0 0; color: #666;">Session ID: ${sessionId}</p>
        </div>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${baseUrl}/clinician/cases/${sessionId}" style="background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">View Case Details</a>
        </div>
        <p style="font-size: 14px; color: #777;">Please log in to your dashboard to review the clinical data and AI analysis.</p>
        <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
        <p style="font-size: 12px; color: #999; text-align: center;">CDSS - Clinical Decision Support System</p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Error sending clinician assignment email:', error);
  }
};

/**
 * Sends a case assignment email to a patient
 */
export const sendPatientAssignmentEmail = async (
  patientEmail,
  patientName,
  clinicianName
) => {
  const mailOptions = {
    from: `"CDSS Notifications" <${process.env.EMAIL}>`,
    to: patientEmail,
    subject: 'Clinician Assigned to Your Case - CDSS',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
        <h2 style="color: #28a745; text-align: center;">Clinician Assigned</h2>
        <p style="font-size: 16px; color: #333;">Hello ${patientName},</p>
        <p style="font-size: 16px; color: #555;">We have assigned a clinician to review your clinical assessment.</p>
        <div style="background: #f8f9f8; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 0; font-weight: bold; color: #333;">Assigned Clinician: Dr. ${clinicianName}</p>
        </div>
        <p style="font-size: 16px; color: #555;">You can now communicate with your clinician through the messaging system in your dashboard.</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${baseUrl}/patient/messages" style="background-color: #28a745; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">Go to Messages</a>
        </div>
        <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
        <p style="font-size: 12px; color: #999; text-align: center;">CDSS - Clinical Decision Support System</p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Error sending patient assignment email:', error);
  }
};
