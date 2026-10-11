/**
 * Socket.IO event handlers for chat and matchmaking.
 * All real-time logic flows through here.
 */
import { Server, Socket } from 'socket.io';
import {
  addToQueue,
  removeFromQueue,
  removeRoom,
  getPartnerSocketId,
  getRoomForSocket,
  incrementOnline,
  decrementOnline,
  getOnlineCount,
  getQueueSize,
} from '../services/matchmaker';
import {
  sanitizeInput,
  containsProfanity,
  cleanText,
  isSpam,
  isBanned,
  addReport,
} from '../services/moderation';
import { env } from '../config/env';

// Per-socket rate limiting for chat messages
const messageCounts: Map<string, { count: number; resetAt: number }> = new Map();

function checkChatRateLimit(socketId: string): boolean {
  const now = Date.now();
  const entry = messageCounts.get(socketId);

  if (!entry || now > entry.resetAt) {
    messageCounts.set(socketId, {
      count: 1,
      resetAt: now + env.CHAT_RATE_LIMIT_WINDOW_MS,
    });
    return true;
  }

  entry.count++;
  if (entry.count > env.CHAT_RATE_LIMIT_MAX) {
    return false; // Rate limited
  }
  return true;
}

// Track skip counts per socket for interstitial ads
const skipCounts: Map<string, number> = new Map();

