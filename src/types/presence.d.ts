export type UserStatus = 'ONLINE' | 'OFFLINE';

export interface PresenceData {
  lastSeenAt: Date | null;
  status: UserStatus;
  lastSeenText: string;
}

export interface PresenceResponse {
  data: PresenceData;
}
