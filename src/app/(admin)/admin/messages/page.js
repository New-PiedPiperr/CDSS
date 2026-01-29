import connectDB from '@/lib/db/connect';
import { Message, User } from '@/models';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import MessagingClient from '@/components/dashboard/MessagingClient';

export const dynamic = 'force-dynamic';

export default async function AdminMessagesPage() {
  const session = await auth();
  if (!session || !session.user) redirect('/login');

  await connectDB();
  const adminId = session.user.id;

  // Get all users except admins for the admin to message
  const allUsers = await User.find({
    role: { $in: ['PATIENT', 'CLINICIAN'] },
    _id: { $ne: adminId },
  })
    .select('firstName lastName email avatar lastLogin lastSeenAt role')
    .sort({ lastLogin: -1 })
    .lean();

  // Get recent messages involving admin
  const recentMessages = await Message.find({
    $or: [{ senderId: adminId }, { receiverId: adminId }],
  })
    .sort({ createdAt: -1 })
    .lean();

  // Build conversation list with all users, prioritizing those with existing conversations
  const conversationsMap = new Map();

  // First, add users who have existing conversations with admin
  for (const msg of recentMessages) {
    const otherUserId =
      msg.senderId.toString() === adminId
        ? msg.receiverId.toString()
        : msg.senderId.toString();

    if (!conversationsMap.has(otherUserId)) {
      const user = allUsers.find((u) => u._id.toString() === otherUserId);
      if (user) {
        const lastActive = user.lastSeenAt || user.lastLogin;
        const isOnline =
          lastActive && Date.now() - new Date(lastActive).getTime() < 2 * 60 * 1000;

        conversationsMap.set(otherUserId, {
          id: user._id.toString(),
          otherUser: {
            id: user._id.toString(),
            name: `${user.firstName} ${user.lastName}`,
            avatar: user.avatar,
            online: isOnline,
            role: user.role,
          },
          lastMessage: msg.content,
          lastMessageTime: new Date(msg.createdAt).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          }),
          hasConversation: true,
        });
      }
    }
  }

  // Then add remaining users without conversations
  for (const user of allUsers) {
    const oderId = user._id.toString();
    if (!conversationsMap.has(oderId)) {
      const lastActive = user.lastSeenAt || user.lastLogin;
      const isOnline =
        lastActive && Date.now() - new Date(lastActive).getTime() < 2 * 60 * 1000;

      conversationsMap.set(oderId, {
        id: user._id.toString(),
        otherUser: {
          id: user._id.toString(),
          name: `${user.firstName} ${user.lastName}`,
          avatar: user.avatar,
          online: isOnline,
          role: user.role,
        },
        lastMessage: 'Start a conversation',
        lastMessageTime: '',
        hasConversation: false,
      });
    }
  }

  // Convert to array and sort: conversations first, then by name
  const initialConversations = Array.from(conversationsMap.values()).sort((a, b) => {
    if (a.hasConversation && !b.hasConversation) return -1;
    if (!a.hasConversation && b.hasConversation) return 1;
    return a.otherUser.name.localeCompare(b.otherUser.name);
  });

  return (
    <div className="space-y-6">
      <header className="px-2">
        <h1 className="text-foreground text-3xl font-bold tracking-tight uppercase">
          Platform Support Messages
        </h1>
        <p className="text-muted-foreground font-medium">
          Send messages to any user on the platform. Messages will appear in their inbox.
        </p>
      </header>

      <MessagingClient
        currentUser={{ id: session.user.id, name: 'System Admin', role: 'ADMIN' }}
        initialConversations={initialConversations}
        isAdmin={true}
      />
    </div>
  );
}
