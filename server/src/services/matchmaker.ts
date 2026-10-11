/**
 * Matchmaker service — maintains a queue of waiting users and pairs them.
 * Phase 1 uses in-memory queue; Phase 4 will use Redis.
 * 
 * Supports optional interest-based matching: users with shared interests
 * get paired preferentially, falling back to random after a timeout.
 */
import { v4 as uuidv4 } from 'uuid';

export interface QueueEntry {
  socketId: string;
  fingerprint: string;
  interests: string[];
  joinedAt: number;
  isPremium: boolean;
  mode?: 'text' | 'video';
  userGender?: 'girl' | 'guy';
  filterGender?: 'anyone' | 'girl' | 'guy';
}

export interface ChatRoom {
  roomId: string;
  user1: string; // socketId (initiator)
  user2: string; // socketId
  createdAt: number;
  mode: 'text' | 'video';
}

// The waiting queue
const queue: QueueEntry[] = [];

// Active chat rooms
const rooms: Map<string, ChatRoom> = new Map();

// Map socketId → roomId for quick lookups
const socketToRoom: Map<string, string> = new Map();

// Track online user count
let onlineCount = 0;

export function incrementOnline(): number {
  return ++onlineCount;
}

export function decrementOnline(): number {
  return Math.max(0, --onlineCount);
}

export function getOnlineCount(): number {
  return onlineCount;
}

/**
 * Add a user to the matchmaking queue.
 * Returns a matched pair if one is found, or null if the user must wait.
 */
export function addToQueue(entry: QueueEntry): { match: QueueEntry | null; roomId: string | null } {
  const mode = entry.mode || 'text';
  const filterGender = entry.filterGender || 'anyone';

  // Don't add if already in queue
  const existing = queue.findIndex((e) => e.socketId === entry.socketId);
  if (existing !== -1) {
    queue.splice(existing, 1);
  }

  // Helper function to check gender compatibility
  const isGenderCompatible = (peer: QueueEntry) => {
    // If this user wants a specific gender:
    if (filterGender === 'girl' && peer.userGender !== 'girl') return false;
    if (filterGender === 'guy' && peer.userGender !== 'guy') return false;
    // If peer wants a specific gender:
    if (peer.filterGender === 'girl' && entry.userGender !== 'girl') return false;
    if (peer.filterGender === 'guy' && entry.userGender !== 'guy') return false;
    return true;
  };

  // 1. Try to find a match with shared interests, matching mode, and gender compatibility
  if (entry.interests.length > 0) {
    const matchIndex = queue.findIndex((e) => {
      if (e.fingerprint === entry.fingerprint) return false;
      const peerMode = e.mode || 'text';
      if (peerMode !== mode) return false;
      if (!isGenderCompatible(e)) return false;
      return e.interests.some((i) => entry.interests.includes(i.toLowerCase()));
    });

    if (matchIndex !== -1) {
      const match = queue.splice(matchIndex, 1)[0];
      const roomId = uuidv4();
      const room: ChatRoom = {
        roomId,
        user1: match.socketId,
        user2: entry.socketId,
        createdAt: Date.now(),
        mode,
      };
      rooms.set(roomId, room);
      socketToRoom.set(match.socketId, roomId);
      socketToRoom.set(entry.socketId, roomId);
      return { match, roomId };
    }
  }

  // 2. Try to find a match with matching mode and gender compatibility
  const genderMatchIndex = queue.findIndex((e) => {
    if (e.fingerprint === entry.fingerprint) return false;
    const peerMode = e.mode || 'text';
    if (peerMode !== mode) return false;
    return isGenderCompatible(e);
  });

  if (genderMatchIndex !== -1) {
    const match = queue.splice(genderMatchIndex, 1)[0];
    const roomId = uuidv4();
    const room: ChatRoom = {
      roomId,
      user1: match.socketId,
      user2: entry.socketId,
      createdAt: Date.now(),
      mode,
    };
    rooms.set(roomId, room);
    socketToRoom.set(match.socketId, roomId);
    socketToRoom.set(entry.socketId, roomId);
    return { match, roomId };
  }

  // 3. If no strict gender match and user didn't require strict filter, fallback to any peer in the same mode
  if (filterGender === 'anyone') {
    const fallbackIndex = queue.findIndex((e) => {
      if (e.fingerprint === entry.fingerprint) return false;
      const peerMode = e.mode || 'text';
      if (peerMode !== mode) return false;
      // Peer must not require female-only if current user is not female
      if (e.filterGender === 'girl' && entry.userGender !== 'girl') return false;
      if (e.filterGender === 'guy' && entry.userGender !== 'guy') return false;
      return true;
    });

    if (fallbackIndex !== -1) {
      const match = queue.splice(fallbackIndex, 1)[0];
      const roomId = uuidv4();
      const room: ChatRoom = {
        roomId,
        user1: match.socketId,
        user2: entry.socketId,
        createdAt: Date.now(),
        mode,
      };
      rooms.set(roomId, room);
      socketToRoom.set(match.socketId, roomId);
      socketToRoom.set(entry.socketId, roomId);
      return { match, roomId };
    }
  }

  // No match found — add to queue
  queue.push({ ...entry, mode });
  return { match: null, roomId: null };
}

/** Remove a user from the queue (e.g., on disconnect) */
export function removeFromQueue(socketId: string): void {
  const index = queue.findIndex((e) => e.socketId === socketId);
  if (index !== -1) {
    queue.splice(index, 1);
  }
}

/** Get the room a socket is in */
export function getRoomForSocket(socketId: string): ChatRoom | null {
  const roomId = socketToRoom.get(socketId);
  if (!roomId) return null;
  return rooms.get(roomId) || null;
}

/** Get the partner's socketId in a room */
export function getPartnerSocketId(socketId: string): string | null {
  const room = getRoomForSocket(socketId);
  if (!room) return null;
  return room.user1 === socketId ? room.user2 : room.user1;
}

/** Remove a room (when a user disconnects or skips) */
export function removeRoom(socketId: string): { partnerId: string | null; roomId: string | null } {
  const roomId = socketToRoom.get(socketId);
  if (!roomId) return { partnerId: null, roomId: null };
  
  const room = rooms.get(roomId);
  if (!room) return { partnerId: null, roomId: null };

  const partnerId = room.user1 === socketId ? room.user2 : room.user1;
  
  socketToRoom.delete(room.user1);
  socketToRoom.delete(room.user2);
  rooms.delete(roomId);

  return { partnerId, roomId };
}

/** Get queue size (for debugging / admin) */
export function getQueueSize(): number {
  return queue.length;
}
