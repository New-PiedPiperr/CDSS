import { z } from 'zod';

export const systemSettingsSchema = z.object({
  platformName: z.string().min(3, 'Platform name must be at least 3 characters'),
  allowClinicianSignup: z.boolean(),
  allowPatientSignup: z.boolean(),
  maintenanceMode: z.boolean(),
});

export const securitySettingsSchema = z.object({
  enforceAdmin2FA: z.boolean(),
  sessionTimeoutMinutes: z.number().min(5).max(1440),
  passwordPolicy: z.object({
    minLength: z.number().min(8).max(32),
    requireSpecialChar: z.boolean(),
  }),
});

export const adminProfileSchema = z.object({
  firstName: z.string().min(2, 'First name is required'),
  lastName: z.string().min(2, 'Last name is required'),
  phone: z.string().nullable().optional(),
});
