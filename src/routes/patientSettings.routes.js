/**
 * Patient Settings Routes
 * Note: These are implemented as Next.js API Routes in src/app/api/patient/settings
 * This file serves as the definition for those routes.
 */

// Implementation is handled by:
// GET  /api/patient/settings          -> src/app/api/patient/settings/route.js
// PUT  /api/patient/settings          -> src/app/api/patient/settings/route.js
// PUT  /api/patient/settings/password -> src/app/api/patient/settings/password/route.js

/**
 * For an Express-based environment, the definitions would look like:
 *
 * router.get('/', authMiddleware, roleCheck('PATIENT'), controller.getSettings);
 * router.put('/', authMiddleware, roleCheck('PATIENT'), controller.updateSettings);
 * router.put('/password', authMiddleware, roleCheck('PATIENT'), controller.updatePassword);
 */

export const settingsRoutes = {
  GET_SETTINGS: '/api/patient/settings',
  UPDATE_SETTINGS: '/api/patient/settings',
  UPDATE_PASSWORD: '/api/patient/settings/password',
};
