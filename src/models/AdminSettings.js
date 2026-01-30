import mongoose from 'mongoose';

const adminSettingsSchema = new mongoose.Schema(
  {
    system: {
      platformName: { type: String, default: 'CDSS Platform' },
      allowClinicianSignup: { type: Boolean, default: true },
      allowPatientSignup: { type: Boolean, default: true },
      maintenanceMode: { type: Boolean, default: false },
    },
    security: {
      enforceAdmin2FA: { type: Boolean, default: false },
      sessionTimeoutMinutes: { type: Number, default: 60 },
      passwordPolicy: {
        minLength: { type: Number, default: 8 },
        requireSpecialChar: { type: Boolean, default: true },
      },
    },
  },
  { timestamps: true }
);

// Ensure only one settings document exists
adminSettingsSchema.statics.getSettings = async function () {
  let settings = await this.findOne();
  if (!settings) {
    settings = await this.create({});
  }
  return settings;
};

const AdminSettings =
  mongoose.models.AdminSettings || mongoose.model('AdminSettings', adminSettingsSchema);

export default AdminSettings;
