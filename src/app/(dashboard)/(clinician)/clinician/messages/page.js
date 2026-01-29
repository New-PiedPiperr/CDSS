import React from 'react';
import MessagingClient from '@/components/dashboard/MessagingClient';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { getAssignedPatients } from '@/lib/actions/messages';
import connectDB from '@/lib/db/connect';
import { Message, User } from '@/models';

export const dynamic = 'force-dynamic';

export default async function ClinicianMessagesPage() {
  const session = await auth();
  if (!session || !session.user) {
    redirect('/login');
  }

  await connectDB();

  const patients = await getAssignedPatients();

  const initialConversations = await Promise.all(
    patients.map(async (patient) => {
      const conversationId = [session.user.id, patient._id].sort().join('_');
      const lastMsg = await Message.findOne({
        conversationId,
        deletedBy: { $ne: session.user.id },
      })
        .sort({ createdAt: -1 })
        .lean();

      const unreadCount = await Message.countDocuments({
        conversationId,
        receiverId: session.user.id,
        isRead: false,
        deletedBy: { $ne: session.user.id },
      });

      return {
        id: patient._id,
        otherUser: {
          id: patient._id,
          name: `${patient.firstName} ${patient.lastName}`,
          avatar: patient.avatar || null,
          online: false,
          sessionId: patient.sessionId,
          role: 'PATIENT',
        },
        lastMessage: lastMsg ? lastMsg.content : 'No messages yet',
        unreadCount: unreadCount,
        lastMessageTime: lastMsg ? formatTimeAgo(lastMsg.createdAt) : '',
      };
    })
  );

  // Also include any conversations with admins (support messages)
  const allMessages = await Message.find({
    $or: [{ senderId: session.user.id }, { receiverId: session.user.id }],
    deletedBy: { $ne: session.user.id },
  })
    .sort({ createdAt: -1 })
    .lean();

  // Find unique admin users from messages
  const patientIds = new Set(patients.map((p) => p._id.toString()));
  const adminUserIds = new Set();

  for (const msg of allMessages) {
    const otherUserId =
      msg.senderId.toString() === session.user.id
        ? msg.receiverId.toString()
        : msg.senderId.toString();
    if (!patientIds.has(otherUserId)) {
      adminUserIds.add(otherUserId);
    }
  }

  // Fetch admin users
  if (adminUserIds.size > 0) {
    const admins = await User.find({
      _id: { $in: Array.from(adminUserIds) },
      role: { $in: ['ADMIN', 'SUPER_ADMIN'] },
    })
      .select('firstName lastName avatar role lastSeenAt lastLogin')
      .lean();

    for (const admin of admins) {
      const conversationId = [session.user.id, admin._id.toString()].sort().join('_');
      const lastMsg = allMessages.find((m) => {
        const cid = [m.senderId.toString(), m.receiverId.toString()].sort().join('_');
        return cid === conversationId;
      });

      const unreadCount = await Message.countDocuments({
        conversationId,
        receiverId: session.user.id,
        isRead: false,
        deletedBy: { $ne: session.user.id },
      });

      const lastActive = admin.lastSeenAt || admin.lastLogin;
      const isOnline =
        lastActive && Date.now() - new Date(lastActive).getTime() < 2 * 60 * 1000;

      initialConversations.push({
        id: admin._id.toString(),
        otherUser: {
          id: admin._id.toString(),
          name: `${admin.firstName} ${admin.lastName}`,
          avatar: admin.avatar || null,
          online: isOnline,
          role: 'ADMIN',
        },
        lastMessage: lastMsg ? lastMsg.content : 'Platform Support',
        unreadCount: unreadCount,
        lastMessageTime: lastMsg ? formatTimeAgo(lastMsg.createdAt) : '',
      });
    }
  }

  return (
    <div className="mx-auto max-w-6xl">
      <MessagingClient
        initialConversations={initialConversations}
        currentUser={{
          id: session.user.id,
          name: `${session.user.firstName} ${session.user.lastName}`,
          role: session.user.role,
          avatar: session.user.avatar || session.user.image,
        }}
      />
    </div>
  );
}

function formatTimeAgo(date) {
  const now = new Date();
  const diff = now - new Date(date);
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days === 1) return 'Yesterday';
  return `${days}d ago`;
}
