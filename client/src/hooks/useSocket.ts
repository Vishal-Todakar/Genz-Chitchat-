/**
 * useSocket hook — manages Socket.IO connection lifecycle
 * and syncs events with Zustand stores.
 */
import { useEffect, useCallback, useRef } from 'react';
import { getSocket, connectSocket, disconnectSocket } from '../lib/socket';
import { generateFingerprint } from '../lib/fingerprint';
import { useChatStore } from '../store/chatStore';
import { useUIStore } from '../store/uiStore';

export function useSocket() {
  const fingerprint = useRef(generateFingerprint());
  const {
    setStatus,
    addMessage,
    setPartnerTyping,
    setRoomId,
    setSharedInterests,
    setOnlineCount,
    setRateLimited,
    clearMessages,
  } = useChatStore();
  const { setShowInterstitialAd } = useUIStore();

  useEffect(() => {
    const socket = connectSocket(fingerprint.current);

    socket.on('online-count', (count: number) => {
      setOnlineCount(count);
    });

    socket.on('searching', () => {
      setStatus('searching');
    });

    socket.on('matched', (data: {
      roomId: string;
      sharedInterests: string[];
      mode?: 'text' | 'video';
      isInitiator?: boolean;
      partnerGender?: 'girl' | 'guy';
    }) => {
      setStatus('connected');
      setRoomId(data.roomId);
      setSharedInterests(data.sharedInterests || []);
      if (data.mode) {
        useChatStore.getState().setChatMode(data.mode);
      }
      useChatStore.getState().setIsInitiator(Boolean(data.isInitiator));
      useChatStore.getState().setPartnerGender(data.partnerGender || null);
      clearMessages();
    });

    socket.on('receive-message', (data: { message: string; timestamp: number; flagged: boolean }) => {
      addMessage({
        id: `stranger_${Date.now()}_${Math.random()}`,
        text: data.message,
        sender: 'stranger',
        timestamp: data.timestamp,
        flagged: data.flagged,
      });
      setPartnerTyping(false);
    });

    socket.on('message-sent', (data: { message: string; timestamp: number; flagged: boolean }) => {
      addMessage({
        id: `me_${Date.now()}_${Math.random()}`,
        text: data.message,
        sender: 'me',
        timestamp: data.timestamp,
        flagged: data.flagged,
      });
    });

    socket.on('partner-typing', (data: { isTyping: boolean }) => {
      setPartnerTyping(data.isTyping);
    });

    socket.on('partner-disconnected', () => {
      setStatus('disconnected');
      setPartnerTyping(false);
    });

    socket.on('skipped', (data: { showInterstitial: boolean }) => {
      setStatus('idle');
      clearMessages();
      setPartnerTyping(false);
      if (data.showInterstitial) {
        setShowInterstitialAd(true);
      }
    });

    socket.on('rate-limited', () => {
      setRateLimited(true);
      setTimeout(() => setRateLimited(false), 3000);
    });

    socket.on('banned', () => {
      setStatus('banned');
    });

    socket.on('report-submitted', () => {
      // Could show a toast notification here
    });

    socket.on('disconnect', () => {
      // Socket disconnected (network issue)
    });

    socket.on('connect', () => {
      socket.emit('register', { fingerprint: fingerprint.current });
    });

    return () => {
      socket.off('online-count');
      socket.off('searching');
      socket.off('matched');
      socket.off('receive-message');
      socket.off('message-sent');
      socket.off('partner-typing');
      socket.off('partner-disconnected');
      socket.off('skipped');
      socket.off('rate-limited');
      socket.off('banned');
      socket.off('report-submitted');
      socket.off('disconnect');
      socket.off('connect');
    };
  }, []);

  const findMatch = useCallback((
    interests: string[],
    mode?: 'text' | 'video',
    userGender?: 'girl' | 'guy',
    filterGender?: 'anyone' | 'girl' | 'guy'
  ) => {
    const socket = getSocket();
    const effectiveMode = mode || useChatStore.getState().chatMode || 'text';
    const effectiveUserGender = userGender || useUIStore.getState().userGender || undefined;
    const effectiveFilterGender = filterGender || useUIStore.getState().filterGender || 'anyone';

    socket.emit('find-match', {
      interests,
      mode: effectiveMode,
      userGender: effectiveUserGender,
      filterGender: effectiveFilterGender,
    });
  }, []);

  const sendMessage = useCallback((message: string) => {
    const socket = getSocket();
    socket.emit('send-message', { message });
  }, []);

  const sendTyping = useCallback((isTyping: boolean) => {
    const socket = getSocket();
    socket.emit('typing', { isTyping });
  }, []);

  const skip = useCallback(() => {
    const socket = getSocket();
    socket.emit('skip');
  }, []);

  const report = useCallback((reason: string) => {
    const socket = getSocket();
    socket.emit('report', { reason });
  }, []);

  const sendWebRtcOffer = useCallback((offer: RTCSessionDescriptionInit) => {
    const socket = getSocket();
    socket.emit('webrtc-offer', { offer });
  }, []);

  const sendWebRtcAnswer = useCallback((answer: RTCSessionDescriptionInit) => {
    const socket = getSocket();
    socket.emit('webrtc-answer', { answer });
  }, []);

  const sendWebRtcIceCandidate = useCallback((candidate: RTCIceCandidateInit) => {
    const socket = getSocket();
    socket.emit('webrtc-ice-candidate', { candidate });
  }, []);

  const sendWebRtcMediaState = useCallback((state: { videoEnabled?: boolean; audioEnabled?: boolean }) => {
    const socket = getSocket();
    socket.emit('webrtc-media-state', state);
  }, []);

  const disconnect = useCallback(() => {
    disconnectSocket();
  }, []);

  return {
    findMatch,
    sendMessage,
    sendTyping,
    skip,
    report,
    sendWebRtcOffer,
    sendWebRtcAnswer,
    sendWebRtcIceCandidate,
    sendWebRtcMediaState,
    disconnect,
    fingerprint: fingerprint.current,
  };
}
