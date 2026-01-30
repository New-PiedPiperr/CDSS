import User from '@/models/User';
import UserSession from '@/models/UserSession';
import bcrypt from 'bcryptjs';
import dbConnect from '@/lib/db/connect';

/**
 * Controller for Patient Settings
 */
export const PatientSettingsController = {
  /**
   * Get settings for the current user
   * @param {string} userId - The ID of the authenticated user
   */
  async getSettings(userId) {
    await dbConnect();
    const user = await User.findById(userId).select('settings').lean();
    if (!user) {
      throw { status: 404, message: 'User not found' };
    }

    // Apply defaults if settings object is missing or partially empty
    const settings = {
      profile: {
        firstName: user.settings?.profile?.firstName || '',
        lastName: user.settings?.profile?.lastName || '',
        phone: user.settings?.profile?.phone || '',
        avatarUrl: user.settings?.profile?.avatarUrl || null,
      },
      preferences: {
        language: user.settings?.preferences?.language || 'en',
        notifications: {
          email: user.settings?.preferences?.notifications?.hasOwnProperty('email')
            ? user.settings?.preferences?.notifications.email
            : true,
          sms: user.settings?.preferences?.notifications?.hasOwnProperty('sms')
            ? user.settings?.preferences?.notifications.sms
            : false,
          inApp: user.settings?.preferences?.notifications?.hasOwnProperty('inApp')
            ? user.settings?.preferences?.notifications.inApp
            : true,
        },
      },
      privacy: {
        shareDataForResearch: user.settings?.privacy?.hasOwnProperty(
          'shareDataForResearch'
        )
          ? user.settings?.privacy.shareDataForResearch
          : false,
      },
    };

    return { success: true, settings };
  },

  /**
   * Update patient settings with partial updates and deep merge
   * @param {string} userId - The ID of the authenticated user
   * @param {Object} updateData - Partial settings update object
   */
  async updateSettings(userId, updateData) {
    if (!updateData || Object.keys(updateData).length === 0) {
      throw { status: 400, message: 'Payload cannot be empty' };
    }

    await dbConnect();
    const user = await User.findById(userId);
    if (!user) {
      throw { status: 404, message: 'User not found' };
    }

    // Initialize settings if not exists
    if (!user.settings) {
      user.settings = {
        profile: {},
        preferences: { notifications: {} },
        privacy: {},
      };
    }

    // Validate and Apply Profile Updates
    if (updateData.profile) {
      const { firstName, lastName, phone, avatarUrl } = updateData.profile;
      if (firstName !== undefined)
        user.settings.profile.firstName = String(firstName).trim();
      if (lastName !== undefined)
        user.settings.profile.lastName = String(lastName).trim();
      if (phone !== undefined) {
        // Loose phone validation (digits, +, -, spaces)
        if (phone && !/^[+0-9\s-]{7,20}$/.test(phone)) {
          throw { status: 400, message: 'Invalid phone number format' };
        }
        user.settings.profile.phone = String(phone).trim();
      }
      if (avatarUrl !== undefined) user.settings.profile.avatarUrl = avatarUrl;
    }

    // Validate and Apply Preferences
    if (updateData.preferences) {
      const { language, notifications } = updateData.preferences;

      if (language !== undefined) {
        const allowedLanguages = ['en', 'fr', 'es'];
        if (!allowedLanguages.includes(language)) {
          throw { status: 400, message: 'Language must be one of: en, fr, es' };
        }
        user.settings.preferences.language = language;
      }

      if (notifications) {
        const { email, sms, inApp } = notifications;
        if (email !== undefined) {
          if (typeof email !== 'boolean')
            throw { status: 400, message: 'Email notification must be a boolean' };
          user.settings.preferences.notifications.email = email;
        }
        if (sms !== undefined) {
          if (typeof sms !== 'boolean')
            throw { status: 400, message: 'SMS notification must be a boolean' };
          user.settings.preferences.notifications.sms = sms;
        }
        if (inApp !== undefined) {
          if (typeof inApp !== 'boolean')
            throw { status: 400, message: 'In-app notification must be a boolean' };
          user.settings.preferences.notifications.inApp = inApp;
        }
      }
    }

    // Validate and Apply Privacy
    if (updateData.privacy) {
      const { shareDataForResearch } = updateData.privacy;
      if (shareDataForResearch !== undefined) {
        if (typeof shareDataForResearch !== 'boolean') {
          throw { status: 400, message: 'Privacy setting must be a boolean' };
        }
        user.settings.privacy.shareDataForResearch = shareDataForResearch;
      }
    }

    // Security: Check for unknown fields in payload
    const allowedTopFields = ['profile', 'preferences', 'privacy'];
    const unknownTopFields = Object.keys(updateData).filter(
      (key) => !allowedTopFields.includes(key)
    );
    if (unknownTopFields.length > 0) {
      throw {
        status: 400,
        message: `Unknown keys rejected: ${unknownTopFields.join(', ')}`,
      };
    }

    if (updateData.profile) {
      const allowedProfileFields = ['firstName', 'lastName', 'phone', 'avatarUrl'];
      const unknownProfileFields = Object.keys(updateData.profile).filter(
        (key) => !allowedProfileFields.includes(key)
      );
      if (unknownProfileFields.length > 0) {
        throw {
          status: 400,
          message: `Unknown profile fields: ${unknownProfileFields.join(', ')}`,
        };
      }
    }

    if (updateData.preferences) {
      const allowedPrefFields = ['language', 'notifications'];
      const unknownPrefFields = Object.keys(updateData.preferences).filter(
        (key) => !allowedPrefFields.includes(key)
      );
      if (unknownPrefFields.length > 0) {
        throw {
          status: 400,
          message: `Unknown preference fields: ${unknownPrefFields.join(', ')}`,
        };
      }

      if (updateData.preferences.notifications) {
        const allowedNotifFields = ['email', 'sms', 'inApp'];
        const unknownNotifFields = Object.keys(
          updateData.preferences.notifications
        ).filter((key) => !allowedNotifFields.includes(key));
        if (unknownNotifFields.length > 0) {
          throw {
            status: 400,
            message: `Unknown notification fields: ${unknownNotifFields.join(', ')}`,
          };
        }
      }
    }

    if (updateData.privacy) {
      const allowedPrivacyFields = ['shareDataForResearch'];
      const unknownPrivacyFields = Object.keys(updateData.privacy).filter(
        (key) => !allowedPrivacyFields.includes(key)
      );
      if (unknownPrivacyFields.length > 0) {
        throw {
          status: 400,
          message: `Unknown privacy fields: ${unknownPrivacyFields.join(', ')}`,
        };
      }
    }

    await user.save();
    return {
      success: true,
      message: 'Settings updated successfully',
      settings: user.settings,
    };
  },

  /**
   * Update User Password
   * @param {string} userId - The ID of the authenticated user
   * @param {string} currentPassword - Current password for verification
   * @param {string} newPassword - New password to set
   */
  async updatePassword(userId, currentPassword, newPassword) {
    if (!currentPassword || !newPassword) {
      throw { status: 400, message: 'Current and new password are required' };
    }

    if (newPassword.length < 8) {
      throw { status: 400, message: 'New password must be at least 8 characters' };
    }

    await dbConnect();
    const user = await User.findById(userId).select('+password');
    if (!user) {
      throw { status: 404, message: 'User not found' };
    }

    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      throw { status: 401, message: 'Incorrect current password' };
    }

    // Hash and save new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    // Invalidate existing sessions
    await UserSession.deleteMany({ user: userId });

    return {
      success: true,
      message: 'Password updated successfully. Please log in again if required.',
    };
  },
};
