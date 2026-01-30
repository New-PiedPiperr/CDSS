import { AuditLog } from '@/models';

export async function logAudit({ adminId, action, targetUserId = null, metadata = {} }) {
  try {
    await AuditLog.create({
      adminId,
      action,
      targetUserId,
      metadata,
    });
  } catch (error) {
    console.error('Failed to log audit:', error);
    // We don't throw here to avoid failing the main request if logging fails,
    // though in a critical system we might want to.
  }
}