export function setupSocketHandlers(io: Server): void {
  // Broadcast online count every 5 seconds
  setInterval(() => {
    io.emit('online-count', getOnlineCount());
  }, 5000);

  io.on('connection', (socket: Socket) => {
    const count = incrementOnline();
    console.log(`[Socket] Connected: ${socket.id} | Online: ${count}`);

    // Send initial online count to the connected client
    socket.emit('online-count', count);

    // ---- Fingerprint registration ----
    let fingerprint: string = socket.handshake.query.fingerprint as string || socket.id;

    socket.on('register', (data: { fingerprint: string }) => {
      fingerprint = data.fingerprint || socket.id;

      // Check if banned
      if (isBanned(fingerprint)) {
        socket.emit('banned', { message: 'You have been temporarily banned due to multiple reports.' });
        socket.disconnect(true);
        return;
      }
    });

    // ---- Matchmaking ----
    socket.on('find-match', (data: {
      interests?: string[];
      mode?: 'text' | 'video';
      userGender?: 'girl' | 'guy';
      filterGender?: 'anyone' | 'girl' | 'guy';
    }) => {
      if (isBanned(fingerprint)) {
        socket.emit('banned', { message: 'You are currently banned.' });
        return;
      }

      const interests = (data.interests || []).map((i: string) => i.toLowerCase().trim()).filter(Boolean);
      const mode = data.mode === 'video' ? 'video' : 'text';
      const userGender = data.userGender;
      const filterGender = data.filterGender || 'anyone';

      socket.emit('searching');

      const result = addToQueue({
        socketId: socket.id,
        fingerprint,
        interests,
        joinedAt: Date.now(),
        isPremium: filterGender !== 'anyone',
        mode,
        userGender,
        filterGender,
      });

      if (result.match && result.roomId) {
        // Join both sockets to the room
        socket.join(result.roomId);
        const partnerSocket = io.sockets.sockets.get(result.match.socketId);
        if (partnerSocket) {
          partnerSocket.join(result.roomId);

          // Calculate shared interests
          const sharedInterests = interests.filter((i: string) =>
            result.match!.interests.map(t => t.toLowerCase()).includes(i)
          );

          // User who was in queue first is designated as WebRTC offer initiator
          partnerSocket.emit('matched', {
            roomId: result.roomId,
            sharedInterests,
            mode,
            isInitiator: true,
            partnerGender: userGender,
          });
          socket.emit('matched', {
            roomId: result.roomId,
            sharedInterests,
            mode,
            isInitiator: false,
            partnerGender: result.match.userGender,
          });
        }
      }
      // If no match, user stays in queue — 'searching' state continues
    });

    // ---- WebRTC Signaling (Video Chat) ----
    socket.on('webrtc-offer', (data: { offer: any }) => {
      const partnerId = getPartnerSocketId(socket.id);
      if (partnerId) {
        const partnerSocket = io.sockets.sockets.get(partnerId);
        if (partnerSocket) {
          partnerSocket.emit('webrtc-offer', { offer: data.offer });
        }
      }
    });

    socket.on('webrtc-answer', (data: { answer: any }) => {
      const partnerId = getPartnerSocketId(socket.id);
      if (partnerId) {
        const partnerSocket = io.sockets.sockets.get(partnerId);
        if (partnerSocket) {
          partnerSocket.emit('webrtc-answer', { answer: data.answer });
        }
      }
    });

    socket.on('webrtc-ice-candidate', (data: { candidate: any }) => {
      const partnerId = getPartnerSocketId(socket.id);
      if (partnerId) {
        const partnerSocket = io.sockets.sockets.get(partnerId);
        if (partnerSocket) {
          partnerSocket.emit('webrtc-ice-candidate', { candidate: data.candidate });
        }
      }
    });

    socket.on('webrtc-media-state', (data: { videoEnabled?: boolean; audioEnabled?: boolean }) => {
      const partnerId = getPartnerSocketId(socket.id);
      if (partnerId) {
        const partnerSocket = io.sockets.sockets.get(partnerId);
        if (partnerSocket) {
          partnerSocket.emit('webrtc-partner-media-state', data);
        }
      }
    });

    // ---- Chat messages ----
    socket.on('send-message', (data: { message: string }) => {
      // Rate limit check
      if (!checkChatRateLimit(socket.id)) {
        socket.emit('rate-limited', {
          message: 'You are sending messages too fast. Please slow down.',
        });
        return;
      }

      const room = getRoomForSocket(socket.id);
      if (!room) {
        socket.emit('error-msg', { message: 'You are not in a chat.' });
        return;
      }

      // Sanitize and filter
      let message = sanitizeInput(data.message);
      if (!message) return;

      const flagged = containsProfanity(message) || isSpam(message);
      if (flagged) {
        message = cleanText(message);
      }

      const partnerId = getPartnerSocketId(socket.id);
      if (partnerId) {
        const partnerSocket = io.sockets.sockets.get(partnerId);
        if (partnerSocket) {
          partnerSocket.emit('receive-message', {
            message,
            timestamp: Date.now(),
            flagged,
          });
        }
      }

      // Confirm to sender
      socket.emit('message-sent', {
        message,
        timestamp: Date.now(),
        flagged,
      });
    });

    // ---- Typing indicator ----
    socket.on('typing', (data: { isTyping: boolean }) => {
      const partnerId = getPartnerSocketId(socket.id);
      if (partnerId) {
        const partnerSocket = io.sockets.sockets.get(partnerId);
        if (partnerSocket) {
          partnerSocket.emit('partner-typing', { isTyping: data.isTyping });
        }
      }
    });

    // ---- Skip / Next ----
    socket.on('skip', () => {
      const { partnerId } = removeRoom(socket.id);

      // Track skip count for interstitial ads
      const currentSkips = (skipCounts.get(socket.id) || 0) + 1;
      skipCounts.set(socket.id, currentSkips);

      // Notify the skipped partner
      if (partnerId) {
        const partnerSocket = io.sockets.sockets.get(partnerId);
        if (partnerSocket) {
          partnerSocket.emit('partner-disconnected', { reason: 'skipped' });
        }
      }

      // Tell the skipper whether to show interstitial
      const showInterstitial = currentSkips % env.AD_INTERSTITIAL_SKIP_COUNT === 0;
      socket.emit('skipped', { showInterstitial });
    });

    // ---- Report ----
    socket.on('report', (data: { reason: string }) => {
      const partnerId = getPartnerSocketId(socket.id);
      if (!partnerId) {
        socket.emit('error-msg', { message: 'No user to report.' });
        return;
      }

      // We need the partner's fingerprint — look it up from the socket
      // For Phase 1 we use socketId as a fingerprint proxy
      const partnerFingerprint = partnerId; // Simplified for Phase 1

      const result = addReport(
        partnerFingerprint,
        fingerprint,
        data.reason,
        env.REPORTS_BEFORE_BAN,
        env.BAN_DURATION_HOURS
      );

      socket.emit('report-submitted', { message: 'Report submitted. Thank you.' });

      if (result.banned) {
        const partnerSocket = io.sockets.sockets.get(partnerId);
        if (partnerSocket) {
          partnerSocket.emit('banned', {
            message: 'You have been temporarily banned due to multiple reports.',
          });
          partnerSocket.disconnect(true);
        }
      }

      // Auto-skip after reporting
      const { } = removeRoom(socket.id);
      if (partnerId) {
        const partnerSocket = io.sockets.sockets.get(partnerId);
        if (partnerSocket) {
          partnerSocket.emit('partner-disconnected', { reason: 'reported' });
        }
      }
    });

    // ---- Disconnect ----
    socket.on('disconnect', () => {
      const newCount = decrementOnline();
      console.log(`[Socket] Disconnected: ${socket.id} | Online: ${newCount}`);

      // Remove from queue
      removeFromQueue(socket.id);

      // Notify partner and clean up room
      const { partnerId } = removeRoom(socket.id);
      if (partnerId) {
        const partnerSocket = io.sockets.sockets.get(partnerId);
        if (partnerSocket) {
          partnerSocket.emit('partner-disconnected', { reason: 'disconnected' });
        }
      }

      // Clean up rate limiting and skip counts
      messageCounts.delete(socket.id);
      skipCounts.delete(socket.id);
    });
  });
}
